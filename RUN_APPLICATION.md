# AirMap - Run Application Guide

## Quick Steps to Run AirMap

### Step 1: Create Database
```bash
# Open PowerShell and run:
psql -U postgres -c "CREATE DATABASE airmap;"

# When prompted for password, enter: wizard
```

If you get "password authentication failed", check if your postgres password is different.

---

### Step 2: Create Environment File
```bash
# Copy the example environment file
cp .env.example .env
```

The `.env` file should contain:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=airmap
DB_USER=postgres
DB_PASSWORD=wizard

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h

# MQTT (optional)
MQTT_ENABLED=false
```

---

### Step 3: Install Backend Dependencies
```bash
cd mock-server
npm install
cd ..
```

---

### Step 4: Run Database Migration
```bash
cd mock-server
npm run migrate
```

This will create all database tables.

---

### Step 5: Seed Sample Data (Optional)
```bash
# Still in mock-server directory
npm run seed
```

This creates 10 sample devices.

---

### Step 6: Install Frontend Dependencies
```bash
# Go back to project root
cd ..
npm install
```

---

### Step 7: Start the Application

**Option A: Run Everything Together**
```bash
npm run start:all
```

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
cd mock-server
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run dev
```

---

### Step 8: Access the Application

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health

---

## Troubleshooting

### If PostgreSQL connection fails:
```bash
# Check if PostgreSQL service is running
Get-Service postgresql*    # Windows
# or
pg_isready -U postgres
```

### If port 3001 is already in use:
```bash
# Find and kill the process
netstat -ano | findstr :3001
taskkill /F /PID <PID_NUMBER>
```

### If migration fails:
```bash
# Make sure you're in mock-server directory
cd mock-server
npm run migrate
```

---

## Docker Alternative

If you prefer Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## What's Next?

1. Open http://localhost:3000 in your browser
2. Explore the Live Map
3. View device hub
4. Check analytics
5. Try connecting IoT devices

---

## Default Credentials

If you want to login:
- Create account via: POST /api/auth/register
- Or use the default admin (if seeded):
  - Email: admin@airmap.local
  - Password: admin123 (you'll need to set this up)

---

## Need Help?

If anything fails:
1. Check the terminal output for error messages
2. Verify PostgreSQL is running
3. Make sure ports 3000 and 3001 are available
4. Check that all dependencies are installed

