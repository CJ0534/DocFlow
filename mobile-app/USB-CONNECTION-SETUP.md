# Connecting Mobile App via USB Cable

You can connect your Android device via USB cable and use ADB port forwarding. This works even if devices aren't on the same network!

## Setup Steps

### 1. Enable USB Debugging on Android

1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times (you'll see "You are now a developer!")
3. Go back to **Settings** → **Developer Options**
4. Enable **USB Debugging**
5. Connect your phone to computer via USB cable
6. On your phone, allow USB debugging when prompted

### 2. Install ADB (Android Debug Bridge)

**Option A: Via Android Studio**
- If you have Android Studio installed, ADB is already included
- Usually at: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe`

**Option B: Standalone ADB**
- Download: https://developer.android.com/tools/releases/platform-tools
- Extract to a folder (e.g., `C:\platform-tools`)
- Add to PATH or use full path

### 3. Verify ADB Connection

Open terminal and run:
```bash
adb devices
```

You should see your device listed:
```
List of devices attached
ABC123XYZ    device
```

If you see "unauthorized", check your phone and allow USB debugging.

### 4. Forward Port 3000

Run this command to forward your backend port:
```bash
adb reverse tcp:3000 tcp:3000
```

This forwards `localhost:3000` on your phone to `localhost:3000` on your computer.

### 5. Update Mobile App API URL

Update `mobile-app/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000';
```

Yes, use `localhost` - ADB will forward it to your computer!

### 6. Start Backend and Mobile App

1. Start backend: `cd backend && npm start`
2. Start mobile app: `cd mobile-app && npm start`
3. Scan QR code with Expo Go

## Keep Port Forwarding Active

The `adb reverse` command stays active until:
- You disconnect the USB cable
- You restart ADB
- You run `adb reverse --remove tcp:3000`

To make it persistent, you can create a script or add it to your startup.

## Troubleshooting

**Device not showing:**
- Check USB cable (use data cable, not charging-only)
- Enable USB debugging again
- Try different USB port
- Run `adb kill-server && adb start-server`

**Connection issues:**
- Make sure backend is running on port 3000
- Verify port forwarding: `adb reverse --list`
- Check backend logs for connection attempts

**Expo Go can't connect:**
- Make sure you're using `localhost:3000` (not 127.0.0.1)
- Try restarting Expo Go app
- Check that port forwarding is still active

## Advantages of USB Connection

✅ Works without WiFi
✅ More stable connection
✅ Lower latency
✅ No network configuration needed
✅ Works offline (for local development)

## Quick Commands Reference

```bash
# Check connected devices
adb devices

# Forward port 3000
adb reverse tcp:3000 tcp:3000

# Check active port forwards
adb reverse --list

# Remove port forward
adb reverse --remove tcp:3000

# Restart ADB (if issues)
adb kill-server
adb start-server
```

