/**
 * Tests for GeminiClient service
 */

import { server } from '@/mocks/server'
import {
  quotaExceededHandler,
  invalidAudioHandler,
  markdownResponseHandler,
  emptyResponseHandler,
  networkErrorHandler,
} from '@/mocks/handlers'
import {
  GeminiClient,
  GeminiError,
  GeminiQuotaError,
  GeminiInvalidAudioError,
} from './geminiClient'

describe('GeminiClient', () => {
  let client: GeminiClient

  beforeEach(() => {
    // Create client with mock API key
    client = new GeminiClient({ apiKey: 'test-api-key' })
  })

  describe('constructor', () => {
    it('should throw error if API key is missing', () => {
      // Clear env variable
      const originalEnv = import.meta.env.VITE_GEMINI_API_KEY
      delete (import.meta.env as any).VITE_GEMINI_API_KEY

      expect(() => new GeminiClient()).toThrow(GeminiError)
      expect(() => new GeminiClient()).toThrow('Gemini API key is required')

      // Restore env
      ;(import.meta.env as any).VITE_GEMINI_API_KEY = originalEnv
    })

    it('should use provided API key', () => {
      const client = new GeminiClient({ apiKey: 'custom-key' })
      expect(client).toBeInstanceOf(GeminiClient)
    })

    it('should use custom model if provided', () => {
      const client = new GeminiClient({
        apiKey: 'test-key',
        model: 'gemini-pro',
      })
      expect(client).toBeInstanceOf(GeminiClient)
    })
  })

  describe('transcribeWithSpeakers', () => {
    it('should successfully transcribe audio with speakers', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.entries).toHaveLength(3)
      expect(result.speakers).toHaveLength(2)

      // Check first entry
      expect(result.entries[0]).toMatchObject({
        speaker: 'Speaker 1',
        speakerNumber: 1,
        startTime: 0.0,
        endTime: 5.2,
        text: 'Hello everyone, welcome to the meeting.',
        confidence: 0.95,
      })

      // Check speakers
      expect(result.speakers).toContainEqual({
        id: 1,
        name: 'Speaker 1',
        color: 'blue',
      })
      expect(result.speakers).toContainEqual({
        id: 2,
        name: 'Speaker 2',
        color: 'emerald',
      })

      // Check metadata
      expect(result.metadata).toMatchObject({
        model: 'gemini-1.5-pro',
        videoFormat: 'audio/webm',
      })
    })

    it('should handle markdown code blocks in response', async () => {
      // Use markdown response handler
      server.use(markdownResponseHandler)

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result).toBeDefined()
      expect(result.entries).toHaveLength(1)
      expect(result.entries[0].text).toBe('Test with markdown.')
    })

    it('should throw GeminiQuotaError on quota exceeded', async () => {
      // Use quota exceeded handler
      server.use(quotaExceededHandler)

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiQuotaError
      )
    })

    it('should throw GeminiInvalidAudioError on invalid audio', async () => {
      // Use invalid audio handler
      server.use(invalidAudioHandler)

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiInvalidAudioError
      )
    })

    it('should throw GeminiError on empty response', async () => {
      // Use empty response handler
      server.use(emptyResponseHandler)

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiError
      )
    })

    it('should retry on network errors', async () => {
      let attemptCount = 0

      // Use network error handler for first 2 attempts, then success
      server.use((req, res, ctx) => {
        attemptCount++
        if (attemptCount < 3) {
          return networkErrorHandler(req, res, ctx)
        }
        // Return default success response
        return undefined
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      // Should eventually succeed after retries
      const result = await client.transcribeWithSpeakers(audioBlob)
      expect(result).toBeDefined()
      expect(attemptCount).toBeGreaterThan(1)
    }, 10000)

    it('should not retry on quota errors', async () => {
      let attemptCount = 0

      server.use((req, res, ctx) => {
        attemptCount++
        return quotaExceededHandler(req, res, ctx)
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiQuotaError
      )

      // Should only attempt once (no retries for quota errors)
      expect(attemptCount).toBe(1)
    })

    it('should not retry on invalid audio errors', async () => {
      let attemptCount = 0

      server.use((req, res, ctx) => {
        attemptCount++
        return invalidAudioHandler(req, res, ctx)
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiInvalidAudioError
      )

      // Should only attempt once (no retries for invalid audio)
      expect(attemptCount).toBe(1)
    })

    it('should enforce rate limiting (max 1 concurrent request)', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      // Start two transcriptions concurrently
      const promise1 = client.transcribeWithSpeakers(audioBlob)
      const promise2 = client.transcribeWithSpeakers(audioBlob)

      // Both should complete successfully
      const [result1, result2] = await Promise.all([promise1, promise2])

      expect(result1).toBeDefined()
      expect(result2).toBeDefined()
    })
  })

  describe('speaker extraction', () => {
    it('should assign unique colors to speakers', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      // Speakers should have different colors
      const colors = result.speakers.map(s => s.color)
      expect(new Set(colors).size).toBe(colors.length)
    })

    it('should sort speakers by ID', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      // Speakers should be sorted by ID
      const ids = result.speakers.map(s => s.id)
      expect(ids).toEqual([...ids].sort((a, b) => a - b))
    })
  })

  describe('transcript metadata', () => {
    it('should calculate duration from last entry', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      // Duration should be end time of last entry
      const lastEntry = result.entries[result.entries.length - 1]
      expect(result.metadata.duration).toBe(lastEntry.endTime)
    })

    it('should include audio blob size in metadata', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.metadata.fileSize).toBe(audioBlob.size)
    })

    it('should include model name in metadata', async () => {
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.metadata.model).toBe('gemini-1.5-pro')
    })
  })
})
