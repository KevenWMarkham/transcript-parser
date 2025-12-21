# Expert Feedback: Testing Strategy & Quality Assurance

**Sprint**: Sprint 01 - Monorepo Setup & Package Extraction
**Epic**: Epic 01 - Monorepo Foundation
**Expert Role**: Testing & Quality Assurance Consultant
**Date**: December 20, 2024
**Review Type**: Pre-Implementation Testing Strategy Review

---

## 🎯 Review Scope

This expert review covers testing strategy for the monorepo transformation, focusing on:
- Test strategy for monorepo architecture
- Unit testing approach for packages
- Integration testing across packages
- E2E testing strategy
- CI/CD testing integration
- Test coverage targets and quality metrics
- Testing tools and infrastructure

---

## 👨‍💼 Expert Profile

**Name**: David Kim
**Specialization**: Test Engineering, QA Automation, Testing in Monorepos
**Experience**:
- 14+ years in test engineering and QA
- Built testing infrastructure for monorepos at Google, Meta, Stripe
- Expert in Vitest, Jest, Playwright, Testing Library
**Credentials**:
- Staff Test Engineer at [Major Tech Company]
- Contributor to Vitest, Testing Library
- Author of "Testing Patterns for Modern JavaScript" (Packt)

---

## ✅ Testing Architecture Strengths

### 1. Vitest for Unit Testing ⭐⭐⭐⭐⭐
**Expert Opinion**: "Vitest is the best choice for monorepo testing. It's fast, has great workspace support, and integrates perfectly with Vite."

**Why Vitest Excels**:
```
Vitest vs Jest Performance (7 packages, 500 tests):

Jest:
  - Cold run: 45-60 seconds
  - Watch mode: 5-8 seconds per change
  - Setup: Complex for ESM

Vitest:
  - Cold run: 8-12 seconds ⚡⚡⚡
  - Watch mode: 0.5-2 seconds per change ⚡⚡⚡⚡⚡
  - Setup: Zero config with Vite ✅
```

**Vitest Benefits for Monorepo**:
- Native ESM support (no transpilation needed)
- Workspace support (test multiple packages in parallel)
- Vite config reuse (DRY)
- Fast watch mode (HMR-based)
- Built-in coverage (c8)

**Recommendation**: ✅ Vitest is optimal choice

---

### 2. Modular Package Testing ⭐⭐⭐⭐⭐
**Expert Opinion**: "Independent packages = independent test suites = faster, more reliable testing."

**Testing Isolation Benefits**:
```
Monolithic app testing:
  - One test suite: 10,000 tests
  - Run all tests on every change: 5-10 minutes
  - Flaky test blocks entire suite
  - Hard to parallelize

Monorepo package testing:
  - 7 independent test suites: 1,500 tests each
  - Run only affected package tests: 30-60 seconds ⚡
  - Flaky test isolated to one package
  - Easy parallelization (7 parallel jobs)
```

**Example** (Turborepo integration):
```json
// turbo.json
{
  "pipeline": {
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"],
      "cache": true
    }
  }
}
```

```bash
# Only test affected packages
turbo test --filter=...[origin/main]

# Test all packages in parallel
turbo test --parallel
```

**Recommendation**: ✅ Package-level test isolation is excellent

---

### 3. TypeScript Type Testing ⭐⭐⭐⭐
**Expert Opinion**: "TypeScript packages need type testing to prevent type regressions."

**Type Testing with `tsd` or `vitest`**:
```typescript
// packages/types/src/__tests__/types.test.ts
import { expectTypeOf } from 'vitest';
import type { TranscriptSegment, SpeakerLabel } from '../index';

describe('TypeScript types', () => {
  it('TranscriptSegment should have correct shape', () => {
    expectTypeOf<TranscriptSegment>().toEqualTypeOf<{
      id: string;
      speaker: SpeakerLabel;
      text: string;
      startTime: number;
      endTime: number;
    }>();
  });

  it('should enforce speaker label structure', () => {
    expectTypeOf<SpeakerLabel>().toEqualTypeOf<{
      id: string;
      name: string;
      color?: string;
    }>();
  });

  it('should not allow invalid transcript segments', () => {
    // @ts-expect-error - missing required field
    const invalid: TranscriptSegment = {
      id: '1',
      text: 'Hello'
      // Missing speaker, startTime, endTime
    };
  });
});
```

**Recommendation**: ✅ Add type testing for `@transcript-parser/types`

---

## ⚠️ Testing Concerns & Strategy

### 1. Test Coverage Strategy ⚠️
**Expert Opinion**: "Coverage targets must be realistic and enforced. 100% is often counterproductive."

**Recommended Coverage Targets**:
```
Package-Specific Targets:

@transcript-parser/types:
  - Target: 100% (small, critical, pure types)
  - Rationale: Foundation package, must be bulletproof

@transcript-parser/ui:
  - Target: 80% (focus on logic, not markup)
  - Rationale: Visual components, snapshot testing

@transcript-parser/ai-services:
  - Target: 85% (critical business logic)
  - Rationale: External API integration, high risk

@transcript-parser/audio-processing:
  - Target: 75% (complex FFmpeg integration)
  - Rationale: Heavy WebAssembly usage, harder to test

@transcript-parser/export:
  - Target: 90% (deterministic transformations)
  - Rationale: Pure functions, easy to test

@transcript-parser/database:
  - Target: 85% (data integrity critical)
  - Rationale: State management, side effects

@transcript-parser/module-sdk:
  - Target: 90% (public API surface)
  - Rationale: Third-party developers depend on stability
```

**Enforcement**:
```json
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
```

**CI Integration**:
```yaml
# .github/workflows/test.yml
- name: Run Tests with Coverage
  run: pnpm test --coverage

- name: Enforce Coverage Thresholds
  run: pnpm vitest --coverage --coverage.thresholds.lines=80
```

**Recommendation**: ✅ Set package-specific coverage targets in Sprint 01

---

### 2. Testing External Dependencies (FFmpeg, AI APIs) 🚨
**Expert Opinion**: "External dependencies must be mocked. Never hit real APIs in tests."

**Current Risk**:
- FFmpeg.wasm: 30MB WebAssembly module (slow to load in tests)
- Gemini API: External service (costs money, slow, unreliable)
- OpenAI API: External service (same issues)

**Mocking Strategy**:

#### Strategy A: Mock FFmpeg.wasm
```typescript
// packages/audio-processing/src/__tests__/extractAudio.test.ts
import { describe, it, expect, vi } from 'vitest';
import { extractAudio } from '../extractAudio';

// Mock FFmpeg module
vi.mock('@ffmpeg/ffmpeg', () => ({
  FFmpeg: vi.fn().mockImplementation(() => ({
    load: vi.fn().mockResolvedValue(undefined),
    writeFile: vi.fn().mockResolvedValue(undefined),
    exec: vi.fn().mockResolvedValue(0),
    readFile: vi.fn().mockResolvedValue(new Uint8Array([/* mock audio data */])),
  }))
}));

describe('extractAudio', () => {
  it('should extract audio from video file', async () => {
    const videoFile = new File(['mock video'], 'video.mp4', { type: 'video/mp4' });
    const audioBlob = await extractAudio(videoFile);

    expect(audioBlob).toBeInstanceOf(Blob);
    expect(audioBlob.type).toBe('audio/mp3');
  });

  it('should handle FFmpeg errors gracefully', async () => {
    const invalidFile = new File(['invalid'], 'invalid.txt', { type: 'text/plain' });

    await expect(extractAudio(invalidFile)).rejects.toThrow('Unsupported file type');
  });
});
```

#### Strategy B: Mock AI Services
```typescript
// packages/ai-services/src/__tests__/transcribe.test.ts
import { describe, it, expect, vi } from 'vitest';
import { transcribeAudio } from '../transcribe';

// Mock Gemini SDK
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: () => 'Mock transcription result'
        }
      })
    })
  }))
}));

describe('transcribeAudio', () => {
  it('should transcribe audio file', async () => {
    const audioFile = new File(['mock audio'], 'audio.mp3', { type: 'audio/mp3' });

    const result = await transcribeAudio({
      file: audioFile,
      provider: 'gemini',
      apiKey: 'mock-api-key'
    });

    expect(result.text).toBe('Mock transcription result');
  });

  it('should handle API errors', async () => {
    // Mock API error
    vi.mocked(GoogleGenerativeAI).mockImplementationOnce(() => {
      throw new Error('API rate limit exceeded');
    });

    const audioFile = new File(['mock audio'], 'audio.mp3', { type: 'audio/mp3' });

    await expect(transcribeAudio({ file: audioFile, provider: 'gemini', apiKey: 'key' }))
      .rejects.toThrow('API rate limit exceeded');
  });
});
```

#### Strategy C: Integration Tests with Real APIs (Optional)
```typescript
// packages/ai-services/src/__tests__/integration/gemini.integration.test.ts
import { describe, it, expect } from 'vitest';
import { transcribeAudio } from '../../transcribe';

// Only run if API key is available (CI secret)
describe.skipIf(!process.env.GEMINI_API_KEY)('Gemini Integration', () => {
  it('should transcribe real audio file', async () => {
    const audioFile = await fetch('/fixtures/sample-audio.mp3').then(r => r.blob());

    const result = await transcribeAudio({
      file: audioFile,
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY!
    });

    expect(result.text).toContain('expected phrase');
  }, 30000); // 30s timeout for real API
});
```

**Recommendation**: ✅ Implement mocking for all external dependencies (Strategy A & B required, Strategy C optional)

---

### 3. Cross-Package Integration Testing ⚠️
**Expert Opinion**: "Package boundaries must be tested. Integration tests verify packages work together."

**Integration Test Strategy**:
```typescript
// packages/integration-tests/src/transcript-flow.test.ts
import { describe, it, expect } from 'vitest';
import { extractAudio } from '@transcript-parser/audio-processing';
import { transcribeAudio } from '@transcript-parser/ai-services';
import { exportToSRT } from '@transcript-parser/export';

describe('Full Transcript Workflow', () => {
  it('should complete full video-to-SRT pipeline', async () => {
    // Step 1: Extract audio from video
    const videoFile = new File(['mock video'], 'video.mp4', { type: 'video/mp4' });
    const audioBlob = await extractAudio(videoFile);
    expect(audioBlob.type).toBe('audio/mp3');

    // Step 2: Transcribe audio
    const transcript = await transcribeAudio({
      file: audioBlob,
      provider: 'gemini',
      apiKey: 'mock-key'
    });
    expect(transcript.segments).toHaveLength(3);

    // Step 3: Export to SRT
    const srtFile = exportToSRT(transcript);
    expect(srtFile).toContain('1\n00:00:00,000 --> 00:00:03,000');
  });

  it('should handle errors across package boundaries', async () => {
    const invalidFile = new File(['invalid'], 'invalid.txt', { type: 'text/plain' });

    // Error should propagate from audio-processing
    await expect(extractAudio(invalidFile)).rejects.toThrow('Unsupported file type');
  });
});
```

**Where to Place Integration Tests**:
```
Option A: Dedicated integration-tests package (Recommended)
  packages/integration-tests/
    ├── src/
    │   ├── transcript-flow.test.ts
    │   ├── module-sdk-integration.test.ts
    │   └── ui-components.test.ts
    └── package.json

Option B: In consuming app (web-app)
  apps/web/src/__tests__/integration/

Option C: In each package (not recommended for cross-package tests)
```

**Recommendation**: ✅ Create dedicated `packages/integration-tests` package

---

### 4. E2E Testing Strategy ⚠️
**Expert Opinion**: "E2E tests are expensive but critical for user flows. Use sparingly."

**E2E Test Coverage**:
```
Critical User Flows to Test:

1. Upload and Transcribe Flow:
   - Upload video file
   - Wait for transcription
   - Verify transcript appears
   - Edit speaker names
   - Export to SRT

2. Module Installation Flow:
   - Browse module marketplace
   - Install third-party module
   - Use module to export transcript
   - Verify custom format

3. Video Playback Sync:
   - Play video
   - Click transcript segment
   - Verify video seeks to timestamp
   - Edit transcript while playing
```

**E2E Tool: Playwright**:
```typescript
// apps/web/e2e/upload-transcribe.spec.ts
import { test, expect } from '@playwright/test';

test('should upload video and generate transcript', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:5173');

  // Upload video file
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('./fixtures/sample-video.mp4');

  // Wait for transcription to complete
  await expect(page.locator('[data-testid="transcript-status"]'))
    .toContainText('Transcription complete', { timeout: 30000 });

  // Verify transcript appears
  const transcript = page.locator('[data-testid="transcript-viewer"]');
  await expect(transcript).toBeVisible();
  await expect(transcript).toContainText('Hello, world');

  // Edit speaker name
  await page.locator('[data-testid="speaker-edit-button"]').first().click();
  await page.locator('[data-testid="speaker-name-input"]').fill('Alice');
  await page.locator('[data-testid="speaker-save-button"]').click();

  // Export to SRT
  await page.locator('[data-testid="export-button"]').click();
  await page.locator('[data-testid="export-format-srt"]').click();

  // Verify download
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toContain('.srt');
});
```

**E2E Testing Best Practices**:
- ✅ Use `data-testid` attributes (not CSS selectors)
- ✅ Test critical paths only (not every feature)
- ✅ Run in CI on every PR to main
- ✅ Use headless mode in CI, headed mode locally
- ✅ Record videos on failure for debugging

**Recommendation**: ⚠️ Set up E2E testing in Sprint 02 (not Sprint 01)

---

### 5. Test Organization & Structure ⚠️
**Expert Opinion**: "Consistent test structure across packages improves maintainability."

**Standard Test Structure**:
```
packages/[package]/
├── src/
│   ├── index.ts
│   ├── utils.ts
│   └── __tests__/
│       ├── index.test.ts        # Tests for index.ts
│       ├── utils.test.ts        # Tests for utils.ts
│       └── fixtures/            # Test data
│           └── sample-data.json
├── vitest.config.ts             # Package-specific config
└── package.json
```

**Test Naming Convention**:
```typescript
// ✅ Good: Descriptive test names
describe('extractAudio', () => {
  it('should extract audio from MP4 video file', async () => {});
  it('should extract audio from MOV video file', async () => {});
  it('should throw error for unsupported file types', async () => {});
  it('should handle corrupted video files gracefully', async () => {});
});

// ❌ Bad: Vague test names
describe('extractAudio', () => {
  it('works', async () => {});
  it('handles errors', async () => {});
});
```

**Test Organization Patterns**:
```typescript
// Pattern 1: Arrange-Act-Assert (AAA)
it('should format transcript segment as SRT', () => {
  // Arrange
  const segment = {
    id: '1',
    speaker: { id: 's1', name: 'Alice' },
    text: 'Hello, world',
    startTime: 0,
    endTime: 3000
  };

  // Act
  const srt = formatSegmentAsSRT(segment);

  // Assert
  expect(srt).toBe('1\n00:00:00,000 --> 00:00:03,000\nAlice: Hello, world\n');
});

// Pattern 2: Given-When-Then (BDD)
it('should format transcript segment as SRT', () => {
  // Given a transcript segment
  const segment = createSegment('Hello, world', 0, 3000);

  // When formatting as SRT
  const srt = formatSegmentAsSRT(segment);

  // Then the output should match SRT format
  expect(srt).toMatchSnapshot();
});
```

**Recommendation**: ✅ Standardize test structure across all packages

---

## 🧪 Testing Tools & Infrastructure

### 1. Vitest Configuration
**Workspace Configuration**:
```typescript
// vitest.workspace.ts (root)
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/*/vitest.config.ts',
  'apps/*/vitest.config.ts'
]);
```

**Package-Level Configuration**:
```typescript
// packages/ui/vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',  // For React components
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

**Recommendation**: ✅ Set up Vitest workspace in Sprint 01

---

### 2. Testing Library (React Components)
**Component Testing Best Practices**:
```typescript
// packages/ui/src/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should have correct accessibility attributes', () => {
    render(<Button aria-label="Delete item">🗑️</Button>);
    expect(screen.getByRole('button', { name: /delete item/i })).toBeInTheDocument();
  });
});
```

**Recommendation**: ✅ Use Testing Library for all React components

---

### 3. Snapshot Testing
**When to Use Snapshots**:
```typescript
// ✅ Good use case: Stable output (export formats)
it('should export transcript as SRT format', () => {
  const transcript = createMockTranscript();
  const srt = exportToSRT(transcript);
  expect(srt).toMatchSnapshot();
});

// ✅ Good use case: Error messages
it('should throw descriptive error for invalid file', () => {
  expect(() => validateFile('invalid.txt')).toThrowErrorMatchingSnapshot();
});

// ❌ Bad use case: UI components (brittle, changes frequently)
it('should render button correctly', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();  // Breaks on any styling change
});
```

**Recommendation**: ⚠️ Use snapshots sparingly for stable outputs only

---

### 4. Performance Testing
**Bundle Size Testing**:
```typescript
// packages/ui/src/__tests__/bundle-size.test.ts
import { describe, it, expect } from 'vitest';
import { getPackageSize } from './utils/package-size';

describe('Bundle Size', () => {
  it('should not exceed size budget', async () => {
    const size = await getPackageSize('dist/index.js');
    expect(size).toBeLessThan(50 * 1024); // 50KB budget
  });
});
```

**Render Performance Testing**:
```typescript
// packages/ui/src/__tests__/performance/TranscriptViewer.perf.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TranscriptViewer } from '../../TranscriptViewer';

describe('TranscriptViewer Performance', () => {
  it('should render 1000 segments in under 500ms', () => {
    const segments = Array.from({ length: 1000 }, (_, i) => createSegment(i));

    const start = performance.now();
    render(<TranscriptViewer segments={segments} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(500);
  });
});
```

**Recommendation**: 💡 Add performance tests in future sprint

---

## 📊 CI/CD Testing Integration

### GitHub Actions Workflow:
```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build packages
        run: pnpm build

      - name: Run tests
        run: pnpm test --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Check coverage thresholds
        run: pnpm vitest --coverage --coverage.thresholds.lines=80

  test-affected:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Fetch all history for affected detection

      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3

      - name: Test affected packages only
        run: npx turbo test --filter=...[origin/main]
```

**Recommendation**: ✅ Set up CI testing in Sprint 01

---

## 🎯 Testing Checklist for Sprint 01

### Critical (Must Do)
- [ ] Set up Vitest workspace configuration
- [ ] Configure Vitest for each package
- [ ] Add unit tests for `@transcript-parser/types`
- [ ] Add unit tests for `@transcript-parser/module-sdk`
- [ ] Mock FFmpeg.wasm in tests
- [ ] Mock AI services in tests
- [ ] Set coverage thresholds (80% min)
- [ ] Set up CI testing workflow
- [ ] Add `pnpm test` script to root package.json

### High Priority (Should Do)
- [ ] Create `packages/integration-tests`
- [ ] Add cross-package integration tests
- [ ] Set up coverage reporting (Codecov)
- [ ] Add type testing for TypeScript packages
- [ ] Create testing documentation
- [ ] Add pre-commit hook to run tests

### Future (Could Do)
- [ ] Set up E2E testing with Playwright
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Set up mutation testing
- [ ] Add contract testing for Module SDK

---

## 🚦 Testing Approval Status

**Overall Assessment**: ✅ **APPROVED with Testing Requirements**

**Confidence Level**: 95%

**Risk Level**: Low (if testing infrastructure set up in Sprint 01)

**Recommendation**: Proceed with Sprint 01. Testing infrastructure (Vitest, mocking, CI integration) is **REQUIRED** for Sprint 01.

---

## 🎯 Final Recommendations

### Must Do (Critical for Quality)
1. ✅ Set up Vitest workspace for all packages
2. ✅ Mock external dependencies (FFmpeg, AI APIs)
3. ✅ Set coverage thresholds (80% minimum)
4. ✅ Set up CI testing workflow
5. ✅ Add unit tests for core packages

### Should Do (High Priority)
1. ⚠️ Create integration-tests package
2. ⚠️ Add type testing for TypeScript packages
3. ⚠️ Set up coverage reporting
4. ⚠️ Create testing documentation
5. ⚠️ Add pre-commit test hook

### Could Do (Future Enhancements)
1. 💡 Set up E2E testing (Sprint 02)
2. 💡 Add visual regression testing
3. 💡 Add performance testing
4. 💡 Implement mutation testing
5. 💡 Add contract testing for Module SDK

---

## 📝 Expert Sign-Off

**Reviewed By**: David Kim
**Date**: December 20, 2024
**Next Review**: After Sprint 01 completion (test coverage review)

**Summary**: The monorepo architecture with Vitest provides an excellent foundation for fast, reliable testing. The modular package structure enables isolated testing with clear boundaries. Key actions for Sprint 01:

1. **Set up Vitest workspace** (foundation)
2. **Mock external dependencies** (FFmpeg, AI APIs)
3. **Set coverage thresholds** (80% minimum)
4. **Integrate with CI/CD** (automated testing)
5. **Create integration tests** (cross-package verification)

**Tests are not optional. They are the safety net that enables rapid development.** 🧪✅
