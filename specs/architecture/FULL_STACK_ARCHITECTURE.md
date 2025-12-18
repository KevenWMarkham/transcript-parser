# Full-Stack Architecture - Transcript Parser with PostgreSQL

**Date:** 2025-12-17
**Architecture:** Browser-based processing + PostgreSQL blob storage for archiving
**Stack:** React (Frontend) + Node.js/Express (Backend) + PostgreSQL (Database)

---

## Architecture Overview

### High-Level Flow

```
User Browser (Frontend)
    ↓
1. Upload video/audio file
    ↓
2. Extract audio (browser MediaRecorder or FFmpeg.wasm)
    ↓
3. Transcribe with Gemini AI (browser → Gemini API)
    ↓
4. Display transcript to user
    ↓
5. Save to PostgreSQL (send to backend)
    ↓
Backend (Node.js + Express)
    ↓
6. Store transcript + metadata + video blob
    ↓
PostgreSQL Database
    ↓
7. User can view/search/download saved transcripts
```

### Key Benefits

✅ **Browser-based processing** - No server-side transcription costs
✅ **PostgreSQL archiving** - Reliable, searchable storage
✅ **User accounts** - Each user has their own transcript library
✅ **Scalable** - Process video client-side, store results server-side
✅ **Privacy** - Videos processed locally, only results stored

---

## System Architecture

### Components

**Frontend (React + Vite)**

- Video/audio upload and playback
- Audio extraction (MediaRecorder API / FFmpeg.wasm)
- Gemini AI transcription (client-side API calls)
- Transcript display and editing
- User authentication
- Archive management (view/search/download)

**Backend (Node.js + Express)**

- REST API for transcript CRUD operations
- User authentication (JWT)
- PostgreSQL database operations
- File upload handling (video blobs)
- Search and filtering

**Database (PostgreSQL)**

- User accounts
- Transcript metadata
- Transcript entries (speaker, text, timestamps)
- Video/audio file blobs
- Full-text search indices

---

## Database Schema

### Tables

#### 1. users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### 2. transcripts

```sql
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Metadata
  title VARCHAR(500),
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  duration DECIMAL(10, 2), -- seconds
  video_format VARCHAR(50),

  -- Processing info
  model VARCHAR(100), -- gemini-2.5-flash
  processed_at TIMESTAMP DEFAULT NOW(),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B')
  ) STORED
);

CREATE INDEX idx_transcripts_user_id ON transcripts(user_id);
CREATE INDEX idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX idx_transcripts_search ON transcripts USING GIN(search_vector);
```

#### 3. speakers

```sql
CREATE TABLE speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  speaker_number INTEGER NOT NULL,
  speaker_name VARCHAR(255) NOT NULL, -- "Speaker 1", or custom name
  color VARCHAR(50), -- UI color

  UNIQUE(transcript_id, speaker_number)
);

CREATE INDEX idx_speakers_transcript_id ON speakers(transcript_id);
```

#### 4. transcript_entries

```sql
CREATE TABLE transcript_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES speakers(id) ON DELETE CASCADE,

  -- Entry data
  start_time DECIMAL(10, 3) NOT NULL, -- seconds with milliseconds
  end_time DECIMAL(10, 3) NOT NULL,
  text TEXT NOT NULL,
  confidence DECIMAL(3, 2), -- 0.00 to 1.00

  -- Ordering
  entry_order INTEGER NOT NULL,

  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', text)
  ) STORED
);

CREATE INDEX idx_entries_transcript_id ON transcript_entries(transcript_id);
CREATE INDEX idx_entries_speaker_id ON transcript_entries(speaker_id);
CREATE INDEX idx_entries_time ON transcript_entries(start_time, end_time);
CREATE INDEX idx_entries_search ON transcript_entries USING GIN(search_vector);
```

#### 5. video_blobs

```sql
CREATE TABLE video_blobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transcript_id UUID UNIQUE NOT NULL REFERENCES transcripts(id) ON DELETE CASCADE,

  -- Blob data
  blob_data BYTEA NOT NULL,
  blob_type VARCHAR(100) NOT NULL, -- MIME type
  blob_size BIGINT NOT NULL,

  -- Storage optimization
  compressed BOOLEAN DEFAULT FALSE,

  -- Timestamps
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_video_blobs_transcript_id ON video_blobs(transcript_id);
```

---

## Backend API Design

### Tech Stack

**Core:**

- Node.js 20+
- Express 4.x
- PostgreSQL 16+

**Libraries:**

- `pg` - PostgreSQL client
- `drizzle-orm` - Type-safe ORM (already in dependencies!)
- `express` - Web framework
- `jsonwebtoken` - JWT authentication
- `bcrypt` - Password hashing
- `multer` - File upload handling
- `zod` - Schema validation
- `cors` - CORS middleware

### Installation

```bash
# Backend dependencies
npm install express pg drizzle-orm jsonwebtoken bcrypt multer zod cors dotenv
npm install --save-dev @types/express @types/bcrypt @types/multer @types/jsonwebtoken
```

### Project Structure

```
transcript-parser/
├── src/                      # Frontend (React)
├── server/                   # Backend (Node.js)
│   ├── index.ts             # Express server entry
│   ├── config/
│   │   └── database.ts      # PostgreSQL connection
│   ├── db/
│   │   ├── schema.ts        # Drizzle schema
│   │   └── migrations/      # SQL migrations
│   ├── routes/
│   │   ├── auth.ts          # Auth routes
│   │   ├── transcripts.ts   # Transcript CRUD
│   │   └── search.ts        # Search routes
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── transcriptController.ts
│   │   └── searchController.ts
│   ├── middleware/
│   │   ├── auth.ts          # JWT verification
│   │   └── upload.ts        # File upload
│   └── utils/
│       ├── jwt.ts
│       └── validation.ts
├── package.json
└── tsconfig.json
```

---

## Backend Implementation

### 1. Database Schema (Drizzle ORM)

**File: `server/db/schema.ts`**

```typescript
import {
  pgTable,
  uuid,
  varchar,
  text,
  bigint,
  decimal,
  timestamp,
  boolean,
  integer,
  index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    emailIdx: index('idx_users_email').on(table.email),
  })
)

export const transcripts = pgTable(
  'transcripts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: varchar('title', { length: 500 }),
    description: text('description'),
    fileName: varchar('file_name', { length: 255 }).notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    duration: decimal('duration', { precision: 10, scale: 2 }),
    videoFormat: varchar('video_format', { length: 50 }),

    model: varchar('model', { length: 100 }),
    processedAt: timestamp('processed_at').defaultNow(),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    userIdIdx: index('idx_transcripts_user_id').on(table.userId),
    createdAtIdx: index('idx_transcripts_created_at').on(table.createdAt),
  })
)

export const speakers = pgTable(
  'speakers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    transcriptId: uuid('transcript_id')
      .notNull()
      .references(() => transcripts.id, { onDelete: 'cascade' }),
    speakerNumber: integer('speaker_number').notNull(),
    speakerName: varchar('speaker_name', { length: 255 }).notNull(),
    color: varchar('color', { length: 50 }),
  },
  table => ({
    transcriptIdIdx: index('idx_speakers_transcript_id').on(table.transcriptId),
  })
)

export const transcriptEntries = pgTable(
  'transcript_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    transcriptId: uuid('transcript_id')
      .notNull()
      .references(() => transcripts.id, { onDelete: 'cascade' }),
    speakerId: uuid('speaker_id')
      .notNull()
      .references(() => speakers.id, { onDelete: 'cascade' }),

    startTime: decimal('start_time', { precision: 10, scale: 3 }).notNull(),
    endTime: decimal('end_time', { precision: 10, scale: 3 }).notNull(),
    text: text('text').notNull(),
    confidence: decimal('confidence', { precision: 3, scale: 2 }),

    entryOrder: integer('entry_order').notNull(),
  },
  table => ({
    transcriptIdIdx: index('idx_entries_transcript_id').on(table.transcriptId),
    speakerIdIdx: index('idx_entries_speaker_id').on(table.speakerId),
  })
)

export const videoBlobs = pgTable(
  'video_blobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    transcriptId: uuid('transcript_id')
      .notNull()
      .references(() => transcripts.id, { onDelete: 'cascade' })
      .unique(),

    blobData: sql`BYTEA`.notNull(),
    blobType: varchar('blob_type', { length: 100 }).notNull(),
    blobSize: bigint('blob_size', { mode: 'number' }).notNull(),

    compressed: boolean('compressed').default(false),

    uploadedAt: timestamp('uploaded_at').defaultNow(),
  },
  table => ({
    transcriptIdIdx: index('idx_video_blobs_transcript_id').on(
      table.transcriptId
    ),
  })
)
```

### 2. Express Server

**File: `server/index.ts`**

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import transcriptRoutes from './routes/transcripts'
import searchRoutes from './routes/search'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '100mb' })) // For base64 video uploads
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)
app.use('/api/search', searchRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

### 3. Database Connection

**File: `server/config/database.ts`**

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
})

export const db = drizzle(pool, { schema })
```

### 4. Authentication Routes

**File: `server/routes/auth.ts`**

```typescript
import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../config/database'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'

const router = Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name,
      })
      .returning()

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default router
```

### 5. Transcript Routes

**File: `server/routes/transcripts.ts`**

```typescript
import { Router } from 'express'
import { db } from '../config/database'
import {
  transcripts,
  speakers,
  transcriptEntries,
  videoBlobs,
} from '../db/schema'
import { authMiddleware } from '../middleware/auth'
import { eq, desc } from 'drizzle-orm'

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// Create transcript
router.post('/', async (req, res) => {
  try {
    const userId = req.user!.userId
    const {
      title,
      description,
      fileName,
      fileSize,
      duration,
      videoFormat,
      model,
      speakers: speakerData,
      entries,
      videoBlob, // base64 or buffer
    } = req.body

    // Create transcript
    const [transcript] = await db
      .insert(transcripts)
      .values({
        userId,
        title,
        description,
        fileName,
        fileSize,
        duration,
        videoFormat,
        model,
      })
      .returning()

    // Create speakers
    const speakerIds = new Map<number, string>()
    for (const speaker of speakerData) {
      const [inserted] = await db
        .insert(speakers)
        .values({
          transcriptId: transcript.id,
          speakerNumber: speaker.id,
          speakerName: speaker.name,
          color: speaker.color,
        })
        .returning()

      speakerIds.set(speaker.id, inserted.id)
    }

    // Create entries
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      await db.insert(transcriptEntries).values({
        transcriptId: transcript.id,
        speakerId: speakerIds.get(entry.speakerNumber)!,
        startTime: entry.startTime.toString(),
        endTime: entry.endTime.toString(),
        text: entry.text,
        confidence: entry.confidence?.toString(),
        entryOrder: i,
      })
    }

    // Store video blob (if provided)
    if (videoBlob) {
      const buffer = Buffer.from(videoBlob.data, 'base64')
      await db.insert(videoBlobs).values({
        transcriptId: transcript.id,
        blobData: buffer,
        blobType: videoBlob.type,
        blobSize: buffer.length,
      })
    }

    res.json({ transcriptId: transcript.id })
  } catch (error) {
    console.error('Create transcript error:', error)
    res.status(500).json({ error: 'Failed to create transcript' })
  }
})

// Get all transcripts for user
router.get('/', async (req, res) => {
  try {
    const userId = req.user!.userId

    const results = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.userId, userId))
      .orderBy(desc(transcripts.createdAt))

    res.json(results)
  } catch (error) {
    console.error('Get transcripts error:', error)
    res.status(500).json({ error: 'Failed to fetch transcripts' })
  }
})

// Get single transcript with entries
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user!.userId
    const transcriptId = req.params.id

    // Get transcript
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.id, transcriptId))

    if (!transcript || transcript.userId !== userId) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Get speakers
    const speakersList = await db
      .select()
      .from(speakers)
      .where(eq(speakers.transcriptId, transcriptId))

    // Get entries
    const entriesList = await db
      .select()
      .from(transcriptEntries)
      .where(eq(transcriptEntries.transcriptId, transcriptId))
      .orderBy(transcriptEntries.entryOrder)

    res.json({
      id: transcript.id,
      metadata: {
        title: transcript.title,
        description: transcript.description,
        fileName: transcript.fileName,
        fileSize: transcript.fileSize,
        duration: transcript.duration,
        videoFormat: transcript.videoFormat,
        model: transcript.model,
        processedAt: transcript.processedAt,
        createdAt: transcript.createdAt,
      },
      speakers: speakersList,
      entries: entriesList,
    })
  } catch (error) {
    console.error('Get transcript error:', error)
    res.status(500).json({ error: 'Failed to fetch transcript' })
  }
})

// Get video blob
router.get('/:id/video', async (req, res) => {
  try {
    const userId = req.user!.userId
    const transcriptId = req.params.id

    // Verify ownership
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.id, transcriptId))

    if (!transcript || transcript.userId !== userId) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Get blob
    const [blob] = await db
      .select()
      .from(videoBlobs)
      .where(eq(videoBlobs.transcriptId, transcriptId))

    if (!blob) {
      return res.status(404).json({ error: 'Video not found' })
    }

    // Send blob
    res.set('Content-Type', blob.blobType)
    res.set('Content-Length', blob.blobSize.toString())
    res.send(blob.blobData)
  } catch (error) {
    console.error('Get video error:', error)
    res.status(500).json({ error: 'Failed to fetch video' })
  }
})

// Delete transcript
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user!.userId
    const transcriptId = req.params.id

    // Verify ownership
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.id, transcriptId))

    if (!transcript || transcript.userId !== userId) {
      return res.status(404).json({ error: 'Transcript not found' })
    }

    // Delete (cascade will handle related records)
    await db.delete(transcripts).where(eq(transcripts.id, transcriptId))

    res.json({ success: true })
  } catch (error) {
    console.error('Delete transcript error:', error)
    res.status(500).json({ error: 'Failed to delete transcript' })
  }
})

export default router
```

### 6. Auth Middleware

**File: `server/middleware/auth.ts`**

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
      }
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email: string
    }

    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

---

## Frontend Integration

### API Client

**File: `src/services/apiClient.ts`**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('auth_token', token)
  }

  clearToken() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  // Auth
  async register(email: string, password: string, name: string) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    this.setToken(result.token)
    return result.user
  }

  async login(email: string, password: string) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    this.setToken(result.token)
    return result.user
  }

  // Transcripts
  async saveTranscript(data: {
    title?: string
    description?: string
    fileName: string
    fileSize: number
    duration: number
    videoFormat: string
    model: string
    speakers: Array<{ id: number; name: string; color: string }>
    entries: Array<{
      speakerNumber: number
      startTime: number
      endTime: number
      text: string
      confidence: number
    }>
    videoBlob?: { data: string; type: string } // base64
  }) {
    return this.request('/transcripts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTranscripts() {
    return this.request('/transcripts')
  }

  async getTranscript(id: string) {
    return this.request(`/transcripts/${id}`)
  }

  async deleteTranscript(id: string) {
    return this.request(`/transcripts/${id}`, {
      method: 'DELETE',
    })
  }

  async getVideoBlob(id: string): Promise<Blob> {
    const response = await fetch(`${API_URL}/transcripts/${id}/video`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch video')
    }

    return response.blob()
  }
}

export const apiClient = new ApiClient()
```

---

## Deployment Architecture

### Development

```
Frontend: http://localhost:5173 (Vite dev server)
Backend: http://localhost:3000 (Express server)
Database: PostgreSQL (local or Docker)
```

### Production

**Option 1: Vercel (Frontend) + Railway/Render (Backend + PostgreSQL)**

- Frontend: Deploy to Vercel (static site)
- Backend: Deploy to Railway or Render (Node.js + PostgreSQL)
- Database: Managed PostgreSQL (Railway/Render includes it)

**Option 2: Single VPS (DigitalOcean, AWS EC2)**

- Nginx → Serves React build + proxies API requests
- Node.js + Express → Backend API
- PostgreSQL → Database

**Option 3: Docker Compose (Any cloud provider)**

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: transcript_parser
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  backend:
    build: ./server
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/transcript_parser
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    ports:
      - '3000:3000'
    depends_on:
      - postgres

  frontend:
    build: .
    ports:
      - '80:80'
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Storage Considerations

### PostgreSQL Blob Storage Limits

**BYTEA column limitations:**

- Max size: 1GB per row (hard limit)
- Recommended: < 100MB per blob

**For larger files:**

1. **Use PostgreSQL Large Objects** (lo type)
2. **Split into chunks** (multiple rows)
3. **Use external storage** (S3, Cloudflare R2) with URL in database

### Recommendation for Video Storage

**Small files (< 50MB):** Store in PostgreSQL BYTEA
**Large files (> 50MB):** Store in S3/R2, save URL in database

**Modified schema for external storage:**

```typescript
export const videoBlobs = pgTable('video_blobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' })
    .unique(),

  // Option 1: PostgreSQL storage
  blobData: sql`BYTEA`,
  blobSize: bigint('blob_size', { mode: 'number' }),

  // Option 2: External storage
  storageUrl: varchar('storage_url', { length: 500 }),
  storageProvider: varchar('storage_provider', { length: 50 }), // 's3', 'r2', etc.

  blobType: varchar('blob_type', { length: 100 }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})
```

---

## Next Steps

1. **Set up PostgreSQL database** (local or cloud)
2. **Implement backend API** (Express + Drizzle)
3. **Create database migrations**
4. **Build authentication UI** (login/register)
5. **Add "Save Transcript" button** to frontend
6. **Create transcript archive UI** (list, view, delete)
7. **Add full-text search** for transcripts
8. **Deploy to production**

---

## Summary

**Architecture Benefits:**

✅ **Browser-based processing** - Video transcription happens client-side (free!)
✅ **PostgreSQL archiving** - Reliable, searchable storage for all transcripts
✅ **User accounts** - Each user has private transcript library
✅ **Scalable** - Frontend (Vercel) + Backend (Railway) can scale independently
✅ **Cost-effective** - Only pay for database storage and backend hosting

**Recommended Stack:**

- **Frontend:** React + Vite → Deploy to Vercel (free)
- **Backend:** Node.js + Express + Drizzle → Deploy to Railway ($5-10/month)
- **Database:** PostgreSQL on Railway (included)

**Total monthly cost:** ~$5-10 for thousands of users
