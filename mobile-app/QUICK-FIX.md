# Quick Fix for Network Timeout

## The Problem
Metro bundler shows no logs, but app shows "network response timed out"

## Solution: Try These URLs

Since port forwarding works (verified with curl), the issue might be how React Native resolves `localhost`.

### Option 1: Use 127.0.0.1 instead of localhost

In `mobile-app/services/api.js`, change line 13:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://127.0.0.1:3000'  // Try this instead of localhost
  : 'https://your-backend-url.com';
```

### Option 2: Use your computer's IP

1. Find your IP:
   ```bash
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.119)

2. Update `api.js`:
   ```javascript
   const API_BASE_URL = __DEV__ 
     ? 'http://192.168.1.119:3000'  // Your IP
     : 'https://your-backend-url.com';
   ```

3. Make sure both devices are on same WiFi

### Option 3: Check Metro Bundler Logs

After making changes:
1. **Reload the app** in Expo Go (shake device → Reload)
2. **Check Metro terminal** - you should now see logs:
   - `🚀 App started, testing backend connection...`
   - `🧪 Testing API connection to: ...`
   - Either `✅ Connection test successful` or `❌ Connection test failed`

## Debug Steps

1. **Check if test connection runs:**
   - Open app
   - Look in Metro terminal for connection test logs
   - If you see nothing, the app might not be reloading

2. **Force reload:**
   - In Expo Go: Shake device → "Reload"
   - Or press `r` in Metro terminal

3. **Check backend logs:**
   - Look at backend terminal
   - Do you see any requests coming in?
   - If yes → backend is reachable
   - If no → connection isn't working

4. **Try the test endpoint:**
   - The app now tests connection on startup
   - Check Metro logs for the test result

## What I Added

1. ✅ Connection test on app startup
2. ✅ Connection test on login screen
3. ✅ Better error logging
4. ✅ Debug messages in console

## Next Steps

1. Try changing `localhost` to `127.0.0.1` in `api.js`
2. Reload app (shake device → Reload)
3. Check Metro terminal for logs
4. Try login again
5. Check what logs appear

