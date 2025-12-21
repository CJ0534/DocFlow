# DocFlow Mobile App

Android Expo app for DocFlow that connects to the backend API and uses the same Supabase database.

## Features

- ✅ Backend API integration (all endpoints)
- ✅ Authentication (Register/Login via backend)
- ✅ Organizations management (list + create)
- ✅ Projects management (list + create within org)
- ✅ Documents management (list + upload + extract)
- ✅ Display extraction status and metadata
- ✅ Real-time data synchronization via Supabase

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend server running (see backend/README.md)
- Expo Go app on Android device ([Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. Navigate to the mobile-app directory:
```bash
cd mobile-app
```

2. Install dependencies:
```bash
npm install
```

3. **Configure API URL**:
   - Open `mobile-app/services/api.js`
   - For local testing on physical device, change `API_BASE_URL` to your computer's IP address:
     ```javascript
     const API_BASE_URL = 'http://192.168.1.100:3000'; // Replace with your IP
     ```
   - Find your IP:
     - Windows: `ipconfig` (look for IPv4 Address)
     - Mac/Linux: `ifconfig` or `ip addr show`

4. Start the backend server (in backend folder):
```bash
cd ../backend
npm start
```

5. Start the Expo development server:
```bash
cd ../mobile-app
npm start
```

6. Scan the QR code with Expo Go app on your Android device

## Backend API Endpoints

The mobile app uses these backend endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /orgs` - Create organization (auth required)
- `GET /orgs` - Get user's organizations (auth required)
- `POST /orgs/:orgId/projects` - Create project (auth required)
- `GET /orgs/:orgId/projects` - Get organization's projects (auth required)
- `POST /projects/:projectId/documents` - Upload document (auth, multipart)
- `GET /projects/:projectId/documents` - Get project's documents (auth required)
- `POST /documents/:documentId/extract` - Extract document (auth required)

## Project Structure

```
mobile-app/
├── App.js                          # Main app with navigation
├── context/
│   └── AuthContext.jsx             # Authentication context
├── services/
│   └── api.js                      # Backend API client
├── screens/
│   ├── LoginScreen.js              # Login screen
│   ├── RegisterScreen.js           # Registration screen
│   ├── DashboardScreen.js          # Organizations list + create
│   ├── OrganizationDetailScreen.js # Projects list + create
│   ├── ProjectDetailScreen.js      # Documents list + upload + extract
│   └── DocumentDetailScreen.js     # Display extraction results
└── package.json
```

## Usage Flow

1. **Register/Login** → Authenticate via backend API
2. **Dashboard** → View and create organizations
3. **Organization Detail** → View and create projects
4. **Project Detail** → View documents, upload files, trigger extraction
5. **Document Detail** → View extraction status and results

## File Upload

The app supports uploading any file type. After upload:
- Document status: `uploaded`
- Click "Extract" to process the document
- Status changes: `uploaded` → `processing` → `extracted` or `failed`
- View extraction results in Document Detail screen

## Troubleshooting

### Backend Connection Issues

If you can't connect to the backend:
1. Make sure backend server is running (`npm start` in backend folder)
2. Check API_BASE_URL in `services/api.js` matches your backend URL
3. For physical device testing, use your computer's IP address (not localhost)
4. Ensure phone and computer are on the same WiFi network
5. Check firewall settings (port 3000 should be accessible)

### Authentication Issues

If login/register fails:
1. Check backend server logs for errors
2. Verify Supabase credentials in backend `.env` file
3. Check network connectivity

### File Upload Issues

If file upload fails:
1. Check file size (100MB limit)
2. Verify backend storage is configured
3. Check backend logs for errors

## Environment Variables

The backend needs these environment variables (in `backend/.env`):
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
```

## Notes

- The app uses the same Supabase database as the web app
- All authentication is handled by Supabase via the backend
- File uploads go through the backend API
- Document extraction is performed by the backend
- Token is stored in memory (consider using SecureStore for production)
