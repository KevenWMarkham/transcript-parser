import { useState } from "react";
import { VideoUploader } from "./components/VideoUploader";
import { TranscriptViewer } from "./components/TranscriptViewer";
import { ProcessingStatus } from "./components/ProcessingStatus";
import { motion, AnimatePresence } from "motion/react";

export type TranscriptSegment = {
  id: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
};

export type ProcessingState = "idle" | "uploading" | "processing" | "complete" | "error";

export default function App() {
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

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

    // Simulating API processing time
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock transcript data with multiple speakers
    const mockTranscript: TranscriptSegment[] = [
      {
        id: "1",
        speaker: "Speaker 1",
        text: "Welcome everyone to today's meeting. I'd like to start by discussing our Q4 objectives.",
        startTime: 0,
        endTime: 6.5,
        confidence: 0.96,
      },
      {
        id: "2",
        speaker: "Speaker 2",
        text: "Thanks for having me. I'm excited to share our progress on the marketing initiatives.",
        startTime: 7.0,
        endTime: 12.3,
        confidence: 0.94,
      },
      {
        id: "3",
        speaker: "Speaker 1",
        text: "Great! Before we dive into that, does anyone have any questions about the agenda?",
        startTime: 12.8,
        endTime: 17.5,
        confidence: 0.97,
      },
      {
        id: "4",
        speaker: "Speaker 3",
        text: "Yes, I was wondering if we could also touch on the budget allocation for the new project.",
        startTime: 18.0,
        endTime: 23.2,
        confidence: 0.95,
      },
      {
        id: "5",
        speaker: "Speaker 1",
        text: "Absolutely, we'll cover that in the finance section. Let's proceed with the marketing update first.",
        startTime: 23.7,
        endTime: 29.4,
        confidence: 0.96,
      },
      {
        id: "6",
        speaker: "Speaker 2",
        text: "Perfect. So we've seen a 35% increase in engagement across our social media platforms this quarter. The new campaign targeting millennials has been particularly successful.",
        startTime: 30.0,
        endTime: 41.2,
        confidence: 0.93,
      },
      {
        id: "7",
        speaker: "Speaker 3",
        text: "That's impressive! What were the main drivers of that growth?",
        startTime: 41.8,
        endTime: 45.5,
        confidence: 0.96,
      },
      {
        id: "8",
        speaker: "Speaker 2",
        text: "We focused on short-form video content and influencer partnerships. The ROI has exceeded our initial projections by about 20%.",
        startTime: 46.0,
        endTime: 54.3,
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
            <div className="flex items-center gap-4 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Video Transcript Parser
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-1">
                  AI-powered speaker identification and transcription
                </p>
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
          </motion.div>

          {/* Right Column - Transcript */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TranscriptViewer
              transcript={transcript}
              isProcessing={processingState === "processing" || processingState === "uploading"}
            />
          </motion.div>
        </div>

        {/* Integration Instructions */}
        <AnimatePresence>
          {processingState === "complete" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6 sm:mt-8"
            >
              <div className="backdrop-blur-xl bg-gradient-to-br from-blue-50/80 to-purple-50/80 border border-blue-200/50 rounded-3xl p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-xl text-white text-xl">
                    🔌
                  </div>
                  <div>
                    <h3 className="text-blue-900">API Integration Guide</h3>
                    <p className="text-slate-700 text-sm mt-1">
                      This is a demo with mock data. To implement real transcription with speaker diarization:
                    </p>
                  </div>
                </div>
                <div className="space-y-3 ml-14">
                  <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <div>
                        <p className="text-slate-800 text-sm"><strong>AssemblyAI:</strong> Use their API with{" "}
                          <code className="bg-blue-100 px-2 py-1 rounded-lg text-xs">speaker_labels: true</code>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <div>
                        <p className="text-slate-800 text-sm"><strong>Google Cloud Speech-to-Text:</strong> Enable diarization in the API config</p>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <div>
                        <p className="text-slate-800 text-sm"><strong>AWS Transcribe:</strong> Use StartTranscriptionJob with speaker identification</p>
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/50">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-sm">•</span>
                      <div>
                        <p className="text-slate-800 text-sm"><strong>Azure Speech Services:</strong> Configure conversation transcription with speaker recognition</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}