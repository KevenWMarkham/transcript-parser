import { Clock, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatTimestamp } from '@/utils/fileUtils'
import type { TranscriptEntry as TranscriptEntryType } from '@/types/transcript'

interface TranscriptEntryProps {
  entry: TranscriptEntryType
  speakerColor: string
}

export function TranscriptEntry({ entry, speakerColor }: TranscriptEntryProps) {
  const getSpeakerColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      emerald:
        'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      purple:
        'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    }
    return colorMap[color] || colorMap.blue
  }

  const getDotColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <Badge className={getSpeakerColorClasses(speakerColor)}>
          <span
            className={`w-2 h-2 rounded-full mr-2 ${getDotColorClasses(speakerColor)}`}
          ></span>
          {entry.speaker}
        </Badge>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {formatTimestamp(entry.startTime)} - {formatTimestamp(entry.endTime)}
          </span>
        </div>

        {entry.confidence && (
          <div className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5" />
            <span>{Math.round(entry.confidence * 100)}%</span>
          </div>
        )}
      </div>

      <p className="text-foreground leading-relaxed">{entry.text}</p>
    </div>
  )
}
