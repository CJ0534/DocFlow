# Troubleshooting Network Timeout

## Problem: "Network response timed out" or "Something went wrong"

### Step 1: Verify ADB Port Forwarding

**Check if port forwarding is active:**
```bash
adb reverse --list
```

**You should see:**
```
(reverse) tcp:3000 tcp:3000
```

**If you don't see it, set it up:**
```bash
adb reverse tcp:3000 tcp:3000
```

**Verify device is connected:**
```bash
adb devices
```

Should show your device listed.

---

### Step 2: Test Backend from Phone

**Option A: Use ADB shell to test from phone:**
```bash
adb shell
curl http://localhost:3000/health
```

**Option B: Use browser on phone:**
- Open Chrome on your phone
- Go to: `http://localhost:3000/health`
- Should see JSON response

If this doesn't work, port forwarding isn't set up correctly.

---

### Step 3: Check API URL Configuration

**Open:** `mobile-app/services/api.js`

**Line 12-14 should be:**
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // ✅ For USB connection
  : 'https://your-backend-url.com';
```

**Important:** Use `http://localhost:3000` (not `https://` or IP address)

---

### Step 4: Verify Backend is Running

**Check backend terminal:**
- Should see: `🚀 DocFlow API listening on http://0.0.0.0:3000`

**Test in browser:**
- Open: http://localhost:3000/health
- Should see JSON response

---

### Step 5: Check Expo Go Connection

**In Expo Go app:**
1. Shake device or press menu button
2. Go to **"Debug Remote JS"**
3. Check **"Show Element Inspector"** for errors

**Check Metro bundler terminal:**
- Look for any error messages
- Check if requests are being made

---

### Step 6: Common Fixes

#### Fix 1: Restart Everything
```bash
# Terminal 1: Kill and restart ADB
adb kill-server
adb start-server
adb reverse tcp:3000 tcp:3000

# Terminal 2: Restart backend
# Press Ctrl+C to stop, then:
cd backend
npm start

# Terminal 3: Restart Expo
# Press Ctrl+C to stop, then:
cd mobile-app
npm start
```

#### Fix 2: Use 10.0.2.2 (Android Emulator)
If using Android Emulator (not physical device):
```javascript
const API_BASE_URL = 'http://10.0.2.2:3000'; // For emulator
```

#### Fix 3: Use Computer's IP (Same Network)
If devices are on same WiFi:
```bash
# Find your IP
ipconfig
# Look for IPv4 Address (e.g., 192.168.1.100)
```

Then in `api.js`:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000'; // Your IP
```

#### Fix 4: Check Firewall
Windows Firewall might be blocking:
1. Open **Windows Defender Firewall**
2. Click **"Allow an app through firewall"**
3. Find **Node.js** and allow it
4. Or temporarily disable firewall to test

---

### Step 7: Debug Network Requests

**Add logging to see what's happening:**

In `mobile-app/services/api.js`, add after line 40:
```javascript
// Debug logging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📍 Full URL:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    console.error('📍 URL:', error.config?.url);
    console.error('📍 Base URL:', error.config?.baseURL);
    return Promise.reject(error);
  }
);
```

Then check Expo Go logs or Metro bundler terminal for these messages.

---

### Step 8: Alternative - Use ngrok

If USB port forwarding doesn't work:

1. **Install ngrok:** https://ngrok.com/download
2. **Start tunnel:**
   ```bash
   ngrok http 3000
   ```
3. **Copy HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)
4. **Update `api.js`:**
   ```javascript
   const API_BASE_URL = 'https://abc123.ngrok-free.app';
   ```

---

## Quick Checklist

- [ ] ADB port forwarding active: `adb reverse --list`
- [ ] Device connected: `adb devices`
- [ ] Backend running: http://localhost:3000/health works
- [ ] API URL is `http://localhost:3000` in `api.js`
- [ ] USB cable connected
- [ ] USB Debugging enabled on phone
- [ ] Expo Go app is latest version
- [ ] Metro bundler shows no errors

---

## Still Not Working?

1. **Check backend logs** - Are requests reaching the server?
2. **Check phone logs** - Use `adb logcat` to see Android logs
3. **Try ngrok** - Bypasses USB entirely
4. **Use WiFi** - Connect both devices to same network

