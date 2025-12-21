// Optional: Script to automatically get ngrok URL and log it
// This requires ngrok to be running separately: ngrok http 3000

const express = require('express');
const app = express();

// This is just a helper - you still need to run ngrok separately
// Run: ngrok http 3000
// Then check ngrok dashboard or use: curl http://localhost:4040/api/tunnels

console.log(`
╔══════════════════════════════════════════════════════════════╗
║  DocFlow Backend Server                                      ║
╚══════════════════════════════════════════════════════════════╝

To expose this server to the internet (for mobile app on different network):

1. Install ngrok: https://ngrok.com/download
2. Sign up: https://dashboard.ngrok.com/signup
3. Configure: ngrok config add-authtoken YOUR_TOKEN
4. Start tunnel: ngrok http 3000
5. Copy the HTTPS URL (e.g., https://abc123.ngrok-free.app)
6. Update mobile-app/services/api.js with that URL

Server starting on http://localhost:3000
`);

// Your existing server code would go here
// This is just a placeholder - use server.js instead

