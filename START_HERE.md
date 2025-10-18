# Aid Platform - Quick Start Guide for Windows

## 🚀 Setup in 5 Minutes

### Step 1: Install Prerequisites (One-Time)

Download and install these programs:

1. **Git for Windows**: https://git-scm.com/download/win
   - Download and run the installer
   - Use default options during installation

2. **Node.js (v22 or later)**: https://nodejs.org/
   - Download the LTS version
   - Run the installer with default options

### Step 2: Install Application Dependencies (One-Time)

1. Open **Command Prompt** or **PowerShell**
2. Navigate to the `frontend` folder:
   ```
   cd C:\path\to\aid-platform-v1.0-production\frontend
   ```
3. Run these commands:
   ```
   npm install -g pnpm
   pnpm install
   ```
4. Wait for installation to complete (2-3 minutes)

### Step 3: Start the Application

**Double-click:** `start-aid-app.bat`

The application will:
- Start the backend server
- Start the web interface
- Open your browser automatically

### Step 4: Login

Your browser will open to: http://localhost:5173

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

### Step 5: Setup Automation (Recommended)

**For Auto-Updates:**
1. Right-click `setup_auto_update.bat`
2. Select **"Run as Administrator"**
3. Follow the prompts

**For Auto-Backups:**
1. Right-click `setup_auto_backup.bat`
2. Select **"Run as Administrator"**
3. Follow the prompts

## 📋 Daily Use

### Starting the App
- Double-click `start-aid-app.bat`
- Wait for browser to open
- Login and use the application

### Stopping the App
- Double-click `stop-aid-app.bat`
- All services will stop

### Manual Backup
- Double-click `backup_database.bat`
- Backup files saved in `exports/` folder
- **Copy to USB drive weekly!**

### Manual Update
- Double-click `update_app.bat`
- Application will update from GitHub
- Automatic backup before update

## 📁 Important Files

| File | What It Does |
|------|--------------|
| `start-aid-app.bat` | Start the application |
| `stop-aid-app.bat` | Stop the application |
| `backup_database.bat` | Create manual backup |
| `update_app.bat` | Update from GitHub |
| `setup_auto_update.bat` | Setup automatic updates |
| `setup_auto_backup.bat` | Setup automatic backups |

## 📚 Need More Help?

Read these guides:
- `DEPLOYMENT_INSTRUCTIONS_SYRIA.md` - Complete setup guide
- `AUTO_UPDATE_GUIDE.md` - Update system details
- `BACKUP_GUIDE.md` - Backup and restore procedures

## 🆘 Troubleshooting

### "Port already in use" error
- Run `stop-aid-app.bat` first
- Then run `start-aid-app.bat` again

### Can't access the application
- Check if services are running
- Try: http://localhost:5173
- Check firewall settings

### Updates not working
- Make sure you have internet connection
- Check that Git is installed
- Run `update_app.bat` manually

### Need to restore from backup
- Stop the application
- Copy backup file from `exports/` or `backend/pb_data/backups/`
- Replace `backend/pb_data/data.db`
- Start the application

## 🔒 Security Reminders

1. **Change default password** on first login
2. **Create individual user accounts** for each team member
3. **Keep the laptop physically secure**
4. **Copy backups to USB weekly**
5. **Don't share login credentials**

## ✅ You're Ready!

Once setup is complete:
- ✅ Application runs locally on the laptop
- ✅ Works offline (no internet needed for daily use)
- ✅ Updates automatically from UAE team
- ✅ Backups automatically every hour
- ✅ Data is safe even during power outages

**Contact UAE development team if you need help!**

