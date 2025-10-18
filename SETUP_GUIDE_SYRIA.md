# Aid Platform - Complete Setup Guide for Syria

## 🚨 Important: Read This First!

The production package you received does NOT include a pre-configured database. You need to initialize it first.

## 📋 Complete Setup Process

### Step 1: Extract and Install Prerequisites ✅ (Already Done)

You've already completed:
- ✅ Extracted the zip file
- ✅ Installed Git and Node.js
- ✅ Ran `pnpm install`
- ✅ Started the app with `start-aid-app.bat`

### Step 2: Initialize the Database (DO THIS NOW)

The database is empty, which is why you can't login. Follow these steps:

1. **Stop the current app** (if running):
   - Double-click `stop-aid-app.bat`

2. **Initialize the database**:
   - Open PocketBase Admin UI: http://127.0.0.1:8090/_/
   - If it says "connection refused", start backend manually:
     ```
     cd backend
     pocketbase.exe serve --http=127.0.0.1:8090
     ```
   - In your browser, go to: http://127.0.0.1:8090/_/
   - You'll see "Create admin account" page
   - Create your admin account:
     - **Email**: Your email (e.g., `admin@aidplatform.org`)
     - **Password**: Your secure password (NOT admin123!)
     - **Confirm password**

3. **Create required collections**:
   
   After creating admin account, you'll be in PocketBase admin panel. Create these collections:

   **a) Users Collection:**
   - Click "New Collection"
   - Name: `users`
   - Type: Auth collection
   - Add fields:
     - `name` (Text, required)
     - `role` (Select, options: admin, monitor, volunteer)
     - `mobile` (Text, optional)
     - `organization` (Text, optional)
   - Save

   **b) Donations Collection:**
   - Click "New Collection"
   - Name: `donations`
   - Type: Base collection
   - Add fields:
     - `donor` (Text, required)
     - `amount` (Number, required)
     - `currency` (Select, options: USD, EUR, AED, SAR, SYP)
     - `method` (Select, options: Cash, Bank Transfer, Mobile Money)
     - `purpose` (Text, optional)
     - `receipt_number` (Text, optional)
     - `contact` (Text, optional)
     - `notes` (Text, optional)
     - `organization` (Text, optional)
     - `date` (Date, required)
   - API Rules:
     - List: `@request.auth.id != ""`
     - View: `@request.auth.id != ""`
     - Create: `@request.auth.role = "admin"`
     - Update: `@request.auth.role = "admin"`
     - Delete: `@request.auth.role = "admin"`
   - Save

   **c) Expenses Collection:**
   - Click "New Collection"
   - Name: `expenses`
   - Type: Base collection
   - Add fields:
     - `description` (Text, required)
     - `category` (Select, options: Food, Medical Supplies, Transportation, Shelter, Education, Other)
     - `amount` (Number, required)
     - `currency` (Select, options: USD, EUR, AED, SAR, SYP)
     - `status` (Select, options: Pending, Approved, Rejected)
     - `receipt_number` (Text, optional)
     - `notes` (Text, optional)
     - `date` (Date, required)
   - API Rules: (Same as donations)
   - Save

   **d) Forms Collection:**
   - Click "New Collection"
   - Name: `forms`
   - Type: Base collection
   - Add fields:
     - `title` (Text, required)
     - `description` (Text, optional)
     - `fields` (JSON, required)
     - `status` (Select, options: active, inactive)
   - API Rules: (Same as donations)
   - Save

   **e) Submissions Collection:**
   - Click "New Collection"
   - Name: `submissions`
   - Type: Base collection
   - Add fields:
     - `form` (Relation to forms, required)
     - `data` (JSON, required)
     - `submitted_by` (Relation to users, optional)
   - API Rules: (Same as donations)
   - Save

4. **Close PocketBase admin** and return to command prompt

5. **Start the app normally**:
   - Double-click `start-aid-app.bat`

6. **Login with YOUR credentials** (the ones you just created in PocketBase admin)

### Step 3: Fix CSS Issues (If Still Not Loading)

If CSS is still not loading after login:

1. **Clear browser cache**:
   - Press `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

2. **Restart the app**:
   - Run `stop-aid-app.bat`
   - Run `start-aid-app.bat`

3. **Hard refresh the page**:
   - Press `Ctrl + F5` in the browser

### Step 4: Setup Auto-Updates and Auto-Backups

Now that the app is working:

1. **Setup auto-updates**:
   - Right-click `setup_auto_update.bat`
   - Select "Run as Administrator"
   - Follow prompts

2. **Setup auto-backups**:
   - Right-click `setup_auto_backup.bat`
   - Select "Run as Administrator"
   - Follow prompts

## 🔄 Receiving Updates from UAE

### First Time: Connect to GitHub

Before you can receive updates, you need to connect this folder to GitHub:

1. **Open Git Bash** in the aid-platform folder

2. **Initialize git** (if not already done):
   ```bash
   git init
   git remote add origin git@github.com:Heshamoov/aid-app.git
   ```

3. **Pull the latest code**:
   ```bash
   git pull origin main
   ```

4. **Now you can use** `update_app.bat` to get updates!

### Getting Updates

**Automatic** (after running `setup_auto_update.bat`):
- Updates check daily at 3 AM
- Automatic download and installation
- Automatic backup before update

**Manual** (anytime):
- Double-click `update_app.bat`
- Wait for update to complete
- App restarts automatically

## 🆘 Troubleshooting

### Can't Login
- **Cause**: Database not initialized
- **Solution**: Follow Step 2 above to create admin account in PocketBase

### CSS Not Loading
- **Cause**: Browser cache or Vite server issue
- **Solution**: Clear cache, restart app, hard refresh (Ctrl+F5)

### Port Already in Use
- **Cause**: App already running
- **Solution**: Run `stop-aid-app.bat` first

### PocketBase Admin Won't Open
- **Cause**: Backend not running
- **Solution**: 
  ```
  cd backend
  pocketbase.exe serve --http=127.0.0.1:8090
  ```

### Update Fails
- **Cause**: No git connection or network issue
- **Solution**: Check internet, verify git remote is set

## 📞 Need Help?

Contact UAE development team with:
1. Screenshot of the error
2. Contents of `logs/backend.log`
3. Contents of `logs/frontend.log`
4. What you were trying to do

## ✅ Quick Reference

**Start app**: `start-aid-app.bat`
**Stop app**: `stop-aid-app.bat`
**Backup**: `backup_database.bat`
**Update**: `update_app.bat`
**PocketBase Admin**: http://127.0.0.1:8090/_/
**App URL**: http://localhost:5173

---

**Once setup is complete, you're ready to use the Aid Platform!**

