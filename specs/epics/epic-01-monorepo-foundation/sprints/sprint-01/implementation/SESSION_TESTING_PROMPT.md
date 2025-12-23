# Session 1: Testing Completion

**Sprint**: Epic 01 - Sprint 01 (85% Complete)
**Session**: Testing Completion
**Interface**: Claude Code CLI
**Recommended Model**: Sonnet (cost-effective for testing tasks)
**Date Created**: December 23, 2024
**Created By**: Orchestrator (Claude Web - Opus)

---

## Session Objective

Complete all unit and E2E testing to achieve sprint completion criteria:

- Unit test coverage ≥ 80%
- All E2E tests passing for 5 critical user flows
- No critical security issues

---

## Pre-Session Checklist

Before starting, ensure:

```bash
# 1. Install dependencies
pnpm install

# 2. Verify build works
pnpm build

# 3. Check current test status
pnpm test

# 4. Check current coverage (if available)
pnpm test:coverage
```

---

## Task Breakdown

### Phase 1: Assess Current State (15 min)

**Objective**: Understand what tests exist and what coverage we have

**Actions**:

1. Run `pnpm test` to see all test results
2. Run `pnpm test:coverage` to generate coverage report
3. Document gaps in a structured list

**Expected Outputs**:

- List of passing/failing tests
- Coverage percentages per package
- Identified gaps requiring new tests

---

### Phase 2: Unit Test Gaps (1-2 hours)

**Objective**: Achieve ≥80% coverage across all packages

#### Existing Test Files (19 files):

**Packages (11 files)**:
| Package | Test File | Priority |
|---------|-----------|----------|
| `module-sdk` | `src/index.test.ts` | Medium |
| `export` | `src/formats.test.ts` | High |
| `ai-services` | `src/usage-tracker.test.ts` | High |
| `audio-processing` | `src/audio-extractor.test.ts` | High |
| `ui` | `src/components/*.test.tsx` (6 files) | Medium |
| `ui` | `src/hooks/*.test.ts` (3 files) | Medium |
| `database` | `src/schema.test.ts` | Medium |

**Main App (8 files)**:
| Location | Test File | Priority |
|----------|-----------|----------|
| `src/services` | `geminiClient.test.ts` | High |
| `src/services` | `audioExtractor.test.ts` | High |
| `src/` | `App.test.tsx` | Low |
| `src/utils` | `fileUtils.test.ts` | Medium |
| `src/utils` | `textHighlight.test.ts` | Low |

#### Critical Packages Requiring Coverage Review:

**1. @transcript-parser/ai-services** (Critical)

```bash
# Test the Gemini client mocking
pnpm test --project=@transcript-parser/ai-services
```

Ensure mocks for:

- `@google/genai` API calls
- Environment variable handling
- Error scenarios (rate limits, network failures)

**2. @transcript-parser/audio-processing** (Critical)

```bash
pnpm test --project=@transcript-parser/audio-processing
```

Ensure mocks for:

- FFmpeg operations
- File/Blob handling
- Progress callbacks

**3. @transcript-parser/export** (High)

```bash
pnpm test --project=@transcript-parser/export
```

Test all formats:

- TXT, SRT, VTT, CSV, JSON exports
- Edge cases (empty transcripts, special characters)
- File download functionality

**4. @transcript-parser/database** (Medium)

```bash
pnpm test --project=@transcript-parser/database
```

Mock Drizzle ORM operations - no real DB connections.

---

### Phase 3: E2E Test Execution (1 hour)

**Objective**: Validate 5 critical user flows

#### E2E Test Files (8 specs):

| Spec File                      | Critical Flow               | Status       |
| ------------------------------ | --------------------------- | ------------ |
| `transcription-flow.spec.ts`   | Full transcription workflow | ✅ Review    |
| `video-upload.spec.ts`         | Video upload & preview      | ✅ Review    |
| `login-page.spec.ts`           | Authentication flow         | ⚠️ Update    |
| `transcript-viewer.spec.ts`    | Transcript display          | ✅ Review    |
| `cost-summary.spec.ts`         | Usage/cost tracking         | ✅ Review    |
| `sprint5-features.spec.ts`     | Sprint 5 features           | ⚠️ Review    |
| `glassmorphism-styles.spec.ts` | UI styling                  | Low priority |
| `test-video-thumbnail.spec.ts` | Thumbnails                  | Low priority |

#### 5 Critical User Flows to Validate:

1. **Video Upload Flow**
   - User can upload video/audio file
   - File validation works (rejects invalid types)
   - Preview displays correctly
   - Remove button works

2. **Transcription Flow**
   - Audio extraction starts
   - AI transcription runs
   - Progress updates show
   - Completion state displays

3. **Transcript Display Flow**
   - Transcript entries render
   - Speaker labels display
   - Timestamps are accurate
   - Virtual scrolling works for long transcripts

4. **Export Flow**
   - Export dialog opens
   - All formats available (TXT, SRT, VTT, CSV, JSON)
   - Download triggers correctly
   - Copy to clipboard works

5. **Search & Filter Flow**
   - Search input works
   - Matches highlight correctly
   - Speaker filter works
   - Results update in real-time

#### Running E2E Tests:

```bash
# Start dev server in background
pnpm dev &

# Wait for server
npx wait-on http://localhost:5173

# Run all E2E tests
pnpm test:e2e

# Run specific test file
npx playwright test tests/e2e/transcription-flow.spec.ts

# Run with UI for debugging
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

---

### Phase 4: Fix Failing Tests (30 min - 1 hour)

**Objective**: All tests green

**Common Issues and Fixes**:

1. **Mock issues**: Ensure all external APIs are mocked
2. **Timeout issues**: Increase timeouts for E2E tests
3. **Selector issues**: Update selectors if UI changed
4. **Missing fixtures**: Create test fixtures if needed

**Test Fixtures Location**: `tests/fixtures/`

- Ensure `sample-video.mp4` exists (or create a short test video)
- Ensure `test-file.txt` exists for invalid file type tests

---

### Phase 5: Coverage Report (15 min)

**Objective**: Document final coverage

```bash
# Generate full coverage report
pnpm test:coverage

# View HTML report
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

**Required Thresholds**:

```
Lines      : ≥ 80%
Functions  : ≥ 80%
Branches   : ≥ 80%
Statements : ≥ 80%
```

---

## Expert Guidance

### Testing Expert Recommendations:

- Focus on critical paths first (upload, transcription, export)
- Use snapshot testing sparingly (only for stable components)
- Test error boundaries and error states
- Ensure all async operations have proper timeouts

### Security Expert Recommendations:

- Test auth flow edge cases (expired tokens, invalid credentials)
- Verify no sensitive data in test output
- Ensure mocked API keys are clearly fake (e.g., `test-api-key-12345`)
- Test file upload validation (malicious file types)

---

## Acceptance Criteria

Before completing this session, verify:

- [ ] `pnpm test` - All unit tests passing
- [ ] `pnpm test:coverage` - Coverage ≥ 80% for all packages
- [ ] `pnpm test:e2e` - All 5 critical flows passing
- [ ] No console errors or warnings in test output
- [ ] No security vulnerabilities (hardcoded secrets, etc.)

---

## Commit Guidelines

After completion:

```bash
# Stage all test changes
git add .

# Commit with conventional commit message
git commit -m "test: complete unit and E2E tests for Sprint 01

- Achieve >80% coverage across all packages
- Add E2E tests for 5 critical user flows
- Fix all failing tests
- Add missing test fixtures"

# Push to feature branch
git push -u origin claude/orchestrator-kickoff-prompt-3dhcS
```

---

## Handoff to Orchestrator

Upon completion, report back with:

1. **Coverage Summary**:

   ```
   Package              | Lines | Functions | Branches |
   ---------------------|-------|-----------|----------|
   @transcript-parser/* | XX%   | XX%       | XX%      |
   src/                 | XX%   | XX%       | XX%      |
   ```

2. **E2E Test Results**:

   ```
   ✅/❌ Video Upload Flow
   ✅/❌ Transcription Flow
   ✅/❌ Transcript Display Flow
   ✅/❌ Export Flow
   ✅/❌ Search & Filter Flow
   ```

3. **Issues Found** (if any):
   - List any blockers or issues needing orchestrator decision

4. **Git Status**:
   - Commit hash
   - Branch pushed confirmation

---

## Next Session

After this session completes successfully, the Orchestrator will kick off:

**Session 2: Demo & Validation**

- Deploy to Development
- Run smoke tests
- Demo sprint features
- Deploy to Production

---

**Session Status**: 🟢 Ready for CLI Execution
**Estimated Duration**: 2-3 hours
**Priority**: High (Sprint blocker)

---

_Created by Orchestrator - Claude Web (Opus)_
_For execution by Claude Code CLI (Sonnet)_
