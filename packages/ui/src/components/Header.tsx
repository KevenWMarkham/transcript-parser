import { motion } from 'framer-motion'
import { Video } from 'lucide-react'
import { Card } from './ui/card'

export function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 sm:mb-8"
    >
      <Card className="relative overflow-hidden p-0 border-none shadow-2xl">
        {/* Banner Image Background */}
        <div className="relative h-48 sm:h-56 w-full">
          {/* Image with overlay gradient */}
          <div className="absolute inset-0">
            <img
              src={`${import.meta.env.BASE_URL}images/banner.png`}
              alt="Video Transcript Parser Banner"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback gradient if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }
              }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="relative h-full flex items-center px-6 sm:px-8">
            <div className="flex items-center gap-4">
              {/* Icon with glow effect */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-60" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Video className="w-7 h-7 text-white" />
                </div>
              </div>

              {/* Title with gradient text */}
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white drop-shadow-lg">
                  Video Transcript Parser
                </h1>
                <p className="text-slate-200 text-sm sm:text-base mt-1 drop-shadow-md">
                  AI-powered speaker identification and transcription
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
