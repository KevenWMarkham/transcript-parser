import { useEffect, useMemo, useRef } from 'react'
import { X, Play } from 'lucide-react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import {
  formatFileSize,
  formatDuration,
  isAudioFile,
  type VideoMetadata,
} from '../utils/fileUtils'

interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
  onPlayVideo?: () => void
}

export function VideoPreview({ file, metadata, onRemove, onPlayVideo }: VideoPreviewProps) {
  const mediaUrl = useMemo(() => URL.createObjectURL(file), [file])
  // Use #t=0.5 fragment to show frame at 0.5 seconds as poster
  const mediaUrlWithTime = useMemo(() => `${mediaUrl}#t=0.5`, [mediaUrl])
  const isAudio = isAudioFile(file)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(mediaUrl)
    }
  }, [mediaUrl])

  // Log media information for debugging
  useEffect(() => {
    console.log('[VideoPreview] Media type:', file.type)
    console.log('[VideoPreview] Is audio:', isAudio)
    console.log('[VideoPreview] Media URL:', mediaUrl)
  }, [file.type, isAudio, mediaUrl])

  // For videos, show just the first frame with play overlay
  const showThumbnail = !isAudio && onPlayVideo

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {isAudio ? 'Audio Preview' : 'Video Preview'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            aria-label={isAudio ? 'Remove audio' : 'Remove video'}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Audio/Video player */}
        <div className="rounded-lg overflow-hidden bg-black relative group">
          {isAudio ? (
            <audio
              src={mediaUrl}
              controls
              preload="metadata"
              className="w-full"
              data-testid="audio-preview-player"
              onError={e => {
                console.error('[VideoPreview] Audio playback error:', e)
                console.error('[VideoPreview] Audio element:', e.currentTarget)
              }}
              onCanPlay={() => console.log('[VideoPreview] Audio can play')}
            >
              <source src={mediaUrl} type={file.type} />
              Your browser does not support the audio tag.
            </audio>
          ) : (
            <>
              <video
                ref={videoRef}
                src={mediaUrlWithTime}
                preload="metadata"
                className="w-full max-h-96"
                data-testid="video-preview-player"
                muted
                playsInline
                onError={e => {
                  console.error('[VideoPreview] Video playback error:', e)
                  console.error('[VideoPreview] Video element:', e.currentTarget)
                }}
                onLoadedMetadata={() => console.log('[VideoPreview] Main video metadata loaded')}
                onCanPlay={() => console.log('[VideoPreview] Main video can play')}
              >
                <source src={mediaUrlWithTime} type={file.type} />
                Your browser does not support the video tag.
              </video>

              {/* Play overlay */}
              {showThumbnail && (
                <div
                  className="absolute inset-0 bg-black/10 flex items-center justify-center cursor-pointer transition-all hover:bg-black/20"
                  onClick={onPlayVideo}
                >
                  <div className="w-20 h-20 rounded-full bg-white/60 flex items-center justify-center shadow-xl transform transition-all group-hover:scale-110 group-hover:bg-white/80">
                    <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">File Name</p>
            <p className="font-medium truncate" title={file.name}>
              {file.name}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">File Size</p>
            <p className="font-medium">{formatFileSize(metadata.size)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Duration</p>
            <p className="font-medium">{formatDuration(metadata.duration)}</p>
          </div>
          {!isAudio && (
            <div>
              <p className="text-muted-foreground">Resolution</p>
              <p className="font-medium">
                {metadata.width} × {metadata.height}
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}
