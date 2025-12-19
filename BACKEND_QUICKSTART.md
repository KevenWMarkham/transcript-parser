# Backend Quick Start Guide

**Sprint 7: Backend Integration - Get Up and Running in 5 Minutes**

## Prerequisites

- [x] Node.js 20+ installed
- [ ] PostgreSQL installed or Docker Desktop
- [ ] FFmpeg installed
- [ ] Gemini API key

## Quick Setup

### 1. Install FFmpeg (if not installed)

**Windows:** Download from https://ffmpeg.org/download.html and add to PATH

**Mac:** `brew install ffmpeg`

**Linux:** `sudo apt-get install ffmpeg`

**Verify:** `ffmpeg -version`

### 2. Start PostgreSQL

**Using Docker (easiest):**
```bash
docker run --name transcript-postgres -e POSTGRES_DB=transcript_parser -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15-alpine
```

**OR use existing PostgreSQL and create database:**
```bash
createdb transcript_parser
```

### 3. Configure Backend

```bash
cd server
copy .env.example .env
```

**Edit `.env` file** - Add your Gemini API key:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transcript_parser
JWT_SECRET=change-this-to-random-string-minimum-32-chars
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

**Get Gemini API Key:** https://makersuite.google.com/app/apikey

### 4. Set Up Database

```bash
npm run db:generate
npm run db:push
```

### 5. Start Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on port 3000
💾 Database: Connected
🤖 Gemini: Configured
```

### 6. Test Backend

Open http://localhost:3000/health

Should return: `{"status":"ok","timestamp":"..."}`

### 7. Configure Frontend

```bash
cd ..
copy .env.example .env
```

File should contain:
```env
VITE_API_URL=http://localhost:3000/api
```

### 8. Start Frontend

```bash
npm run dev
```

### 9. Test the App

1. Open http://localhost:5173
2. Register a new account
3. Upload a video file
4. Watch the magic happen! ✨

## Troubleshooting

**Database won't connect?**
- Check PostgreSQL is running: `docker ps` or check service
- Verify DATABASE_URL in `.env`

**FFmpeg error?**
- Run `ffmpeg -version` to verify installation
- Ensure FFmpeg is in your PATH

**Gemini API error?**
- Verify API key in `.env` is correct
- Check quota at https://makersuite.google.com

**Port 3000 in use?**
- Change `PORT=3001` in server `.env`
- Update frontend `.env`: `VITE_API_URL=http://localhost:3001/api`

## What's Next?

- Review [Sprint-7-Setup-Guide.md](./docs/Sprint-7-Setup-Guide.md) for detailed setup
- Check [Sprint-7-Implementation-Summary.md](./docs/Sprint-7-Implementation-Summary.md) for architecture details
- Read [server/README.md](./server/README.md) for API documentation

## Need Help?

Check the comprehensive setup guide in `docs/Sprint-7-Setup-Guide.md`

---

**You're all set!** The backend is running and ready to process videos. 🚀
