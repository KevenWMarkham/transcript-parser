import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Copy,
  Check,
  FileText,
  Film,
  Code,
  Table,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import type { TranscriptSegment } from "../App";
import {
  exportAsText,
  exportAsSRT,
  exportAsWebVTT,
  exportAsJSON,
  exportAsCSV,
  downloadFile,
  copyToClipboard,
  getMimeType,
  type ExportOptions,
} from "../../utils/exportFormats";

interface ExportDialogProps {
  transcript: TranscriptSegment[];
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = "txt" | "srt" | "vtt" | "json" | "csv";

interface FormatInfo {
  id: ExportFormat;
  name: string;
  description: string;
  icon: any;
  color: string;
  extension: string;
}

const formats: FormatInfo[] = [
  {
    id: "txt",
    name: "Plain Text",
    description: "Readable format with timestamps",
    icon: FileText,
    color: "from-slate-500 to-slate-700",
    extension: ".txt",
  },
  {
    id: "srt",
    name: "SRT Subtitles",
    description: "SubRip format for video players",
    icon: Film,
    color: "from-blue-500 to-blue-700",
    extension: ".srt",
  },
  {
    id: "vtt",
    name: "WebVTT",
    description: "HTML5 video subtitle format",
    icon: Film,
    color: "from-purple-500 to-purple-700",
    extension: ".vtt",
  },
  {
    id: "json",
    name: "JSON",
    description: "Structured data for developers",
    icon: Code,
    color: "from-green-500 to-green-700",
    extension: ".json",
  },
  {
    id: "csv",
    name: "CSV",
    description: "Spreadsheet-compatible format",
    icon: Table,
    color: "from-orange-500 to-orange-700",
    extension: ".csv",
  },
];

export function ExportDialog({ transcript, isOpen, onClose }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("txt");
  const [options, setOptions] = useState<ExportOptions>({
    includeTimestamps: true,
    includeSpeakers: true,
    includeConfidence: true,
    timeFormat: "MM:SS",
  });
  const [copiedFormat, setCopiedFormat] = useState<ExportFormat | null>(null);

  const getExportContent = (format: ExportFormat): string => {
    switch (format) {
      case "txt":
        return exportAsText(transcript, options);
      case "srt":
        return exportAsSRT(transcript, options);
      case "vtt":
        return exportAsWebVTT(transcript, options);
      case "json":
        return exportAsJSON(transcript, options);
      case "csv":
        return exportAsCSV(transcript, options);
      default:
        return exportAsText(transcript, options);
    }
  };

  const handleDownload = (format: ExportFormat) => {
    const content = getExportContent(format);
    const filename = `transcript-${new Date().toISOString().slice(0, 10)}${
      formats.find((f) => f.id === format)?.extension
    }`;
    const mimeType = getMimeType(format);
    downloadFile(content, filename, mimeType);
  };

  const handleCopy = async (format: ExportFormat) => {
    const content = getExportContent(format);
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  const selectedFormatInfo = formats.find((f) => f.id === selectedFormat);

  // Options that apply to specific formats
  const showTimestampOption = ["txt"].includes(selectedFormat);
  const showSpeakerOption = ["txt", "srt", "vtt"].includes(selectedFormat);
  const showConfidenceOption = ["txt", "json", "csv"].includes(selectedFormat);
  const showTimeFormatOption = ["txt", "csv"].includes(selectedFormat);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 pb-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl"
        >
          <div className="backdrop-blur-xl bg-white/95 rounded-3xl shadow-2xl border border-white/50">
            {/* Header */}
            <div className="p-6 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50"></div>
                    <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-slate-800">Export Transcript</h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {transcript.length} {transcript.length === 1 ? "entry" : "entries"} ready to export
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(100vh-280px)] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Format Selection */}
                <div>
                  <Label className="text-slate-700 mb-3 block">Export Format</Label>
                  <div className="space-y-2">
                    {formats.map((format) => {
                      const Icon = format.icon;
                      const isSelected = selectedFormat === format.id;
                      const isCopied = copiedFormat === format.id;

                      return (
                        <motion.button
                          key={format.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                            isSelected
                              ? "border-blue-500 bg-blue-50/50 shadow-lg"
                              : "border-slate-200 bg-white/50 hover:border-slate-300 hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`relative p-2 rounded-lg bg-gradient-to-br ${format.color} flex-shrink-0`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-slate-800">
                                  {format.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-slate-200 text-slate-600"
                                >
                                  {format.extension}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-600">{format.description}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(format.id);
                              }}
                              className={`flex-1 bg-gradient-to-r ${format.color} hover:opacity-90 text-white shadow-lg transition-all duration-300 border-0 rounded-lg h-8 text-xs`}
                            >
                              <Download className="w-3 h-3 mr-1.5" />
                              Download
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(format.id);
                              }}
                              className="rounded-lg h-8 px-3 border-slate-300"
                            >
                              {isCopied ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Options & Preview */}
                <div className="space-y-4">
                  {/* Export Options */}
                  <div>
                    <Label className="text-slate-700 mb-3 block">Export Options</Label>
                    <div className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-slate-200/50 space-y-3">
                      {showTimestampOption && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={options.includeTimestamps}
                            onChange={(e) =>
                              setOptions({ ...options, includeTimestamps: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            Include timestamps
                          </span>
                        </label>
                      )}

                      {showSpeakerOption && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={options.includeSpeakers}
                            onChange={(e) =>
                              setOptions({ ...options, includeSpeakers: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            Include speaker labels
                          </span>
                        </label>
                      )}

                      {showConfidenceOption && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={options.includeConfidence}
                            onChange={(e) =>
                              setOptions({ ...options, includeConfidence: e.target.checked })
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            Include confidence scores
                          </span>
                        </label>
                      )}

                      {showTimeFormatOption && (
                        <div>
                          <Label className="text-xs text-slate-600 mb-2 block">Time Format</Label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setOptions({ ...options, timeFormat: "MM:SS" })}
                              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
                                options.timeFormat === "MM:SS"
                                  ? "bg-blue-500 text-white shadow-lg"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              MM:SS
                            </button>
                            <button
                              onClick={() => setOptions({ ...options, timeFormat: "HH:MM:SS" })}
                              className={`flex-1 py-2 px-3 rounded-lg text-xs transition-all ${
                                options.timeFormat === "HH:MM:SS"
                                  ? "bg-blue-500 text-white shadow-lg"
                                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                              }`}
                            >
                              HH:MM:SS
                            </button>
                          </div>
                        </div>
                      )}

                      {!showTimestampOption &&
                        !showSpeakerOption &&
                        !showConfidenceOption &&
                        !showTimeFormatOption && (
                          <p className="text-sm text-slate-500 text-center py-2">
                            No customization options for this format
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <Label className="text-slate-700 mb-3 block">Preview</Label>
                    <div className="backdrop-blur-sm bg-slate-900/95 rounded-2xl p-4 border border-slate-700/50 overflow-hidden">
                      <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
                        {getExportContent(selectedFormat)
                          .split("\n")
                          .slice(0, 15)
                          .join("\n")}
                        {getExportContent(selectedFormat).split("\n").length > 15 && (
                          <span className="text-slate-500">\n... (truncated)</span>
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200/50 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Ready to export
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose} className="rounded-xl">
                    Close
                  </Button>
                  {selectedFormatInfo && (
                    <Button
                      onClick={() => handleDownload(selectedFormat)}
                      className={`bg-gradient-to-r ${selectedFormatInfo.color} hover:opacity-90 text-white shadow-lg transition-all duration-300 border-0 rounded-xl`}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download {selectedFormatInfo.name}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}