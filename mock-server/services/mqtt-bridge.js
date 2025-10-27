import mqtt from 'mqtt';
import { config } from '../config/config.js';
import { ReadingModel } from '../models/Reading.js';
import { checkThresholds } from './notifications.js';

/**
 * MQTT client and bridge service
 */
class MQTTBridge {
  constructor() {
    this.client = null;
    this.isConnected = false;
  }

  /**
   * Connect to MQTT broker
   */
  connect() {
    if (this.client) {
      this.client.end();
    }

    console.log(`Connecting to MQTT broker: ${config.MQTT.broker}`);
    
    this.client = mqtt.connect(config.MQTT.broker, {
      reconnectPeriod: 5000,
      connectTimeout: 30000,
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      console.log('✅ MQTT connected');
      
      // Subscribe to all device readings
      const topic = `${config.MQTT.topicPrefix}/+/reading`;
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error('MQTT subscription error:', err);
        } else {
          console.log(`📡 Subscribed to ${topic}`);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        console.log('📨 MQTT message received:', payload);
        await this.handleReading(payload);
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('MQTT error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('MQTT disconnected');
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('MQTT reconnecting...');
    });
  }

  /**
   * Handle incoming sensor reading
   */
  async handleReading(payload) {
    try {
      const { deviceId, lat, lng, timestamp, readings } = payload;

      if (!deviceId || !readings) {
        console.error('Invalid reading payload:', payload);
        return;
      }

      // Validate readings
      const validatedReadings = {};
      if (readings.pm25 !== undefined) validatedReadings.pm25 = parseFloat(readings.pm25);
      if (readings.pm10 !== undefined) validatedReadings.pm10 = parseFloat(readings.pm10);
      if (readings.co !== undefined) validatedReadings.co = parseFloat(readings.co);
      if (readings.no2 !== undefined) validatedReadings.no2 = parseFloat(readings.no2);

      // Create reading record
      const readingData = {
        deviceId,
        lat: lat || 0,
        lng: lng || 0,
        timestamp: timestamp || Date.now(),
        readings: validatedReadings,
      };

      const createdReading = await ReadingModel.create(readingData);

      // Check for alerts
      await checkThresholds({
        deviceId,
        ...validatedReadings,
        aqi: createdReading.aqi,
      });

      console.log(`✅ Saved MQTT reading for device ${deviceId}`);

      // Emit WebSocket event (imported globally)
      if (global.broadcastReading) {
        global.broadcastReading(createdReading);
      }

      return createdReading;
    } catch (error) {
      console.error('Error handling MQTT reading:', error);
      throw error;
    }
  }

  /**
   * Publish a message to MQTT
   */
  publish(topic, message) {
    if (!this.isConnected) {
      console.error('Cannot publish: MQTT not connected');
      return false;
    }

    this.client.publish(topic, JSON.stringify(message), (err) => {
      if (err) {
        console.error('MQTT publish error:', err);
      }
    });

    return true;
  }

  /**
   * Disconnect from MQTT broker
   */
  disconnect() {
    if (this.client) {
      this.client.end();
      this.isConnected = false;
    }
  }
}

export const mqttBridge = new MQTTBridge();

/**
 * Initialize MQTT bridge (can be disabled via env)
 */
export function initializeMQTT() {
  if (process.env.MQTT_ENABLED !== 'false') {
    try {
      mqttBridge.connect();
    } catch (error) {
      console.error('Failed to initialize MQTT:', error);
      console.log('Continuing without MQTT support');
    }
  } else {
    console.log('MQTT disabled via MQTT_ENABLED=false');
  }
}

