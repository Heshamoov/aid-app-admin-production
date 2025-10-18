@echo off
REM Aid Platform Stop Script for Windows
REM Double-click this file to stop the application

echo =========================================
echo Stopping Aid Platform...
echo =========================================
echo.

REM Stop PocketBase
echo Stopping Backend ^(PocketBase^)...
taskkill /F /IM pocketbase.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Backend stopped
) else (
    echo [INFO] Backend was not running
)

REM Stop Node/Vite (Frontend)
echo Stopping Frontend ^(Web Interface^)...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend stopped
) else (
    echo [INFO] Frontend was not running
)

echo.
echo =========================================
echo [SUCCESS] Aid Platform stopped
echo =========================================
echo.
pause

