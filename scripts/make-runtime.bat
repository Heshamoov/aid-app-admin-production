@echo on
setlocal ENABLEDELAYEDEXPANSION
REM === Always run relative to this file ===
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%\.."
set "REPO_ROOT=%cd%"
if not exist logs mkdir logs
set "LOG=logs\make-runtime.log"
echo [%date% %time%] START > "%LOG%"

REM 0) Quick checks
where pnpm || (echo [ERROR] pnpm not found & echo Install pnpm and try again & pause & exit /b 1)
if not exist frontend\package.json (echo [ERROR] frontend/ missing & pause & exit /b 1)
if not exist backend\pb_migrations (echo [WARN] backend\pb_migrations not found)

REM 1) Build frontend
cd frontend
call pnpm install >>"%REPO_ROOT%\%LOG%" 2>&1 || goto :err
call pnpm run build >>"%REPO_ROOT%\%LOG%" 2>&1 || goto :err
cd "%REPO_ROOT%"

REM 2) Create runtime folder
rmdir /s /q dist-runtime 2>nul
mkdir dist-runtime\pb_public
mkdir dist-runtime\pb_data

REM 3) Copy schema + frontend
if exist backend\pb_migrations xcopy /e /i /y backend\pb_migrations dist-runtime\pb_migrations >nul
xcopy /e /i /y frontend\build dist-runtime\pb_public >nul || goto :err

REM 4) Copy start/stop scripts
copy /y scripts\Start.bat dist-runtime\Start.bat >nul || goto :err
copy /y scripts\Stop.bat  dist-runtime\Stop.bat  >nul || goto :err

REM 5) Copy PocketBase binary (root or backend\)
if exist pocketbase.exe (
  copy /y pocketbase.exe dist-runtime\pocketbase.exe >nul
) else if exist backend\pocketbase.exe (
  copy /y backend\pocketbase.exe dist-runtime\pocketbase.exe >nul
) else (
  echo [NOTE] Put pocketbase.exe into dist-runtime manually.
)

REM 6) README
> dist-runtime\README_SYRIA.txt echo 1) Double-click Start.bat
>>dist-runtime\README_SYRIA.txt echo 2) App: http://127.0.0.1:8090  (Admin: /_/)
>>dist-runtime\README_SYRIA.txt echo 3) To stop: Stop.bat

REM 7) Zip it
powershell -NoP -C "if(Test-Path 'Aid-App.zip'){Remove-Item 'Aid-App.zip' -Force}; Compress-Archive -Path 'dist-runtime\*' -DestinationPath 'Aid-App.zip' -Force" || goto :err

echo.
echo ✅ Runtime ready: dist-runtime\  (and Aid-App.zip)
echo [%date% %time%] OK >> "%LOG%"
pause
exit /b 0

:err
echo ❌ Build failed. See %LOG%
type "%LOG%"
pause
exit /b 1
