import { useState } from 'react'
import { Header } from '@/components/Header'
import { UploadVideo } from '@/components/UploadVideo'
import { TranscriptView } from '@/components/TranscriptView'
import { ProcessingStatus } from '@/components/ProcessingStatus'
import { sampleTranscript } from '@/data/sampleTranscript'
import type { TranscriptData } from '@/types/transcript'

function App() {
  // Toggle this to show/hide the sample transcript
  const [transcript] = useState<TranscriptData | null>(sampleTranscript)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <UploadVideo />
            {transcript && <ProcessingStatus />}
          </div>

          {/* Right Column */}
          <div>
            <TranscriptView
              transcript={transcript}
              onExport={() => console.log('Transcript exported')}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
