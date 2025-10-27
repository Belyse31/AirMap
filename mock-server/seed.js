/**
 * Seed data generator for database
 */
import { pool } from './config/database.js';
import { DeviceModel } from './models/Device.js';

// Kigali, Rwanda coordinates with some variation
const KIGALI_CENTER = { lat: -1.9536, lng: 30.0606 };

const LOCATIONS = [
  { name: 'City Center', offset: { lat: 0, lng: 0 } },
  { name: 'Kimironko', offset: { lat: 0.02, lng: 0.03 } },
  { name: 'Nyamirambo', offset: { lat: -0.01, lng: -0.02 } },
  { name: 'Kacyiru', offset: { lat: 0.03, lng: 0.01 } },
  { name: 'Remera', offset: { lat: 0.01, lng: 0.04 } },
  { name: 'Gikondo', offset: { lat: -0.02, lng: 0.01 } },
  { name: 'Nyarutarama', offset: { lat: 0.04, lng: 0.02 } },
  { name: 'Kicukiro', offset: { lat: -0.03, lng: 0.03 } },
  { name: 'Gisozi', offset: { lat: 0.05, lng: -0.01 } },
  { name: 'Kabeza', offset: { lat: -0.01, lng: 0.05 } },
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Check if devices already exist
    const existing = await DeviceModel.getAll();
    if (existing.length > 0) {
      console.log('⚠️  Database already seeded, skipping...');
      return;
    }

    // Insert devices
    for (let i = 0; i < LOCATIONS.length; i++) {
      const location = LOCATIONS[i];
      const deviceId = `dev-${String(i + 1).padStart(3, '0')}`;

      await DeviceModel.create({
        id: deviceId,
        name: `${location.name} Sensor`,
        location: location.name,
        lat: KIGALI_CENTER.lat + location.offset.lat,
        lng: KIGALI_CENTER.lng + location.offset.lng,
        status: 'active',
        type: 'air-quality-sensor',
        installDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    console.log('✅ Database seeded successfully with 10 devices');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
