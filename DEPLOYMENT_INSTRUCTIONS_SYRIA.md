# Deployment Instructions for Syria Team

## What to Share with Syria Team

You need to share **the entire `aid-app` folder** with the Syria team. This contains everything needed to run the application.

### Method 1: GitHub (Recommended)

Since the code is already on GitHub, the Syria team can simply clone it:

```bash
git clone git@github.com:Heshamoov/aid-app.git
cd aid-app
```

### Method 2: Direct Transfer (If no GitHub access initially)

If the Syria laptop doesn't have GitHub access yet, you can:
1. Zip the entire `aid-app` folder
2. Transfer via USB drive or cloud storage (Google Drive, Dropbox)
3. Extract on the Syria laptop

## Initial Setup on Syria Laptop (One-Time)

Once the `aid-app` folder is on the Syria laptop, follow these steps:

### Step 1: Install Prerequisites

**Required Software:**
1. **Git for Windows** - https://git-scm.com/download/win
2. **Node.js** (v22 or later) - https://nodejs.org/
3. **PocketBase** - Already included in the `backend` folder

### Step 2: Install Dependencies

Open Git Bash (or Command Prompt) and run:

```bash
cd aid-app/frontend
npm install -g pnpm
pnpm install
```

### Step 3: First Launch

**Option A: Using Desktop Shortcut (Easiest)**
1. Double-click `Aid-Platform.desktop` on the desktop
2. The application will start automatically

**Option B: Using Batch File**
1. Navigate to the `aid-app` folder
2. Double-click `start-aid-app.sh` (or run from Git Bash)
3. Wait for services to start
4. Open browser to http://localhost:5173

### Step 4: Login

**Default Admin Credentials:**
- Email: `hesham@admin.com`
- Password: (the password you set)

### Step 5: Setup Auto-Updates (Recommended)

1. Right-click `setup_auto_update.bat`
2. Select "Run as Administrator"
3. Follow the prompts to create scheduled task

This will automatically check for updates daily at 3:00 AM.

### Step 6: Setup Auto-Backups (Critical!)

1. Right-click `setup_auto_backup.bat`
2. Select "Run as Administrator"
3. Follow the prompts to create scheduled tasks

This will:
- Create hourly backups (keeps last 24)
- Create daily exports (keeps last 30)

## Important Files for Syria Team

### Files They Will Use:

| File | Purpose | When to Use |
|------|---------|-------------|
| `start-aid-app.sh` | Start the application | Every time they want to use the app |
| `stop-aid-app.sh` | Stop the application | When shutting down |
| `Aid-Platform.desktop` | Desktop shortcut | Daily use (easiest way) |
| `update_app.bat` | Manual update | When you notify them of urgent updates |
| `backend/backup_database.bat` | Manual backup | Before major changes or weekly |
| `AUTO_UPDATE_GUIDE.md` | Update system documentation | Reference for troubleshooting |
| `BACKUP_GUIDE.md` | Backup/restore documentation | When they need to restore data |

### Files They Should NOT Modify:

- Anything in `frontend/src/` (application code)
- Anything in `backend/pb_migrations/` (database structure)
- `backend/pocketbase` (the executable)

### Files They Can Safely Modify:

- `backend/pb_data/data.db` - This is their data (but should be backed up!)
- Nothing else needs to be modified in normal operation

## Daily Operations

### Starting the App
1. Double-click the desktop shortcut, OR
2. Run `start-aid-app.sh`
3. Open browser to http://localhost:5173

### Stopping the App
1. Run `stop-aid-app.sh`, OR
2. Close the terminal windows

### Checking if App is Running
1. Open browser to http://localhost:5173
2. If it loads, the app is running
3. If not, start it using the desktop shortcut

## Maintenance Tasks

### Weekly Tasks
- [ ] Verify backups are being created (check `backend/pb_data/backups/`)
- [ ] Copy latest export backup to USB drive (from `exports/` folder)
- [ ] Check update log for any issues (`logs/update.log`)

### Monthly Tasks
- [ ] Test restoring from a backup (see BACKUP_GUIDE.md)
- [ ] Review user accounts and remove inactive users
- [ ] Archive old export backups to external storage

## Troubleshooting

### App Won't Start
1. Check if PocketBase is already running: `tasklist | findstr pocketbase`
2. If yes, run `stop-aid-app.sh` first
3. Then try starting again

### Can't Access the App
1. Verify services are running: `ps aux | grep -E "(pocketbase|vite)"`
2. Try accessing http://127.0.0.1:8090 (backend) and http://localhost:5173 (frontend)
3. Check firewall settings

### Data Not Showing
1. Verify you're logged in
2. Check your user role (only admins can modify data)
3. Try refreshing the page

### Updates Not Working
1. Check internet connection
2. Review `logs/update.log` for errors
3. Verify GitHub access: `ssh -T git@github.com`
4. Contact UAE team for support

## Getting Help

### Check Logs
- Update log: `logs/update.log`
- Backup log: `backend/pb_data/backup.log`
- Frontend log: `frontend/frontend.log`
- Backend log: `backend/pocketbase.log`

### Contact UAE Team
When reporting issues, include:
1. What you were trying to do
2. What happened instead
3. Any error messages
4. Contents of relevant log files

## Security Notes

1. **Keep the laptop secure** - It contains sensitive donor and beneficiary data
2. **Regular backups to external storage** - Copy `exports/` folder to USB weekly
3. **Don't share login credentials** - Each user should have their own account
4. **Lock the laptop** when not in use

## Summary: What Goes to Syria

**Send them:**
1. The entire `aid-app` folder (via GitHub clone or direct transfer)
2. This deployment guide
3. The AUTO_UPDATE_GUIDE.md
4. The BACKUP_GUIDE.md

**They will need to:**
1. Install Git, Node.js
2. Run `pnpm install` in the frontend folder
3. Set up auto-updates (run `setup_auto_update.bat` as admin)
4. Set up auto-backups (run `setup_auto_backup.bat` as admin)
5. Create desktop shortcut for easy access

**After that:**
- They use the desktop shortcut daily
- Updates happen automatically at 3 AM
- Backups happen automatically every hour
- They only need to copy export backups to USB weekly

---

**Questions?** Contact the UAE development team.

