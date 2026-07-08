#!/bin/bash
# PostgreSQL Automated Backup Script
# Backs up database to local storage and optionally to S3

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/backups/postgresql}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-aig_platform}"
DB_USER="${DB_USER:-aig_user}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BUCKET:-}"
S3_REGION="${S3_REGION:-eu-central-1}"
BACKUP_COMPRESSION="${BACKUP_COMPRESSION:-gzip}" # gzip or none
SLACK_WEBHOOK="${SLACK_WEBHOOK:-}"

# Create timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="aig-platform_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting backup: $BACKUP_NAME"

# Perform backup
if [ "$BACKUP_COMPRESSION" = "gzip" ]; then
  BACKUP_PATH="${BACKUP_PATH}.gz"
  pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --db="$DB_NAME" \
    --verbose \
    --format=plain \
    --compress=9 \
    --file="$BACKUP_PATH"
else
  pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --db="$DB_NAME" \
    --verbose \
    --format=plain \
    --file="$BACKUP_PATH"
fi

BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup completed: $BACKUP_SIZE"

# Upload to S3 if configured
if [ -n "$S3_BUCKET" ]; then
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] Uploading to S3: s3://$S3_BUCKET/backups/$BACKUP_NAME"
  
  aws s3 cp "$BACKUP_PATH" "s3://$S3_BUCKET/backups/$BACKUP_NAME" \
    --region="$S3_REGION" \
    --storage-class STANDARD_IA \
    --sse AES256
  
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] S3 upload completed"
fi

# Clean up old backups (local)
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Cleaning old backups (retention: ${RETENTION_DAYS} days)"
find "$BACKUP_DIR" -name "aig-platform_*.sql*" -mtime +$RETENTION_DAYS -delete
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Cleanup completed"

# Send Slack notification
if [ -n "$SLACK_WEBHOOK" ]; then
  BACKUP_COUNT=$(find "$BACKUP_DIR" -name "aig-platform_*.sql*" | wc -l)
  
  curl -X POST "$SLACK_WEBHOOK" \
    -H 'Content-Type: application/json' \
    -d "{
      \"text\": \"✅ Database Backup Complete\",
      \"blocks\": [
        {
          \"type\": \"section\",
          \"text\": {
            \"type\": \"mrkdwn\",
            \"text\": \"*Database Backup Summary*\n*Database:* $DB_NAME\n*Size:* $BACKUP_SIZE\n*Timestamp:* $TIMESTAMP\n*Local Backups:* $BACKUP_COUNT\n*Retention:* ${RETENTION_DAYS} days\"
          }
        }
      ]
    }"
fi

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Backup process finished successfully"
