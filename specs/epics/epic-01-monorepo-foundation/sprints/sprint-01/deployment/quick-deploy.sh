#!/bin/bash
# Quick deployment script for SmartHavenAI.com
# Run this ON THE VPS after uploading the tar.gz file

set -e  # Exit on error

echo "🚀 SmartHavenAI.com Quick Deploy Script"
echo "========================================"

# Configuration
DEPLOY_DIR="/var/www/smarthaven"
BACKUP_DIR="/var/www/smarthaven-backup-$(date +%Y%m%d-%H%M%S)"
PACKAGE_FILE="/tmp/transcript-parser-root-deployment.tar.gz"

# Check if package exists
if [ ! -f "$PACKAGE_FILE" ]; then
    echo "❌ Error: Package file not found at $PACKAGE_FILE"
    echo "Please upload it first:"
    echo "  scp transcript-parser-root-deployment.tar.gz root@72.62.86.210:/tmp/"
    exit 1
fi

echo "✅ Package found: $PACKAGE_FILE"

# Backup existing deployment
if [ -d "$DEPLOY_DIR" ]; then
    echo "📦 Backing up existing deployment to: $BACKUP_DIR"
    mv "$DEPLOY_DIR" "$BACKUP_DIR"

    # Stop containers from backup location
    echo "⏹️  Stopping old containers..."
    cd "$BACKUP_DIR"
    docker compose down || true
fi

# Create new deployment directory
echo "📁 Creating deployment directory: $DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"
cd "$DEPLOY_DIR"

# Extract package
echo "📦 Extracting package..."
tar -xzf "$PACKAGE_FILE"

# Copy environment file from backup if it exists
if [ -f "$BACKUP_DIR/.env.production" ]; then
    echo "♻️  Copying environment file from backup..."
    cp "$BACKUP_DIR/.env.production" "$DEPLOY_DIR/.env.production"
else
    echo "⚠️  No existing .env.production found"
    echo "Please create one before starting services:"
    echo "  cp specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/.env.production.example .env.production"
    echo "  nano .env.production"
fi

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo ""
    echo "⚠️  WARNING: .env.production not found!"
    echo "Creating from template..."
    cp specs/epics/epic-01-monorepo-foundation/sprints/sprint-01/deployment/.env.production.example .env.production
    echo ""
    echo "❗ IMPORTANT: Edit .env.production with your actual values:"
    echo "  nano .env.production"
    echo ""
    read -p "Press Enter after editing .env.production to continue..."
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker compose up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 5

# Check status
echo ""
echo "📊 Container Status:"
docker compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at:"
echo "   https://smarthavenai.com"
echo ""
echo "📝 To view logs:"
echo "   docker compose logs -f"
echo ""
echo "🔍 To check specific service:"
echo "   docker compose logs -f app"
echo "   docker compose logs -f nginx"
echo ""
echo "🔄 To restart a service:"
echo "   docker compose restart app"
echo ""
echo "🛑 To stop all services:"
echo "   docker compose down"
echo ""

# Check if services are healthy
echo "🏥 Checking service health..."
sleep 3

HEALTHY_COUNT=$(docker compose ps --format json | grep -c '"Health":"healthy"' || true)
TOTAL_COUNT=$(docker compose ps --format json | wc -l || true)

if [ "$HEALTHY_COUNT" -gt 0 ]; then
    echo "✅ $HEALTHY_COUNT/$TOTAL_COUNT containers are healthy"
else
    echo "⚠️  Warning: Some containers may not be healthy yet"
    echo "Check logs with: docker compose logs -f"
fi

echo ""
echo "🎉 Done! Check https://smarthavenai.com to verify deployment"
