import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'airmap',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'wizard',
  },
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '24h',
  
  // MQTT
  MQTT: {
    broker: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
    topicPrefix: process.env.MQTT_TOPIC_PREFIX || 'airmap/devices',
  },
  
  // Alerts
  ALERT_THRESHOLDS: {
    pm25: parseFloat(process.env.ALERT_THRESHOLD_PM25) || 55,
    pm10: parseFloat(process.env.ALERT_THRESHOLD_PM10) || 155,
    co: parseFloat(process.env.ALERT_THRESHOLD_CO) || 9.5,
    no2: parseFloat(process.env.ALERT_THRESHOLD_NO2) || 54,
  },
  
  // Email
  EMAIL: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    from: process.env.EMAIL_FROM || 'alerts@airmap.local',
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

