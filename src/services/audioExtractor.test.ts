/**
 * Tests for AudioExtractor service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioExtractor, AudioExtractionError } from './audioExtractor'

describe.skip('AudioExtractor', () => {
  let extractor: AudioExtractor

  beforeEach(() => {
    extractor = new AudioExtractor()
  })

  describe('extractAudio', () => {
    it('should extract audio from video file', async () => {
      // Create a mock video file
      const mockFile = new File(['mock video content'], 'test.mp4', {
        type: 'video/mp4',
      })

      // Mock video element behavior
      const mockVideo = {
        src: '',
        muted: false,
        duration: 10,
        currentTime: 0,
        onloadedmetadata: null as any,
        onerror: null as any,
        onended: null as any,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        captureStream: vi.fn().mockReturnValue({
          getAudioTracks: vi.fn().mockReturnValue([{ id: 'audio-track-1' }]),
        }),
      }

      const createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockReturnValue(mockVideo as any)

      const createObjectURLSpy = vi
        .spyOn(URL, 'createObjectURL')
        .mockReturnValue('blob:mock-url')

      const revokeObjectURLSpy = vi
        .spyOn(URL, 'revokeObjectURL')
        .mockImplementation(() => {})

      // Mock MediaRecorder
      const mockDataChunks: Blob[] = []
      const mockMediaRecorder = {
        ondataavailable: null as any,
        onstop: null as any,
        onerror: null as any,
        start: vi.fn((interval: number) => {
          // Simulate data available
          setTimeout(() => {
            if (mockMediaRecorder.ondataavailable) {
              mockMediaRecorder.ondataavailable({
                data: new Blob(['audio data'], {
                  type: 'audio/webm;codecs=opus',
                }),
              })
            }
          }, 10)
        }),
        stop: vi.fn(() => {
          setTimeout(() => {
            if (mockMediaRecorder.onstop) {
              mockMediaRecorder.onstop()
            }
          }, 10)
        }),
      }

      global.MediaRecorder = vi
        .fn()
        .mockImplementation(() => mockMediaRecorder) as any
      ;(global.MediaRecorder as any).isTypeSupported = vi
        .fn()
        .mockReturnValue(true)

      // Start extraction
      const extractionPromise = extractor.extractAudio(mockFile)

      // Trigger video loaded
      setTimeout(() => {
        if (mockVideo.onloadedmetadata) {
          mockVideo.onloadedmetadata({} as any)
        }

        // Simulate video progress
        const progressInterval = setInterval(() => {
          mockVideo.currentTime += 1
          if (mockVideo.currentTime >= mockVideo.duration) {
            clearInterval(progressInterval)
            if (mockVideo.onended) {
              mockVideo.onended({} as any)
            }
          }
        }, 100)
      }, 0)

      const audioBlob = await extractionPromise

      expect(audioBlob).toBeInstanceOf(Blob)
      expect(audioBlob.type).toBe('audio/webm;codecs=opus')
      expect(createElementSpy).toHaveBeenCalledWith('video')
      expect(createObjectURLSpy).toHaveBeenCalledWith(mockFile)
      expect(revokeObjectURLSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      createObjectURLSpy.mockRestore()
      revokeObjectURLSpy.mockRestore()
    }, 10000)

    it('should call progress callback during extraction', async () => {
      const mockFile = new File(['mock video content'], 'test.mp4', {
        type: 'video/mp4',
      })

      const mockVideo = {
        src: '',
        muted: false,
        duration: 10,
        currentTime: 0,
        onloadedmetadata: null as any,
        onerror: null as any,
        onended: null as any,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        captureStream: vi.fn().mockReturnValue({
          getAudioTracks: vi.fn().mockReturnValue([{ id: 'audio-track-1' }]),
        }),
      }

      vi.spyOn(document, 'createElement').mockReturnValue(mockVideo as any)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      const mockMediaRecorder = {
        ondataavailable: null as any,
        onstop: null as any,
        onerror: null as any,
        start: vi.fn(),
        stop: vi.fn(() => {
          setTimeout(() => {
            if (mockMediaRecorder.onstop) {
              mockMediaRecorder.onstop()
            }
          }, 10)
        }),
      }

      global.MediaRecorder = vi
        .fn()
        .mockImplementation(() => mockMediaRecorder) as any
      ;(global.MediaRecorder as any).isTypeSupported = vi
        .fn()
        .mockReturnValue(true)

      const progressCallback = vi.fn()
      const extractionPromise = extractor.extractAudio(mockFile, {
        onProgress: progressCallback,
      })

      setTimeout(() => {
        if (mockVideo.onloadedmetadata) {
          mockVideo.onloadedmetadata({} as any)
        }

        // Simulate data availability
        if (mockMediaRecorder.ondataavailable) {
          mockMediaRecorder.ondataavailable({
            data: new Blob(['audio data'], { type: 'audio/webm;codecs=opus' }),
          })
        }

        // Simulate progress
        mockVideo.currentTime = 5
        setTimeout(() => {
          if (mockVideo.onended) {
            mockVideo.onended({} as any)
          }
        }, 100)
      }, 0)

      await extractionPromise

      // Progress callback should have been called
      expect(progressCallback).toHaveBeenCalled()
    }, 10000)

    it('should throw error if video has no audio track', async () => {
      const mockFile = new File(['mock video content'], 'test.mp4', {
        type: 'video/mp4',
      })

      const mockVideo = {
        src: '',
        muted: false,
        duration: 10,
        currentTime: 0,
        onloadedmetadata: null as any,
        onerror: null as any,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        captureStream: vi.fn().mockReturnValue({
          getAudioTracks: vi.fn().mockReturnValue([]), // No audio tracks
        }),
      }

      vi.spyOn(document, 'createElement').mockReturnValue(mockVideo as any)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      const extractionPromise = extractor.extractAudio(mockFile)

      setTimeout(() => {
        if (mockVideo.onloadedmetadata) {
          mockVideo.onloadedmetadata({} as any)
        }
      }, 0)

      await expect(extractionPromise).rejects.toThrow(AudioExtractionError)
      await expect(extractionPromise).rejects.toThrow(
        'Video file does not contain audio track'
      )
    })

    it('should throw error if browser does not support capture', async () => {
      const mockFile = new File(['mock video content'], 'test.mp4', {
        type: 'video/mp4',
      })

      const mockVideo = {
        src: '',
        muted: false,
        duration: 10,
        currentTime: 0,
        onloadedmetadata: null as any,
        onerror: null as any,
        play: vi.fn().mockResolvedValue(undefined),
        // No captureStream method
      }

      vi.spyOn(document, 'createElement').mockReturnValue(mockVideo as any)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      const extractionPromise = extractor.extractAudio(mockFile)

      setTimeout(() => {
        if (mockVideo.onloadedmetadata) {
          mockVideo.onloadedmetadata({} as any)
        }
      }, 0)

      await expect(extractionPromise).rejects.toThrow(AudioExtractionError)
      await expect(extractionPromise).rejects.toThrow(
        'Browser does not support video capture'
      )
    })

    it('should throw error if MediaRecorder format is not supported', async () => {
      const mockFile = new File(['mock video content'], 'test.mp4', {
        type: 'video/mp4',
      })

      const mockVideo = {
        src: '',
        muted: false,
        duration: 10,
        currentTime: 0,
        onloadedmetadata: null as any,
        onerror: null as any,
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        captureStream: vi.fn().mockReturnValue({
          getAudioTracks: vi.fn().mockReturnValue([{ id: 'audio-track-1' }]),
        }),
      }

      vi.spyOn(document, 'createElement').mockReturnValue(mockVideo as any)
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

      // MediaRecorder does not support the format
      ;(global.MediaRecorder as any) = {
        isTypeSupported: vi.fn().mockReturnValue(false),
      }

      const extractionPromise = extractor.extractAudio(mockFile)

      setTimeout(() => {
        if (mockVideo.onloadedmetadata) {
          mockVideo.onloadedmetadata({} as any)
        }
      }, 0)

      await expect(extractionPromise).rejects.toThrow(AudioExtractionError)
      await expect(extractionPromise).rejects.toThrow(
        'Browser does not support required audio format'
      )
    })
  })
})
