# Video Loading - Quick Reference Guide

## 🎯 What You're Building

Allow users to **click a transcript in the library** → **see the original video** in the preview player.

---

## 🔄 Current vs Desired Flow

### Current Flow (Working)

```
Upload Video → Transcribe → Save Transcript → View Transcript
                                    ↓
                           (Video NOT saved)
```

### Desired Flow (New)

```
Upload Video → Transcribe → Save Transcript + Video → View Transcript
                                         ↓
                                  (Video saved)
                                         ↓
Load from Library → Restore Video → View Transcript + Video
```

---

## 📋 3 Implementation Approaches

### Approach 1: IndexedDB (Easiest) ⭐ RECOMMENDED

**Store video in browser**

| Pros                  | Cons                     |
| --------------------- | ------------------------ |
| ✅ Works offline      | ⚠️ 50-200MB limit        |
| ✅ No backend changes | ⚠️ Lost if cache cleared |
| ✅ Fast (2 days)      | ⚠️ No cross-device       |

### Approach 2: Server Storage

**Upload video to PostgreSQL/File System**

| Pros                 | Cons                   |
| -------------------- | ---------------------- |
| ✅ Unlimited storage | ⚠️ Backend work needed |
| ✅ Cross-device      | ⚠️ Upload time         |
| ✅ Permanent         | ⚠️ Storage costs       |

### Approach 3: Hybrid

**Small videos in IndexedDB, large on server**

| Pros                     | Cons               |
| ------------------------ | ------------------ |
| ✅ Best of both          | ⚠️ More complex    |
| ✅ Fast for small videos | ⚠️ Longer dev time |
| ✅ Scalable              | ⚠️ Two code paths  |

---

## 🚀 Quick Start: IndexedDB Implementation

### Step 1: Update Type (1 line change)

**File**: `src/types/transcript.ts`

```typescript
export interface TranscriptData {
  id: string
  entries: TranscriptEntry[]
  speakers: Speaker[]
  metadata: {
    /* ... */
  }
  videoBlob?: Blob // ← ADD THIS LINE
}
```

### Step 2: Save Video with Transcript

**File**: `src/hooks/useTranscription.ts` (line ~164)

```typescript
// BEFORE (current):
setTranscript(transcriptData)

// AFTER (new):
const transcriptWithVideo: TranscriptData = {
  ...transcriptData,
  videoBlob: file, // Save the original file as a Blob
}
setTranscript(transcriptWithVideo)
```

### Step 3: Load Video from Transcript

**File**: `src/App.tsx` (line ~152)

```typescript
// BEFORE (current):
const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
  console.log('Loading transcript:', loadedTranscript)
  setShowLibrary(false)
}

// AFTER (new):
const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
  // Set transcript
  setDemoTranscript(loadedTranscript)

  // If video exists, reconstruct File object
  if (loadedTranscript.videoBlob) {
    const videoFile = new File(
      [loadedTranscript.videoBlob],
      loadedTranscript.metadata.fileName,
      { type: `video/${loadedTranscript.metadata.videoFormat}` }
    )

    setVideoFile(videoFile)
    setVideoMetadata({
      duration: loadedTranscript.metadata.duration,
      format: loadedTranscript.metadata.videoFormat,
    })
  }

  setShowLibrary(false)
}
```

### Step 4: Test It!

1. Upload a small video (< 10MB)
2. Wait for transcription to complete
3. Go to "My Transcripts"
4. Click on the transcript
5. **✅ Video should appear in preview!**

---

## 🎨 UI Changes Needed

### VideoPreview Component

**Add "source" indicator:**

```typescript
// Before: Shows "Video uploaded successfully"
// After: Shows "Video loaded from library" OR "Video uploaded successfully"

<div className="success-message">
  {isLoaded ? (
    <>
      ✅ Video loaded from library
      <span className="text-sm">Transcribed 2 days ago</span>
    </>
  ) : (
    <>✅ Video uploaded successfully</>
  )}
</div>
```

### ProcessingStatus Component

**Skip processing steps when loading:**

```typescript
{isLoaded ? (
  <div>
    ✅ Loading transcript
    ✅ Video restored
  </div>
) : (
  <div>
    ✅ Uploading video
    🔄 Extracting audio...
  </div>
)}
```

---

## ⚠️ Important Gotchas

### 1. Storage Quota

**Problem**: Videos might exceed browser storage

**Quick Check**:

```typescript
async function canStoreVideo(fileSize: number): Promise<boolean> {
  const estimate = await navigator.storage.estimate()
  const available = (estimate.quota || 0) - (estimate.usage || 0)
  return fileSize < available
}
```

### 2. Memory Leaks

**Problem**: Object URLs not cleaned up

**Solution**:

```typescript
useEffect(() => {
  if (videoBlob) {
    const url = URL.createObjectURL(videoBlob)
    return () => URL.revokeObjectURL(url) // ← Cleanup!
  }
}, [videoBlob])
```

### 3. Missing Videos

**Problem**: What if video blob doesn't exist?

**Solution**:

```typescript
if (!loadedTranscript.videoBlob) {
  // Show message: "Video not available"
  // Offer: "Upload video again" button
}
```

---

## 🧪 Test Cases

### Basic Functionality

- [ ] Upload video → Save → Load → Video plays ✅
- [ ] Upload video → Clear cache → Load → Handle gracefully ✅
- [ ] Load transcript without video → Show message ✅

### Edge Cases

- [ ] Video > 50MB → Warn before saving ✅
- [ ] Storage quota full → Show error ✅
- [ ] Corrupted video blob → Handle error ✅

---

## 📊 Storage Size Guide

| Video Length | File Size (MP4) | IndexedDB? |
| ------------ | --------------- | ---------- |
| 10 seconds   | ~2MB            | ✅ Yes     |
| 30 seconds   | ~5MB            | ✅ Yes     |
| 1 minute     | ~10MB           | ✅ Yes     |
| 5 minutes    | ~50MB           | ⚠️ Maybe   |
| 10 minutes   | ~100MB          | ❌ No      |

**Recommendation**: Warn users if video > 25MB

---

## 🔧 Debugging Tips

### Check if video is saved:

```typescript
console.log('Video blob size:', loadedTranscript.videoBlob?.size)
console.log('Has video:', !!loadedTranscript.videoBlob)
```

### Check storage usage:

```typescript
const estimate = await navigator.storage.estimate()
console.log('Used:', estimate.usage)
console.log('Quota:', estimate.quota)
console.log('Available:', estimate.quota - estimate.usage)
```

### Inspect IndexedDB:

1. Open DevTools → Application tab
2. Click "IndexedDB"
3. Find your database
4. Check "transcripts" table
5. Look for `videoBlob` field

---

## 📝 Implementation Order

**Day 1** (Core functionality)

1. ✅ Update TranscriptData type
2. ✅ Save videoBlob with transcript
3. ✅ Implement handleLoadTranscript
4. ✅ Test basic flow

**Day 2** (Polish & edge cases) 5. ✅ Add storage quota checking 6. ✅ Handle missing videos 7. ✅ Update UI components 8. ✅ Add loading states

**Day 3** (Optional - Server backup) 9. ⭐ Backend upload endpoint 10. ⭐ Download on load 11. ⭐ Progress indicators

---

## 🎯 Success Checklist

**Feature is working when:**

- [x] User uploads video
- [x] Transcript is generated
- [x] Video is saved with transcript
- [x] User opens "My Transcripts"
- [x] User clicks a transcript
- [x] **Video appears in preview** ← THIS IS THE KEY!
- [x] Video plays correctly
- [x] Timestamp navigation works

---

## 🚀 Next Steps

1. **Read full design**: [VIDEO_LOADING_DESIGN.md](./VIDEO_LOADING_DESIGN.md)
2. **Start coding**: Follow Step 1-4 above
3. **Test**: Use small video first (< 10MB)
4. **Iterate**: Add polish based on testing

---

**Questions?** Check the full design document for detailed explanations!
