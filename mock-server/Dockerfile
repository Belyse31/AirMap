FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p data logs

# Expose port
EXPOSE 3001

# Run migration and start server
CMD ["sh", "-c", "node migrations/migrate.js && node server.js"]
