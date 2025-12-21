# Sprint 6: Video Playback & Timestamp Synchronization

**Duration**: 2 weeks (Weeks 11-12)
**Sprint Goal**: Implement video player with transcript synchronization - click transcript to seek video, playing video highlights current segment.

---

## Sprint Objectives

1. Create VideoPlayer component with HTML5 video
2. Implement bidirectional sync (transcript ↔ video)
3. Auto-highlight current transcript segment during playback
4. Add seek functionality from transcript clicks
5. Working demo with fully synchronized playback

---

## User Stories

### Story 1: Video Playback

**As a** user
**I want to** play my uploaded video alongside the transcript
**So that** I can listen while reading

**Acceptance Criteria**:

- [ ] Video displays with standard controls (play, pause, seek, volume)
- [ ] Video maintains aspect ratio
- [ ] Playback position synchronized with transcript
- [ ] Current time displayed

### Story 2: Click to Seek

**As a** user
**I want to** click a transcript segment to jump to that point in the video
**So that** I can quickly navigate to specific parts

**Acceptance Criteria**:

- [ ] Clicking transcript entry seeks video to startTime
- [ ] Video begins playing from that position
- [ ] Clicked segment highlighted
- [ ] Smooth seeking without lag

### Story 3: Auto-highlight During Playback

**As a** user
**I want** the current transcript segment to be highlighted as the video plays
**So that** I can follow along easily

**Acceptance Criteria**:

- [ ] Current segment highlighted with distinct styling
- [ ] Highlight updates in real-time (< 500ms lag)
- [ ] Auto-scrolls to keep current segment visible
- [ ] Works for all playback speeds

---

## Technical Tasks

### Task 6.1: VideoPlayer Component

**Estimated Effort**: 2 days

```typescript
// src/components/VideoPlayer.tsx

interface VideoPlayerProps {
  videoFile: File
  currentTime?: number
  onTimeUpdate?: (time: number) => void
  onSeeking?: () => void
  onSeeked?: () => void
}

export function VideoPlayer({
  videoFile,
  currentTime,
  onTimeUpdate,
  onSeeking,
  onSeeked
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrl = useMemo(() => URL.createObjectURL(videoFile), [videoFile])

  useEffect(() => {
    return () => URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('seeking', () => onSeeking?.())
    video.addEventListener('seeked', () => onSeeked?.())

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [onTimeUpdate, onSeeking, onSeeked])

  // Programmatic seek
  useImperativeHandle(ref, () => ({
    seekTo: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time
        videoRef.current.play()
      }
    }
  }))

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full rounded-lg"
      />
    </div>
  )
}
```

### Task 6.2: Transcript-Video Sync Logic

**Estimated Effort**: 2 days

```typescript
// src/hooks/useTranscriptSync.ts

export function useTranscriptSync(transcript: TranscriptData) {
  const [currentSegmentId, setCurrentSegmentId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)

  const findCurrentSegment = useCallback(
    (time: number): TranscriptEntry | null => {
      return (
        transcript.entries.find(
          entry => time >= entry.startTime && time <= entry.endTime
        ) || null
      )
    },
    [transcript]
  )

  const handleTimeUpdate = useCallback(
    (time: number) => {
      setCurrentTime(time)

      const segment = findCurrentSegment(time)
      if (segment && segment.id !== currentSegmentId) {
        setCurrentSegmentId(segment.id)
      }
    },
    [findCurrentSegment, currentSegmentId]
  )

  const seekToSegment = useCallback(
    (segmentId: string) => {
      const segment = transcript.entries.find(e => e.id === segmentId)
      if (segment) {
        return segment.startTime
      }
      return null
    },
    [transcript]
  )

  return {
    currentSegmentId,
    currentTime,
    handleTimeUpdate,
    seekToSegment,
  }
}
```

### Task 6.3: Auto-scroll to Current Segment

**Estimated Effort**: 1 day

```typescript
// Add to TranscriptList component

useEffect(() => {
  if (highlightedId && parentRef.current) {
    const highlightedElement = parentRef.current.querySelector(
      `[data-segment-id="${highlightedId}"]`
    )

    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }
}, [highlightedId])
```

### Task 6.4: Integration

**Estimated Effort**: 2 days

```typescript
// src/App.tsx integration

export default function App() {
  const videoPlayerRef = useRef<VideoPlayerHandle>(null)
  const {
    currentSegmentId,
    handleTimeUpdate,
    seekToSegment
  } = useTranscriptSync(transcript)

  const handleSegmentClick = (segmentId: string) => {
    const time = seekToSegment(segmentId)
    if (time !== null && videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(time)
    }
  }

  return (
    <div className="app">
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <VideoPlayer
            ref={videoPlayerRef}
            videoFile={videoFile}
            onTimeUpdate={handleTimeUpdate}
          />
        </div>

        <div>
          <TranscriptList
            entries={transcript.entries}
            highlightedId={currentSegmentId}
            onEntryClick={handleSegmentClick}
          />
        </div>
      </div>
    </div>
  )
}
```

### Task 6.5: Testing

**Estimated Effort**: 3 days

**Test Cases**:

- Video player controls work correctly
- Clicking transcript seeks video
- Time updates highlight correct segment
- Auto-scroll keeps current segment visible
- Works with different video formats
- Performance test (no lag during playback)

---

## Definition of Done

- [ ] Video player functional with all controls
- [ ] Bidirectional sync working smoothly
- [ ] Auto-highlight and auto-scroll implemented
- [ ] Test coverage ≥ 80%
- [ ] **Working demo**: Play video, click transcript to seek, see auto-highlight
- [ ] No performance issues or lag

---

## Demo

1. Upload video and generate transcript
2. Play video → Show auto-highlighting of current segment
3. Click different transcript segments → Video seeks correctly
4. Show auto-scroll keeping current segment visible
5. Test with different playback speeds

---

**Sprint 6 Plan Version**: 1.0
