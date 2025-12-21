/**
 * Tests for useTranscription hook
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useTranscription } from './useTranscription'
import type { VideoMetadata } from '@/utils/fileUtils'
import * as audioExtractorModule from '@/services/audioExtractor'
import * as geminiClientModule from '@transcript-parser/ai-services'

// Mock the services
jest.mock('@/services/audioExtractor')
jest.mock('@/services/geminiClient')

describe('useTranscription', () => {
  const mockVideoMetadata: VideoMetadata = {
    duration: 60,
    width: 1920,
    height: 1080,
    format: 'video/mp4',
    size: 1024000,
  }

  const mockTranscriptData = {
    id: 'test-transcript',
    entries: [
      {
        id: '1',
        speaker: 'Speaker 1',
        speakerNumber: 1,
        startTime: 0,
        endTime: 5,
        text: 'Hello',
        confidence: 0.95,
      },
    ],
    speakers: [
      {
        id: 1,
        name: 'Speaker 1',
        color: 'blue',
      },
    ],
    metadata: {
      fileName: 'audio.webm',
      fileSize: 1024,
      duration: 5,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      videoFormat: 'audio/webm',
      model: 'gemini-1.5-pro',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    const mockAudioBlob = new Blob(['audio'], {
      type: 'audio/webm;codecs=opus',
    })

    const MockAudioExtractor = jest.fn().mockImplementation(() => ({
      extractAudio: jest.fn().mockImplementation(async (file, options) => {
        // Simulate progress
        if (options?.onProgress) {
          for (let i = 0; i <= 100; i += 20) {
            options.onProgress(i)
            await new Promise(resolve => setTimeout(resolve, 10))
          }
        }
        return mockAudioBlob
      }),
    }))

    const MockGeminiClient = jest.fn().mockImplementation(() => ({
      transcribeWithSpeakers: jest.fn().mockResolvedValue(mockTranscriptData),
    }))

    ;(audioExtractorModule as any).AudioExtractor = MockAudioExtractor
    ;(geminiClientModule as any).GeminiClient = MockGeminiClient
  })

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useTranscription())

    expect(result.current.processingState).toBe('idle')
    expect(result.current.progress).toBe(0)
    expect(result.current.transcript).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should process transcription successfully', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    await act(async () => {
      await result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    expect(result.current.processingState).toBe('complete')
    expect(result.current.progress).toBe(100)
    expect(result.current.transcript).toBeDefined()
    expect(result.current.error).toBeNull()
  })

  it('should transition through processing states', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    const states: string[] = []

    act(() => {
      result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    // Record initial state
    states.push(result.current.processingState)

    await waitFor(
      () => {
        if (
          result.current.processingState === 'extracting-audio' &&
          !states.includes('extracting-audio')
        ) {
          states.push('extracting-audio')
        }
        if (
          result.current.processingState === 'transcribing' &&
          !states.includes('transcribing')
        ) {
          states.push('transcribing')
        }
        if (
          result.current.processingState === 'complete' &&
          !states.includes('complete')
        ) {
          states.push('complete')
        }
        expect(result.current.processingState).toBe('complete')
      },
      { timeout: 5000 }
    )

    expect(states).toContain('extracting-audio')
    expect(states).toContain('transcribing')
    expect(states).toContain('complete')
  })

  it('should update progress during audio extraction', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    act(() => {
      result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    await waitFor(() => {
      expect(result.current.progress).toBeGreaterThan(0)
    })

    await waitFor(() => {
      expect(result.current.processingState).toBe('complete')
    })
  })

  it('should handle extraction errors', async () => {
    const extractionError = new Error('Audio extraction failed')

    const MockAudioExtractor = jest.fn().mockImplementation(() => ({
      extractAudio: jest.fn().mockRejectedValue(extractionError),
    }))

    ;(audioExtractorModule as any).AudioExtractor = MockAudioExtractor

    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    await act(async () => {
      try {
        await result.current.startTranscription(mockFile, mockVideoMetadata)
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.processingState).toBe('error')
    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toBe('Audio extraction failed')
  })

  it('should handle transcription errors', async () => {
    const transcriptionError = new Error('Transcription failed')

    const MockGeminiClient = jest.fn().mockImplementation(() => ({
      transcribeWithSpeakers: jest.fn().mockRejectedValue(transcriptionError),
    }))

    ;(geminiClientModule as any).GeminiClient = MockGeminiClient

    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    await act(async () => {
      try {
        await result.current.startTranscription(mockFile, mockVideoMetadata)
      } catch (error) {
        // Expected to throw
      }
    })

    expect(result.current.processingState).toBe('error')
    expect(result.current.error).toBeDefined()
    expect(result.current.error?.message).toBe('Transcription failed')
  })

  it('should reset state when reset is called', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    // Process transcription
    await act(async () => {
      await result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    expect(result.current.processingState).toBe('complete')
    expect(result.current.transcript).toBeDefined()

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.processingState).toBe('idle')
    expect(result.current.progress).toBe(0)
    expect(result.current.transcript).toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('should update transcript metadata with video information', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    await act(async () => {
      await result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    expect(result.current.transcript?.metadata.fileName).toBe('test.mp4')
    expect(result.current.transcript?.metadata.fileSize).toBe(mockFile.size)
    expect(result.current.transcript?.metadata.duration).toBe(
      mockVideoMetadata.duration
    )
    expect(result.current.transcript?.metadata.videoFormat).toBe(
      mockVideoMetadata.format
    )
  })

  it('should clear error when starting new transcription', async () => {
    const { result } = renderHook(() => useTranscription())

    const mockFile = new File(['video'], 'test.mp4', { type: 'video/mp4' })

    // First, create an error
    const extractionError = new Error('First error')
    const MockAudioExtractor = jest.fn().mockImplementation(() => ({
      extractAudio: jest.fn().mockRejectedValue(extractionError),
    }))
    ;(audioExtractorModule as any).AudioExtractor = MockAudioExtractor

    await act(async () => {
      try {
        await result.current.startTranscription(mockFile, mockVideoMetadata)
      } catch (error) {
        // Expected
      }
    })

    expect(result.current.error).toBeDefined()

    // Now fix the mock and try again
    const MockAudioExtractorSuccess = jest.fn().mockImplementation(() => ({
      extractAudio: jest
        .fn()
        .mockResolvedValue(
          new Blob(['audio'], { type: 'audio/webm;codecs=opus' })
        ),
    }))
    ;(audioExtractorModule as any).AudioExtractor = MockAudioExtractorSuccess

    await act(async () => {
      await result.current.startTranscription(mockFile, mockVideoMetadata)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.processingState).toBe('complete')
  })
})
