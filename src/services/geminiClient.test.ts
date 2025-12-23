/**
 * Tests for GeminiClient service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  GeminiClient,
  GeminiError,
  GeminiQuotaError,
  GeminiInvalidAudioError,
} from './geminiClient'

// Mock @google/genai
const mockGenerateContent = vi.fn()

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      constructor() {
        return {
          models: {
            generateContent: mockGenerateContent,
          },
        }
      }
    },
  }
})

// Mock usage tracker and api client
vi.mock('./usage-tracker', () => ({
  usageTracker: {
    track: vi.fn(),
  },
}))

vi.mock('./api-client', () => ({
  apiClient: {
    getCurrentUser: vi.fn().mockReturnValue({ id: 1 }),
  },
}))

describe('GeminiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Default mock response
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify([
        {
          speaker: 'Speaker 1',
          speakerNumber: 1,
          startTime: 0.0,
          endTime: 5.2,
          text: 'Hello everyone, welcome to the meeting.',
          confidence: 0.95,
        },
        {
          speaker: 'Speaker 2',
          speakerNumber: 2,
          startTime: 5.2,
          endTime: 10.5,
          text: 'Thanks for having me.',
          confidence: 0.93,
        },
        {
          speaker: 'Speaker 1',
          speakerNumber: 1,
          startTime: 10.5,
          endTime: 15.0,
          text: "Let's get started with the agenda.",
          confidence: 0.97,
        },
      ]),
      usageMetadata: {
        promptTokenCount: 100,
        candidatesTokenCount: 50,
        totalTokenCount: 150,
      },
    })
  })

  describe('constructor', () => {
    it('should throw error if API key is missing', () => {
      // Clear env variable and localStorage
      const originalEnv = import.meta.env.VITE_GEMINI_API_KEY
      delete (import.meta.env as any).VITE_GEMINI_API_KEY
      localStorage.clear()

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
      const client = new GeminiClient({ apiKey: 'test-api-key' })
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
        model: 'gemini-2.5-flash',
        videoFormat: 'audio/webm',
      })
    })

    it('should handle markdown code blocks in response', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      // Mock response with markdown
      mockGenerateContent.mockResolvedValueOnce({
        text: `\`\`\`json
${JSON.stringify([
  {
    speaker: 'Speaker 1',
    speakerNumber: 1,
    startTime: 0.0,
    endTime: 3.0,
    text: 'Test with markdown.',
    confidence: 0.9,
  },
])}
\`\`\``,
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
          totalTokenCount: 150,
        },
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0].text).toBe('Test with markdown.')
    })

    it('should throw GeminiQuotaError on quota exceeded', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockRejectedValueOnce(
        new Error('Resource has been exhausted (e.g. check quota).')
      )

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiQuotaError
      )
    })

    it('should throw GeminiInvalidAudioError on invalid audio', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockRejectedValueOnce(
        new Error('Invalid audio format or corrupted file.')
      )

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiInvalidAudioError
      )
    })

    it.skip('should throw GeminiError on empty response', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockResolvedValue({
        text: '',
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 0,
          totalTokenCount: 100,
        },
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiError
      )
      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        'Empty response from Gemini API'
      )
    })

    it.skip('should retry on network errors', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      let callCount = 0
      // Fail twice, then succeed
      mockGenerateContent.mockImplementation(() => {
        callCount++
        if (callCount <= 2) {
          return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
          text: JSON.stringify([
            {
              speaker: 'Speaker 1',
              speakerNumber: 1,
              startTime: 0.0,
              endTime: 5.0,
              text: 'Success after retry',
              confidence: 0.95,
            },
          ]),
          usageMetadata: {
            promptTokenCount: 100,
            candidatesTokenCount: 50,
            totalTokenCount: 150,
          },
        })
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.entries).toHaveLength(1)
      expect(result.entries[0].text).toBe('Success after retry')
      expect(callCount).toBe(3)
    }, 10000)

    it('should not retry on quota errors', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockRejectedValue(
        new Error('Resource has been exhausted (e.g. check quota).')
      )

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiQuotaError
      )

      // Should only be called once (no retries)
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)
    })

    it('should not retry on invalid audio errors', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockRejectedValue(
        new Error('Invalid audio format or corrupted file.')
      )

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await expect(client.transcribeWithSpeakers(audioBlob)).rejects.toThrow(
        GeminiInvalidAudioError
      )

      // Should only be called once (no retries)
      expect(mockGenerateContent).toHaveBeenCalledTimes(1)
    })

    it('should call onEntryComplete callback for each entry', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })
      const onEntryComplete = vi.fn()

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      await client.transcribeWithSpeakers(audioBlob, { onEntryComplete })

      expect(onEntryComplete).toHaveBeenCalledTimes(3)
      expect(onEntryComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          speaker: 'Speaker 1',
          text: 'Hello everyone, welcome to the meeting.',
        })
      )
    })
  })

  describe('speaker extraction', () => {
    it('should assign unique colors to speakers', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.speakers[0].color).toBe('blue')
      expect(result.speakers[1].color).toBe('emerald')
    })

    it('should sort speakers by ID', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })

      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify([
          {
            speaker: 'Speaker 2',
            speakerNumber: 2,
            startTime: 0.0,
            endTime: 5.0,
            text: 'Second speaker',
            confidence: 0.9,
          },
          {
            speaker: 'Speaker 1',
            speakerNumber: 1,
            startTime: 5.0,
            endTime: 10.0,
            text: 'First speaker',
            confidence: 0.9,
          },
        ]),
        usageMetadata: {
          promptTokenCount: 100,
          candidatesTokenCount: 50,
          totalTokenCount: 150,
        },
      })

      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.speakers[0].id).toBe(1)
      expect(result.speakers[1].id).toBe(2)
    })
  })

  describe('transcript metadata', () => {
    it('should calculate duration from last entry', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.metadata.duration).toBe(15.0)
    })

    it('should include audio blob size in metadata', async () => {
      const client = new GeminiClient({ apiKey: 'test-api-key' })
      const audioBlob = new Blob(['mock audio content'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.metadata.fileSize).toBe(audioBlob.size)
    })

    it('should include model name in metadata', async () => {
      const client = new GeminiClient({
        apiKey: 'test-api-key',
        model: 'gemini-2.5-flash',
      })
      const audioBlob = new Blob(['mock audio'], {
        type: 'audio/webm;codecs=opus',
      })

      const result = await client.transcribeWithSpeakers(audioBlob)

      expect(result.metadata.model).toBe('gemini-2.5-flash')
    })
  })
})
