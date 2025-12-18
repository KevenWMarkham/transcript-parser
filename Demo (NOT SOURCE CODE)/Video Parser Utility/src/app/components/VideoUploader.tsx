import { useRef } from "react";
import { Upload, Video, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface VideoUploaderProps {
  onUpload: (file: File) => void;
  disabled: boolean;
  videoUrl?: string;
}

export function VideoUploader({ onUpload, disabled, videoUrl }: VideoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onUpload(file);
    } else {
      alert("Please select a valid video file");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      whileHover={!disabled && !videoUrl ? { scale: 1.01 } : {}}
      className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-xl border border-white/50 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gradient-to-br from-violet-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Video className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-slate-800">Upload Video</h2>
        </div>

        {videoUrl ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/50">
              <video
                src={videoUrl}
                controls
                className="w-full bg-black"
                style={{ maxHeight: "320px" }}
              />
            </div>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-green-800">Video uploaded successfully</p>
            </div>
          </motion.div>
        ) : (
          <div
            onClick={disabled ? undefined : handleClick}
            className={`
              relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300
              ${
                disabled
                  ? "border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-60"
                  : "border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 cursor-pointer group"
              }
            `}
          >
            <motion.div
              whileHover={!disabled ? { scale: 1.05 } : {}}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative">
                <motion.div
                  animate={!disabled ? { rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  className={`p-5 rounded-2xl transition-all duration-300 ${
                    disabled
                      ? "bg-slate-100"
                      : "bg-gradient-to-br from-violet-100 to-purple-100 group-hover:from-violet-200 group-hover:to-purple-200"
                  }`}
                >
                  <Upload className={`w-10 h-10 ${disabled ? "text-slate-400" : "text-violet-600"}`} />
                </motion.div>
                {!disabled && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-5 h-5 text-purple-500" />
                  </motion.div>
                )}
              </div>
              
              <div>
                <p className="mb-1.5 text-slate-800">Drop your video here or click to browse</p>
                <p className="text-sm text-slate-500">
                  Supports MP4, MOV, AVI, WebM • Max 2GB
                </p>
              </div>
              
              <Button 
                disabled={disabled} 
                type="button"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-xl px-6"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </motion.div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </motion.div>
  );
}
