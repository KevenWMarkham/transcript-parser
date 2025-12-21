# FFmpeg.wasm Client-Side Implementation Guide

**Date:** 2025-12-17
**Purpose:** Guide for implementing FFmpeg.wasm in the browser for universal audio extraction
**Target:** Transcript Parser - Sprint 3/4

---

## What is FFmpeg.wasm?

**FFmpeg.wasm** is a pure WebAssembly port of FFmpeg that runs entirely in the browser.

- ✅ **No server needed** - All processing happens client-side
- ✅ **Universal codec support** - Handles AC-3, DTS, AAC, MP3, etc.
- ✅ **Privacy-friendly** - Files never leave user's browser
- ⚠️ **Large bundle** - ~25-31MB initial download
- ⚠️ **CPU-intensive** - Slower than native FFmpeg
- ⚠️ **Memory-heavy** - Can use 500MB+ RAM for large files

---

## Installation

### Option 1: Latest Version (@ffmpeg/ffmpeg v0.12+)

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

**Package sizes:**

- `@ffmpeg/ffmpeg`: ~50KB (loader)
- `@ffmpeg/util`: ~10KB (utilities)
- Core WASM files: ~31MB (downloaded at runtime from CDN)

### Option 2: Legacy Version (@ffmpeg/ffmpeg v0.11.x)

```bash
npm install @ffmpeg/ffmpeg@0.11.6 @ffmpeg/core@0.11.0
```

**Note:** v0.11 is older but more stable. v0.12+ has breaking API changes.

---

## Basic Implementation (v0.12+)

### Step 1: Install Dependencies

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

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
  private ffmpeg: FFmpeg | null = null
  private loaded = false

  /**
   * Load FFmpeg.wasm (downloads ~31MB)
   * Call this once on app initialization or before first use
   */
  async load(options?: FFmpegExtractionOptions): Promise<void> {
    if (this.loaded) return

    const { onLog } = options || {}

    this.ffmpeg = new FFmpeg()

    // Set up logging
    this.ffmpeg.on('log', ({ message }) => {
      console.log('[FFmpeg]', message)
      onLog?.(message)
    })

    // Set up progress tracking
    this.ffmpeg.on('progress', ({ progress, time }) => {
      console.log(`[FFmpeg] Progress: ${(progress * 100).toFixed(2)}%`)
      options?.onProgress?.(progress * 100)
    })

    // Load FFmpeg core from CDN
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    })

    this.loaded = true
    console.log('[FFmpeg] Loaded successfully')
  }

  /**
   * Extract audio from video file to AAC/M4A
   * @param videoFile - Video file with any codec
   * @returns Audio blob in AAC format (Gemini-compatible)
   */
  async extractAudio(
    videoFile: File,
    options?: FFmpegExtractionOptions
  ): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      throw new Error('FFmpeg not loaded. Call load() first.')
    }

    const { onProgress } = options || {}

    try {
      // Write input file to FFmpeg virtual filesystem
      console.log(`[FFmpeg] Writing input file: ${videoFile.name}`)
      await this.ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

      // Run FFmpeg command to extract audio
      // -i input.mp4: Input file
      // -vn: No video (audio only)
      // -acodec aac: Encode to AAC
      // -b:a 128k: Audio bitrate 128kbps
      // -ar 44100: Sample rate 44.1kHz
      // output.m4a: Output file
      console.log('[FFmpeg] Extracting audio...')
      await this.ffmpeg.exec([
        '-i',
        'input.mp4',
        '-vn',
        '-acodec',
        'aac',
        '-b:a',
        '128k',
        '-ar',
        '44100',
        'output.m4a',
      ])

      // Read output file from virtual filesystem
      const data = await this.ffmpeg.readFile('output.m4a')

      // Clean up virtual filesystem
      await this.ffmpeg.deleteFile('input.mp4')
      await this.ffmpeg.deleteFile('output.m4a')

      // Convert Uint8Array to Blob
      const blob = new Blob([data], { type: 'audio/mp4' })

      console.log(
        `[FFmpeg] Extraction complete: ${(blob.size / 1024 / 1024).toFixed(2)} MB`
      )

      return blob
    } catch (error) {
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
   * Terminate FFmpeg worker
   */
  async terminate(): Promise<void> {
    if (this.ffmpeg) {
      this.ffmpeg.terminate()
      this.ffmpeg = null
      this.loaded = false
    }
  }
}
```

### Step 3: Update useTranscription Hook

**File: `src/hooks/useTranscription.ts`**

```typescript
import { useState, useCallback, useRef } from 'react'
import type { TranscriptData } from '@/types/transcript'
import type { VideoMetadata } from '@/utils/fileUtils'
import { isAudioFile } from '@/utils/fileUtils'
import { AudioExtractor } from '@/services/audioExtractor'
import { FFmpegExtractor } from '@/services/ffmpegExtractor'
import { GeminiClient } from '@/services/geminiClient'

export type ProcessingState =
  | 'idle'
  | 'loading-ffmpeg'
  | 'extracting-audio'
  | 'transcribing'
  | 'complete'
  | 'error'

export interface UseTranscriptionResult {
  processingState: ProcessingState
  progress: number
  transcript: TranscriptData | null
  error: Error | null
  startTranscription: (file: File, metadata: VideoMetadata) => Promise<void>
  reset: () => void
}

export function useTranscription(): UseTranscriptionResult {
  const [processingState, setProcessingState] =
    useState<ProcessingState>('idle')
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const ffmpegExtractor = useRef<FFmpegExtractor | null>(null)

  const reset = useCallback(() => {
    setProcessingState('idle')
    setProgress(0)
    setTranscript(null)
    setError(null)
  }, [])

  const startTranscription = useCallback(
    async (file: File, metadata: VideoMetadata) => {
      try {
        setError(null)
        setProgress(0)
        setTranscript(null)

        let audioBlob: Blob

        if (isAudioFile(file)) {
          // Audio file - use directly
          audioBlob = file
          setProgress(30)
        } else {
          // Video file - try browser extraction first, fallback to FFmpeg
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
          } catch (browserError) {
            console.warn(
              '[Browser extraction failed, trying FFmpeg...]',
              browserError
            )

            // Fallback to FFmpeg.wasm
            if (!ffmpegExtractor.current) {
              ffmpegExtractor.current = new FFmpegExtractor()
            }

            if (!ffmpegExtractor.current.isLoaded()) {
              setProcessingState('loading-ffmpeg')
              setProgress(5)
              await ffmpegExtractor.current.load({
                onProgress: loadProgress => {
                  // 5-15% for FFmpeg loading
                  setProgress(5 + (loadProgress / 100) * 10)
                },
              })
              setProgress(15)
            }

            setProcessingState('extracting-audio')
            audioBlob = await ffmpegExtractor.current.extractAudio(file, {
              onProgress: extractProgress => {
                // 15-30% for extraction
                setProgress(15 + (extractProgress / 100) * 15)
              },
            })
            setProgress(30)
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

  return {
    processingState,
    progress,
    transcript,
    error,
    startTranscription,
    reset,
  }
}
```

### Step 4: Update ProcessingStatus Component

**File: `src/components/ProcessingStatus.tsx`**

Add new state for FFmpeg loading:

```typescript
case 'loading-ffmpeg':
  return {
    title: 'Loading FFmpeg',
    description: 'Downloading audio extraction engine...',
    icon: <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />,
    color: 'orange',
  }
```

---

## Advanced Implementation - Codec Detection

### Detect Codec Before Extraction

```typescript
/**
 * Check if browser's MediaRecorder can handle video's audio codec
 */
async function canBrowserExtractAudio(videoFile: File): Promise<boolean> {
  try {
    const video = document.createElement('video')
    video.src = URL.createObjectURL(videoFile)

    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve()
      video.onerror = () => reject(new Error('Failed to load video'))
      setTimeout(() => reject(new Error('Timeout')), 5000)
    })

    // Try to capture stream
    const stream = video.captureStream?.() || video.mozCaptureStream?.()

    if (!stream) return false

    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 0) return false

    // Check if MediaRecorder supports the stream
    const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']

    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        try {
          new MediaRecorder(stream, { mimeType })
          URL.revokeObjectURL(video.src)
          return true
        } catch {
          continue
        }
      }
    }

    URL.revokeObjectURL(video.src)
    return false
  } catch {
    return false
  }
}
```

### Smart Extraction Strategy

```typescript
async function smartExtractAudio(file: File): Promise<Blob> {
  // Check if browser can extract
  const canUseBrowser = await canBrowserExtractAudio(file)

  if (canUseBrowser) {
    console.log('Using browser MediaRecorder for extraction')
    const audioExtractor = new AudioExtractor()
    return await audioExtractor.extractAudio(file)
  } else {
    console.log('Using FFmpeg.wasm for extraction')
    const ffmpegExtractor = new FFmpegExtractor()

    if (!ffmpegExtractor.isLoaded()) {
      await ffmpegExtractor.load()
    }

    return await ffmpegExtractor.extractAudio(file)
  }
}
```

---

## Performance Optimization

### 1. Lazy Load FFmpeg

Only load FFmpeg when needed (on first incompatible video):

```typescript
// Don't load FFmpeg on app start
// Load it only when browser extraction fails
```

### 2. Cache FFmpeg Instance

Keep FFmpeg loaded between extractions:

```typescript
// Use useRef in React hook
const ffmpegExtractor = useRef<FFmpegExtractor | null>(null)
```

### 3. Use Web Worker

Offload FFmpeg to Web Worker to avoid blocking main thread:

```typescript
// Advanced: Wrap FFmpeg in Web Worker
// See: https://ffmpegwasm.netlify.app/docs/getting-started/usage#multi-threading
```

### 4. Reduce Output Quality

For transcription, high quality audio isn't needed:

```typescript
// Lower bitrate = faster processing + smaller file
await ffmpeg.exec([
  '-i',
  'input.mp4',
  '-vn',
  '-acodec',
  'aac',
  '-b:a',
  '64k', // Lower bitrate (64kbps vs 128kbps)
  '-ar',
  '22050', // Lower sample rate (22.05kHz vs 44.1kHz)
  'output.m4a',
])
```

---

## Handling Large Files

### Memory Management

FFmpeg.wasm loads entire file into memory:

```typescript
async extractAudio(videoFile: File): Promise<Blob> {
  // Check file size before processing
  const maxSize = 500 * 1024 * 1024 // 500MB limit

  if (videoFile.size > maxSize) {
    throw new Error(
      `File too large for browser extraction (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). ` +
      `Maximum: ${(maxSize / 1024 / 1024).toFixed(0)}MB. ` +
      `Please extract audio using VLC and upload the audio file instead.`
    )
  }

  // Proceed with extraction...
}
```

### Progress Tracking

FFmpeg provides detailed progress:

```typescript
this.ffmpeg.on('progress', ({ progress, time }) => {
  // progress: 0.0 to 1.0
  // time: current processing time in microseconds

  const percentage = (progress * 100).toFixed(2)
  const seconds = (time / 1000000).toFixed(1)

  console.log(`Progress: ${percentage}% (${seconds}s processed)`)
  onProgress?.(progress * 100)
})
```

---

## Error Handling

### Common Errors

```typescript
try {
  await ffmpegExtractor.extractAudio(videoFile)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'

  if (message.includes('out of memory')) {
    setError(
      new Error(
        'Not enough memory to process this video. Try a smaller file or extract audio using VLC.'
      )
    )
  } else if (message.includes('timeout')) {
    setError(
      new Error(
        'Processing timeout. This video may be too large. Try extracting audio using VLC.'
      )
    )
  } else if (message.includes('Invalid data')) {
    setError(
      new Error(
        'Video file appears to be corrupted or in an unsupported format.'
      )
    )
  } else {
    setError(new Error(`Audio extraction failed: ${message}`))
  }
}
```

---

## Self-Hosting FFmpeg Core

### Why Self-Host?

- ✅ Faster loading (no CDN latency)
- ✅ Offline support
- ✅ Version control (no CDN surprises)
- ❌ Larger app bundle (31MB)

### Step 1: Install Core Package

```bash
npm install @ffmpeg/core
```

### Step 2: Copy Core Files to Public Directory

```bash
# Copy core files to public/ffmpeg
cp node_modules/@ffmpeg/core/dist/umd/* public/ffmpeg/
```

### Step 3: Update Load Function

```typescript
await this.ffmpeg.load({
  coreURL: '/ffmpeg/ffmpeg-core.js',
  wasmURL: '/ffmpeg/ffmpeg-core.wasm',
})
```

### Step 4: Configure Vite

**File: `vite.config.ts`**

```typescript
export default defineConfig({
  // ... other config
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          // Keep FFmpeg files in /ffmpeg/ directory
          if (assetInfo.name?.startsWith('ffmpeg/')) {
            return 'ffmpeg/[name].[ext]'
          }
          return 'assets/[name]-[hash].[ext]'
        },
      },
    },
  },
})
```

---

## Complete Example: Production-Ready

```typescript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

export class FFmpegExtractor {
  private static instance: FFmpegExtractor | null = null
  private ffmpeg: FFmpeg | null = null
  private loaded = false
  private loading = false

  // Singleton pattern - reuse instance
  static getInstance(): FFmpegExtractor {
    if (!FFmpegExtractor.instance) {
      FFmpegExtractor.instance = new FFmpegExtractor()
    }
    return FFmpegExtractor.instance
  }

  async load(options?: { onProgress?: (p: number) => void }): Promise<void> {
    if (this.loaded) return
    if (this.loading) {
      // Wait for ongoing load
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.loading = true

    try {
      this.ffmpeg = new FFmpeg()

      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
      })

      this.ffmpeg.on('progress', ({ progress }) => {
        options?.onProgress?.(progress * 100)
      })

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

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
      console.log('[FFmpeg] Loaded successfully')
    } finally {
      this.loading = false
    }
  }

  async extractAudio(
    videoFile: File,
    options?: { onProgress?: (p: number) => void }
  ): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      throw new Error('FFmpeg not loaded')
    }

    // File size check
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      throw new Error(
        `File too large (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). Maximum: 500MB`
      )
    }

    const inputName = `input_${Date.now()}.mp4`
    const outputName = `output_${Date.now()}.m4a`

    try {
      await this.ffmpeg.writeFile(inputName, await fetchFile(videoFile))

      await this.ffmpeg.exec([
        '-i',
        inputName,
        '-vn',
        '-acodec',
        'aac',
        '-b:a',
        '64k',
        '-ar',
        '22050',
        outputName,
      ])

      const data = await this.ffmpeg.readFile(outputName)

      await this.ffmpeg.deleteFile(inputName)
      await this.ffmpeg.deleteFile(outputName)

      return new Blob([data], { type: 'audio/mp4' })
    } catch (error) {
      // Clean up files on error
      try {
        await this.ffmpeg.deleteFile(inputName).catch(() => {})
        await this.ffmpeg.deleteFile(outputName).catch(() => {})
      } catch {}

      throw error
    }
  }

  isLoaded(): boolean {
    return this.loaded
  }
}
```

---

## Bundle Size Impact

### Before FFmpeg.wasm

```
Total bundle size: ~500KB
```

### After FFmpeg.wasm (CDN)

```
Initial bundle: ~510KB (+10KB loader)
FFmpeg core (CDN): ~31MB (loaded on demand)
```

### After FFmpeg.wasm (Self-hosted)

```
Total bundle size: ~31.5MB
```

**Recommendation:** Use CDN approach - only loads 31MB when actually needed

---

## Browser Compatibility

| Browser       | FFmpeg.wasm Support | Notes                      |
| ------------- | ------------------- | -------------------------- |
| Chrome 90+    | ✅ Full             | Best performance           |
| Edge 90+      | ✅ Full             | Same as Chrome             |
| Firefox 89+   | ✅ Full             | Slightly slower            |
| Safari 15+    | ✅ Full             | SharedArrayBuffer required |
| Mobile Chrome | ⚠️ Limited          | Memory constraints         |
| Mobile Safari | ⚠️ Limited          | Memory constraints         |

---

## Recommended Implementation Strategy

### Phase 1: Browser-First (Current)

```
User uploads video
    ↓
Try browser MediaRecorder
    ↓
Success? → Proceed to transcription
    ↓
Fail? → Show error, suggest audio file upload
```

### Phase 2: FFmpeg Fallback

```
User uploads video
    ↓
Try browser MediaRecorder
    ↓
Success? → Proceed to transcription
    ↓
Fail? → Load FFmpeg.wasm (31MB download)
    ↓
Extract with FFmpeg
    ↓
Proceed to transcription
```

### Phase 3: Smart Detection

```
User uploads video
    ↓
Detect audio codec
    ↓
Compatible (AAC, Opus)? → Use browser
    ↓
Incompatible (AC-3, DTS)? → Load FFmpeg.wasm
    ↓
Extract audio
    ↓
Proceed to transcription
```

---

## Summary

**FFmpeg.wasm provides universal codec support but has tradeoffs:**

✅ **Pros:**

- Works with ANY audio codec (AC-3, DTS, etc.)
- No server needed
- Privacy-friendly (client-side only)
- Reliable and battle-tested

❌ **Cons:**

- 31MB download (first use only)
- CPU-intensive (slower than native)
- Memory-heavy (500MB+ for large files)
- Mobile device limitations

**Recommendation for MVP:**

- Phase 1: Keep current approach (browser extraction + audio file emphasis)
- Phase 2: Add FFmpeg.wasm as fallback for incompatible videos
- Phase 3: Add smart codec detection to choose best method

**Installation:**

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

**Usage:**

```typescript
const extractor = FFmpegExtractor.getInstance()
await extractor.load()
const audioBlob = await extractor.extractAudio(videoFile)
```
