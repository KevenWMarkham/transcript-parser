# Sprint 4 Execution Prompt - Enhanced Transcript Viewer & Real-time Updates

**Context**: Sprint 3 is complete with backend infrastructure, FFmpeg codec support, authentication, and auto-save functionality. The application can transcribe videos, save them to PostgreSQL, and display basic transcripts.

**Current State**:

- ✅ PostgreSQL database with Drizzle ORM
- ✅ Express backend with JWT authentication
- ✅ FFmpeg.wasm for universal codec support
- ✅ Login/Register/TranscriptLibrary components
- ✅ Basic TranscriptView component displaying entries
- ✅ Auto-save transcripts when authenticated

**Sprint 4 Goal**: Enhance the transcript viewer with virtualization for performance, add speaker summary panel, implement real-time updates, and create a polished demo-ready experience.

---

## Phase 1: Virtualized Transcript Display (Days 1-2)

### Step 1.1: Install Dependencies

```bash
npm install @tanstack/react-virtual
```

### Step 1.2: Create TranscriptList Component

Create `src/components/TranscriptList.tsx` with virtualization using `@tanstack/react-virtual`:

- Use `useVirtualizer` hook for efficient rendering
- Set parent container height (600px) with overflow auto
- Configure estimateSize to ~120px per entry
- Set overscan to 5 for smooth scrolling
- Use absolute positioning with translateY transforms
- Handle 1000+ entries without performance degradation

Key Features:

- Virtual scrolling for large transcripts
- Click handler for entry selection (future use)
- Highlighted entry support via `highlightedId` prop
- Smooth scrolling performance

### Step 1.3: Update TranscriptView Component

Refactor `src/components/TranscriptView.tsx` to use the new TranscriptList:

- Replace simple map with TranscriptList component
- Maintain existing speaker color display
- Keep timestamp formatting (MM:SS or HH:MM:SS)
- Preserve empty state message
- Add proper TypeScript types

### Step 1.4: Performance Testing

Create `src/components/TranscriptList.test.tsx`:

- Test rendering with 1000+ entries
- Verify virtual items are created correctly
- Test scroll position updates
- Benchmark render time (should be < 100ms)

---

## Phase 2: Speaker Summary Panel (Days 3-4)

### Step 2.1: Create SpeakerSummary Component

Create `src/components/SpeakerSummary.tsx`:

- Display speaker count badge at top
- Show each speaker with their assigned color
- Calculate stats using `useMemo`:
  - Segment count (number of times speaker spoke)
  - Total duration (sum of all speaking time)
  - Percentage of total transcript time
- Format durations using existing `formatDuration` utility
- Responsive card layout with Tailwind CSS

Speaker Card Structure:

```
┌─────────────────────────────┐
│ Speaker 1 (colored badge)   │
│ • 45 segments               │
│ • 12m 34s                   │
│ • 38% of total              │
└─────────────────────────────┘
```

### Step 2.2: Integrate with TranscriptView

Update `src/components/TranscriptView.tsx`:

- Add two-column layout (desktop) or stacked (mobile)
- Place SpeakerSummary in right sidebar (desktop) or above transcript (mobile)
- Pass speakers and transcript data as props
- Use Tailwind responsive classes (sm:, md:, lg:)

### Step 2.3: Add Speaker Stats Logic

Create `src/utils/speakerStats.ts`:

- Helper functions to calculate speaker statistics
- Type-safe interfaces for speaker stats
- Unit tests for calculation accuracy

### Step 2.4: Testing

Create `src/components/SpeakerSummary.test.tsx`:

- Test stat calculations with mock data
- Verify percentage calculations
- Test with multiple speakers
- Test with single speaker
- Test empty state

---

## Phase 3: Real-time Transcript Updates (Days 5-6)

### Step 3.1: Create Streaming Hook

Create `src/hooks/useStreamingTranscript.ts`:

- Manage entries array with useState
- `addEntry` function to append new entries
- `updateEntry` function to modify existing entries by ID
- Use useCallback for performance
- Type-safe with TranscriptEntry interface

### Step 3.2: Modify GeminiClient

Update `src/services/geminiClient.ts`:

- Add optional `onEntryComplete` callback to transcribe method
- Emit entry as soon as it's parsed from Gemini response
- Keep existing functionality for backward compatibility
- Update TypeScript types

### Step 3.3: Update useTranscription Hook

Modify `src/hooks/useTranscription.ts`:

- Add streaming mode support
- Call `onEntryComplete` callback during transcription
- Update TranscriptView in real-time as entries arrive
- Maintain existing non-streaming functionality

### Step 3.4: Testing

Create `src/hooks/useStreamingTranscript.test.ts`:

- Test addEntry function
- Test updateEntry function
- Test with rapid entry additions (stress test)
- Verify no memory leaks

---

## Phase 4: Performance Optimization (Days 7-8)

### Step 4.1: Component Optimization

Optimize existing components:

- Wrap TranscriptEntry with React.memo
- Add useMemo for expensive calculations (speaker stats)
- Add useCallback for event handlers
- Prevent unnecessary re-renders

Files to optimize:

- `src/components/TranscriptEntry.tsx`
- `src/components/SpeakerSummary.tsx`
- `src/components/TranscriptList.tsx`

### Step 4.2: Speaker Color Optimization

Update `src/data/sampleTranscript.ts`:

- Create speaker color palette constant
- Lazy load colors only when needed
- Cache color assignments

### Step 4.3: Debounce Scroll Events

Add debouncing if needed:

- Install lodash.debounce if necessary
- Debounce any scroll-triggered events
- Test performance impact

### Step 4.4: Performance Benchmarking

Create `src/utils/performanceBenchmark.ts`:

- Measure component render times
- Track virtual list performance
- Monitor memory usage
- Document results

Target Metrics:

- Initial render: < 100ms
- Scroll frame rate: 60 FPS
- Memory usage: Stable (no leaks)
- 1000+ entries: Smooth scrolling

---

## Phase 5: Testing & Polish (Days 9-10)

### Step 5.1: Unit Tests

Ensure all new components have tests:

- TranscriptList component
- SpeakerSummary component
- useStreamingTranscript hook
- speakerStats utilities

Target: ≥ 80% code coverage

### Step 5.2: E2E Tests

Create `tests/e2e/transcript-viewer.spec.ts`:

- Test large transcript display (50+ entries)
- Verify smooth scrolling
- Test speaker summary accuracy
- Test real-time updates if implemented

### Step 5.3: Create Demo

Prepare demo for Sprint review:

1. Generate large transcript (50+ entries)
2. Show smooth scrolling through transcript
3. Display speaker summary with accurate stats
4. Highlight speaker color coding
5. Show performance metrics

### Step 5.4: Documentation

Update README with:

- New virtualization features
- Speaker summary functionality
- Performance characteristics
- Demo instructions

---

## Definition of Done Checklist

- [ ] TranscriptList component renders 1000+ entries smoothly
- [ ] Virtual scrolling works with proper positioning
- [ ] SpeakerSummary displays accurate statistics
- [ ] Speaker stats calculate correctly (segments, duration, percentage)
- [ ] Two-column layout responsive on mobile/desktop
- [ ] TranscriptEntry optimized with React.memo
- [ ] useStreamingTranscript hook functional (foundation for future)
- [ ] All unit tests passing (≥ 80% coverage)
- [ ] E2E tests passing for transcript viewer
- [ ] Performance benchmarks met:
  - [ ] Initial render < 100ms
  - [ ] Smooth scrolling at 60 FPS
  - [ ] No memory leaks
- [ ] Demo prepared with 50+ entry transcript
- [ ] Documentation updated

---

## Technical Notes

### Key Dependencies

```json
{
  "@tanstack/react-virtual": "^3.x",
  "lodash.debounce": "^4.x" (optional)
}
```

### File Structure

```
src/
├── components/
│   ├── TranscriptList.tsx (NEW)
│   ├── SpeakerSummary.tsx (NEW)
│   ├── TranscriptView.tsx (UPDATED)
│   └── TranscriptEntry.tsx (OPTIMIZED)
├── hooks/
│   ├── useStreamingTranscript.ts (NEW)
│   └── useTranscription.ts (UPDATED)
├── utils/
│   ├── speakerStats.ts (NEW)
│   └── performanceBenchmark.ts (NEW)
└── services/
    └── geminiClient.ts (UPDATED - streaming support)
```

### Integration Points

- TranscriptView: Main container for list + summary
- TranscriptList: Virtualized entry display
- SpeakerSummary: Stats panel
- useStreamingTranscript: Real-time updates foundation

### Common Issues & Solutions

1. **Virtual list jumpy scrolling**: Adjust estimateSize to match actual entry height
2. **Speaker stats incorrect**: Verify startTime/endTime are numbers, not strings
3. **Memory leaks**: Clean up refs in useEffect returns
4. **Slow renders**: Profile with React DevTools, add more memoization

---

## Success Criteria

Sprint 4 is complete when:

1. ✅ User can smoothly scroll through 1000+ transcript entries
2. ✅ Speaker summary shows accurate statistics for all speakers
3. ✅ Performance benchmarks are met (< 100ms render)
4. ✅ All tests passing with ≥ 80% coverage
5. ✅ Demo prepared showing large transcript with smooth UX

---

**Next Session Instructions**:
Execute this Sprint 4 plan by implementing each phase sequentially. Test thoroughly after each phase. Maintain backward compatibility with existing functionality. Prioritize performance and user experience.

**Estimated Completion**: 10 development days (2 weeks)
**Created**: 2025-12-18
