import {
  Users,
  TrendingUp,
  Clock,
  MessageSquare,
  Edit2,
  Check,
  X,
} from 'lucide-react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import type { Speaker, TranscriptEntry } from '@transcript-parser/types'
import { useMemo, useState } from 'react'

// Detect touch device (iOS/Android)
function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

interface SpeakerAnalyticsProps {
  speakers: Speaker[]
  entries: TranscriptEntry[]
  onSpeakerRename?: (speakerId: number, newName: string) => void
}

interface SpeakerStats {
  speaker: Speaker
  segments: number
  totalDuration: number
  percentage: number
}

export function SpeakerAnalytics({
  speakers,
  entries,
  onSpeakerRename,
}: SpeakerAnalyticsProps) {
  const [editingSpeakerId, setEditingSpeakerId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const speakerStats = useMemo(() => {
    // Calculate total duration
    const totalDuration = entries.reduce(
      (sum, entry) => sum + (entry.endTime - entry.startTime),
      0
    )

    // Calculate stats for each speaker
    const stats: SpeakerStats[] = speakers.map(speaker => {
      const speakerEntries = entries.filter(e => e.speaker === speaker.name)
      const duration = speakerEntries.reduce(
        (sum, entry) => sum + (entry.endTime - entry.startTime),
        0
      )
      const percentage =
        totalDuration > 0 ? (duration / totalDuration) * 100 : 0

      return {
        speaker,
        segments: speakerEntries.length,
        totalDuration: duration,
        percentage,
      }
    })

    // Sort by percentage descending
    return stats.sort((a, b) => b.percentage - a.percentage)
  }, [speakers, entries])

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}m ${secs}s`
  }

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

  const getProgressBarColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-400 to-blue-600',
      emerald: 'from-emerald-400 to-emerald-600',
      purple: 'from-purple-400 to-purple-600',
    }
    return colorMap[color] || colorMap.blue
  }

  const handleStartEdit = (speaker: Speaker) => {
    setEditingSpeakerId(speaker.id)
    setEditingName(speaker.name)
  }

  const handleSaveEdit = (speakerId: number) => {
    if (editingName.trim() && onSpeakerRename) {
      onSpeakerRename(speakerId, editingName.trim())
    }
    setEditingSpeakerId(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingSpeakerId(null)
    setEditingName('')
  }

  const SpeakerBadge = ({
    speaker,
    showEdit = false,
  }: {
    speaker: Speaker
    showEdit?: boolean
  }) => {
    const isEditing = editingSpeakerId === speaker.id

    if (isEditing) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center pl-4 pr-2 py-2 rounded-2xl text-sm font-medium border ${getSpeakerColorClasses(speaker.color)}`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full mr-2 ${getDotColorClasses(speaker.color)}`}
            ></span>
            <input
              type="text"
              value={editingName}
              onChange={e => setEditingName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleSaveEdit(speaker.id)
                }
                if (e.key === 'Escape') handleCancelEdit()
              }}
              onBlur={() => {
                // On mobile, save on blur (when tapping elsewhere)
                // Small delay to allow button clicks to register first
                setTimeout(() => {
                  if (editingSpeakerId === speaker.id && editingName.trim()) {
                    // Only save if still editing this speaker
                  }
                }, 200)
              }}
              className="bg-transparent border-none outline-none focus:outline-none min-w-[100px] max-w-[150px] text-base"
              autoFocus
              enterKeyHint="done"
              autoCapitalize="words"
              autoComplete="off"
              autoCorrect="off"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleSaveEdit(speaker.id)}
              className="h-10 w-10 p-0 text-emerald-600 hover:bg-emerald-100 active:bg-emerald-200"
            >
              <Check className="w-5 h-5" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-10 w-10 p-0 text-red-600 hover:bg-red-100 active:bg-red-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 group">
        <div
          className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-medium border ${getSpeakerColorClasses(speaker.color)}`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full mr-2 ${getDotColorClasses(speaker.color)}`}
          ></span>
          {speaker.name}
        </div>
        {showEdit && onSpeakerRename && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleStartEdit(speaker)}
            className={`h-8 w-8 p-0 transition-opacity text-slate-600 hover:text-blue-600 hover:bg-blue-50 ${
              isTouchDevice()
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Identified Speakers */}
      <Card className="p-6 backdrop-blur-sm bg-white/60 border-white/80">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">
              Identified Speakers
            </h3>
          </div>
          <Badge variant="secondary" className="text-sm">
            {speakers.length}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-3">
          {speakers.map(speaker => (
            <div key={speaker.id}>
              <SpeakerBadge speaker={speaker} showEdit={true} />
            </div>
          ))}
        </div>
      </Card>

      {/* Speaker Summary */}
      <Card className="p-6 backdrop-blur-sm bg-white/60 border-white/80">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl blur-lg opacity-30" />
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Speaker Summary
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="bg-purple-100 text-purple-700 border-purple-200"
          >
            {speakers.length} speakers
          </Badge>
        </div>

        <div className="space-y-6">
          {speakerStats.map(
            ({ speaker, segments, totalDuration, percentage }) => (
              <div key={speaker.id} className="space-y-3">
                {/* Speaker header */}
                <div className="flex items-center justify-between">
                  <SpeakerBadge speaker={speaker} showEdit={true} />
                  <div className="flex items-center gap-1 text-purple-600 font-semibold text-sm">
                    <TrendingUp className="w-4 h-4" />
                    {percentage.toFixed(1)}% of total
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{segments} segments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressBarColor(
                      speaker.color
                    )} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </Card>
    </div>
  )
}
