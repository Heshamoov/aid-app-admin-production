@echo off
setlocal
cd /d "%~dp0"

set "LOG_DIR=%cd%\logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

REM Locate pocketbase.exe (root or backend\)
set "PBDIR=."
if exist "pocketbase.exe" goto havepb
if exist "backend\pocketbase.exe" set "PBDIR=backend" & goto havepb

echo [ERROR] pocketbase.exe not found in current folder or .\backend
echo Put pocketbase.exe next to Start.bat or in .\backend and run again.
pause
exit /b 1

:havepb
if not exist "pb_data"   mkdir "pb_data"
if not exist "pb_public" mkdir "pb_public"

echo Starting PocketBase on http://127.0.0.1:8090 ...
start "" /MIN "%PBDIR%\pocketbase.exe" serve --http=127.0.0.1:8090 1>>"%LOG_DIR%\backend.log" 2>&1

timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:8090

echo Running. Keep this window open to keep the app running.
pause
endlocal
