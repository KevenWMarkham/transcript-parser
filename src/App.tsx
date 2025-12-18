import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { UploadVideo } from '@/components/UploadVideo'
import { VideoPreview } from '@/components/VideoPreview'
import { TranscriptView } from '@/components/TranscriptView'
import { ProcessingStatus } from '@/components/ProcessingStatus'
import { AdvancedExportPanel } from '@/components/AdvancedExportPanel'
import { Login } from '@/components/Login'
import { Register } from '@/components/Register'
import { TranscriptLibrary } from '@/components/TranscriptLibrary'
import { CostSummaryModal } from '@/components/CostSummaryModal'
import { useTranscription } from '@/hooks/useTranscription'
import { apiClient } from '@/services/apiClient'
import { usageTracker } from '@/services/usageTracker'
import {
  validateVideoFile,
  extractVideoMetadata,
  type VideoMetadata,
} from '@/utils/fileUtils'
import { Button } from '@/components/ui/button'
import { largeTranscriptDemo } from '@/data/largeTranscriptDemo'
import type { TranscriptData } from '@/types/transcript'

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(
    apiClient.isAuthenticated()
  )
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showLibrary, setShowLibrary] = useState(false)
  const [showCostSummary, setShowCostSummary] = useState(false)

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Demo mode state
  const [demoTranscript, setDemoTranscript] = useState<TranscriptData | null>(
    null
  )

  // Transcription hook
  const {
    processingState,
    progress,
    transcript,
    error: transcriptionError,
    startTranscription,
    reset: resetTranscription,
  } = useTranscription()

  // Helper function to add demo usage data
  const addDemoUsageData = () => {
    const currentUser = apiClient.getCurrentUser()
    if (currentUser && currentUser.email === 'demo@example.com') {
      // Add sample usage data
      usageTracker.track({
        userId: currentUser.id || 1,
        model: 'gemini-2.5-flash',
        operation: 'Transcribe Video',
        inputTokens: 5234,
        outputTokens: 3421,
        metadata: { duration: '3:45', fileSize: '15MB' }
      })

      usageTracker.track({
        userId: currentUser.id || 1,
        model: 'gemini-2.5-flash',
        operation: 'Speaker Diarization',
        inputTokens: 2735,
        outputTokens: 0,
        metadata: { speakers: 3 }
      })
    }
  }

  // Add demo data on mount if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const currentUser = apiClient.getCurrentUser()
      if (currentUser && currentUser.email === 'demo@example.com') {
        // Check if demo data already exists to avoid duplicates
        const existingUsage = usageTracker.getUserUsage(currentUser.id || 1)
        if (existingUsage.operations === 0) {
          addDemoUsageData()
        }
      }
    }
  }, []) // Empty dependency array - only run on mount

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
    setDemoTranscript(null)
  }

  const loadDemoTranscript = () => {
    setDemoTranscript(largeTranscriptDemo)
    // Clear any existing video/transcript
    handleRemoveVideo()
  }

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
    setShowAuth(false)

    // Add demo usage data for demo account
    addDemoUsageData()
  }

  const handleLogout = () => {
    apiClient.logout()
    setIsAuthenticated(false)
    setShowLibrary(false)
  }

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login')
  }

  const handleLoadTranscript = (loadedTranscript: TranscriptData) => {
    // TODO: Implement loading transcript into the UI
    console.log('Loading transcript:', loadedTranscript)
    setShowLibrary(false)
  }

  // Show auth modal
  if (showAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)'
        }}
      >
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
      <div
        className="min-h-screen p-4 sm:p-6 lg:p-8"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <Header />
          <Button
            variant="ghost"
            onClick={() => setShowLibrary(false)}
            className="mb-4"
          >
            ← Back to Upload
          </Button>
          <TranscriptLibrary onLoadTranscript={handleLoadTranscript} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Auth and Demo buttons */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            {/* Demo button - Sprint 4 Feature */}
            <Button
              variant="outline"
              onClick={loadDemoTranscript}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
            >
              🎬 Load Sprint 4 Demo (60 Entries)
            </Button>
            {demoTranscript && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="ml-2"
              >
                Clear Demo
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!isAuthenticated ? (
              <Button onClick={() => setShowAuth(true)}>
                Login / Register
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setShowLibrary(true)}>
                  My Transcripts
                </Button>
                <Button variant="outline" onClick={() => setShowCostSummary(true)}>
                  Summary
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Upload & Processing */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
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
            {/* Advanced Export Panel - shown when processing is complete */}
            <AdvancedExportPanel isVisible={processingState === 'complete'} />
          </div>

          {/* Right Column - Transcript */}
          <div className="lg:col-span-2">
            <TranscriptView
              transcript={demoTranscript || transcript}
              onExport={() => console.log('Transcript exported')}
            />
          </div>
        </div>

        {/* Cost Summary Modal */}
        {isAuthenticated && (
          <CostSummaryModal
            isOpen={showCostSummary}
            onClose={() => setShowCostSummary(false)}
            stats={usageTracker.getUserUsage(apiClient.getCurrentUser()?.id || 1)}
          />
        )}
      </div>
    </div>
  )
}

export default App
