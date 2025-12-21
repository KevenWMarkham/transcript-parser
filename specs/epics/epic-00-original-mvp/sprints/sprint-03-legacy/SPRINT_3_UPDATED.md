# Sprint 3: Backend Infrastructure & Docker PostgreSQL Setup

**Duration**: 2 weeks (Weeks 5-6)
**Sprint Goal**: Set up backend API with Docker Desktop PostgreSQL, implement user authentication, and create transcript archive functionality.

---

## 🎯 Sprint Objectives

1. **Set up Docker Desktop PostgreSQL** database for local development
2. **Implement Node.js + Express backend** API with TypeScript
3. **Create database schema** with Drizzle ORM
4. **Add user authentication** (register/login with JWT)
5. **Build transcript CRUD API** (create, read, update, delete)
6. **Implement video blob storage** in PostgreSQL
7. **Create frontend API client** for backend communication

---

## 📋 User Stories

### Story 1: Database Setup with Docker Desktop

**As a** developer
**I want** PostgreSQL running in Docker Desktop
**So that** I have a consistent, reproducible local database environment

**Acceptance Criteria**:

- ✅ PostgreSQL 16 container running in Docker Desktop
- ✅ Database accessible at `localhost:5432`
- ✅ Docker Compose configuration for easy setup
- ✅ Database persists data across container restarts
- ✅ Connection tested and verified

### Story 2: User Authentication

**As a** user
**I want** to create an account and log in
**So that** I can save my transcripts privately

**Acceptance Criteria**:

- ✅ User can register with email/password
- ✅ Passwords hashed with bcrypt
- ✅ User can log in with valid credentials
- ✅ JWT token issued on successful login
- ✅ Token stored in frontend (localStorage)
- ✅ Protected routes require valid token

### Story 3: Save Transcripts to Database

**As a** user
**I want** to save my transcripts to the database
**So that** I can access them later from any device

**Acceptance Criteria**:

- ✅ "Save Transcript" button after transcription completes
- ✅ Transcript metadata, speakers, and entries saved to PostgreSQL
- ✅ Original video file saved as blob (optional)
- ✅ Success message shown after save
- ✅ Transcript linked to user account

### Story 4: View Transcript Archive

**As a** user
**I want** to see a list of my saved transcripts
**So that** I can access previous transcriptions

**Acceptance Criteria**:

- ✅ "My Transcripts" page showing all saved transcripts
- ✅ Display: title, date, duration, speaker count
- ✅ Click transcript to view full details
- ✅ Sort by date (newest first)
- ✅ Delete transcript option

---

## 🛠️ Technical Tasks

### Task 3.1: Docker Desktop PostgreSQL Setup

**Estimated Effort**: 4 hours

**Implementation Steps**:

#### 1. Install Docker Desktop

```bash
# Download and install Docker Desktop from:
# https://www.docker.com/products/docker-desktop/

# Verify installation
docker --version
docker-compose --version
```

#### 2. Create Docker Compose Configuration

**File: `docker-compose.yml`**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: transcript-parser-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: transcript_parser
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Optional: pgAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: transcript-parser-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@transcript-parser.local
      PGADMIN_DEFAULT_PASSWORD: admin
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - '5050:80'
    volumes:
      - pgadmin_data:/var/lib/pgadmin
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  pgadmin_data:
    driver: local
```

#### 3. Start PostgreSQL

```bash
# Start database
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs postgres

# Stop database
docker-compose down

# Stop and remove volumes (WARNING: deletes all data)
docker-compose down -v
```

#### 4. Create .env File

**File: `.env.local`**

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transcript_parser

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# API
VITE_API_URL=http://localhost:3000/api

# Gemini (existing)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

#### 5. Test Connection

```bash
# Connect using psql (if installed)
psql postgresql://postgres:postgres@localhost:5432/transcript_parser

# Or use pgAdmin at http://localhost:5050
# Email: admin@transcript-parser.local
# Password: admin
```

**Acceptance Criteria**:

- ✅ PostgreSQL container running in Docker Desktop
- ✅ Can connect to database at localhost:5432
- ✅ pgAdmin accessible (optional)
- ✅ Data persists after container restart

---

### Task 3.2: Backend Project Setup

**Estimated Effort**: 2 hours

#### 1. Create Server Directory Structure

```
transcript-parser/
├── src/                    # Frontend (existing)
├── server/                 # Backend (new)
│   ├── index.ts           # Express app entry point
│   ├── config/
│   │   └── database.ts    # Database connection
│   ├── db/
│   │   ├── schema.ts      # Drizzle schema
│   │   └── migrations/    # SQL migrations
│   ├── routes/
│   │   ├── auth.ts        # Auth routes
│   │   ├── transcripts.ts # Transcript routes
│   │   └── index.ts       # Route aggregator
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── transcriptController.ts
│   ├── middleware/
│   │   ├── auth.ts        # JWT middleware
│   │   └── errorHandler.ts
│   └── types/
│       └── express.d.ts   # Type definitions
├── docker-compose.yml
├── .env.local
└── package.json
```

#### 2. Install Backend Dependencies

```bash
npm install express pg drizzle-orm drizzle-kit jsonwebtoken bcrypt cors dotenv
npm install --save-dev @types/express @types/bcrypt @types/jsonwebtoken @types/cors tsx nodemon
```

#### 3. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "dev:server": "nodemon --exec tsx server/index.ts",
    "dev:all": "concurrently \"npm run dev\" \"npm run dev:server\"",
    "build": "tsc -b && vite build",
    "build:server": "tsc -p server/tsconfig.json",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

#### 4. Create Server TypeScript Config

**File: `server/tsconfig.json`**

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "../dist/server",
    "rootDir": ".",
    "types": ["node"]
  },
  "include": ["./**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Acceptance Criteria**:

- ✅ Server directory structure created
- ✅ Dependencies installed
- ✅ TypeScript configured for server
- ✅ Scripts ready for development

---

### Task 3.3: Database Schema Implementation

**Estimated Effort**: 4 hours

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

  // Metadata
  title: varchar('title', { length: 500 }),
  description: text('description'),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: bigint('file_size', { mode: 'number' }).notNull(),
  duration: decimal('duration', { precision: 10, scale: 2 }),
  videoFormat: varchar('video_format', { length: 50 }),

  // Processing info
  model: varchar('model', { length: 100 }),
  processedAt: timestamp('processed_at').defaultNow(),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Speakers table
export const speakers = pgTable('speakers', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' }),
  speakerNumber: integer('speaker_number').notNull(),
  speakerName: varchar('speaker_name', { length: 255 }).notNull(),
  color: varchar('color', { length: 50 }),
})

// Transcript entries table
export const transcriptEntries = pgTable('transcript_entries', {
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
})

// Video blobs table (optional - for storing original files)
export const videoBlobs = pgTable('video_blobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  transcriptId: uuid('transcript_id')
    .notNull()
    .references(() => transcripts.id, { onDelete: 'cascade' })
    .unique(),

  blobData: text('blob_data').notNull(), // base64 encoded
  blobType: varchar('blob_type', { length: 100 }).notNull(),
  blobSize: bigint('blob_size', { mode: 'number' }).notNull(),

  uploadedAt: timestamp('uploaded_at').defaultNow(),
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

**Create Migration**:

```bash
# Generate migration from schema
npm run db:generate

# Apply migration to database
npm run db:push
```

**Acceptance Criteria**:

- ✅ All tables created in PostgreSQL
- ✅ Foreign key constraints working
- ✅ Indexes created for performance
- ✅ Relations defined in Drizzle

---

### Task 3.4: Express Server Implementation

**Estimated Effort**: 3 hours

**File: `server/index.ts`**

```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import transcriptRoutes from './routes/transcripts'
import { errorHandler } from './middleware/errorHandler'

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: process.env.VITE_APP_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transcripts', transcriptRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handling
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`✅ API available at http://localhost:${PORT}/api`)
  console.log(`✅ Health check: http://localhost:${PORT}/health`)
})
```

**File: `server/config/database.ts`**

```typescript
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../db/schema'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err)
  } else {
    console.log('✅ Database connected at:', res.rows[0].now)
  }
})
```

**Acceptance Criteria**:

- ✅ Express server starts without errors
- ✅ Database connection successful
- ✅ CORS configured for frontend
- ✅ Health check endpoint working

---

### Task 3.5: Authentication Implementation

**Estimated Effort**: 4 hours

See [Full-Stack Architecture Guide](../architecture/FULL_STACK_ARCHITECTURE.md) for complete auth implementation including:

- User registration endpoint
- Login endpoint
- JWT token generation
- Auth middleware for protected routes
- Password hashing with bcrypt

**Acceptance Criteria**:

- ✅ User can register with email/password
- ✅ User can log in and receive JWT token
- ✅ Protected routes reject invalid tokens
- ✅ Passwords never stored in plaintext

---

### Task 3.6: Transcript CRUD API

**Estimated Effort**: 5 hours

**Endpoints**:

- `POST /api/transcripts` - Create new transcript
- `GET /api/transcripts` - Get all user's transcripts
- `GET /api/transcripts/:id` - Get single transcript with entries
- `PUT /api/transcripts/:id` - Update transcript metadata
- `DELETE /api/transcripts/:id` - Delete transcript
- `GET /api/transcripts/:id/video` - Download video blob

See [Full-Stack Architecture Guide](../architecture/FULL_STACK_ARCHITECTURE.md) for complete API implementation.

**Acceptance Criteria**:

- ✅ All endpoints working and tested
- ✅ Only owner can access their transcripts
- ✅ Video blob storage working
- ✅ Cascade delete working (delete transcript → delete speakers → delete entries)

---

### Task 3.7: Frontend Integration

**Estimated Effort**: 4 hours

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

  // Auth methods
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

  // Transcript methods
  async saveTranscript(data: any) {
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
}

export const apiClient = new ApiClient()
```

**Acceptance Criteria**:

- ✅ API client working with backend
- ✅ Token stored in localStorage
- ✅ Automatic token inclusion in requests
- ✅ Error handling for failed requests

---

### Task 3.8: UI Components for Archive

**Estimated Effort**: 6 hours

**Components to create**:

1. **Login/Register Page** - User authentication UI
2. **Save Transcript Button** - Add to transcript viewer
3. **Transcript Library Page** - List all saved transcripts
4. **Transcript Detail Page** - View saved transcript

**Acceptance Criteria**:

- ✅ User can log in/register from UI
- ✅ "Save Transcript" button appears after transcription
- ✅ Library page shows all user's transcripts
- ✅ Can view and delete saved transcripts

---

## 📊 Testing Requirements

### Unit Tests

- Database connection and queries
- Authentication logic (register, login, JWT)
- API endpoints (mock database)
- Frontend API client

### Integration Tests

- Full auth flow (register → login → protected route)
- Save transcript flow (frontend → backend → database)
- Retrieve transcript flow

### E2E Tests

- User registers and logs in
- User transcribes video and saves
- User views saved transcripts
- User deletes transcript

**Target Coverage**: ≥ 80%

---

## 📚 Documentation

### Create Documentation Files

1. **`Specs/backend/BACKEND_SETUP.md`**
   - Docker Desktop installation
   - PostgreSQL setup guide
   - Environment variables
   - Running the backend

2. **`Specs/backend/API_REFERENCE.md`**
   - All API endpoints
   - Request/response examples
   - Authentication flow
   - Error codes

3. **`Specs/backend/DATABASE_SCHEMA.md`**
   - Table descriptions
   - Relationships
   - Indexes
   - Migrations

---

## ✅ Definition of Done

- ✅ Docker Compose running PostgreSQL successfully
- ✅ All database tables created via migrations
- ✅ Express server running on port 3000
- ✅ User authentication working (register + login)
- ✅ Transcript CRUD API fully functional
- ✅ Frontend can save and retrieve transcripts
- ✅ Video blob storage working (optional)
- ✅ All tests passing (≥ 80% coverage)
- ✅ Backend documentation complete
- ✅ Code reviewed and merged

---

## 🎬 Sprint Demo

**Demo Script** (15 minutes):

1. **Show Docker Desktop** - PostgreSQL container running
2. **Show pgAdmin** - Database tables and sample data
3. **Register new user** - Frontend registration flow
4. **Transcribe video** - Complete transcription workflow
5. **Save transcript** - Click "Save" button, show success
6. **View library** - Navigate to "My Transcripts" page
7. **Open saved transcript** - View full transcript details
8. **Delete transcript** - Remove a transcript from library
9. **Show API calls** - DevTools network tab showing API requests
10. **Show database** - pgAdmin showing saved data

---

## 🚀 Deployment Considerations

### Development Environment

- Docker Desktop (local PostgreSQL)
- Node.js server on localhost:3000
- Frontend on localhost:5173

### Production Environment (Future)

- Frontend: Vercel (static deployment)
- Backend: Railway or Render (Node.js + PostgreSQL)
- Database: Managed PostgreSQL on Railway

---

## 📦 Deliverables

1. ✅ Docker Compose configuration
2. ✅ PostgreSQL database with schema
3. ✅ Express backend API
4. ✅ User authentication system
5. ✅ Transcript CRUD endpoints
6. ✅ Frontend API integration
7. ✅ Archive UI components
8. ✅ Documentation
9. ✅ Tests (unit + integration + E2E)

---

**Sprint 3 Updated Version**: 2.0
**Created**: 2025-12-17
**Updated**: 2025-12-17 (Added Docker Desktop PostgreSQL + Backend Infrastructure)
