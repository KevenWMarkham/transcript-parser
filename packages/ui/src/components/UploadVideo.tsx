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
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
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
    setDebugInfo(`Files count: ${files?.length || 0}`)

    if (files && files.length > 0) {
      const file = files[0]
      const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : '(none)'
      const info = `Selected: "${file.name}" | Type: "${file.type || 'empty'}" | Ext: ${ext} | Size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
      setDebugInfo(info)

      // Debug logging for Android troubleshooting
      console.log('[UploadVideo] File selected:', {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      })

      try {
        onUpload(file)
        setDebugInfo(info + ' | Status: Uploaded!')
      } catch (err) {
        setDebugInfo(info + ` | Error: ${err}`)
      }
    } else {
      setDebugInfo('No file selected or selection cancelled')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-40" />
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">Upload Video or Audio</h2>
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
            relative border-2 border-dashed rounded-xl p-6 sm:p-8 md:p-12 text-center transition-all cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
            ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                : 'border-gray-300 dark:border-gray-700 hover:border-purple-400'
            }
          `}
        >
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/30 flex items-center justify-center">
                <Upload className="w-7 h-7 sm:w-10 sm:h-10 text-purple-600 dark:text-purple-400" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>

            <div>
              <p className="text-sm sm:text-base font-medium mb-1">
                Drop your file here or tap to browse
              </p>
              <p id="upload-formats" className="text-xs sm:text-sm text-muted-foreground">
                MP4, MOV, WebM, MP3, WAV, M4A • Max 2GB
              </p>
            </div>

            <Button
              size="default"
              onClick={e => {
                e.stopPropagation()
                handleFileSelect()
              }}
              className="bg-purple-600 hover:bg-purple-700 h-10 sm:h-11 px-4 sm:px-6"
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*,audio/*,*/*"
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

        {/* Debug info panel - visible for troubleshooting */}
        {debugInfo && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-100 border-2 border-yellow-500">
            <p className="text-base font-bold text-black mb-2">📱 DEBUG v2:</p>
            <p className="text-lg font-mono text-black break-all leading-relaxed">
              {debugInfo}
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
