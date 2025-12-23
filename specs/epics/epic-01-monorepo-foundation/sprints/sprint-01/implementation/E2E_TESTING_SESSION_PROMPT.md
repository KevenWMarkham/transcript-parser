# Sprint 01 - E2E Testing Session Prompt

**⚡ RECOMMENDED MODEL: Claude Sonnet 4.5**

- **Complexity**: Medium (validating monorepo integration with end-to-end tests)
- **Risk**: Low (tests are non-breaking validations)
- **Estimated Duration**: 1-2 hours (complete E2E coverage for critical workflows)

---

## 📋 Session Overview

**Objective**: Write comprehensive end-to-end tests for Sprint 01 to validate that all extracted packages work together correctly in the main application, ensuring seamless integration and user workflows.

**Current Status**:

- ✅ 8/8 packages extracted and building
- ✅ Unit tests complete (>80% coverage)
- ✅ Playwright configured
- ⏳ E2E tests needed for critical workflows
- ⏳ Integration validation pending

**Completion Criteria**:

- All critical user workflows have E2E tests
- All packages integrate correctly in the app
- All E2E tests passing
- No regression in core functionality
- Tests are stable (no flakiness)

---

## 🎯 Critical User Workflows to Test

### 1. **Transcript Upload and Processing**

**Priority**: 🔴 Critical (core functionality)
**Estimated Time**: 30 minutes

**Packages Involved**:
- `@transcript-parser/types` - Type definitions
- `@transcript-parser/audio-processing` - File validation
- `@transcript-parser/ai-services` - Transcription processing
- `@transcript-parser/ui` - Upload components

**Test Scenarios**:

```typescript
test('should upload audio file and process transcript', async ({ page }) => {
  // 1. Navigate to app
  await page.goto('/')

  // 2. Upload audio file
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.mp3')

  // 3. Verify file is accepted
  await expect(page.locator('[data-testid="file-name"]')).toContainText('sample.mp3')

  // 4. Start transcription
  await page.click('[data-testid="transcribe-button"]')

  // 5. Wait for processing
  await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible({ timeout: 30000 })

  // 6. Verify transcript appears
  await expect(page.locator('[data-testid="transcript-content"]')).not.toBeEmpty()
})
```

**Edge Cases**:
- Invalid file formats
- Large files (>100MB)
- Network failures during upload
- API errors during transcription

---

### 2. **Speaker Management**

**Priority**: 🔴 Critical
**Estimated Time**: 20 minutes

**Packages Involved**:
- `@transcript-parser/types` - Speaker types
- `@transcript-parser/ai-services` - Speaker detection
- `@transcript-parser/ui` - Speaker editing components

**Test Scenarios**:

```typescript
test('should detect and rename speakers', async ({ page }) => {
  // 1. Load transcript with speakers
  await page.goto('/')
  await uploadTranscript(page, 'tests/fixtures/multi-speaker.mp3')

  // 2. Verify speakers detected
  await expect(page.locator('[data-testid="speaker-1"]')).toBeVisible()
  await expect(page.locator('[data-testid="speaker-2"]')).toBeVisible()

  // 3. Rename speaker
  await page.click('[data-testid="rename-speaker-1"]')
  await page.fill('[data-testid="speaker-name-input"]', 'John Doe')
  await page.click('[data-testid="save-speaker-name"]')

  // 4. Verify name updated
  await expect(page.locator('[data-testid="speaker-1"]')).toContainText('John Doe')

  // 5. Verify all instances updated
  const speakerLabels = page.locator('[data-speaker="1"]')
  await expect(speakerLabels.first()).toContainText('John Doe')
})
```

---

### 3. **Export Functionality**

**Priority**: 🔴 Critical
**Estimated Time**: 30 minutes

**Packages Involved**:
- `@transcript-parser/export` - All export formats
- `@transcript-parser/ui` - Export UI components

**Test Scenarios**:

```typescript
test('should export transcript in all formats', async ({ page }) => {
  // Setup
  await page.goto('/')
  await uploadTranscript(page, 'tests/fixtures/sample.mp3')

  // Test Plain Text export
  const [download1] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-txt"]')
  ])
  expect(download1.suggestedFilename()).toMatch(/\.txt$/)

  // Test SRT export
  const [download2] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-srt"]')
  ])
  expect(download2.suggestedFilename()).toMatch(/\.srt$/)

  // Test VTT export
  const [download3] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-vtt"]')
  ])
  expect(download3.suggestedFilename()).toMatch(/\.vtt$/)

  // Test CSV export
  const [download4] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-csv"]')
  ])
  expect(download4.suggestedFilename()).toMatch(/\.csv$/)

  // Test JSON export
  const [download5] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-json"]')
  ])
  expect(download5.suggestedFilename()).toMatch(/\.json$/)
})

test('should export with custom options', async ({ page }) => {
  await page.goto('/')
  await uploadTranscript(page, 'tests/fixtures/sample.mp3')

  // Open export options
  await page.click('[data-testid="export-options"]')

  // Configure options
  await page.check('[data-testid="include-timestamps"]')
  await page.check('[data-testid="include-speakers"]')
  await page.check('[data-testid="include-confidence"]')

  // Export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-txt"]')
  ])

  // Verify file content includes options
  const path = await download.path()
  const content = await fs.readFile(path, 'utf-8')
  expect(content).toContain('[') // Timestamp indicator
  expect(content).toMatch(/Speaker \d+/) // Speaker labels
  expect(content).toMatch(/\(\d+%\)/) // Confidence scores
})
```

---

### 4. **Editing and History**

**Priority**: ⚠️ Medium
**Estimated Time**: 20 minutes

**Packages Involved**:
- `@transcript-parser/ui` - Editor components and history hooks
- `@transcript-parser/database` - Persistence (if enabled)

**Test Scenarios**:

```typescript
test('should edit transcript and undo/redo changes', async ({ page }) => {
  await page.goto('/')
  await uploadTranscript(page, 'tests/fixtures/sample.mp3')

  // Get original text
  const originalText = await page.locator('[data-testid="transcript-content"]').textContent()

  // Edit transcript
  await page.click('[data-testid="edit-transcript"]')
  await page.fill('[data-testid="transcript-editor"]', 'Modified text')
  await page.click('[data-testid="save-edit"]')

  // Verify change
  await expect(page.locator('[data-testid="transcript-content"]')).toContainText('Modified text')

  // Undo
  await page.click('[data-testid="undo"]')
  await expect(page.locator('[data-testid="transcript-content"]')).toContainText(originalText)

  // Redo
  await page.click('[data-testid="redo"]')
  await expect(page.locator('[data-testid="transcript-content"]')).toContainText('Modified text')
})
```

---

### 5. **Module Integration**

**Priority**: ⚠️ Medium
**Estimated Time**: 30 minutes

**Packages Involved**:
- `@transcript-parser/module-sdk` - Module registry
- `@transcript-parser/ui` - Module UI integration

**Test Scenarios**:

```typescript
test('should load and apply real estate module', async ({ page }) => {
  await page.goto('/')
  await uploadTranscript(page, 'tests/fixtures/real-estate-call.mp3')

  // Activate module
  await page.click('[data-testid="modules-menu"]')
  await page.click('[data-testid="activate-real-estate"]')

  // Verify module activated
  await expect(page.locator('[data-testid="module-active-real-estate"]')).toBeVisible()

  // Verify module features appear
  await expect(page.locator('[data-testid="property-details"]')).toBeVisible()
  await expect(page.locator('[data-testid="showing-scheduler"]')).toBeVisible()

  // Test module functionality
  await page.fill('[data-testid="property-address"]', '123 Main St')
  await page.click('[data-testid="extract-details"]')

  // Verify extraction worked
  await expect(page.locator('[data-testid="extracted-info"]')).not.toBeEmpty()
})
```

---

### 6. **API Key Management**

**Priority**: 🔴 Critical (Security)
**Estimated Time**: 15 minutes

**Packages Involved**:
- `@transcript-parser/ai-services` - API client
- `@transcript-parser/ui` - Settings components

**Test Scenarios**:

```typescript
test('should require API key for transcription', async ({ page }) => {
  // Clear stored API key
  await page.context().clearCookies()
  await page.evaluate(() => localStorage.clear())

  await page.goto('/')
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.mp3')
  await page.click('[data-testid="transcribe-button"]')

  // Verify API key prompt appears
  await expect(page.locator('[data-testid="api-key-prompt"]')).toBeVisible()

  // Enter API key
  await page.fill('[data-testid="api-key-input"]', process.env.TEST_GEMINI_API_KEY)
  await page.click('[data-testid="save-api-key"]')

  // Verify transcription proceeds
  await expect(page.locator('[data-testid="transcribing"]')).toBeVisible()
})

test('should validate API key format', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="settings"]')

  // Try invalid key
  await page.fill('[data-testid="api-key-input"]', 'invalid-key')
  await page.click('[data-testid="save-api-key"]')

  // Verify error
  await expect(page.locator('[data-testid="api-key-error"]')).toBeVisible()

  // Try valid format
  await page.fill('[data-testid="api-key-input"]', process.env.TEST_GEMINI_API_KEY)
  await page.click('[data-testid="save-api-key"]')

  // Verify success
  await expect(page.locator('[data-testid="api-key-success"]')).toBeVisible()
})
```

---

### 7. **Performance and Loading**

**Priority**: ⚠️ Medium
**Estimated Time**: 20 minutes

**Packages Involved**:
- `@transcript-parser/audio-processing` - FFmpeg lazy loading
- All packages - Bundle size impact

**Test Scenarios**:

```typescript
test('should lazy load FFmpeg only when needed', async ({ page }) => {
  // Intercept network requests
  const ffmpegRequests: string[] = []
  page.on('request', request => {
    if (request.url().includes('ffmpeg')) {
      ffmpegRequests.push(request.url())
    }
  })

  // Navigate to app
  await page.goto('/')

  // Verify FFmpeg NOT loaded yet
  expect(ffmpegRequests).toHaveLength(0)

  // Upload file that requires FFmpeg
  await page.setInputFiles('input[type="file"]', 'tests/fixtures/sample.mp3')
  await page.click('[data-testid="extract-audio"]')

  // Wait for FFmpeg to load
  await page.waitForTimeout(2000)

  // Verify FFmpeg WAS loaded
  expect(ffmpegRequests.length).toBeGreaterThan(0)
})

test('should load initial bundle quickly', async ({ page }) => {
  const startTime = Date.now()
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const loadTime = Date.now() - startTime

  // Verify fast initial load (without FFmpeg)
  expect(loadTime).toBeLessThan(3000) // 3 seconds
})
```

---

## 🔧 Test Infrastructure Setup

### Required Files

#### 1. **Test Fixtures**

Create test audio files in `tests/fixtures/`:

```bash
tests/fixtures/
├── sample.mp3           # Basic audio file
├── multi-speaker.mp3    # Multiple speakers
├── real-estate-call.mp3 # Real estate conversation
└── large-file.mp3       # Large file for performance testing
```

#### 2. **Helper Functions**

Create `tests/e2e/helpers.ts`:

```typescript
import { Page } from '@playwright/test'

export async function uploadTranscript(page: Page, filePath: string) {
  await page.setInputFiles('input[type="file"]', filePath)
  await page.click('[data-testid="transcribe-button"]')
  await page.waitForSelector('[data-testid="transcript-content"]', { timeout: 30000 })
}

export async function clearAppState(page: Page) {
  await page.context().clearCookies()
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}
```

#### 3. **Environment Setup**

Add to `.env.test`:

```bash
TEST_GEMINI_API_KEY=your-test-api-key-here
VITE_API_BASE_URL=http://localhost:5173
```

---

## ✅ Success Criteria

**Before Completing This Session**:

- [ ] All critical workflows have E2E tests (6 scenarios minimum)
- [ ] All E2E tests passing (`pnpm test:e2e`)
- [ ] Tests run without flakiness (3 consecutive passes)
- [ ] Test fixtures created and committed
- [ ] Helper functions extracted and reusable
- [ ] Environment variables configured
- [ ] All 8 packages validated in integration

**Test Stability Requirements**:

- No hard-coded timeouts (use Playwright auto-waiting)
- Tests pass in both headed and headless modes
- Tests pass on different browsers (Chromium, Firefox, WebKit)
- Clean state between tests

---

## 🔍 Validation Commands

```bash
# Run all E2E tests
pnpm test:e2e

# Run in headed mode (see browser)
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e tests/e2e/transcript-upload.spec.ts

# Run with UI mode (debugging)
pnpm test:e2e --ui

# Generate test report
pnpm test:e2e --reporter=html
start playwright-report/index.html  # Windows

# Test on all browsers
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit
```

---

## 📊 Package Integration Validation

Verify each package works in the integrated application:

| Package | Unit Tests | E2E Tests | Integration Validated |
|---------|-----------|-----------|---------------------|
| @transcript-parser/types | ⚪ N/A | ✅ All workflows | ⏳ Pending |
| @transcript-parser/export | ✅ 100% | ✅ Export tests | ⏳ Pending |
| @transcript-parser/ai-services | ✅ Core | ✅ Transcription tests | ⏳ Pending |
| @transcript-parser/audio-processing | ✅ Errors | ✅ Upload + FFmpeg tests | ⏳ Pending |
| @transcript-parser/database | ✅ Schema | ⏳ Persistence tests | ⏳ Pending |
| @transcript-parser/ui | ✅ 80%+ | ✅ All UI workflows | ⏳ Pending |
| @transcript-parser/config | ⚪ N/A | ⚪ N/A | ✅ Build validates |
| @transcript-parser/module-sdk | ✅ Full | ✅ Module tests | ⏳ Pending |

---

## 🚨 Known Issues to Watch For

### 1. **FFmpeg Loading**

```typescript
// Common issue: FFmpeg not loading in test environment
// Solution: Mock FFmpeg or use actual WASM in E2E tests
```

### 2. **API Rate Limits**

```typescript
// Common issue: Gemini API rate limiting during tests
// Solution: Use mocked responses or test API key with higher limits
```

### 3. **File Upload Timing**

```typescript
// Common issue: File upload completes before test assertions
// Solution: Use Playwright auto-waiting and proper selectors
```

---

## 🚀 Next Steps After Completion

1. **Proceed to Code Review** - Run CODE_REVIEW_SESSION_PROMPT.md
2. **Update Sprint Status**: implementation/README.md → Phase: "CODE REVIEW"
3. **Commit E2E tests**:
   ```bash
   git add tests/e2e/*.spec.ts tests/fixtures/* tests/e2e/helpers.ts
   git commit -m "test: add E2E tests for Sprint 01 monorepo integration"
   ```
4. **Update ROADMAP.md**: Sprint 01 → 95% Complete

---

## 📝 Test Report Template

After running tests, document results:

```markdown
## E2E Test Results - Sprint 01

**Date**: [Date]
**Tests Run**: [Number]
**Tests Passed**: [Number]
**Tests Failed**: [Number]
**Duration**: [Time]

### Coverage by Workflow

- ✅ Transcript Upload and Processing (5 tests passing)
- ✅ Speaker Management (3 tests passing)
- ✅ Export Functionality (7 tests passing)
- ✅ Editing and History (2 tests passing)
- ✅ Module Integration (3 tests passing)
- ✅ API Key Management (4 tests passing)
- ✅ Performance and Loading (2 tests passing)

### Integration Validation

- ✅ All 8 packages integrate correctly
- ✅ No regressions in core functionality
- ✅ All critical user workflows validated

### Issues Found

[List any issues discovered during E2E testing]

### Recommendations

[Any improvements or follow-up items]
```

---

**Status**: 🟢 Ready to Execute
**Estimated Duration**: 1-2 hours
**Recommended Model**: Claude Sonnet 4.5
**Prerequisites**: ✅ Unit tests complete, ✅ Playwright configured

Good luck! 🚀
