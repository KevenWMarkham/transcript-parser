/**
 * File utility functions for video file handling
 */

export const ACCEPTED_VIDEO_FORMATS = [
  'video/mp4',
  'video/quicktime', // MOV
  'video/x-msvideo', // AVI
  'video/webm',
  'video/3gpp', // 3GP (common on Android)
  'video/3gpp2',
  'video/x-matroska', // MKV
  'video/mpeg',
  'video/ogg',
  'video/x-m4v', // M4V
  'video/x-flv', // FLV
  'video/x-ms-wmv', // WMV
  'video/x-ms-asf', // ASF
  'application/octet-stream', // Some Android devices report this
]

export const ACCEPTED_AUDIO_FORMATS = [
  'audio/mpeg', // MP3
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/mp4', // M4A
  'audio/x-m4a',
  'audio/m4a',
  'audio/aac',
  'audio/webm',
  'audio/ogg',
  'audio/3gpp',
  'audio/amr',
  'audio/flac',
  'audio/x-flac',
  'application/octet-stream', // Some Android devices report this
]

// Accepted file extensions (fallback for when MIME type is incorrect/missing)
export const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.3gp', '.3gpp', '.mpeg', '.mpg', '.ogv', '.m4v', '.flv', '.wmv', '.asf']
export const ACCEPTED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.oga', '.webm', '.3gp', '.amr', '.flac']

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
 * Get file extension from filename (lowercase)
 */
function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return ''
  return filename.slice(lastDot).toLowerCase()
}

/**
 * Check if file is video by MIME type or extension
 * Very permissive to handle Android's inconsistent MIME type reporting
 */
export function isVideoFile(file: File): boolean {
  const ext = getFileExtension(file.name)

  // Check extension first (most reliable on Android)
  if (ACCEPTED_VIDEO_EXTENSIONS.includes(ext)) return true

  // Check MIME type
  if (ACCEPTED_VIDEO_FORMATS.includes(file.type)) return true

  // Check for generic video MIME type (Android sometimes uses this)
  if (file.type.startsWith('video/')) return true

  // If MIME type is empty or generic, check extension again with broader matching
  if (!file.type || file.type === 'application/octet-stream') {
    // Check if extension looks like a video
    if (ext && /^\.(mp4|mov|avi|webm|mkv|3gp|mpeg|mpg|m4v|flv|wmv)$/i.test(ext)) {
      return true
    }
  }

  return false
}

/**
 * Check if file is audio-only
 * Very permissive to handle Android's inconsistent MIME type reporting
 */
export function isAudioFile(file: File): boolean {
  const ext = getFileExtension(file.name)

  // Check extension first (most reliable on Android)
  if (ACCEPTED_AUDIO_EXTENSIONS.includes(ext)) return true

  // Check MIME type
  if (ACCEPTED_AUDIO_FORMATS.includes(file.type)) return true

  // Check for generic audio MIME type
  if (file.type.startsWith('audio/')) return true

  // If MIME type is empty or generic, check extension again with broader matching
  if (!file.type || file.type === 'application/octet-stream') {
    // Check if extension looks like audio
    if (ext && /^\.(mp3|wav|m4a|aac|ogg|flac|amr|wma)$/i.test(ext)) {
      return true
    }
  }

  return false
}

/**
 * Validates video or audio file type and size
 * @param file - File to validate
 * @returns Validation result with error message if invalid
 */
export function validateVideoFile(file: File): ValidationResult {
  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')).toLowerCase() : ''
  const isVideo = isVideoFile(file)
  const isAudio = isAudioFile(file)

  // Detailed logging for debugging on mobile
  console.log('[validateVideoFile] File details:', {
    name: file.name,
    type: file.type || '(empty)',
    size: file.size,
    extension: ext || '(none)',
    isVideo,
    isAudio
  })

  if (!isVideo && !isAudio) {
    // Provide helpful debug info in error message for troubleshooting
    const debugInfo = `[name: ${file.name}, type: ${file.type || 'empty'}, ext: ${ext || 'none'}]`
    return {
      valid: false,
      error:
        `Unsupported file format. Please select a video (MP4, MOV, WebM, 3GP) or audio file (MP3, WAV, M4A). Debug: ${debugInfo}`,
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`,
    }
  }

  console.log('[validateVideoFile] File accepted:', file.name)
  return { valid: true }
}

/**
 * Extracts metadata from video or audio file
 * @param file - Video or audio file
 * @returns Promise with video metadata
 */
export function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    // Default metadata if we can't extract it
    const defaultMetadata: VideoMetadata = {
      duration: 0,
      width: 0,
      height: 0,
      format: file.type || 'video/mp4',
      size: file.size,
    }

    // Set a timeout - if metadata extraction takes too long, use defaults
    const timeout = setTimeout(() => {
      console.log('[extractVideoMetadata] Timeout - using default metadata')
      resolve(defaultMetadata)
    }, 5000)

    // Handle audio files
    if (isAudioFile(file)) {
      const audio = document.createElement('audio')
      audio.preload = 'metadata'

      audio.onloadedmetadata = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(audio.src)
        resolve({
          duration: audio.duration || 0,
          width: 0,
          height: 0,
          format: file.type || 'audio/mpeg',
          size: file.size,
        })
      }

      audio.onerror = () => {
        clearTimeout(timeout)
        URL.revokeObjectURL(audio.src)
        console.log('[extractVideoMetadata] Audio metadata extraction failed, using defaults')
        resolve(defaultMetadata)
      }

      audio.src = URL.createObjectURL(file)
      return
    }

    // Handle video files
    const video = document.createElement('video')
    video.preload = 'metadata'
    // Add playsinline for iOS
    video.setAttribute('playsinline', 'true')
    video.muted = true

    video.onloadedmetadata = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(video.src)
      resolve({
        duration: video.duration || 0,
        width: video.videoWidth || 0,
        height: video.videoHeight || 0,
        format: file.type || 'video/mp4',
        size: file.size,
      })
    }

    video.onerror = () => {
      clearTimeout(timeout)
      URL.revokeObjectURL(video.src)
      console.log('[extractVideoMetadata] Video metadata extraction failed, using defaults')
      // Don't reject - just use default metadata so the app can continue
      resolve(defaultMetadata)
    }

    video.src = URL.createObjectURL(file)
  })
}
