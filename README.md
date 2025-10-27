# 🌍 AirMap - IoT Air Quality Monitoring Platform

![AirMap Banner](https://via.placeholder.com/1200x300/00a087/ffffff?text=AirMap+-+Real-Time+Air+Quality+Monitoring)

A production-ready, full-stack web application for real-time air quality monitoring using IoT sensors. Built with React, Node.js, WebSocket, and Leaflet maps.

## ✨ Features

### 🗺️ **Interactive Live Map**
- Real-time sensor markers with color-coded air quality indicators
- Heatmap overlay for pollutant visualization (PM2.5, PM10, CO, NO₂)
- Historical data playback with time slider (last 72 hours)
- Clustered markers for better performance
- Click markers for detailed readings and device info

### 📊 **Comprehensive Analytics**
- Time-series charts showing pollutant trends
- Area-based air quality comparisons
- Top polluted locations ranking
- Air quality distribution pie charts
- Daily/weekly trend analysis

### 🔧 **Device Management Hub**
- Add, edit, and delete IoT sensors
- Interactive map-based location picker
- CSV import/export for bulk device management
- Real-time device status monitoring
- Search and filter by location, status, or pollutant levels
- Pagination for large device lists

### 📱 **Responsive & Accessible**
- Mobile-first design with Tailwind CSS
- ARIA labels and semantic HTML
- Keyboard navigation support
- Toast notifications for user feedback
- Loading states and skeleton screens

### ⚡ **Real-Time Updates**
- WebSocket connection for live sensor data
- Automatic fallback to polling when WebSocket unavailable
- Connection status indicator
- 5-10 second update intervals

## 🏗️ Architecture

```
AirMap/
├── src/                      # React frontend
│   ├── components/           # Reusable UI components
│   │   ├── Map/             # Map-related components
│   │   ├── Charts/          # Chart components
│   │   ├── Toast.jsx        # Notification system
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Home.jsx
│   │   ├── LiveMap.jsx
│   │   ├── DeviceHub.jsx
│   │   ├── DeviceDetails.jsx
│   │   ├── Analytics.jsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   ├── useWebSocket.js
│   │   ├── useDevices.js
│   │   ├── useReadings.js
│   │   └── useToast.js
│   ├── services/            # API services
│   │   └── api.js
│   ├── utils/               # Utility functions
│   │   ├── airQuality.js    # AQI calculations
│   │   ├── dateUtils.js
│   │   ├── csvParser.js
│   │   └── localStorage.js
│   └── test/                # Test files
├── mock-server/             # Node.js backend
│   ├── server.js            # Express + WebSocket server
│   ├── seed.js              # Data generator
│   └── data/                # JSON data storage
└── public/                  # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AirMap
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd mock-server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (defaults work for local development)

### Running Locally

#### Option 1: Run Both Servers Simultaneously
```bash
npm run start:all
```

#### Option 2: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run mock-server
```
Server runs on `http://localhost:3001`

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```
App runs on `http://localhost:3000`

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **WebSocket:** ws://localhost:3001

## 📡 Connecting Real IoT Devices

### WebSocket Protocol

Send JSON payloads to `ws://localhost:3001`:

```json
{
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
```

### REST API

**POST** `/api/readings`

```bash
curl -X POST http://localhost:3001/api/readings \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

### MQTT Integration

To connect MQTT-based sensors:

1. **Install Mosquitto MQTT Broker**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install mosquitto mosquitto-clients
   
   # macOS
   brew install mosquitto
   ```

2. **Create MQTT Bridge Script** (`mqtt-bridge.js`)

   ```javascript
   import mqtt from 'mqtt';
   import WebSocket from 'ws';

   const mqttClient = mqtt.connect('mqtt://localhost:1883');
   const ws = new WebSocket('ws://localhost:3001');

   mqttClient.on('connect', () => {
     mqttClient.subscribe('airquality/+/reading');
   });

   mqttClient.on('message', (topic, message) => {
     const reading = JSON.parse(message.toString());
     ws.send(JSON.stringify(reading));
   });
   ```

3. **Publish from IoT Device**
   ```bash
   mosquitto_pub -t "airquality/dev-001/reading" -m '{
     "deviceId": "dev-001",
     "lat": -1.9536,
     "lng": 30.0606,
     "readings": {"pm25": 18.2, "pm10": 30.5, "co": 0.4, "no2": 15.1}
   }'
   ```

## 🧪 Testing

Run unit tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test -- --coverage
```

## 📦 Building for Production

### Build Frontend
```bash
npm run build
```
Output: `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Manual Docker Build

**Frontend:**
```bash
docker build -t airmap-frontend .
docker run -p 3000:80 airmap-frontend
```

**Backend:**
```bash
cd mock-server
docker build -t airmap-backend .
docker run -p 3001:3001 airmap-backend
```

## ☁️ Cloud Deployment

### Frontend (Netlify/Vercel)

**Netlify:**
1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Set `VITE_API_BASE_URL` and `VITE_WS_URL`

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

### Backend (Heroku/DigitalOcean)

**Heroku:**
```bash
cd mock-server
heroku create airmap-backend
git subtree push --prefix mock-server heroku main
```

**DigitalOcean App Platform:**
1. Create new app from GitHub
2. Select `mock-server` directory
3. Set build command: `npm install`
4. Set run command: `node server.js`

## 🔧 Configuration

### Environment Variables

**Frontend (`.env`):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_DEFAULT_LAT=-1.9536
VITE_DEFAULT_LNG=30.0606
VITE_DEFAULT_ZOOM=12
```

**Backend:**
- Port: `3001` (hardcoded in `server.js`, modify if needed)
- Data storage: `mock-server/data/` (JSON files)

### Replacing Mock Backend with Real API

1. Update `src/services/api.js` to point to your production API
2. Implement authentication if needed
3. Update WebSocket URL in `.env`
4. Ensure CORS is configured on your backend

## 📊 Data Format

### Device Schema
```json
{
  "id": "dev-001",
  "name": "Downtown Sensor",
  "location": "City Center",
  "lat": -1.9536,
  "lng": 30.0606,
  "status": "active",
  "type": "air-quality-sensor",
  "installDate": "2024-01-15T10:00:00Z"
}
```

### Reading Schema
```json
{
  "deviceId": "dev-001",
  "timestamp": 1690000000000,
  "lat": -1.9536,
  "lng": 30.0606,
  "readings": {
    "pm25": 18.2,
    "pm10": 30.5,
    "co": 0.4,
    "no2": 15.1
  }
}
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Leaflet** - Interactive maps
- **React-Leaflet** - React bindings for Leaflet
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **PapaParse** - CSV parsing

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **ws** - WebSocket library
- **CORS** - Cross-origin support

### DevOps
- **Vitest** - Testing framework
- **Docker** - Containerization
- **Nginx** - Production web server

## 🎨 Customization

### Changing Color Scheme

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        // ... other shades
      }
    }
  }
}
```

### Adding New Pollutants

1. Update `src/utils/airQuality.js` with new breakpoints
2. Add to chart components in `src/components/Charts/`
3. Update device reading schema

## 📝 API Documentation

### Devices

- `GET /api/devices` - List all devices
- `GET /api/devices/:id` - Get device by ID
- `POST /api/devices` - Create device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device

### Readings

- `GET /api/readings?limit=100` - Get recent readings
- `GET /api/readings/:deviceId?hours=24` - Get device readings
- `POST /api/readings` - Submit new reading

### Analytics

- `GET /api/analytics/stats` - Get overall statistics

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open-source and available under the MIT License.

## 🙏 Acknowledgments

- Air Quality Index calculations based on EPA standards
- Map tiles from OpenStreetMap
- Icons from Lucide

## 📧 Contact

For questions or support:
- Email: info@airmap.io
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

**Built with ❤️ for cleaner air**
