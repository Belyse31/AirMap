#!/usr/bin/env node

/**
 * Health check script for AirMap
 * Verifies that frontend and backend are running correctly
 */

import http from 'http';

const checks = [
  {
    name: 'Frontend',
    url: 'http://localhost:3000',
    port: 3000,
  },
  {
    name: 'Backend API',
    url: 'http://localhost:3001/api/devices',
    port: 3001,
  },
];

console.log('🏥 AirMap Health Check\n');

async function checkEndpoint(check) {
  return new Promise((resolve) => {
    const req = http.get(check.url, (res) => {
      if (res.statusCode === 200 || res.statusCode === 304) {
        console.log(`✅ ${check.name} is running (port ${check.port})`);
        resolve(true);
      } else {
        console.log(`⚠️  ${check.name} returned status ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', () => {
      console.log(`❌ ${check.name} is not running (port ${check.port})`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`❌ ${check.name} timed out`);
      resolve(false);
    });
  });
}

async function runHealthCheck() {
  const results = await Promise.all(checks.map(checkEndpoint));
  
  console.log('\n' + '='.repeat(50));
  
  if (results.every(r => r)) {
    console.log('✅ All services are healthy!');
    process.exit(0);
  } else {
    console.log('❌ Some services are not running');
    console.log('\nTo start services:');
    console.log('  npm run start:all');
    process.exit(1);
  }
}

runHealthCheck();
