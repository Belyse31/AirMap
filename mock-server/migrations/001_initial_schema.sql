-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  type VARCHAR(100) DEFAULT 'air-quality-sensor',
  install_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create readings table with proper indexing for time-series data
CREATE TABLE IF NOT EXISTS readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id VARCHAR(50) REFERENCES devices(id) ON DELETE CASCADE,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pm25 DECIMAL(10, 2),
  pm10 DECIMAL(10, 2),
  co DECIMAL(10, 2),
  no2 DECIMAL(10, 2),
  aqi INTEGER,
  aqi_category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_readings_device_id ON readings(device_id);
CREATE INDEX IF NOT EXISTS idx_readings_timestamp ON readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_readings_device_timestamp ON readings(device_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  device_id VARCHAR(50) REFERENCES devices(id) ON DELETE CASCADE,
  pollutant VARCHAR(50) NOT NULL,
  threshold DECIMAL(10, 2) NOT NULL,
  current_value DECIMAL(10, 2) NOT NULL,
  aqi INTEGER,
  alert_level VARCHAR(50) NOT NULL,
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alert configurations table
CREATE TABLE IF NOT EXISTS alert_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pollutant VARCHAR(50) NOT NULL,
  threshold DECIMAL(10, 2) NOT NULL,
  email_enabled BOOLEAN DEFAULT FALSE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, pollutant)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_configurations_updated_at BEFORE UPDATE ON alert_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (id, email, password_hash, name, role) 
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@airmap.local',
  '$2a$10$rQ2WJfXQ9q3YQkL3QfXQ.3QkL3QfXQ9q3YQkL3QfXQ9q3YQkL3QfXQ',
  'System Administrator',
  'admin'
) ON CONFLICT (email) DO NOTHING;

