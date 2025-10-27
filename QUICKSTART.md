# ⚡ Quick Start Guide

Get AirMap running in 5 minutes!

## Prerequisites

- Node.js 18+ installed ([Download](https://nodejs.org/))
- A modern web browser

## Installation

### Step 1: Clone or Download

```bash
# If you have git
git clone <repository-url>
cd AirMap

# Or download and extract the ZIP file
```

### Step 2: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd mock-server
npm install
cd ..
```

### Step 3: Start the Application

**Option A: Start Both Servers Together (Recommended)**

```bash
npm run start:all
```

**Option B: Start Separately**

Terminal 1 (Backend):
```bash
npm run mock-server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

That's it! 🎉

## What You'll See

1. **Home Page** - Overview and statistics
2. **Live Map** - Interactive map with sensor markers
3. **Device Hub** - Manage your sensors
4. **Analytics** - Charts and insights

## First Steps

### Explore the Live Map

1. Click **"View Live Map"** on the home page
2. Click on any marker to see sensor readings
3. Toggle the **heatmap** layer
4. Try the **time slider** to view historical data

### Add a New Device

1. Go to **Device Hub**
2. Click **"Add Device"**
3. Fill in device information
4. Click on the map to set location
5. Click **"Save"**

### View Analytics

1. Navigate to **Analytics**
2. Explore different charts
3. See top polluted locations

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is busy:

**Frontend (Vite):**
Edit `vite.config.js`:
```javascript
server: {
  port: 3002, // Change to any available port
}
```

**Backend:**
Edit `mock-server/server.js`:
```javascript
const PORT = 3003; // Change to any available port
```

### WebSocket Not Connecting

1. Check backend server is running
2. Look for "WebSocket connected" in browser console
3. Ensure firewall isn't blocking connections

### No Data Showing

1. Wait 5-10 seconds for first readings
2. Check browser console for errors
3. Restart both servers

## Sample Data

The mock server automatically:
- Creates 10 devices across Kigali
- Generates readings every 5-10 seconds
- Stores data in `mock-server/data/`

To reset data:
```bash
cd mock-server
rm -rf data
npm run seed
```

## Next Steps

- Read the full [README.md](./README.md)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- Watch the [demo video](./DEMO_RECORDING.md)

## Need Help?

- Check the [README.md](./README.md) for detailed documentation
- Open an issue on GitHub
- Contact: info@airmap.io

---

**Enjoy monitoring air quality! 🌍**
