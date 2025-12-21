# Sprint 2: Gemini AI Integration & Transcription Service

**Duration**: 2 weeks (Weeks 3-4)
**Sprint Goal**: Integrate Google Gemini API for audio transcription with speaker diarization, complete with working demo using real AI.

---

## Sprint Objectives

1. Set up Google Gemini API integration
2. Extract audio from uploaded video files
3. Send audio to Gemini for transcription with speaker identification
4. Display real-time processing status
5. Create working demo with actual AI transcription

---

## User Stories

### Story 1: AI Transcription Setup

**As a** developer
**I want to** integrate Google Gemini API
**So that** the application can generate transcripts from video audio

**Acceptance Criteria**:

- [ ] Gemini API SDK installed and configured
- [ ] API key securely stored in environment variables
- [ ] Client service created with error handling
- [ ] Rate limiting implemented
- [ ] Retry logic for transient failures

### Story 2: Audio Extraction

**As a** user
**I want** my video's audio to be extracted automatically
**So that** it can be sent to the AI for transcription

**Acceptance Criteria**:

- [ ] Audio extracted from uploaded video file
- [ ] Audio format converted to compatible format (WebM, MP3, or WAV)
- [ ] Extraction progress shown to user
- [ ] Extraction errors handled gracefully
- [ ] Memory efficient (doesn't crash with large files)

### Story 3: Processing Status

**As a** user
**I want to** see real-time updates during transcription
**So that** I know the process is working and how long it will take

**Acceptance Criteria**:

- [ ] Processing state changes reflected in UI
- [ ] Progress indicator shows current step
- [ ] Estimated time remaining displayed (if available)
- [ ] User can see "Extracting audio", "Transcribing", "Processing speakers"
- [ ] Animated loading states provide feedback

### Story 4: Transcription Result

**As a** user
**I want to** receive a transcript with identified speakers
**So that** I can review what was said and by whom

**Acceptance Criteria**:

- [ ] Transcript generated from Gemini API response
- [ ] Speakers identified and labeled (Speaker 1, 2, 3, etc.)
- [ ] Timestamps included for each segment
- [ ] Confidence scores displayed (if provided)
- [ ] Result stored in application state

---

## Technical Tasks

### Task 2.1: Gemini API Setup

**Estimated Effort**: 2 days

**Subtasks**:

1. Install `@google/generative-ai` package
2. Create environment variable configuration
3. Build `GeminiClient` service class
4. Add error handling and retry logic
5. Add rate limiting to prevent quota exhaustion

**Implementation**:

````typescript
// src/services/geminiClient.ts

import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiClient {
  private genAI: GoogleGenerativeAI
  private model: any
  private requestQueue: Promise<any>[] = []
  private maxConcurrent = 1

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
  }

  async transcribeWithSpeakers(
    audioBlob: Blob,
    options?: TranscriptionOptions
  ): Promise<TranscriptData> {
    // Wait for available slot (rate limiting)
    while (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue)
    }

    const request = this.executeTranscription(audioBlob, options)
    this.requestQueue.push(request)

    try {
      return await request
    } finally {
      this.requestQueue = this.requestQueue.filter(r => r !== request)
    }
  }

  private async executeTranscription(
    audioBlob: Blob,
    options?: TranscriptionOptions
  ): Promise<TranscriptData> {
    const maxRetries = options?.maxRetries ?? 3
    let lastError: Error

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.sendToGemini(audioBlob)
      } catch (error) {
        lastError = error as Error

        // Handle specific errors
        if (error.message.includes('quota')) {
          throw new GeminiQuotaError(
            'API quota exceeded. Please try again later.'
          )
        }

        if (error.message.includes('invalid')) {
          throw new GeminiInvalidAudioError(
            'Invalid audio format. Please try a different file.'
          )
        }

        // Exponential backoff
        if (attempt < maxRetries - 1) {
          await this.sleep(Math.pow(2, attempt) * 1000)
        }
      }
    }

    throw lastError!
  }

  private async sendToGemini(audioBlob: Blob): Promise<TranscriptData> {
    const audioBase64 = await this.blobToBase64(audioBlob)

    const prompt = `
      Transcribe this audio and identify different speakers.

      For each spoken segment, provide:
      - Speaker ID (use "Speaker 1", "Speaker 2", etc.)
      - Start time in seconds (decimal, e.g., 12.5)
      - End time in seconds (decimal, e.g., 18.3)
      - The transcribed text
      - Confidence score (0-1)

      Return ONLY a JSON array with this exact structure (no markdown, no explanation):
      [
        {
          "speaker": "Speaker 1",
          "speakerNumber": 1,
          "startTime": 0.0,
          "endTime": 5.2,
          "text": "Hello everyone, welcome to the meeting.",
          "confidence": 0.95
        },
        ...
      ]
    `

    const result = await this.model.generateContent([
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

    return this.parseGeminiResponse(text)
  }

  private parseGeminiResponse(responseText: string): TranscriptData {
    // Remove markdown code blocks if present
    const cleaned = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const entries: TranscriptEntry[] = JSON.parse(cleaned)

    // Generate unique IDs and extract speakers
    const entriesWithIds = entries.map((entry, index) => ({
      ...entry,
      id: `entry-${Date.now()}-${index}`,
    }))

    const speakers = this.extractSpeakers(entriesWithIds)

    return {
      id: `transcript-${Date.now()}`,
      entries: entriesWithIds,
      speakers,
      metadata: {
        fileName: '',
        fileSize: 0,
        duration: 0,
        createdAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        videoFormat: '',
        model: 'gemini-1.5-pro',
      },
    }
  }

  private extractSpeakers(entries: TranscriptEntry[]): Speaker[] {
    const speakerMap = new Map<number, Speaker>()

    entries.forEach(entry => {
      if (!speakerMap.has(entry.speakerNumber)) {
        speakerMap.set(entry.speakerNumber, {
          id: entry.speakerNumber,
          name: entry.speaker,
          color: this.getSpeakerColor(entry.speakerNumber),
        })
      }
    })

    return Array.from(speakerMap.values()).sort((a, b) => a.id - b.id)
  }

  private getSpeakerColor(speakerNumber: number): string {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#A855F7', // purple
      '#F59E0B', // orange
      '#EF4444', // red
      '#06B6D4', // cyan
    ]
    return colors[(speakerNumber - 1) % colors.length]
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Custom error classes
export class GeminiQuotaError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeminiQuotaError'
  }
}

export class GeminiInvalidAudioError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GeminiInvalidAudioError'
  }
}

interface TranscriptionOptions {
  maxRetries?: number
  language?: string
}
````

**Environment Setup**:

```bash
# .env.local
VITE_GEMINI_API_KEY=your_api_key_here
```

**Testing**:

- Unit tests with mocked Gemini API responses
- Integration tests with MSW to mock HTTP requests
- Error handling tests (quota, invalid audio, network errors)
- Rate limiting tests

---

### Task 2.2: Audio Extraction Service

**Estimated Effort**: 3 days

**Subtasks**:

1. Research best approach (MediaRecorder vs FFmpeg.wasm)
2. Implement audio extraction utility
3. Handle different video formats
4. Optimize for performance and memory
5. Add progress tracking

**Implementation**:

```typescript
// src/services/audioExtractor.ts

export class AudioExtractor {
  async extractAudio(
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = async () => {
        try {
          const audioBlob = await this.captureAudio(video, onProgress)
          resolve(audioBlob)
        } catch (error) {
          reject(error)
        } finally {
          URL.revokeObjectURL(video.src)
        }
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video file'))
      }

      video.src = URL.createObjectURL(videoFile)
    })
  }

  private async captureAudio(
    video: HTMLVideoElement,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Create audio context
    const audioContext = new AudioContext()
    const source = audioContext.createMediaElementSource(video)
    const destination = audioContext.createMediaStreamDestination()

    source.connect(destination)
    source.connect(audioContext.destination)

    // Set up MediaRecorder
    const mediaRecorder = new MediaRecorder(destination.stream, {
      mimeType: 'audio/webm;codecs=opus',
    })

    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        audioContext.close()
        resolve(audioBlob)
      }

      mediaRecorder.onerror = error => {
        audioContext.close()
        reject(error)
      }

      // Start recording
      mediaRecorder.start()

      // Play video (muted) to capture audio
      video.muted = true
      video.play()

      // Track progress
      if (onProgress) {
        const progressInterval = setInterval(() => {
          const progress = (video.currentTime / video.duration) * 100
          onProgress(progress)

          if (video.ended) {
            clearInterval(progressInterval)
          }
        }, 200)
      }

      // Stop when video ends
      video.onended = () => {
        mediaRecorder.stop()
      }
    })
  }
}
```

**Alternative using FFmpeg.wasm** (if MediaRecorder approach has issues):

```typescript
// src/services/audioExtractor.ffmpeg.ts

import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

export class FFmpegAudioExtractor {
  private ffmpeg: FFmpeg
  private loaded = false

  constructor() {
    this.ffmpeg = new FFmpeg()
  }

  async load(): Promise<void> {
    if (this.loaded) return

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    })

    this.loaded = true
  }

  async extractAudio(
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    await this.load()

    // Set up progress tracking
    if (onProgress) {
      this.ffmpeg.on('progress', ({ progress }) => {
        onProgress(progress * 100)
      })
    }

    // Write input file
    await this.ffmpeg.writeFile(
      'input.mp4',
      new Uint8Array(await videoFile.arrayBuffer())
    )

    // Extract audio as WebM (compatible with Gemini)
    await this.ffmpeg.exec([
      '-i',
      'input.mp4',
      '-vn',
      '-acodec',
      'libopus',
      'output.webm',
    ])

    // Read output file
    const data = await this.ffmpeg.readFile('output.webm')

    // Clean up
    await this.ffmpeg.deleteFile('input.mp4')
    await this.ffmpeg.deleteFile('output.webm')

    return new Blob([data], { type: 'audio/webm' })
  }
}
```

**Testing**:

- Test with different video formats (MP4, MOV, WebM)
- Test with videos of varying lengths (short, medium, long)
- Verify audio quality is preserved
- Test progress tracking accuracy
- Memory leak tests

---

### Task 2.3: Processing State Management

**Estimated Effort**: 2 days

**Subtasks**:

1. Create `useTranscription` custom hook
2. Manage processing state transitions
3. Track progress for each step
4. Handle cancellation (optional)

**Implementation**:

```typescript
// src/hooks/useTranscription.ts

import { useState, useCallback } from 'react'
import { GeminiClient } from '../services/geminiClient'
import { AudioExtractor } from '../services/audioExtractor'

export type ProcessingState =
  | 'idle'
  | 'extracting-audio'
  | 'transcribing'
  | 'complete'
  | 'error'

interface UseTranscriptionReturn {
  processingState: ProcessingState
  progress: number
  transcript: TranscriptData | null
  error: Error | null
  startTranscription: (
    videoFile: File,
    metadata: VideoMetadata
  ) => Promise<void>
  reset: () => void
}

export function useTranscription(): UseTranscriptionReturn {
  const [processingState, setProcessingState] =
    useState<ProcessingState>('idle')
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const startTranscription = useCallback(
    async (videoFile: File, metadata: VideoMetadata) => {
      try {
        setError(null)
        setProgress(0)

        // Step 1: Extract audio
        setProcessingState('extracting-audio')
        const audioExtractor = new AudioExtractor()
        const audioBlob = await audioExtractor.extractAudio(
          videoFile,
          audioProgress => {
            setProgress(audioProgress * 0.3) // 0-30%
          }
        )

        // Step 2: Transcribe with Gemini
        setProcessingState('transcribing')
        setProgress(30)

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY
        if (!apiKey) {
          throw new Error('Gemini API key not configured')
        }

        const geminiClient = new GeminiClient(apiKey)
        const result = await geminiClient.transcribeWithSpeakers(audioBlob)

        // Add metadata
        result.metadata = {
          ...result.metadata,
          fileName: videoFile.name,
          fileSize: videoFile.size,
          duration: metadata.duration,
          videoFormat: videoFile.type,
        }

        setProgress(100)
        setTranscript(result)
        setProcessingState('complete')
      } catch (err) {
        setError(err as Error)
        setProcessingState('error')
      }
    },
    []
  )

  const reset = useCallback(() => {
    setProcessingState('idle')
    setProgress(0)
    setTranscript(null)
    setError(null)
  }, [])

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

**Testing**:

- Test state transitions (idle → extracting → transcribing → complete)
- Test error state handling
- Test reset functionality
- Test progress updates

---

### Task 2.4: Update ProcessingStatus Component

**Estimated Effort**: 1 day

**Subtasks**:

1. Connect to real processing state
2. Show detailed step information
3. Add error display with retry option
4. Improve animations and UX

**Updates**:

```typescript
// src/components/ProcessingStatus.tsx

interface ProcessingStatusProps {
  state: ProcessingState
  progress: number
  error: Error | null
  onReset: () => void
  onRetry?: () => void
}

export function ProcessingStatus({
  state,
  progress,
  error,
  onReset,
  onRetry
}: ProcessingStatusProps) {
  const getCurrentStep = () => {
    switch (state) {
      case 'extracting-audio':
        return 'Extracting audio from video...'
      case 'transcribing':
        return 'Transcribing with AI (this may take a few minutes)...'
      case 'complete':
        return 'Transcription complete!'
      case 'error':
        return 'An error occurred'
      default:
        return 'Waiting...'
    }
  }

  return (
    <div className="processing-status">
      {/* Progress bar */}
      <Progress value={progress} />

      {/* Current step */}
      <p>{getCurrentStep()}</p>

      {/* Error handling */}
      {error && (
        <div className="error">
          <p>{error.message}</p>
          {onRetry && <Button onClick={onRetry}>Retry</Button>}
        </div>
      )}

      {/* Reset button */}
      {(state === 'complete' || state === 'error') && (
        <Button onClick={onReset}>Process Another Video</Button>
      )}
    </div>
  )
}
```

---

### Task 2.5: Integration & Testing

**Estimated Effort**: 2 days

**Subtasks**:

1. Update App.tsx to use useTranscription hook
2. Create comprehensive test suite
3. Test with real Gemini API (small test file)
4. Add E2E test with mocked API

**App.tsx Integration**:

```typescript
// src/App.tsx

export default function App() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)

  const {
    processingState,
    progress,
    transcript,
    error,
    startTranscription,
    reset
  } = useTranscription()

  const handleVideoUpload = async (file: File) => {
    // ... (validation logic from Sprint 1)

    const metadata = await extractVideoMetadata(file)
    setVideoFile(file)
    setVideoMetadata(metadata)

    // Start transcription automatically
    await startTranscription(file, metadata)
  }

  const handleReset = () => {
    setVideoFile(null)
    setVideoMetadata(null)
    reset()
  }

  return (
    <div className="app">
      <Header />

      <div className="content">
        {processingState === 'idle' && (
          <UploadVideo onUpload={handleVideoUpload} />
        )}

        {processingState !== 'idle' && (
          <>
            <VideoPreview file={videoFile!} metadata={videoMetadata!} />

            <ProcessingStatus
              state={processingState}
              progress={progress}
              error={error}
              onReset={handleReset}
            />

            {transcript && (
              <TranscriptView transcript={transcript} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

**Testing**:

```typescript
// src/services/geminiClient.test.ts

describe('GeminiClient', () => {
  it('transcribes audio with speaker diarization', async () => {
    const mockResponse = [
      {
        speaker: 'Speaker 1',
        speakerNumber: 1,
        startTime: 0,
        endTime: 5,
        text: 'Hello',
        confidence: 0.95,
      },
    ]

    // Mock Gemini API
    server.use(
      rest.post('*generativelanguage.googleapis.com*', (req, res, ctx) => {
        return res(
          ctx.json({
            candidates: [
              {
                content: {
                  parts: [{ text: JSON.stringify(mockResponse) }],
                },
              },
            ],
          })
        )
      })
    )

    const client = new GeminiClient('test-api-key')
    const audioBlob = new Blob(['audio'], { type: 'audio/webm' })

    const result = await client.transcribeWithSpeakers(audioBlob)

    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].text).toBe('Hello')
    expect(result.speakers).toHaveLength(1)
  })

  it('retries on transient errors', async () => {
    let attempts = 0

    server.use(
      rest.post('*generativelanguage.googleapis.com*', (req, res, ctx) => {
        attempts++
        if (attempts < 3) {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Internal server error' })
          )
        }
        return res(
          ctx.json({ candidates: [{ content: { parts: [{ text: '[]' }] } }] })
        )
      })
    )

    const client = new GeminiClient('test-api-key')
    const audioBlob = new Blob(['audio'], { type: 'audio/webm' })

    await client.transcribeWithSpeakers(audioBlob)

    expect(attempts).toBe(3)
  })
})
```

---

## Definition of Done

Sprint 2 is complete when:

- [ ] All user stories meet acceptance criteria
- [ ] Gemini API integration working with real API
- [ ] Audio extraction functional for all supported formats
- [ ] Processing status shows real-time updates
- [ ] Test coverage ≥ 80%
- [ ] All tests passing (unit, integration, E2E with mocked API)
- [ ] Code reviewed and approved
- [ ] **Working demo**: Upload video → Extract audio → Get real transcript from Gemini
- [ ] Sprint demo presented with live Gemini API call
- [ ] Environment setup documented

---

## Demo Preparation

### Demo Script

1. **Show Gemini API setup**: Display API key configuration (redacted)
2. **Upload short video** (30-60 seconds, 2+ speakers)
3. **Show audio extraction progress** (0-30%)
4. **Show transcription progress** (30-100%)
5. **Display resulting transcript** with speaker labels
6. **Verify accuracy**: Play snippet of video, compare to transcript

### Demo Assets

- 30-60 second video with 2-3 speakers
- Gemini API key with available quota
- Prepared backup (in case of API issues)

---

## Risks & Mitigation

| Risk                                      | Impact | Probability | Mitigation                                           |
| ----------------------------------------- | ------ | ----------- | ---------------------------------------------------- |
| Gemini API quota exhausted during demo    | High   | Medium      | Test with small files; have backup recording         |
| Audio extraction fails on certain formats | High   | Medium      | Test early with multiple formats; add fallback       |
| Gemini response format changes            | Medium | Low         | Robust parsing with validation; clear error messages |
| Slow transcription for long videos        | Medium | High        | Warn users; consider chunking (future enhancement)   |

---

**Sprint 2 Plan Version**: 1.0
**Created**: 2025-12-17
