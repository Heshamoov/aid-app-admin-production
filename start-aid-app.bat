@echo off
REM Aid Platform Startup Script for Windows
REM Double-click this file to start the application

echo =========================================
echo Starting Aid Platform...
echo =========================================
echo.

REM Get the directory where this batch file is located
set APP_DIR=%~dp0
set LOG_DIR=%APP_DIR%logs

REM Create logs directory if it doesn't exist
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Check if backend is already running
netstat -ano | findstr ":8090" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Backend is already running on port 8090
) else (
    echo Starting Backend ^(PocketBase^)...
    cd /d "%APP_DIR%backend"
    start /B "" pocketbase.exe serve --http=127.0.0.1:8090 > "%LOG_DIR%\backend.log" 2>&1
    echo [OK] Backend starting on http://127.0.0.1:8090
    echo     ^(waiting for backend to be ready...^)
    timeout /t 3 /nobreak >nul
)

echo.

REM Check if frontend is already running
netstat -ano | findstr ":5173" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Frontend is already running on port 5173
) else (
    echo Starting Frontend ^(Web Interface^)...
    cd /d "%APP_DIR%frontend"
    start /B "" pnpm run dev > "%LOG_DIR%\frontend.log" 2>&1
    echo [OK] Frontend starting on http://localhost:5173
    echo     ^(waiting for frontend to be ready...^)
    timeout /t 5 /nobreak >nul
)

echo.
echo =========================================
echo [SUCCESS] Aid Platform is ready!
echo =========================================
echo.
echo Open your browser and go to:
echo   http://localhost:5173
echo.
echo Default Login:
echo   Email: admin@example.com
echo   Password: admin123
echo   [WARNING] Change password after first login!
echo.
echo Logs are saved in: %LOG_DIR%
echo To stop the app, run: stop-aid-app.bat
echo.

REM Open browser automatically
start http://localhost:5173

echo.
echo You can close this window. Services are running in background.
echo.
pause

