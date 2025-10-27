import { query, pool } from '../config/database.js';

export const DeviceModel = {
  /**
   * Get all devices
   */
  async getAll() {
    const result = await query('SELECT * FROM devices ORDER BY created_at DESC');
    return result.rows;
  },

  /**
   * Get device by ID
   */
  async getById(id) {
    const result = await query('SELECT * FROM devices WHERE id = $1', [id]);
    return result.rows[0];
  },

  /**
   * Create new device
   */
  async create(device) {
    const {
      id,
      name,
      location,
      lat,
      lng,
      status = 'active',
      type = 'air-quality-sensor',
      installDate,
    } = device;

    const result = await query(
      `INSERT INTO devices (id, name, location, lat, lng, status, type, install_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, name, location, lat, lng, status, type, installDate]
    );

    return result.rows[0];
  },

  /**
   * Update device
   */
  async update(id, device) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.entries(device).forEach(([key, value]) => {
      if (value !== undefined) {
        const dbKey = key === 'installDate' ? 'install_date' : key;
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE devices 
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  /**
   * Delete device
   */
  async delete(id) {
    const result = await query('DELETE FROM devices WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  /**
   * Get active devices
   */
  async getActive() {
    const result = await query(
      "SELECT * FROM devices WHERE status = 'active' ORDER BY name"
    );
    return result.rows;
  },

  /**
   * Get devices by status
   */
  async getByStatus(status) {
    const result = await query(
      'SELECT * FROM devices WHERE status = $1 ORDER BY created_at DESC',
      [status]
    );
    return result.rows;
  },
};

