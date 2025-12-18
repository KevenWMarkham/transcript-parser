import { useRef, useMemo, useCallback, useEffect } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TranscriptEntry as TranscriptEntryComponent } from '@/components/TranscriptEntry'
import type { TranscriptEntry, Speaker } from '@/types/transcript'

interface TranscriptListProps {
  entries: TranscriptEntry[]
  speakers: Speaker[]
  highlightedId?: string
  selectedIndex?: number
  onEntryClick?: (entry: TranscriptEntry) => void
  searchQuery?: string
  onEntryEdit?: (entryId: string, field: 'text' | 'startTime' | 'endTime', value: string | number) => void
  editedEntries?: Set<string>
  enableEditing?: boolean
}

export function TranscriptList({
  entries,
  speakers,
  highlightedId,
  selectedIndex = -1,
  onEntryClick,
  searchQuery,
  onEntryEdit,
  editedEntries,
  enableEditing = false,
}: TranscriptListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const selectedElementRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150, // Increased estimated height per entry in pixels
    overscan: 5, // Number of items to render outside visible area for smooth scrolling
  })

  // Memoize speaker color map for performance
  const speakerColorMap = useMemo(() => {
    const map = new Map<number, string>()
    speakers.forEach(speaker => {
      map.set(speaker.id, speaker.color)
    })
    return map
  }, [speakers])

  const getSpeakerColor = useCallback(
    (speakerNumber: number): string => {
      return speakerColorMap.get(speakerNumber) || 'blue'
    },
    [speakerColorMap]
  )

  // Auto-scroll to selected entry
  useEffect(() => {
    if (selectedIndex >= 0 && selectedElementRef.current) {
      selectedElementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [selectedIndex])

  return (
    <div
      ref={parentRef}
      className="h-[600px] overflow-auto"
      style={{ contain: 'strict' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => {
          const entry = entries[virtualItem.index]
          const isHighlighted = highlightedId === entry.id
          const isSelected = selectedIndex === virtualItem.index

          return (
            <div
              key={entry.id}
              ref={isSelected ? selectedElementRef : undefined}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onClick={() => onEntryClick?.(entry)}
              className={`pb-4 transition-all ${
                isSelected
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 rounded bg-blue-50 dark:bg-blue-950/50'
                  : isHighlighted
                    ? 'ring-2 ring-primary rounded'
                    : ''
              }`}
            >
              <TranscriptEntryComponent
                entry={entry}
                speakerColor={getSpeakerColor(entry.speakerNumber)}
                searchQuery={searchQuery}
                isEdited={editedEntries?.has(entry.id)}
                onEdit={onEntryEdit}
                enableEditing={enableEditing}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
