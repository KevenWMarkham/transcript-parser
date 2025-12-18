import { useState } from 'react'
import { Header } from '@/components/Header'
import { UploadVideo } from '@/components/UploadVideo'
import { VideoPreview } from '@/components/VideoPreview'
import { TranscriptView } from '@/components/TranscriptView'
import { ProcessingStatus } from '@/components/ProcessingStatus'
import { Login } from '@/components/Login'
import { Register } from '@/components/Register'
import { TranscriptLibrary } from '@/components/TranscriptLibrary'
import { useTranscription } from '@/hooks/useTranscription'
import { apiClient } from '@/services/apiClient'
import {
  validateVideoFile,
  extractVideoMetadata,
  type VideoMetadata,
} from '@/utils/fileUtils'
import { Button } from '@/components/ui/button'

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(apiClient.isAuthenticated())
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showLibrary, setShowLibrary] = useState(false)

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Transcription hook
  const {
    processingState,
    progress,
    transcript,
    error: transcriptionError,
    startTranscription,
    reset: resetTranscription,
  } = useTranscription()

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

      // Automatically start transcription
      await startTranscription(file, metadata)
    } catch (error) {
      setUploadError((error as Error).message)
    }
  }

  const handleRemoveVideo = () => {
    setVideoFile(null)
    setVideoMetadata(null)
    setUploadError(null)
    resetTranscription()
  }

  const handleReset = () => {
    handleRemoveVideo()
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuth(false)
  }

  const handleLogout = () => {
    apiClient.logout()
    setIsAuthenticated(false)
    setShowLibrary(false)
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login')
  }

  const handleLoadTranscript = (loadedTranscript: any) => {
    // TODO: Implement loading transcript into the UI
    console.log('Loading transcript:', loadedTranscript)
    setShowLibrary(false)
  }

  // Show auth modal
  if (showAuth) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={() => setShowAuth(false)}
            className="mb-4"
          >
            ← Back
          </Button>
          {authMode === 'login' ? (
            <Login onSuccess={handleAuthSuccess} onToggle={toggleAuthMode} />
          ) : (
            <Register onSuccess={handleAuthSuccess} onToggle={toggleAuthMode} />
          )}
        </div>
      </div>
    )
  }

  // Show library
  if (showLibrary) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => setShowLibrary(false)}
            className="mb-4"
          >
            ← Back to Upload
          </Button>
          <TranscriptLibrary onLoadTranscript={handleLoadTranscript} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Auth buttons */}
        <div className="mb-6 flex justify-end gap-2">
          {!isAuthenticated ? (
            <Button onClick={() => setShowAuth(true)}>
              Login / Register
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowLibrary(true)}>
                My Transcripts
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>

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
            {processingState !== 'idle' && (
              <ProcessingStatus
                processingState={processingState}
                progress={progress}
                error={transcriptionError}
                onReset={handleReset}
              />
            )}
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
