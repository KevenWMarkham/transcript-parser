# @transcript-parser/database

Database layer for Transcript Parser using Drizzle ORM with SQLite.

## Installation

```bash
pnpm add @transcript-parser/database
```

## Usage

### Database Connection

```typescript
import { db, getDatabase } from '@transcript-parser/database'

// Get database instance
const database = await getDatabase()

// Use in queries
const transcripts = await database.select().from(transcriptsTable)
```

### Schema

```typescript
import {
  transcriptsTable,
  speakersTable,
  transcriptEntriesTable,
  usageTable,
} from '@transcript-parser/database'

// Tables are exported for use in queries
```

### Queries

```typescript
import * as queries from '@transcript-parser/database'

// Save transcript
await queries.saveTranscript(db, transcriptData)

// Get all transcripts
const transcripts = await queries.getAllTranscripts(db)

// Get transcript by ID
const transcript = await queries.getTranscriptById(db, 'transcript-123')

// Delete transcript
await queries.deleteTranscript(db, 'transcript-123')

// Usage tracking
await queries.saveUsageRecord(db, usageRecord)
const usage = await queries.getUserUsage(db, userId)
```

## Schema Structure

### Transcripts Table

- `id`: Primary key
- `fileName`: Original file name
- `fileSize`: File size in bytes
- `duration`: Video duration in seconds
- `createdAt`: Creation timestamp
- `processedAt`: Processing timestamp
- `videoFormat`: Video format/codec
- `model`: AI model used

### Speakers Table

- `id`: Primary key
- `transcriptId`: Foreign key to transcripts
- `speakerNumber`: Speaker number (1, 2, 3, ...)
- `name`: Speaker name
- `color`: Display color

### Transcript Entries Table

- `id`: Primary key
- `transcriptId`: Foreign key to transcripts
- `speaker`: Speaker name
- `speakerNumber`: Speaker number
- `startTime`: Start time in seconds
- `endTime`: End time in seconds
- `text`: Transcribed text
- `confidence`: Confidence score (0-1)

### Usage Table

- `id`: Primary key
- `userId`: User ID
- `model`: AI model used
- `operation`: Operation type
- `inputTokens`: Input token count
- `outputTokens`: Output token count
- `totalTokens`: Total token count
- `timestamp`: Usage timestamp
- `metadata`: JSON metadata

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Type checking
pnpm type-check

# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio
pnpm db:studio
```

## Database Location

- Development: `./data/transcripts.db`
- Production: User data directory

## Features

- **Type-safe queries**: Full TypeScript support via Drizzle ORM
- **SQLite backend**: Lightweight, serverless database
- **Automatic migrations**: Schema versioning and updates
- **Relational queries**: Easy joins and relationships
- **JSON support**: Flexible metadata storage
