/**
 * GeminiClient service - handles AI transcription with speaker diarization
 * Uses Google Gemini 2.5 Flash for audio/video transcription
 */

import { GoogleGenAI } from '@google/genai'
import { usageTracker } from '@/services/usageTracker'
import { apiClient } from '@/services/apiClient'
import type {
  TranscriptData,
  TranscriptEntry,
  Speaker,
} from '@/types/transcript'

export interface TranscriptionOptions {
  apiKey?: string
  model?: string
  onEntryComplete?: (entry: TranscriptEntry) => void
}

export interface GeminiResponse {
  speaker: string
  speakerNumber: number
  startTime: number
  endTime: number
  text: string
  confidence: number
}

// Custom error classes
export class GeminiError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

export class GeminiQuotaError extends GeminiError {
  constructor(message: string = 'API quota exceeded or rate limit reached') {
    super(message, 'QUOTA_EXCEEDED')
    this.name = 'GeminiQuotaError'
  }
}

export class GeminiInvalidAudioError extends GeminiError {
  constructor(message: string = 'Invalid or corrupted audio file') {
    super(message, 'INVALID_AUDIO')
    this.name = 'GeminiInvalidAudioError'
  }
}

// Hardcoded API key for beta/access code mode (production builds)
const BETA_API_KEY = 'AIzaSyB8DYs1TQdd6FmzEsFhKHdBRaquSyD2cdY'

export class GeminiClient {
  private ai: GoogleGenAI
  private model: string
  private activeRequests = 0
  private readonly MAX_CONCURRENT = 1
  private readonly MAX_RETRIES = 3
  private readonly RETRY_DELAY = 1000 // ms

  constructor(options?: TranscriptionOptions) {
    // Priority: 1) options.apiKey, 2) localStorage config, 3) env variable, 4) hardcoded beta key
    let apiKey = options?.apiKey

    if (!apiKey) {
      // Try to load from localStorage
      try {
        const stored = localStorage.getItem('gemini_api_config')
        if (stored) {
          const config = JSON.parse(stored)
          if (config.mode === 'own' && config.ownKey) {
            apiKey = config.ownKey
          } else if (config.mode === 'code' && config.accessCode) {
            // In code mode, use environment key (dev) or hardcoded beta key (production)
            apiKey = import.meta.env.VITE_GEMINI_API_KEY || BETA_API_KEY
          }
        }
      } catch (error) {
        console.warn('Failed to load API config from localStorage:', error)
      }
    }

    // Fall back to environment variable or hardcoded beta key
    if (!apiKey) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY || BETA_API_KEY
    }

    if (!apiKey) {
      throw new GeminiError('Gemini API key is required', 'MISSING_API_KEY')
    }

    this.ai = new GoogleGenAI({ apiKey })
    // Use gemini-2.5-flash for audio/video transcription
    this.model = options?.model || 'gemini-2.5-flash'
  }

  /**
   * Transcribe audio with speaker diarization
   * @param audioBlob - Audio blob in webm/opus format
   * @param options - Additional options
   * @returns Transcript data with speakers and entries
   */
  async transcribeWithSpeakers(
    audioBlob: Blob,
    options?: TranscriptionOptions
  ): Promise<TranscriptData> {
    // Rate limiting - wait if max concurrent requests reached
    while (this.activeRequests >= this.MAX_CONCURRENT) {
      await this.delay(100)
    }

    this.activeRequests++

    try {
      return await this.retryWithBackoff(async () => {
        return await this.performTranscription(
          audioBlob,
          options?.onEntryComplete
        )
      })
    } finally {
      this.activeRequests--
    }
  }

  /**
   * Perform actual transcription with Gemini API
   */
  private async performTranscription(
    audioBlob: Blob,
    onEntryComplete?: (entry: TranscriptEntry) => void
  ): Promise<TranscriptData> {
    try {
      console.log(`Starting transcription with model: ${this.model}`)
      console.log(`Blob size: ${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`)
      console.log(`Blob type: ${audioBlob.type}`)

      // Convert blob to base64
      console.log('Converting blob to base64...')
      const audioBase64 = await this.blobToBase64(audioBlob)
      console.log(`Base64 length: ${audioBase64.length} characters`)

      // Craft prompt for speaker diarization
      const prompt = `
Transcribe this media file and identify different speakers.

For each segment, provide:
- Speaker ID (use "Speaker 1", "Speaker 2", etc.)
- Speaker number (integer: 1, 2, 3, etc.)
- Start time in seconds (decimal, e.g., 12.5)
- End time in seconds (decimal, e.g., 18.3)
- Transcribed text
- Confidence score (0-1, e.g., 0.95)

Return ONLY a JSON array with this exact structure (no markdown, no code blocks, no explanation):
[
  {
    "speaker": "Speaker 1",
    "speakerNumber": 1,
    "startTime": 0.0,
    "endTime": 5.2,
    "text": "Hello everyone",
    "confidence": 0.95
  }
]
      `.trim()

      // Send request to Gemini with inline data using new SDK
      const response = await this.ai.models.generateContent({
        model: this.model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: audioBase64,
                  mimeType: audioBlob.type,
                },
              },
            ],
          },
        ],
      })

      const text = response.text

      if (!text) {
        throw new GeminiError(
          'Empty response from Gemini API',
          'EMPTY_RESPONSE'
        )
      }

      // Track usage and cost
      const usageMetadata = response.usageMetadata
      if (usageMetadata) {
        const currentUser = apiClient.getCurrentUser()
        if (currentUser) {
          usageTracker.track({
            userId: currentUser.id || 1,
            model: this.model,
            operation: 'Video Transcription',
            inputTokens: usageMetadata.promptTokenCount || 0,
            outputTokens: usageMetadata.candidatesTokenCount || 0,
            totalTokens: usageMetadata.totalTokenCount || 0,
            metadata: {
              fileSize: `${(audioBlob.size / 1024 / 1024).toFixed(2)} MB`,
              audioType: audioBlob.type,
            },
          })
        }
      }

      // Parse response
      const entries = this.parseResponse(text)

      if (entries.length === 0) {
        throw new GeminiError(
          'No transcript entries found in response',
          'NO_ENTRIES'
        )
      }

      // Extract unique speakers
      const speakers = this.extractSpeakers(entries)

      // Generate transcript data and emit entries if callback provided
      const transcriptEntries: TranscriptEntry[] = entries.map(
        (entry, index) => {
          const transcriptEntry: TranscriptEntry = {
            id: String(index + 1),
            speaker: entry.speaker,
            speakerNumber: entry.speakerNumber,
            startTime: entry.startTime,
            endTime: entry.endTime,
            text: entry.text,
            confidence: entry.confidence,
          }

          // Emit entry if callback is provided
          if (onEntryComplete) {
            onEntryComplete(transcriptEntry)
          }

          return transcriptEntry
        }
      )

      const transcriptData: TranscriptData = {
        id: this.generateId(),
        entries: transcriptEntries,
        speakers,
        metadata: {
          fileName: 'audio.webm',
          fileSize: audioBlob.size,
          duration: entries[entries.length - 1]?.endTime || 0,
          createdAt: new Date().toISOString(),
          processedAt: new Date().toISOString(),
          videoFormat: 'audio/webm',
          model: this.model,
        },
      }

      return transcriptData
    } catch (error) {
      // Map Gemini errors to custom error types
      if (error instanceof Error) {
        const message = error.message.toLowerCase()

        if (message.includes('quota') || message.includes('rate limit')) {
          throw new GeminiQuotaError(error.message)
        }

        if (
          message.includes('invalid') ||
          message.includes('corrupt') ||
          message.includes('audio')
        ) {
          throw new GeminiInvalidAudioError(error.message)
        }

        if (error instanceof GeminiError) {
          throw error
        }

        throw new GeminiError(
          `Transcription failed: ${error.message}`,
          'TRANSCRIPTION_ERROR'
        )
      }

      throw new GeminiError(
        'Unknown error during transcription',
        'UNKNOWN_ERROR'
      )
    }
  }

  /**
   * Parse Gemini response and clean up markdown
   */
  private parseResponse(text: string): GeminiResponse[] {
    try {
      // Remove markdown code blocks if present
      let cleanedText = text.trim()

      // Remove ```json and ``` markers
      cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, '')
      cleanedText = cleanedText.replace(/```\s*$/, '')
      cleanedText = cleanedText.trim()

      // Parse JSON
      const parsed = JSON.parse(cleanedText)

      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array')
      }

      // Validate structure
      return parsed.map((entry, index) => {
        if (
          typeof entry.speaker !== 'string' ||
          typeof entry.speakerNumber !== 'number' ||
          typeof entry.startTime !== 'number' ||
          typeof entry.endTime !== 'number' ||
          typeof entry.text !== 'string' ||
          (entry.confidence !== undefined &&
            typeof entry.confidence !== 'number')
        ) {
          throw new Error(`Invalid entry structure at index ${index}`)
        }

        return {
          speaker: entry.speaker,
          speakerNumber: entry.speakerNumber,
          startTime: entry.startTime,
          endTime: entry.endTime,
          text: entry.text,
          confidence: entry.confidence || 0.5,
        }
      })
    } catch (error) {
      throw new GeminiError(
        `Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PARSE_ERROR'
      )
    }
  }

  /**
   * Extract unique speakers from transcript entries
   */
  private extractSpeakers(entries: GeminiResponse[]): Speaker[] {
    const speakerMap = new Map<number, string>()

    entries.forEach(entry => {
      if (!speakerMap.has(entry.speakerNumber)) {
        speakerMap.set(entry.speakerNumber, entry.speaker)
      }
    })

    const colors = ['blue', 'emerald', 'purple', 'orange', 'pink', 'cyan']

    return Array.from(speakerMap.entries())
      .map(([number, name]) => ({
        id: number,
        name,
        color: colors[(number - 1) % colors.length],
      }))
      .sort((a, b) => a.id - b.id)
  }

  /**
   * Retry logic with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      // Don't retry on quota or invalid audio errors
      if (
        error instanceof GeminiQuotaError ||
        error instanceof GeminiInvalidAudioError
      ) {
        throw error
      }

      if (attempt >= this.MAX_RETRIES) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = this.RETRY_DELAY * Math.pow(2, attempt - 1)
      await this.delay(delay)

      return this.retryWithBackoff(fn, attempt + 1)
    }
  }

  /**
   * Convert blob to base64
   */
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

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `transcript-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}
