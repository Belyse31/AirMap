# 🚀 Deployment Guide

This guide covers deploying AirMap to various platforms.

## Table of Contents
- [Netlify (Frontend)](#netlify-frontend)
- [Vercel (Frontend)](#vercel-frontend)
- [Heroku (Backend)](#heroku-backend)
- [DigitalOcean (Full Stack)](#digitalocean-full-stack)
- [AWS (Production)](#aws-production)
- [Docker Deployment](#docker-deployment)

---

## Netlify (Frontend)

### Via Web Interface

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend.herokuapp.com/api
   VITE_WS_URL=wss://your-backend.herokuapp.com
   ```

4. **Deploy**
   - Click "Deploy site"
   - Netlify will auto-deploy on every push to main branch

### Via CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

---

## Vercel (Frontend)

### Via Web Interface

1. Import your repository at [vercel.com](https://vercel.com)
2. Vercel auto-detects Vite configuration
3. Add environment variables in Settings → Environment Variables
4. Deploy

### Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

**vercel.json** (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "https://your-backend.com/api",
    "VITE_WS_URL": "wss://your-backend.com"
  }
}
```

---

## Heroku (Backend)

### Prerequisites
```bash
npm install -g heroku
heroku login
```

### Deploy Mock Server

1. **Create Heroku App**
   ```bash
   cd mock-server
   git init
   heroku create airmap-backend
   ```

2. **Add Buildpack**
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Create Procfile**
   ```
   web: node server.js
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

5. **Configure Environment**
   ```bash
   heroku config:set NODE_ENV=production
   ```

6. **Open App**
   ```bash
   heroku open
   ```

### WebSocket Support

Heroku supports WebSocket on all dynos. Ensure your client connects to `wss://` (not `ws://`).

---

## DigitalOcean (Full Stack)

### App Platform

1. **Create New App**
   - Go to DigitalOcean → Apps
   - Connect GitHub repository

2. **Configure Frontend Component**
   ```yaml
   name: airmap-frontend
   source_dir: /
   build_command: npm run build
   output_dir: dist
   environment_variables:
     - key: VITE_API_BASE_URL
       value: ${backend.PUBLIC_URL}/api
   ```

3. **Configure Backend Component**
   ```yaml
   name: airmap-backend
   source_dir: /mock-server
   run_command: node server.js
   http_port: 3001
   ```

4. **Deploy**
   - Click "Create Resources"
   - App Platform handles scaling and SSL

### Droplet (VPS)

```bash
# SSH into droplet
ssh root@your-droplet-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo>
cd AirMap

# Install dependencies
npm install
cd mock-server && npm install && cd ..

# Install PM2 for process management
npm install -g pm2

# Start backend
cd mock-server
pm2 start server.js --name airmap-backend
pm2 save
pm2 startup

# Build frontend
cd ..
npm run build

# Install nginx
sudo apt-get install nginx

# Configure nginx (see nginx.conf)
sudo cp nginx.conf /etc/nginx/sites-available/airmap
sudo ln -s /etc/nginx/sites-available/airmap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## AWS (Production)

### Architecture
- **Frontend:** S3 + CloudFront
- **Backend:** EC2 or ECS
- **Database:** RDS (if replacing JSON storage)
- **WebSocket:** ALB with WebSocket support

### Frontend (S3 + CloudFront)

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://airmap-frontend
   aws s3 sync dist/ s3://airmap-frontend --acl public-read
   ```

3. **Configure S3 for Static Hosting**
   ```bash
   aws s3 website s3://airmap-frontend --index-document index.html
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Enable HTTPS
   - Set error pages to redirect to index.html

### Backend (EC2)

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04
   - Instance type: t3.micro (for testing)
   - Security group: Allow ports 80, 443, 3001

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm nginx
   ```

3. **Deploy Application**
   ```bash
   git clone <repo>
   cd AirMap/mock-server
   npm install
   pm2 start server.js
   ```

4. **Configure Nginx as Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.airmap.io;

       location / {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
       }
   }
   ```

5. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.airmap.io
   ```

---

## Docker Deployment

### Single Server

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Docker Swarm (Multi-Server)

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml airmap

# Scale services
docker service scale airmap_backend=3

# Remove stack
docker stack rm airmap
```

### Kubernetes

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: airmap-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: airmap-backend
  template:
    metadata:
      labels:
        app: airmap-backend
    spec:
      containers:
      - name: backend
        image: airmap-backend:latest
        ports:
        - containerPort: 3001
---
apiVersion: v1
kind: Service
metadata:
  name: airmap-backend
spec:
  selector:
    app: airmap-backend
  ports:
  - port: 3001
    targetPort: 3001
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f deployment.yaml
```

---

## Environment-Specific Configurations

### Production Checklist

- [ ] Enable HTTPS/WSS
- [ ] Set secure CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Enable gzip compression
- [ ] Configure CDN for static assets
- [ ] Set up database backups
- [ ] Configure auto-scaling
- [ ] Set up health checks
- [ ] Enable error logging

### Environment Variables

**Production Frontend:**
```env
VITE_API_BASE_URL=https://api.airmap.io/api
VITE_WS_URL=wss://api.airmap.io
VITE_APP_NAME=AirMap
```

**Production Backend:**
```env
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://airmap.io
```

---

## Monitoring & Logging

### Frontend Monitoring

**Sentry Integration:**
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Backend Monitoring

**PM2 Monitoring:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Application Logs:**
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## Troubleshooting

### WebSocket Connection Issues

1. Check firewall allows WebSocket traffic
2. Ensure reverse proxy supports WebSocket upgrade
3. Use `wss://` in production (not `ws://`)
4. Check CORS configuration

### Build Failures

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Performance Issues

1. Enable CDN for static assets
2. Implement Redis caching for API
3. Use database instead of JSON files
4. Enable gzip compression
5. Optimize images and assets

---

## Backup & Recovery

### Data Backup

```bash
# Backup device data
cp mock-server/data/devices.json backups/devices-$(date +%Y%m%d).json

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf $BACKUP_DIR/airmap-$DATE.tar.gz mock-server/data/
```

### Database Migration

When moving from JSON to real database:

1. Export existing data
2. Create database schema
3. Import data
4. Update API endpoints
5. Test thoroughly before switching

---

For more help, see [README.md](./README.md) or contact support.
