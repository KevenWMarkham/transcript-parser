#!/bin/bash
# Docker Volume Backup Script
# Backs up persistent data for Desktop <-> VPS sync
# Usage: ./scripts/docker-backup.sh [backup_name]

set -e

BACKUP_NAME="${1:-backup-$(date +%Y%m%d-%H%M%S)}"
BACKUP_DIR="./backups"
DATA_DIR="./data"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "=== Docker Volume Backup ==="
echo "Backup name: $BACKUP_NAME"
echo ""

# Function to backup a directory
backup_dir() {
    local dir="$1"
    local name="$2"

    if [ -d "$DATA_DIR/$dir" ]; then
        echo "Backing up $dir..."
        tar -czf "$BACKUP_DIR/${BACKUP_NAME}-${name}.tar.gz" -C "$DATA_DIR" "$dir"
        echo "  -> Created: ${BACKUP_NAME}-${name}.tar.gz"
    else
        echo "  -> Skipped: $dir (not found)"
    fi
}

# Backup PostgreSQL data
backup_dir "postgres" "postgres"

# Backup N8N workflows
backup_dir "n8n" "n8n"

# Backup app data
backup_dir "uploads" "uploads"
backup_dir "transcripts" "transcripts"
backup_dir "exports" "exports"

# Create manifest
cat > "$BACKUP_DIR/${BACKUP_NAME}-manifest.json" << EOF
{
  "name": "$BACKUP_NAME",
  "created": "$(date -Iseconds)",
  "hostname": "$(hostname)",
  "files": [
    "${BACKUP_NAME}-postgres.tar.gz",
    "${BACKUP_NAME}-n8n.tar.gz",
    "${BACKUP_NAME}-uploads.tar.gz",
    "${BACKUP_NAME}-transcripts.tar.gz",
    "${BACKUP_NAME}-exports.tar.gz"
  ]
}
EOF

echo ""
echo "=== Backup Complete ==="
echo "Location: $BACKUP_DIR"
echo "Manifest: ${BACKUP_NAME}-manifest.json"
echo ""
echo "To transfer to VPS:"
echo "  scp $BACKUP_DIR/${BACKUP_NAME}-*.tar.gz user@vps:/path/to/backups/"
echo ""
echo "To restore on VPS:"
echo "  ./scripts/docker-restore.sh $BACKUP_NAME"
