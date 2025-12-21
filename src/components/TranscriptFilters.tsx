import { useState, useCallback } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { Speaker } from '@transcript-parser/types'

export interface TranscriptFilterOptions {
  selectedSpeakers: Set<number>
  timeRange: { start: number; end: number }
}

interface TranscriptFiltersProps {
  speakers: Speaker[]
  maxDuration: number
  filters: TranscriptFilterOptions
  onFiltersChange: (filters: TranscriptFilterOptions) => void
  onClearFilters: () => void
}

export function TranscriptFilters({
  speakers,
  maxDuration,
  filters,
  onFiltersChange,
  onClearFilters,
}: TranscriptFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const handleSpeakerToggle = useCallback(
    (speakerId: number) => {
      const newSelected = new Set(filters.selectedSpeakers)
      if (newSelected.has(speakerId)) {
        newSelected.delete(speakerId)
      } else {
        newSelected.add(speakerId)
      }
      onFiltersChange({
        ...filters,
        selectedSpeakers: newSelected,
      })
    },
    [filters, onFiltersChange]
  )

  const handleTimeRangeChange = useCallback(
    (type: 'start' | 'end', value: number) => {
      onFiltersChange({
        ...filters,
        timeRange: {
          ...filters.timeRange,
          [type]: value,
        },
      })
    },
    [filters, onFiltersChange]
  )

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const hasActiveFilters =
    filters.selectedSpeakers.size > 0 ||
    filters.timeRange.start > 0 ||
    filters.timeRange.end < maxDuration

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <h3 className="font-medium">Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-8 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Speaker Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Filter by Speaker
            </label>
            <div className="flex flex-wrap gap-2">
              {speakers.map(speaker => {
                const isSelected = filters.selectedSpeakers.has(speaker.id)
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
                  <button
                    key={speaker.id}
                    onClick={() => handleSpeakerToggle(speaker.id)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border transition-all ${
                      isSelected
                        ? colorClasses[speaker.color] || colorClasses.blue
                        : 'bg-muted text-muted-foreground border-muted hover:bg-muted/80'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isSelected
                          ? dotClasses[speaker.color] || dotClasses.blue
                          : 'bg-muted-foreground'
                      }`}
                    ></span>
                    {speaker.name}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Time Range
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-12">
                  Start:
                </span>
                <Input
                  type="number"
                  min={0}
                  max={filters.timeRange.end}
                  value={Math.floor(filters.timeRange.start)}
                  onChange={e =>
                    handleTimeRangeChange('start', Number(e.target.value))
                  }
                  className="w-20 h-8 text-xs"
                  aria-label="Start time in seconds"
                />
                <span className="text-xs text-muted-foreground">
                  ({formatTime(filters.timeRange.start)})
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-12">End:</span>
                <Input
                  type="number"
                  min={filters.timeRange.start}
                  max={maxDuration}
                  value={Math.floor(filters.timeRange.end)}
                  onChange={e =>
                    handleTimeRangeChange('end', Number(e.target.value))
                  }
                  className="w-20 h-8 text-xs"
                  aria-label="End time in seconds"
                />
                <span className="text-xs text-muted-foreground">
                  ({formatTime(filters.timeRange.end)})
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </Card>
  )
}
