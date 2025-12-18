import { useState } from 'react'
import { Header } from '@/components/Header'
import { UploadVideo } from '@/components/UploadVideo'
import { VideoPreview } from '@/components/VideoPreview'
import { TranscriptView } from '@/components/TranscriptView'
import { ProcessingStatus } from '@/components/ProcessingStatus'
import { sampleTranscript } from '@/data/sampleTranscript'
import {
  validateVideoFile,
  extractVideoMetadata,
  type VideoMetadata,
} from '@/utils/fileUtils'
import type { TranscriptData } from '@/types/transcript'

function App() {
  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Toggle this to show/hide the sample transcript (for development)
  const [transcript] = useState<TranscriptData | null>(sampleTranscript)

  const handleVideoUpload = async (file: File) => {
    setUploadError(null)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      setUploadError(validation.error!)
      return
    }

    try {
      // Extract metadata
      const metadata = await extractVideoMetadata(file)
      setVideoFile(file)
      setVideoMetadata(metadata)
    } catch (error) {
      setUploadError((error as Error).message)
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoMetadata(null)
    setUploadError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {!videoFile ? (
              <UploadVideo onUpload={handleVideoUpload} error={uploadError} />
            ) : (
              <VideoPreview
                file={videoFile}
                metadata={videoMetadata!}
                onRemove={handleRemoveVideo}
              />
            )}
            {transcript && <ProcessingStatus />}
          </div>

          {/* Right Column */}
          <div>
            <TranscriptView
              transcript={transcript}
              onExport={() => console.log('Transcript exported')}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
