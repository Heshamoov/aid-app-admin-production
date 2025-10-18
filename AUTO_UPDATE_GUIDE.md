# Aid Platform Auto-Update System

## Overview

The Aid Platform includes a comprehensive auto-update system that allows remote maintenance from UAE to Syria. The system automatically checks for updates from GitHub, downloads them, and applies them safely with automatic rollback capability in case of failures.

## Features

### 1. **Automatic Update Checking**
- Checks for updates once per day (configurable)
- Works only when internet connection is available
- Fails gracefully when offline - app continues to work

### 2. **Safe Update Process**
- Creates automatic backups before updating
- Preserves database during updates
- Automatic rollback on failure
- Keeps last 5 backups for safety

### 3. **Update Logging**
- All update activities logged to `logs/update.log`
- Includes timestamps, version changes, and any errors
- Helps with troubleshooting and audit trail

### 4. **User Notifications**
- Visual notification in the app when updates are available
- Shows current and latest version numbers
- Can be dismissed by users

## Setup Instructions

### Initial Setup (One-time)

1. **Ensure Git is Configured**
   ```bash
   cd aid-app
   git remote -v  # Should show: git@github.com:Heshamoov/aid-app.git
   ```

2. **Set Up SSH Keys (if not already done)**
   ```bash
   # Generate SSH key
   ssh-keygen -t ed25519 -C "your_email@example.com"
   
   # Add to GitHub account
   cat ~/.ssh/id_ed25519.pub
   # Copy this and add to GitHub: Settings → SSH Keys → New SSH Key
   ```

3. **Enable Auto-Updates on Windows**
   
   Run as Administrator:
   ```batch
   setup_auto_update.bat
   ```
   
   This creates a Windows scheduled task that runs daily at 3:00 AM.

### Manual Update

To manually check for and install updates:

**Windows:**
```batch
update_app.bat
```

**Linux/Mac:**
```bash
./update-aid-app.sh --force
```

## How It Works

### Update Process Flow

1. **Check Internet Connection**
   - Pings 8.8.8.8 and 1.1.1.1 to verify connectivity
   - If offline, skips update check

2. **Fetch Latest Version**
   - Runs `git fetch origin main`
   - Compares local and remote commit hashes

3. **Create Backup**
   - Backs up frontend and backend code
   - Excludes database to save space
   - Stores in `backups/backup_YYYYMMDD_HHMMSS/`

4. **Stop Services**
   - Gracefully stops PocketBase and SvelteKit

5. **Download Updates**
   - Runs `git pull origin main`
   - Installs new dependencies if needed

6. **Restart Services**
   - Starts PocketBase and SvelteKit
   - Verifies services are running

7. **Cleanup**
   - Removes old backups (keeps last 5)
   - Updates last check timestamp

### Rollback on Failure

If any step fails:
1. Automatically triggers rollback
2. Restores from latest backup
3. Preserves database
4. Restarts services
5. Logs the failure

## Configuration

### Update Check Interval

Edit `update-aid-app.sh`:
```bash
UPDATE_INTERVAL=86400  # 24 hours in seconds
```

Common values:
- 3600 = 1 hour
- 43200 = 12 hours
- 86400 = 24 hours (default)
- 604800 = 1 week

### Scheduled Task Time

To change the daily update time on Windows:

1. Open Task Scheduler
2. Find "Aid Platform Auto-Update"
3. Right-click → Properties → Triggers
4. Edit the time (default: 3:00 AM)

## Maintenance from UAE

### Pushing Updates to Syria

1. **Make Changes Locally (in UAE)**
   ```bash
   cd aid-app
   # Make your changes
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

2. **Automatic Deployment**
   - The Syria laptop will automatically check for updates
   - Updates will be applied during the next scheduled check (default: 3:00 AM)
   - Or manually trigger: run `update_app.bat`

3. **Verify Update**
   - Check `logs/update.log` on Syria laptop
   - Or check the update notification in the app UI

### Emergency Updates

For urgent updates that can't wait for the scheduled time:

1. **Contact Syria Team**
   - Ask them to run `update_app.bat`
   - Or guide them through manual update

2. **Remote Access** (if available)
   - Use TeamViewer, AnyDesk, or similar
   - Run `update_app.bat` directly

## Monitoring

### Check Update Logs

**Windows:**
```batch
notepad logs\update.log
```

**Linux/Mac:**
```bash
tail -f logs/update.log
```

### Check Last Update Time

```bash
cat .last_update_check
# Shows Unix timestamp of last check
```

Convert to readable date:
```bash
date -d @$(cat .last_update_check)
```

### View Backups

```bash
ls -lh backups/
```

Each backup folder contains:
- `frontend/` - Complete frontend code
- `backend/` - Backend code (excluding database)

## Troubleshooting

### Updates Not Working

1. **Check Internet Connection**
   ```bash
   ping 8.8.8.8
   ```

2. **Check Git Configuration**
   ```bash
   cd aid-app
   git remote -v
   git status
   ```

3. **Check SSH Keys**
   ```bash
   ssh -T git@github.com
   # Should say: "Hi Heshamoov! You've successfully authenticated"
   ```

4. **Check Update Log**
   ```bash
   tail -50 logs/update.log
   ```

### Rollback Failed

If automatic rollback fails:

1. **Manual Rollback**
   ```bash
   cd aid-app/backups
   ls -lt  # Find latest backup
   
   # Stop services
   ../stop-aid-app.sh
   
   # Restore from backup
   cp -r backup_YYYYMMDD_HHMMSS/frontend ../
   cp -r backup_YYYYMMDD_HHMMSS/backend ../
   
   # Restart services
   ../start-aid-app.sh
   ```

### Database Issues After Update

The database should never be affected by updates, but if issues occur:

1. **Check Database Backups**
   ```bash
   ls -lh backend/pb_data/backups/
   ```

2. **Restore from Backup**
   ```bash
   cd backend/pb_data
   cp backups/data.db.backup data.db
   ```

## Security Considerations

1. **SSH Keys**
   - Keep private keys secure
   - Never share private keys
   - Use passphrase protection

2. **Access Control**
   - Only authorized personnel should have GitHub write access
   - Use branch protection rules on GitHub

3. **Testing**
   - Test updates in development before pushing to production
   - Have rollback plan ready

## Best Practices

1. **Regular Updates**
   - Push updates during low-usage hours
   - Avoid updating during critical operations

2. **Communication**
   - Notify Syria team before major updates
   - Document changes in commit messages

3. **Backup Strategy**
   - System keeps last 5 automatic backups
   - Consider additional manual backups before major changes

4. **Monitoring**
   - Regularly check update logs
   - Verify updates were applied successfully

## Files Reference

- `update-aid-app.sh` - Main update script (Linux/Mac)
- `update_app.bat` - Manual update trigger (Windows)
- `setup_auto_update.bat` - Auto-update setup (Windows)
- `logs/update.log` - Update activity log
- `.last_update_check` - Timestamp of last check
- `backups/` - Automatic backup directory

## Support

For issues or questions:
1. Check `logs/update.log` for errors
2. Review this documentation
3. Contact the development team
4. Check GitHub repository issues

---

**Last Updated:** October 2025  
**Version:** 1.0

