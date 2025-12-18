/**
 * AudioExtractor service - extracts audio from video files
 * Uses MediaRecorder API to extract audio in Gemini-compatible format
 */

export interface AudioExtractionOptions {
  onProgress?: (progress: number) => void
}

export class AudioExtractionError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message)
    this.name = 'AudioExtractionError'
  }
}

export class AudioExtractor {
  /**
   * Extract audio from video file
   * @param videoFile - Video file to extract audio from
   * @param options - Extraction options including progress callback
   * @returns Audio blob in webm/opus format (Gemini-compatible)
   */
  async extractAudio(
    videoFile: File,
    options?: AudioExtractionOptions
  ): Promise<Blob> {
    const { onProgress } = options || {}

    try {
      // Create video element
      const video = document.createElement('video')
      video.src = URL.createObjectURL(videoFile)
      video.muted = true

      // Wait for video to load
      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve()
        video.onerror = () =>
          reject(
            new AudioExtractionError(
              'Failed to load video file',
              'VIDEO_LOAD_ERROR'
            )
          )
      })

      // Start playing the video first (required for captureStream in some browsers)
      video.currentTime = 0
      await video.play().catch(err => {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          `Failed to play video: ${err.message}`,
          'VIDEO_PLAY_ERROR'
        )
      })

      // Pause immediately and reset to start
      video.pause()
      video.currentTime = 0

      // Create media stream from video
      const stream = (video as any).captureStream
        ? (video as any).captureStream()
        : (video as any).mozCaptureStream?.()

      if (!stream) {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          'Browser does not support video capture',
          'UNSUPPORTED_BROWSER'
        )
      }

      // Check for audio track
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length === 0) {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          'Video file does not contain audio track',
          'NO_AUDIO_TRACK'
        )
      }

      // Try different audio formats in order of preference
      const preferredFormats = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ]

      let selectedMimeType: string | null = null
      for (const format of preferredFormats) {
        if (MediaRecorder.isTypeSupported(format)) {
          selectedMimeType = format
          break
        }
      }

      if (!selectedMimeType) {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          'Browser does not support any compatible audio format for recording',
          'UNSUPPORTED_FORMAT'
        )
      }

      let mediaRecorder: MediaRecorder
      try {
        mediaRecorder = new MediaRecorder(stream, {
          mimeType: selectedMimeType,
        })
      } catch (err) {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          `Failed to create MediaRecorder: ${err instanceof Error ? err.message : 'Unknown error'}`,
          'RECORDER_CREATION_ERROR'
        )
      }

      const audioChunks: Blob[] = []

      // Collect audio chunks
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      // Track progress based on video playback
      const duration = video.duration
      let progressInterval: NodeJS.Timeout | null = null

      // Handle MediaRecorder errors
      mediaRecorder.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent
        console.error('MediaRecorder error:', errorEvent)
        if (progressInterval) clearInterval(progressInterval)
        URL.revokeObjectURL(video.src)
      }

      // Start recording
      try {
        mediaRecorder.start(100) // Collect data every 100ms
      } catch (err) {
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          `Failed to start MediaRecorder: ${err instanceof Error ? err.message : 'Unknown error'}. This video's audio codec may not be compatible with browser recording. Try uploading an audio file (MP3/WAV) instead.`,
          'RECORDER_START_ERROR'
        )
      }

      progressInterval = setInterval(() => {
        if (onProgress && duration > 0) {
          const progress = Math.min((video.currentTime / duration) * 100, 100)
          onProgress(progress)
        }
      }, 100)

      // Play video to trigger recording
      video.play().catch(err => {
        clearInterval(progressInterval)
        mediaRecorder.stop()
        URL.revokeObjectURL(video.src)
        throw new AudioExtractionError(
          `Failed to play video: ${err.message}`,
          'VIDEO_PLAY_ERROR'
        )
      })

      // Wait for recording to complete
      const audioBlob = await new Promise<Blob>((resolve, reject) => {
        mediaRecorder.onstop = () => {
          clearInterval(progressInterval)
          URL.revokeObjectURL(video.src)

          if (audioChunks.length === 0) {
            reject(
              new AudioExtractionError(
                'No audio data captured',
                'NO_AUDIO_DATA'
              )
            )
            return
          }

          const blob = new Blob(audioChunks, { type: mimeType })
          resolve(blob)
        }

        mediaRecorder.onerror = event => {
          clearInterval(progressInterval)
          URL.revokeObjectURL(video.src)
          reject(
            new AudioExtractionError(
              `MediaRecorder error: ${(event as any).error?.message || 'Unknown error'}`,
              'RECORDING_ERROR'
            )
          )
        }

        video.onended = () => {
          mediaRecorder.stop()
        }
      })

      return audioBlob
    } catch (error) {
      if (error instanceof AudioExtractionError) {
        throw error
      }
      throw new AudioExtractionError(
        `Unexpected error during audio extraction: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'UNKNOWN_ERROR'
      )
    }
  }
}
