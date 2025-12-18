# Video Transcript Parser - Technical Specifications

## Document Overview

This document provides detailed technical specifications for the Video Transcript Parser MVP. It covers architecture, component design, data models, API integration, and implementation details.

**Version**: 1.0
**Last Updated**: 2025-12-17

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Component Specifications](#component-specifications)
3. [Data Models](#data-models)
4. [API Integration](#api-integration)
5. [Storage Strategy](#storage-strategy)
6. [Export Formats](#export-formats)
7. [Performance Requirements](#performance-requirements)
8. [Security Considerations](#security-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client-Side)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  State Mgmt  │  │   Services   │      │
│  │  (React)     │◄─┤  (Context)   │◄─┤  (Gemini AI) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         ▲                  ▲                  ▲              │
│         │                  │                  │              │
│         ▼                  ▼                  ▼              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Components   │  │    Hooks     │  │  Utilities   │      │
│  │ (shadcn/ui)  │  │  (Custom)    │  │  (Helpers)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              IndexedDB (Local Storage)               │    │
│  │  - Transcripts  - User Preferences  - Cache         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Google Gemini   │
                    │      API         │
                    └──────────────────┘
```

### Technology Stack

#### Frontend Core

- **React**: 18.3.1 - UI framework
- **TypeScript**: 5.6.2 - Type safety
- **Vite**: 6.0.5 - Build tool and dev server
- **Tailwind CSS**: 4.1.18 - Styling

#### UI Components

- **shadcn/ui**: Pre-built, accessible components
- **Radix UI**: Headless UI primitives
- **lucide-react**: Icon library

#### State Management

- **React Context API**: Global state
- **Custom Hooks**: Reusable state logic
- **useState/useReducer**: Local state

#### API & Services

- **@google/generative-ai**: Gemini SDK
- **Fetch API**: HTTP requests

#### Storage

- **Dexie.js**: IndexedDB wrapper
- **localStorage**: User preferences

#### Video/Audio Processing

- **HTML5 Video API**: Video playback
- **Web Audio API**: Audio extraction
- **MediaRecorder API**: Audio capture
- **FFmpeg.wasm**: Audio conversion (if needed)

#### Testing

- **Jest**: 30.2.0 - Unit/integration tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **MSW (Mock Service Worker)**: API mocking

#### Code Quality

- **ESLint**: Linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking
- **Husky**: Git hooks
- **Commitlint**: Commit message validation

---

## Component Specifications

### 1. App Component (`App.tsx`)

**Purpose**: Root application component managing global state and routing

**State**:

```typescript
interface AppState {
  currentVideo: File | null
  transcript: TranscriptData | null
  processingState: ProcessingState
  error: Error | null
}

type ProcessingState =
  | 'idle'
  | 'uploading'
  | 'extracting-audio'
  | 'transcribing'
  | 'diarizing'
  | 'complete'
  | 'error'
```

**Props**: None (root component)

**Responsibilities**:

- Manage application-level state
- Provide context to child components
- Handle top-level error boundaries
- Coordinate between upload, processing, and display

---

### 2. Header Component (`Header.tsx`)

**Purpose**: Application branding and navigation

**Props**: None

**Features**:

- Logo with gradient styling
- Application title
- Subtitle/tagline
- Responsive design

**Demo Ready**: Sprint 1

---

### 3. VideoUploader Component (`UploadVideo.tsx`)

**Purpose**: File upload interface with drag-and-drop

**Props**:

```typescript
interface VideoUploaderProps {
  onUpload: (file: File) => void
  disabled: boolean
  maxSize?: number // bytes, default 2GB
  acceptedFormats?: string[] // default: ['video/mp4', 'video/mov', 'video/avi', 'video/webm']
}
```

**State**:

```typescript
interface UploaderState {
  isDragging: boolean
  selectedFile: File | null
  validationError: string | null
}
```

**Validation Rules**:

1. File must be a video format
2. File size ≤ 2GB (configurable)
3. Accepted formats: MP4, MOV, AVI, WebM
4. File must not be corrupted

**Features**:

- Drag-and-drop zone
- Click to browse
- File validation with error messages
- Video preview after selection
- File metadata display (name, size, duration)
- Clear/remove file button

**Demo Ready**: Sprint 1

---

### 4. ProcessingStatus Component (`ProcessingStatus.tsx`)

**Purpose**: Display real-time processing progress

**Props**:

```typescript
interface ProcessingStatusProps {
  state: ProcessingState
  progress: number // 0-100
  currentStep: string
  estimatedTimeRemaining?: number // seconds
  onCancel?: () => void
  onReset: () => void
}
```

**Processing Steps**:

1. Uploading (validation)
2. Extracting audio from video
3. Sending to Gemini API
4. Transcribing speech
5. Identifying speakers
6. Formatting transcript
7. Complete

**Features**:

- Progress bar with percentage
- Current step indicator
- Animated status icons
- Estimated time remaining
- Cancel button (if applicable)
- Error state with retry option

**Demo Ready**: Sprint 2

---

### 5. TranscriptViewer Component (`TranscriptView.tsx`)

**Purpose**: Display formatted transcript with speaker identification

**Props**:

```typescript
interface TranscriptViewerProps {
  transcript: TranscriptData
  isProcessing: boolean
  onExport: (format: ExportFormat) => void
  onSpeakerEdit?: (speakerId: number, newName: string) => void
  onSegmentClick?: (segmentId: string) => void
}
```

**Features**:

- Speaker color coding
- Timestamp display
- Confidence scores
- Empty state when no transcript
- Loading state during processing
- Speaker summary panel
- Export buttons (JSON, SRT, VTT)
- Scrollable with fixed header
- Search/filter (Sprint 8)

**Demo Ready**: Sprint 4

---

### 6. TranscriptEntry Component (`TranscriptEntry.tsx`)

**Purpose**: Individual transcript segment display

**Props**:

```typescript
interface TranscriptEntryProps {
  entry: TranscriptEntry
  speakerColor: string
  onSpeakerClick?: (speakerId: number) => void
  onTimestampClick?: (time: number) => void
  isHighlighted?: boolean
}
```

**Features**:

- Speaker badge with color dot
- Timestamp (start - end)
- Transcript text
- Confidence indicator
- Click to seek video (Sprint 6)
- Hover effects

**Demo Ready**: Sprint 4

---

### 7. VideoPlayer Component (New in Sprint 6)

**Purpose**: Video playback with transcript synchronization

**Props**:

```typescript
interface VideoPlayerProps {
  videoFile: File
  transcript: TranscriptData
  currentSegmentId?: string
  onTimeUpdate?: (currentTime: number) => void
  onSegmentChange?: (segmentId: string) => void
}
```

**Features**:

- HTML5 video player
- Play/pause controls
- Seek bar
- Volume control
- Fullscreen support
- Current time display
- Sync with transcript (highlight current segment)
- Click timestamp to seek

**Demo Ready**: Sprint 6

---

### 8. SpeakerEditor Component (New in Sprint 7)

**Purpose**: Edit speaker names and manage speaker list

**Props**:

```typescript
interface SpeakerEditorProps {
  speakers: Speaker[]
  onSpeakerUpdate: (speakerId: number, updates: Partial<Speaker>) => void
  onSpeakerMerge?: (fromId: number, toId: number) => void
}
```

**Features**:

- List of identified speakers
- Inline name editing
- Color picker for speaker color
- Merge speakers (optional)
- Speaker statistics (segment count, total duration)

**Demo Ready**: Sprint 7

---

### 9. SearchBar Component (New in Sprint 8)

**Purpose**: Search and filter transcript entries

**Props**:

```typescript
interface SearchBarProps {
  transcript: TranscriptData
  onResultsChange: (filteredEntries: TranscriptEntry[]) => void
  onResultClick: (entry: TranscriptEntry) => void
}
```

**Features**:

- Text search across transcript
- Filter by speaker
- Filter by time range
- Highlight search terms
- Result count display
- Clear search button

**Demo Ready**: Sprint 8

---

### 10. TranscriptLibrary Component (New in Sprint 9)

**Purpose**: Browse and manage saved transcripts

**Props**:

```typescript
interface TranscriptLibraryProps {
  onTranscriptLoad: (transcriptId: string) => void
  onTranscriptDelete: (transcriptId: string) => void
}
```

**Features**:

- List of saved transcripts
- Sort by date, name, duration
- Search transcripts
- Preview on hover
- Delete with confirmation
- Load transcript into viewer

**Demo Ready**: Sprint 9

---

## Data Models

### TranscriptEntry

```typescript
interface TranscriptEntry {
  id: string // Unique identifier (UUID)
  speaker: string // Display name (e.g., "John Doe" or "Speaker 1")
  speakerNumber: number // Numeric ID (1, 2, 3...)
  startTime: number // Start time in seconds (e.g., 12.5)
  endTime: number // End time in seconds (e.g., 18.3)
  text: string // Transcribed text
  confidence?: number // Confidence score 0-1 (e.g., 0.96)
  words?: Word[] // Word-level timing (optional, for future use)
}
```

### Word (Optional, for future use)

```typescript
interface Word {
  text: string
  startTime: number
  endTime: number
  confidence?: number
}
```

### Speaker

```typescript
interface Speaker {
  id: number // Unique speaker ID (1, 2, 3...)
  name: string // Display name (editable)
  color: string // Hex color for UI (e.g., "#3B82F6")
  segmentCount?: number // Number of segments by this speaker
  totalDuration?: number // Total speaking time in seconds
}
```

### TranscriptData

```typescript
interface TranscriptData {
  id: string // Unique transcript ID (UUID)
  entries: TranscriptEntry[] // All transcript segments
  speakers: Speaker[] // List of identified speakers
  metadata: TranscriptMetadata
}
```

### TranscriptMetadata

```typescript
interface TranscriptMetadata {
  fileName: string // Original video file name
  fileSize: number // File size in bytes
  duration: number // Video duration in seconds
  createdAt: string // ISO 8601 timestamp
  processedAt?: string // ISO 8601 timestamp
  videoFormat: string // MIME type (e.g., "video/mp4")
  language?: string // Language code (e.g., "en-US")
  model?: string // AI model used (e.g., "gemini-1.5-pro")
}
```

### ProcessingState

```typescript
type ProcessingState =
  | 'idle' // No video loaded
  | 'uploading' // File being validated
  | 'extracting-audio' // Extracting audio from video
  | 'transcribing' // Sending to Gemini API
  | 'diarizing' // Identifying speakers
  | 'complete' // Processing finished
  | 'error' // Error occurred

interface ProcessingStatus {
  state: ProcessingState
  progress: number // 0-100
  currentStep: string
  estimatedTimeRemaining?: number
  error?: Error
}
```

---

## API Integration

### Google Gemini API

#### Setup

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
```

#### Audio Transcription with Speaker Diarization

**Approach 1: Direct Audio Input** (Preferred if supported)

```typescript
async function transcribeWithSpeakers(
  audioBlob: Blob
): Promise<TranscriptData> {
  const audioBase64 = await blobToBase64(audioBlob)

  const prompt = `
    Transcribe this audio and identify different speakers.

    For each segment, provide:
    - Speaker ID (Speaker 1, Speaker 2, etc.)
    - Start time in seconds
    - End time in seconds
    - Transcribed text
    - Confidence score

    Format the response as JSON array with this structure:
    [
      {
        "speaker": "Speaker 1",
        "speakerNumber": 1,
        "startTime": 0.0,
        "endTime": 5.2,
        "text": "Hello everyone...",
        "confidence": 0.95
      },
      ...
    ]
  `

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: audioBlob.type,
        data: audioBase64,
      },
    },
    { text: prompt },
  ])

  const response = await result.response
  const text = response.text()

  return parseGeminiResponse(text)
}
```

**Approach 2: Chunked Processing** (If file size limits exist)

```typescript
async function transcribeInChunks(
  audioBlob: Blob,
  chunkDuration: number = 60 // seconds
): Promise<TranscriptData> {
  const chunks = await splitAudioIntoChunks(audioBlob, chunkDuration)
  const results: TranscriptEntry[] = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    const offset = i * chunkDuration

    const chunkResult = await transcribeChunk(chunk, offset)
    results.push(...chunkResult)
  }

  // Merge and deduplicate speakers across chunks
  return mergeTranscriptChunks(results)
}
```

#### Error Handling

```typescript
async function transcribeWithRetry(
  audioBlob: Blob,
  maxRetries: number = 3
): Promise<TranscriptData> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await transcribeWithSpeakers(audioBlob)
    } catch (error) {
      lastError = error as Error

      // Handle specific error types
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please try again later.')
      }

      if (error.message.includes('invalid')) {
        throw new Error('Invalid audio format. Please try a different file.')
      }

      // Exponential backoff
      if (attempt < maxRetries - 1) {
        await sleep(Math.pow(2, attempt) * 1000)
      }
    }
  }

  throw lastError!
}
```

#### Rate Limiting

```typescript
class GeminiClient {
  private requestQueue: Promise<any>[] = []
  private maxConcurrent = 1 // Gemini API may have concurrency limits

  async transcribe(audioBlob: Blob): Promise<TranscriptData> {
    // Wait for available slot
    while (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue)
    }

    const request = this.executeTranscription(audioBlob)
    this.requestQueue.push(request)

    try {
      return await request
    } finally {
      this.requestQueue = this.requestQueue.filter(r => r !== request)
    }
  }

  private async executeTranscription(audioBlob: Blob): Promise<TranscriptData> {
    return transcribeWithRetry(audioBlob)
  }
}
```

---

## Storage Strategy

### IndexedDB Schema (Using Dexie.js)

```typescript
import Dexie, { Table } from 'dexie'

class TranscriptDatabase extends Dexie {
  transcripts!: Table<StoredTranscript, string>
  preferences!: Table<UserPreference, string>

  constructor() {
    super('TranscriptParserDB')

    this.version(1).stores({
      transcripts: 'id, fileName, createdAt, duration',
      preferences: 'key',
    })
  }
}

const db = new TranscriptDatabase()
```

### Stored Data Models

```typescript
interface StoredTranscript {
  id: string // Primary key (UUID)
  fileName: string // Indexed
  createdAt: string // Indexed (ISO 8601)
  duration: number // Indexed
  data: TranscriptData // Full transcript object
  thumbnail?: string // Base64 encoded thumbnail
}

interface UserPreference {
  key: string // Primary key (e.g., 'theme', 'defaultExportFormat')
  value: any
}
```

### CRUD Operations

```typescript
// Create
async function saveTranscript(transcript: TranscriptData): Promise<string> {
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

// Read
async function getTranscript(id: string): Promise<TranscriptData | null> {
  const stored = await db.transcripts.get(id)
  return stored ? stored.data : null
}

// Update
async function updateTranscript(
  id: string,
  updates: Partial<TranscriptData>
): Promise<void> {
  const stored = await db.transcripts.get(id)
  if (!stored) throw new Error('Transcript not found')

  stored.data = { ...stored.data, ...updates }
  await db.transcripts.put(stored)
}

// Delete
async function deleteTranscript(id: string): Promise<void> {
  await db.transcripts.delete(id)
}

// List all
async function listTranscripts(): Promise<StoredTranscript[]> {
  return db.transcripts.orderBy('createdAt').reverse().toArray()
}
```

### Storage Quota Management

```typescript
async function checkStorageQuota(): Promise<{
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

// Warn user if storage is >80% full
async function warnIfStorageLow(): Promise<void> {
  const { percentage } = await checkStorageQuota()

  if (percentage > 80) {
    console.warn('Storage is running low. Consider deleting old transcripts.')
    // Show UI warning
  }
}
```

---

## Export Formats

### 1. JSON Export

**Format**: Standard JSON with complete transcript data

```typescript
function exportJSON(transcript: TranscriptData): string {
  return JSON.stringify(transcript, null, 2)
}

// Example output:
{
  "id": "abc123...",
  "entries": [
    {
      "id": "entry1",
      "speaker": "Speaker 1",
      "speakerNumber": 1,
      "startTime": 0.0,
      "endTime": 5.2,
      "text": "Hello everyone...",
      "confidence": 0.95
    }
  ],
  "speakers": [...],
  "metadata": {...}
}
```

### 2. SRT Export (SubRip Subtitle Format)

**Format**: Industry-standard subtitle format

```typescript
function exportSRT(transcript: TranscriptData): string {
  return transcript.entries
    .map((entry, index) => {
      const startTime = formatSRTTime(entry.startTime)
      const endTime = formatSRTTime(entry.endTime)
      const speaker = entry.speaker
      const text = entry.text

      return `${index + 1}
${startTime} --> ${endTime}
${speaker}: ${text}
`
    })
    .join('\n')
}

function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)},${pad(ms, 3)}`
}

function pad(num: number, size: number): string {
  return num.toString().padStart(size, '0')
}

// Example output:
1
00:00:00,000 --> 00:00:05,200
Speaker 1: Hello everyone...

2
00:00:05,500 --> 00:00:10,300
Speaker 2: Thanks for having me...
```

### 3. VTT Export (WebVTT Format)

**Format**: Web standard for video captions

```typescript
function exportVTT(transcript: TranscriptData): string {
  const header = 'WEBVTT\n\n'

  const cues = transcript.entries
    .map((entry, index) => {
      const startTime = formatVTTTime(entry.startTime)
      const endTime = formatVTTTime(entry.endTime)
      const speaker = entry.speaker
      const text = entry.text

      return `${index + 1}
${startTime} --> ${endTime}
<v ${speaker}>${text}
`
    })
    .join('\n')

  return header + cues
}

function formatVTTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(secs, 2)}.${pad(ms, 3)}`
}

// Example output:
WEBVTT

1
00:00:00.000 --> 00:00:05.200
<v Speaker 1>Hello everyone...

2
00:00:05.500 --> 00:00:10.300
<v Speaker 2>Thanks for having me...
```

### Export Function

```typescript
type ExportFormat = 'json' | 'srt' | 'vtt'

function exportTranscript(
  transcript: TranscriptData,
  format: ExportFormat
): void {
  let content: string
  let mimeType: string
  let extension: string

  switch (format) {
    case 'json':
      content = exportJSON(transcript)
      mimeType = 'application/json'
      extension = 'json'
      break
    case 'srt':
      content = exportSRT(transcript)
      mimeType = 'text/plain'
      extension = 'srt'
      break
    case 'vtt':
      content = exportVTT(transcript)
      mimeType = 'text/vtt'
      extension = 'vtt'
      break
  }

  // Create download
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = `transcript-${transcript.metadata.fileName}.${extension}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
```

---

## Performance Requirements

### Load Time Targets

- **Initial page load**: < 3 seconds on 10 Mbps connection
- **Component render**: < 100ms for initial render
- **Search results**: < 100ms for filtering 1000+ entries
- **Export generation**: < 2 seconds for 1-hour transcript

### Memory Management

- **Video file**: Keep in memory only during processing
- **Transcript data**: Lazy load for large transcripts (virtualization)
- **IndexedDB**: Paginate transcript library (50 items per page)

### Optimization Strategies

1. **Code splitting**: Lazy load routes and heavy components
2. **Virtualization**: Use `react-window` for long transcript lists
3. **Debouncing**: Search input, window resize events
4. **Memoization**: Expensive computations, derived state
5. **Web Workers**: Audio extraction, large file processing

---

## Security Considerations

### API Key Management

- **Environment variables**: Store Gemini API key in `.env.local`
- **Never commit**: Add `.env.local` to `.gitignore`
- **Client-side exposure**: Understand that client-side API keys are visible
- **Rate limiting**: Implement client-side rate limiting to prevent abuse
- **Future**: Consider backend proxy for production to hide API keys

### Input Validation

- **File type**: Validate MIME type and file extension
- **File size**: Enforce 2GB limit
- **Content sanitization**: Escape user input in transcript editor
- **XSS prevention**: Use React's built-in escaping, avoid `dangerouslySetInnerHTML`

### Data Privacy

- **Client-side only**: Videos never uploaded to your servers
- **Gemini API**: Audio sent to Google (inform users in privacy policy)
- **IndexedDB**: Data stored locally, not synced
- **Clear data**: Provide user option to delete all local data

### CORS & CSP

- **Content Security Policy**: Configure headers for production
- **CORS**: Ensure Gemini API allows your domain (should work for client-side)

---

## Browser Compatibility

### Minimum Requirements

- **Chrome/Edge**: Version 90+ (recommended)
- **Firefox**: Version 88+
- **Safari**: Version 14+
- **Opera**: Version 76+

### Feature Detection

```typescript
function checkBrowserSupport(): { supported: boolean; missing: string[] } {
  const missing: string[] = []

  if (!('indexedDB' in window)) missing.push('IndexedDB')
  if (!('File' in window)) missing.push('File API')
  if (!('Blob' in window)) missing.push('Blob API')
  if (!('MediaRecorder' in window)) missing.push('MediaRecorder API')

  return {
    supported: missing.length === 0,
    missing,
  }
}
```

---

## Environment Variables

```bash
# .env.local (never commit this file!)
VITE_GEMINI_API_KEY=your_api_key_here
VITE_MAX_FILE_SIZE=2147483648  # 2GB in bytes
VITE_ENABLE_ANALYTICS=false
```

Access in code:

```typescript
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const maxFileSize = Number(import.meta.env.VITE_MAX_FILE_SIZE)
```

---

**End of Technical Specifications**

For implementation details for each sprint, refer to individual sprint plans in `/specs/sprints/`.
