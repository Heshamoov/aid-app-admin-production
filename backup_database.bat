@echo off
REM Aid Platform Database Backup Script for Windows
REM Run this to manually backup the database

echo =========================================
echo Aid Platform - Database Backup
echo =========================================
echo.

REM Get the directory where this batch file is located
set APP_DIR=%~dp0
set BACKUP_DIR=%APP_DIR%backend\pb_data\backups
set EXPORT_DIR=%APP_DIR%exports
set LOG_FILE=%APP_DIR%logs\backup.log
set DB_FILE=%APP_DIR%backend\pb_data\data.db

REM Create directories if they don't exist
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"
if not exist "%EXPORT_DIR%" mkdir "%EXPORT_DIR%"
if not exist "%APP_DIR%logs" mkdir "%APP_DIR%logs"

echo [%date% %time%] Starting backup >> "%LOG_FILE%"
echo Creating database backup...

REM Check if database exists
if not exist "%DB_FILE%" (
    echo [ERROR] Database file not found: %DB_FILE%
    echo [%date% %time%] ERROR: Database not found >> "%LOG_FILE%"
    pause
    exit /b 1
)

REM Create timestamp for backup filename
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

REM Create local backup
set BACKUP_FILE=%BACKUP_DIR%\data-%TIMESTAMP%.db
copy "%DB_FILE%" "%BACKUP_FILE%" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Local backup created: %BACKUP_FILE%
    echo [%date% %time%] Local backup created: %BACKUP_FILE% >> "%LOG_FILE%"
) else (
    echo [ERROR] Failed to create local backup
    echo [%date% %time%] ERROR: Local backup failed >> "%LOG_FILE%"
    pause
    exit /b 1
)

REM Create compressed export
set EXPORT_FILE=%EXPORT_DIR%\aid-platform-backup-%TIMESTAMP%.zip
echo Creating compressed export...
powershell -Command "Compress-Archive -Path '%DB_FILE%' -DestinationPath '%EXPORT_FILE%' -Force" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Export created: %EXPORT_FILE%
    echo [%date% %time%] Export created: %EXPORT_FILE% >> "%LOG_FILE%"
) else (
    echo [WARNING] Could not create compressed export
    echo [%date% %time%] WARNING: Export creation failed >> "%LOG_FILE%"
)

REM Clean up old backups (keep last 24 hourly backups)
echo Cleaning up old backups...
set COUNT=0
for /f "delims=" %%F in ('dir /b /o-d "%BACKUP_DIR%\data-*.db" 2^>nul') do (
    set /a COUNT+=1
    if !COUNT! GTR 24 (
        del "%BACKUP_DIR%\%%F" >nul 2>&1
    )
)

REM Clean up old exports (keep last 30 daily exports)
set COUNT=0
for /f "delims=" %%F in ('dir /b /o-d "%EXPORT_DIR%\aid-platform-backup-*.zip" 2^>nul') do (
    set /a COUNT+=1
    if !COUNT! GTR 30 (
        del "%EXPORT_DIR%\%%F" >nul 2>&1
    )
)

REM Display backup statistics
echo.
echo =========================================
echo [SUCCESS] Backup completed!
echo =========================================
echo.
echo Backup location: %BACKUP_DIR%
echo Export location: %EXPORT_DIR%
echo.

REM Count backups
for /f %%A in ('dir /b "%BACKUP_DIR%\data-*.db" 2^>nul ^| find /c /v ""') do set BACKUP_COUNT=%%A
for /f %%A in ('dir /b "%EXPORT_DIR%\aid-platform-backup-*.zip" 2^>nul ^| find /c /v ""') do set EXPORT_COUNT=%%A

echo Total backups: %BACKUP_COUNT%
echo Total exports: %EXPORT_COUNT%
echo.
echo [TIP] Copy export files to USB drive for safe keeping!
echo.
pause

