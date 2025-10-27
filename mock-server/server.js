import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { config } from './config/config.js';
import { pool, testConnection } from './config/database.js';
import { DeviceModel, ReadingModel, UserModel, AlertModel } from './models/index.js';
import { apiLimiter, authLimiter, readingLimiter } from './middleware/rateLimit.js';
import { authenticate, authorize } from './middleware/auth.js';
import { validate, deviceSchemas, readingSchemas, userSchemas } from './middleware/validation.js';
import { initializeMQTT } from './services/mqtt-bridge.js';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const app = express();
const PORT = config.PORT;

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// Health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'ok',
    database: dbStatus ? 'connected' : 'disconnected',
    mqtt: global.mqttConnected || false,
    timestamp: new Date().toISOString(),
  });
});

// ============ AUTHENTICATION ROUTES ============

app.post('/api/auth/register', authLimiter, validate(userSchemas.register), async (req, res) => {
  try {
    const existingUser = await UserModel.getByEmail(req.body.email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await UserModel.create(req.body);
    const token = UserModel.generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/api/auth/login', authLimiter, validate(userSchemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.verifyPassword(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = UserModel.generateToken(user);

    res.json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// ============ DEVICE ROUTES ============

app.get('/api/devices', apiLimiter, async (req, res) => {
  try {
    const devices = await DeviceModel.getAll();
    res.json(devices);
  } catch (error) {
    logger.error('Get devices error:', error);
    res.status(500).json({ error: 'Failed to read devices' });
  }
});

app.get('/api/devices/:id', apiLimiter, async (req, res) => {
  try {
    const device = await DeviceModel.getById(req.params.id);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    logger.error('Get device error:', error);
    res.status(500).json({ error: 'Failed to read device' });
  }
});

app.post('/api/devices', authenticate, validate(deviceSchemas.create), async (req, res) => {
  try {
    const { name, location, lat, lng, status, type, installDate } = req.body;
    const deviceId = `device-${Date.now()}`;
    
    const device = await DeviceModel.create({
      id: deviceId,
      name,
      location,
      lat,
      lng,
      status: status || 'active',
      type: type || 'air-quality-sensor',
      installDate,
    });
    
    res.status(201).json(device);
  } catch (error) {
    logger.error('Create device error:', error);
    res.status(500).json({ error: 'Failed to create device' });
  }
});

app.put('/api/devices/:id', authenticate, validate(deviceSchemas.update), async (req, res) => {
  try {
    const device = await DeviceModel.update(req.params.id, req.body);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json(device);
  } catch (error) {
    logger.error('Update device error:', error);
    res.status(500).json({ error: 'Failed to update device' });
  }
});

app.delete('/api/devices/:id', authenticate, authorize('admin', 'user'), async (req, res) => {
  try {
    const device = await DeviceModel.delete(req.params.id);
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json({ message: 'Device deleted' });
  } catch (error) {
    logger.error('Delete device error:', error);
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

// ============ READINGS ROUTES ============

app.get('/api/readings', apiLimiter, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const readings = await ReadingModel.getRecent(limit);
    res.json(readings);
  } catch (error) {
    logger.error('Get readings error:', error);
    res.status(500).json({ error: 'Failed to read readings' });
  }
});

app.get('/api/readings/:deviceId', apiLimiter, async (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const readings = await ReadingModel.getByDevice(req.params.deviceId, hours);
    res.json(readings);
  } catch (error) {
    logger.error('Get device readings error:', error);
    res.status(500).json({ error: 'Failed to read device readings' });
  }
});

app.post('/api/readings', readingLimiter, validate(readingSchemas.create), async (req, res) => {
  try {
    const reading = await ReadingModel.create(req.body);
    
    // Broadcast to WebSocket clients
    broadcastReading({
      type: 'reading',
      payload: reading,
    });
    
    res.status(201).json(reading);
  } catch (error) {
    logger.error('Submit reading error:', error);
    res.status(500).json({ error: 'Failed to submit reading' });
  }
});

// ============ ANALYTICS ROUTES ============

app.get('/api/analytics/stats', apiLimiter, async (req, res) => {
  try {
    const devices = await DeviceModel.getAll();
    const totalReadings = await ReadingModel.getCount();
    
    res.json({
      totalDevices: devices.length,
      activeDevices: devices.filter(d => d.status === 'active').length,
      totalReadings,
    });
  } catch (error) {
    logger.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// ============ CONTACT ROUTE ============

app.post('/api/contact', apiLimiter, async (req, res) => {
  logger.info('Contact form submission:', req.body);
  res.json({ message: 'Message received' });
});

// ============ WEBSOCKET SERVER ============

const server = createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

function broadcastReading(reading) {
  const message = JSON.stringify(reading);

  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// Make broadcastReading globally available for MQTT
global.broadcastReading = broadcastReading;

// ============ SIMULATED READINGS ============

async function generateReading(device) {
  const baseValues = {
    pm25: 15 + Math.random() * 30,
    pm10: 25 + Math.random() * 50,
    co: 0.3 + Math.random() * 1.5,
    no2: 10 + Math.random() * 40,
  };

  const hour = new Date().getHours();
  const rushHourMultiplier = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) ? 1.5 : 1;

  return {
    deviceId: device.id,
    lat: device.lat,
    lng: device.lng,
    timestamp: Date.now(),
    readings: {
      pm25: parseFloat((baseValues.pm25 * rushHourMultiplier).toFixed(1)),
      pm10: parseFloat((baseValues.pm10 * rushHourMultiplier).toFixed(1)),
      co: parseFloat((baseValues.co * rushHourMultiplier).toFixed(2)),
      no2: parseFloat((baseValues.no2 * rushHourMultiplier).toFixed(1)),
    },
  };
}

async function simulateReadings() {
  try {
    const devices = await DeviceModel.getActive();
    if (devices.length === 0) return;

    const device = devices[Math.floor(Math.random() * devices.length)];
    const reading = await generateReading(device);
    const createdReading = await ReadingModel.create(reading);

    broadcastReading({
      type: 'reading',
      payload: createdReading,
    });

    logger.info(`Generated reading for ${device.name}`);
  } catch (error) {
    logger.error('Error generating reading:', error);
  }
}

// ============ START SERVER ============

async function start() {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    await testConnection();

    // Initialize MQTT (if enabled)
    initializeMQTT();

    // Create logs directory
    const fs = await import('fs/promises');
    try {
      await fs.mkdir('./logs', { recursive: true });
    } catch {}

    server.listen(PORT, () => {
      logger.info(`\n🚀 AirMap Server running on http://localhost:${PORT}`);
      logger.info(`📡 WebSocket server running on ws://localhost:${PORT}`);
      logger.info(`\nAPI Endpoints:`);
      logger.info(`  POST   /api/auth/register`);
      logger.info(`  POST   /api/auth/login`);
      logger.info(`  GET    /api/devices`);
      logger.info(`  POST   /api/devices`);
      logger.info(`  GET    /api/readings`);
      logger.info(`  POST   /api/readings`);
      logger.info(`\nSimulating sensor readings every 5-10 seconds...\n`);
    });

    // Start simulating readings
    setInterval(simulateReadings, 5000 + Math.random() * 5000);
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});
