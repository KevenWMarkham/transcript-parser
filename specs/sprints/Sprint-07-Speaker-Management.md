# Sprint 7: Speaker Name Editing & Management

**Duration**: 2 weeks (Weeks 13-14)
**Sprint Goal**: Enable users to edit speaker names, customize colors, and persist changes to IndexedDB.

---

## Sprint Objectives

1. Implement speaker name editing UI
2. Add speaker color customization
3. Update all transcript entries when speaker name changes
4. Persist speaker customizations to IndexedDB
5. Working demo with editable speakers

---

## User Stories

### Story 1: Edit Speaker Names

**As a** user
**I want to** rename speakers from generic labels to actual names
**So that** the transcript is more meaningful

**Acceptance Criteria**:

- [ ] Click speaker badge to edit inline
- [ ] Name updates across all transcript entries
- [ ] Changes saved to IndexedDB
- [ ] Changes persist after page reload
- [ ] Validation prevents empty names

### Story 2: Customize Speaker Colors

**As a** user
**I want to** change speaker colors
**So that** I can distinguish speakers more easily

**Acceptance Criteria**:

- [ ] Color picker available for each speaker
- [ ] Color updates immediately in UI
- [ ] Custom colors saved with transcript
- [ ] Default colors provided as suggestions

---

## Technical Tasks

### Task 7.1: Speaker Editor Component

**Estimated Effort**: 2 days

```typescript
// src/components/SpeakerEditor.tsx

interface SpeakerEditorProps {
  speakers: Speaker[]
  onUpdate: (speakerId: number, updates: Partial<Speaker>) => void
}

export function SpeakerEditor({ speakers, onUpdate }: SpeakerEditorProps) {
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleNameChange = (speakerId: number, newName: string) => {
    if (newName.trim()) {
      onUpdate(speakerId, { name: newName })
      setEditingId(null)
    }
  }

  const handleColorChange = (speakerId: number, newColor: string) => {
    onUpdate(speakerId, { color: newColor })
  }

  return (
    <div className="speaker-editor">
      <h3>Edit Speakers</h3>

      {speakers.map(speaker => (
        <div key={speaker.id} className="speaker-edit-row">
          {editingId === speaker.id ? (
            <input
              autoFocus
              defaultValue={speaker.name}
              onBlur={(e) => handleNameChange(speaker.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameChange(speaker.id, e.currentTarget.value)
                }
              }}
            />
          ) : (
            <button
              className="speaker-name-btn"
              onClick={() => setEditingId(speaker.id)}
            >
              {speaker.name}
            </button>
          )}

          <input
            type="color"
            value={speaker.color}
            onChange={(e) => handleColorChange(speaker.id, e.target.value)}
          />

          <div className="speaker-preview" style={{ backgroundColor: speaker.color }}>
            Preview
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Task 7.2: Update Transcript with Speaker Changes

**Estimated Effort**: 1 day

```typescript
// src/hooks/useTranscriptEditing.ts

export function useTranscriptEditing(initialTranscript: TranscriptData) {
  const [transcript, setTranscript] = useState(initialTranscript)

  const updateSpeaker = useCallback(
    (speakerId: number, updates: Partial<Speaker>) => {
      setTranscript(prev => {
        // Update speakers array
        const updatedSpeakers = prev.speakers.map(speaker =>
          speaker.id === speakerId ? { ...speaker, ...updates } : speaker
        )

        // Update entries if name changed
        const updatedEntries = updates.name
          ? prev.entries.map(entry =>
              entry.speakerNumber === speakerId
                ? { ...entry, speaker: updates.name! }
                : entry
            )
          : prev.entries

        return {
          ...prev,
          speakers: updatedSpeakers,
          entries: updatedEntries,
        }
      })
    },
    []
  )

  return {
    transcript,
    updateSpeaker,
  }
}
```

### Task 7.3: IndexedDB Persistence

**Estimated Effort**: 2 days

```typescript
// Update database.ts

async function updateTranscript(
  id: string,
  updates: Partial<TranscriptData>
): Promise<void> {
  const stored = await db.transcripts.get(id)
  if (!stored) throw new Error('Transcript not found')

  stored.data = { ...stored.data, ...updates }

  await db.transcripts.put(stored)
}

// Auto-save on speaker changes
const debouncedSave = useMemo(
  () =>
    debounce(async (transcript: TranscriptData) => {
      await updateTranscript(transcript.id, transcript)
    }, 1000),
  []
)

useEffect(() => {
  debouncedSave(transcript)
}, [transcript, debouncedSave])
```

### Task 7.4: Testing

**Estimated Effort**: 3 days

**Test Cases**:

- Edit speaker name → Verify updates across transcript
- Change speaker color → Verify UI updates
- Save and reload → Verify persistence
- Validation tests (empty names, duplicate names)
- Integration tests with IndexedDB

---

## Definition of Done

- [ ] Speaker editing fully functional
- [ ] Changes persist to IndexedDB
- [ ] All tests passing ≥ 80% coverage
- [ ] **Working demo**: Edit speakers, verify persistence
- [ ] Code reviewed

---

## Demo

1. Generate transcript with default speaker names
2. Edit "Speaker 1" to "John Doe"
3. Change speaker color
4. Verify updates across all entries
5. Reload page → Show persistence

---

**Sprint 7 Plan Version**: 1.0
