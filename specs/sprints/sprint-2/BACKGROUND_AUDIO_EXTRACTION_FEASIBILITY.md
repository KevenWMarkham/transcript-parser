# Background Audio Extraction - Feasibility Analysis

**Date:** 2025-12-17
**Feature Request:** Enable video playback while simultaneously extracting audio in the background (VLC-like behavior)
**Status:** Feasible with Caveats ⚠️

---

## Executive Summary

**Feasibility: MEDIUM-HIGH (70% feasible)**

This feature is technically possible with the current browser APIs, but has significant limitations due to browser codec compatibility issues. The implementation would work well for compatible videos but may still fail for certain codec combinations.

**Recommendation:** Implement with clear UX handling of codec failures, emphasizing audio file uploads as the primary workflow.

---

## Current Implementation Analysis

### How Audio Extraction Currently Works

1. **Video loads** → Creates `<video>` element with `URL.createObjectURL(file)`
2. **Play-pause trick** → Plays video briefly to enable `captureStream()`
3. **Capture stream** → Uses `video.captureStream()` to get MediaStream
4. **Record audio** → MediaRecorder records audio track while video plays (muted)
5. **Progress tracking** → Updates UI based on `video.currentTime / duration`
6. **Blob creation** → Combines recorded chunks into audio blob (WebM/Opus)

### Key Limitation: MediaRecorder Codec Compatibility

**The problem:** MediaRecorder cannot record from video streams with certain audio codecs:

- ❌ AC-3 (Dolby Digital) - Not supported
- ❌ E-AC-3 (Dolby Digital Plus) - Not supported
- ❌ DTS - Not supported
- ✅ AAC - Usually works
- ✅ Opus - Works well
- ✅ Vorbis - Works well

**User's video had AC-3 audio** → MediaRecorder failed with "Failed to start" error

---

## Proposed Implementation

### Architecture: Dual Video Elements

**Concept:** Use two separate `<video>` elements:

1. **Visible video player** - User watches and controls playback
2. **Hidden video element** - Extracts audio in background at 2x-4x speed

```typescript
// VideoPreview.tsx - User-facing player
<video
  src={mediaUrl}
  controls
  className="w-full max-h-96"
/>

// AudioExtractor.ts - Background extraction
<video
  src={sameMediaUrl}
  muted
  hidden
  playbackRate={2.0}  // 2x speed extraction
/>
```

### Workflow

```
User uploads video
    ↓
VideoPreview displays → User watches video
    ↓                        ↓
    ↓                   (controls playback)
    ↓
AudioExtractor starts in background
    ↓
Video plays at 2x speed (hidden, muted)
    ↓
MediaRecorder captures audio stream
    ↓
Progress: "Extracting audio... 45%"
    ↓
Audio extraction complete
    ↓
Transcript button enabled → User clicks
    ↓
Gemini transcription starts (audio already ready)
```

---

## Technical Implementation Details

### 1. Background Extraction Service

**Modify AudioExtractor.ts:**

```typescript
export class AudioExtractor {
  async extractAudioInBackground(
    videoFile: File,
    options?: AudioExtractionOptions & { playbackRate?: number }
  ): Promise<Blob> {
    const { playbackRate = 2.0, onProgress } = options || {}

    // Create hidden video element
    const video = document.createElement('video')
    video.src = URL.createObjectURL(videoFile)
    video.muted = true
    video.hidden = true
    video.playbackRate = playbackRate // 2x speed extraction

    // Rest of current extraction logic...
    // Stream capture, MediaRecorder, etc.
  }
}
```

**Benefits:**

- User sees video preview immediately
- Audio extraction happens 2x faster (2x playback rate)
- User can watch video while waiting for transcription

**Limitations:**

- Still fails on incompatible codecs (AC-3, DTS, etc.)
- Requires enough memory for two video instances
- Extraction speed limited by codec decode performance

### 2. UI/UX Changes

**VideoPreview.tsx:**

```typescript
export function VideoPreview({ file, metadata, onRemove }: VideoPreviewProps) {
  const [extractionProgress, setExtractionProgress] = useState(0)
  const [audioReady, setAudioReady] = useState(false)

  useEffect(() => {
    if (!isAudioFile(file)) {
      // Start background extraction
      const extractor = new AudioExtractor()
      extractor.extractAudioInBackground(file, {
        playbackRate: 2.0,
        onProgress: setExtractionProgress
      }).then(audioBlob => {
        setAudioReady(true)
        // Store blob for later transcription
      })
    }
  }, [file])

  return (
    <Card>
      {/* Video player - plays normally */}
      <video src={mediaUrl} controls />

      {/* Extraction status */}
      {!audioReady && (
        <div>Extracting audio... {extractionProgress}%</div>
      )}

      {/* Transcript button - enabled when ready */}
      <Button disabled={!audioReady} onClick={startTranscription}>
        Start Transcription
      </Button>
    </Card>
  )
}
```

---

## Codec Compatibility Challenge

### The Core Problem

**Browser video playback** supports many codecs (H.264, H.265, VP9, etc.)
**MediaRecorder API** supports far fewer codecs (mainly Opus, AAC, Vorbis)

**This creates a gap:**

- Video plays fine in `<video>` element ✅
- BUT MediaRecorder can't record its audio ❌

### Example: User's Video

**Video Codec:** H.265 (HEVC)

- Browser: ✅ Can decode and play
- MediaRecorder: ✅ Can capture (works with most video codecs)

**Audio Codec:** AC-3 (Dolby Digital)

- Browser: ✅ Can decode and play
- MediaRecorder: ❌ **CANNOT record** (incompatible codec)

**Result:** Video plays perfectly, but extraction fails

### Codec Compatibility Matrix

| Audio Codec | Browser Playback | MediaRecorder     | Gemini API |
| ----------- | ---------------- | ----------------- | ---------- |
| **AAC**     | ✅               | ✅ (Chrome, Edge) | ✅         |
| **Opus**    | ✅               | ✅                | ✅         |
| **Vorbis**  | ✅               | ✅                | ✅         |
| **MP3**     | ✅               | ⚠️ (limited)      | ✅         |
| **AC-3**    | ✅               | ❌                | N/A        |
| **E-AC-3**  | ✅               | ❌                | N/A        |
| **DTS**     | ⚠️               | ❌                | N/A        |

---

## Solutions to Codec Issues

### Option 1: Client-Side Transcoding (DIFFICULT)

**Use FFmpeg.wasm to transcode audio client-side:**

```typescript
import { createFFmpeg } from '@ffmpeg/ffmpeg'

async function transcodeAudio(videoFile: File): Promise<Blob> {
  const ffmpeg = createFFmpeg({ log: true })
  await ffmpeg.load()

  // Write video file
  ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile))

  // Extract and transcode audio to AAC
  await ffmpeg.run('-i', 'input.mp4', '-vn', '-acodec', 'aac', 'output.m4a')

  // Read output
  const data = ffmpeg.FS('readFile', 'output.m4a')
  return new Blob([data.buffer], { type: 'audio/mp4' })
}
```

**Pros:**

- ✅ Works with ANY audio codec
- ✅ Produces Gemini-compatible audio
- ✅ No server-side processing needed

**Cons:**

- ❌ Large bundle size (~25MB for FFmpeg.wasm)
- ❌ Slow processing (CPU-intensive in browser)
- ❌ High memory usage
- ❌ Complex implementation
- ❌ May still fail on very large files

**Verdict:** Technically feasible but poor UX (slow, heavy)

### Option 2: Server-Side Transcoding (BEST, but requires backend)

**Upload video to backend, transcode with FFmpeg on server:**

```typescript
// Client
async function uploadForTranscription(videoFile: File) {
  const formData = new FormData()
  formData.append('video', videoFile)

  const response = await fetch('/api/extract-audio', {
    method: 'POST',
    body: formData,
  })

  return response.blob() // Get AAC audio back
}

// Server (Node.js + FFmpeg)
app.post('/api/extract-audio', upload.single('video'), async (req, res) => {
  const videoPath = req.file.path
  const audioPath = `${videoPath}.m4a`

  await exec(`ffmpeg -i "${videoPath}" -vn -acodec aac "${audioPath}"`)

  res.sendFile(audioPath)
})
```

**Pros:**

- ✅ Works with ANY audio codec
- ✅ Fast (server-side FFmpeg)
- ✅ No client bundle bloat
- ✅ Reliable and battle-tested

**Cons:**

- ❌ Requires backend infrastructure
- ❌ Video upload bandwidth (could be large files)
- ❌ Server storage and processing costs
- ❌ Adds latency (upload + processing time)

**Verdict:** Best solution but out of scope for MVP (no backend)

### Option 3: Detect and Guide User (CURRENT APPROACH ✅)

**Detect incompatible videos and guide users to upload audio files:**

```typescript
try {
  const audioBlob = await audioExtractor.extractAudio(file)
  // Success - proceed to transcription
} catch (error) {
  if (error.code === 'RECORDER_START_ERROR') {
    // Show friendly error message
    setError(
      "This video's audio codec is not compatible with browser extraction. " +
        'Please extract audio using VLC (File > Convert > Audio - MP3) and upload the MP3 file instead.'
    )
  }
}
```

**Pros:**

- ✅ Simple implementation
- ✅ No additional dependencies
- ✅ Works perfectly for compatible videos
- ✅ Audio files (MP3, WAV) work 99% of the time

**Cons:**

- ❌ Requires manual user intervention for incompatible videos
- ❌ Extra step for some users

**Verdict:** Best for MVP - simple, reliable, no infrastructure needed

---

## Implementation Recommendation

### Phase 1: Background Extraction (This Feature Request)

**Implement dual-video background extraction:**

1. User uploads video → VideoPreview shows video player
2. Background AudioExtractor runs at 2x speed (hidden, muted)
3. Progress indicator shows extraction status
4. When complete, enable "Start Transcription" button
5. User can watch video while audio extracts

**Changes needed:**

- Modify AudioExtractor to support `playbackRate` option
- Update VideoPreview to trigger background extraction
- Add extraction progress indicator to UI
- Store extracted audio blob for later transcription

**Estimated effort:** 4-6 hours

**Codec compatibility:** Still limited to AAC, Opus, Vorbis

### Phase 2: Enhanced Error Handling

**Improve UX for incompatible videos:**

1. Detect codec before extraction (MediaRecorder.isTypeSupported)
2. Show warning: "Audio extraction may fail. Upload audio file for best results."
3. Provide clear instructions for VLC extraction
4. Add "Try anyway" and "Upload audio instead" options

**Estimated effort:** 2-3 hours

### Phase 3 (Future): Server-Side Transcoding

**Add optional backend for universal codec support:**

1. User uploads video to backend
2. FFmpeg transcodes audio to AAC on server
3. Return audio blob to client
4. Proceed to Gemini transcription

**Requires:**

- Backend infrastructure (Node.js, FFmpeg)
- File storage (S3, local disk)
- Upload/download bandwidth
- Processing resources

**Estimated effort:** 20-30 hours (full stack)

---

## Feasibility Score Breakdown

| Aspect                        | Score | Notes                                            |
| ----------------------------- | ----- | ------------------------------------------------ |
| **Technical feasibility**     | 9/10  | Browser APIs fully support background extraction |
| **Codec compatibility**       | 4/10  | Still fails on AC-3, DTS, etc.                   |
| **Implementation complexity** | 7/10  | Moderate - dual video elements, state management |
| **UX improvement**            | 8/10  | Users can watch video while extracting           |
| **Resource usage**            | 6/10  | Two video instances use more memory              |
| **Cross-browser support**     | 8/10  | Works in Chrome, Edge, Firefox (with fallbacks)  |

**Overall: 70% Feasible** - Works well for compatible videos, graceful degradation for others

---

## Recommended Approach for MVP

### Implement Background Extraction + Enhanced Error UX

**Workflow:**

```
User uploads video
    ↓
Check audio codec compatibility
    ↓
    ├─── Compatible (AAC, Opus, Vorbis)
    │       ↓
    │    Show video player
    │       ↓
    │    Start background extraction at 2x speed
    │       ↓
    │    Show progress: "Extracting audio... 67%"
    │       ↓
    │    Enable "Start Transcription" button when ready
    │
    └─── Incompatible (AC-3, DTS, etc.)
            ↓
         Show video player + warning banner
            ↓
         "⚠️ Audio extraction may fail due to codec"
            ↓
         Options:
         1. "Try extraction anyway" (may fail)
         2. "Upload audio file instead" (recommended)
```

**Benefits:**

- ✅ Works great for ~70% of videos (AAC audio)
- ✅ Provides fallback for incompatible videos
- ✅ Emphasizes audio uploads (99% success rate)
- ✅ No backend infrastructure needed
- ✅ Reasonable implementation effort

**Limitations:**

- ⚠️ Some videos still require manual VLC extraction
- ⚠️ Users with AC-3 audio need extra step

---

## Alternative: Prioritize Audio Files Over Video

**Instead of complex background extraction, simplify UX:**

### Recommended UX Flow

1. **Upload page emphasizes audio files:**

   ```
   🎵 Best Results: Upload Audio Files (MP3, WAV, M4A)

   Already have audio? Upload directly for instant transcription!

   Have video? Extract audio first using VLC:
   [Show VLC extraction guide]

   Or try uploading video (may not work for all codecs)
   ```

2. **Audio files → Instant transcription** (no extraction step)
3. **Video files → Best-effort extraction** (with clear warnings)

**Pros:**

- ✅ Simplest implementation
- ✅ Highest success rate (audio files always work)
- ✅ Clear user expectations
- ✅ No dual-video complexity

**Cons:**

- ❌ Extra step for video users
- ❌ Requires VLC knowledge

---

## Conclusion

**Feature is FEASIBLE but has limitations.**

### Recommended Implementation Path:

**Short-term (Sprint 3):**

1. ✅ Implement background audio extraction with `playbackRate: 2.0`
2. ✅ Add extraction progress indicator
3. ✅ Enable "Start Transcription" button when ready
4. ✅ Add codec compatibility warnings

**Medium-term (Sprint 4-5):**

1. Add codec detection before extraction
2. Provide clear VLC extraction guide
3. Emphasize audio file uploads in UX

**Long-term (Post-MVP):**

1. Consider server-side FFmpeg transcoding for universal support
2. Or partner with Gemini to accept video files directly (if they add support)

### Summary

**Can we build it?** Yes, with caveats.
**Will it work for all videos?** No - codec limitations remain.
**Is it worth building?** Yes, but emphasize audio uploads as primary workflow.
**Estimated effort:** 6-10 hours for background extraction + enhanced UX

**Bottom line:** Implement background extraction for better UX on compatible videos, but keep audio file upload as the recommended path for reliability.
