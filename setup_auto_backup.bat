@echo off
REM Setup Auto-Backup Scheduled Tasks for Windows
REM Run as Administrator to create scheduled tasks

echo =========================================
echo Setup Auto-Backup System
echo =========================================
echo.

REM Check for admin rights
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] This script must be run as Administrator
    echo.
    echo Right-click this file and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

REM Get the directory where this batch file is located
set APP_DIR=%~dp0
set BACKUP_SCRIPT=%APP_DIR%backup_database.bat

echo This will create scheduled tasks to automatically backup
echo the database:
echo   - Hourly backups ^(keeps last 24^)
echo   - Daily exports ^(keeps last 30^)
echo.
echo Backup script location: %BACKUP_SCRIPT%
echo.
pause

REM Delete existing tasks if they exist
echo Removing existing scheduled tasks...
schtasks /Query /TN "AidPlatformHourlyBackup" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    schtasks /Delete /TN "AidPlatformHourlyBackup" /F >nul 2>&1
)

schtasks /Query /TN "AidPlatformDailyExport" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    schtasks /Delete /TN "AidPlatformDailyExport" /F >nul 2>&1
)

REM Create hourly backup task
echo Creating hourly backup task...
schtasks /Create /TN "AidPlatformHourlyBackup" /TR "\"%BACKUP_SCRIPT%\"" /SC HOURLY /RU "%USERNAME%" /RL HIGHEST /F >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create hourly backup task
    goto :error
)

REM Create daily export task (at 2:00 AM)
echo Creating daily export task...
schtasks /Create /TN "AidPlatformDailyExport" /TR "\"%BACKUP_SCRIPT%\"" /SC DAILY /ST 02:00 /RU "%USERNAME%" /RL HIGHEST /F >nul 2>&1

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to create daily export task
    goto :error
)

echo.
echo =========================================
echo [SUCCESS] Auto-backup configured!
echo =========================================
echo.
echo Two scheduled tasks have been created:
echo   1. Hourly Backup - Runs every hour
echo   2. Daily Export - Runs at 2:00 AM
echo.
echo Backups will be saved in:
echo   - Local: backend\pb_data\backups\
echo   - Export: exports\
echo.
echo [IMPORTANT] Copy export files to USB drive weekly!
echo.
echo You can also manually backup anytime by running:
echo   backup_database.bat
echo.
echo To view or modify the scheduled tasks:
echo   1. Open Task Scheduler
echo   2. Look for "AidPlatformHourlyBackup" and "AidPlatformDailyExport"
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] Failed to create scheduled tasks
echo.
echo Please try running this script as Administrator
echo or create the tasks manually in Task Scheduler.
echo.
pause
exit /b 1

