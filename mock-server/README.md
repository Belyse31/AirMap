# AirMap Mock Server

Mock backend server for AirMap with WebSocket support for real-time sensor data simulation.

## Features

- **RESTful API** for device and reading management
- **WebSocket Server** for real-time data streaming
- **Automatic Data Generation** - simulates sensor readings every 5-10 seconds
- **JSON File Storage** - simple persistence for demo purposes
- **CORS Enabled** - works with frontend on different port

## Quick Start

```bash
# Install dependencies
npm install

# Start server
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Devices

```
GET    /api/devices          - List all devices
GET    /api/devices/:id      - Get device by ID
POST   /api/devices          - Create new device
PUT    /api/devices/:id      - Update device
DELETE /api/devices/:id      - Delete device
```

### Readings

```
GET    /api/readings?limit=100           - Get recent readings
GET    /api/readings/:deviceId?hours=24  - Get device readings
POST   /api/readings                     - Submit new reading
```

### Analytics

```
GET    /api/analytics/stats  - Get overall statistics
```

## WebSocket

Connect to `ws://localhost:3001`

**Message Format:**
```json
{
  "type": "reading",
  "payload": {
    "deviceId": "dev-001",
    "lat": -1.9536,
    "lng": 30.0606,
    "timestamp": 1690000000000,
    "readings": {
      "pm25": 18.2,
      "pm10": 30.5,
      "co": 0.4,
      "no2": 15.1
    }
  }
}
```

## Data Storage

Data is stored in JSON files:
- `data/devices.json` - Device information
- `data/readings.json` - Sensor readings (last 10,000)

## Seeding Data

Generate initial device data:

```bash
npm run seed
```

This creates 10 devices across Kigali, Rwanda.

## Configuration

Edit `server.js` to change:
- Port (default: 3001)
- Reading simulation interval (default: 5-10 seconds)
- Maximum stored readings (default: 10,000)

## Production Use

For production, replace with:
- Real database (PostgreSQL, MongoDB)
- Authentication/authorization
- Rate limiting
- Input validation
- Error logging
- Health checks

## Example Requests

### Create Device

```bash
curl -X POST http://localhost:3001/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sensor",
    "location": "Downtown",
    "lat": -1.9536,
    "lng": 30.0606,
    "status": "active"
  }'
```

### Submit Reading

```bash
curl -X POST http://localhost:3001/api/readings \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "dev-001",
    "lat": -1.9536,
    "lng": 30.0606,
    "readings": {
      "pm25": 18.2,
      "pm10": 30.5,
      "co": 0.4,
      "no2": 15.1
    }
  }'
```

### WebSocket Client (JavaScript)

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected to WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New reading:', data.payload);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};
```

## License

MIT
