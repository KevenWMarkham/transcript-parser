import { Video } from 'lucide-react'

export function Header() {
  return (
    <div className="w-full bg-card border-b">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Video className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Video Transcript Parser
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered speaker identification and transcription
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
