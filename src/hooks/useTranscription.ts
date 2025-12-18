/**
 * useTranscription hook - manages transcription state and workflow
 * Coordinates AudioExtractor and GeminiClient services
 */

import { useState, useCallback } from 'react'
import { openDB } from 'idb'
import type { TranscriptData } from '@/types/transcript'
import type { VideoMetadata } from '@/utils/fileUtils'
import { isAudioFile } from '@/utils/fileUtils'
import { AudioExtractor } from '@/services/audioExtractor'
import { GeminiClient } from '@/services/geminiClient'
import { FFmpegExtractor } from '@/services/ffmpegExtractor'

const DB_NAME = 'transcript-db'
const STORE_NAME = 'transcripts'

export type ProcessingState =
  | 'idle'
  | 'loading-ffmpeg'
  | 'extracting-audio'
  | 'transcribing'
  | 'complete'
  | 'error'

export interface UseTranscriptionResult {
  processingState: ProcessingState
  progress: number
  transcript: TranscriptData | null
  error: Error | null
  startTranscription: (file: File, metadata: VideoMetadata) => Promise<void>
  reset: () => void
}

export function useTranscription(): UseTranscriptionResult {
  const [processingState, setProcessingState] =
    useState<ProcessingState>('idle')
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptData | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const reset = useCallback(() => {
    setProcessingState('idle')
    setProgress(0)
    setTranscript(null)
    setError(null)
  }, [])

  const startTranscription = useCallback(
    async (file: File, metadata: VideoMetadata) => {
      try {
        // Reset state
        setError(null)
        setProgress(0)
        setTranscript(null)

        // Extract audio from video, or use audio file directly
        let audioBlob: Blob

        if (isAudioFile(file)) {
          // Audio file - use directly
          audioBlob = file
          setProgress(30)
        } else {
          // Video file - try browser extraction first, fall back to FFmpeg
          try {
            setProcessingState('extracting-audio')
            const audioExtractor = new AudioExtractor()
            audioBlob = await audioExtractor.extractAudio(file, {
              onProgress: audioProgress => {
                // Map 0-100% audio extraction to 0-30% total progress
                const totalProgress = (audioProgress / 100) * 30
                setProgress(totalProgress)
              },
            })
            console.log('[Transcription] Browser extraction successful ✅')
            setProgress(30)
          } catch (browserError) {
            console.warn(
              '[Transcription] Browser extraction failed:',
              browserError
            )
            console.log('[Transcription] Falling back to FFmpeg.wasm...')

            // Fallback to FFmpeg.wasm
            const ffmpegExtractor = FFmpegExtractor.getInstance()

            if (!ffmpegExtractor.isLoaded()) {
              setProcessingState('loading-ffmpeg')
              setProgress(0)
              console.log('[Transcription] Loading FFmpeg.wasm...')

              let lastUpdate = 0

              await ffmpegExtractor.load({
                onProgress: loadProgress => {
                  // FFmpeg already provides 0-100 range, map to 0-20% of total
                  const mappedProgress = (loadProgress / 100) * 20
                  const now = Date.now()

                  // Throttle updates to every 200ms to avoid overwhelming React
                  // Always update on first call (lastUpdate === 0) and last call (loadProgress >= 99)
                  if (
                    lastUpdate === 0 ||
                    now - lastUpdate > 200 ||
                    loadProgress >= 99
                  ) {
                    console.log(
                      '[Transcription] FFmpeg load progress:',
                      loadProgress.toFixed(1),
                      '-> mapped:',
                      mappedProgress.toFixed(1)
                    )
                    setProgress(mappedProgress)
                    lastUpdate = now
                  }
                },
              })
              console.log('[Transcription] FFmpeg.wasm loaded ✅')
              setProgress(20) // Ensure we're at 20% after loading
            }

            setProcessingState('extracting-audio')
            setProgress(20)
            audioBlob = await ffmpegExtractor.extractAudio(file, {
              onProgress: extractProgress => {
                // Map audio extraction (0-100) to 20-30% of total
                setProgress(20 + (extractProgress / 100) * 10)
              },
            })
            console.log('[Transcription] FFmpeg extraction successful ✅')
            setProgress(30)
          }
        }

        // Transcribe with Gemini (30-100% progress)
        setProcessingState('transcribing')

        // Simulate progress for transcription (since Gemini doesn't provide progress)
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(progressInterval)
              return 95
            }
            // Gradually increase from 30% to 95%
            return Math.min(prev + 2, 95)
          })
        }, 500)

        try {
          const geminiClient = new GeminiClient()
          const transcriptData =
            await geminiClient.transcribeWithSpeakers(audioBlob)

          clearInterval(progressInterval)

          // Update transcript metadata with video information
          transcriptData.metadata = {
            ...transcriptData.metadata,
            fileName: file.name,
            fileSize: file.size,
            duration: metadata.duration,
            videoFormat: metadata.format,
          }

          // Auto-save to IndexedDB
          try {
            const db = await openDB(DB_NAME, 1, {
              upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                  db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                }
              },
            })

            // Save the complete transcript data to IndexedDB
            await db.put(STORE_NAME, transcriptData)
            console.log('✅ Transcript saved to IndexedDB:', transcriptData.id)
          } catch (saveError) {
            console.warn('⚠️ Failed to save transcript to IndexedDB:', saveError)
            // Don't throw - transcription still succeeded locally
          }

          setTranscript(transcriptData)
          setProgress(100)
          setProcessingState('complete')
        } catch (transcriptionError) {
          clearInterval(progressInterval)
          throw transcriptionError
        }
      } catch (err) {
        setProcessingState('error')
        setError(err instanceof Error ? err : new Error('Unknown error'))
        throw err
      }
    },
    []
  )

  return {
    processingState,
    progress,
    transcript,
    error,
    startTranscription,
    reset,
  }
}
