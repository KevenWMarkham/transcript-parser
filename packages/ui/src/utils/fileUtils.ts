/**
 * File utility functions for video file handling
 */

export const ACCEPTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/x-msvideo', // AVI
  'video/webm',
]

export const ACCEPTED_AUDIO_FORMATS = [
  'audio/mpeg', // MP3
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/mp4', // M4A
  'audio/x-m4a',
  'audio/webm',
  'audio/ogg',
]

export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB

export interface ValidationResult {
  valid: boolean
  error?: string
}

export interface VideoMetadata {
  duration: number // seconds
  width: number
  height: number
  format: string
  size: number
}

/**
 * Formats bytes to human-readable file size
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formats seconds to duration string
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1:23" or "1:23:45")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(secs)}`
  }
  return `${minutes}:${pad(secs)}`
}

/**
 * Formats seconds to timestamp string (for transcript entries)
 * @param seconds - Time in seconds (can be decimal, e.g., 5.2)
 * @returns Formatted string (e.g., "0:05" or "1:23:45")
 */
export function formatTimestamp(seconds: number): string {
  return formatDuration(seconds)
}

/**
 * Pads number with leading zero
 */
function pad(num: number): string {
  return num.toString().padStart(2, '0')
}

/**
 * Check if file is audio-only
 */
export function isAudioFile(file: File): boolean {
  return ACCEPTED_AUDIO_FORMATS.includes(file.type)
}

/**
 * Validates video or audio file type and size
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateVideoFile(file: File): ValidationResult {
  const isVideo = ACCEPTED_VIDEO_FORMATS.includes(file.type)
  const isAudio = ACCEPTED_AUDIO_FORMATS.includes(file.type)

  if (!isVideo && !isAudio) {
    return {
      valid: false,
      error:
        'Invalid file type. Please select a video (MP4, MOV, WebM) or audio file (MP3, WAV, M4A recommended).',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
    }
  }

  return { valid: true }
}

/**
 * Extracts metadata from video or audio file
 * @param file - Video or audio file
 * @returns Promise with video metadata
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    // Handle audio files
    if (isAudioFile(file)) {
      const audio = document.createElement('audio')
      audio.preload = 'metadata'

      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(audio.src)

        resolve({
          duration: audio.duration,
          width: 0,
          height: 0,
          format: file.type,
          size: file.size,
        })
      }

      audio.onerror = () => {
        URL.revokeObjectURL(audio.src)
        reject(new Error('Unable to read audio file'))
      }

      audio.src = URL.createObjectURL(file)
      return
    }

    // Handle video files
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)

      resolve({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.type,
        size: file.size,
      })
    }

    video.onerror = () => {
      URL.revokeObjectURL(video.src)
      reject(new Error('Unable to read video file'))
    }

    video.src = URL.createObjectURL(file)
  })
}
