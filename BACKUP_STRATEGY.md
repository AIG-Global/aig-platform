# Database Backup & Recovery Strategy

## Overview
Comprehensive automated backup strategy for AIGINVEST PostgreSQL database with multiple redundancy layers, verification, and recovery procedures.

## Architecture

### Backup Tiers
```
Tier 1: Local Backups (Fast Access)
├── Hourly: Last 24 hours
├── Daily: Last 7 days
└── Weekly: Last 4 weeks

Tier 2: AWS S3 (Disaster Recovery)
├── Daily backups: Last 90 days
└── Weekly archives: Indefinite retention

Tier 3: Cold Storage (Compliance)
└── Monthly snapshots on external drive
```

## Backup Configuration

### Hourly Backups (Development/Staging)
```bash
# Cron: 0 */1 * * *
# Retention: 24 hours
BACKUP_COMPRESSION=gzip
BACKUP_RETENTION_DAYS=1
```

### Daily Backups (Production)
```bash
# Cron: 0 2 * * *
# Retention: 30 days
BACKUP_COMPRESSION=gzip
BACKUP_RETENTION_DAYS=30
S3_BUCKET=aig-platform-backups
S3_REGION=eu-central-1
```

### Weekly Full Backups with S3 Upload
```bash
# Cron: 0 3 * * 0
# Retention: Indefinite on S3
# Storage class: STANDARD_IA (cheaper)
BACKUP_COMPRESSION=gzip
S3_STORAGE_CLASS=STANDARD_IA
```

## Files

### Backup Scripts
1. **backup-database.sh** - Main backup script
   - Creates PostgreSQL dump
   - Compresses with gzip
   - Uploads to S3
   - Cleans up old backups
   - Sends Slack notifications

2. **verify-backup.sh** - Backup verification
   - Tests gzip integrity
   - Validates SQL syntax
   - Counts tables and statements
   - Verifies critical tables exist

3. **recover-database.sh** - Recovery procedure
   - Restores from backup
   - Creates target database
   - Verifies recovery success
   - Reports statistics

4. **setup-cron-jobs.sh** - Cron configuration
   - Sets up backup user
   - Creates backup directory
   - Configures cron jobs
   - Verifies permissions

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aig_platform
DB_USER=aig_user

# Backup
BACKUP_DIR=/backups/postgresql
BACKUP_COMPRESSION=gzip              # gzip or none
RETENTION_DAYS=30                    # Keep backups for N days

# S3 (Optional)
S3_BUCKET=aig-platform-backups
S3_REGION=eu-central-1
BACKUP_COMPRESSION=gzip

# Notifications
SLACK_WEBHOOK=https://hooks.slack.com/services/XXX/YYY/ZZZ
```

## Usage

### Initial Setup
```bash
# 1. Copy scripts to server
scp scripts/backup-*.sh scripts/recover-*.sh scripts/setup-cron-jobs.sh root@server:/opt/aig-platform/scripts/

# 2. Set up cron jobs
ssh root@server "bash /opt/aig-platform/scripts/setup-cron-jobs.sh"

# 3. Configure cron file
ssh root@server "nano /etc/cron.d/aig-platform-backup"
```

### Manual Backup
```bash
/opt/aig-platform/scripts/backup-database.sh
```

### Verify Backup
```bash
/opt/aig-platform/scripts/verify-backup.sh /backups/postgresql/aig-platform_20260708_020000.sql.gz
```

### Recover from Backup
```bash
# Restore to recovery database
/opt/aig-platform/scripts/recover-database.sh /backups/postgresql/aig-platform_20260708_020000.sql.gz aig_platform_recover

# Then swap databases:
sudo -u postgres psql -c "ALTER DATABASE aig_platform RENAME TO aig_platform_old"
sudo -u postgres psql -c "ALTER DATABASE aig_platform_recover RENAME TO aig_platform"
```

## Recovery Time Objectives (RTO)

| Scenario | RTO | Recovery Method |
|----------|-----|-----------------|
| Data corruption | 5-10 min | Restore from hourly backup |
| Database crash | 15-30 min | Restore from daily backup |
| Server failure | 30-60 min | Restore to new server from S3 |
| Data center loss | 2-4 hours | Failover to DR site from S3 |
| Long-term archive | N/A | Restore from cold storage |

## Recovery Point Objectives (RPO)

| Backup Type | RPO | Notes |
|------------|-----|-------|
| Hourly | 1 hour | Max data loss: 1 hour |
| Daily | 24 hours | Suitable for most cases |
| Weekly | 7 days | Long-term retention |

## Monitoring & Alerts

### Slack Notifications
Backups send automated Slack messages:
```
✅ Database Backup Complete
Database: aig_platform
Size: 245.3 MB
Timestamp: 2026-07-08T02:00:00Z
Local Backups: 30
Retention: 30 days
```

### Failure Alerts
```
❌ Backup Failed
Database: aig_platform
Error: Connection refused
Timestamp: 2026-07-08T02:15:30Z
Action: Check database availability
```

### Monitoring Commands
```bash
# Check backup status
ls -lh /backups/postgresql/

# Monitor backup size
du -sh /backups/postgresql/

# Check S3 backups
aws s3 ls s3://aig-platform-backups/backups/ --region eu-central-1

# Monitor cron jobs
tail -f /var/log/aig-backup*.log

# Check cron execution
sudo grep CRON /var/log/syslog
```

## Best Practices

### Backup Security
1. **Encryption**: Backups encrypted in transit (HTTPS to S3)
2. **Storage**: Use S3 versioning and MFA delete
3. **Access**: Restrict to backup user only
4. **Credentials**: Store in environment variables, not in scripts

### Testing Recovery
1. **Monthly**: Test restore procedure on test database
2. **Quarterly**: Full recovery drill to new infrastructure
3. **Annually**: Document and review RTO/RPO

### Retention Policy
- **Local**: 30 days (cost-effective, fast access)
- **S3 Standard**: 90 days (frequent access possible)
- **S3 Glacier**: 1+ years (long-term compliance)
- **Cold Storage**: Indefinite (regulatory requirement)

### Cost Optimization
- Use S3 lifecycle policies to move old backups to Glacier
- Use STANDARD_IA storage class for infrequent access
- Compress backups (gzip: ~80% size reduction)
- Delete backups after retention period

## Troubleshooting

### Backup Fails to Run
```bash
# Check cron is running
sudo service cron status

# Check backup user permissions
ls -l /backups/postgresql/

# Check database connectivity
psql -h localhost -U aig_user -d aig_platform -c "SELECT now()"

# Check logs
tail -f /var/log/aig-backup.log
```

### Backup Verification Fails
```bash
# Test gzip integrity
gunzip -t /backups/postgresql/backup.sql.gz

# Check SQL syntax
head -100 /backups/postgresql/backup.sql | psql

# Verify backup size
du -h /backups/postgresql/backup.sql.gz
```

### Recovery Fails
```bash
# Check target database doesn't exist
psql -l | grep aig_platform

# Verify backup file integrity
file /backups/postgresql/backup.sql.gz

# Check disk space
df -h

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log
```

## Disaster Recovery Plan

### Step 1: Assess Damage
- Check database health: `psql -c "SELECT 1"`
- Verify backup availability
- Check S3 backups exist

### Step 2: Recovery Decision
- **Corruption**: Restore from hourly/daily backup
- **Crash**: Full database recovery from backup
- **Loss**: Provision new infrastructure, restore from S3

### Step 3: Execute Recovery
```bash
# 1. Stop application
docker-compose stop web api

# 2. Recover database
/opt/aig-platform/scripts/recover-database.sh backup.sql.gz

# 3. Verify recovery
psql -c "SELECT COUNT(*) FROM \"user\""
psql -c "SELECT COUNT(*) FROM \"membership\""

# 4. Restart services
docker-compose up -d
```

### Step 4: Validation
- [ ] All tables recovered
- [ ] Data integrity verified
- [ ] Application functioning
- [ ] Sync with microservices
- [ ] Notify stakeholders

## Documentation Links
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)
- [AWS S3 Lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html)
- [Disaster Recovery](https://en.wikipedia.org/wiki/Disaster_recovery)

## Support & Escalation
- **Backup Failure**: Page on-call DBA
- **Recovery Needed**: Execute DR plan, notify stakeholders
- **Questions**: Refer to this document and PostgreSQL docs
