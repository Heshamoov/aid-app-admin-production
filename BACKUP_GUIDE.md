# Aid Platform Backup System Guide

## Overview

The Aid Platform includes a comprehensive automatic backup system designed to protect against data loss from power outages, hardware failures, and accidental deletion. The system creates multiple layers of backups with different retention policies.

## Backup Strategy

### Two-Tier Backup System

1. **Local Backups (Hourly)**
   - Created every hour automatically
   - Stored in `backend/pb_data/backups/`
   - Keeps last 24 backups (1 day of history)
   - Quick recovery for recent issues

2. **Export Backups (Daily)**
   - Created every day at 2:00 AM
   - Stored in `exports/` directory
   - Compressed with gzip (90%+ compression)
   - Keeps last 30 backups (1 month of history)
   - Designed for external storage/transfer

### What Gets Backed Up

- **Included:**
  - Complete SQLite database
  - All user accounts and permissions
  - All financial records (donations, expenses)
  - All forms, submissions, and answers
  - All inventory records
  - System configuration

- **Not Included:**
  - Application code (managed by git)
  - Log files (regenerated)
  - Temporary files

## Setup Instructions

### Automatic Backups (Recommended)

**Windows:**

1. Run as Administrator:
   ```batch
   setup_auto_backup.bat
   ```

2. Confirm the setup when prompted

3. Verify tasks were created:
   - Open Task Scheduler
   - Look for "Aid Platform Hourly Backup" and "Aid Platform Daily Backup"

**Linux/Mac:**

1. Add to crontab:
   ```bash
   crontab -e
   ```

2. Add these lines:
   ```cron
   # Hourly backup
   0 * * * * /home/ubuntu/aid-app/backend/backup-database.sh
   
   # Daily backup at 2 AM
   0 2 * * * /home/ubuntu/aid-app/backend/backup-database.sh
   ```

### Manual Backup

To create a backup manually at any time:

**Windows:**
```batch
cd backend
backup_database.bat
```

**Linux/Mac:**
```bash
cd backend
./backup-database.sh
```

## Backup Locations

### Local Backups
```
backend/pb_data/backups/data_YYYYMMDD_HHMMSS.db
```

Example:
```
backend/pb_data/backups/data_20251017_085906.db
```

### Export Backups
```
exports/aid_platform_backup_YYYYMMDD_HHMMSS.db.gz
```

Example:
```
exports/aid_platform_backup_20251017_085906.db.gz
```

### Backup Logs
```
backend/pb_data/backup.log
```

## Restoration Procedures

### Restore from Local Backup

1. **Stop the application:**
   ```batch
   stop-aid-app.bat
   ```

2. **Identify the backup to restore:**
   ```bash
   cd backend/pb_data/backups
   ls -lt  # Shows backups sorted by date
   ```

3. **Restore the database:**
   ```bash
   cd backend/pb_data
   cp data.db data.db.old  # Backup current state
   cp backups/data_20251017_085906.db data.db
   ```

4. **Restart the application:**
   ```batch
   start-aid-app.bat
   ```

### Restore from Export Backup

1. **Stop the application:**
   ```batch
   stop-aid-app.bat
   ```

2. **Decompress the backup:**
   ```bash
   cd exports
   gunzip -c aid_platform_backup_20251017_085906.db.gz > restored.db
   ```

3. **Restore the database:**
   ```bash
   cd ../backend/pb_data
   cp data.db data.db.old  # Backup current state
   cp ../../exports/restored.db data.db
   ```

4. **Restart the application:**
   ```batch
   start-aid-app.bat
   ```

### Restore from External Storage

If you've copied export backups to USB drive or cloud storage:

1. Copy the backup file back to the exports directory
2. Follow the "Restore from Export Backup" procedure above

## Best Practices

### Regular Maintenance

1. **Check Backup Status**
   - Weekly: Verify backups are being created
   - Check `backend/pb_data/backup.log`
   - Verify backup file dates

2. **External Storage**
   - Weekly: Copy latest export backup to USB drive
   - Monthly: Copy to cloud storage (Google Drive, Dropbox, etc.)
   - Keep at least 2 external copies

3. **Test Restoration**
   - Monthly: Test restoring from a backup
   - Verify data integrity after restoration
   - Document any issues

### Storage Management

**Disk Space Monitoring:**
- Local backups: ~250KB each × 24 = ~6MB
- Export backups: ~20KB each × 30 = ~600KB
- Total: ~7MB (negligible)

**If Disk Space is Limited:**
- Reduce retention in backup script
- Move export backups to external storage more frequently
- Compress local backups as well

### Security Considerations

1. **Access Control**
   - Protect backup directories with appropriate permissions
   - Limit access to authorized personnel only

2. **External Storage**
   - Encrypt backups when storing on cloud services
   - Use password-protected USB drives
   - Keep external backups in secure location

3. **Data Privacy**
   - Backups contain sensitive donor and beneficiary information
   - Follow organizational data protection policies
   - Securely delete old backups when no longer needed

## Monitoring and Verification

### Check Backup Status

**View Recent Backups:**
```bash
# Local backups
ls -lht backend/pb_data/backups/ | head -10

# Export backups
ls -lht exports/ | head -10
```

**Check Backup Log:**
```bash
# View last 50 lines
tail -50 backend/pb_data/backup.log

# View today's backups
grep "$(date +%Y-%m-%d)" backend/pb_data/backup.log
```

**Verify Backup Integrity:**
```bash
# Check if backup is a valid SQLite database
sqlite3 backend/pb_data/backups/data_20251017_085906.db "PRAGMA integrity_check;"
# Should output: ok
```

### Scheduled Task Status

**Windows:**
```batch
# List all Aid Platform tasks
schtasks /query /tn "Aid Platform*" /fo list

# Check last run time
schtasks /query /tn "Aid Platform Hourly Backup" /v /fo list | findstr "Last Run"
```

**Linux/Mac:**
```bash
# View crontab
crontab -l

# Check cron logs
grep backup /var/log/syslog
```

## Troubleshooting

### Backup Not Running

1. **Check Scheduled Task:**
   - Open Task Scheduler (Windows)
   - Verify task exists and is enabled
   - Check last run time and result

2. **Check Permissions:**
   - Ensure task runs with appropriate privileges
   - Verify write permissions on backup directories

3. **Check Disk Space:**
   ```bash
   df -h  # Linux/Mac
   # or
   dir  # Windows
   ```

4. **Check Logs:**
   ```bash
   tail -100 backend/pb_data/backup.log
   ```

### Backup Files Not Created

1. **Verify Database Exists:**
   ```bash
   ls -lh backend/pb_data/data.db
   ```

2. **Check Directory Permissions:**
   ```bash
   ls -ld backend/pb_data/backups/
   mkdir -p backend/pb_data/backups/  # Create if missing
   ```

3. **Run Manual Backup:**
   ```bash
   cd backend
   ./backup-database.sh
   ```

### Restoration Failed

1. **Verify Backup File:**
   ```bash
   sqlite3 backup_file.db "PRAGMA integrity_check;"
   ```

2. **Check File Permissions:**
   ```bash
   chmod 644 backend/pb_data/data.db
   ```

3. **Verify PocketBase is Stopped:**
   ```bash
   ps aux | grep pocketbase
   # Should show no running process
   ```

## Disaster Recovery Plan

### Complete System Failure

If the entire system fails:

1. **Install Fresh System:**
   - Install Windows/Linux
   - Install Git, Node.js, PocketBase

2. **Clone Repository:**
   ```bash
   git clone git@github.com:Heshamoov/aid-app.git
   cd aid-app
   ```

3. **Restore Database:**
   - Copy latest backup from external storage
   - Place in `backend/pb_data/data.db`

4. **Start Application:**
   ```batch
   start-aid-app.bat
   ```

### Data Corruption

If database becomes corrupted:

1. **Stop Application**
2. **Try SQLite Recovery:**
   ```bash
   sqlite3 data.db ".recover" | sqlite3 recovered.db
   ```
3. **If Recovery Fails:**
   - Restore from most recent backup
   - Accept data loss since last backup

### Accidental Deletion

If records are accidentally deleted:

1. **Don't Panic** - Backups exist!
2. **Identify Last Good Backup:**
   - Check backup.log for timestamps
   - Identify backup before deletion
3. **Restore from Backup:**
   - Follow restoration procedure above
4. **Verify Data:**
   - Check that deleted records are restored
   - Verify no other data was affected

## Backup Checklist

### Daily
- [ ] Verify application is running
- [ ] Check that backups directory is growing

### Weekly
- [ ] Review backup.log for errors
- [ ] Verify backup file dates are current
- [ ] Copy latest export backup to USB drive
- [ ] Check disk space usage

### Monthly
- [ ] Test restoration from backup
- [ ] Copy backups to cloud storage
- [ ] Review and clean up very old external backups
- [ ] Verify scheduled tasks are still active

### Quarterly
- [ ] Full disaster recovery test
- [ ] Review and update backup procedures
- [ ] Train staff on restoration procedures
- [ ] Document any issues or improvements

## Support

For backup-related issues:

1. Check `backend/pb_data/backup.log`
2. Review this documentation
3. Contact technical support
4. Check GitHub repository issues

---

**Remember:** Backups are only useful if they work when you need them. Test your restoration procedures regularly!

**Last Updated:** October 2025  
**Version:** 1.0

