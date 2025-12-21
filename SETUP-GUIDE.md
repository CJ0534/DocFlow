# Complete Step-by-Step Setup Guide

## USB Connection Setup for DocFlow Mobile App

Follow these steps in order to connect your Android device via USB cable.

---

## Step 1: Enable USB Debugging on Android Device

1. **Open Settings** on your Android phone
2. Scroll down and tap **"About Phone"** (or "About Device")
3. Find **"Build Number"** and tap it **7 times**
   - You'll see a message: "You are now a developer!"
4. Go back to **Settings**
5. Find and tap **"Developer Options"** (usually under System)
6. Toggle **"USB Debugging"** to ON
7. If prompted, tap **"OK"** to confirm

✅ **Checkpoint:** USB Debugging is now enabled

---

## Step 2: Install Android Debug Bridge (ADB)

### Option A: Download Standalone ADB (Recommended)

1. **Download Platform Tools:**
   - Go to: https://developer.android.com/tools/releases/platform-tools
   - Click **"Download SDK Platform-Tools for Windows"**
   - Save the ZIP file

2. **Extract ADB:**
   - Extract the ZIP file to a folder (e.g., `C:\platform-tools`)
   - You should see `adb.exe` in that folder

3. **Add to PATH (Optional but Recommended):**
   - Right-click **"This PC"** → **Properties**
   - Click **"Advanced system settings"**
   - Click **"Environment Variables"**
   - Under **"System variables"**, find **"Path"** and click **"Edit"**
   - Click **"New"** and add: `C:\platform-tools` (or your path)
   - Click **"OK"** on all windows
   - **Restart your terminal** for changes to take effect

### Option B: Use Android Studio (If Installed)

1. If you have Android Studio installed, ADB is already included
2. Usually located at: `C:\Users\YourName\AppData\Local\Android\Sdk\platform-tools\adb.exe`
3. Add this path to your PATH (see Option A, step 3)

✅ **Checkpoint:** ADB is installed

---

## Step 3: Connect Phone and Verify Connection

1. **Connect your Android phone** to your computer via USB cable
   - Use a data cable (not charging-only cable)
   - Use a USB port directly on your computer (not a hub)

2. **On your phone**, you'll see a popup: **"Allow USB debugging?"**
   - Check **"Always allow from this computer"** (optional)
   - Tap **"Allow"**

3. **Open a new terminal** and test the connection:
   ```bash
   adb devices
   ```
   
   You should see:
   ```
   List of devices attached
   ABC123XYZ    device
   ```
   
   If you see "unauthorized", check your phone and allow USB debugging again.

✅ **Checkpoint:** Phone is connected and recognized by ADB

---

## Step 4: Set Up Port Forwarding

1. **In the same terminal**, run:
   ```bash
   adb reverse tcp:3000 tcp:3000
   ```

2. **Verify it worked:**
   ```bash
   adb reverse --list
   ```
   
   You should see:
   ```
   (reverse) tcp:3000 tcp:3000
   ```

3. **Keep this terminal open** - port forwarding stays active as long as:
   - The terminal is open
   - USB cable is connected
   - ADB server is running

✅ **Checkpoint:** Port forwarding is active

---

## Step 5: Verify Backend API URL

1. **Open** `mobile-app/services/api.js`

2. **Check line 11** - it should say:
   ```javascript
   const API_BASE_URL = __DEV__ 
     ? 'http://localhost:3000'  // Use this with USB + ADB port forwarding
     : 'https://your-backend-url.com';
   ```

3. **If it's different**, change it to `'http://localhost:3000'`

✅ **Checkpoint:** API URL is set to localhost:3000

---

## Step 6: Start Backend Server

1. **Open a NEW terminal** (keep the ADB one open)

2. **Navigate to backend folder:**
   ```bash
   cd D:\DocFlow\backend
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Wait for this message:**
   ```
   🚀 DocFlow API listening on http://0.0.0.0:3000
   ✅ Supabase Mode Enabled
   ```

5. **Test it** (optional):
   - Open browser: http://localhost:3000/health
   - You should see: `{"status":"ok",...}`

✅ **Checkpoint:** Backend server is running on port 3000

---

## Step 7: Start Mobile App

1. **Open ANOTHER NEW terminal** (keep ADB and backend terminals open)

2. **Navigate to mobile-app folder:**
   ```bash
   cd D:\DocFlow\mobile-app
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Wait for QR code** to appear in terminal

✅ **Checkpoint:** Expo is running and showing QR code

---

## Step 8: Connect Mobile App

1. **Open Expo Go app** on your Android phone
   - Download from Play Store if needed: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Scan the QR code** from the terminal
   - In Expo Go, tap **"Scan QR code"**
   - Point camera at QR code in terminal

3. **Wait for app to load** - this may take 1-2 minutes the first time

4. **If connection fails:**
   - Make sure USB cable is still connected
   - Check that port forwarding is still active: `adb reverse --list`
   - Verify backend is still running
   - Try restarting Expo Go app

✅ **Checkpoint:** Mobile app is loaded on your phone

---

## Step 9: Test the Connection

1. **In the mobile app**, try to:
   - Register a new account
   - Or login with existing credentials

2. **Check backend terminal** - you should see:
   - API requests coming in
   - No errors

3. **If you see errors:**
   - Check that all 3 terminals are still running:
     - Terminal 1: ADB port forwarding
     - Terminal 2: Backend server
     - Terminal 3: Expo
   - Verify USB cable is connected
   - Check phone screen for any prompts

✅ **Checkpoint:** App can communicate with backend!

---

## Troubleshooting

### Problem: "adb: command not found"
**Solution:** ADB is not in PATH
- Use full path: `C:\platform-tools\adb.exe devices`
- Or add to PATH (see Step 2)

### Problem: "no devices/emulators found"
**Solution:** 
- Check USB cable (use data cable)
- Enable USB debugging again
- Try different USB port
- Run: `adb kill-server && adb start-server`

### Problem: "Port forwarding failed"
**Solution:**
- Make sure device is connected: `adb devices`
- Try: `adb kill-server && adb start-server`
- Then: `adb reverse tcp:3000 tcp:3000`

### Problem: "Network request failed" in app
**Solution:**
- Verify port forwarding: `adb reverse --list`
- Check backend is running: http://localhost:3000/health
- Verify API_BASE_URL is `http://localhost:3000`
- Restart Expo Go app

### Problem: Port forwarding stops working
**Solution:**
- Port forwarding stops if you disconnect USB or restart ADB
- Simply run again: `adb reverse tcp:3000 tcp:3000`

---

## Quick Reference Commands

```bash
# Check connected devices
adb devices

# Set up port forwarding
adb reverse tcp:3000 tcp:3000

# Check active port forwards
adb reverse --list

# Remove port forward
adb reverse --remove tcp:3000

# Restart ADB (if issues)
adb kill-server
adb start-server

# Start backend
cd backend
npm start

# Start mobile app
cd mobile-app
npm start
```

---

## Summary: What You Need Running

**3 Terminals Open:**
1. ✅ ADB port forwarding: `adb reverse tcp:3000 tcp:3000`
2. ✅ Backend server: `cd backend && npm start`
3. ✅ Expo: `cd mobile-app && npm start`

**Phone:**
- ✅ Connected via USB
- ✅ USB Debugging enabled
- ✅ Expo Go app installed

**Files:**
- ✅ `mobile-app/services/api.js` → `API_BASE_URL = 'http://localhost:3000'`

---

## You're All Set! 🎉

Your mobile app should now connect to your backend via USB cable, even without WiFi!

