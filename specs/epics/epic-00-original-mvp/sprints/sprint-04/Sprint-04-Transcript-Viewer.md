# Sprint 4: Enhanced Transcript Viewer & Real-time Updates

**Duration**: 2 weeks (Weeks 7-8)
**Sprint Goal**: Create polished transcript viewer with real-time updates, search foundation, and enhanced UX.

---

## Sprint Objectives

1. Enhance TranscriptViewer component with virtualization
2. Implement real-time transcript updates during processing
3. Add speaker summary panel
4. Optimize performance for large transcripts
5. Create working demo with polished UI

---

## User Stories

### Story 1: Transcript Display

**As a** user
**I want to** view my transcript in an easy-to-read format
**So that** I can quickly scan through the content

**Acceptance Criteria**:

- [ ] Transcript entries display in chronological order
- [ ] Speaker names and colors clearly visible
- [ ] Timestamps formatted as MM:SS or HH:MM:SS
- [ ] Scrollable list handles 1000+ entries smoothly
- [ ] Empty state shows helpful message

### Story 2: Speaker Summary

**As a** user
**I want to** see a summary of all speakers
**So that** I know how many people spoke and who they are

**Acceptance Criteria**:

- [ ] Speaker count badge displayed
- [ ] Each speaker shown with color and label
- [ ] Speaker stats visible (segment count, total duration)
- [ ] Clickable speakers filter transcript (future)

---

## Technical Tasks

### Task 4.1: Virtualized Transcript List

**Estimated Effort**: 2 days

```typescript
// src/components/TranscriptList.tsx

import { useVirtualizer } from '@tanstack/react-virtual'

interface TranscriptListProps {
  entries: TranscriptEntry[]
  onEntryClick?: (entry: TranscriptEntry) => void
  highlightedId?: string
}

export function TranscriptList({
  entries,
  onEntryClick,
  highlightedId
}: TranscriptListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: entries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated entry height
    overscan: 5
  })

  return (
    <div ref={parentRef} className="transcript-list" style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualItem => {
          const entry = entries[virtualItem.index]

          return (
            <div
              key={entry.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`
              }}
            >
              <TranscriptEntry
                entry={entry}
                onClick={() => onEntryClick?.(entry)}
                isHighlighted={entry.id === highlightedId}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### Task 4.2: Speaker Summary Panel

**Estimated Effort**: 2 days

```typescript
// src/components/SpeakerSummary.tsx

interface SpeakerSummaryProps {
  speakers: Speaker[]
  transcript: TranscriptData
}

export function SpeakerSummary({ speakers, transcript }: SpeakerSummaryProps) {
  const speakerStats = useMemo(() => {
    return speakers.map(speaker => {
      const segments = transcript.entries.filter(
        e => e.speakerNumber === speaker.id
      )

      const totalDuration = segments.reduce(
        (sum, s) => sum + (s.endTime - s.startTime),
        0
      )

      return {
        ...speaker,
        segmentCount: segments.length,
        totalDuration,
        percentage: (totalDuration / transcript.metadata.duration) * 100
      }
    })
  }, [speakers, transcript])

  return (
    <div className="speaker-summary">
      <h3>Speakers ({speakers.length})</h3>

      {speakerStats.map(speaker => (
        <div key={speaker.id} className="speaker-card">
          <div className="speaker-badge" style={{ backgroundColor: speaker.color }}>
            {speaker.name}
          </div>

          <div className="speaker-stats">
            <span>{speaker.segmentCount} segments</span>
            <span>{formatDuration(speaker.totalDuration)}</span>
            <span>{speaker.percentage.toFixed(0)}% of total</span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Task 4.3: Real-time Transcript Updates

**Estimated Effort**: 2 days

```typescript
// src/hooks/useStreamingTranscript.ts

export function useStreamingTranscript() {
  const [entries, setEntries] = useState<TranscriptEntry[]>([])

  const addEntry = useCallback((entry: TranscriptEntry) => {
    setEntries(prev => [...prev, entry])
  }, [])

  const updateEntry = useCallback(
    (id: string, updates: Partial<TranscriptEntry>) => {
      setEntries(prev =>
        prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
      )
    },
    []
  )

  return {
    entries,
    addEntry,
    updateEntry,
  }
}
```

### Task 4.4: Performance Optimization

**Estimated Effort**: 2 days

- Implement React.memo for TranscriptEntry
- Optimize re-renders with useMemo and useCallback
- Lazy load speaker colors
- Debounce scroll events

### Task 4.5: Testing

**Estimated Effort**: 2 days

- Unit tests for all new components
- Performance tests with 1000+ entries
- Integration tests for summary panel
- E2E tests for full transcript display

---

## Definition of Done

- [ ] TranscriptViewer handles 1000+ entries smoothly
- [ ] Speaker summary panel displays accurate stats
- [ ] All tests passing with ≥ 80% coverage
- [ ] **Working demo**: Large transcript with speaker summary
- [ ] Performance benchmarks met (< 100ms render time)

---

## Demo

1. Upload video generating 50+ transcript entries
2. Show smooth scrolling through transcript
3. Display speaker summary with stats
4. Highlight different speakers
5. Show performance metrics

---

**Sprint 4 Plan Version**: 1.0
**Created**: 2025-12-17
