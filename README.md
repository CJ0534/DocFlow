# DocFlow - Document Management System

A full-stack document management solution built for the hackathon with Node.js backend and React Native Android application.

## 📋 Overview

DocFlow enables users to:
- Create organizations and projects
- Upload documents to projects
- Extract metadata and text content from files
- View extraction results in a mobile app

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- SQLite database
- JWT authentication
- Multer for file uploads

**Android App:**
- React Native
- React Navigation
- AsyncStorage for token persistence
- Axios for API communication

## 📁 Project Structure

```
DocFlow/
├── backend/              # Node.js Express API
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── storage/         # Uploaded files & extractions
│   └── server.js        # Entry point
├── android/             # React Native mobile app
│   ├── src/
│   │   ├── api/        # API client
│   │   ├── context/    # Auth context
│   │   └── screens/    # App screens
│   └── App.js          # Main component
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **React Native CLI**: `npm install -g react-native-cli`
- **JDK** 11 or higher

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:3000`

4. **Test the API:**
   ```bash
   curl http://localhost:3000/health
   ```

### Android App Setup

1. **Navigate to android directory:**
   ```bash
   cd android
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure backend URL:**
   - Open `src/api/client.js`
   - Find your machine's IP address:
     - Windows: `ipconfig`
     - Mac/Linux: `ifconfig`
   - Update `BASE_URL` to `http://YOUR_IP:3000`

4. **Start Metro bundler:**
   ```bash
   npm start
   ```

5. **Run on Android** (in a new terminal):
   ```bash
   npm run android
   ```

   Or open `android/` folder in Android Studio and run the app.

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Organizations (Requires Authentication)
- `POST /orgs` - Create organization
  ```json
  {
    "name": "My Organization"
  }
  ```

- `GET /orgs` - List user's organizations

### Projects (Requires Authentication)
- `POST /orgs/:orgId/projects` - Create project
  ```json
  {
    "name": "My Project"
  }
  ```

- `GET /orgs/:orgId/projects` - List organization's projects

### Documents (Requires Authentication)
- `POST /projects/:projectId/documents` - Upload document (multipart/form-data)
  - Field name: `file`

- `GET /projects/:projectId/documents` - List project's documents

- `POST /documents/:documentId/extract` - Extract document content

## 💾 Storage Structure

Uploaded files and extraction results are stored in:
```
backend/storage/<project_id>/<document_id>/
├── <original_filename>     # The uploaded file
├── meta.json              # File metadata
└── extracted.json         # Extraction results
```

**meta.json** contains:
- document_id, project_id, filename
- file_size, mime_type
- upload and extraction timestamps

**extracted.json** contains:
- extraction_type (metadata_only or text)
- metadata (same as meta.json)
- content (for text files): text, word count, line count, character count

## 🔄 Complete Workflow

1. **Register/Login** - Create account or login
2. **Create Organization** - Tap + button on Organizations screen
3. **Create Project** - Navigate to organization, tap + to create project
4. **Upload Document** - Navigate to project, tap 📄 to upload file
5. **Extract Content** - Tap "Extract" button on uploaded document
6. **View Results** - Tap "View Extraction" to see extracted data

## 🎯 Features Implemented

✅ Email/password authentication  
✅ JWT token-based authorization  
✅ User → Organization → Project → Document hierarchy  
✅ File upload (multipart, up to 100MB)  
✅ Metadata extraction for all files  
✅ Text content extraction for text files  
✅ Local folder structure storage  
✅ Document status tracking (uploaded, processing, extracted, failed)  
✅ Mobile-friendly UI with React Native  
✅ File picker integration  
✅ Real-time extraction status display  

## 🧪 Testing

### Test Backend APIs

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Create Organization (use token from login)
curl -X POST http://localhost:3000/orgs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Org"}'

# Upload Document
curl -X POST http://localhost:3000/projects/PROJECT_ID/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/file.txt"
```

## 🎬 Demo Video

> **Note**: Include link to demo video here showing:
> - User registration/login
> - Creating organization
> - Creating project
> - Uploading file
> - Extracting content
> - Viewing saved outputs in storage folder

## 🐛 Troubleshooting

### Backend Issues

**Database errors:**
- Delete `docflow.db` file and restart server to reset database

**Port already in use:**
- Change `PORT` in `.env` file

### Android Issues

**Metro bundler errors:**
```bash
cd android
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**Unable to connect to backend:**
- Ensure backend is running
- Verify IP address in `src/api/client.js`
- Check firewall settings
- Make sure both devices are on same network

**Build errors:**
```bash
cd android/android
./gradlew clean
cd ..
npm run android
```

## 📝 Notes

- SQLite database file is created automatically on first run
- Uploaded files are stored in `backend/storage/`
- Auth tokens expire in 7 days
- Text extraction works for files with MIME type `text/*` or `.txt` extension
- For PDF/DOCX extraction, additional libraries would be needed (bonus feature)

## 🚀 Future Enhancements

- PDF content extraction
- DOCX content extraction
- Image OCR
- File preview in app
- Search functionality
- Sharing/collaboration features
- Cloud storage integration

## 📄 License

MIT

## 👥 Contributors

Developed for the Hackathon - Full-Stack Document Management Solution