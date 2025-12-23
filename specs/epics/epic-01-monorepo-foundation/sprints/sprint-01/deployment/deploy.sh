#!/bin/bash

# Deployment script for SmartHavenAI.com on Hostinger
# Usage: ./scripts/deploy.sh

set -e  # Exit on error

echo "🚀 Starting deployment to SmartHavenAI.com..."

# Configuration
SERVER_USER="${HOSTINGER_USER:-username}"  # Replace with your Hostinger username
SERVER_HOST="${HOSTINGER_HOST:-smarthaven.ai.com}"  # Or IP address
SERVER_PATH="/var/www/smarthaven"
BUILD_DIR="dist"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Running tests...${NC}"
pnpm test || { echo -e "${RED}❌ Unit tests failed${NC}"; exit 1; }
pnpm test:e2e --run || { echo -e "${RED}❌ E2E tests failed${NC}"; exit 1; }

echo -e "${YELLOW}Step 2: Building production bundle...${NC}"
pnpm build || { echo -e "${RED}❌ Build failed${NC}"; exit 1; }

echo -e "${YELLOW}Step 3: Creating deployment package...${NC}"
tar -czf deploy.tar.gz dist/ package.json pnpm-lock.yaml ecosystem.config.js

echo -e "${YELLOW}Step 4: Uploading to server...${NC}"
scp deploy.tar.gz ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/ || {
    echo -e "${RED}❌ Upload failed${NC}"
    rm deploy.tar.gz
    exit 1
}

echo -e "${YELLOW}Step 5: Deploying on server...${NC}"
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
cd /var/www/smarthaven

# Backup current deployment
if [ -d "dist" ]; then
    echo "Creating backup..."
    tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz dist/
    # Keep only last 5 backups
    ls -t backup-*.tar.gz | tail -n +6 | xargs -r rm
fi

# Extract new deployment
echo "Extracting new deployment..."
tar -xzf deploy.tar.gz
rm deploy.tar.gz

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    pnpm install --prod
fi

# Restart PM2 process
if pm2 list | grep -q "transcript-parser"; then
    echo "Restarting PM2 process..."
    pm2 restart transcript-parser
else
    echo "Starting PM2 process..."
    pm2 start ecosystem.config.js
    pm2 save
fi

echo "Deployment complete!"
ENDSSH

echo -e "${GREEN}✅ Deployment successful!${NC}"
echo -e "${GREEN}Visit: https://smarthaven.ai.com${NC}"

# Cleanup local deployment package
rm deploy.tar.gz

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 5
if curl -f -s https://smarthaven.ai.com > /dev/null; then
    echo -e "${GREEN}✅ Site is accessible${NC}"
else
    echo -e "${RED}⚠️  Warning: Site verification failed${NC}"
fi
