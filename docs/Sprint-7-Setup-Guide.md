# Sprint 7 Setup Guide - Backend Integration

This guide will walk you through setting up the backend API for the Transcript Parser application.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] Node.js 20+ installed
- [ ] PostgreSQL 15+ installed (or Docker Desktop)
- [ ] FFmpeg installed and in PATH
- [ ] Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- [ ] Visual Studio Code (recommended)

## Step 1: Install FFmpeg

### Windows
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to PATH environment variable
4. Verify: Open new terminal and run `ffmpeg -version`

### macOS
```bash
brew install ffmpeg
```

### Linux
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

## Step 2: Set Up PostgreSQL

### Option A: Using Docker (Recommended)
```bash
docker run --name transcript-postgres \
  -e POSTGRES_DB=transcript_parser \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Option B: Local Installation
1. Download and install PostgreSQL 15+
2. Create database:
```bash
createdb transcript_parser
```

## Step 3: Backend Configuration

1. Navigate to server directory:
```bash
cd server
```

2. Create `.env` file:
```bash
copy .env.example .env
```

3. Edit `.env` file with your settings:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transcript_parser

# JWT (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Important:** Replace `your-gemini-api-key-here` with your actual Gemini API key!

## Step 4: Install Dependencies

Already completed! Dependencies are installed in the server directory.

## Step 5: Set Up Database Schema

Generate and push the database schema:

```bash
cd server
npm run db:generate
npm run db:push
```

This will create all necessary tables in your PostgreSQL database.

## Step 6: Start the Backend Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📝 Environment: development
🔗 API: http://localhost:3000/api
💾 Database: Connected
🤖 Gemini: Configured
```

### Test the API
Open http://localhost:3000/health in your browser. You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-18T..."
}
```

## Step 7: Frontend Configuration

1. Navigate to root directory:
```bash
cd ..
```

2. Create frontend `.env` file:
```bash
copy .env.example .env
```

3. The file should contain:
```env
VITE_API_URL=http://localhost:3000/api
```

## Step 8: Start the Frontend

```bash
npm run dev
```

Your application should now be running at http://localhost:5173

## Testing the Complete Stack

### 1. Register a User
- Open http://localhost:5173
- Click "Sign Up" or "Register"
- Create an account with email and password

### 2. Upload a Video
- After logging in, upload a test video file
- The backend will:
  - Extract audio using FFmpeg
  - Transcribe with Gemini API
  - Store in PostgreSQL database
  - Return the transcript

### 3. View Transcripts
- Browse your transcripts
- Edit speaker names
- Export transcripts

## Common Issues and Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Ensure PostgreSQL is running: `docker ps` or check PostgreSQL service
- Verify DATABASE_URL in `.env` is correct
- Test connection: `psql postgresql://postgres:postgres@localhost:5432/transcript_parser`

### Issue: "FFmpeg not found"
**Solution:**
- Verify FFmpeg is installed: `ffmpeg -version`
- Add FFmpeg to PATH
- Restart terminal after adding to PATH

### Issue: "Gemini API error"
**Solution:**
- Verify your GEMINI_API_KEY in `.env` is correct
- Check API quota at https://makersuite.google.com
- Ensure you have enabled the Gemini API

### Issue: "CORS errors in browser"
**Solution:**
- Ensure CORS_ORIGIN in server `.env` matches frontend URL
- Default should be: `http://localhost:5173`

### Issue: "Port 3000 already in use"
**Solution:**
- Change PORT in server `.env` to different port (e.g., 3001)
- Update VITE_API_URL in frontend `.env` accordingly

## Database Management

### View database in Drizzle Studio
```bash
cd server
npm run db:studio
```

Opens a web UI at http://localhost:4983

### Reset database
```bash
# Drop all tables and recreate
npm run db:push -- --force
```

## Running with Docker Compose (Production-like)

For a complete production-like setup:

```bash
docker-compose up
```

This starts:
- PostgreSQL database
- Backend API server
- Frontend application

All services will be networked together automatically.

## API Documentation

### Authentication Endpoints

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get Current User**
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Transcript Endpoints

**Upload Video**
```http
POST /api/transcripts/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file>
title: "My Video"
```

**List Transcripts**
```http
GET /api/transcripts
Authorization: Bearer <token>
```

**Get Transcript**
```http
GET /api/transcripts/:id
Authorization: Bearer <token>
```

**Delete Transcript**
```http
DELETE /api/transcripts/:id
Authorization: Bearer <token>
```

**Update Entry**
```http
PATCH /api/transcripts/:id/entry/:entryId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated text",
  "speaker": "Updated Speaker Name"
}
```

## Next Steps

1. ✅ Backend is running
2. ✅ Frontend is connected
3. ✅ Database is set up
4. Test the complete upload-to-transcript flow
5. Deploy to production (see deployment guide)

## Need Help?

- Check the [server README](../server/README.md) for more details
- Review the [Sprint 7 execution prompt](../specs/sprints/sprint-7/Sprint-07-Execution-Prompt.md)
- Check server logs for error details

---

**Congratulations!** You've successfully set up the backend for Sprint 7! 🎉
