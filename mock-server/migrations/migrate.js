import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run database migrations
 */
async function migrate() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Read migration file
    const migrationPath = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute migration
    await pool.query(sql);
    
    console.log('✅ Migration completed successfully');
    
    // Close connection pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

