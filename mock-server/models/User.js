import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const UserModel = {
  /**
   * Create new user
   */
  async create(user) {
    const { email, password, name, role = 'user' } = user;
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await query(
      `INSERT INTO users (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, role, created_at`,
      [email, passwordHash, name, role]
    );
    
    return result.rows[0];
  },

  /**
   * Get user by ID
   */
  async getById(id) {
    const result = await query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  },

  /**
   * Get user by email
   */
  async getByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  /**
   * Update user
   */
  async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.password) {
      updates.password_hash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE users 
       SET ${fields.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, email, name, role, created_at, updated_at`,
      values
    );

    return result.rows[0];
  },

  /**
   * Delete user
   */
  async delete(id) {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  /**
   * Verify password
   */
  async verifyPassword(email, password) {
    const user = await this.getByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return user;
  },

  /**
   * Generate JWT token
   */
  generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRY }
    );
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  },
};

