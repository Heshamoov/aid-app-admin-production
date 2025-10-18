@echo off
REM Aid Platform Manual Update Script for Windows
REM Run this to manually update the application from GitHub

echo =========================================
echo Aid Platform - Manual Update
echo =========================================
echo.

REM Get the directory where this batch file is located
set APP_DIR=%~dp0
set LOG_DIR=%APP_DIR%logs
set BACKUP_DIR=%APP_DIR%backend\pb_data\backups
set LOG_FILE=%LOG_DIR%\update.log

REM Create directories if they don't exist
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo [%date% %time%] Starting manual update >> "%LOG_FILE%"
echo Checking for updates from GitHub...
echo.

REM Check if git is installed
git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git is not installed or not in PATH
    echo Please install Git for Windows from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

REM Check if this is a git repository
if not exist "%APP_DIR%.git" (
    echo [ERROR] This is not a git repository
    echo To enable auto-updates, you need to clone from GitHub:
    echo   git clone git@github.com:Heshamoov/aid-app.git
    echo.
    pause
    exit /b 1
)

REM Stop the application
echo Stopping application...
call "%APP_DIR%stop-aid-app.bat"
timeout /t 2 /nobreak >nul

REM Backup database
echo Creating backup before update...
set BACKUP_FILE=%BACKUP_DIR%\pre-update-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%.db
copy "%APP_DIR%backend\pb_data\data.db" "%BACKUP_FILE%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backup created: %BACKUP_FILE%
) else (
    echo [WARNING] Could not create backup
)

echo.
echo Fetching updates from GitHub...
cd /d "%APP_DIR%"
git fetch origin main >> "%LOG_FILE%" 2>&1

REM Check if there are updates
git diff --quiet HEAD origin/main
if %ERRORLEVEL% EQU 0 (
    echo [INFO] Already up to date. No updates available.
    echo [%date% %time%] No updates available >> "%LOG_FILE%"
    echo.
    echo Starting application...
    call "%APP_DIR%start-aid-app.bat"
    exit /b 0
)

echo Updates found! Applying changes...
git pull origin main >> "%LOG_FILE%" 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Update failed! Check %LOG_FILE% for details
    echo [%date% %time%] Update failed >> "%LOG_FILE%"
    echo.
    echo Restoring from backup...
    copy "%BACKUP_FILE%" "%APP_DIR%backend\pb_data\data.db" >nul 2>&1
    pause
    exit /b 1
)

echo [OK] Updates applied successfully
echo [%date% %time%] Update completed successfully >> "%LOG_FILE%"

REM Update frontend dependencies if package.json changed
git diff --name-only HEAD@{1} HEAD | findstr "package.json" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Updating frontend dependencies...
    cd /d "%APP_DIR%frontend"
    pnpm install >> "%LOG_FILE%" 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Dependencies updated
    ) else (
        echo [WARNING] Could not update dependencies
    )
)

echo.
echo =========================================
echo [SUCCESS] Update completed!
echo =========================================
echo.
echo Starting application...
call "%APP_DIR%start-aid-app.bat"

