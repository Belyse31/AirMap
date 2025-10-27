import { query } from '../config/database.js';

export const AlertModel = {
  /**
   * Create new alert
   */
  async create(alert) {
    const {
      userId,
      deviceId,
      pollutant,
      threshold,
      currentValue,
      aqi,
      alertLevel,
    } = alert;

    const result = await query(
      `INSERT INTO alerts (user_id, device_id, pollutant, threshold, current_value, aqi, alert_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, deviceId, pollutant, threshold, currentValue, aqi, alertLevel]
    );

    return result.rows[0];
  },

  /**
   * Get alerts for user
   */
  async getByUser(userId, limit = 50) {
    const result = await query(
      `SELECT a.*, d.name as device_name, d.location
       FROM alerts a
       JOIN devices d ON a.device_id = d.id
       WHERE a.user_id = $1
       ORDER BY a.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  /**
   * Mark alert as notified
   */
  async markAsNotified(alertId) {
    const result = await query(
      'UPDATE alerts SET notified = true WHERE id = $1 RETURNING *',
      [alertId]
    );
    return result.rows[0];
  },

  /**
   * Get unread alerts
   */
  async getUnread() {
    const result = await query(
      `SELECT * FROM alerts 
       WHERE notified = false 
       ORDER BY created_at DESC`
    );
    return result.rows;
  },
};

export const AlertConfigModel = {
  /**
   * Create or update alert configuration
   */
  async upsert(userId, pollutant, threshold, emailEnabled = false, smsEnabled = false) {
    const result = await query(
      `INSERT INTO alert_configurations (user_id, pollutant, threshold, email_enabled, sms_enabled)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, pollutant)
       DO UPDATE SET threshold = $3, email_enabled = $4, sms_enabled = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, pollutant, threshold, emailEnabled, smsEnabled]
    );
    return result.rows[0];
  },

  /**
   * Get alert configurations for user
   */
  async getByUser(userId) {
    const result = await query(
      'SELECT * FROM alert_configurations WHERE user_id = $1',
      [userId]
    );
    return result.rows;
  },

  /**
   * Delete alert configuration
   */
  async delete(userId, pollutant) {
    const result = await query(
      'DELETE FROM alert_configurations WHERE user_id = $1 AND pollutant = $2 RETURNING *',
      [userId, pollutant]
    );
    return result.rows[0];
  },
};

