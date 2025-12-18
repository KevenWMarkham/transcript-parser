import { useState } from "react";
import { VideoUploader } from "./components/VideoUploader";
import { TranscriptViewer } from "./components/TranscriptViewer";
import { ProcessingStatus } from "./components/ProcessingStatus";
import { AuthPage } from "./components/AuthPage";
import { UsageModal } from "./components/UsageModal";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./components/ui/button";
import { usageTracker } from "../utils/usageTracker";

export type TranscriptSegment = {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
};

export type ProcessingState =
  | "idle"
  | "uploading"
  | "processing"
  | "complete"
  | "error";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [processingState, setProcessingState] =
    useState<ProcessingState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<
    TranscriptSegment[]
  >([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUsageModalOpen, setIsUsageModalOpen] =
    useState(false);

  const handleVideoUpload = async (file: File) => {
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setProcessingState("uploading");
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setProcessingState("processing");
          // Start processing simulation
          setTimeout(() => processVideo(), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const processVideo = async () => {
    // MOCK IMPLEMENTATION
    // In production, you would:
    // 1. Upload video to your backend/cloud storage
    // 2. Call a transcription API with speaker diarization:
    //    - AssemblyAI (https://www.assemblyai.com/docs/API%20reference/transcript#speaker-labels)
    //    - Google Cloud Speech-to-Text (with diarization enabled)
    //    - AWS Transcribe (with speaker identification)
    //    - Azure Speech Services
    // 3. Process the response and format it for display

    // Simulate API token usage tracking
    usageTracker.track({
      model: "gemini-2.5-flash",
      operation: "speaker_diarization",
      inputTokens: 3240,
      outputTokens: 1850,
      cachedTokens: 640,
    });

    usageTracker.track({
      model: "gemini-2.5-flash",
      operation: "transcribe_video",
      inputTokens: 4120,
      outputTokens: 2180,
    });

    // Simulating API processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock transcript data with multiple speakers
    const mockTranscript: TranscriptSegment[] = [
      {
        id: "1",
        speaker: "Alice (Product Manager)",
        text: "Good morning everyone! Thanks for joining our Sprint 4 planning meeting.",
        startTime: 0,
        endTime: 5,
        confidence: 0.96,
      },
      {
        id: "2",
        speaker: "Bob (Engineer)",
        text: "Morning Alice! Ready to dive in.",
        startTime: 5,
        endTime: 8,
        confidence: 0.94,
      },
      {
        id: "3",
        speaker: "Carol (Designer)",
        text: "Hi team, excited to see what we have planned.",
        startTime: 8,
        endTime: 11,
        confidence: 0.95,
      },
      {
        id: "4",
        speaker: "Alice (Product Manager)",
        text: "Perfect. Our main goal for Sprint 4 is to enhance the transcript viewer with virtualization and speaker analytics.",
        startTime: 11,
        endTime: 18,
        confidence: 0.97,
      },
      {
        id: "5",
        speaker: "Bob (Engineer)",
        text: "I saw the spec. The virtual scrolling component looks interesting. Are we using TanStack Virtual?",
        startTime: 18,
        endTime: 23,
        confidence: 0.93,
      },
      {
        id: "6",
        speaker: "Alice (Product Manager)",
        text: "Exactly! TanStack React Virtual will handle our large transcript lists efficiently.",
        startTime: 23,
        endTime: 27,
        confidence: 0.96,
      },
      {
        id: "7",
        speaker: "Carol (Designer)",
        text: "What about the speaker summary panel? I have some mockups prepared.",
        startTime: 27,
        endTime: 32,
        confidence: 0.94,
      },
      {
        id: "8",
        speaker: "Alice (Product Manager)",
        text: "Great! The speaker summary will show statistics like segment count, duration, and percentage of total speaking time.",
        startTime: 32,
        endTime: 38,
        confidence: 0.95,
      },
      {
        id: "9",
        speaker: "Bob (Engineer)",
        text: "Should we memoize those calculations? Speaker stats could get expensive with large transcripts.",
        startTime: 38,
        endTime: 44,
        confidence: 0.92,
      },
      {
        id: "10",
        speaker: "Alice (Product Manager)",
        text: "Definitely. Phase 4 covers performance optimization with React.memo and useMemo.",
        startTime: 44,
        endTime: 48,
        confidence: 0.97,
      },
      {
        id: "11",
        speaker: "Carol (Designer)",
        text: "I love how the transcript segments will have those smooth hover effects and the glassmorphism design.",
        startTime: 48,
        endTime: 54,
        confidence: 0.95,
      },
      {
        id: "12",
        speaker: "Bob (Engineer)",
        text: "The color coding for different speakers really helps with readability. Great design choice!",
        startTime: 54,
        endTime: 59,
        confidence: 0.96,
      },
      {
        id: "13",
        speaker: "Alice (Product Manager)",
        text: "Agreed. The iOS aesthetic with the frosted glass backgrounds and smooth animations makes it feel very polished.",
        startTime: 59,
        endTime: 65,
        confidence: 0.94,
      },
      {
        id: "14",
        speaker: "Carol (Designer)",
        text: "Should we add any export options beyond plain text? Maybe JSON or SRT format for subtitles?",
        startTime: 65,
        endTime: 71,
        confidence: 0.93,
      },
      {
        id: "15",
        speaker: "Alice (Product Manager)",
        text: "Great idea! Let's add SRT export in the next sprint. For now, text export should be sufficient for MVP.",
        startTime: 71,
        endTime: 78,
        confidence: 0.96,
      },
      {
        id: "16",
        speaker: "Bob (Engineer)",
        text: "I'll make sure the transcript data structure supports timestamps properly for future SRT export.",
        startTime: 78,
        endTime: 83,
        confidence: 0.95,
      },
      {
        id: "17",
        speaker: "Carol (Designer)",
        text: "Perfect. One more thing - the confidence scores. Should we show them for every segment or hide low confidence ones?",
        startTime: 83,
        endTime: 90,
        confidence: 0.94,
      },
      {
        id: "18",
        speaker: "Alice (Product Manager)",
        text: "Let's show them all but maybe add a filter option later. Transparency is good, and users can judge for themselves.",
        startTime: 90,
        endTime: 97,
        confidence: 0.97,
      },
      {
        id: "19",
        speaker: "Bob (Engineer)",
        text: "Makes sense. I'll also add some error handling for failed transcriptions and edge cases.",
        startTime: 97,
        endTime: 102,
        confidence: 0.95,
      },
      {
        id: "20",
        speaker: "Carol (Designer)",
        text: "Awesome! I think we have a solid plan. Looking forward to seeing this come together.",
        startTime: 102,
        endTime: 107,
        confidence: 0.96,
      },
      {
        id: "21",
        speaker: "Alice (Product Manager)",
        text: "Excellent discussion everyone. Let's reconvene tomorrow for a progress check. Thanks team!",
        startTime: 107,
        endTime: 113,
        confidence: 0.97,
      },
      {
        id: "22",
        speaker: "Bob (Engineer)",
        text: "Thanks Alice! See you all tomorrow.",
        startTime: 113,
        endTime: 115,
        confidence: 0.96,
      },
      {
        id: "23",
        speaker: "Carol (Designer)",
        text: "Thanks everyone, have a great day!",
        startTime: 115,
        endTime: 117,
        confidence: 0.95,
      },
    ];

    setTranscript(mockTranscript);
    setProcessingState("complete");
  };

  const handleReset = () => {
    setProcessingState("idle");
    setUploadProgress(0);
    setTranscript([]);
    setVideoFile(null);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl("");
    }
  };

  const handleAuthenticate = async (
    email: string,
    password: string,
  ): Promise<boolean> => {
    // DEMO IMPLEMENTATION
    // In production, you should:
    // 1. Use Supabase Auth for secure authentication
    // 2. Validate credentials against a secure backend
    // 3. Store JWT tokens securely
    // 4. Implement proper session management

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo credentials (NEVER use in production!)
    if (
      email === "demo@example.com" &&
      password === "demo123"
    ) {
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    // DEMO IMPLEMENTATION
    // In production, you should:
    // 1. Use Supabase Auth: supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    // 2. Send verification email
    // 3. Store user profile information
    // 4. Handle email conflicts properly

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful registration - auto sign in
    // In production, you might require email verification first
    setIsAuthenticated(true);
    return true;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleReset();
  };

  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthenticate={handleAuthenticate}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="backdrop-blur-xl bg-white/80 rounded-3xl p-6 sm:p-8 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Video Transcript Parser
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base mt-1">
                    AI-powered speaker identification and
                    transcription
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setIsUsageModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Summary
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column - Upload & Processing */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            <VideoUploader
              onUpload={handleVideoUpload}
              disabled={processingState !== "idle"}
              videoUrl={videoUrl}
            />

            <AnimatePresence mode="wait">
              {processingState !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ProcessingStatus
                    state={processingState}
                    uploadProgress={uploadProgress}
                    onReset={handleReset}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Export Panel */}
            <AnimatePresence>
              {processingState === "complete" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="backdrop-blur-xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-3xl shadow-xl border border-purple-200/50 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
                        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                            />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-slate-800">
                          Advanced Export
                        </h3>
                        <p className="text-sm text-slate-600 mt-0.5">
                          5 export formats available
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        {
                          name: "Plain Text",
                          icon: "📄",
                          desc: "Human-readable format",
                        },
                        {
                          name: "SRT Subtitles",
                          icon: "🎬",
                          desc: "Video player compatible",
                        },
                        {
                          name: "WebVTT",
                          icon: "🌐",
                          desc: "HTML5 video format",
                        },
                        {
                          name: "JSON",
                          icon: "💾",
                          desc: "Structured developer data",
                        },
                        {
                          name: "CSV",
                          icon: "📊",
                          desc: "Spreadsheet ready",
                        },
                      ].map((format, index) => (
                        <motion.div
                          key={format.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 + index * 0.05,
                          }}
                          className="backdrop-blur-sm bg-white/60 rounded-xl p-3 border border-white/80"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {format.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-slate-800">
                                {format.name}
                              </div>
                              <div className="text-xs text-slate-600">
                                {format.desc}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200/50">
                      <p className="text-xs text-slate-700 text-center">
                        ✨ <strong>Click "Export"</strong> on
                        the transcript to try all formats with
                        customizable options!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column - Transcript */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TranscriptViewer
              transcript={transcript}
              isProcessing={
                processingState === "processing" ||
                processingState === "uploading"
              }
            />
          </motion.div>
        </div>

        {/* Usage Modal */}
        <UsageModal
          isOpen={isUsageModalOpen}
          onClose={() => setIsUsageModalOpen(false)}
        />
      </div>
    </div>
  );
}