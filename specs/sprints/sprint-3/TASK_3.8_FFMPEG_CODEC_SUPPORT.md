# Task 3.8: FFmpeg.wasm Integration for Universal Codec Support

**Sprint**: 3
**Estimated Effort**: 6 hours
**Priority**: High
**Dependencies**: Sprint 2 (Audio Extraction) complete

---

## 📋 Overview

**Problem:** Browser's MediaRecorder API cannot handle all audio codecs, causing failures with certain video files.

**Examples of incompatible codecs:**

- ❌ AC-3 (Dolby Digital) - Common in movies, TV shows, DVDs
- ❌ E-AC-3 (Dolby Digital Plus) - Streaming services
- ❌ DTS - Blu-ray discs
- ❌ FLAC - Lossless audio
- ❌ Various proprietary codecs

**Solution:** Integrate FFmpeg.wasm to provide universal codec support (works with ANY audio/video format).

---

## 🎯 Objectives

1. Install and configure FFmpeg.wasm
2. Create FFmpegExtractor service
3. Implement browser-first with FFmpeg fallback strategy
4. Update useTranscription hook with codec detection
5. Add FFmpeg loading UI states
6. Test with incompatible video files

---

## 🚀 Implementation

### Step 1: Install FFmpeg.wasm

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

**Package sizes:**

- `@ffmpeg/ffmpeg`: ~50KB (loader)
- `@ffmpeg/util`: ~10KB (utilities)
- Core WASM files: ~31MB (downloaded at runtime from CDN, one-time)

---

### Step 2: Create FFmpeg Service

**File: `src/services/ffmpegExtractor.ts`**

```typescript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

export interface FFmpegExtractionOptions {
  onProgress?: (progress: number) => void
  onLog?: (message: string) => void
}

export class FFmpegExtractor {
  private static instance: FFmpegExtractor | null = null
  private ffmpeg: FFmpeg | null = null
  private loaded = false
  private loading = false

  /**
   * Singleton pattern - reuse FFmpeg instance across app
   */
  static getInstance(): FFmpegExtractor {
    if (!FFmpegExtractor.instance) {
      FFmpegExtractor.instance = new FFmpegExtractor()
    }
    return FFmpegExtractor.instance
  }

  /**
   * Load FFmpeg.wasm (downloads ~31MB from CDN)
   * Only called when browser extraction fails
   */
  async load(options?: FFmpegExtractionOptions): Promise<void> {
    if (this.loaded) return

    // Wait for ongoing load
    if (this.loading) {
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.loading = true

    try {
      console.log('[FFmpeg] Initializing...')
      this.ffmpeg = new FFmpeg()

      // Set up logging
      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
        options?.onLog?.(message)
      })

      // Set up progress tracking
      this.ffmpeg.on('progress', ({ progress }) => {
        const percentage = (progress * 100).toFixed(1)
        console.log(`[FFmpeg] Progress: ${percentage}%`)
        options?.onProgress?.(progress * 100)
      })

      // Load FFmpeg core from CDN
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

      console.log('[FFmpeg] Downloading core files from CDN...')
      await this.ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        ),
      })

      this.loaded = true
      console.log('[FFmpeg] Loaded successfully ✅')
    } catch (error) {
      console.error('[FFmpeg] Load failed:', error)
      throw new Error(
        `Failed to load FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      this.loading = false
    }
  }

  /**
   * Extract audio from video file using FFmpeg
   * Works with ANY video/audio codec
   */
  async extractAudio(
    videoFile: File,
    options?: FFmpegExtractionOptions
  ): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      throw new Error('FFmpeg not loaded. Call load() first.')
    }

    // File size check (500MB limit for browser processing)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      throw new Error(
        `File too large (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). ` +
          `Maximum: 500MB. Please use a smaller file or extract audio using VLC/FFmpeg externally.`
      )
    }

    const inputName = `input_${Date.now()}.${this.getFileExtension(videoFile.name)}`
    const outputName = `output_${Date.now()}.m4a`

    try {
      console.log(
        `[FFmpeg] Writing input file: ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(2)} MB)`
      )
      await this.ffmpeg.writeFile(inputName, await fetchFile(videoFile))

      console.log('[FFmpeg] Extracting audio...')
      await this.ffmpeg.exec([
        '-i',
        inputName, // Input file
        '-vn', // No video
        '-acodec',
        'aac', // AAC codec (Gemini compatible)
        '-b:a',
        '64k', // Low bitrate (sufficient for transcription)
        '-ar',
        '22050', // Lower sample rate (faster processing)
        outputName,
      ])

      console.log('[FFmpeg] Reading output file...')
      const data = await this.ffmpeg.readFile(outputName)

      // Clean up virtual filesystem
      console.log('[FFmpeg] Cleaning up...')
      await this.ffmpeg.deleteFile(inputName)
      await this.ffmpeg.deleteFile(outputName)

      const blob = new Blob([data], { type: 'audio/mp4' })
      console.log(
        `[FFmpeg] Extraction complete ✅: ${(blob.size / 1024 / 1024).toFixed(2)} MB`
      )

      return blob
    } catch (error) {
      // Clean up files on error
      try {
        await this.ffmpeg.deleteFile(inputName).catch(() => {})
        await this.ffmpeg.deleteFile(outputName).catch(() => {})
      } catch {}

      throw new Error(
        `FFmpeg extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Check if FFmpeg is loaded
   */
  isLoaded(): boolean {
    return this.loaded
  }

  /**
   * Terminate FFmpeg worker (rarely needed)
   */
  async terminate(): Promise<void> {
    if (this.ffmpeg) {
      this.ffmpeg.terminate()
      this.ffmpeg = null
      this.loaded = false
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : 'mp4'
  }
}
```

---

### Step 3: Update useTranscription Hook

**File: `src/hooks/useTranscription.ts`**

```typescript
import { FFmpegExtractor } from '@/services/ffmpegExtractor'

export type ProcessingState =
  | 'idle'
  | 'loading-ffmpeg' // NEW: Loading FFmpeg.wasm
  | 'extracting-audio'
  | 'transcribing'
  | 'complete'
  | 'error'

const startTranscription = useCallback(
  async (file: File, metadata: VideoMetadata) => {
    try {
      setError(null)
      setProgress(0)
      setTranscript(null)

      let audioBlob: Blob

      if (isAudioFile(file)) {
        // Audio file - use directly
        console.log('[Transcription] Audio file detected, skipping extraction')
        audioBlob = file
        setProgress(30)
      } else {
        // Video file - try browser extraction first, fallback to FFmpeg
        console.log(
          '[Transcription] Video file detected, attempting browser extraction...'
        )

        try {
          setProcessingState('extracting-audio')
          const audioExtractor = new AudioExtractor()
          audioBlob = await audioExtractor.extractAudio(file, {
            onProgress: audioProgress => {
              const totalProgress = (audioProgress / 100) * 30
              setProgress(totalProgress)
            },
          })
          setProgress(30)
          console.log('[Transcription] Browser extraction successful ✅')
        } catch (browserError) {
          console.warn(
            '[Transcription] Browser extraction failed:',
            browserError
          )
          console.log('[Transcription] Falling back to FFmpeg.wasm...')

          // Fallback to FFmpeg.wasm
          const ffmpegExtractor = FFmpegExtractor.getInstance()

          if (!ffmpegExtractor.isLoaded()) {
            setProcessingState('loading-ffmpeg')
            setProgress(5)

            console.log(
              '[Transcription] Loading FFmpeg.wasm (31MB, one-time download)...'
            )
            await ffmpegExtractor.load({
              onProgress: loadProgress => {
                // 5-15% for FFmpeg loading
                setProgress(5 + (loadProgress / 100) * 10)
              },
            })
            setProgress(15)
            console.log('[Transcription] FFmpeg.wasm loaded ✅')
          }

          setProcessingState('extracting-audio')
          audioBlob = await ffmpegExtractor.extractAudio(file, {
            onProgress: extractProgress => {
              // 15-30% for extraction
              setProgress(15 + (extractProgress / 100) * 15)
            },
          })
          setProgress(30)
          console.log('[Transcription] FFmpeg extraction successful ✅')
        }
      }

      // Transcribe with Gemini (30-100% progress)
      setProcessingState('transcribing')

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return Math.min(prev + 2, 95)
        })
      }, 500)

      try {
        const geminiClient = new GeminiClient()
        const transcriptData =
          await geminiClient.transcribeWithSpeakers(audioBlob)

        clearInterval(progressInterval)

        transcriptData.metadata = {
          ...transcriptData.metadata,
          fileName: file.name,
          fileSize: file.size,
          duration: metadata.duration,
          videoFormat: metadata.format,
        }

        setTranscript(transcriptData)
        setProgress(100)
        setProcessingState('complete')
      } catch (transcriptionError) {
        clearInterval(progressInterval)
        throw transcriptionError
      }
    } catch (err) {
      setProcessingState('error')
      setError(err instanceof Error ? err : new Error('Unknown error'))
      throw err
    }
  },
  []
)
```

---

### Step 4: Update ProcessingStatus Component

**File: `src/components/ProcessingStatus.tsx`**

Add new state for FFmpeg loading:

```typescript
const getStateMessage = () => {
  switch (processingState) {
    case 'idle':
      return null

    case 'loading-ffmpeg':
      return {
        title: 'Loading FFmpeg',
        description: 'Downloading universal audio extraction engine (31MB, one-time download)...',
        icon: <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />,
        color: 'orange',
      }

    case 'extracting-audio':
      return {
        title: 'Extracting audio',
        description: 'Preparing audio for transcription...',
        icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
        color: 'blue',
      }

    // ... rest of cases
  }
}
```

---

## 🎯 Fallback Strategy

```
User uploads video file
    ↓
Check if audio file → Use directly ✅
    ↓
Video file → Try browser MediaRecorder first
    ↓
├─ Success (AAC, Opus, Vorbis) → Fast extraction ✅
│
└─ Fail (AC-3, DTS, etc.)
    ↓
    Load FFmpeg.wasm (31MB, one-time, cached)
    ↓
    Extract with FFmpeg (slower but works with ANY codec) ✅
    ↓
    Proceed to Gemini transcription ✅
```

**Benefits:**

- ✅ **Fast for most users** - Browser MediaRecorder is instant (70% of videos)
- ✅ **Universal compatibility** - FFmpeg handles edge cases (30% of videos)
- ✅ **One-time download** - FFmpeg cached in browser after first use
- ✅ **Progressive enhancement** - Works for everyone, optimized for common cases

---

## 🧪 Testing

### Test Cases

**Test 1: Compatible Video (AAC audio)**

```
Expected: Browser MediaRecorder succeeds, no FFmpeg download
Result: Fast extraction, immediate transcription
```

**Test 2: Incompatible Video (AC-3 audio)**

```
Expected: Browser fails, FFmpeg loads, extraction succeeds
Result: 31MB download (one-time), then successful extraction
```

**Test 3: Subsequent Incompatible Video**

```
Expected: FFmpeg already cached, no re-download
Result: Immediate FFmpeg extraction (no download)
```

**Test 4: Audio File (MP3)**

```
Expected: Skip extraction entirely
Result: Direct to transcription
```

**Test 5: Large File (>500MB)**

```
Expected: Error with clear message
Result: "File too large" error, suggest VLC extraction
```

### Test Videos

Obtain test videos with different codecs:

- ✅ H.264 + AAC (should use browser)
- ✅ H.265 + AC-3 (should use FFmpeg)
- ✅ VP9 + Opus (should use browser)
- ✅ Various formats (MKV, AVI, MOV)

---

## 📊 Performance Metrics

### Browser MediaRecorder (70% of videos)

- Speed: **Instant** (< 1 second)
- Bundle size: **0KB** (native browser API)
- Memory usage: Low

### FFmpeg.wasm Fallback (30% of videos)

- Download size: **31MB** (one-time)
- Speed: **2-5x slower** than browser
- Memory usage: **500MB+** for processing
- File size limit: **500MB max**

---

## 🚨 Error Handling

### Common Errors

**Error 1: File Too Large**

```typescript
if (videoFile.size > maxSize) {
  throw new Error(
    `File too large (${size}MB). Maximum: 500MB. ` +
      `Please extract audio using VLC: File > Convert > Audio - MP3`
  )
}
```

**Error 2: FFmpeg Load Failure**

```typescript
try {
  await ffmpeg.load()
} catch (error) {
  throw new Error(
    'Failed to load FFmpeg. Please check your internet connection and try again.'
  )
}
```

**Error 3: Extraction Timeout**

```typescript
// Add timeout for large files
const timeout = setTimeout(
  () => {
    throw new Error(
      'Extraction timeout. Try a smaller file or extract audio externally.'
    )
  },
  5 * 60 * 1000
) // 5 minutes
```

---

## ✅ Acceptance Criteria

- ✅ FFmpeg.wasm installed (`@ffmpeg/ffmpeg` + `@ffmpeg/util`)
- ✅ FFmpegExtractor service created with singleton pattern
- ✅ Fallback strategy implemented (browser first, FFmpeg second)
- ✅ useTranscription hook updated with codec detection
- ✅ ProcessingStatus shows "Loading FFmpeg" state
- ✅ Handles AC-3, DTS, and other incompatible codecs
- ✅ FFmpeg loads only when needed (not for all users)
- ✅ Progress indicators for FFmpeg download and extraction
- ✅ Error messages explain what's happening
- ✅ File size limits enforced (500MB max)
- ✅ Tested with incompatible video files
- ✅ FFmpeg instance reused across app (singleton)

---

## 📚 Documentation

### User-Facing

**Help text when FFmpeg loads:**

```
"Your video's audio codec requires a special extraction tool.
Downloading FFmpeg (31MB, one-time). This will be cached for future use."
```

**When to suggest VLC instead:**

```
"For very large files (>500MB), we recommend extracting audio first:
1. Open video in VLC
2. Media > Convert/Save
3. Choose 'Audio - MP3' preset
4. Upload the MP3 file instead"
```

### Developer Notes

See [FFMPEG_WASM_IMPLEMENTATION_GUIDE.md](./FFMPEG_WASM_IMPLEMENTATION_GUIDE.md) for:

- Detailed API reference
- Advanced configuration options
- Self-hosting FFmpeg core files
- Performance optimization tips
- Troubleshooting guide

---

## 📋 Checklist

**Implementation**:

- [ ] Install `@ffmpeg/ffmpeg` and `@ffmpeg/util`
- [ ] Create `src/services/ffmpegExtractor.ts`
- [ ] Update `src/hooks/useTranscription.ts` with fallback
- [ ] Update `src/components/ProcessingStatus.tsx` with loading state
- [ ] Add file size validation (500MB limit)
- [ ] Implement progress tracking for download and extraction

**Testing**:

- [ ] Test with AAC video (browser extraction)
- [ ] Test with AC-3 video (FFmpeg extraction)
- [ ] Test with audio file (MP3)
- [ ] Test with large file (error handling)
- [ ] Test FFmpeg caching (second incompatible video)

**Documentation**:

- [ ] Update user help text
- [ ] Add VLC extraction guide
- [ ] Document fallback strategy
- [ ] Add troubleshooting section

---

**Task 3.8 Completion Criteria:**

All checkboxes above must be completed, and the following demo must work:

**Demo:**

1. Upload video with AC-3 audio → FFmpeg loads → Extraction succeeds → Transcription completes
2. Upload another incompatible video → FFmpeg already cached → Immediate extraction

---

**Task Version**: 1.0
**Created**: 2025-12-17
**Sprint**: 3
**Estimated**: 6 hours
