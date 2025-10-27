#!/usr/bin/env node

/**
 * Check if all required environment variables are set
 * Run this before deployment to catch configuration issues early
 */

const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'NODE_ENV',
  'PORT',
];

const optionalEnvVars = [
  'JWT_SECRET',
  'JWT_EXPIRY',
  'MQTT_ENABLED',
  'CORS_ORIGIN',
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;
const missingVars = [];
const setVars = [];

// Check required variables
requiredEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    setVars.push(varName);
    console.log(`✅ ${varName}: ${process.env[varName] ? '✓' : '✗'}`);
  } else {
    missingVars.push(varName);
    hasErrors = true;
    console.log(`❌ ${varName}: NOT SET`);
  }
});

// Check optional variables
console.log('\nOptional variables:');
optionalEnvVars.forEach((varName) => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: ${process.env[varName]}`);
  } else {
    console.log(`   ⚠️  ${varName}: not set (using default)`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Configuration check FAILED');
  console.log('\nMissing required environment variables:');
  missingVars.forEach((varName) => {
    console.log(`  - ${varName}`);
  });
  console.log('\nPlease set these variables before starting the server.');
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
  console.log(`\nFound ${setVars.length} required variables and configuration is ready.`);
  process.exit(0);
}

