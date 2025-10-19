@echo off
REM === Aid App - Runtime Updater (pulls latest Release ZIP) ===
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

REM --- SETTINGS (edit once) ---
set RELEASE_URL=https://github.com/Heshamoov/aid-app-admin-production/releases/latest/download/Aid-App.zip

REM --- PREP ---
set LOGS=logs
set BACKUPS=backups
set TMP=%cd%\_update_tmp
if not exist "%LOGS%"    mkdir "%LOGS%"
if not exist "%BACKUPS%" mkdir "%BACKUPS%"
echo [%date% %time%] Update started > "%LOGS%\update.log"

REM --- 1) Stop app ---
echo Stopping app...
if exist Stop.bat call Stop.bat

REM --- 2) Backup pb_data ---
set TS=%date:~-4,4%-%date:~-10,2%-%date:~-7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
set TS=%TS: =0%
echo Backing up pb_data to "%BACKUPS%\pb_data_%TS%.zip"
powershell -NoP -C "if(Test-Path 'pb_data'){Compress-Archive -Path 'pb_data\*' -DestinationPath '%BACKUPS%\pb_data_%TS%.zip' -Force}"

REM --- 3) Download latest release ZIP ---
rmdir /s /q "%TMP%" 2>nul
mkdir "%TMP%"
echo Downloading latest release...
powershell -NoP -C "Invoke-WebRequest -Uri '%RELEASE_URL%' -OutFile '%TMP%\Aid-App.zip'"

if not exist "%TMP%\Aid-App.zip" (
  echo [ERROR] Download failed. See %LOGS%\update.log
  echo [%date% %time%] Download failed >> "%LOGS%\update.log"
  goto :end_fail
)

REM --- 4) Extract into temp ---
echo Extracting...
powershell -NoP -C "Expand-Archive -Path '%TMP%\Aid-App.zip' -DestinationPath '%TMP%\extracted' -Force"

REM Expect extracted structure to contain pb_public, pb_migrations, Start/Stop, pocketbase.exe
if not exist "%TMP%\extracted\pb_public" (
  echo [ERROR] ZIP missing pb_public. Aborting.
  goto :end_fail
)

REM --- 5) Apply update: replace pb_public and pb_migrations (keep pb_data) ---
echo Updating files...
rmdir /s /q "pb_public" 2>nul
xcopy /e /i /y "%TMP%\extracted\pb_public" "pb_public" >nul

if exist "%TMP%\extracted\pb_migrations" (
  rmdir /s /q "pb_migrations" 2>nul
  xcopy /e /i /y "%TMP%\extracted\pb_migrations" "pb_migrations" >nul
)

REM Optional: update pocketbase.exe if provided
if exist "%TMP%\extracted\pocketbase.exe" (
  copy /y "%TMP%\extracted\pocketbase.exe" "pocketbase.exe" >nul
)

REM Optional: refresh Start/Stop if provided (won’t touch if not)
if exist "%TMP%\extracted\Start.bat" copy /y "%TMP%\extracted\Start.bat" "Start.bat" >nul
if exist "%TMP%\extracted\Stop.bat"  copy /y "%TMP%\extracted\Stop.bat"  "Stop.bat"  >nul

REM --- 6) Cleanup temp ---
rmdir /s /q "%TMP%" 2>nul

echo [OK] Update applied.
echo [%date% %time%] Update OK >> "%LOGS%\update.log"

REM --- 7) Start app ---
if exist Start.bat (
  echo Starting app...
  call Start.bat
) else (
  echo [INFO] Start.bat not found; run PocketBase manually.
)

exit /b 0

:end_fail
echo [FAIL] Update failed. Your data backup is in "%BACKUPS%".
echo [%date% %time%] Update FAIL >> "%LOGS%\update.log"
pause
exit /b 1
