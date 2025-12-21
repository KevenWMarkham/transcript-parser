import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Video, Sparkles, AlertCircle } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'

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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-40" />
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Upload Video or Audio</h2>
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
          aria-label="Upload video or audio file by dragging and dropping or clicking to browse"
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
                Drop your file here or click to browse
              </p>
              <p id="upload-formats" className="text-sm text-muted-foreground">
                Video: MP4, MOV, WebM • Audio: MP3, WAV, M4A (recommended) • Max
                2GB
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
            accept="video/mp4,video/quicktime,video/x-msvideo,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/mp4,audio/x-m4a,audio/webm,audio/ogg"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Choose video or audio file"
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
      </Card>
    </motion.div>
  )
}
