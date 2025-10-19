@echo off
REM === Aid App - Stop Script (runtime) ===

echo =========================================
echo Stopping Aid App...
echo =========================================
echo.

REM Stop PocketBase if it's running
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8090" ^| findstr LISTENING') do (
    taskkill /PID %%p /F >nul 2>&1
    echo [OK] PocketBase stopped (PID %%p)
)

REM If nothing was running, print info
netstat -ano | findstr ":8090" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] PocketBase was not running on port 8090.
)

echo.
echo =========================================
echo [SUCCESS] Aid App stopped
echo =========================================
echo.
pause
