# Video Playback - 10 Minute Quick Start

**Goal**: Add "Play Video" button without breaking anything

---

## 🚀 Ultra-Quick Implementation (10 minutes)

### Step 1: Add Import (App.tsx line ~22)
```typescript
import { VideoPlayerModal } from '@/components/VideoPlayerModal'  // ← ADD THIS
```

### Step 2: Add State (App.tsx after line 52)
```typescript
// Video player state
const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)

// Create object URL
useEffect(() => {
  if (videoFile) {
    const url = URL.createObjectURL(videoFile)
    setVideoObjectUrl(url)
    return () => URL.revokeObjectURL(url)
  }
}, [videoFile])
```

### Step 3: Add VideoPlayerModal (App.tsx after line 303)
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

### Step 4: Update VideoPreview Usage (App.tsx line ~268)
```typescript
<VideoPreview
  file={videoFile}
  metadata={videoMetadata!}
  onRemove={handleRemoveVideo}
  onPlayVideo={() => setIsVideoPlayerOpen(true)}  {/* ← ADD THIS */}
/>
```

### Step 5: Update VideoPreview Component (VideoPreview.tsx)

**A. Update interface** (line 12):
```typescript
interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
  onPlayVideo?: () => void  // ← ADD THIS
}
```

**B. Add to function params** (line 18):
```typescript
export function VideoPreview({ file, metadata, onRemove, onPlayVideo }: VideoPreviewProps) {
```

**C. Add Play button** (after the video/audio player div, before metadata):
```typescript
{/* Add this between the player and metadata sections */}
{onPlayVideo && !isAudio && (
  <div className="mt-4">
    <Button onClick={onPlayVideo} className="w-full" size="lg">
      Play Video in Full Screen
    </Button>
  </div>
)}
```

---

## ✅ That's It!

**Test it:**
1. Upload a video
2. Wait for transcription
3. Click "Play Video in Full Screen" button
4. Video opens in modal with keyboard shortcuts!

---

## 🎹 Keyboard Shortcuts (Built-in!)

| Key | Action |
|-----|--------|
| Space / K | Play/Pause |
| ← → | Seek ±5s |
| ↑ ↓ | Volume ±10% |
| F | Fullscreen |
| M | Mute |
| ESC | Close |

---

## 🔍 If You Want Click-to-Seek (Add 1 hour)

See [VIDEO_PLAYBACK_INTEGRATION.md](./VIDEO_PLAYBACK_INTEGRATION.md) for full timestamp navigation.

---

## ⚠️ Troubleshooting

### Button doesn't appear
- Check: Did you add `onPlayVideo` prop to VideoPreview?
- Check: Is `onPlayVideo` passed in App.tsx?

### Modal doesn't open
- Check: Console for errors
- Check: `useState` was imported
- Check: VideoPlayerModal imported correctly

### Video doesn't play
- Check: File format (should be .mp4)
- Check: Console for error messages
- Try: Different browser

---

**Done!** Video playback is now working without breaking anything! 🎉
