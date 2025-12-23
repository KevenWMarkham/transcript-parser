import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wand2,
  CheckCircle2,
  Upload as UploadIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import type { ProcessingState } from '../hooks/useTranscription'
import { getDebugMessage } from '../hooks/useTranscription'

interface ProcessingStatusProps {
  processingState: ProcessingState
  progress: number
  error?: Error | null
  onReset?: () => void
}

export function ProcessingStatus({
  processingState,
  progress,
  error,
  onReset,
}: ProcessingStatusProps) {
  const [debugMsg, setDebugMsg] = useState('')

  // Poll for debug message updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDebugMsg(getDebugMessage())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const getStateMessage = () => {
    switch (processingState) {
      case 'idle':
        return null
      case 'loading-ffmpeg':
        return {
          title: 'Loading FFmpeg',
          description:
            'Downloading universal audio extraction engine (31MB, one-time download)...',
          icon: <Loader2 className="w-5 h-5 text-orange-600 animate-spin" />,
          color: 'orange',
        }
      case 'extracting-audio':
        return {
          title: 'Extracting audio',
          description: 'Preparing audio for transcription...',
          icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />,
          color: 'blue',
        }
      case 'transcribing':
        return {
          title: 'Transcribing with AI',
          description: 'Identifying speakers and generating transcript...',
          icon: <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />,
          color: 'purple',
        }
      case 'complete':
        return {
          title: 'Processing complete',
          description: 'Transcript generated successfully!',
          icon: (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          ),
          color: 'emerald',
        }
      case 'error':
        return {
          title: 'Processing failed',
          description: error?.message || 'An unknown error occurred',
          icon: (
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          ),
          color: 'red',
        }
      default:
        return null
    }
  }

  const stateMessage = getStateMessage()

  if (!stateMessage) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {processingState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 rounded-3xl shadow-xl border border-blue-200/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-40" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Processing Status</h2>
            </div>

        <div className="space-y-4">
          {/* Status message */}
          <div
            className={`bg-${stateMessage.color}-50 dark:bg-${stateMessage.color}-950/20 border border-${stateMessage.color}-200 dark:border-${stateMessage.color}-800 rounded-lg p-4`}
          >
            <div className="flex items-start gap-3">
              {stateMessage.icon}
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{stateMessage.title}</p>
                <p
                  className={`text-sm text-${stateMessage.color}-600 dark:text-${stateMessage.color}-400`}
                >
                  {stateMessage.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar for active processing */}
          {(processingState === 'loading-ffmpeg' ||
            processingState === 'extracting-audio' ||
            processingState === 'transcribing') && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                {processingState === 'loading-ffmpeg' && progress === 0
                  ? 'Initializing...'
                  : `${Math.round(progress)}%`}
              </p>
            </div>
          )}

          {/* Debug info - visible for troubleshooting */}
          {debugMsg && (
            <div className="mt-3 p-3 rounded-lg bg-yellow-100 border-2 border-yellow-500">
              <p className="text-sm font-bold text-black">🔍 Status:</p>
              <p className="text-sm font-mono text-black break-all">{debugMsg}</p>
            </div>
          )}
        </div>

            {/* Action button */}
            {(processingState === 'complete' || processingState === 'error') &&
              onReset && (
                <Button variant="outline" className="w-full mt-6" onClick={onReset}>
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Process Another Video
                </Button>
              )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
