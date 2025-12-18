import { useState, useCallback, useRef } from 'react'
import { Upload, Video, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UploadVideoProps {
  onUpload: (file: File) => void
  error?: string | null
}

export function UploadVideo({ onUpload, error }: UploadVideoProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        onUpload(files[0])
      }
    },
    [onUpload]
  )

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onUpload(files[0])
    }
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Upload Video</h2>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleFileSelect()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload video by dragging and dropping or clicking to browse"
          aria-describedby="upload-formats"
          data-testid="upload-drop-zone"
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
            }
          `}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <Upload className="w-10 h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-purple-400" />
            </div>

            <div>
              <p className="text-base font-medium mb-1">
                Drop your video here or click to browse
              </p>
              <p id="upload-formats" className="text-sm text-muted-foreground">
                Supports MP4, MOV, AVI, WebM • Max 2GB
              </p>
            </div>

            <Button
              size="lg"
              onClick={e => {
                e.stopPropagation()
                handleFileSelect()
              }}
              className="bg-purple-600 hover:bg-purple-700"
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Choose video file"
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-start gap-3"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
