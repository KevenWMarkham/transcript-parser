import { FileText, Download, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TranscriptEntry } from '@/components/TranscriptEntry'
import { formatTimestamp } from '@/utils/fileUtils'
import type { TranscriptData } from '@/types/transcript'

interface TranscriptViewProps {
  transcript?: TranscriptData | null
  onExport?: () => void
}

export function TranscriptView({ transcript, onExport }: TranscriptViewProps) {
  const hasTranscript = transcript && transcript.entries.length > 0

  const exportTranscript = () => {
    if (!transcript) return

    // Format transcript as plain text
    const content = transcript.entries
      .map(
        entry =>
          `[${formatTimestamp(entry.startTime)} - ${formatTimestamp(entry.endTime)}] ${entry.speaker}:\n${entry.text}\n`
      )
      .join('\n')

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    if (onExport) onExport()
  }

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold">Transcript</h2>
          </div>
          {hasTranscript && (
            <Button variant="outline" size="sm" onClick={exportTranscript}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>

        {!hasTranscript ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No transcript yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Upload a video to generate a transcript
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Identified Speakers
              </span>
              <Badge variant="secondary">{transcript.speakers.length}</Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {transcript.speakers.map(speaker => {
                const colorClasses: Record<string, string> = {
                  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                  emerald:
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                  purple:
                    'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                }
                const dotClasses: Record<string, string> = {
                  blue: 'bg-blue-500',
                  emerald: 'bg-emerald-500',
                  purple: 'bg-purple-500',
                }

                return (
                  <Badge
                    key={speaker.id}
                    className={colorClasses[speaker.color] || colorClasses.blue}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${dotClasses[speaker.color] || dotClasses.blue}`}
                    ></span>
                    {speaker.name}
                  </Badge>
                )
              })}
            </div>

            <div className="space-y-1">
              {transcript.entries.map(entry => {
                const speaker = transcript.speakers.find(
                  s => s.id === entry.speakerNumber
                )
                return (
                  <TranscriptEntry
                    key={entry.id}
                    entry={entry}
                    speakerColor={speaker?.color || 'blue'}
                  />
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
