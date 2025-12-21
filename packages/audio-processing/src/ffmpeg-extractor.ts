import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'

export interface FFmpegExtractionOptions {
  onProgress?: (progress: number) => void
  onLog?: (message: string) => void
}

export class FFmpegExtractor {
  private static instance: FFmpegExtractor | null = null
  private ffmpeg: FFmpeg | null = null
  private loaded = false
  private loading = false

  static getInstance(): FFmpegExtractor {
    if (!FFmpegExtractor.instance) {
      FFmpegExtractor.instance = new FFmpegExtractor()
    }
    return FFmpegExtractor.instance
  }

  async load(options?: FFmpegExtractionOptions): Promise<void> {
    if (this.loaded) return

    if (this.loading) {
      while (this.loading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return
    }

    this.loading = true

    try {
      console.log('[FFmpeg] Initializing...')
      console.log(
        '[FFmpeg] onProgress callback provided?',
        !!options?.onProgress
      )
      this.ffmpeg = new FFmpeg()

      this.ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
        options?.onLog?.(message)
      })

      console.log('[FFmpeg] Loading from local files...')

      // Simulate progress updates during loading
      let loadProgress = 0
      const progressInterval = setInterval(() => {
        if (loadProgress < 90) {
          loadProgress += 5
          options?.onProgress?.(loadProgress)
          console.log(`[FFmpeg] Loading: ${loadProgress}%`)
        }
      }, 300)

      try {
        // Use ESM distribution from jsdelivr CDN for better compatibility with Vite
        // ESM is the proper module format for modern build tools
        const baseURL =
          'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/esm'
        console.log('[FFmpeg] Loading from ESM build:', baseURL)

        console.log('[FFmpeg] Converting core.js to blob URL...')
        const coreURL = await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          'text/javascript'
        )

        console.log('[FFmpeg] Converting WASM to blob URL...')
        const wasmURL = await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          'application/wasm'
        )

        console.log('[FFmpeg] Converting worker to blob URL...')
        const workerURL = await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          'text/javascript'
        )

        clearInterval(progressInterval)
        options?.onProgress?.(95)

        console.log('[FFmpeg] Core URL:', coreURL)
        console.log('[FFmpeg] WASM URL:', wasmURL)
        console.log('[FFmpeg] Worker URL:', workerURL)
        console.log('[FFmpeg] Loading into memory...')

        // Load FFmpeg with all three files
        await this.ffmpeg.load({
          coreURL,
          wasmURL,
          workerURL,
        })

        options?.onProgress?.(100)
        console.log('[FFmpeg] Loaded successfully ✅')
      } catch (error) {
        clearInterval(progressInterval)
        console.error('[FFmpeg] Detailed error:', error)
        console.error(
          '[FFmpeg] Error stack:',
          error instanceof Error ? error.stack : 'No stack'
        )
        throw error
      }

      console.log('[FFmpeg] Memory load complete!')
      this.loaded = true
      options?.onProgress?.(100)
    } catch (error) {
      console.error('[FFmpeg] Load failed:', error)
      throw new Error(
        `Failed to load FFmpeg: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      this.loading = false
    }
  }

  async extractAudio(
    videoFile: File,
    options?: FFmpegExtractionOptions
  ): Promise<Blob> {
    if (!this.loaded || !this.ffmpeg) {
      throw new Error('FFmpeg not loaded. Call load() first.')
    }

    const maxSize = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > maxSize) {
      throw new Error(
        `File too large (${(videoFile.size / 1024 / 1024).toFixed(0)}MB). ` +
          `Maximum: 500MB. Please use a smaller file or extract audio externally.`
      )
    }

    const inputName = `input_${Date.now()}.${this.getFileExtension(videoFile.name)}`
    const outputName = `output_${Date.now()}.m4a`

    try {
      console.log(`[FFmpeg] Writing input file: ${videoFile.name}`)
      await this.ffmpeg.writeFile(inputName, await fetchFile(videoFile))

      console.log('[FFmpeg] Extracting audio...')
      await this.ffmpeg.exec([
        '-i',
        inputName,
        '-vn', // No video
        '-acodec',
        'aac', // AAC codec (Gemini compatible)
        '-b:a',
        '64k', // Low bitrate
        '-ar',
        '22050', // Lower sample rate
        outputName,
      ])

      console.log('[FFmpeg] Reading output file...')
      const data = await this.ffmpeg.readFile(outputName)

      console.log('[FFmpeg] Cleaning up...')
      await this.ffmpeg.deleteFile(inputName)
      await this.ffmpeg.deleteFile(outputName)

      const blob = new Blob([data], { type: 'audio/mp4' })
      console.log(`[FFmpeg] Extraction complete ✅`)

      return blob
    } catch (error) {
      try {
        await this.ffmpeg.deleteFile(inputName).catch(() => {})
        await this.ffmpeg.deleteFile(outputName).catch(() => {})
      } catch {}

      throw new Error(
        `FFmpeg extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  isLoaded(): boolean {
    return this.loaded
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts[parts.length - 1] : 'mp4'
  }
}
