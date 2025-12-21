@echo off
echo ========================================
echo DocFlow USB Connection Setup
echo ========================================
echo.

echo Checking ADB installation...
where adb >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: ADB not found in PATH!
    echo.
    echo Please install ADB:
    echo 1. Download from: https://developer.android.com/tools/releases/platform-tools
    echo 2. Extract to a folder
    echo 3. Add to PATH or use full path to adb.exe
    echo.
    pause
    exit /b 1
)

echo ADB found!
echo.

echo Checking for connected devices...
adb devices
echo.

echo Setting up port forwarding (localhost:3000 -> localhost:3000)...
adb reverse tcp:3000 tcp:3000

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Port forwarding is active.
    echo ========================================
    echo.
    echo Your mobile app can now connect to:
    echo   http://localhost:3000
    echo.
    echo Keep this window open while developing.
    echo To stop port forwarding, close this window or run:
    echo   adb reverse --remove tcp:3000
    echo.
) else (
    echo.
    echo ERROR: Failed to set up port forwarding!
    echo Make sure:
    echo   1. USB debugging is enabled on your device
    echo   2. Device is connected via USB
    echo   3. You've allowed USB debugging on the device
    echo.
)

pause

