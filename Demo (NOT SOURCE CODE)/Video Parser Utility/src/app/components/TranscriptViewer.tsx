import { Download, FileText, User, Clock, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import type { TranscriptSegment } from "../App";
import { motion, AnimatePresence } from "motion/react";

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  isProcessing: boolean;
}

export function TranscriptViewer({ transcript, isProcessing }: TranscriptViewerProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getSpeakerColor = (speaker: string): string => {
    const colors = {
      "Speaker 1": "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300/50",
      "Speaker 2": "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300/50",
      "Speaker 3": "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300/50",
      "Speaker 4": "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-300/50",
    };
    return colors[speaker as keyof typeof colors] || "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300/50";
  };

  const getSpeakerIcon = (speaker: string): string => {
    const icons = {
      "Speaker 1": "🔵",
      "Speaker 2": "🟢",
      "Speaker 3": "🟣",
      "Speaker 4": "🟠",
    };
    return icons[speaker as keyof typeof icons] || "👤";
  };

  const exportTranscript = () => {
    const text = transcript
      .map(
        (seg) =>
          `[${formatTime(seg.startTime)} - ${formatTime(seg.endTime)}] ${seg.speaker}:\n${seg.text}\n`
      )
      .join("\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const uniqueSpeakers = Array.from(new Set(transcript.map((t) => t.speaker)));

  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl blur opacity-50"></div>
              <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-2.5 rounded-xl shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-slate-800">Transcript</h2>
          </div>

          {transcript.length > 0 && (
            <Button
              onClick={exportTranscript}
              size="sm"
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        {transcript.length > 0 && (
          <>
            {/* Speaker Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-sm bg-gradient-to-r from-slate-50/80 to-blue-50/80 rounded-2xl p-4 border border-slate-200/50 mb-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-700">Identified Speakers</span>
                <Badge variant="secondary" className="ml-auto text-xs bg-slate-200 text-slate-700">
                  {uniqueSpeakers.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {uniqueSpeakers.map((speaker, index) => (
                  <motion.div
                    key={speaker}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge
                      variant="outline"
                      className={`${getSpeakerColor(speaker)} shadow-sm px-3 py-1.5 text-xs`}
                    >
                      <span className="mr-1.5">{getSpeakerIcon(speaker)}</span>
                      {speaker}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Separator className="bg-slate-200" />
          </>
        )}
      </div>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        {transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <AnimatePresence mode="wait">
              {isProcessing ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-40"
                    />
                    <div className="relative p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FileText className="w-12 h-12 text-blue-600" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-6 h-6 text-purple-500" />
                      </motion.div>
                    </div>
                  </div>
                  <p className="text-slate-700 mb-2">Processing your video...</p>
                  <p className="text-sm text-slate-500">
                    AI is analyzing audio and identifying speakers
                  </p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex gap-1.5 mt-4"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center"
                >
                  <div className="p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl mb-6 shadow-inner">
                    <FileText className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-2">No transcript yet</p>
                  <p className="text-sm text-slate-500">
                    Upload a video to generate a transcript
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-4 pb-4">
              {transcript.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-slate-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`${getSpeakerColor(segment.speaker)} shadow-sm px-3 py-1.5`}
                      >
                        <span className="mr-1.5">{getSpeakerIcon(segment.speaker)}</span>
                        {segment.speaker}
                      </Badge>
                      
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                        </span>
                      </div>
                      
                      {segment.confidence && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl text-xs text-green-700 ml-auto">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{Math.round(segment.confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-700 leading-relaxed pl-4 border-l-3 border-slate-300 group-hover:border-blue-400 transition-colors duration-300">
                      {segment.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
