import { describe, it, expect } from 'vitest'
import { AudioExtractor, AudioExtractionError } from './audio-extractor'

describe('AudioExtractionError', () => {
  it('should create error with message and code', () => {
    const error = new AudioExtractionError('Test error', 'TEST_CODE')

    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(AudioExtractionError)
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.name).toBe('AudioExtractionError')
  })

  it('should preserve error properties', () => {
    const error = new AudioExtractionError(
      'Video load failed',
      'VIDEO_LOAD_ERROR'
    )

    expect(error.code).toBe('VIDEO_LOAD_ERROR')
    expect(error.message).toBe('Video load failed')
  })
})

describe('AudioExtractor', () => {
  it('should create an instance', () => {
    const extractor = new AudioExtractor()

    expect(extractor).toBeInstanceOf(AudioExtractor)
    expect(extractor.extractAudio).toBeInstanceOf(Function)
  })

  it('should have extractAudio method', () => {
    const extractor = new AudioExtractor()

    expect(typeof extractor.extractAudio).toBe('function')
  })

  // Note: Full integration tests for extractAudio are skipped as they require
  // complex DOM mocking (video element, MediaRecorder, captureStream, etc.)
  // These would be better suited for E2E tests in a real browser environment
})
