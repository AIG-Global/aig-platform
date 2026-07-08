#!/bin/bash
# Database Recovery Script
# Restores from backup with verification

set -e

# Configuration
BACKUP_FILE="${1:?Usage: ./recover-database.sh <backup_file> [target_database]}"
TARGET_DB="${2:-aig_platform_recover}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${DB_USER:-aig_user}"
RECOVERY_LOG="/tmp/recovery_$(date +%s).log"

echo "============================================================"
echo "Database Recovery from Backup"
echo "============================================================"
echo "Backup File: $BACKUP_FILE"
echo "Target Database: $TARGET_DB"
echo "Recovery Log: $RECOVERY_LOG"
echo "Timestamp: $(date +'%Y-%m-%d %H:%M:%S')"
echo ""

# Verify backup exists
if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ ERROR: Backup file not found: $BACKUP_FILE"
  exit 1
fi

echo "✓ Backup file verified: $BACKUP_FILE"
echo "✓ File size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Verify backup integrity
echo ""
echo "Verifying backup integrity..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
  if gunzip -t "$BACKUP_FILE" 2>&1 | tee -a "$RECOVERY_LOG"; then
    echo "✓ Backup integrity verified"
  else
    echo "❌ ERROR: Backup file is corrupted"
    exit 1
  fi
fi

# Create target database (optional)
echo ""
echo "Setting up recovery database..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$TARGET_DB'" | grep -q 1 || \
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -c "CREATE DATABASE \"$TARGET_DB\"" 2>&1 | tee -a "$RECOVERY_LOG"

echo "✓ Database ready: $TARGET_DB"

# Perform restore
echo ""
echo "Restoring from backup... (this may take a few minutes)"
echo "Recovery log: $RECOVERY_LOG"

START_TIME=$(date +%s)

if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TARGET_DB" 2>&1 | tee -a "$RECOVERY_LOG"
else
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TARGET_DB" -f "$BACKUP_FILE" 2>&1 | tee -a "$RECOVERY_LOG"
fi

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ ${PIPESTATUS[1]} -eq 0 ]; then
  echo ""
  echo "✅ Recovery completed successfully"
  
  # Verify recovery
  echo ""
  echo "Verifying recovered database..."
  TABLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TARGET_DB" -tc \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'" | tr -d ' ')
  
  ROW_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TARGET_DB" -tc \
    "SELECT sum(n_live_tup) FROM pg_stat_user_tables" | tr -d ' ')
  
  echo "✓ Tables: $TABLE_COUNT"
  echo "✓ Rows: $ROW_COUNT"
  echo "✓ Duration: ${DURATION}s"
  
  echo ""
  echo "============================================================"
  echo "✅ Recovery Process Complete"
  echo "============================================================"
  echo ""
  echo "Database Information:"
  echo "  - Host: $DB_HOST"
  echo "  - Port: $DB_PORT"
  echo "  - Database: $TARGET_DB"
  echo "  - User: $DB_USER"
  echo "  - Tables: $TABLE_COUNT"
  echo "  - Total Rows: $ROW_COUNT"
  echo "  - Duration: ${DURATION}s"
  echo ""
  echo "Connection String:"
  echo "  postgresql://$DB_USER:PASSWORD@$DB_HOST:$DB_PORT/$TARGET_DB"
  echo ""
  echo "Recovery Log: $RECOVERY_LOG"
  echo "============================================================"
else
  echo ""
  echo "❌ ERROR: Recovery failed"
  echo "Recovery log: $RECOVERY_LOG"
  exit 1
fi
