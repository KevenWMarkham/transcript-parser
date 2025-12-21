import { useEffect, useRef } from 'react'
import { X, Play, Download } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoFile: File
  videoUrl: string
  fileName: string
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  videoFile,
  videoUrl,
  fileName,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Reset video when modal opens
    if (isOpen && videoRef.current) {
      videoRef.current.load()
    }
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case ' ':
        case 'k':
          e.preventDefault()
          if (video.paused) {
            video.play()
          } else {
            video.pause()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          video.currentTime = Math.max(0, video.currentTime - 5)
          break
        case 'ArrowRight':
          e.preventDefault()
          video.currentTime = Math.min(video.duration, video.currentTime + 5)
          break
        case 'ArrowUp':
          e.preventDefault()
          video.volume = Math.min(1, video.volume + 0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          video.volume = Math.max(0, video.volume - 0.1)
          break
        case 'f':
          e.preventDefault()
          if (video.requestFullscreen) {
            video.requestFullscreen()
          }
          break
        case 'm':
          e.preventDefault()
          video.muted = !video.muted
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-white dark:bg-slate-900">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Play className="w-5 h-5" />
              {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 bg-white hover:bg-slate-100 text-slate-900 border-slate-300"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-slate-100 text-slate-900"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              autoPlay
              className="w-full max-h-[70vh]"
              onError={e => {
                console.error('[VideoPlayerModal] Playback error:', e)
              }}
            >
              <source src={videoUrl} type={videoFile.type} />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="mt-4 space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <p>
                If the video doesn't play, it may use a codec not supported by
                your browser. The transcript will still be generated
                successfully.
              </p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <p className="font-medium mb-1 text-slate-900 dark:text-white">Keyboard shortcuts:</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">Space</kbd> or{' '}
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">K</kbd>{' '}
                  Play/Pause
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">←</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">→</kbd> Seek
                  ±5s
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">↑</kbd>{' '}
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">↓</kbd> Volume
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">F</kbd>{' '}
                  Fullscreen
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">M</kbd> Mute
                </span>
                <span>
                  <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white">ESC</kbd>{' '}
                  Close
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
