# Using ngrok to Expose Backend API

Since your devices aren't on the same network, use ngrok to create a public URL for your backend.

## Quick Setup

1. **Download ngrok:**
   - Go to https://ngrok.com/download
   - Download for Windows
   - Extract the .exe file

2. **Sign up for free account:**
   - Go to https://dashboard.ngrok.com/signup
   - Create a free account
   - Get your authtoken from the dashboard

3. **Configure ngrok:**
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

5. **Copy the HTTPS URL:**
   - You'll see something like: `https://abc123.ngrok-free.app`
   - Copy this URL

6. **Update mobile app API URL:**
   - Open `mobile-app/services/api.js`
   - Change `API_BASE_URL` to your ngrok URL:
     ```javascript
     const API_BASE_URL = 'https://abc123.ngrok-free.app';
     ```

## Alternative: Use ngrok in the backend

You can also add ngrok directly to your backend package.json:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "tunnel": "ngrok http 3000"
}
```

Then run: `npm run tunnel` in a separate terminal.

## Important Notes

- **Free ngrok URLs change** every time you restart ngrok (unless you have a paid plan)
- **Update the mobile app** API URL each time you restart ngrok
- **HTTPS is required** for mobile apps, so use the `https://` URL from ngrok
- **ngrok free tier** has limitations but is fine for development

