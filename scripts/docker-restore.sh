#!/bin/bash
# Docker Volume Restore Script
# Restores persistent data from backup archives
# Usage: ./scripts/docker-restore.sh <backup_name>

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_name>"
    echo ""
    echo "Available backups:"
    ls -1 ./backups/*-manifest.json 2>/dev/null | sed 's/.*\//  /' | sed 's/-manifest.json//'
    exit 1
fi

BACKUP_NAME="$1"
BACKUP_DIR="./backups"
DATA_DIR="./data"

echo "=== Docker Volume Restore ==="
echo "Backup name: $BACKUP_NAME"
echo ""

# Check manifest exists
if [ ! -f "$BACKUP_DIR/${BACKUP_NAME}-manifest.json" ]; then
    echo "Error: Manifest not found: $BACKUP_DIR/${BACKUP_NAME}-manifest.json"
    exit 1
fi

# Prompt for confirmation
echo "WARNING: This will overwrite existing data in $DATA_DIR"
read -p "Continue? (y/N): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Aborted."
    exit 0
fi

# Stop running containers
echo ""
echo "Stopping containers..."
docker-compose down 2>/dev/null || true

# Function to restore a directory
restore_dir() {
    local name="$1"
    local archive="$BACKUP_DIR/${BACKUP_NAME}-${name}.tar.gz"

    if [ -f "$archive" ]; then
        echo "Restoring $name..."
        rm -rf "$DATA_DIR/$name"
        mkdir -p "$DATA_DIR"
        tar -xzf "$archive" -C "$DATA_DIR"
        echo "  -> Restored: $name"
    else
        echo "  -> Skipped: $name (archive not found)"
    fi
}

# Restore all data
restore_dir "postgres"
restore_dir "n8n"
restore_dir "uploads"
restore_dir "transcripts"
restore_dir "exports"

echo ""
echo "=== Restore Complete ==="
echo ""
echo "To start containers:"
echo "  docker-compose up -d"
