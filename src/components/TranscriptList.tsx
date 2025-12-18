import { useRef, useMemo, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { TranscriptEntry as TranscriptEntryComponent } from '@/components/TranscriptEntry'
import type { TranscriptEntry, Speaker } from '@/types/transcript'

interface TranscriptListProps {
  entries: TranscriptEntry[]
  speakers: Speaker[]
  highlightedId?: string
  onEntryClick?: (entry: TranscriptEntry) => void
}

export function TranscriptList({
  entries,
  speakers,
  highlightedId,
  onEntryClick,
}: TranscriptListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated height per entry in pixels
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

          return (
            <div
              key={entry.id}
              data-index={virtualItem.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              onClick={() => onEntryClick?.(entry)}
              className={isHighlighted ? 'ring-2 ring-primary rounded' : ''}
            >
              <TranscriptEntryComponent
                entry={entry}
                speakerColor={getSpeakerColor(entry.speakerNumber)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
