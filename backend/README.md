# DocFlow Backend API

Express.js backend API that uses Supabase for database and authentication.

## Features

- ✅ Supabase authentication (register/login)
- ✅ Organizations CRUD
- ✅ Projects CRUD (within organizations)
- ✅ Document upload (multipart/form-data)
- ✅ Document extraction
- ✅ File storage via Supabase Storage

## Setup

### Prerequisites

- Node.js (v18 or higher)
- Supabase account and project
- Supabase database schema set up (see `supabase_schema.sql`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3000
```

4. Set up Supabase database:
   - Run `supabase_schema.sql` in your Supabase SQL editor
   - This creates tables: organizations, projects, documents
   - Sets up Row Level Security (RLS) policies
   - Creates storage bucket for documents

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /auth/register`
  - Body: `{ email, password }`
  - Returns: `{ message, user, session }`

- `POST /auth/login`
  - Body: `{ email, password }`
  - Returns: `{ message, user, session, access_token }`

### Organizations

- `POST /orgs` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, type?, team_strength?, logo? }`
  - Returns: `{ message, organization }`

- `GET /orgs` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ organizations: [...] }`

### Projects

- `POST /orgs/:orgId/projects` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, description? }`
  - Returns: `{ message, project }`

- `GET /orgs/:orgId/projects` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ projects: [...] }`

### Documents

- `POST /projects/:projectId/documents` (auth required, multipart)
  - Headers: `Authorization: Bearer <token>`
  - Body: FormData with `file` field
  - Returns: `{ message, document }`

- `GET /projects/:projectId/documents` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ documents: [...] }`

- `POST /documents/:documentId/extract` (auth required)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message, document, extracted_data }`

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication.

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

The token is obtained from the login/register response.

## File Upload

Documents are uploaded as multipart/form-data:
- Field name: `file`
- Files are stored in Supabase Storage bucket `documents`
- File size limit: 100MB
- Supported formats: All file types

## Document Extraction

The extraction endpoint:
1. Downloads the file from Supabase Storage
2. Extracts metadata (filename, size, type, etc.)
3. For text files, extracts content and statistics
4. Updates document status to `extracted`
5. Returns extraction results

## Database Schema

See `supabase_schema.sql` for the complete schema. Main tables:
- `organizations` - User organizations
- `projects` - Projects within organizations
- `documents` - Documents within projects

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Error Handling

All endpoints return JSON with error messages:
```json
{
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to auto-reload on file changes.

### Testing

Test endpoints using:
- Postman
- curl
- The mobile app
- The web app

Example curl command:
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get organizations (replace TOKEN with actual token)
curl http://localhost:3000/orgs \
  -H "Authorization: Bearer TOKEN"
```

## Production Deployment

1. Set environment variables on your hosting platform
2. Ensure Supabase project is accessible
3. Update CORS settings if needed
4. Use a process manager like PM2
5. Set up SSL/HTTPS
6. Update mobile app API_BASE_URL to production URL

## Notes

- Uses Supabase for database and authentication
- File storage via Supabase Storage
- Row Level Security ensures data isolation
- All endpoints are RESTful
- Supports CORS for cross-origin requests

