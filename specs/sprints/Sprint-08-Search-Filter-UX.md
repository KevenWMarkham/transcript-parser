# Sprint 8: Search, Filter & Enhanced UX

**Duration**: 2 weeks (Weeks 15-16)
**Sprint Goal**: Implement search/filter functionality, keyboard shortcuts, and UX improvements.

---

## Sprint Objectives

1. Add transcript search with highlighting
2. Implement speaker filtering
3. Add keyboard shortcuts for common actions
4. Improve overall UX and accessibility
5. Working demo with search and shortcuts

---

## User Stories

### Story 1: Search Transcript

**As a** user
**I want to** search for specific words or phrases in the transcript
**So that** I can quickly find relevant sections

**Acceptance Criteria**:

- [ ] Search bar filters transcript in real-time
- [ ] Matching text highlighted in results
- [ ] Result count displayed
- [ ] Navigate between results with arrows
- [ ] Clear search button

### Story 2: Filter by Speaker

**As a** user
**I want to** filter transcript to show only specific speakers
**So that** I can focus on what certain people said

**Acceptance Criteria**:

- [ ] Click speaker badge to filter
- [ ] Multiple speakers can be selected
- [ ] "Clear filters" button
- [ ] Filtered count shown

### Story 3: Keyboard Shortcuts

**As a** user
**I want** keyboard shortcuts for common actions
**So that** I can work more efficiently

**Acceptance Criteria**:

- [ ] Space: play/pause video
- [ ] Ctrl/Cmd + F: focus search
- [ ] Ctrl/Cmd + E: export menu
- [ ] Arrow keys: navigate results
- [ ] Escape: clear search
- [ ] Shortcuts help panel (?)

---

## Technical Tasks

### Task 8.1: Search Implementation

**Estimated Effort**: 2 days

```typescript
// src/hooks/useTranscriptSearch.ts

export function useTranscriptSearch(entries: TranscriptEntry[]) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState(entries)
  const [matchCount, setMatchCount] = useState(0)

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEntries(entries)
      setMatchCount(0)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = entries.filter(entry =>
      entry.text.toLowerCase().includes(query) ||
      entry.speaker.toLowerCase().includes(query)
    )

    setFilteredEntries(filtered)
    setMatchCount(filtered.length)
  }, [searchQuery, entries])

  return {
    searchQuery,
    setSearchQuery,
    filteredEntries,
    matchCount
  }
}

// src/components/SearchBar.tsx

export function SearchBar({ onSearch, resultCount }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        inputRef.current?.focus()
      }

      if (e.key === 'Escape') {
        setQuery('')
        onSearch('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearch])

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="search-bar">
      <Search className="w-4 h-4" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search transcript... (Ctrl+F)"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
      />

      {query && (
        <>
          <span className="result-count">{resultCount} results</span>
          <button onClick={() => handleChange('')}>
            <X className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}
```

### Task 8.2: Text Highlighting

**Estimated Effort**: 1 day

```typescript
// src/components/HighlightedText.tsx

interface HighlightedTextProps {
  text: string
  highlight: string
}

export function HighlightedText({ text, highlight }: HighlightedTextProps) {
  if (!highlight) return <>{text}</>

  const parts = text.split(new RegExp(`(${escapeRegExp(highlight)})`, 'gi'))

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  )
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
```

### Task 8.3: Speaker Filter

**Estimated Effort**: 2 days

```typescript
// src/hooks/useSpeakerFilter.ts

export function useSpeakerFilter(entries: TranscriptEntry[]) {
  const [selectedSpeakers, setSelectedSpeakers] = useState<number[]>([])

  const toggleSpeaker = useCallback((speakerId: number) => {
    setSelectedSpeakers(prev =>
      prev.includes(speakerId)
        ? prev.filter(id => id !== speakerId)
        : [...prev, speakerId]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedSpeakers([])
  }, [])

  const filteredEntries = useMemo(() => {
    if (selectedSpeakers.length === 0) return entries

    return entries.filter(entry =>
      selectedSpeakers.includes(entry.speakerNumber)
    )
  }, [entries, selectedSpeakers])

  return {
    selectedSpeakers,
    toggleSpeaker,
    clearFilters,
    filteredEntries,
  }
}
```

### Task 8.4: Keyboard Shortcuts

**Estimated Effort**: 2 days

```typescript
// src/hooks/useKeyboardShortcuts.ts

export function useKeyboardShortcuts(actions: KeyboardActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F: Search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        actions.focusSearch()
      }

      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        actions.openExport()
      }

      // Space: Play/Pause (if not in input)
      if (e.key === ' ' && !isInputFocused()) {
        e.preventDefault()
        actions.togglePlayPause()
      }

      // ?: Help
      if (e.key === '?') {
        actions.showHelp()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions])
}

function isInputFocused(): boolean {
  const active = document.activeElement
  return active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA'
}

// Shortcuts help modal
export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
  const shortcuts = [
    { keys: 'Ctrl/Cmd + F', description: 'Focus search' },
    { keys: 'Ctrl/Cmd + E', description: 'Open export menu' },
    { keys: 'Space', description: 'Play/pause video' },
    { keys: 'Escape', description: 'Clear search' },
    { keys: '?', description: 'Show this help' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>

        <div className="shortcuts-list">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-row">
              <kbd className="kbd">{shortcut.keys}</kbd>
              <span>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Task 8.5: UX Improvements

**Estimated Effort**: 2 days

- Add loading skeletons
- Improve error messages
- Add tooltips for icons
- Smooth transitions between states
- Mobile responsive refinements

### Task 8.6: Testing

**Estimated Effort**: 3 days

**Test Cases**:

- Search filters correctly
- Highlighting works with special characters
- Speaker filter toggles
- Keyboard shortcuts work
- Accessibility tests (screen reader, keyboard nav)

---

## Definition of Done

- [ ] Search and filter working smoothly
- [ ] Keyboard shortcuts implemented
- [ ] UX improvements complete
- [ ] Accessibility compliance (WCAG 2.1 AA)
- [ ] Test coverage ≥ 80%
- [ ] **Working demo**: Search, filter, use shortcuts
- [ ] Code reviewed

---

## Demo

1. Search for word → Show highlighting
2. Filter by speaker → Show filtered results
3. Use keyboard shortcuts (Ctrl+F, Space, etc.)
4. Show shortcuts help panel (?)
5. Demonstrate accessibility features

---

**Sprint 8 Plan Version**: 1.0
