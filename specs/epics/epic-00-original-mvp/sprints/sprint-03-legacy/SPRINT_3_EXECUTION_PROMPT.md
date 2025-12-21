# Sprint 3 Execution Prompt: Backend Infrastructure & FFmpeg Codec Support

**Sprint**: 3 (Weeks 5-6)
**Goal**: Implement Docker PostgreSQL backend, Express API, user authentication, transcript archiving, and FFmpeg.wasm universal codec support
**Estimated Effort**: ~38 hours (2 weeks)

---

## 🎯 Executive Summary

You are implementing Sprint 3 of a 20-week MVP project. Sprint 1 & 2 are **complete** and working:

✅ **Sprint 1 Complete**: Video/audio upload with validation and preview
✅ **Sprint 2 Complete**: Gemini AI transcription with speaker diarization

**Your mission**: Build the backend infrastructure to archive transcripts in PostgreSQL and add universal codec support via FFmpeg.wasm.

---

## 📊 Current State Assessment

### What's Already Working

**Frontend (React + TypeScript + Vite)**:

- `src/components/UploadVideo.tsx` - File upload with drag-and-drop
- `src/components/VideoPreview.tsx` - Video/audio preview (supports both `<video>` and `<audio>` elements)
- `src/services/audioExtractor.ts` - Browser MediaRecorder audio extraction (works for 70% of videos)
- `src/services/geminiClient.ts` - Gemini AI transcription with speaker diarization
- `src/hooks/useTranscription.ts` - Transcription workflow orchestration
- `src/components/TranscriptView.tsx` - Transcript display with speaker color coding

**Testing Infrastructure**:

- Jest 30.2.0 for unit/integration tests
- Playwright for E2E tests
- Test files: `audioExtractor.test.ts`, `geminiClient.test.ts`, `useTranscription.test.ts`

### What's Missing (Your Work)

**No backend code exists yet**:

- ❌ No `server/` directory
- ❌ No PostgreSQL database
- ❌ No Express API
- ❌ No user authentication
- ❌ No transcript archiving
- ❌ No FFmpeg.wasm integration

---

## 🛠️ Technology Stack

### Backend (NEW - You'll Install)

```json
{
  "dependencies": {
    "express": "^4.21.2",
    "pg": "^8.13.1",
    "drizzle-orm": "^0.45.1",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.7",
    "drizzle-kit": "^0.31.8",
    "tsx": "^4.19.2",
    "nodemon": "^3.1.9"
  }
}
```

### FFmpeg.wasm (NEW - You'll Install)

```json
{
  "dependencies": {
    "@ffmpeg/ffmpeg": "^0.12.6",
    "@ffmpeg/util": "^0.12.1"
  }
}
```

### Docker

```yaml
# docker-compose.yml (you'll create this)
services:
  postgres:
    image: postgres:16-alpine
    container_name: transcript-parser-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: transcript_parser
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 📋 Sprint 3 Tasks (Execute in Order)

### Task 3.1: Docker Desktop PostgreSQL Setup (4 hours)

**Objective**: Install Docker Desktop and run PostgreSQL container locally

**Steps**:

1. **Install Docker Desktop**:
   - Download from https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Verify: `docker --version` (should show Docker version)

2. **Create docker-compose.yml**:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: transcript-parser-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: transcript_parser
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

3. **Start PostgreSQL**:

```bash
docker-compose up -d
docker ps  # Should show transcript-parser-db running
```

4. **Verify Connection** (optional):

```bash
# Install PostgreSQL client if needed
psql -h localhost -U postgres -d transcript_parser
# Password: postgres
```

**Acceptance Criteria**:

- ✅ Docker Desktop installed and running
- ✅ PostgreSQL container running on port 5432
- ✅ Database `transcript_parser` created
- ✅ Can connect via `psql` or pgAdmin

---

### Task 3.2: Backend Project Setup (2 hours)

**Objective**: Create backend directory structure and install dependencies

**Steps**:

1. **Install Backend Dependencies**:

```bash
npm install express pg drizzle-orm jsonwebtoken bcrypt cors dotenv
npm install -D @types/express @types/bcrypt @types/jsonwebtoken drizzle-kit tsx nodemon
```

2. **Create Backend Directory Structure**:

```bash
mkdir -p server/{config,db,routes,controllers,middleware,types}
touch server/index.ts
touch server/config/database.ts
touch server/db/schema.ts
touch server/routes/{auth.ts,transcripts.ts,search.ts}
touch server/controllers/{authController.ts,transcriptController.ts}
touch server/middleware/{authMiddleware.ts,errorHandler.ts}
touch server/types/express.d.ts
```

3. **Create Environment File**:

```bash
# .env.local
DATABASE_URL=postgres://postgres:postgres@localhost:5432/transcript_parser
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3000
NODE_ENV=development
```

4. **Update package.json Scripts**:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:server": "nodemon --watch server --exec tsx server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\"",
    "build": "tsc && vite build",
    "build:server": "tsc --project tsconfig.server.json",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

5. **Create tsconfig.server.json**:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "skipLibCheck": true,
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist/server",
    "rootDir": "./server"
  },
  "include": ["server/**/*"],
  "exclude": ["node_modules"]
}
```

**Acceptance Criteria**:

- ✅ All backend dependencies installed
- ✅ `server/` directory structure created
- ✅ `.env.local` file with database credentials
- ✅ npm scripts for backend development added

---

### Task 3.3: Database Schema Implementation (4 hours)

**Objective**: Define database schema using Drizzle ORM

**Steps**:

1. **Create Database Schema** (`server/db/schema.ts`):

```typescript
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  bigint,
  decimal,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Transcripts table
export const transcripts = pgTable('transcripts', {
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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Speakers table
export const speakers = pgTable('speakers', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speakerNumber: varchar('speaker_number', { length: 50 }).notNull(),
  speakerName: varchar('speaker_name', { length: 255 }),
  color: varchar('color', { length: 20 }),
})

// Transcript entries table
export const transcriptEntries = pgTable('transcript_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speakerId: uuid('speaker_id').references(() => speakers.id, {
    onDelete: 'set null',
  }),
  startTime: decimal('start_time', { precision: 10, scale: 2 }).notNull(),
  endTime: decimal('end_time', { precision: 10, scale: 2 }).notNull(),
  text: text('text').notNull(),
  confidence: decimal('confidence', { precision: 5, scale: 2 }),
  entryOrder: bigint('entry_order', { mode: 'number' }).notNull(),
})

// Video blobs table (optional - for storing video files)
export const videoBlobs = pgTable('video_blobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  blobData: text('blob_data').notNull(), // Base64 or bytea
  blobType: varchar('blob_type', { length: 100 }).notNull(),
  blobSize: bigint('blob_size', { mode: 'number' }).notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  transcripts: many(transcripts),
}))

export const transcriptsRelations = relations(transcripts, ({ one, many }) => ({
  user: one(users, {
    fields: [transcripts.userId],
    references: [users.id],
  }),
  speakers: many(speakers),
  entries: many(transcriptEntries),
  videoBlob: one(videoBlobs),
}))

export const speakersRelations = relations(speakers, ({ one, many }) => ({
  transcript: one(transcripts, {
    fields: [speakers.transcriptId],
    references: [transcripts.id],
  }),
  entries: many(transcriptEntries),
}))

export const transcriptEntriesRelations = relations(
  transcriptEntries,
  ({ one }) => ({
    transcript: one(transcripts, {
      fields: [transcriptEntries.transcriptId],
      references: [transcripts.id],
    }),
    speaker: one(speakers, {
      fields: [transcriptEntries.speakerId],
      references: [speakers.id],
    }),
  })
)
```

2. **Create Drizzle Config** (`drizzle.config.ts`):

```typescript
import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
```

3. **Create Database Connection** (`server/config/database.ts`):

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack)
  } else {
    console.log('✅ Database connected successfully')
    release()
  }
})
```

4. **Generate and Run Migrations**:

```bash
npm run db:generate
npm run db:migrate
```

**Acceptance Criteria**:

- ✅ Database schema defined with Drizzle ORM
- ✅ 5 tables created: users, transcripts, speakers, transcript_entries, video_blobs
- ✅ Migrations generated and applied
- ✅ Database connection successful

---

### Task 3.4: Express Server Implementation (3 hours)

**Objective**: Create Express server with CORS, error handling, and health check

**Steps**:

1. **Create Express Server** (`server/index.ts`):

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import transcriptRoutes from './routes/transcripts'
import searchRoutes from './routes/search'
import { errorHandler } from './middleware/errorHandler'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Vite dev server
    credentials: true,
  })
)
app.use(express.json({ limit: '50mb' })) // For base64 video uploads
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)
app.use('/api/search', searchRoutes)

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})
```

2. **Create Error Handler** (`server/middleware/errorHandler.ts`):

```typescript
import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    })
  }

  console.error('❌ Unhandled error:', err)

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
}
```

3. **Test Server**:

```bash
npm run dev:server
# Visit http://localhost:3000/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

**Acceptance Criteria**:

- ✅ Express server running on port 3000
- ✅ CORS configured for Vite dev server
- ✅ Health check endpoint working
- ✅ Error handling middleware in place

---

### Task 3.5: Authentication Implementation (4 hours)

**Objective**: Implement JWT authentication with bcrypt password hashing

**Steps**:

1. **Create Auth Controller** (`server/controllers/authController.ts`):

```typescript
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../config/database'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
const SALT_ROUNDS = 10

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password) {
      throw new AppError(400, 'Email and password required')
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (existingUser) {
      throw new AppError(409, 'User already exists')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        name: name || null,
      })
      .returning()

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      throw new AppError(400, 'Email and password required')
    }

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (!user) {
      throw new AppError(401, 'Invalid credentials')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      throw new AppError(401, 'Invalid credentials')
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    })

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      throw new AppError(401, 'Not authenticated')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}
```

2. **Create Auth Middleware** (`server/middleware/authMiddleware.ts`):

```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'

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

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No token provided')
    }

    const token = authHeader.substring(7)

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(401, 'Invalid token'))
    } else {
      next(error)
    }
  }
}
```

3. **Create Auth Routes** (`server/routes/auth.ts`):

```typescript
import { Router } from 'express'
import { register, login, getMe } from '../controllers/authController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticate, getMe)

export default router
```

4. **Create Type Definitions** (`server/types/express.d.ts`):

```typescript
declare namespace Express {
  export interface Request {
    user?: {
      userId: string
      email: string
    }
  }
}
```

**Acceptance Criteria**:

- ✅ `/api/auth/register` endpoint working
- ✅ `/api/auth/login` endpoint working
- ✅ `/api/auth/me` endpoint working (with JWT)
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens generated with 7-day expiry
- ✅ Auth middleware protects routes

---

### Task 3.6: Transcript CRUD API (5 hours)

**Objective**: Create API endpoints for saving/loading transcripts

**Steps**:

1. **Create Transcript Controller** (`server/controllers/transcriptController.ts`):

```typescript
import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { transcripts, speakers, transcriptEntries } from '../db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { AppError } from '../middleware/errorHandler'

export const createTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const {
      title,
      description,
      fileName,
      fileSize,
      duration,
      videoFormat,
      model,
      speakersData,
      entries,
    } = req.body

    // Validate input
    if (!fileName || !speakersData || !entries) {
      throw new AppError(400, 'Missing required fields')
    }

    // Insert transcript
    const [transcript] = await db
      .insert(transcripts)
      .values({
        userId,
        title: title || fileName,
        description,
        fileName,
        fileSize: parseInt(fileSize),
        duration: duration?.toString(),
        videoFormat,
        model,
      })
      .returning()

    // Insert speakers
    const speakerRecords = await Promise.all(
      speakersData.map((speaker: any) =>
        db
          .insert(speakers)
          .values({
            transcriptId: transcript.id,
            speakerNumber: speaker.speaker,
            speakerName: speaker.name || speaker.speaker,
            color: speaker.color,
          })
          .returning()
      )
    )

    // Create speaker map for entries
    const speakerMap = new Map()
    speakerRecords.forEach(([speaker], index) => {
      speakerMap.set(speakersData[index].speaker, speaker.id)
    })

    // Insert entries
    await Promise.all(
      entries.map((entry: any, index: number) =>
        db.insert(transcriptEntries).values({
          transcriptId: transcript.id,
          speakerId: speakerMap.get(entry.speaker) || null,
          startTime: entry.start.toString(),
          endTime: entry.end.toString(),
          text: entry.text,
          confidence: entry.confidence?.toString(),
          entryOrder: index,
        })
      )
    )

    res.status(201).json({
      status: 'success',
      data: { transcriptId: transcript.id },
    })
  } catch (error) {
    next(error)
  }
}

export const getTranscripts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const userTranscripts = await db.query.transcripts.findMany({
      where: eq(transcripts.userId, userId),
      orderBy: [desc(transcripts.createdAt)],
      with: {
        speakers: true,
      },
    })

    res.json({
      status: 'success',
      data: { transcripts: userTranscripts },
    })
  } catch (error) {
    next(error)
  }
}

export const getTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const { id } = req.params

    const transcript = await db.query.transcripts.findFirst({
      where: and(eq(transcripts.id, id), eq(transcripts.userId, userId)),
      with: {
        speakers: true,
        entries: {
          orderBy: (entries, { asc }) => [asc(entries.entryOrder)],
        },
      },
    })

    if (!transcript) {
      throw new AppError(404, 'Transcript not found')
    }

    res.json({
      status: 'success',
      data: { transcript },
    })
  } catch (error) {
    next(error)
  }
}

export const deleteTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    if (!userId) throw new AppError(401, 'Not authenticated')

    const { id } = req.params

    const transcript = await db.query.transcripts.findFirst({
      where: and(eq(transcripts.id, id), eq(transcripts.userId, userId)),
    })

    if (!transcript) {
      throw new AppError(404, 'Transcript not found')
    }

    await db.delete(transcripts).where(eq(transcripts.id, id))

    res.json({
      status: 'success',
      message: 'Transcript deleted',
    })
  } catch (error) {
    next(error)
  }
}
```

2. **Create Transcript Routes** (`server/routes/transcripts.ts`):

```typescript
import { Router } from 'express'
import {
  createTranscript,
  getTranscripts,
  getTranscript,
  deleteTranscript,
} from '../controllers/transcriptController'
import { authenticate } from '../middleware/authMiddleware'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.post('/', createTranscript)
router.get('/', getTranscripts)
router.get('/:id', getTranscript)
router.delete('/:id', deleteTranscript)

export default router
```

3. **Create Search Routes** (`server/routes/search.ts`):

```typescript
import { Router } from 'express'
import { Request, Response, NextFunction } from 'express'
import { db } from '../config/database'
import { transcripts, transcriptEntries } from '../db/schema'
import { eq, and, ilike } from 'drizzle-orm'
import { authenticate } from '../middleware/authMiddleware'
import { AppError } from '../middleware/errorHandler'

const router = Router()

router.get(
  '/',
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId
      if (!userId) throw new AppError(401, 'Not authenticated')

      const { q } = req.query

      if (!q || typeof q !== 'string') {
        throw new AppError(400, 'Search query required')
      }

      const results = await db.query.transcripts.findMany({
        where: and(
          eq(transcripts.userId, userId),
          ilike(transcripts.title, `%${q}%`)
        ),
        with: {
          speakers: true,
        },
      })

      res.json({
        status: 'success',
        data: { results },
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
```

**Acceptance Criteria**:

- ✅ `POST /api/transcripts` - Create transcript
- ✅ `GET /api/transcripts` - List user's transcripts
- ✅ `GET /api/transcripts/:id` - Get single transcript
- ✅ `DELETE /api/transcripts/:id` - Delete transcript
- ✅ `GET /api/search?q=query` - Search transcripts
- ✅ All routes protected by authentication

---

### Task 3.7: Frontend API Integration (4 hours)

**Objective**: Create frontend API client and integrate with backend

**Steps**:

1. **Create API Client** (`src/services/apiClient.ts`):

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export class ApiClient {
  private token: string | null = null

  constructor() {
    this.token = localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data.data
  }

  // Auth methods
  async register(email: string, password: string, name?: string) {
    const { user, token } = await this.request<{ user: any; token: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
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
        body: JSON.stringify({ email, password }),
      }
    )

    this.token = token
    localStorage.setItem('auth_token', token)
    return user
  }

  async logout() {
    this.token = null
    localStorage.removeItem('auth_token')
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me')
  }

  // Transcript methods
  async saveTranscript(transcriptData: any) {
    return this.request<{ transcriptId: string }>('/transcripts', {
      method: 'POST',
      body: JSON.stringify(transcriptData),
    })
  }

  async getTranscripts() {
    return this.request<{ transcripts: any[] }>('/transcripts')
  }

  async getTranscript(id: string) {
    return this.request<{ transcript: any }>(`/transcripts/${id}`)
  }

  async deleteTranscript(id: string) {
    return this.request<{ message: string }>(`/transcripts/${id}`, {
      method: 'DELETE',
    })
  }

  async searchTranscripts(query: string) {
    return this.request<{ results: any[] }>(
      `/search?q=${encodeURIComponent(query)}`
    )
  }

  isAuthenticated(): boolean {
    return this.token !== null
  }
}

export const apiClient = new ApiClient()
```

2. **Create Environment Variables** (`.env`):

```bash
VITE_API_URL=http://localhost:3000/api
```

3. **Update useTranscription Hook** to auto-save:

```typescript
// In src/hooks/useTranscription.ts
import { apiClient } from '@/services/apiClient'

const startTranscription = useCallback(
  async (file: File, metadata: VideoMetadata) => {
    try {
      // ... existing transcription logic ...

      // Auto-save after completion
      if (apiClient.isAuthenticated() && transcriptData) {
        try {
          const { transcriptId } = await apiClient.saveTranscript({
            title: transcriptData.metadata.fileName,
            fileName: transcriptData.metadata.fileName,
            fileSize: transcriptData.metadata.fileSize,
            duration: transcriptData.metadata.duration,
            videoFormat: transcriptData.metadata.videoFormat,
            model: transcriptData.metadata.model,
            speakersData: transcriptData.speakers,
            entries: transcriptData.entries,
          })
          console.log('✅ Transcript saved:', transcriptId)
        } catch (saveError) {
          console.warn('⚠️ Failed to save transcript:', saveError)
          // Don't throw - transcription still succeeded locally
        }
      }

      setTranscript(transcriptData)
      setProcessingState('complete')
    } catch (err) {
      // ... error handling ...
    }
  },
  []
)
```

**Acceptance Criteria**:

- ✅ API client created with auth support
- ✅ JWT token stored in localStorage
- ✅ Auto-save transcripts after completion
- ✅ All CRUD operations working from frontend
- ✅ Error handling for API failures

---

### Task 3.8: FFmpeg.wasm Codec Support (6 hours)

**Objective**: Add universal codec support via FFmpeg.wasm

**IMPORTANT**: See [TASK_3.8_FFMPEG_CODEC_SUPPORT.md](./TASK_3.8_FFMPEG_CODEC_SUPPORT.md) for complete implementation guide.

**Steps**:

1. **Install FFmpeg.wasm**:

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

2. **Create FFmpegExtractor Service** (`src/services/ffmpegExtractor.ts`):

```typescript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

export interface FFmpegExtractionOptions {
  onProgress?: (progress: number) => void
  onLog?: (message: string) => void
}

export class FFmpegExtractor {
  private static instance: FFmpegExtractor | null = null
  private ffmpeg: FFmpeg | null = null
  private loaded = false
  private loading = false

  static getInstance(): FFmpegExtractor {
    if (!FFmpegExtractor.instance) {
      FFmpegExtractor.instance = new FFmpegExtractor()
    }
    return FFmpegExtractor.instance
  }

  async load(options?: FFmpegExtractionOptions): Promise<void> {
    if (this.loaded) return

    if (this.loading) {
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.loading = true

    try {
      console.log('[FFmpeg] Initializing...')
      this.ffmpeg = new FFmpeg()

      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
        options?.onLog?.(message)
      })

      this.ffmpeg.on('progress', ({ progress }) => {
        console.log(`[FFmpeg] Progress: ${(progress * 100).toFixed(1)}%`)
        options?.onProgress?.(progress * 100)
      })

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

      console.log('[FFmpeg] Downloading core files from CDN...')
      await this.ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        ),
      })

      this.loaded = true
      console.log('[FFmpeg] Loaded successfully ✅')
    } catch (error) {
      console.error('[FFmpeg] Load failed:', error)
      throw new Error(
        `Failed to load FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      this.loading = false
    }
  }

  async extractAudio(
    videoFile: File,
    options?: FFmpegExtractionOptions
  ): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      throw new Error('FFmpeg not loaded. Call load() first.')
    }

    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      throw new Error(
        `File too large (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). ` +
          `Maximum: 500MB. Please use a smaller file or extract audio externally.`
      )
    }

    const inputName = `input_${Date.now()}.${this.getFileExtension(videoFile.name)}`
    const outputName = `output_${Date.now()}.m4a`

    try {
      console.log(`[FFmpeg] Writing input file: ${videoFile.name}`)
      await this.ffmpeg.writeFile(inputName, await fetchFile(videoFile))

      console.log('[FFmpeg] Extracting audio...')
      await this.ffmpeg.exec([
        '-i',
        inputName,
        '-vn', // No video
        '-acodec',
        'aac', // AAC codec (Gemini compatible)
        '-b:a',
        '64k', // Low bitrate
        '-ar',
        '22050', // Lower sample rate
        outputName,
      ])

      console.log('[FFmpeg] Reading output file...')
      const data = await this.ffmpeg.readFile(outputName)

      console.log('[FFmpeg] Cleaning up...')
      await this.ffmpeg.deleteFile(inputName)
      await this.ffmpeg.deleteFile(outputName)

      const blob = new Blob([data], { type: 'audio/mp4' })
      console.log(`[FFmpeg] Extraction complete ✅`)

      return blob
    } catch (error) {
      try {
        await this.ffmpeg.deleteFile(inputName).catch(() => {})
        await this.ffmpeg.deleteFile(outputName).catch(() => {})
      } catch {}

      throw new Error(
        `FFmpeg extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  isLoaded(): boolean {
    return this.loaded
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : 'mp4'
  }
}
```

3. **Update useTranscription Hook** with FFmpeg fallback:

```typescript
// In src/hooks/useTranscription.ts
import { FFmpegExtractor } from '@/services/ffmpegExtractor'

export type ProcessingState =
  | 'idle'
  | 'loading-ffmpeg' // NEW
  | 'extracting-audio'
  | 'transcribing'
  | 'complete'
  | 'error'

const startTranscription = useCallback(
  async (file: File, metadata: VideoMetadata) => {
    try {
      // ... existing code ...

      if (!isAudioFile(file)) {
        try {
          // Try browser MediaRecorder first
          setProcessingState('extracting-audio')
          const audioExtractor = new AudioExtractor()
          audioBlob = await audioExtractor.extractAudio(file, {
            onProgress: audioProgress => {
              setProgress((audioProgress / 100) * 30)
            },
          })
          console.log('[Transcription] Browser extraction successful ✅')
        } catch (browserError) {
          console.warn(
            '[Transcription] Browser extraction failed:',
            browserError
          )
          console.log('[Transcription] Falling back to FFmpeg.wasm...')

          // Fallback to FFmpeg.wasm
          const ffmpegExtractor = FFmpegExtractor.getInstance()

          if (!ffmpegExtractor.isLoaded()) {
            setProcessingState('loading-ffmpeg')
            setProgress(5)

            console.log('[Transcription] Loading FFmpeg.wasm...')
            await ffmpegExtractor.load({
              onProgress: loadProgress => {
                setProgress(5 + (loadProgress / 100) * 10)
              },
            })
            console.log('[Transcription] FFmpeg.wasm loaded ✅')
          }

          setProcessingState('extracting-audio')
          audioBlob = await ffmpegExtractor.extractAudio(file, {
            onProgress: extractProgress => {
              setProgress(15 + (extractProgress / 100) * 15)
            },
          })
          console.log('[Transcription] FFmpeg extraction successful ✅')
        }
      }

      // ... rest of transcription logic ...
    } catch (err) {
      // ... error handling ...
    }
  },
  []
)
```

4. **Update ProcessingStatus Component**:

```typescript
// In src/components/ProcessingStatus.tsx

const getStateMessage = () => {
  switch (processingState) {
    case 'loading-ffmpeg':
      return {
        title: 'Loading FFmpeg',
        description: 'Downloading universal audio extraction engine (31MB, one-time download)...',
        icon: <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />,
        color: 'orange',
      }
    // ... other cases ...
  }
}
```

**Acceptance Criteria**:

- ✅ FFmpeg.wasm installed
- ✅ FFmpegExtractor service created
- ✅ Browser-first strategy (MediaRecorder → FFmpeg fallback)
- ✅ Tested with AC-3 video (FFmpeg extraction)
- ✅ Tested with AAC video (browser extraction)
- ✅ Loading state displayed during FFmpeg download
- ✅ Progress tracking for download and extraction

---

### Task 3.9: UI Components for Archive (6 hours)

**Objective**: Create login, register, and transcript library UI

**Steps**:

1. **Create Login Component** (`src/components/Login.tsx`):

```typescript
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { apiClient } from '@/services/apiClient'

interface LoginProps {
  onSuccess: () => void
  onToggle: () => void
}

export function Login({ onSuccess, onToggle }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiClient.login(email, password)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <button onClick={onToggle} className="text-blue-600 hover:underline">
          Register
        </button>
      </p>
    </Card>
  )
}
```

2. **Create Register Component** (similar to Login)

3. **Create Transcript Library** (`src/components/TranscriptLibrary.tsx`):

```typescript
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/services/apiClient'

export function TranscriptLibrary() {
  const [transcripts, setTranscripts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTranscripts()
  }, [])

  const loadTranscripts = async () => {
    try {
      const { transcripts: data } = await apiClient.getTranscripts()
      setTranscripts(data)
    } catch (error) {
      console.error('Failed to load transcripts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transcript?')) {
      try {
        await apiClient.deleteTranscript(id)
        await loadTranscripts()
      } catch (error) {
        console.error('Failed to delete:', error)
      }
    }
  }

  if (loading) {
    return <div>Loading transcripts...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Transcripts ({transcripts.length})</h2>

      <div className="grid gap-4">
        {transcripts.map((transcript) => (
          <Card key={transcript.id} className="p-4">
            <h3 className="font-semibold">{transcript.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(transcript.createdAt).toLocaleDateString()} • {transcript.duration}s
            </p>
            <div className="mt-2 flex gap-2">
              <Button size="sm">Load</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(transcript.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {transcripts.length === 0 && (
        <p className="text-center text-muted-foreground">No transcripts yet</p>
      )}
    </div>
  )
}
```

4. **Update App.tsx** to include auth flow:

```typescript
// Add auth state management
const [isAuthenticated, setIsAuthenticated] = useState(
  apiClient.isAuthenticated()
)
const [showLibrary, setShowLibrary] = useState(false)
```

**Acceptance Criteria**:

- ✅ Login component working
- ✅ Register component working
- ✅ Transcript library showing saved transcripts
- ✅ Delete functionality working
- ✅ Load transcript functionality working
- ✅ Auth state persisted across page reloads

---

## ✅ Sprint 3 Completion Criteria

**Demo Requirements**:

1. **Backend Demo**:
   - ✅ PostgreSQL running in Docker Desktop
   - ✅ Express server running on port 3000
   - ✅ Health check endpoint working
   - ✅ Register new user via API
   - ✅ Login and receive JWT token

2. **Transcript Archive Demo**:
   - ✅ Upload video → Transcribe → Auto-save to database
   - ✅ Open transcript library → Show saved transcripts
   - ✅ Load transcript from database
   - ✅ Delete transcript
   - ✅ Search transcripts by title

3. **FFmpeg Demo**:
   - ✅ Upload AAC video → Browser extraction (fast)
   - ✅ Upload AC-3 video → FFmpeg fallback (31MB download)
   - ✅ Second AC-3 video → FFmpeg cached (no re-download)

4. **Technical Verification**:
   - ✅ All API endpoints tested (Postman/Insomnia)
   - ✅ Database schema verified (pgAdmin)
   - ✅ JWT authentication working
   - ✅ CORS configured correctly
   - ✅ Error handling tested

---

## 🧪 Testing Checklist

### Backend Tests

```bash
# Manual API testing with curl

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get transcripts (with token)
curl http://localhost:3000/api/transcripts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Tests

- [ ] Upload AAC video → Browser extraction
- [ ] Upload AC-3 video → FFmpeg fallback
- [ ] Upload MP3 audio → Direct transcription
- [ ] Register new account
- [ ] Login with existing account
- [ ] Auto-save transcript after processing
- [ ] View transcript library
- [ ] Load saved transcript
- [ ] Delete transcript
- [ ] Logout and login again

---

## 📚 Reference Documentation

**Read These First**:

- [ROADMAP_UPDATES_2025-12-17.md](../../ROADMAP_UPDATES_2025-12-17.md) - Complete overview of changes
- [TASK_3.8_FFMPEG_CODEC_SUPPORT.md](./TASK_3.8_FFMPEG_CODEC_SUPPORT.md) - FFmpeg implementation guide
- [FULL_STACK_ARCHITECTURE.md](../../architecture/FULL_STACK_ARCHITECTURE.md) - Backend architecture
- [Sprint-09-Database-Persistence.md](../Sprint-09-Database-Persistence.md) - Original IndexedDB plan (for reference)

---

## 🚨 Common Issues & Solutions

### Issue 1: Docker PostgreSQL won't start

**Solution**:

```bash
docker-compose down
docker volume rm transcript-parser_postgres_data
docker-compose up -d
```

### Issue 2: CORS errors from frontend

**Solution**: Verify Express CORS config matches Vite dev server port:

```typescript
app.use(
  cors({
    origin: 'http://localhost:5173', // Must match Vite
    credentials: true,
  })
)
```

### Issue 3: FFmpeg download fails

**Solution**: Check browser console for errors. May need to allow CORS for unpkg.com or self-host FFmpeg files.

### Issue 4: JWT token expired

**Solution**: Implement token refresh or ask user to login again:

```typescript
if (error.message === 'Invalid token') {
  apiClient.logout()
  // Redirect to login
}
```

---

## 🎯 Success Metrics

**Sprint 3 is complete when**:

- ✅ All 9 tasks completed with acceptance criteria met
- ✅ Demo works end-to-end (upload → transcribe → save → load)
- ✅ FFmpeg fallback strategy working
- ✅ PostgreSQL database persisting data across restarts
- ✅ User authentication working with JWT
- ✅ Code reviewed and no critical bugs
- ✅ Ready for Sprint 4 (Transcript Display enhancements)

---

**Document Version**: 1.0
**Created**: 2025-12-17
**Sprint**: 3
**Estimated Effort**: 38 hours (2 weeks)
