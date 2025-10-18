@echo off
REM Setup Auto-Update Scheduled Task for Windows
REM Run as Administrator to create scheduled task

echo =========================================
echo Setup Auto-Update System
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
set UPDATE_SCRIPT=%APP_DIR%update_app.bat

echo This will create a scheduled task to automatically update
echo the Aid Platform daily at 3:00 AM.
echo.
echo Update script location: %UPDATE_SCRIPT%
echo.
pause

REM Delete existing task if it exists
schtasks /Query /TN "AidPlatformAutoUpdate" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Removing existing scheduled task...
    schtasks /Delete /TN "AidPlatformAutoUpdate" /F >nul 2>&1
)

REM Create new scheduled task
echo Creating scheduled task...
schtasks /Create /TN "AidPlatformAutoUpdate" /TR "\"%UPDATE_SCRIPT%\"" /SC DAILY /ST 03:00 /RU "%USERNAME%" /RL HIGHEST /F >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================
    echo [SUCCESS] Auto-update configured!
    echo =========================================
    echo.
    echo The application will automatically check for updates
    echo and install them daily at 3:00 AM.
    echo.
    echo You can also manually update anytime by running:
    echo   update_app.bat
    echo.
    echo To view or modify the scheduled task:
    echo   1. Open Task Scheduler
    echo   2. Look for "AidPlatformAutoUpdate"
    echo.
) else (
    echo.
    echo [ERROR] Failed to create scheduled task
    echo.
    echo Please try running this script as Administrator
    echo or create the task manually in Task Scheduler.
    echo.
)

pause

