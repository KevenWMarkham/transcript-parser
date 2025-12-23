import { useEffect, useRef, useState, useMemo } from 'react'
import { X, Play, Download, Maximize2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from './ui/dialog'
import { Button } from './ui/button'

interface VideoPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  videoFile: File
  videoUrl: string
  fileName: string
}

// Device detection utilities
function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isIOS: false, isAndroid: false, isTouchDevice: false }
  }

  const ua = navigator.userAgent || navigator.vendor || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)
  const isMobile = isIOS || isAndroid || /webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  return { isMobile, isIOS, isAndroid, isTouchDevice }
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  videoFile,
  videoUrl,
  fileName,
}: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [viewportHeight, setViewportHeight] = useState<number>(0)
  const [playbackError, setPlaybackError] = useState<string | null>(null)

  const device = useMemo(() => getDeviceInfo(), [])

  // Handle viewport height changes (important for mobile browsers with dynamic toolbars)
  useEffect(() => {
    const updateViewportHeight = () => {
      // Use visualViewport API for accurate mobile viewport
      const vh = window.visualViewport?.height || window.innerHeight
      setViewportHeight(vh)
    }

    updateViewportHeight()

    window.addEventListener('resize', updateViewportHeight)
    window.visualViewport?.addEventListener('resize', updateViewportHeight)

    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.visualViewport?.removeEventListener('resize', updateViewportHeight)
    }
  }, [])

  // Lock body scroll on mobile when modal is open
  useEffect(() => {
    if (!isOpen) return

    if (device.isMobile) {
      const originalStyle = document.body.style.cssText
      document.body.style.cssText = `
        overflow: hidden;
        position: fixed;
        width: 100%;
        height: 100%;
        touch-action: none;
      `
      return () => {
        document.body.style.cssText = originalStyle
      }
    }
  }, [isOpen, device.isMobile])

  useEffect(() => {
    // Reset video and error when modal opens
    if (isOpen && videoRef.current) {
      setPlaybackError(null)
      videoRef.current.load()
    }
  }, [isOpen])

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    if (!isOpen || device.isMobile) return

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
  }, [isOpen, onClose, device.isMobile])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = videoUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if ((video as any).webkitEnterFullscreen) {
      // iOS Safari fullscreen
      (video as any).webkitEnterFullscreen()
    }
  }

  // Calculate dynamic styles based on device and viewport
  const modalStyle = useMemo(() => {
    if (device.isMobile && viewportHeight > 0) {
      // Mobile: use exact viewport height to prevent any overflow
      return {
        height: `${viewportHeight}px`,
        maxHeight: `${viewportHeight}px`,
      }
    }
    return {}
  }, [device.isMobile, viewportHeight])

  // Calculate video container height based on device
  const videoContainerHeight = useMemo(() => {
    if (device.isMobile) {
      // Mobile: video takes most of the screen, leaving room for header and minimal controls
      // Header ~56px, controls ~80px, padding ~24px = ~160px reserved
      const reserved = 160
      const available = viewportHeight - reserved
      return Math.max(200, available) // minimum 200px
    }
    return undefined // Desktop uses CSS classes
  }, [device.isMobile, viewportHeight])

  // Mobile-optimized layout
  if (device.isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-screen p-0 m-0 rounded-none border-0 bg-black flex flex-col"
          style={modalStyle}
        >
          {/* Compact mobile header */}
          <div className="flex items-center justify-between px-3 py-2 bg-black/90 flex-shrink-0 safe-area-inset-top">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Play className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-white text-sm font-medium truncate">{fileName}</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreen}
                className="h-9 w-9 p-0 text-white hover:bg-white/20"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-9 w-9 p-0 text-white hover:bg-white/20"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-9 w-9 p-0 text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Video container - fills available space */}
          <div
            className="flex-1 flex items-center justify-center bg-black overflow-hidden"
            style={{ height: videoContainerHeight }}
          >
            {playbackError ? (
              <div className="p-4 text-center">
                <p className="text-red-400 text-sm mb-2">Video playback error</p>
                <p className="text-white/70 text-xs">{playbackError}</p>
                <p className="text-white/50 text-xs mt-2">Transcription will still work!</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                webkit-playsinline="true"
                x-webkit-airplay="allow"
                className="w-full h-full object-contain"
                style={{ maxHeight: videoContainerHeight }}
                onError={e => {
                  const video = e.target as HTMLVideoElement
                  const error = video.error
                  const msg = error ? `Code ${error.code}: ${error.message || 'Unknown'}` : 'Codec not supported'
                  console.error('[VideoPlayerModal] Playback error:', msg)
                  setPlaybackError(msg)
                }}
              >
                Your browser does not support this video format.
              </video>
            )}
          </div>

          {/* Minimal mobile footer */}
          <div className="px-3 py-2 bg-black/90 flex-shrink-0 safe-area-inset-bottom">
            <p className="text-xs text-slate-400 text-center">
              Tap fullscreen for best experience • Video will still transcribe if playback fails
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop layout
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh] p-0 bg-white dark:bg-slate-900 flex flex-col overflow-hidden">
        {/* Desktop header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Play className="w-5 h-5 text-slate-700 dark:text-slate-300 flex-shrink-0" />
            <span className="font-medium text-slate-900 dark:text-white truncate">{fileName}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="h-8"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Video container */}
        <div className="flex-1 flex flex-col min-h-0 p-4">
          <div className="flex-1 rounded-lg overflow-hidden bg-black flex items-center justify-center min-h-0">
            {playbackError ? (
              <div className="p-6 text-center">
                <p className="text-red-400 text-base mb-2">Video playback error</p>
                <p className="text-white/70 text-sm">{playbackError}</p>
                <p className="text-white/50 text-sm mt-3">Transcription will still work!</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain max-h-[55vh]"
                onError={e => {
                  const video = e.target as HTMLVideoElement
                  const error = video.error
                  const msg = error ? `Code ${error.code}: ${error.message || 'Unknown'}` : 'Codec not supported'
                  console.error('[VideoPlayerModal] Playback error:', msg)
                  setPlaybackError(msg)
                }}
              >
                Your browser does not support this video format.
              </video>
            )}
          </div>

          {/* Info and keyboard shortcuts */}
          <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex-shrink-0">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              If playback fails, the video codec may not be supported. Transcription will still work.
            </p>
            <div className="text-xs text-slate-500 dark:text-slate-500">
              <span className="font-medium">Shortcuts:</span>{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border rounded text-xs">Space</kbd> Play/Pause •{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border rounded text-xs">←→</kbd> Seek •{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border rounded text-xs">↑↓</kbd> Volume •{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border rounded text-xs">F</kbd> Fullscreen •{' '}
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-700 border rounded text-xs">M</kbd> Mute
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
