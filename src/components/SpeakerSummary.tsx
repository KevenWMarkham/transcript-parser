import { useMemo } from 'react'
import { Users, MessageCircle, Clock, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateSpeakerStats, formatDuration } from '@/utils/speakerStats'
import type { TranscriptEntry, Speaker } from '@/types/transcript'

interface SpeakerSummaryProps {
  entries: TranscriptEntry[]
  speakers: Speaker[]
}

export function SpeakerSummary({ entries, speakers }: SpeakerSummaryProps) {
  const speakerStats = useMemo(
    () => calculateSpeakerStats(entries, speakers),
    [entries, speakers]
  )

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

  if (speakers.length === 0) {
    return null
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            Speaker Summary
          </CardTitle>
          <Badge variant="secondary" className="text-sm">
            {speakers.length} {speakers.length === 1 ? 'speaker' : 'speakers'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {speakerStats.map(stats => (
          <Card key={stats.speaker.id} className="border-2">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Speaker Name Badge */}
                <Badge className={getSpeakerColorClasses(stats.speaker.color)}>
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${getDotColorClasses(stats.speaker.color)}`}
                  ></span>
                  {stats.speaker.name}
                </Badge>

                {/* Statistics */}
                <div className="space-y-2 text-sm">
                  {/* Segment Count */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {stats.segmentCount}{' '}
                      {stats.segmentCount === 1 ? 'segment' : 'segments'}
                    </span>
                  </div>

                  {/* Total Duration */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(stats.totalDuration)}</span>
                  </div>

                  {/* Percentage */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{stats.percentage.toFixed(1)}% of total</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
