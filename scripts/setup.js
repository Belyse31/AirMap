#!/usr/bin/env node

/**
 * Setup script for AirMap
 * Initializes the project and checks dependencies
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🌍 AirMap Setup Script\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Error: Node.js 18 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create .env file if it doesn't exist
const envPath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
const mockServerDir = path.join(rootDir, 'mock-server');
try {
  execSync('npm install', { cwd: mockServerDir, stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Create data directory
const dataDir = path.join(mockServerDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

console.log('\n🎉 Setup complete!\n');
console.log('Next steps:');
console.log('  1. npm run start:all    - Start both frontend and backend');
console.log('  2. Open http://localhost:3000 in your browser\n');
console.log('For more information, see README.md');
