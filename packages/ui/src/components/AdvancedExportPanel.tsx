import { motion, AnimatePresence } from 'framer-motion'
import { Download } from 'lucide-react'

interface AdvancedExportPanelProps {
  isVisible: boolean
}

export function AdvancedExportPanel({ isVisible }: AdvancedExportPanelProps) {
  const formats = [
    { name: 'Plain Text', icon: '📄', desc: 'Human-readable format' },
    { name: 'SRT Subtitles', icon: '🎬', desc: 'Video player compatible' },
    { name: 'WebVTT', icon: '🌐', desc: 'HTML5 video format' },
    { name: 'JSON', icon: '💾', desc: 'Structured developer data' },
    { name: 'CSV', icon: '📊', desc: 'Spreadsheet ready' },
  ]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-3xl shadow-xl border border-purple-200/50 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-50" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
                  <Download className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Advanced Export
                </h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  5 export formats available
                </p>
              </div>
            </div>

            {/* Format Cards */}
            <div className="space-y-2">
              {formats.map((format, index) => (
                <motion.div
                  key={format.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="backdrop-blur-sm bg-white/60 rounded-xl p-3 border border-white/80 hover:bg-white/80 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{format.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800">
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

            {/* Info Callout */}
            <div className="mt-4 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200/50">
              <p className="text-xs text-slate-700 text-center">
                ✨ <strong>Click "Export"</strong> on the transcript to try all formats with customizable options!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
