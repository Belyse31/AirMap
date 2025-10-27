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

# Health check script for database connectivity
RUN echo '#!/bin/sh' > /app/health-check.sh && \
    echo 'set -e' >> /app/health-check.sh && \
    echo 'echo "Checking database connection..."' >> /app/health-check.sh && \
    echo 'counter=0' >> /app/health-check.sh && \
    echo 'while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; do' >> /app/health-check.sh && \
    echo '  counter=$((counter + 1))' >> /app/health-check.sh && \
    echo '  if [ $counter -gt 30 ]; then' >> /app/health-check.sh && \
    echo '    echo "Database connection timeout after 60 seconds"' >> /app/health-check.sh && \
    echo '    exit 1' >> /app/health-check.sh && \
    echo '  fi' >> /app/health-check.sh && \
    echo '  echo "Waiting for database... ($counter/30)"' >> /app/health-check.sh && \
    echo '  sleep 2' >> /app/health-check.sh && \
    echo 'done' >> /app/health-check.sh && \
    echo 'echo "✓ Database is ready!"' >> /app/health-check.sh && \
    chmod +x /app/health-check.sh

# Install postgresql-client for pg_isready
RUN apk add --no-cache postgresql-client

# Expose port
EXPOSE 3001

# Run database check, migration, then start server
CMD ["sh", "-c", "./health-check.sh && node migrations/migrate.js && node server.js"]
