# Sprint 2 Execution Prompt - New Session

## Context

I'm continuing development of a Video Transcript Parser application. Sprint 1 (video upload with validation and preview) is complete with 28/28 tests passing. I need to execute Sprint 2 implementation.

## Project Overview

- **Tech Stack:** React + TypeScript, Tailwind CSS 4.x, shadcn/ui, Vite
- **Testing:** Jest (unit) + Playwright (E2E)
- **Sprint 1 Complete:** Video upload, drag-and-drop, validation, preview, metadata extraction
- **Sprint 2 Goal:** Gemini API integration for AI transcription with speaker diarization

## Current State

- **Working Directory:** `c:\code\transcript-parser`
- **Development Server:** `npm run dev` (port 5176)
- **Test Commands:**
  - `npm test` (Jest unit tests)
  - `npm run test:e2e` (Playwright E2E tests)
- **Git Branch:** master

## Sprint 2 Requirements

### Core Objectives

1. ✅ Install Google Gemini API SDK (`@google/generative-ai`)
2. ✅ Install and configure MSW (Mock Service Worker) for API testing
3. ✅ Fix type system: Change timestamps from `string` to `number` (seconds)
4. ✅ Create `AudioExtractor` service (MediaRecorder API-based)
5. ✅ Create `GeminiClient` service with retry logic and rate limiting
6. ✅ Create `useTranscription` custom hook for state management
7. ✅ Update `ProcessingStatus` component to show real-time progress
8. ✅ Integrate transcription flow into `App.tsx`
9. ✅ Write comprehensive test suite (unit + integration + E2E)
10. ✅ Maintain 80%+ test coverage
11. ✅ All tests must pass

### Key Files to Reference

- **Specs:** `specs/sprints/Sprint-02-AI-Integration.md` (detailed implementation guide)
- **Types:** `src/types/transcript.ts` (needs timestamp type updates)
- **Sample Data:** `src/data/sampleTranscript.ts` (needs updates after type changes)
- **Components to Update:**
  - `src/App.tsx` (integrate transcription flow)
  - `src/components/ProcessingStatus.tsx` (connect to real state)
  - `src/components/TranscriptView.tsx` (may need timestamp formatting)

### Critical Type Changes Required

**Before (Sprint 1):**

```typescript
interface TranscriptEntry {
  startTime: string // e.g., "0:05"
  endTime: string // e.g., "0:12"
}

interface TranscriptData {
  metadata?: {
    duration: string // e.g., "1:23"
  }
}
```

**After (Sprint 2):**

```typescript
interface TranscriptEntry {
  startTime: number // e.g., 5.2 (seconds)
  endTime: number // e.g., 12.8 (seconds)
}

interface TranscriptData {
  id: string // Add for database persistence
  metadata: {
    duration: number // e.g., 83 (seconds)
    fileName: string
    fileSize: number
    createdAt: string
    processedAt: string
    videoFormat: string
    model: string
  }
}
```

**UI Formatting:** Add utility functions in `fileUtils.ts`:

```typescript
export function formatTimestamp(seconds: number): string {
  // Convert 65.5 → "1:05"
}
```

## Services to Implement

### 1. AudioExtractor Service

**File:** `src/services/audioExtractor.ts`

**Requirements:**

- Extract audio from video File using MediaRecorder API
- Output format: `audio/webm;codecs=opus` (Gemini-compatible)
- Progress tracking via callback: `onProgress?: (progress: number) => void`
- Error handling for unsupported formats
- Memory efficient (revoke object URLs)

**Key Method:**

```typescript
class AudioExtractor {
  async extractAudio(
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<Blob>
}
```

### 2. GeminiClient Service

**File:** `src/services/geminiClient.ts`

**Requirements:**

- Use `@google/generative-ai` SDK
- Model: `gemini-1.5-pro`
- Rate limiting (max 1 concurrent request)
- Retry logic: 3 attempts with exponential backoff
- Custom error classes: `GeminiQuotaError`, `GeminiInvalidAudioError`
- Parse JSON response (handle markdown code blocks)
- Extract speakers and generate unique IDs

**Key Method:**

```typescript
class GeminiClient {
  async transcribeWithSpeakers(
    audioBlob: Blob,
    options?: TranscriptionOptions
  ): Promise<TranscriptData>
}
```

**Prompt Engineering:**

```typescript
const prompt = `
  Transcribe this audio and identify different speakers.

  For each segment, provide:
  - Speaker ID ("Speaker 1", "Speaker 2", etc.)
  - Start time in seconds (decimal, e.g., 12.5)
  - End time in seconds (decimal, e.g., 18.3)
  - Transcribed text
  - Confidence score (0-1)

  Return ONLY a JSON array with this structure (no markdown, no explanation):
  [
    {
      "speaker": "Speaker 1",
      "speakerNumber": 1,
      "startTime": 0.0,
      "endTime": 5.2,
      "text": "Hello everyone",
      "confidence": 0.95
    }
  ]
`
```

### 3. useTranscription Hook

**File:** `src/hooks/useTranscription.ts`

**Requirements:**

- Manage processing state machine
- Track progress (0-100%)
- Handle errors with retry capability
- Coordinate AudioExtractor + GeminiClient

**States:**

```typescript
type ProcessingState =
  | 'idle'
  | 'extracting-audio' // 0-30% progress
  | 'transcribing' // 30-100% progress
  | 'complete'
  | 'error'
```

**Hook API:**

```typescript
const {
  processingState: ProcessingState
  progress: number
  transcript: TranscriptData | null
  error: Error | null
  startTranscription: (file: File, metadata: VideoMetadata) => Promise<void>
  reset: () => void
} = useTranscription()
```

## Testing Requirements

### MSW Setup

**File:** `src/mocks/handlers.ts`, `src/mocks/server.ts`

Mock Gemini API endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`

### Unit Tests Required

1. `src/services/audioExtractor.test.ts`
   - Test audio extraction from video
   - Test progress callbacks
   - Test error handling

2. `src/services/geminiClient.test.ts`
   - Test transcription with mocked API
   - Test retry logic (3 attempts)
   - Test quota error handling
   - Test invalid audio error
   - Test JSON parsing with markdown cleanup

3. `src/hooks/useTranscription.test.ts`
   - Test state transitions
   - Test progress updates
   - Test error handling
   - Test reset functionality

### E2E Test

**File:** `tests/e2e/transcription-flow.spec.ts`

Test full flow:

1. Upload video
2. Extract audio (mocked)
3. Transcribe with Gemini (mocked)
4. Display transcript
5. Export transcript

## Environment Setup

### .env.local

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

**Note:** For development/testing, use MSW mocks. Real API key only needed for manual testing.

## Implementation Order

### Phase 1: Foundation (Start Here)

1. Install dependencies: `npm install @google/generative-ai`
2. Install MSW: `npm install -D msw`
3. Initialize MSW: `npx msw init public/ --save`
4. Update type definitions in `src/types/transcript.ts`
5. Add `formatTimestamp` utility to `src/utils/fileUtils.ts`
6. Update `src/data/sampleTranscript.ts` with new types
7. Fix TypeScript errors in components that use timestamps

### Phase 2: Services

1. Create `AudioExtractor` service
2. Write `AudioExtractor` tests
3. Create `GeminiClient` service
4. Setup MSW handlers for Gemini API
5. Write `GeminiClient` tests

### Phase 3: State Management

1. Create `useTranscription` hook
2. Write hook tests
3. Update `ProcessingStatus` component
4. Update `App.tsx` integration

### Phase 4: Testing & Polish

1. Create E2E test
2. Run full test suite
3. Manual testing with real API (optional)
4. Fix any issues
5. Verify 80%+ coverage

## Success Criteria

Sprint 2 is complete when:

- [ ] All dependencies installed
- [ ] Type system updated (timestamps are numbers)
- [ ] `AudioExtractor` service working with tests passing
- [ ] `GeminiClient` service working with tests passing
- [ ] `useTranscription` hook working with tests passing
- [ ] `ProcessingStatus` shows real-time progress
- [ ] `App.tsx` integrates full transcription flow
- [ ] All unit tests passing
- [ ] E2E test passing
- [ ] Test coverage ≥ 80%
- [ ] No TypeScript errors
- [ ] No ESLint errors

## Expert Team Approach

Use the multi-expert mental model:

- **Backend Integration Specialist:** AudioExtractor, GeminiClient
- **State Management Expert:** useTranscription hook
- **Testing Expert:** MSW setup, comprehensive test coverage
- **Data Model Architect:** Type system consistency
- **UX Designer:** ProcessingStatus UI/UX
- **Accessibility Expert:** ARIA attributes, screen reader support
- **Gemini API Specialist:** Prompt engineering, error handling

## Commands Reference

```bash
# Development
npm run dev

# Testing
npm test                  # Jest unit tests
npm run test:watch        # Jest watch mode
npm run test:coverage     # Coverage report
npm run test:e2e          # Playwright E2E
npm run test:e2e:ui       # Playwright UI mode

# Build
npm run build

# Linting
npm run lint
npm run lint:fix
```

## Important Notes

1. **Do NOT implement IndexedDB persistence yet** - that's Sprint 9
2. **Keep transcript in React state only** for Sprint 2
3. **Use MSW for all automated tests** - real Gemini API only for final manual verification
4. **Maintain accessibility standards** from Sprint 1
5. **Follow existing code style** (Prettier + ESLint configured)
6. **Git commits:** Use conventional commits (`feat:`, `fix:`, `test:`, etc.)

## Request for AI Assistant

Please execute Sprint 2 implementation following this plan:

1. Start with Phase 1 (dependencies + type updates)
2. Proceed through Phases 2-4 sequentially
3. Run tests after each major component
4. Fix issues as they arise
5. Maintain test coverage throughout
6. Update me on progress at each phase completion

**Start with:** Installing dependencies and updating the type system.

---

**Last Updated:** 2025-12-17
**Sprint 2 Spec:** See `specs/sprints/Sprint-02-AI-Integration.md` for detailed implementation examples
