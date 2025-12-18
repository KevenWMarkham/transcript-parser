import { useEffect, useMemo } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  formatFileSize,
  formatDuration,
  type VideoMetadata,
} from '@/utils/fileUtils'

interface VideoPreviewProps {
  file: File
  metadata: VideoMetadata
  onRemove: () => void
}

export function VideoPreview({ file, metadata, onRemove }: VideoPreviewProps) {
  const videoUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(videoUrl)
  }, [videoUrl])

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Video Preview</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label="Remove video"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Video player */}
      <div className="rounded-lg overflow-hidden bg-black">
        <video
          src={videoUrl}
          controls
          className="w-full max-h-96"
          data-testid="video-preview-player"
        >
          Your browser does not support the video tag.
        </video>
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
        <div>
          <p className="text-muted-foreground">Resolution</p>
          <p className="font-medium">
            {metadata.width} × {metadata.height}
          </p>
        </div>
      </div>
    </Card>
  )
}
