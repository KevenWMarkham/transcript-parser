# Video Playback Integration Plan

**Goal**: Add video playback without breaking existing functionality
**Status**: Design Phase
**Related**: Sprint 6 (Original) - Video Playback Sync

---

## 🎯 What You Want

1. **Play the uploaded video** - Click to open video player
2. **Sync with transcript** - Click transcript entry → video jumps to that timestamp
3. **Keep everything working** - Don't break transcription, export, or any other features

---

## ✅ What Already Exists

### Components Ready to Use

- ✅ **VideoPlayerModal** - Full-featured video player with keyboard shortcuts
- ✅ **VideoPreview** - Shows video thumbnail and metadata
- ✅ **TranscriptList** - Displays transcript entries
- ✅ **Video file state** - Already stored in `App.tsx`

### What's Missing

- ❌ No "Play Video" button
- ❌ Transcript entries don't link to video timestamps
- ❌ No way to open VideoPlayerModal
- ❌ No click-to-seek functionality

---

## 🏗️ Architecture Plan (Non-Breaking Changes)

### Step 1: Add Video Player State to App.tsx

**Current State**:

```typescript
// App.tsx (line 35)
const [videoFile, setVideoFile] = useState<File | null>(null)
const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
```

**Add**:

```typescript
// NEW: Video player modal state
const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)

// Create object URL when video is uploaded
useEffect(() => {
  if (videoFile) {
    const url = URL.createObjectURL(videoFile)
    setVideoObjectUrl(url)
    return () => URL.revokeObjectURL(url) // Cleanup
  }
}, [videoFile])
```

### Step 2: Add "Play Video" Button to VideoPreview

**Current**: VideoPreview only shows metadata

**Add** (VideoPreview.tsx):

```typescript
interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
  onPlayVideo?: () => void  // ← NEW: Optional callback
}

// In the render:
<div className="flex gap-2">
  {onPlayVideo && (
    <Button onClick={onPlayVideo} className="flex-1">
      <Play className="w-4 h-4 mr-2" />
      Play Video
    </Button>
  )}
  <Button variant="outline" onClick={onRemove}>
    <X className="w-4 h-4 mr-2" />
    Remove
  </Button>
</div>
```

### Step 3: Integrate VideoPlayerModal in App.tsx

**Add to App.tsx render** (after line 303):

```typescript
{/* Video Player Modal */}
{videoFile && videoObjectUrl && (
  <VideoPlayerModal
    isOpen={isVideoPlayerOpen}
    onClose={() => setIsVideoPlayerOpen(false)}
    videoFile={videoFile}
    videoUrl={videoObjectUrl}
    fileName={videoFile.name}
  />
)}
```

**Update VideoPreview usage** (line 268):

```typescript
<VideoPreview
  file={videoFile}
  metadata={videoMetadata!}
  onRemove={handleRemoveVideo}
  onPlayVideo={() => setIsVideoPlayerOpen(true)}  // ← NEW
/>
```

### Step 4: Add Timestamp Navigation (Click-to-Seek)

**Option A: Modal Video Player** (Current approach)

- User clicks transcript entry
- Opens video modal at that timestamp

**Option B: Inline Video Player** (More complex)

- Video player always visible next to transcript
- Real-time sync as video plays

**Recommended**: Start with Option A (simpler, non-breaking)

**Implementation**:

```typescript
// App.tsx - Add new state
const [seekToTime, setSeekToTime] = useState<number | null>(null)

// Add handler
const handleSeekToTimestamp = (timestamp: number) => {
  setSeekToTime(timestamp)
  setIsVideoPlayerOpen(true)
}

// Update TranscriptView usage (line 288)
<TranscriptView
  transcript={demoTranscript || transcript}
  onExport={() => console.log('Transcript exported')}
  onSeekToTimestamp={handleSeekToTimestamp}  // ← NEW
  hasVideo={!!videoFile}  // ← NEW: Show play icons only if video exists
/>
```

**Update VideoPlayerModal** to accept initial time:

```typescript
interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoFile: File
  videoUrl: string
  fileName: string
  initialTime?: number // ← NEW
}

// In useEffect:
useEffect(() => {
  if (isOpen && videoRef.current && initialTime !== undefined) {
    videoRef.current.currentTime = initialTime
  }
}, [isOpen, initialTime])
```

### Step 5: Update TranscriptList for Click-to-Seek

**TranscriptList.tsx** - Add click handler:

```typescript
interface TranscriptListProps {
  entries: TranscriptEntry[]
  speakers: Speaker[]
  searchQuery?: string
  selectedIndex?: number
  onEntryEdit?: (entryId: string, field: string, value: any) => void
  editedEntries?: Set<string>
  enableEditing?: boolean
  onSeekToTimestamp?: (timestamp: number) => void  // ← NEW
  hasVideo?: boolean  // ← NEW
}

// In entry rendering:
<div
  className="transcript-entry"
  onClick={() => {
    if (hasVideo && onSeekToTimestamp) {
      onSeekToTimestamp(entry.startTime)
    }
  }}
  style={{ cursor: hasVideo ? 'pointer' : 'default' }}
>
  {/* Timestamp badge - make it clickable */}
  <Badge
    className="timestamp-badge"
    title={hasVideo ? "Click to play video at this timestamp" : undefined}
  >
    {formatTimestamp(entry.startTime)}
    {hasVideo && <Play className="w-3 h-3 ml-1" />}
  </Badge>

  {/* Entry text */}
  <p>{entry.text}</p>
</div>
```

---

## 🎨 UI/UX Flow

### User Journey 1: Play Full Video

```
1. User uploads video
   ↓
2. Transcription completes
   ↓
3. User clicks "Play Video" button in VideoPreview
   ↓
4. VideoPlayerModal opens
   ↓
5. Video plays from start
```

### User Journey 2: Jump to Timestamp

```
1. User reads transcript
   ↓
2. User clicks timestamp badge or entry
   ↓
3. VideoPlayerModal opens at that timestamp
   ↓
4. Video plays from clicked timestamp
```

### User Journey 3: Keyboard Navigation

```
1. Video is playing in modal
   ↓
2. User presses Space → Pause/Play
3. User presses ← → → Seek ±5s
4. User presses F → Fullscreen
5. User presses ESC → Close modal
```

---

## 📊 Component Interaction Diagram

```
App.tsx (State Management)
├── videoFile
├── isVideoPlayerOpen
├── seekToTime
└── handleSeekToTimestamp()
     │
     ├──> VideoPreview
     │    └── "Play Video" button → Opens modal
     │
     ├──> TranscriptView
     │    └── Passes onSeekToTimestamp to TranscriptList
     │         └── TranscriptList
     │              └── Click entry → Calls onSeekToTimestamp(timestamp)
     │
     └──> VideoPlayerModal
          └── Opens at seekToTime, plays video
```

---

## 🔧 Implementation Checklist

### Phase 1: Basic Video Playback (30 min)

- [ ] Add `isVideoPlayerOpen` state to App.tsx
- [ ] Add `videoObjectUrl` state with cleanup
- [ ] Add `onPlayVideo` prop to VideoPreview
- [ ] Add "Play Video" button to VideoPreview
- [ ] Render VideoPlayerModal in App.tsx
- [ ] Test: Click "Play Video" → Modal opens → Video plays

### Phase 2: Timestamp Navigation (1 hour)

- [ ] Add `seekToTime` state to App.tsx
- [ ] Add `handleSeekToTimestamp` function
- [ ] Add `initialTime` prop to VideoPlayerModal
- [ ] Implement seek on modal open
- [ ] Pass `onSeekToTimestamp` to TranscriptView
- [ ] Update TranscriptView to pass it to TranscriptList
- [ ] Test: Should compile but not functional yet

### Phase 3: Clickable Transcript Entries (1 hour)

- [ ] Add `onSeekToTimestamp` prop to TranscriptList
- [ ] Add `hasVideo` prop to TranscriptList
- [ ] Make timestamp badges clickable
- [ ] Add play icon to timestamps when video exists
- [ ] Add hover effect to indicate clickability
- [ ] Test: Click timestamp → Video opens at that time

### Phase 4: Polish & UX (30 min)

- [ ] Add loading state for video
- [ ] Add tooltip "Click to play at this timestamp"
- [ ] Style active/playing entry differently
- [ ] Add visual feedback on click
- [ ] Test all keyboard shortcuts
- [ ] Test on different browsers

---

## 🚨 What NOT to Change (Avoid Breaking)

### ❌ Don't Touch These

- `useTranscription` hook - Transcription logic
- `GeminiClient` - AI integration
- `AudioExtractor` / `FFmpegExtractor` - Audio processing
- `ExportDialog` - Export functionality
- Database schema - Backend integration

### ✅ Safe to Modify

- `App.tsx` - Add state and handlers
- `VideoPreview.tsx` - Add play button
- `VideoPlayerModal.tsx` - Add initialTime prop
- `TranscriptView.tsx` - Add onSeekToTimestamp prop
- `TranscriptList.tsx` - Add click handlers
- CSS/styling - Visual improvements

---

## 🧪 Testing Strategy

### Manual Tests

1. **Upload video** → Should work as before
2. **Click "Play Video"** → Modal opens, video plays
3. **Click timestamp** → Video jumps to that time
4. **Press Space** → Video pauses/plays
5. **Press ESC** → Modal closes
6. **Remove video** → Everything clears correctly
7. **Upload new video** → Old video cleaned up

### Edge Cases

- [ ] Upload video without clicking play → Should not break
- [ ] Click timestamp before video upload → Handle gracefully
- [ ] Click timestamp for demo transcript (no video) → No action
- [ ] Close modal mid-playback → Video stops correctly
- [ ] Open modal twice → No memory leaks

### Regression Tests

- [ ] Transcription still works
- [ ] Export still works
- [ ] Search/filter still works
- [ ] Demo transcript still loads
- [ ] Authentication still works

---

## 💡 Code Snippets (Copy-Paste Ready)

### 1. App.tsx - Add State (after line 52)

```typescript
// Video player state
const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)
const [seekToTime, setSeekToTime] = useState<number | null>(null)

// Create and cleanup video object URL
useEffect(() => {
  if (videoFile) {
    const url = URL.createObjectURL(videoFile)
    setVideoObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  } else {
    setVideoObjectUrl(null)
  }
}, [videoFile])

// Handle seek to timestamp
const handleSeekToTimestamp = useCallback((timestamp: number) => {
  setSeekToTime(timestamp)
  setIsVideoPlayerOpen(true)
}, [])

// Reset seek time when modal closes
const handleVideoPlayerClose = useCallback(() => {
  setIsVideoPlayerOpen(false)
  setSeekToTime(null)
}, [])
```

### 2. App.tsx - Update VideoPreview (line ~268)

```typescript
<VideoPreview
  file={videoFile}
  metadata={videoMetadata!}
  onRemove={handleRemoveVideo}
  onPlayVideo={() => setIsVideoPlayerOpen(true)}
/>
```

### 3. App.tsx - Add VideoPlayerModal (after line 303)

```typescript
{/* Video Player Modal */}
{videoFile && videoObjectUrl && (
  <VideoPlayerModal
    isOpen={isVideoPlayerOpen}
    onClose={handleVideoPlayerClose}
    videoFile={videoFile}
    videoUrl={videoObjectUrl}
    fileName={videoFile.name}
    initialTime={seekToTime ?? undefined}
  />
)}
```

### 4. App.tsx - Update TranscriptView (line ~288)

```typescript
<TranscriptView
  transcript={demoTranscript || transcript}
  onExport={() => console.log('Transcript exported')}
  onSeekToTimestamp={videoFile ? handleSeekToTimestamp : undefined}
  hasVideo={!!videoFile}
/>
```

### 5. VideoPreview.tsx - Add Play Button

```typescript
// Update interface
interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
  onPlayVideo?: () => void
}

// Add in render (after metadata section)
<div className="flex gap-2 mt-4">
  {onPlayVideo && !isAudio && (
    <Button onClick={onPlayVideo} className="flex-1">
      <Play className="w-4 h-4 mr-2" />
      Play Video
    </Button>
  )}
  <Button
    variant={onPlayVideo ? "outline" : "default"}
    onClick={onRemove}
  >
    <X className="w-4 h-4 mr-2" />
    Remove
  </Button>
</div>
```

---

## 📅 Timeline

- **Phase 1**: 30 minutes (Basic playback)
- **Phase 2**: 1 hour (Timestamp navigation setup)
- **Phase 3**: 1 hour (Clickable transcripts)
- **Phase 4**: 30 minutes (Polish)

**Total**: ~3 hours for full implementation

---

## 🎯 Success Criteria

**Feature complete when:**

- ✅ "Play Video" button appears in VideoPreview
- ✅ Clicking button opens video in modal
- ✅ Video plays correctly
- ✅ Timestamp badges are clickable (when video exists)
- ✅ Clicking timestamp opens video at that time
- ✅ Keyboard shortcuts work
- ✅ All existing features still work
- ✅ No console errors
- ✅ No memory leaks

---

## 🚀 Quick Start (Step-by-Step)

1. **Copy code from snippet #1** → Paste in App.tsx after line 52
2. **Copy code from snippet #3** → Paste in App.tsx after line 303
3. **Copy code from snippet #4** → Replace existing TranscriptView call
4. **Copy code from snippet #5** → Update VideoPreview.tsx
5. **Test it!**

The most basic version (just "Play Video" button) takes **10 minutes** to implement!

---

**Document Version**: 1.0
**Created**: December 18, 2025
**Status**: Ready for Implementation
**Estimated Time**: 30 min - 3 hours depending on features wanted
