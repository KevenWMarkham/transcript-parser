# Roadmap Updates - December 17, 2025

## Summary

Major architecture shift from client-only app to full-stack PWA with PostgreSQL backend and universal codec support.

---

## 🔄 Key Changes

### 1. Data Storage Architecture

**OLD:** IndexedDB-only (browser local storage)

```
- Primary: IndexedDB
- Fallback: localStorage
- Limitation: Browser-only, no cross-device sync
```

**NEW:** PostgreSQL with Docker Desktop + PWA offline capability

```
- Primary: PostgreSQL (server-side archiving)
- Backend: Node.js + Express + Drizzle ORM
- Local: IndexedDB (future offline enhancement)
- Benefits: Cross-device sync, searchable archive, user accounts
```

---

### 2. Sprint 3 - Complete Overhaul

**OLD Sprint 3:** Speaker Diarization & Transcript Processing

```
Focus: Speaker merging, confidence scores, quality indicators
```

**NEW Sprint 3:** Backend Infrastructure & Docker PostgreSQL

```
Focus Areas:
1. Docker Desktop PostgreSQL setup
2. Node.js + Express backend API
3. User authentication (JWT + bcrypt)
4. Transcript CRUD operations
5. Video blob storage
6. FFmpeg.wasm codec support (NEW!)
7. Frontend API integration
```

**NEW TASKS:**

- **Task 3.1:** Docker Desktop PostgreSQL Setup (4 hours)
- **Task 3.2:** Backend Project Setup (2 hours)
- **Task 3.3:** Database Schema Implementation (4 hours)
- **Task 3.4:** Express Server Implementation (3 hours)
- **Task 3.5:** Authentication Implementation (4 hours)
- **Task 3.6:** Transcript CRUD API (5 hours)
- **Task 3.7:** Frontend Integration (4 hours)
- **Task 3.8:** FFmpeg.wasm Codec Support (6 hours) ⭐ NEW
- **Task 3.9:** UI Components for Archive (6 hours)

**Total Effort:** ~38 hours (2 weeks)

---

### 3. Sprint 9 - PWA Features (Formerly IndexedDB)

**OLD Sprint 9:** IndexedDB Integration & Transcript Library

```
Focus: Browser-only storage, transcript library
```

**NEW Sprint 9:** Progressive Web App (PWA) Features

```
Focus Areas:
1. Vite PWA plugin configuration
2. Web app manifest with icons
3. Service worker caching strategies
4. Install prompts (Windows, Mac, iOS, Android)
5. Offline support
6. Update notifications
7. Lighthouse optimization (PWA score 100)
```

**Rationale:** Sprint 3 now handles database persistence, so Sprint 9 focuses on making the app installable and work offline.

---

### 4. FFmpeg.wasm Integration (NEW!)

**Addition:** Universal codec support for all video files

**Problem Solved:**

- Browser MediaRecorder fails on 30% of videos (AC-3, DTS, FLAC, etc.)
- User's video with AC-3 audio couldn't be processed

**Solution:**

- Browser-first strategy: Try MediaRecorder (fast, works for 70% of videos)
- Fallback to FFmpeg.wasm: Universal support for ANY codec
- One-time 31MB download, cached for future use

**Benefits:**

- ✅ Works with ALL video codecs
- ✅ Fast for common formats (AAC, Opus)
- ✅ Graceful fallback for edge cases
- ✅ No server-side processing needed

---

## 📊 Updated Sprint Timeline

| Sprint | Weeks | OLD Focus                    | NEW Focus                  | Major Changes       |
| ------ | ----- | ---------------------------- | -------------------------- | ------------------- |
| **1**  | 1-2   | Foundation & Upload          | Foundation & Upload        | ✅ No change        |
| **2**  | 3-4   | AI Integration               | AI Integration             | ✅ No change        |
| **3**  | 5-6   | Speaker Processing           | **Backend Infrastructure** | 🔄 **MAJOR CHANGE** |
| **4**  | 7-8   | Transcript Display           | Transcript Display         | ✅ No change        |
| **5**  | 9-10  | Export Features              | Export Features            | ✅ No change        |
| **6**  | 11-12 | Video Sync                   | Video Sync                 | ✅ No change        |
| **7**  | 13-14 | Speaker Management           | Speaker Management         | ✅ No change        |
| **8**  | 15-16 | Search & UX                  | Search & UX                | ✅ No change        |
| **9**  | 17-18 | Data Persistence (IndexedDB) | **PWA Features**           | 🔄 **MAJOR CHANGE** |
| **10** | 19-20 | Integration & Polish         | Integration & Polish       | ✅ No change        |

---

## 🛠️ New Technology Stack

### Frontend (No Changes)

- React 18.3.1 + TypeScript 5.6.2
- Vite 6.0.5
- Tailwind CSS 4.1.18
- @google/genai 1.34.0 (Gemini SDK)
- Jest + Playwright (testing)

### Backend (NEW!)

- **Node.js 20+**
- **Express 4.x** - Web framework
- **PostgreSQL 16** - Database
- **Drizzle ORM** - Type-safe ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Docker Desktop** - Local PostgreSQL

### PWA (NEW!)

- **vite-plugin-pwa** - Service worker generation
- **workbox-window** - Caching strategies

### Codecs (NEW!)

- **@ffmpeg/ffmpeg** - Universal video/audio support
- **@ffmpeg/util** - FFmpeg utilities

---

## 📁 New Project Structure

```
transcript-parser/
├── src/                          # Frontend (React)
│   ├── components/
│   ├── hooks/
│   ├── services/
│   │   ├── geminiClient.ts
│   │   ├── audioExtractor.ts
│   │   ├── ffmpegExtractor.ts   # NEW
│   │   └── apiClient.ts         # NEW
│   └── types/
├── server/                       # NEW - Backend
│   ├── index.ts
│   ├── config/
│   │   └── database.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── transcripts.ts
│   │   └── search.ts
│   ├── controllers/
│   ├── middleware/
│   └── types/
├── Specs/
│   ├── architecture/
│   │   └── FULL_STACK_ARCHITECTURE.md  # NEW
│   ├── deployment/
│   │   └── PWA_DEPLOYMENT_GUIDE.md     # NEW
│   ├── backend/
│   │   ├── BACKEND_SETUP.md            # NEW
│   │   ├── API_REFERENCE.md            # NEW
│   │   └── DATABASE_SCHEMA.md          # NEW
│   └── sprints/
│       ├── sprint-3/
│       │   ├── SPRINT_3_UPDATED.md     # NEW
│       │   └── TASK_3.8_FFMPEG_CODEC_SUPPORT.md  # NEW
│       └── sprint-9/
│           └── SPRINT_9_PWA_FEATURES.md          # NEW
├── docker-compose.yml            # NEW
├── .env.local                    # NEW
└── package.json
```

---

## 🗄️ Database Schema

### New Tables

**users**

- id (UUID)
- email (unique)
- password_hash
- name
- created_at, updated_at

**transcripts**

- id (UUID)
- user_id (FK → users)
- title, description
- file_name, file_size, duration
- video_format, model
- created_at, updated_at

**speakers**

- id (UUID)
- transcript_id (FK → transcripts)
- speaker_number
- speaker_name
- color

**transcript_entries**

- id (UUID)
- transcript_id (FK → transcripts)
- speaker_id (FK → speakers)
- start_time, end_time
- text, confidence
- entry_order

**video_blobs** (optional)

- id (UUID)
- transcript_id (FK → transcripts)
- blob_data (BYTEA or base64 text)
- blob_type, blob_size
- uploaded_at

---

## 🚀 Deployment Architecture

### Development

```
Frontend: http://localhost:5173 (Vite)
Backend: http://localhost:3000 (Express)
Database: localhost:5432 (Docker PostgreSQL)
```

### Production (Recommended)

```
Frontend: Vercel (free tier, auto-HTTPS, global CDN)
Backend: Railway ($5-10/month, includes PostgreSQL)
Database: Managed PostgreSQL on Railway
PWA: Installable on all platforms
```

**Total Cost:** $5-10/month for thousands of users

---

## 📋 New Dependencies

### Backend

```json
{
  "dependencies": {
    "express": "^4.x",
    "pg": "^8.x",
    "drizzle-orm": "^0.45.1",
    "jsonwebtoken": "^9.x",
    "bcrypt": "^5.x",
    "cors": "^2.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "@types/express": "^4.x",
    "@types/bcrypt": "^5.x",
    "@types/jsonwebtoken": "^9.x",
    "drizzle-kit": "^0.31.8",
    "tsx": "^4.x",
    "nodemon": "^3.x"
  }
}
```

### PWA

```json
{
  "devDependencies": {
    "vite-plugin-pwa": "latest",
    "workbox-window": "latest"
  }
}
```

### Codecs

```json
{
  "dependencies": {
    "@ffmpeg/ffmpeg": "^0.12.6",
    "@ffmpeg/util": "^0.12.1"
  }
}
```

---

## ✅ Updated Success Metrics

### Functional Requirements (Updated)

- ✅ Successfully transcribe videos up to **500MB** (FFmpeg limit)
- ✅ Support **ALL audio codecs** (via FFmpeg.wasm)
- ✅ **User accounts** with private transcript libraries
- ✅ **Cross-device access** (save on phone, view on desktop)
- ✅ **Installable on 4 platforms** (Windows, Mac, iOS, Android)
- ✅ **Works offline** after first load

### Quality Requirements (Updated)

- ✅ **Lighthouse PWA score: 100**
- ✅ Backend API response time < 200ms
- ✅ Database queries optimized with indexes
- ✅ Service worker caching for instant app loads

---

## 🎯 Platform Support Matrix

| Platform          | Install Method             | Offline | Video Processing | Gemini API |
| ----------------- | -------------------------- | ------- | ---------------- | ---------- |
| **Windows 10/11** | Edge/Chrome install button | ✅      | ✅               | ✅         |
| **macOS**         | Safari/Chrome Add to Dock  | ✅      | ✅               | ✅         |
| **iOS 16.4+**     | Safari Add to Home Screen  | ✅      | ✅               | ✅         |
| **Android**       | Chrome install banner      | ✅      | ✅               | ✅         |

**All platforms get:**

- Native app icon
- Standalone window
- Offline UI
- Background sync (future)
- Push notifications (future)

---

## 📚 New Documentation

### Architecture

1. **FULL_STACK_ARCHITECTURE.md** - Complete backend + database design
2. **PWA_DEPLOYMENT_GUIDE.md** - PWA setup and deployment
3. **FFMPEG_WASM_IMPLEMENTATION_GUIDE.md** - Codec support implementation

### Backend

4. **BACKEND_SETUP.md** - Docker, PostgreSQL, Express setup
5. **API_REFERENCE.md** - All API endpoints
6. **DATABASE_SCHEMA.md** - Database design

### Sprints

7. **SPRINT_3_UPDATED.md** - Backend infrastructure plan
8. **TASK_3.8_FFMPEG_CODEC_SUPPORT.md** - FFmpeg implementation
9. **SPRINT_9_PWA_FEATURES.md** - PWA features plan

---

## 🚧 Migration Path

### From Current State (Sprint 2 Complete)

**Already Working:**

- ✅ Video upload with validation
- ✅ Audio extraction (MediaRecorder)
- ✅ Gemini AI transcription
- ✅ Speaker diarization
- ✅ Transcript display

**Sprint 3 Adds:**

1. Docker PostgreSQL setup
2. Backend API
3. User authentication
4. Save/load transcripts
5. FFmpeg.wasm codec support

**No Breaking Changes:**

- Existing frontend components unchanged
- Add backend in parallel
- FFmpeg enhances (not replaces) audio extraction

---

## 💡 Rationale for Changes

### Why PostgreSQL over IndexedDB?

**IndexedDB Issues:**

- Browser-only (no cross-device)
- Quota limits (50MB-200MB)
- Complex API
- No search capabilities
- No user accounts

**PostgreSQL Benefits:**

- ✅ Unlimited storage (server-controlled)
- ✅ Cross-device sync
- ✅ Full-text search
- ✅ User accounts
- ✅ SQL queries
- ✅ Production-ready

### Why PWA over Native Apps?

**Native App Issues:**

- Separate iOS/Android/Desktop codebases
- App store submission delays
- Platform-specific languages (Swift, Kotlin, C#)
- Large development effort

**PWA Benefits:**

- ✅ One codebase for all platforms
- ✅ Instant deployment (no app store)
- ✅ Auto-updates
- ✅ Web technologies (React, TypeScript)
- ✅ Smaller development team

### Why FFmpeg.wasm?

**Browser MediaRecorder Limitations:**

- Only works with ~70% of videos
- Fails on AC-3, DTS, FLAC, etc.
- No fallback options

**FFmpeg.wasm Solution:**

- ✅ Universal codec support
- ✅ Browser-first strategy (fast for most)
- ✅ Automatic fallback (slow but works)
- ✅ One-time download, cached forever
- ✅ No server-side processing

---

## 📅 Updated Timeline

**Sprint 2 (Current):** AI Integration ✅ COMPLETE

- Video upload working
- Audio extraction (MediaRecorder) working
- Gemini transcription working
- Audio file support added

**Sprint 3 (Weeks 5-6):** Backend + FFmpeg

- Week 1: Docker PostgreSQL, backend API, authentication
- Week 2: Transcript CRUD, FFmpeg.wasm, testing

**Sprint 4-8 (Weeks 7-16):** Feature Development

- Display, export, video sync, speaker management, search

**Sprint 9 (Weeks 17-18):** PWA Features

- Service worker, manifest, install prompts, offline

**Sprint 10 (Weeks 19-20):** Polish

- E2E tests, performance, deployment

---

## ✨ New Features Enabled

**Cross-Platform Install:**

- Install on desktop (Windows/Mac)
- Install on mobile (iOS/Android)
- Works like native app

**Cloud Sync:**

- Save on phone, view on desktop
- Never lose transcripts
- Search all transcripts

**Universal Codec Support:**

- ANY video file works
- AC-3, DTS, FLAC supported
- Graceful fallback strategy

**Offline Capability:**

- App works without internet
- Cached transcripts available
- Graceful error messages

---

## 🎬 Updated Demo Flow

**Sprint 3 Demo:**

1. Show Docker Desktop with PostgreSQL running
2. Register new user account
3. Upload video with AC-3 audio
4. FFmpeg loads (31MB download)
5. Audio extraction succeeds
6. Gemini transcription completes
7. Click "Save Transcript"
8. View "My Transcripts" library
9. Delete transcript
10. Show pgAdmin with database data

**Sprint 9 Demo:**

1. Show install button in browser
2. Install app on desktop
3. Install app on phone
4. Open app offline
5. Show cached transcripts
6. Update notification appears
7. Click update, new version loads
8. Lighthouse PWA score: 100

---

## 📊 Impact Analysis

### Development Effort

- **Sprint 3:** +20 hours (backend + FFmpeg)
- **Sprint 9:** +0 hours (reallocation from IndexedDB)
- **Total:** +20 hours across 20-week project = +5%

### User Experience

- ✅ **+100% codec compatibility** (FFmpeg)
- ✅ **Cross-device access** (PostgreSQL)
- ✅ **Native app experience** (PWA)
- ✅ **Offline functionality** (Service Worker)

### Technical Debt

- ⚠️ **Backend infrastructure** (needs maintenance)
- ✅ **Type-safe ORM** (Drizzle reduces bugs)
- ✅ **Docker** (consistent environments)
- ✅ **Well-documented** (8 new docs)

---

## 🎯 Success Criteria

**Sprint 3 Complete When:**

- ✅ PostgreSQL running in Docker Desktop
- ✅ Backend API functional
- ✅ User authentication working
- ✅ Transcripts save/load from database
- ✅ FFmpeg.wasm handles incompatible codecs
- ✅ Frontend integrates with backend

**Sprint 9 Complete When:**

- ✅ App installable on all 4 platforms
- ✅ Lighthouse PWA score = 100
- ✅ Service worker caching working
- ✅ Offline mode functional
- ✅ Update notifications working

**MVP Complete When:**

- ✅ All 10 sprints done
- ✅ Deployed to production (Vercel + Railway)
- ✅ 90% test coverage
- ✅ Documentation complete
- ✅ Performance optimized

---

**Document Version:** 1.0
**Last Updated:** 2025-12-17
**Next Review:** End of Sprint 3
