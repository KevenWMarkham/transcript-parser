import { useState, useEffect, useMemo } from 'react'
import {
  Header,
  UploadVideo,
  VideoPreview,
  TranscriptView,
  ProcessingStatus,
  AdvancedExportPanel,
  Login,
  Register,
  TranscriptLibrary,
  CostSummaryModal,
  VideoPlayerModal,
  ApiKeySettings,
  BalanceAlert,
  Button,
  VersionBadge,
  useTranscription,
  loadApiConfig,
  shouldShowBalanceAlert,
  type ApiKeyConfig,
} from '@transcript-parser/ui'
import { getVersionInfo, logVersionBanner } from '@/version'
import { apiClient } from '@transcript-parser/ai-services'
import { usageTracker } from '@transcript-parser/ai-services'
import {
  validateVideoFile,
  extractVideoMetadata,
  type VideoMetadata,
} from '@/utils/fileUtils'
import { largeTranscriptDemo } from '@/data/largeTranscriptDemo'
import type { TranscriptData } from '@transcript-parser/types'

// Device detection hook
function useDeviceDetection() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isIOS: false, isAndroid: false }
    }
    const ua = navigator.userAgent || navigator.vendor || ''
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(ua)
    const isMobile =
      isIOS || isAndroid || /webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)
    return { isMobile, isIOS, isAndroid }
  }, [])
}

function App() {
  const device = useDeviceDetection()
  const versionInfo = getVersionInfo()

  // Log version banner on mount
  useEffect(() => {
    logVersionBanner()
  }, [])

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(
    apiClient.isAuthenticated()
  )
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [showLibrary, setShowLibrary] = useState(false)
  const [showCostSummary, setShowCostSummary] = useState(false)
  const [showApiSettings, setShowApiSettings] = useState(false)
  const [apiConfig, setApiConfig] = useState<ApiKeyConfig | null>(
    loadApiConfig()
  )
  const [balanceAlertDismissed, setBalanceAlertDismissed] = useState(false)

  // Video upload state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Demo mode state
  const [demoTranscript, setDemoTranscript] = useState<TranscriptData | null>(
    null
  )

  // Video player state
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false)
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(null)

  // Create and cleanup video object URL
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile)
      setVideoObjectUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setVideoObjectUrl(null)
    }
  }, [videoFile])

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
        totalTokens: 8655,
        metadata: { duration: '3:45', fileSize: '15MB' },
      })

      usageTracker.track({
        userId: currentUser.id || 1,
        model: 'gemini-2.5-flash',
        operation: 'Speaker Diarization',
        inputTokens: 2735,
        outputTokens: 0,
        totalTokens: 2735,
        metadata: { speakers: 3 },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount - isAuthenticated is intentionally not in deps

  const handleVideoUpload = async (file: File) => {
    setUploadError(null)
    console.log('[App] handleVideoUpload called with:', file.name)

    // Validate file
    const validation = validateVideoFile(file)
    if (!validation.valid) {
      console.log('[App] Validation failed:', validation.error)
      setUploadError(validation.error!)
      return
    }

    console.log('[App] Validation passed, extracting metadata...')

    // Extract metadata - with fallback if it fails
    let metadata: VideoMetadata
    try {
      metadata = await extractVideoMetadata(file)
      console.log('[App] Metadata extracted:', metadata)
    } catch (error) {
      console.log('[App] Metadata extraction failed, using defaults:', error)
      // Use default metadata if extraction fails
      metadata = {
        duration: 0,
        width: 0,
        height: 0,
        format: file.type || 'video/mp4',
        size: file.size,
      }
    }

    setVideoFile(file)
    setVideoMetadata(metadata)

    // Start transcription
    try {
      console.log('[App] Starting transcription...')
      await startTranscription(file, metadata)
    } catch (error) {
      console.log('[App] Transcription error:', error)
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
    // Load the transcript into demo mode
    setDemoTranscript(loadedTranscript)
    // Clear any existing video/transcription
    handleRemoveVideo()
    setShowLibrary(false)
    console.log(
      '✅ Loaded transcript from library:',
      loadedTranscript.metadata.fileName
    )
  }

  // Show auth modal
  if (showAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 safe-area-inset-top safe-area-inset-bottom"
        style={{
          background:
            'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)',
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
        className="min-h-screen p-3 sm:p-6 lg:p-8 safe-area-inset-top safe-area-inset-bottom"
        style={{
          background:
            'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)',
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
      className="min-h-screen p-3 sm:p-6 lg:p-8 safe-area-inset-top safe-area-inset-bottom"
      style={{
        background:
          'linear-gradient(135deg, #f8fafc 0%, rgba(239, 246, 255, 0.5) 50%, rgba(250, 245, 255, 0.5) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <Header />

        {/* Action buttons - Responsive layout */}
        <div className="mb-4 sm:mb-6">
          {/* Mobile: Stacked layout */}
          {device.isMobile ? (
            <div className="space-y-3">
              {/* Top row: Demo + API Config */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={loadDemoTranscript}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600 text-sm h-10"
                >
                  🎬 Demo
                </Button>
                {demoTranscript && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="h-10"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setShowApiSettings(true)}
                  className={`h-10 px-3 ${
                    apiConfig
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-red-500 text-red-600'
                  }`}
                >
                  {apiConfig ? '🔑' : '⚠️'} API
                </Button>
              </div>

              {/* Bottom row: Auth buttons */}
              <div className="flex gap-2">
                {!isAuthenticated ? (
                  <Button
                    onClick={() => setShowAuth(true)}
                    className="flex-1 h-10"
                  >
                    Login / Register
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowLibrary(true)}
                      className="flex-1 h-10 text-sm"
                    >
                      Transcripts
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCostSummary(true)}
                      className="h-10 px-3"
                    >
                      $
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="h-10 px-3"
                    >
                      Exit
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            /* Desktop: Horizontal layout */
            <div className="flex flex-wrap justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={loadDemoTranscript}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                >
                  🎬 Load Sprint 4 Demo (60 Entries)
                </Button>
                {demoTranscript && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Clear Demo
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowApiSettings(true)}
                  className={
                    apiConfig
                      ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                      : 'border-red-500 text-red-600 hover:bg-red-50'
                  }
                >
                  {apiConfig ? '🔑 API Configured' : '⚠️ Configure API'}
                </Button>
                {!isAuthenticated ? (
                  <Button onClick={() => setShowAuth(true)}>
                    Login / Register
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setShowLibrary(true)}
                    >
                      My Transcripts
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCostSummary(true)}
                    >
                      Summary
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main content grid - Single column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Upload & Processing */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-1">
            {!videoFile ? (
              <UploadVideo onUpload={handleVideoUpload} error={uploadError} />
            ) : (
              <VideoPreview
                file={videoFile}
                metadata={videoMetadata!}
                onRemove={handleRemoveVideo}
                onPlayVideo={() => setIsVideoPlayerOpen(true)}
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
              onShowCostSummary={
                isAuthenticated ? () => setShowCostSummary(true) : undefined
              }
            />
          </div>
        </div>

        {/* Cost Summary Modal */}
        {isAuthenticated && (
          <CostSummaryModal
            isOpen={showCostSummary}
            onClose={() => setShowCostSummary(false)}
            stats={usageTracker.getUserUsage(
              apiClient.getCurrentUser()?.id || 1
            )}
            monthlyStats={usageTracker.getMonthlyUsage(
              apiClient.getCurrentUser()?.id || 1
            )}
            currentMonthStats={usageTracker.getCurrentMonthUsage(
              apiClient.getCurrentUser()?.id || 1
            )}
          />
        )}

        {/* Video Player Modal */}
        {videoFile && videoObjectUrl && (
          <VideoPlayerModal
            isOpen={isVideoPlayerOpen}
            onClose={() => setIsVideoPlayerOpen(false)}
            videoFile={videoFile}
            videoUrl={videoObjectUrl}
            fileName={videoFile.name}
          />
        )}

        {/* API Key Settings Modal */}
        <ApiKeySettings
          isOpen={showApiSettings}
          onClose={() => setShowApiSettings(false)}
          onSave={config => {
            setApiConfig(config)
            // Reset dismissed flag when config changes
            setBalanceAlertDismissed(false)
          }}
          currentConfig={apiConfig || undefined}
        />

        {/* Balance Alert for Paid Mode */}
        {apiConfig?.mode === 'paid' &&
          shouldShowBalanceAlert(
            apiConfig.paidBalance || 0,
            balanceAlertDismissed
          ) && (
            <BalanceAlert
              balance={apiConfig.paidBalance || 0}
              onAddCredit={() => setShowApiSettings(true)}
              onDismiss={() => setBalanceAlertDismissed(true)}
            />
          )}

        {/* Version Badge - Fixed bottom right */}
        <VersionBadge
          versionInfo={versionInfo}
          position="bottom-right"
          showDetails={true}
        />
      </div>
    </div>
  )
}

export default App
