# Sprint 7: Backend Integration & Real API Implementation

**Sprint Focus**: Replace mock services with real backend API, implement actual transcription pipeline, and prepare for production deployment.

**Prerequisites**: Sprint 6 completed (Premium UX enhancements with glassmorphism design)

---

## 🎯 Sprint Objectives

Transform the application from a frontend-only prototype with mocks into a full-stack application with:
1. Real Node.js/Express backend API
2. Database integration (PostgreSQL or SQLite)
3. Actual Gemini API transcription
4. Real FFmpeg audio extraction
5. User authentication with JWT tokens
6. File storage and management

---

## 📋 Tasks Breakdown

### Phase 1: Backend Foundation (Priority: HIGH)

#### Task 1.1: Project Structure Setup
```bash
# Create backend directory structure
mkdir -p server/src/{routes,controllers,middleware,services,models,config,utils}
mkdir -p server/tests
```

**Files to Create**:
- `server/package.json` - Backend dependencies
- `server/tsconfig.json` - TypeScript configuration
- `server/src/index.ts` - Express server entry point
- `server/src/config/database.ts` - Database configuration
- `server/src/config/env.ts` - Environment variables
- `server/.env.example` - Environment template

**Dependencies to Install**:
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "pg": "^8.11.3",
    "drizzle-orm": "^0.29.0",
    "@google/generative-ai": "^0.1.3",
    "multer": "^1.4.5-lts.1",
    "fluent-ffmpeg": "^2.1.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/bcrypt": "^5.0.2",
    "@types/multer": "^1.4.11",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.2"
  }
}
```

#### Task 1.2: Database Schema Implementation

**Update**: `server/src/models/schema.ts`
```typescript
import { pgTable, serial, varchar, text, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const transcripts = pgTable('transcripts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  videoFileName: varchar('video_file_name', { length: 255 }),
  videoUrl: text('video_url'),
  audioUrl: text('audio_url'),
  duration: decimal('duration', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 50 }).default('pending'), // pending, processing, complete, failed
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const transcriptEntries = pgTable('transcript_entries', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id').references(() => transcripts.id),
  speakerNumber: integer('speaker_number').notNull(),
  speaker: varchar('speaker', { length: 100 }),
  text: text('text').notNull(),
  startTime: decimal('start_time', { precision: 10, scale: 2 }).notNull(),
  endTime: decimal('end_time', { precision: 10, scale: 2 }).notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 4 }),
  createdAt: timestamp('created_at').defaultNow()
})

export const speakers = pgTable('speakers', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id').references(() => transcripts.id),
  speakerNumber: integer('speaker_number').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

export const usageTracking = pgTable('usage_tracking', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  model: varchar('model', { length: 100 }).notNull(),
  operation: varchar('operation', { length: 255 }).notNull(),
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  estimatedCost: decimal('estimated_cost', { precision: 10, scale: 6 }).notNull(),
  metadata: text('metadata'), // JSON string
  createdAt: timestamp('created_at').defaultNow()
})
```

**Migration**: Create `server/drizzle/0001_init.sql` with schema

#### Task 1.3: Authentication System

**Create**: `server/src/middleware/auth.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: { id: number; email: string }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user as { id: number; email: string }
    next()
  })
}
```

**Create**: `server/src/controllers/authController.ts`
```typescript
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../config/database'
import { users } from '../models/schema'

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user
  const [user] = await db.insert(users).values({
    email,
    password: hashedPassword,
    name
  }).returning()

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token
  })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  // Find user
  const [user] = await db.select().from(users).where(eq(users.email, email))

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Verify password
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
    token
  })
}
```

### Phase 2: Transcription Pipeline (Priority: HIGH)

#### Task 2.1: Audio Extraction Service

**Update**: `server/src/services/audioExtractor.ts`
```typescript
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs/promises'

export async function extractAudio(videoPath: string, outputDir: string): Promise<string> {
  const audioPath = path.join(outputDir, `${path.basename(videoPath, path.extname(videoPath))}.mp3`)

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .audioChannels(1)
      .audioFrequency(16000)
      .on('end', () => resolve(audioPath))
      .on('error', reject)
      .run()
  })
}

export async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(err)
      resolve(metadata.format.duration || 0)
    })
  })
}
```

#### Task 2.2: Gemini Transcription Service

**Update**: `server/src/services/geminiTranscription.ts`
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function transcribeAudio(audioPath: string): Promise<{
  entries: Array<{
    speaker: string
    speakerNumber: number
    text: string
    startTime: number
    endTime: number
    confidence: number
  }>
  speakers: Array<{
    id: number
    name: string
    color: string
  }>
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const audioData = await fs.readFile(audioPath)
  const audioBase64 = audioData.toString('base64')

  const prompt = `Transcribe this audio file with speaker diarization.
  Return a JSON object with:
  1. An array of transcript entries with speaker, speakerNumber, text, startTime, endTime, confidence
  2. An array of identified speakers with id, name, and color

  Format times in seconds with 2 decimal places.
  Assign colors: blue, emerald, purple, etc.
  Use confidence scores 0.0-1.0.`

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        mimeType: 'audio/mp3',
        data: audioBase64
      }
    }
  ])

  const response = await result.response
  const text = response.text()

  // Parse JSON response
  const transcriptData = JSON.parse(text)

  return transcriptData
}
```

#### Task 2.3: Transcription Controller

**Create**: `server/src/controllers/transcriptionController.ts`
```typescript
import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { db } from '../config/database'
import { transcripts, transcriptEntries, speakers, usageTracking } from '../models/schema'
import { extractAudio, getVideoDuration } from '../services/audioExtractor'
import { transcribeAudio } from '../services/geminiTranscription'
import path from 'path'

export async function uploadAndTranscribe(req: AuthRequest, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' })
  }

  const userId = req.user!.id
  const videoPath = req.file.path
  const title = req.body.title || req.file.originalname

  try {
    // Get video duration
    const duration = await getVideoDuration(videoPath)

    // Create transcript record
    const [transcript] = await db.insert(transcripts).values({
      userId,
      title,
      videoFileName: req.file.originalname,
      videoUrl: `/uploads/videos/${req.file.filename}`,
      duration: duration.toString(),
      status: 'processing'
    }).returning()

    // Extract audio
    const audioDir = path.join(__dirname, '../../uploads/audio')
    const audioPath = await extractAudio(videoPath, audioDir)

    // Update with audio URL
    await db.update(transcripts)
      .set({ audioUrl: `/uploads/audio/${path.basename(audioPath)}` })
      .where(eq(transcripts.id, transcript.id))

    // Transcribe with Gemini
    const transcriptionResult = await transcribeAudio(audioPath)

    // Save speakers
    for (const speaker of transcriptionResult.speakers) {
      await db.insert(speakers).values({
        transcriptId: transcript.id,
        speakerNumber: speaker.id,
        name: speaker.name,
        color: speaker.color
      })
    }

    // Save transcript entries
    for (const entry of transcriptionResult.entries) {
      await db.insert(transcriptEntries).values({
        transcriptId: transcript.id,
        speakerNumber: entry.speakerNumber,
        speaker: entry.speaker,
        text: entry.text,
        startTime: entry.startTime.toString(),
        endTime: entry.endTime.toString(),
        confidence: entry.confidence.toString()
      })
    }

    // Track usage
    await db.insert(usageTracking).values({
      userId,
      model: 'gemini-2.0-flash-exp',
      operation: 'Transcribe Video',
      inputTokens: 0, // Calculate from API response
      outputTokens: 0, // Calculate from API response
      estimatedCost: '0',
      metadata: JSON.stringify({ duration, fileSize: req.file.size })
    })

    // Update status
    await db.update(transcripts)
      .set({ status: 'complete' })
      .where(eq(transcripts.id, transcript.id))

    res.json({
      transcriptId: transcript.id,
      status: 'complete'
    })

  } catch (error) {
    console.error('Transcription error:', error)

    // Update status to failed
    await db.update(transcripts)
      .set({ status: 'failed' })
      .where(eq(transcripts.id, transcript.id))

    res.status(500).json({ error: 'Transcription failed' })
  }
}

export async function getTranscript(req: AuthRequest, res: Response) {
  const transcriptId = parseInt(req.params.id)
  const userId = req.user!.id

  // Get transcript with entries and speakers
  const transcript = await db.query.transcripts.findFirst({
    where: and(
      eq(transcripts.id, transcriptId),
      eq(transcripts.userId, userId)
    ),
    with: {
      entries: true,
      speakers: true
    }
  })

  if (!transcript) {
    return res.status(404).json({ error: 'Transcript not found' })
  }

  res.json(transcript)
}
```

### Phase 3: API Routes (Priority: HIGH)

#### Task 3.1: Setup Routes

**Create**: `server/src/routes/auth.ts`
```typescript
import { Router } from 'express'
import * as authController from '../controllers/authController'

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/me', authenticateToken, authController.getMe)

export default router
```

**Create**: `server/src/routes/transcripts.ts`
```typescript
import { Router } from 'express'
import multer from 'multer'
import * as transcriptionController from '../controllers/transcriptionController'
import { authenticateToken } from '../middleware/auth'

const upload = multer({ dest: 'uploads/videos/' })
const router = Router()

router.use(authenticateToken)

router.post('/upload', upload.single('video'), transcriptionController.uploadAndTranscribe)
router.get('/:id', transcriptionController.getTranscript)
router.get('/', transcriptionController.listTranscripts)
router.delete('/:id', transcriptionController.deleteTranscript)
router.patch('/:id/entry/:entryId', transcriptionController.updateEntry)

export default router
```

**Update**: `server/src/index.ts`
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import transcriptRoutes from './routes/transcripts'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Phase 4: Frontend Integration (Priority: MEDIUM)

#### Task 4.1: Update API Client

**Update**: `src/services/apiClient.ts`
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  }

  async register(email: string, password: string, name: string) {
    const { user, token } = await this.request<{ user: any; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      }
    )

    this.token = token
    localStorage.setItem('auth_token', token)
    return user
  }

  async login(email: string, password: string) {
    const { user, token } = await this.request<{ user: any; token: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }
    )

    this.token = token
    localStorage.setItem('auth_token', token)
    return user
  }

  async uploadVideo(file: File, title: string) {
    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title)

    return this.request('/transcripts/upload', {
      method: 'POST',
      body: formData
    })
  }

  async getTranscript(id: number) {
    return this.request(`/transcripts/${id}`)
  }

  async listTranscripts() {
    return this.request('/transcripts')
  }

  // ... rest of methods
}

export const apiClient = new ApiClient()
```

#### Task 4.2: Update Upload Component

**Update**: `src/hooks/useTranscription.ts` to use real API instead of mocks

### Phase 5: Environment & Deployment (Priority: LOW)

#### Task 5.1: Environment Configuration

**Create**: `server/.env.example`
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/transcript_parser

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600

# CORS
CORS_ORIGIN=http://localhost:5173
```

#### Task 5.2: Docker Configuration

**Create**: `server/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install FFmpeg
RUN apk add --no-cache ffmpeg

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**Create**: `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: transcript_parser
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/transcript_parser
      JWT_SECRET: ${JWT_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    depends_on:
      - postgres
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: .
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://localhost:3000/api

volumes:
  postgres_data:
```

---

## ✅ Acceptance Criteria

### Backend
- [ ] Express server running on port 3000
- [ ] PostgreSQL database connected
- [ ] JWT authentication working
- [ ] File upload endpoint accepting videos
- [ ] FFmpeg audio extraction working
- [ ] Gemini API transcription working
- [ ] Database storing transcripts correctly
- [ ] Usage tracking persisting to DB

### Frontend
- [ ] Real API integration replacing mocks
- [ ] Video upload with progress tracking
- [ ] Real-time transcription status updates
- [ ] Transcript loading from database
- [ ] Authentication flow with JWT tokens
- [ ] Error handling for API failures

### DevOps
- [ ] Docker containers running
- [ ] Database migrations working
- [ ] Environment variables configured
- [ ] CORS configured correctly

---

## 🧪 Testing Requirements

1. **Unit Tests**
   - Auth service tests
   - Transcription service tests
   - Database query tests

2. **Integration Tests**
   - API endpoint tests
   - File upload flow
   - Transcription pipeline

3. **E2E Tests**
   - Complete user flow from upload to transcript view
   - Authentication flow
   - Error handling

---

## 📚 Documentation Requirements

1. **API Documentation**
   - OpenAPI/Swagger spec
   - Endpoint documentation
   - Authentication guide

2. **Setup Guide**
   - Local development setup
   - Environment configuration
   - Docker setup

3. **Architecture Documentation**
   - System architecture diagram
   - Database schema documentation
   - API flow diagrams

---

## 🚨 Important Notes

### Security
- Never commit `.env` files
- Use strong JWT secrets in production
- Implement rate limiting
- Validate file uploads (type, size)
- Sanitize user inputs

### Performance
- Implement file upload progress
- Add queue system for long transcriptions
- Consider WebSocket for real-time updates
- Optimize database queries

### Error Handling
- Proper error messages
- Logging system (Winston/Pino)
- Monitoring and alerts

---

## 📋 Checklist Before Starting Sprint 7

- [ ] Read this entire document
- [ ] Understand the backend architecture
- [ ] Have Gemini API key ready
- [ ] PostgreSQL installed or Docker ready
- [ ] FFmpeg installed on system
- [ ] Understand JWT authentication
- [ ] Familiar with Drizzle ORM

---

## 🎯 Success Metrics

- Backend API fully functional
- Real transcription working end-to-end
- All mocks replaced with real implementations
- Database persisting data correctly
- User can upload video and get transcript
- Authentication flow working
- Ready for production deployment

---

**Estimated Sprint Duration**: 3-5 days
**Complexity**: High
**Priority**: Critical for production readiness

Good luck with Sprint 7! 🚀
