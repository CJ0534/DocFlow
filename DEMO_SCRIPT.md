# DocFlow Demo Video Script (2-5 minutes)

## Setup (Before Recording)
- Ensure backend is running on http://localhost:3000
- Android app running on emulator or device
- Have a sample text file ready (e.g., `sample.txt`)
- Clear any existing test data for fresh demo

## 🎬 Demo Flow

### Opening (5 seconds)
"Hi, I'm demonstrating DocFlow - a complete document management system built with Node.js and React Native."

### 1. Registration (15 seconds)
**Show:** Registration screen
**Actions:**
- Enter email: `demo@docflow.com`
- Enter password: `demo123`
- Tap "Register"
- Show successful registration → automatic login

**Narration:** "First, I'll create a new account. The system uses JWT authentication with encrypted passwords."

### 2. Create Organization (15 seconds)
**Show:** Organizations screen (empty state)
**Actions:**
- Tap + floating action button
- Enter organization name: "Hackathon Projects"
- Tap "Create"
- Show organization appearing in list

**Narration:** "Now I'll create an organization. Users can manage multiple organizations."

### 3. Create Project (15 seconds)
**Show:** Organizations list
**Actions:**
- Tap on "Hackathon Projects" organization
- Tap + button on Projects screen
- Enter project name: "Document Processing"
- Tap "Create"
- Show project in list

**Narration:** "Within this organization, I'll create a project. Projects contain documents."

### 4. Upload Document (20 seconds)
**Show:** Projects list
**Actions:**
- Tap on "Document Processing" project
- Tap 📄 upload button
- Select file from file picker (show `sample.txt`)
- Wait for upload to complete
- Show document in list with "uploaded" (orange) status
- Point out file details: name, size, type, timestamp

**Narration:** "Now for the main feature - uploading a document. I'll select a text file. Notice it shows up with 'uploaded' status and all the file details."

### 5. Extract Content (25 seconds)
**Show:** Documents screen with uploaded file
**Actions:**
- Tap "Extract" button on the document
- Show status change to "processing" (blue) - briefly
- Wait for completion
- Show status change to "extracted" (green)
- Tap "View Extraction" button
- Show extraction results:
  - Extraction type: "text"
  - Statistics: word count, line count, character count
  - Text preview

**Narration:** "The extraction process analyzes the file. For text files, it extracts the content and provides statistics. Here you can see the word count, line count, and a preview of the text."

### 6. Show Storage Structure (30 seconds)
**Show:** File explorer or terminal
**Actions:**
- Navigate to `backend/storage/`
- Open the `<project_id>` folder
- Open the `<document_id>` folder
- Show three files:
  - Original file: `sample.txt`
  - `meta.json`
  - `extracted.json`
- Open `meta.json` in text editor - show metadata
- Open `extracted.json` in text editor - show extraction results with content

**Narration:** "On the backend, everything is saved in a structured folder. Each document gets its own folder with the original file, metadata JSON, and extraction results. This meets the requirement of storing outputs in storage/project_id/document_id/ format."

### 7. Backend API (20 seconds)
**Show:** Terminal or Postman/Browser
**Actions:**
- Show backend running in terminal with API banner
- (Optional) Open http://localhost:3000 in browser showing API info
- (Optional) Show one curl command demonstrating authentication

**Narration:** "The backend is a Node.js Express server with all required endpoints: authentication, organizations, projects, documents, and extraction. It uses SQLite database and JWT tokens for security."

### 8. Architecture Overview (10 seconds)
**Show:** README.md or code structure
**Actions:**
- Briefly show project structure
- Highlight backend/ and android/ folders
- Show key files (server.js, App.js)

**Narration:** "The solution follows a clean architecture with separate backend and Android folders, comprehensive documentation, and follows all hackathon requirements."

### Closing (10 seconds)
**Show:** Return to app or final screen
**Actions:**
- Show logout functionality
- Return to login screen

**Narration:** "That's DocFlow - a complete end-to-end document management solution with authentication, hierarchical organization, file upload, extraction, and local storage. Thank you!"

## 📝 Key Points to Emphasize

1. **Authentication** - JWT-based, secure
2. **Hierarchy** - User → Organization → Project → Document
3. **File Upload** - Multipart, up to 100MB
4. **Extraction** - Automatic metadata + text content
5. **Storage** - Structured folders with all required files
6. **Status Tracking** - Real-time document status
7. **Mobile UI** - Clean, professional React Native interface

## 🎯 Hackathon Requirements Checklist (Mention Verbally)

✅ Backend: Node.js + Express  
✅ Mobile: React Native  
✅ Email/password authentication  
✅ Complete data hierarchy  
✅ File upload with multipart  
✅ Metadata extraction (all files)  
✅ Text extraction (text files)  
✅ Local storage structure  
✅ All required endpoints  

## 💡 Tips for Recording

- **Screen Setup**: Split screen showing app and file explorer, or switch between them
- **Audio**: Clear narration, no background noise
- **Pacing**: Not too fast - give viewers time to see changes
- **Highlights**: Use arrows/circles to point to important elements
- **Quality**: 720p minimum, 1080p preferred
- **Duration**: Aim for 3-4 minutes - thorough but concise
- **Tools**: OBS Studio, Loom, or built-in screen recording

## 📹 Recording Checklist

Before starting:
- [ ] Backend server running and tested
- [ ] Android app running smoothly
- [ ] Sample files prepared
- [ ] Screen recording software ready
- [ ] Audio test completed
- [ ] Plan practiced once

After recording:
- [ ] Review video for clarity
- [ ] Check audio quality
- [ ] Verify all features shown
- [ ] Export in common format (MP4)
- [ ] Upload to YouTube/Drive
- [ ] Add link to README
