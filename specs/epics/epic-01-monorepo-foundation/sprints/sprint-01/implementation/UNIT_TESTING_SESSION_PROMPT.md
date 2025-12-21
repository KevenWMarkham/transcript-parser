# Sprint 01 - Unit Testing Session Prompt

**⚡ RECOMMENDED MODEL: Claude Sonnet 4.5**

- **Complexity**: Medium (writing comprehensive unit tests for 8 packages)
- **Risk**: Low (tests are non-breaking additions)
- **Estimated Duration**: 2-3 hours (complete test coverage for all packages)

---

## 📋 Session Overview

**Objective**: Write comprehensive unit tests for all Sprint 01 packages to achieve 80% coverage target, following Test-Driven Development principles and expert recommendations.

**Current Status**:

- ✅ 8/8 packages extracted and building
- ✅ Vitest workspace configured
- ⏳ Unit tests needed for most packages
- ⏳ Awaiting 80% coverage target

**Completion Criteria**:

- All packages have comprehensive unit tests
- Coverage >80% for lines, functions, branches, statements
- All tests passing
- Mocks properly configured (FFmpeg, Gemini API, Database)
- No flaky tests

---

## 📦 Packages Requiring Tests

### 1. @transcript-parser/types

**Status**: ⚪ No tests needed (type definitions only)

### 2. @transcript-parser/export

**Priority**: 🔴 High (core functionality)
**Estimated Time**: 30 minutes

**Files to Test**: `src/formats.ts`

**Test Coverage Needed**:

- `formatTime()` - short/long format, edge cases
- `formatSrtTime()` - comma/dot separator, milliseconds
- `toPlainText()`, `toSRT()`, `toVTT()`, `toJSON()`, `toCSV()` - all export functions
- `downloadFile()` - BOM for CSV, blob creation
- `copyToClipboard()` - success/failure cases

**Mocks Required**: DOM APIs, URL APIs, navigator.clipboard, Blob

---

### 3. @transcript-parser/ai-services

**Priority**: 🔴 High (external API integration)
**Estimated Time**: 45 minutes

**Files to Test**:

- `geminiClient.ts` - API interactions
- `transcription.ts` - Transcription logic
- `speakerNameDetection.ts` - Speaker detection
- `usageTracker.ts` - Usage tracking

**Mocks Required**: Gemini API (@google/genai), environment variables, localStorage

⚠️ **Security**: NEVER commit real API keys - use test keys only

---

### 4. @transcript-parser/audio-processing

**Priority**: 🔴 High (FFmpeg integration)
**Estimated Time**: 45 minutes

**Files to Test**:

- `browserExtractor.ts` - Browser-based extraction
- `ffmpegExtractor.ts` - FFmpeg.wasm extraction

**Mocks Required**: FFmpeg class, File/FileReader APIs, AudioContext

⚠️ **Performance**: Verify FFmpeg lazy loading in tests

---

### 5. @transcript-parser/database

**Priority**: ⚠️ Medium
**Estimated Time**: 45 minutes

**Files to Test**:

- `connection.ts` - Database connections
- `queries.ts` - Query functions

**Mocks Required**: Drizzle ORM, Neon PostgreSQL

⚠️ **Testing**: Use in-memory database or mocks only

---

### 6. @transcript-parser/ui

**Priority**: ⚠️ Medium
**Estimated Time**: 15 minutes
**Status**: ⚪ Already has tests (9 test files exist)

**Action**: Run tests and verify coverage >80%, add tests if needed

---

### 7. @transcript-parser/config

**Status**: ⚪ No tests needed (configuration only)

---

### 8. @transcript-parser/module-sdk

**Priority**: ⚠️ Medium
**Estimated Time**: 45 minutes

**Files to Test**: `ModuleRegistry.ts`

**Test Coverage**: Module registration, retrieval, validation, error cases

---

## 🎯 Success Criteria

**Before Completing This Session**:

- [ ] All test files created
- [ ] All tests passing (`pnpm test`)
- [ ] Coverage >80% for all packages (`pnpm test:coverage`)
- [ ] No flaky tests (run 3x to verify)
- [ ] All mocks properly configured
- [ ] No real API calls or database connections

**Coverage Thresholds** (each package):

```
Lines      : 80%
Functions  : 80%
Branches   : 80%
Statements : 80%
```

---

## 🔍 Validation Commands

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage

# Run specific package
pnpm test --project=@transcript-parser/export

# Watch mode
pnpm test:watch

# View coverage report
start coverage/index.html  # Windows
```

---

## 🚀 Next Steps After Completion

1. Proceed to **Phase 5: E2E Testing** (DEVELOPMENT_WORKFLOW.md)
2. Update Sprint Status: implementation/README.md → Phase: "E2E TEST"
3. Commit tests:
   ```bash
   git add .
   git commit -m "test: add unit tests for all Sprint 01 packages (>80% coverage)"
   ```

---

**Status**: 🟢 Ready to Execute
**Estimated Duration**: 2-3 hours
**Recommended Model**: Claude Sonnet 4.5

Good luck! 🚀
