import { useState, useCallback } from 'react'
import { Upload, Video, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function UploadVideo() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop logic here
  }, [])

  const handleFileSelect = () => {
    // Handle file selection logic here
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
          className={`
            relative border-2 border-dashed rounded-xl p-12 text-center transition-all
            ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20'
                : 'border-gray-300 dark:border-gray-700'
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
              <p className="text-sm text-muted-foreground">
                Supports MP4, MOV, AVI, WebM • Max 2GB
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleFileSelect}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
