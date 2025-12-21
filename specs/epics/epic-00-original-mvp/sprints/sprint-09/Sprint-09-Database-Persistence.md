# Sprint 9: IndexedDB Integration & Transcript Library

**Duration**: 2 weeks (Weeks 17-18)
**Sprint Goal**: Implement complete IndexedDB integration for saving/loading transcripts and create transcript library UI.

---

## Sprint Objectives

1. Complete IndexedDB schema and CRUD operations
2. Auto-save transcripts after processing
3. Build transcript library UI for managing saved transcripts
4. Implement import/load functionality
5. Working demo with persistent transcript library

---

## User Stories

### Story 1: Auto-save Transcripts

**As a** user
**I want** my transcripts automatically saved
**So that** I don't lose my work

**Acceptance Criteria**:

- [ ] Transcript saved to IndexedDB after processing
- [ ] User notified when save completes
- [ ] Save includes all metadata and customizations
- [ ] Storage quota warnings displayed

### Story 2: Transcript Library

**As a** user
**I want to** browse my previously saved transcripts
**So that** I can access them later

**Acceptance Criteria**:

- [ ] Library shows all saved transcripts
- [ ] Sorted by date (newest first)
- [ ] Preview shows filename, date, duration
- [ ] Search transcripts by filename
- [ ] Load transcript into viewer

### Story 3: Delete Transcripts

**As a** user
**I want to** delete old transcripts
**So that** I can manage storage space

**Acceptance Criteria**:

- [ ] Delete button with confirmation
- [ ] Transcript removed from library
- [ ] Storage space freed
- [ ] Undo option (5 seconds)

---

## Technical Tasks

### Task 9.1: IndexedDB Schema & Setup

**Estimated Effort**: 1 day

```typescript
// src/services/database.ts

import Dexie, { Table } from 'dexie'

export interface StoredTranscript {
  id: string // Primary key
  fileName: string
  createdAt: string
  duration: number
  data: TranscriptData
  thumbnail?: string // Base64 video thumbnail
}

export class TranscriptDatabase extends Dexie {
  transcripts!: Table<StoredTranscript, string>

  constructor() {
    super('TranscriptParserDB')

    this.version(1).stores({
      transcripts: 'id, fileName, createdAt, duration',
    })
  }
}

export const db = new TranscriptDatabase()
```

### Task 9.2: CRUD Operations

**Estimated Effort**: 2 days

```typescript
// src/services/transcriptStorage.ts

export class TranscriptStorage {
  async save(transcript: TranscriptData): Promise<string> {
    const stored: StoredTranscript = {
      id: transcript.id,
      fileName: transcript.metadata.fileName,
      createdAt: transcript.metadata.createdAt,
      duration: transcript.metadata.duration,
      data: transcript,
    }

    await db.transcripts.add(stored)
    return stored.id
  }

  async load(id: string): Promise<TranscriptData | null> {
    const stored = await db.transcripts.get(id)
    return stored ? stored.data : null
  }

  async update(id: string, updates: Partial<TranscriptData>): Promise<void> {
    const stored = await db.transcripts.get(id)
    if (!stored) throw new Error('Transcript not found')

    stored.data = { ...stored.data, ...updates }
    await db.transcripts.put(stored)
  }

  async delete(id: string): Promise<void> {
    await db.transcripts.delete(id)
  }

  async list(): Promise<StoredTranscript[]> {
    return db.transcripts.orderBy('createdAt').reverse().toArray()
  }

  async search(query: string): Promise<StoredTranscript[]> {
    const all = await this.list()
    const q = query.toLowerCase()

    return all.filter(t => t.fileName.toLowerCase().includes(q))
  }

  async getStorageInfo(): Promise<{
    usage: number
    quota: number
    percentage: number
  }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
      }
    }

    return { usage: 0, quota: 0, percentage: 0 }
  }
}

export const transcriptStorage = new TranscriptStorage()
```

### Task 9.3: Auto-save Integration

**Estimated Effort**: 1 day

```typescript
// Update useTranscription hook

const startTranscription = useCallback(
  async (videoFile: File, metadata: VideoMetadata) => {
    try {
      // ... existing transcription logic ...

      // Auto-save after completion
      if (result) {
        const id = await transcriptStorage.save(result)
        console.log('Transcript saved:', id)
      }

      setTranscript(result)
      setProcessingState('complete')
    } catch (err) {
      // ... error handling ...
    }
  },
  []
)
```

### Task 9.4: Transcript Library UI

**Estimated Effort**: 3 days

```typescript
// src/components/TranscriptLibrary.tsx

interface TranscriptLibraryProps {
  onLoad: (transcript: TranscriptData) => void
}

export function TranscriptLibrary({ onLoad }: TranscriptLibraryProps) {
  const [transcripts, setTranscripts] = useState<StoredTranscript[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTranscripts()
  }, [])

  const loadTranscripts = async () => {
    setLoading(true)
    const all = await transcriptStorage.list()
    setTranscripts(all)
    setLoading(false)
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query) {
      await loadTranscripts()
    } else {
      const results = await transcriptStorage.search(query)
      setTranscripts(results)
    }
  }

  const handleLoad = async (id: string) => {
    const transcript = await transcriptStorage.load(id)
    if (transcript) {
      onLoad(transcript)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this transcript?')) {
      await transcriptStorage.delete(id)
      await loadTranscripts()
    }
  }

  if (loading) {
    return <div>Loading transcripts...</div>
  }

  return (
    <div className="transcript-library">
      <div className="library-header">
        <h2>Saved Transcripts ({transcripts.length})</h2>

        <input
          type="text"
          placeholder="Search transcripts..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="library-grid">
        {transcripts.map(transcript => (
          <div key={transcript.id} className="transcript-card">
            <h3>{transcript.fileName}</h3>

            <div className="transcript-meta">
              <span>{new Date(transcript.createdAt).toLocaleDateString()}</span>
              <span>{formatDuration(transcript.duration)}</span>
              <span>{transcript.data.speakers.length} speakers</span>
            </div>

            <div className="transcript-actions">
              <button onClick={() => handleLoad(transcript.id)}>
                Load
              </button>

              <button onClick={() => handleDelete(transcript.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {transcripts.length === 0 && (
        <div className="empty-state">
          <p>No transcripts saved yet</p>
        </div>
      )}
    </div>
  )
}
```

### Task 9.5: Storage Management

**Estimated Effort**: 1 day

```typescript
// src/components/StorageIndicator.tsx

export function StorageIndicator() {
  const [storage, setStorage] = useState({ usage: 0, quota: 0, percentage: 0 })

  useEffect(() => {
    const updateStorage = async () => {
      const info = await transcriptStorage.getStorageInfo()
      setStorage(info)
    }

    updateStorage()
    const interval = setInterval(updateStorage, 10000)

    return () => clearInterval(interval)
  }, [])

  const isLow = storage.percentage > 80

  return (
    <div className={`storage-indicator ${isLow ? 'warning' : ''}`}>
      <div className="storage-bar">
        <div
          className="storage-fill"
          style={{ width: `${storage.percentage}%` }}
        />
      </div>

      <span className="storage-text">
        {formatFileSize(storage.usage)} / {formatFileSize(storage.quota)}
        {isLow && ' - Storage running low'}
      </span>
    </div>
  )
}
```

### Task 9.6: Testing

**Estimated Effort**: 3 days

**Test Cases**:

- Save transcript to IndexedDB
- Load transcript from IndexedDB
- Update existing transcript
- Delete transcript
- Search functionality
- Storage quota handling
- Migration tests (future schema changes)

```typescript
// src/services/transcriptStorage.test.ts

import 'fake-indexeddb/auto'
import { db, transcriptStorage } from './transcriptStorage'

describe('TranscriptStorage', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('saves and loads transcript', async () => {
    const transcript = createMockTranscript()

    const id = await transcriptStorage.save(transcript)
    const loaded = await transcriptStorage.load(id)

    expect(loaded).toEqual(transcript)
  })

  it('lists transcripts in reverse chronological order', async () => {
    const t1 = createMockTranscript('1', '2025-01-01')
    const t2 = createMockTranscript('2', '2025-01-02')

    await transcriptStorage.save(t1)
    await transcriptStorage.save(t2)

    const list = await transcriptStorage.list()

    expect(list[0].id).toBe('2') // Most recent first
  })

  it('deletes transcript', async () => {
    const transcript = createMockTranscript()
    const id = await transcriptStorage.save(transcript)

    await transcriptStorage.delete(id)

    const loaded = await transcriptStorage.load(id)
    expect(loaded).toBeNull()
  })
})
```

---

## Definition of Done

- [ ] IndexedDB fully integrated
- [ ] Auto-save working after transcription
- [ ] Transcript library UI complete
- [ ] Load/delete functionality working
- [ ] Test coverage ≥ 80%
- [ ] **Working demo**: Save, browse, load, delete transcripts
- [ ] Code reviewed

---

## Demo

1. Process video → Auto-save confirmation
2. Open transcript library → Show saved transcripts
3. Search library by filename
4. Load old transcript → Show in viewer
5. Delete transcript with confirmation
6. Show storage indicator

---

**Sprint 9 Plan Version**: 1.0
