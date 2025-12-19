# Video Loading Design Document

**Feature**: Load and Play Previously Transcribed Videos
**Status**: Design Phase
**Priority**: Medium
**Complexity**: Medium-High

---

## 📋 Problem Statement

Currently, when users load a transcript from the library, they can see the transcript text but cannot:

1. View the original video
2. Play the video alongside the transcript
3. Use timestamp-based navigation
4. See the video preview

The `handleLoadTranscript` function (App.tsx:152) is just a TODO placeholder.

---

## 🎯 Goals

1. **Load video with transcript** - When user selects a transcript from library, show the original video
2. **Maintain all functionality** - Video preview, playback, and synchronization should work
3. **Don't break existing flow** - New upload flow remains unchanged
4. **Storage efficiency** - Handle video storage appropriately (client-side vs server-side)

---

## 🏗️ Architecture Options

### Option 1: Client-Side Video Storage (IndexedDB)

**Store video blob in browser's IndexedDB**

```typescript
interface TranscriptData {
  id: string
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata: {
    fileName: string
    fileSize: number
    duration: number
    videoFormat: string
    // ...
  }
  videoBlob?: Blob // NEW: Store actual video file
  videoUrl?: string // NEW: Object URL for playback
}
```

**Pros**:

- ✅ Works completely offline
- ✅ No backend changes needed initially
- ✅ Fast access
- ✅ Privacy-first (video never leaves device)

**Cons**:

- ⚠️ Browser storage limits (50MB-200MB typical)
- ⚠️ Large videos may not fit
- ⚠️ Lost if browser data cleared
- ⚠️ No cross-device access

---

### Option 2: Server-Side Video Storage (PostgreSQL BYTEA or File Storage)

**Store video on backend server**

```typescript
// Backend database schema update
export const videoFiles = pgTable('video_files', {
  id: serial('id').primaryKey(),
  transcriptId: integer('transcript_id').references(() => transcripts.id),
  fileData: 'bytea', // or use file system path
  fileName: varchar('file_name', { length: 255 }),
  fileSize: integer('file_size'),
  mimeType: varchar('mime_type', { length: 100 }),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
})
```

**Pros**:

- ✅ Unlimited storage (server-controlled)
- ✅ Cross-device access
- ✅ Backup and restore
- ✅ No browser limits

**Cons**:

- ⚠️ Requires backend changes
- ⚠️ Upload time for large files
- ⚠️ Storage costs
- ⚠️ Privacy concerns (video on server)

---

### Option 3: Hybrid Approach (Recommended)

**Use IndexedDB first, with optional server backup**

```typescript
interface TranscriptData {
  id: string
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata: {
    fileName: string
    fileSize: number
    duration: number
    videoFormat: string
    // ...
  }
  // Video storage (prioritize in order)
  videoBlob?: Blob // 1. Local blob (fastest)
  videoObjectUrl?: string // 2. Object URL (for playback)
  videoServerUrl?: string // 3. Server URL (fallback)
  hasLocalVideo: boolean // Flag to check if blob exists
  hasServerVideo: boolean // Flag to check if uploaded
}
```

**Storage Strategy**:

1. **Small videos (<25MB)**: Store in IndexedDB
2. **Large videos (>25MB)**: Store only on server (optional upload)
3. **Always store**: Transcript data (small)

**Pros**:

- ✅ Best of both worlds
- ✅ Fast for small videos
- ✅ Scalable for large videos
- ✅ User controls privacy (optional upload)

---

## 💡 Recommended Implementation

### Phase 1: Client-Side Only (Quickest to implement)

**Step 1: Update TranscriptData Type**

```typescript
// src/types/transcript.ts
export interface TranscriptData {
  id: string
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata: {
    fileName: string
    fileSize: number
    duration: number
    videoFormat: string
    createdAt: string
    processedAt: string
    model: string
  }
  // NEW: Video storage
  videoBlob?: Blob
  videoMetadata?: VideoMetadata
}
```

**Step 2: Update Save Logic**

```typescript
// src/hooks/useTranscription.ts
async function saveTranscript(file: File, transcriptData: TranscriptData) {
  // Store transcript + video blob
  const transcriptWithVideo: TranscriptData = {
    ...transcriptData,
    videoBlob: file, // Store original file
    videoMetadata: {
      duration: metadata.duration,
      format: metadata.format,
      // ... other metadata
    },
  }

  // Save to IndexedDB
  await db.transcripts.put(transcriptWithVideo)
}
```

**Step 3: Implement Load Logic**

```typescript
// src/App.tsx
const [loadedVideo, setLoadedVideo] = useState<{
  file: File
  metadata: VideoMetadata
} | null>(null)

const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
  // Set the transcript
  setDemoTranscript(loadedTranscript)

  // If video blob exists, reconstruct File object
  if (loadedTranscript.videoBlob && loadedTranscript.videoMetadata) {
    const videoFile = new File(
      [loadedTranscript.videoBlob],
      loadedTranscript.metadata.fileName,
      { type: `video/${loadedTranscript.metadata.videoFormat}` }
    )

    setVideoFile(videoFile)
    setVideoMetadata(loadedTranscript.videoMetadata)
  }

  setShowLibrary(false)
}
```

**Step 4: Update VideoPreview Component**

```typescript
// src/components/VideoPreview.tsx
export function VideoPreview({
  file,
  metadata,
  onRemove,
  isLoaded = false, // NEW: Flag to indicate loaded vs newly uploaded
}: VideoPreviewProps) {
  // ... existing code

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3>{isLoaded ? "Loaded Video" : "Uploaded Video"}</h3>
          <Button onClick={onRemove}>Remove</Button>
        </div>
      </CardHeader>
      {/* ... rest of component */}
    </Card>
  )
}
```

---

## 📊 Data Flow Diagram

### Upload Flow (Existing)

```
User uploads video
  ↓
Extract metadata
  ↓
Extract audio
  ↓
Transcribe with Gemini
  ↓
Save transcript + video blob to IndexedDB
  ↓
Display transcript + video preview
```

### Load Flow (New)

```
User clicks transcript in library
  ↓
Fetch transcript from IndexedDB (includes videoBlob)
  ↓
Reconstruct File object from Blob
  ↓
Set videoFile + videoMetadata state
  ↓
Display transcript + video preview
```

---

## 🔄 State Management Changes

### Current State (App.tsx)

```typescript
const [videoFile, setVideoFile] = useState<File | null>(null)
const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
const [demoTranscript, setDemoTranscript] = useState<TranscriptData | null>(
  null
)
```

### NEW: Add Source Tracking

```typescript
const [videoSource, setVideoSource] = useState<'upload' | 'loaded' | 'demo'>(
  'upload'
)

// When uploading new video
const handleVideoUpload = async (file: File) => {
  setVideoSource('upload')
  // ... rest of code
}

// When loading from library
const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
  setVideoSource('loaded')
  // ... rest of code
}

// When loading demo
const loadDemoTranscript = () => {
  setVideoSource('demo')
  // ... rest of code
}
```

---

## 🎨 UI/UX Considerations

### Video Preview States

**1. Newly Uploaded Video**

```
┌─────────────────────────────┐
│  📹 Upload Video           │
│  ✅ Video uploaded         │
│  [Play Button] [Remove]    │
│  Duration: 0:03            │
└─────────────────────────────┘
```

**2. Loaded from Library**

```
┌─────────────────────────────┐
│  📂 Loaded Video           │
│  ✅ Video loaded from      │
│     library                │
│  [Play Button] [Remove]    │
│  Duration: 0:03            │
│  Transcribed: 2 days ago   │
└─────────────────────────────┘
```

**3. No Video Available (Transcript only)**

```
┌─────────────────────────────┐
│  📄 Transcript Only        │
│  ⚠️  Original video not    │
│     available              │
│  [Upload Video] button     │
└─────────────────────────────┘
```

### Processing Status Updates

**When loading transcript:**

```
┌─────────────────────────────┐
│  🔄 Processing Status      │
│  ✅ Loading transcript     │
│  ✅ Video restored         │
│  [Process Another Video]   │
└─────────────────────────────┘
```

---

## 🧪 Testing Requirements

### Unit Tests

- [ ] TranscriptData with videoBlob serializes correctly
- [ ] File reconstruction from Blob works
- [ ] VideoMetadata is preserved
- [ ] State updates correctly

### Integration Tests

- [ ] Load transcript → Video appears in preview
- [ ] Play loaded video → Playback works
- [ ] Click timestamp → Seeks correctly
- [ ] Remove loaded video → Clears state

### Edge Cases

- [ ] Load transcript without video blob
- [ ] Load very large video (>50MB)
- [ ] Browser storage quota exceeded
- [ ] Corrupted video blob

---

## 📝 Implementation Checklist

### Phase 1: Basic Video Loading (1-2 days)

- [ ] **Task 1.1**: Update `TranscriptData` interface
  - Add `videoBlob?: Blob`
  - Add `videoMetadata?: VideoMetadata`
  - Update type exports

- [ ] **Task 1.2**: Update `useTranscription` hook
  - Include video blob when saving
  - Store in IndexedDB

- [ ] **Task 1.3**: Implement `handleLoadTranscript`
  - Reconstruct File from Blob
  - Set video state
  - Set transcript state
  - Handle missing video gracefully

- [ ] **Task 1.4**: Update `VideoPreview` component
  - Add `isLoaded` prop
  - Update UI to show "Loaded" state
  - Add timestamp for when transcribed

- [ ] **Task 1.5**: Update `ProcessingStatus`
  - Show "Loaded" state
  - Skip "Uploading" step
  - Show transcript age

### Phase 2: Storage Optimization (1 day)

- [ ] **Task 2.1**: Implement size checking
  - Check video file size before storing
  - Warn if >25MB
  - Offer option to skip video storage

- [ ] **Task 2.2**: Add storage quota checking
  - Use `navigator.storage.estimate()`
  - Show available space
  - Handle quota exceeded errors

### Phase 3: Server-Side Storage (Optional, 2-3 days)

- [ ] **Task 3.1**: Backend video upload endpoint
  - POST `/api/transcripts/:id/video`
  - Store video file
  - Return video URL

- [ ] **Task 3.2**: Backend video download endpoint
  - GET `/api/transcripts/:id/video`
  - Stream video file
  - Support range requests

- [ ] **Task 3.3**: Update frontend to use server
  - Upload to server after transcription
  - Download when loading
  - Show upload progress

---

## 🚨 Potential Issues & Solutions

### Issue 1: IndexedDB Storage Limits

**Problem**: Videos might exceed browser storage quota

**Solution**:

```typescript
async function checkStorageQuota(fileSize: number): Promise<boolean> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate()
    const available = (estimate.quota || 0) - (estimate.usage || 0)
    return fileSize < available
  }
  return true // Assume okay if API not available
}

// Before saving:
if (!(await checkStorageQuota(file.size))) {
  // Show warning: "Video too large for local storage"
  // Offer: "Save transcript only" or "Upload to server"
}
```

### Issue 2: Object URL Memory Leaks

**Problem**: Creating Object URLs without revoking causes memory leaks

**Solution**:

```typescript
useEffect(() => {
  if (videoBlob) {
    const url = URL.createObjectURL(videoBlob)
    setVideoObjectUrl(url)

    // Cleanup on unmount
    return () => {
      URL.revokeObjectURL(url)
    }
  }
}, [videoBlob])
```

### Issue 3: Missing Video After Storage

**Problem**: Video blob lost if browser data cleared

**Solution**:

```typescript
const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
  if (!loadedTranscript.videoBlob) {
    // Show UI: "Video not available"
    // Offer option: "Upload video again"
    setVideoMissing(true)
  }
}
```

---

## 🎯 Success Criteria

**Feature is complete when:**

- ✅ User can load transcript from library
- ✅ Original video appears in preview
- ✅ Video plays correctly
- ✅ Timestamp navigation works
- ✅ All existing functionality preserved
- ✅ Works for videos under size limit
- ✅ Gracefully handles missing videos
- ✅ Storage quota is checked
- ✅ Tests passing

---

## 📚 Related Files to Modify

1. **Types**
   - `src/types/transcript.ts` - Add video fields

2. **Hooks**
   - `src/hooks/useTranscription.ts` - Save video blob

3. **Components**
   - `src/App.tsx` - Implement load logic
   - `src/components/VideoPreview.tsx` - Handle loaded state
   - `src/components/ProcessingStatus.tsx` - Show loaded status

4. **Services**
   - `src/services/database.ts` - Store/retrieve video blobs (if using IndexedDB)

5. **Backend (Optional)**
   - `server/src/routes/transcripts.ts` - Video upload/download routes
   - `server/src/controllers/transcriptionController.ts` - Video handling

---

## 📅 Timeline

- **Phase 1** (Basic): 1-2 days
- **Phase 2** (Optimization): 1 day
- **Phase 3** (Server): 2-3 days (optional)

**Total**: 2-6 days depending on scope

---

## 🚀 Quick Start Implementation

For immediate functionality, implement Phase 1 only:

1. Add `videoBlob?: Blob` to TranscriptData
2. Save video blob with transcript
3. Reconstruct File when loading
4. Update UI to show loaded state

This gives you working video loading in ~2 days!

---

**Document Version**: 1.0
**Created**: December 18, 2025
**Status**: Design Phase - Ready for Implementation
