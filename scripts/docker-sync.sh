#!/bin/bash
# Docker Volume Sync Script
# Syncs persistent data between Desktop and VPS
# Usage: ./scripts/docker-sync.sh <push|pull> <vps_host>

set -e

ACTION="$1"
VPS_HOST="$2"
VPS_PATH="${3:-/opt/transcript-parser}"

if [ -z "$ACTION" ] || [ -z "$VPS_HOST" ]; then
    echo "Docker Volume Sync - Desktop <-> VPS"
    echo ""
    echo "Usage: $0 <action> <vps_host> [vps_path]"
    echo ""
    echo "Actions:"
    echo "  push   - Upload local data to VPS"
    echo "  pull   - Download VPS data to local"
    echo ""
    echo "Examples:"
    echo "  $0 push root@vps.example.com"
    echo "  $0 pull root@vps.example.com /opt/transcript-parser"
    exit 1
fi

BACKUP_NAME="sync-$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="./backups"

case "$ACTION" in
    push)
        echo "=== Pushing Local Data to VPS ==="
        echo "VPS: $VPS_HOST:$VPS_PATH"
        echo ""

        # Create local backup
        echo "Creating local backup..."
        ./scripts/docker-backup.sh "$BACKUP_NAME"

        # Upload to VPS
        echo ""
        echo "Uploading to VPS..."
        ssh "$VPS_HOST" "mkdir -p $VPS_PATH/backups"
        scp "$BACKUP_DIR/${BACKUP_NAME}"*.tar.gz "$VPS_HOST:$VPS_PATH/backups/"
        scp "$BACKUP_DIR/${BACKUP_NAME}-manifest.json" "$VPS_HOST:$VPS_PATH/backups/"

        echo ""
        echo "=== Push Complete ==="
        echo ""
        echo "To restore on VPS:"
        echo "  ssh $VPS_HOST"
        echo "  cd $VPS_PATH"
        echo "  ./scripts/docker-restore.sh $BACKUP_NAME"
        ;;

    pull)
        echo "=== Pulling VPS Data to Local ==="
        echo "VPS: $VPS_HOST:$VPS_PATH"
        echo ""

        # Create backup on VPS
        echo "Creating backup on VPS..."
        ssh "$VPS_HOST" "cd $VPS_PATH && ./scripts/docker-backup.sh $BACKUP_NAME"

        # Download from VPS
        echo ""
        echo "Downloading from VPS..."
        mkdir -p "$BACKUP_DIR"
        scp "$VPS_HOST:$VPS_PATH/backups/${BACKUP_NAME}"*.tar.gz "$BACKUP_DIR/"
        scp "$VPS_HOST:$VPS_PATH/backups/${BACKUP_NAME}-manifest.json" "$BACKUP_DIR/"

        echo ""
        echo "=== Pull Complete ==="
        echo "Backup downloaded to: $BACKUP_DIR"
        echo ""
        echo "To restore locally:"
        echo "  ./scripts/docker-restore.sh $BACKUP_NAME"
        ;;

    *)
        echo "Error: Unknown action '$ACTION'"
        echo "Use 'push' or 'pull'"
        exit 1
        ;;
esac
