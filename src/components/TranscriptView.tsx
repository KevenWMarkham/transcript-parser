import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Sparkles, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TranscriptList } from '@/components/TranscriptList'
import { SpeakerAnalytics } from '@/components/SpeakerAnalytics'
import { TranscriptSearch } from '@/components/TranscriptSearch'
import {
  TranscriptFilters,
  type TranscriptFilterOptions,
} from '@/components/TranscriptFilters'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { ExportDialog } from '@/components/ExportDialog'
import { TranscriptListSkeleton } from '@/components/TranscriptListSkeleton'
import { SpeakerNameSuggestions } from '@/components/SpeakerNameSuggestions'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import { useEditHistory } from '@/hooks/useEditHistory'
import { useToast } from '@/components/ui/toast'
import { countMatches } from '@/utils/textHighlight'
import { performanceMonitor } from '@/utils/performance'
import {
  SpeakerNameDetectionService,
  type DetectedSpeakerName,
} from '@/services/speakerNameDetection'
import type { TranscriptData } from '@transcript-parser/types'

interface TranscriptViewProps {
  transcript?: TranscriptData | null
  isLoading?: boolean
  onShowCostSummary?: () => void
}

export function TranscriptView({
  transcript,
  isLoading = false,
  onShowCostSummary,
}: TranscriptViewProps) {
  const hasTranscript = !!(transcript && transcript.entries.length > 0)
  const { addToast } = useToast()
  const { addEdit } = useEditHistory()

  // Export dialog state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [editedEntries, setEditedEntries] = useState<Set<string>>(new Set())

  // Speaker names state (for renaming)
  const [customSpeakerNames, setCustomSpeakerNames] = useState<
    Record<number, string>
  >({})

  // AI name detection state
  const [nameSuggestions, setNameSuggestions] = useState<DetectedSpeakerName[]>(
    []
  )
  const [isDetectingNames, setIsDetectingNames] = useState(false)

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<TranscriptFilterOptions>({
    selectedSpeakers: new Set<number>(),
    timeRange: {
      start: 0,
      end: Infinity, // Use Infinity so all entries pass the filter initially
    },
  })

  // Update time range when transcript changes
  useEffect(() => {
    if (transcript) {
      console.log('[TranscriptView] Transcript loaded:', {
        entriesCount: transcript.entries.length,
        duration: transcript.metadata.duration,
        firstEntry: transcript.entries[0],
      })

      setFilters(prev => ({
        ...prev,
        timeRange: {
          start: 0,
          end: transcript.metadata.duration,
        },
      }))
    }
  }, [transcript])

  // Memoize search query normalization
  const normalizedSearchQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  )

  // Step 1: Apply speaker filter
  const speakerFilteredEntries = useMemo(() => {
    const end = performanceMonitor.start('speaker-filter')
    if (!transcript) return []

    const result =
      filters.selectedSpeakers.size > 0
        ? transcript.entries.filter(entry =>
            filters.selectedSpeakers.has(entry.speakerNumber)
          )
        : transcript.entries

    end()
    return result
  }, [transcript, filters.selectedSpeakers])

  // Step 2: Apply time range filter
  const timeFilteredEntries = useMemo(() => {
    const end = performanceMonitor.start('time-filter')
    const result = speakerFilteredEntries.filter(
      entry =>
        entry.startTime >= filters.timeRange.start &&
        entry.startTime < filters.timeRange.end
    )
    end()
    return result
  }, [speakerFilteredEntries, filters.timeRange])

  // Step 3: Apply search filter
  const filteredEntries = useMemo(() => {
    const end = performanceMonitor.start('search-filter')
    const result = normalizedSearchQuery
      ? timeFilteredEntries.filter(entry =>
          entry.text.toLowerCase().includes(normalizedSearchQuery)
        )
      : timeFilteredEntries
    end()

    console.log('[TranscriptView] Filtering results:', {
      originalEntries: transcript?.entries.length || 0,
      speakerFiltered: speakerFilteredEntries.length,
      timeFiltered: timeFilteredEntries.length,
      finalFiltered: result.length,
      timeRange: filters.timeRange,
      searchQuery: normalizedSearchQuery,
    })

    return result
  }, [
    timeFilteredEntries,
    normalizedSearchQuery,
    transcript?.entries.length,
    speakerFilteredEntries.length,
    filters.timeRange,
  ])

  // Count search results
  const searchResultCount = useMemo(() => {
    if (!searchQuery.trim() || !transcript) return undefined

    return transcript.entries.reduce(
      (count, entry) => count + countMatches(entry.text, searchQuery),
      0
    )
  }, [transcript, searchQuery])

  const handleClearFilters = useCallback(() => {
    setFilters({
      selectedSpeakers: new Set<number>(),
      timeRange: {
        start: 0,
        end: transcript?.metadata.duration || 0,
      },
    })
  }, [transcript])

  // Keyboard navigation
  const searchInputRef = useRef<HTMLInputElement>(null)

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleEscape = useCallback(() => {
    setSearchQuery('')
    handleClearFilters()
  }, [handleClearFilters])

  const { selectedIndex } = useKeyboardNavigation({
    itemCount: filteredEntries.length,
    onSearch: focusSearch,
    onEscape: handleEscape,
    enabled: hasTranscript,
  })

  const handleExportClick = () => {
    setIsExportDialogOpen(true)
  }

  const handleEntryEdit = useCallback(
    (
      entryId: string,
      field: 'text' | 'startTime' | 'endTime',
      value: string | number
    ) => {
      // Find the original entry to get old value
      const entry = transcript?.entries.find(e => e.id === entryId)
      if (!entry) return

      const oldValue = entry[field]

      // Add to edit history
      addEdit({
        entryId,
        field,
        oldValue,
        newValue: value,
      })

      // Mark entry as edited
      setEditedEntries(prev => new Set(prev).add(entryId))

      // Show success toast
      addToast(`${field} updated successfully`, 'success')

      // TODO: Actually update the transcript data (would need state management)
      // For now, this is just tracking edits in history
    },
    [transcript, addEdit, addToast]
  )

  const handleSpeakerRename = useCallback(
    (speakerId: number, newName: string) => {
      setCustomSpeakerNames(prev => ({
        ...prev,
        [speakerId]: newName,
      }))
      addToast(`Speaker renamed to "${newName}"`, 'success')
    },
    [addToast]
  )

  // Auto-detect speaker names when transcript loads
  const handleDetectNames = useCallback(async () => {
    if (!transcript || transcript.entries.length === 0) return

    setIsDetectingNames(true)
    try {
      const detector = new SpeakerNameDetectionService()
      const suggestions = await detector.detectSpeakerNames(
        transcript.entries,
        transcript.speakers
      )

      if (suggestions.length > 0) {
        setNameSuggestions(suggestions)
        addToast(
          `Found ${suggestions.length} possible speaker name${suggestions.length !== 1 ? 's' : ''}`,
          'success'
        )
      } else {
        addToast('No speaker introductions detected', 'info')
      }
    } catch (error) {
      console.error('Name detection failed:', error)
      addToast('Failed to detect speaker names', 'error')
    } finally {
      setIsDetectingNames(false)
    }
  }, [transcript, addToast])

  const handleAcceptSuggestion = useCallback(
    (speakerId: number, name: string) => {
      handleSpeakerRename(speakerId, name)
      setNameSuggestions(prev => prev.filter(s => s.speakerId !== speakerId))
    },
    [handleSpeakerRename]
  )

  const handleRejectSuggestion = useCallback((speakerId: number) => {
    setNameSuggestions(prev => prev.filter(s => s.speakerId !== speakerId))
  }, [])

  const handleDismissAllSuggestions = useCallback(() => {
    setNameSuggestions([])
  }, [])

  // Create speakers list with custom names
  const speakersWithCustomNames = useMemo(() => {
    if (!transcript) return []
    return transcript.speakers.map(speaker => ({
      ...speaker,
      name: customSpeakerNames[speaker.id] || speaker.name,
    }))
  }, [transcript, customSpeakerNames])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="h-full flex flex-col"
    >
      <div className="backdrop-blur-xl bg-white/80 rounded-3xl shadow-lg border border-white/20 p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl blur-lg opacity-30" />
              <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-xl">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Transcript</h2>
          </div>
          <div className="flex items-center gap-3">
            {hasTranscript && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDetectNames}
                  disabled={isDetectingNames}
                  className="rounded-2xl gap-2 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-purple-200"
                >
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {isDetectingNames ? 'Detecting...' : 'Detect Names'}
                </Button>
                {onShowCostSummary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShowCostSummary}
                    className="rounded-2xl gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 border-emerald-200"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Cost
                  </Button>
                )}
                <KeyboardShortcuts />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportClick}
                  className="rounded-2xl gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0">
              <TranscriptListSkeleton count={8} />
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="space-y-4">
                <div className="h-32 bg-muted animate-pulse rounded-lg" />
                <div className="h-48 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ) : !hasTranscript ? (
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
          <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
            {/* Main transcript area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* AI Name Suggestions */}
              {nameSuggestions.length > 0 && (
                <div className="mb-6">
                  <SpeakerNameSuggestions
                    suggestions={nameSuggestions}
                    speakers={speakersWithCustomNames}
                    onAccept={handleAcceptSuggestion}
                    onReject={handleRejectSuggestion}
                    onDismissAll={handleDismissAllSuggestions}
                  />
                </div>
              )}

              {/* Search Bar */}
              <div className="mb-6">
                <TranscriptSearch
                  onSearchChange={setSearchQuery}
                  resultCount={searchResultCount}
                />
              </div>

              {/* Filters */}
              <div className="mb-6">
                <TranscriptFilters
                  speakers={speakersWithCustomNames}
                  maxDuration={transcript.metadata.duration}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>

              {/* Show no results message */}
              {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    Try adjusting your search query or filters
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      handleClearFilters()
                    }}
                  >
                    Clear search and filters
                  </Button>
                </div>
              ) : (
                <TranscriptList
                  entries={filteredEntries}
                  speakers={speakersWithCustomNames}
                  searchQuery={searchQuery}
                  selectedIndex={selectedIndex}
                  onEntryEdit={handleEntryEdit}
                  editedEntries={editedEntries}
                  enableEditing={true}
                />
              )}
            </div>

            {/* Speaker Analytics Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <SpeakerAnalytics
                entries={filteredEntries}
                speakers={speakersWithCustomNames}
                onSpeakerRename={handleSpeakerRename}
              />
            </div>
          </div>
        )}
      </div>

      {/* Export Dialog */}
      {hasTranscript && (
        <ExportDialog
          entries={filteredEntries}
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
        />
      )}
    </motion.div>
  )
}
