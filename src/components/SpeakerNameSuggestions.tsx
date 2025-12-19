import { useState } from 'react'
import { Sparkles, Check, X, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { DetectedSpeakerName } from '@/services/speakerNameDetection'
import type { Speaker } from '@/types/transcript'

interface SpeakerNameSuggestionsProps {
  suggestions: DetectedSpeakerName[]
  speakers: Speaker[]
  onAccept: (speakerId: number, name: string) => void
  onReject: (speakerId: number) => void
  onDismissAll: () => void
}

export function SpeakerNameSuggestions({
  suggestions,
  speakers,
  onAccept,
  onReject,
  onDismissAll,
}: SpeakerNameSuggestionsProps) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())

  const activeSuggestions = suggestions.filter(s => !dismissed.has(s.speakerId))

  if (activeSuggestions.length === 0) {
    return null
  }

  const handleReject = (speakerId: number) => {
    setDismissed(prev => new Set(prev).add(speakerId))
    onReject(speakerId)
  }

  const handleAccept = (speakerId: number, name: string) => {
    setDismissed(prev => new Set(prev).add(speakerId))
    onAccept(speakerId, name)
  }

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      medium: 'bg-blue-100 text-blue-700 border-blue-300',
      low: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    }
    return colors[confidence as keyof typeof colors] || colors.low
  }

  const getSpeakerName = (speakerId: number) => {
    return (
      speakers.find(s => s.id === speakerId)?.name || `Speaker ${speakerId}`
    )
  }

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              AI Detected Speaker Names
            </h3>
            <p className="text-sm text-gray-600">
              Gemini found {activeSuggestions.length} possible name
              {activeSuggestions.length !== 1 ? 's' : ''} from introductions
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismissAll}
          className="text-gray-600 hover:text-gray-900"
        >
          Dismiss All
        </Button>
      </div>

      <div className="space-y-3">
        {activeSuggestions.map(suggestion => (
          <div
            key={suggestion.speakerId}
            className="p-3 bg-white rounded-lg border border-purple-200 shadow-sm"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {getSpeakerName(suggestion.speakerId)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-sm font-bold text-purple-700">
                    {suggestion.detectedName}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getConfidenceBadge(suggestion.confidence)}`}
                  >
                    {suggestion.confidence} confidence
                  </Badge>
                </div>
                {suggestion.evidence && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 italic">
                      "{suggestion.evidence}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={() =>
                  handleAccept(suggestion.speakerId, suggestion.detectedName)
                }
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
              >
                <Check className="w-4 h-4" />
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(suggestion.speakerId)}
                className="flex-1 gap-1"
              >
                <X className="w-4 h-4" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
