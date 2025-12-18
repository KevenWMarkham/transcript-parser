import { describe, it, expect } from '@jest/globals'
import {
  formatFileSize,
  formatDuration,
  validateVideoFile,
  MAX_FILE_SIZE,
} from './fileUtils'

describe('fileUtils', () => {
  describe('formatFileSize', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
    })

    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes')
    })

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1536)).toBe('1.5 KB')
    })

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1.5 * 1024 * 1024)).toBe('1.5 MB')
    })

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2 GB')
    })

    it('rounds to 2 decimal places', () => {
      expect(formatFileSize(1234567)).toBe('1.18 MB')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds only', () => {
      expect(formatDuration(45)).toBe('0:45')
    })

    it('formats minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2:05')
      expect(formatDuration(65)).toBe('1:05')
    })

    it('formats hours, minutes, and seconds', () => {
      expect(formatDuration(3661)).toBe('1:01:01')
      expect(formatDuration(7384)).toBe('2:03:04')
    })

    it('pads single digits with zeros', () => {
      expect(formatDuration(5)).toBe('0:05')
      expect(formatDuration(305)).toBe('5:05')
    })

    it('handles 0 seconds', () => {
      expect(formatDuration(0)).toBe('0:00')
    })
  })

  describe('validateVideoFile', () => {
    it('accepts valid MP4 files', () => {
      const file = new File(['content'], 'video.mp4', { type: 'video/mp4' })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('accepts valid MOV files', () => {
      const file = new File(['content'], 'video.mov', {
        type: 'video/quicktime',
      })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts valid AVI files', () => {
      const file = new File(['content'], 'video.avi', {
        type: 'video/x-msvideo',
      })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
    })

    it('accepts valid WebM files', () => {
      const file = new File(['content'], 'video.webm', { type: 'video/webm' })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
    })

    it('rejects invalid file types', () => {
      const file = new File(['content'], 'document.pdf', {
        type: 'application/pdf',
      })
      const result = validateVideoFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe(
        'Invalid file type. Please select a video file (MP4, MOV, AVI, WebM).'
      )
    })

    it('rejects files exceeding max size', () => {
      const largeFile = new File(['content'], 'large.mp4', {
        type: 'video/mp4',
      })

      // Mock the size property to exceed MAX_FILE_SIZE
      Object.defineProperty(largeFile, 'size', {
        value: MAX_FILE_SIZE + 1,
        writable: false,
      })

      const result = validateVideoFile(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('File too large')
      expect(result.error).toContain('2 GB')
    })

    it('accepts files exactly at max size', () => {
      const file = new File(['content'], 'video.mp4', { type: 'video/mp4' })

      Object.defineProperty(file, 'size', {
        value: MAX_FILE_SIZE,
        writable: false,
      })

      const result = validateVideoFile(file)
      expect(result.valid).toBe(true)
    })
  })
})
