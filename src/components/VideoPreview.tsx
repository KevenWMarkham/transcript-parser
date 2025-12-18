import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  formatFileSize,
  formatDuration,
  isAudioFile,
  type VideoMetadata,
} from '@/utils/fileUtils'

interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
}

export function VideoPreview({ file, metadata, onRemove }: VideoPreviewProps) {
  const mediaUrl = useMemo(() => URL.createObjectURL(file), [file])
  const isAudio = isAudioFile(file)

  useEffect(() => {
    return () => URL.revokeObjectURL(mediaUrl)
  }, [mediaUrl])

  // Log media information for debugging
  useEffect(() => {
    console.log('[VideoPreview] Media type:', file.type)
    console.log('[VideoPreview] Is audio:', isAudio)
    console.log('[VideoPreview] Media URL:', mediaUrl)
  }, [file.type, isAudio, mediaUrl])

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
      <div className="rounded-lg overflow-hidden bg-black">
        {isAudio ? (
          <audio
            src={mediaUrl}
            controls
            preload="metadata"
            className="w-full"
            data-testid="audio-preview-player"
            onError={(e) => {
              console.error('[VideoPreview] Audio playback error:', e)
              console.error('[VideoPreview] Audio element:', e.currentTarget)
            }}
            onCanPlay={() => console.log('[VideoPreview] Audio can play')}
          >
            <source src={mediaUrl} type={file.type} />
            Your browser does not support the audio tag.
          </audio>
        ) : (
          <video
            src={mediaUrl}
            controls
            preload="metadata"
            className="w-full max-h-96"
            data-testid="video-preview-player"
            onError={(e) => {
              console.error('[VideoPreview] Video playback error:', e)
              console.error('[VideoPreview] Video element:', e.currentTarget)
            }}
            onCanPlay={() => console.log('[VideoPreview] Video can play')}
          >
            <source src={mediaUrl} type={file.type} />
            Your browser does not support the video tag.
          </video>
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
