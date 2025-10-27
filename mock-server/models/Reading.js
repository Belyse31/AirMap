import { query } from '../config/database.js';
import { calculateAQI, getOverallAQI } from '../utils/airQuality.js';

export const ReadingModel = {
  /**
   * Create new reading
   */
  async create(reading) {
    const { deviceId, lat, lng, timestamp, readings: readingsData } = reading;

    // Calculate AQI
    const aqiResult = getOverallAQI(readingsData);
    const aqi = aqiResult ? aqiResult.aqi : null;
    const aqiCategory = aqiResult ? aqiResult.category : null;

    const result = await query(
      `INSERT INTO readings (device_id, lat, lng, timestamp, pm25, pm10, co, no2, aqi, aqi_category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        deviceId,
        lat,
        lng,
        timestamp,
        readingsData.pm25,
        readingsData.pm10,
        readingsData.co,
        readingsData.no2,
        aqi,
        aqiCategory,
      ]
    );

    return result.rows[0];
  },

  /**
   * Get recent readings
   */
  async getRecent(limit = 100) {
    const result = await query(
      `SELECT * FROM readings 
       ORDER BY timestamp DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  /**
   * Get readings for device
   */
  async getByDevice(deviceId, hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const result = await query(
      `SELECT * FROM readings 
       WHERE device_id = $1 AND timestamp >= $2
       ORDER BY timestamp DESC`,
      [deviceId, cutoff]
    );
    return result.rows;
  },

  /**
   * Get readings by time range
   */
  async getByTimeRange(start, end) {
    const result = await query(
      `SELECT * FROM readings 
       WHERE timestamp >= $1 AND timestamp <= $2
       ORDER BY timestamp DESC`,
      [start, end]
    );
    return result.rows;
  },

  /**
   * Get readings count
   */
  async getCount() {
    const result = await query('SELECT COUNT(*) as count FROM readings');
    return parseInt(result.rows[0].count);
  },
};

