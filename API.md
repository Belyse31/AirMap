# 📡 AirMap API Documentation

Complete API reference for the AirMap backend server.

## Base URL

```
http://localhost:3001/api
```

For production, replace with your deployed backend URL.

## Authentication

Currently, the mock server does not require authentication. For production deployment, implement JWT or OAuth2.

---

## Devices API

### List All Devices

**GET** `/api/devices`

Returns a list of all registered air quality sensors.

**Response:**
```json
[
  {
    "id": "dev-001",
    "name": "City Center Sensor",
    "location": "Downtown",
    "lat": -1.9536,
    "lng": 30.0606,
    "status": "active",
    "type": "air-quality-sensor",
    "installDate": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Get Device by ID

**GET** `/api/devices/:id`

Retrieve details of a specific device.

**Parameters:**
- `id` (path) - Device ID

**Response:**
```json
{
  "id": "dev-001",
  "name": "City Center Sensor",
  "location": "Downtown",
  "lat": -1.9536,
  "lng": 30.0606,
  "status": "active",
  "type": "air-quality-sensor",
  "installDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Device not found
- `500 Internal Server Error` - Server error

---

### Create Device

**POST** `/api/devices`

Register a new air quality sensor.

**Request Body:**
```json
{
  "name": "New Sensor",
  "location": "Park Area",
  "lat": -1.9500,
  "lng": 30.0600,
  "status": "active",
  "type": "air-quality-sensor"
}
```

**Response:**
```json
{
  "id": "device-1696000000000",
  "name": "New Sensor",
  "location": "Park Area",
  "lat": -1.9500,
  "lng": 30.0600,
  "status": "active",
  "type": "air-quality-sensor",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Device created successfully
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

---

### Update Device

**PUT** `/api/devices/:id`

Update device information.

**Parameters:**
- `id` (path) - Device ID

**Request Body:**
```json
{
  "name": "Updated Sensor Name",
  "status": "maintenance"
}
```

**Response:**
```json
{
  "id": "dev-001",
  "name": "Updated Sensor Name",
  "location": "Downtown",
  "lat": -1.9536,
  "lng": 30.0606,
  "status": "maintenance",
  "type": "air-quality-sensor",
  "installDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Device updated successfully
- `404 Not Found` - Device not found
- `500 Internal Server Error` - Server error

---

### Delete Device

**DELETE** `/api/devices/:id`

Remove a device from the system.

**Parameters:**
- `id` (path) - Device ID

**Response:**
```json
{
  "message": "Device deleted"
}
```

**Status Codes:**
- `200 OK` - Device deleted successfully
- `404 Not Found` - Device not found
- `500 Internal Server Error` - Server error

---

## Readings API

### Get Recent Readings

**GET** `/api/readings`

Retrieve the most recent sensor readings.

**Query Parameters:**
- `limit` (optional) - Number of readings to return (default: 100)

**Example:**
```
GET /api/readings?limit=50
```

**Response:**
```json
[
  {
    "deviceId": "dev-001",
    "lat": -1.9536,
    "lng": 30.0606,
    "timestamp": 1696000000000,
    "readings": {
      "pm25": 18.2,
      "pm10": 30.5,
      "co": 0.4,
      "no2": 15.1
    }
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Get Device Readings

**GET** `/api/readings/:deviceId`

Get readings for a specific device within a time range.

**Parameters:**
- `deviceId` (path) - Device ID

**Query Parameters:**
- `hours` (optional) - Number of hours to look back (default: 24)

**Example:**
```
GET /api/readings/dev-001?hours=48
```

**Response:**
```json
[
  {
    "deviceId": "dev-001",
    "lat": -1.9536,
    "lng": 30.0606,
    "timestamp": 1696000000000,
    "readings": {
      "pm25": 18.2,
      "pm10": 30.5,
      "co": 0.4,
      "no2": 15.1
    }
  }
]
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

### Submit Reading

**POST** `/api/readings`

Submit a new sensor reading.

**Request Body:**
```json
{
  "deviceId": "dev-001",
  "lat": -1.9536,
  "lng": 30.0606,
  "timestamp": 1696000000000,
  "readings": {
    "pm25": 18.2,
    "pm10": 30.5,
    "co": 0.4,
    "no2": 15.1
  }
}
```

**Response:**
```json
{
  "deviceId": "dev-001",
  "lat": -1.9536,
  "lng": 30.0606,
  "timestamp": 1696000000000,
  "readings": {
    "pm25": 18.2,
    "pm10": 30.5,
    "co": 0.4,
    "no2": 15.1
  }
}
```

**Status Codes:**
- `201 Created` - Reading submitted successfully
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

**Note:** This endpoint also broadcasts the reading to all connected WebSocket clients.

---

## Analytics API

### Get Statistics

**GET** `/api/analytics/stats`

Retrieve overall system statistics.

**Response:**
```json
{
  "totalDevices": 10,
  "activeDevices": 8,
  "totalReadings": 5432
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

---

## WebSocket API

### Connection

Connect to the WebSocket server for real-time updates.

**URL:**
```
ws://localhost:3001
```

For production with SSL:
```
wss://your-domain.com
```

### Message Format

**Incoming Messages:**

The server sends readings in the following format:

```json
{
  "type": "reading",
  "payload": {
    "deviceId": "dev-001",
    "lat": -1.9536,
    "lng": 30.0606,
    "timestamp": 1696000000000,
    "readings": {
      "pm25": 18.2,
      "pm10": 30.5,
      "co": 0.4,
      "no2": 15.1
    }
  }
}
```

### JavaScript Client Example

```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Connected to AirMap WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'reading') {
    console.log('New reading:', data.payload);
    // Update your UI with the new reading
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket');
  // Implement reconnection logic
};
```

### Python Client Example

```python
import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    if data['type'] == 'reading':
        print(f"New reading: {data['payload']}")

def on_error(ws, error):
    print(f"Error: {error}")

def on_close(ws, close_status_code, close_msg):
    print("Connection closed")

def on_open(ws):
    print("Connected to AirMap WebSocket")

ws = websocket.WebSocketApp(
    "ws://localhost:3001",
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

ws.run_forever()
```

---

## Data Models

### Device

```typescript
interface Device {
  id: string;              // Unique device identifier
  name: string;            // Human-readable name
  location?: string;       // Location description
  lat: number;             // Latitude (-90 to 90)
  lng: number;             // Longitude (-180 to 180)
  status: 'active' | 'inactive' | 'offline' | 'maintenance';
  type: string;            // Device type (e.g., 'air-quality-sensor')
  installDate?: string;    // ISO 8601 date string
  createdAt: string;       // ISO 8601 date string
}
```

### Reading

```typescript
interface Reading {
  deviceId: string;        // Device that took the reading
  lat: number;             // Latitude
  lng: number;             // Longitude
  timestamp: number;       // Unix timestamp (milliseconds)
  readings: {
    pm25?: number;         // PM2.5 (μg/m³)
    pm10?: number;         // PM10 (μg/m³)
    co?: number;           // Carbon monoxide (ppm)
    no2?: number;          // Nitrogen dioxide (ppb)
  };
}
```

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Error message description"
}
```

### Common Error Codes

- `400 Bad Request` - Invalid input or malformed request
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server-side error

---

## Rate Limiting

The mock server does not implement rate limiting. For production:

- Implement rate limiting per IP address
- Recommended: 100 requests per minute for API
- WebSocket connections: 10 per IP address

---

## CORS

The server allows all origins by default. For production:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## Pagination

Currently not implemented. For large datasets, implement pagination:

**Example:**
```
GET /api/readings?page=1&limit=50
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1000,
    "pages": 20
  }
}
```

---

## Versioning

Current version: `v1`

For future versions, use URL versioning:
```
/api/v2/devices
```

---

## Best Practices

### Submitting Readings

1. **Batch readings** when possible to reduce API calls
2. **Include timestamp** for accurate historical data
3. **Validate data** before submission
4. **Handle errors** gracefully with retry logic

### WebSocket Usage

1. **Implement reconnection** logic with exponential backoff
2. **Handle connection drops** gracefully
3. **Parse messages** safely with try-catch
4. **Close connections** when not needed

---

## Testing

### cURL Examples

**Get all devices:**
```bash
curl http://localhost:3001/api/devices
```

**Create device:**
```bash
curl -X POST http://localhost:3001/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Sensor",
    "lat": -1.95,
    "lng": 30.06,
    "status": "active"
  }'
```

**Submit reading:**
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

---

## Migration to Production

When moving to production:

1. **Replace JSON storage** with PostgreSQL/MongoDB
2. **Add authentication** (JWT tokens)
3. **Implement rate limiting**
4. **Add input validation** (Joi, Yup)
5. **Set up logging** (Winston, Morgan)
6. **Enable HTTPS/WSS**
7. **Add monitoring** (Prometheus, Grafana)
8. **Implement caching** (Redis)

---

For more information, see [README.md](./README.md)
