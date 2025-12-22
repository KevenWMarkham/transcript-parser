export interface FFmpegExtractionOptions {
  onProgress?: (progress: number) => void
  onLog?: (message: string) => void
  serverUrl?: string
}

// Default server URL - can be overridden via options or environment
// For production: audio server runs on VPS at port 3001
const DEFAULT_SERVER_URL =
  typeof window !== 'undefined' &&
  window.location.hostname === 'smarthavenai.com'
    ? 'https://api.smarthavenai.com' // Production: subdomain pointing to VPS
    : 'http://localhost:3001' // Development

export class FFmpegExtractor {
  private static instance: FFmpegExtractor | null = null
  private serverUrl: string
  private loaded = false

  constructor(serverUrl?: string) {
    this.serverUrl = serverUrl || DEFAULT_SERVER_URL
  }

  static getInstance(): FFmpegExtractor {
    if (!FFmpegExtractor.instance) {
      FFmpegExtractor.instance = new FFmpegExtractor()
    }
    return FFmpegExtractor.instance
  }

  async load(options?: FFmpegExtractionOptions): Promise<void> {
    if (this.loaded) return

    console.log('[AudioExtractor] Initializing server-side extraction...')
    options?.onLog?.('Initializing server-side audio extraction...')
    options?.onProgress?.(10)

    // Update server URL if provided
    if (options?.serverUrl) {
      this.serverUrl = options.serverUrl
    }

    // Check server health
    try {
      const healthUrl = this.serverUrl.replace('/extract-audio', '/health')
      console.log('[AudioExtractor] Checking server health:', healthUrl)

      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      })

      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`)
      }

      const health = await response.json()
      console.log('[AudioExtractor] Server health:', health)
      options?.onLog?.('Server ready for audio extraction')
      options?.onProgress?.(100)
      this.loaded = true
    } catch (error) {
      console.warn('[AudioExtractor] Server health check failed:', error)
      // Still mark as loaded - we'll try the extraction anyway
      this.loaded = true
      options?.onProgress?.(100)
    }
  }

  async extractAudio(
    videoFile: File,
    options?: FFmpegExtractionOptions
  ): Promise<Blob> {
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      throw new Error(
        `File too large (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). ` +
          `Maximum: 500MB. Please use a smaller file.`
      )
    }

    console.log(
      `[AudioExtractor] Uploading ${videoFile.name} (${(videoFile.size / 1024 / 1024).toFixed(1)}MB)...`
    )
    options?.onLog?.(`Uploading ${videoFile.name}...`)
    options?.onProgress?.(10)

    const formData = new FormData()
    formData.append('video', videoFile)

    try {
      const extractUrl = this.serverUrl.endsWith('/extract-audio')
        ? this.serverUrl
        : `${this.serverUrl}/extract-audio`

      console.log('[AudioExtractor] Sending to server:', extractUrl)
      options?.onProgress?.(30)

      const response = await fetch(extractUrl, {
        method: 'POST',
        body: formData,
      })

      options?.onProgress?.(70)

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: response.statusText }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      console.log('[AudioExtractor] Receiving audio data...')
      options?.onLog?.('Receiving extracted audio...')
      options?.onProgress?.(85)

      const audioBlob = await response.blob()

      console.log(
        `[AudioExtractor] Extraction complete! Audio size: ${(audioBlob.size / 1024).toFixed(1)}KB`
      )
      options?.onLog?.('Audio extraction complete')
      options?.onProgress?.(100)

      return audioBlob
    } catch (error) {
      console.error('[AudioExtractor] Server extraction failed:', error)
      throw new Error(
        `Audio extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  isLoaded(): boolean {
    return this.loaded
  }

  setServerUrl(url: string): void {
    this.serverUrl = url
  }
}
