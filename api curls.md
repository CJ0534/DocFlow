# DocFlow Access & API Reference

## 1. Browser URLs (Onboarding Pages)
To access specific parts of the site directly while logged in, use these paths:

| Page | URL Path |
| :--- | :--- |
| **Onboarding** (Role Selection) | `http://localhost:5173/onboarding` |
| **Auth Success** | `http://localhost:5173/auth-success` |
| **Organization Setup** | `http://localhost:5173/org-setup` |

---

## 2. API Testing (cURL Commands)

### Authentication
**Register User**
```bash
curl -X POST 'https://okjtycflldzztdynffzh.supabase.co/auth/v1/signup' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jankutasaichaithanya@gmail.com",
    "password": "Iphone16@sid"
  }'
```

**Login (Get Token)**
```bash
curl -X POST 'https://okjtycflldzztdynffzh.supabase.co/auth/v1/token?grant_type=password' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jankutasaichaithanya@gmail.com",
    "password": "Iphone16@sid"
  }'
```

### Database Operations (POST)
*Note: Use the `access_token` from login in the `Authorization` header.*

**Create Organization**
```bash
curl -X POST 'https://okjtycflldzztdynffzh.supabase.co/rest/v1/organizations' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Organization",
    "industry": "Technology",
    "size": "1-5"
  }'
```

**Create Project**
```bash
curl -X POST 'https://okjtycflldzztdynffzh.supabase.co/rest/v1/projects' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Alpha",
    "org_id": "YOUR_ORG_ID"
  }'
```

---

## 3. Storage Operations

**Upload Document**
```bash
curl -X POST 'https://okjtycflldzztdynffzh.supabase.co/storage/v1/object/documents/PROJECT_ID/filename.txt' \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ranR5Y2ZsbGR6enRkeW5mZnpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMDEyODQsImV4cCI6MjA4MTc3NzI4NH0.yjpEI4paXw1mb4a8v9YvZSYfHaYmnuR3dCVfwQ-oen4" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: text/plain" \
  --data-binary "File content here"
```
