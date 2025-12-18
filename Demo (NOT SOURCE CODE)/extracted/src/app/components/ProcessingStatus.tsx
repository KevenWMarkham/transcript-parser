import { CheckCircle2, Loader2, Upload, Wand2, XCircle, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import type { ProcessingState } from "../App";
import { motion } from "motion/react";

interface ProcessingStatusProps {
  state: ProcessingState;
  uploadProgress: number;
  onReset: () => void;
}

export function ProcessingStatus({ state, uploadProgress, onReset }: ProcessingStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-600 p-2.5 rounded-xl shadow-lg">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-slate-800">Processing Status</h2>
        </div>

        <div className="space-y-4">
          {/* Upload Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
              state === "uploading"
                ? "bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50"
                : uploadProgress === 100
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50"
                : "bg-slate-50/50 border border-slate-200/50"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {state === "uploading" ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6 text-blue-600" />
                </motion.div>
              ) : uploadProgress === 100 ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </motion.div>
              ) : (
                <Upload className="w-6 h-6 text-slate-400" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 mb-1">Uploading video</p>
              {state === "uploading" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Progress value={uploadProgress} className="h-2.5 mb-2" />
                  <p className="text-xs text-slate-600">{uploadProgress}% complete</p>
                </motion.div>
              )}
              {uploadProgress === 100 && (
                <p className="text-xs text-green-700">Upload successful</p>
              )}
            </div>
          </motion.div>

          {/* Processing Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 ${
              state === "processing"
                ? "bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50"
                : state === "complete"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50"
                : state === "error"
                ? "bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/50"
                : "bg-slate-50/50 border border-slate-200/50"
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {state === "processing" ? (
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Wand2 className="w-6 h-6 text-purple-600" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  </motion.div>
                </div>
              ) : state === "complete" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </motion.div>
              ) : state === "error" ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <XCircle className="w-6 h-6 text-red-600" />
                </motion.div>
              ) : (
                <Wand2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-slate-800 mb-1">
                {state === "processing"
                  ? "Transcribing with AI"
                  : state === "complete"
                  ? "Transcription complete"
                  : state === "error"
                  ? "Processing failed"
                  : "Waiting for upload"}
              </p>
              {state === "processing" && (
                <p className="text-xs text-purple-700">
                  Detecting speakers and generating transcript...
                </p>
              )}
              {state === "complete" && (
                <p className="text-xs text-green-700">
                  All speakers identified successfully
                </p>
              )}
            </div>
          </motion.div>

          {/* Processing Details */}
          {state === "processing" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="backdrop-blur-sm bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-2xl p-4 border border-purple-200/50"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-purple-900">AI Processing Pipeline</p>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: "Audio extraction", done: true },
                  { label: "Speaker diarization", done: true },
                  { label: "Speech-to-text conversion", done: false },
                  { label: "Timestamp alignment", done: false },
                ].map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <motion.div
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent flex-shrink-0"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    )}
                    <span className={`text-xs ${step.done ? "text-slate-700" : "text-slate-500"}`}>
                      {step.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Reset Button */}
          {(state === "complete" || state === "error") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                onClick={onReset}
                variant="outline"
                className="w-full mt-2 rounded-xl border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Process Another Video
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
