# End-to-End Test Specifications

**Purpose**: Validate complete user workflows match Figma design behavior
**Framework**: Playwright
**Based on**: `tests/SITEMAP.md` design specifications

---

## Test Organization

```
tests/e2e/
├── 01-upload.spec.ts           # Video upload workflow
├── 02-processing.spec.ts       # Processing and transcription
├── 03-transcript.spec.ts       # Transcript viewing and interaction
├── 04-export.spec.ts           # Export functionality
├── 05-reset.spec.ts            # Reset and start over
├── 06-errors.spec.ts           # Error handling
├── 07-responsive.spec.ts       # Responsive behavior
├── 08-accessibility.spec.ts    # Keyboard navigation, screen readers
└── fixtures/                   # Test files
    ├── sample.mp4
    ├── sample-2-speakers.mp4
    ├── sample-3-speakers.mp4
    └── invalid-file.pdf
```

---

## Test Suite 1: Video Upload Workflow

**File**: `01-upload.spec.ts`

### Test 1.1: Initial Page Load

```typescript
test('displays initial empty state correctly', async ({ page }) => {
  await page.goto('/')

  // Verify header
  await expect(page.locator('h1')).toContainText('Video Transcript Parser')
  await expect(
    page.locator('text=AI-powered speaker identification')
  ).toBeVisible()

  // Verify upload zone
  await expect(page.getByText('Drop your video here')).toBeVisible()
  await expect(page.getByText('Choose File')).toBeVisible()

  // Verify empty transcript
  await expect(page.getByText('No transcript yet')).toBeVisible()

  // Verify no processing status
  await expect(page.getByText('Processing Status')).not.toBeVisible()

  // Verify no API guide
  await expect(page.getByText('API Integration Guide')).not.toBeVisible()
})
```

### Test 1.2: File Selection via Click

```typescript
test('allows file selection via click', async ({ page }) => {
  await page.goto('/')

  // Click the choose file button
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Verify video preview appears
  await expect(page.locator('video')).toBeVisible()

  // Verify success message
  await expect(page.getByText('Video uploaded successfully')).toBeVisible()

  // Verify green pulse indicator
  const successIndicator = page.locator('.bg-green-500')
  await expect(successIndicator).toBeVisible()
})
```

### Test 1.3: Drag and Drop Upload

```typescript
test('accepts files via drag and drop', async ({ page }) => {
  await page.goto('/')

  const dropZone = page.getByTestId('upload-drop-zone')

  // Simulate drag enter
  await dropZone.dispatchEvent('dragenter')

  // Verify hover state
  await expect(dropZone).toHaveClass(/dragging|hover/)

  // Simulate drop
  const buffer = await fs.readFile('tests/fixtures/sample.mp4')
  const dataTransfer = await page.evaluateHandle(data => {
    const dt = new DataTransfer()
    const file = new File([new Uint8Array(data)], 'sample.mp4', {
      type: 'video/mp4',
    })
    dt.items.add(file)
    return dt
  }, Array.from(buffer))

  await dropZone.dispatchEvent('drop', { dataTransfer })

  // Verify upload initiated
  await expect(page.locator('video')).toBeVisible({ timeout: 5000 })
})
```

### Test 1.4: File Validation - Invalid Type

```typescript
test('rejects non-video files with error message', async ({ page }) => {
  await page.goto('/')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/invalid-file.pdf')

  // Verify error message
  await expect(page.getByText(/invalid file type/i)).toBeVisible()
  await expect(page.getByText(/please select a video file/i)).toBeVisible()

  // Verify no video preview
  await expect(page.locator('video')).not.toBeVisible()
})
```

### Test 1.5: File Validation - Size Limit

```typescript
test('rejects files larger than 2GB', async ({ page }) => {
  await page.goto('/')

  // Mock a file that's too large
  await page.evaluate(() => {
    const input = document.querySelector('input[type="file"]')
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [
          {
            name: 'huge-file.mp4',
            size: 3 * 1024 * 1024 * 1024, // 3GB
            type: 'video/mp4',
          },
        ],
      })
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })

  // Verify error message
  await expect(page.getByText(/file too large/i)).toBeVisible()
  await expect(page.getByText(/maximum size is 2gb/i)).toBeVisible()
})
```

---

## Test Suite 2: Processing Workflow

**File**: `02-processing.spec.ts`

### Test 2.1: Upload Progress Display

```typescript
test('shows upload progress during file upload', async ({ page }) => {
  await page.goto('/')

  // Intercept upload to slow it down
  await page.route('**/api/upload', route => {
    setTimeout(() => route.continue(), 3000)
  })

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Verify processing status appears
  await expect(page.getByText('Processing Status')).toBeVisible()

  // Verify uploading state
  await expect(page.getByText('Uploading video')).toBeVisible()

  // Verify progress bar
  const progressBar = page.locator('[role="progressbar"]')
  await expect(progressBar).toBeVisible()

  // Verify percentage updates
  await expect(page.getByText(/%/)).toBeVisible()
})
```

### Test 2.2: Processing State Transitions

```typescript
test('progresses through all processing states', async ({ page }) => {
  await page.goto('/')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // State 1: Uploading
  await expect(page.getByText('Uploading video')).toBeVisible()
  await expect(page.locator('.text-blue-600')).toContainText('Uploading')

  // State 2: Upload complete
  await expect(page.getByText('Upload successful')).toBeVisible({
    timeout: 5000,
  })
  await expect(page.locator('.text-green-600')).toBeVisible()

  // State 3: Processing/Transcribing
  await expect(page.getByText('Transcribing with AI')).toBeVisible()
  await expect(page.getByText('Detecting speakers')).toBeVisible()

  // State 4: AI Pipeline visible
  await expect(page.getByText('AI Processing Pipeline')).toBeVisible()
  await expect(page.getByText('Audio extraction')).toBeVisible()
  await expect(page.getByText('Speaker diarization')).toBeVisible()

  // State 5: Complete
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })
  await expect(
    page.getByText('All speakers identified successfully')
  ).toBeVisible()
})
```

### Test 2.3: Processing Icons and Animations

```typescript
test('displays correct icons for each processing state', async ({ page }) => {
  await page.goto('/')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Uploading: Rotating loader
  const uploadLoader = page.locator('[data-icon="loader"]').first()
  await expect(uploadLoader).toBeVisible()

  // Complete: Checkmark with scale animation
  await expect(page.locator('[data-icon="check-circle"]').first()).toBeVisible({
    timeout: 5000,
  })

  // Processing: Rotating wand with sparkles
  await expect(page.locator('[data-icon="wand"]')).toBeVisible()
  await expect(page.locator('[data-icon="sparkles"]')).toBeVisible()
})
```

---

## Test Suite 3: Transcript Viewing

**File**: `03-transcript.spec.ts`

### Test 3.1: Transcript Appears After Processing

```typescript
test('displays transcript after processing completes', async ({ page }) => {
  await page.goto('/')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample-3-speakers.mp4')

  // Wait for completion
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Verify transcript entries
  const entries = page.locator('[data-testid="transcript-entry"]')
  await expect(entries).toHaveCount({ min: 1 })

  // Verify first entry structure
  const firstEntry = entries.first()
  await expect(
    firstEntry.locator('[data-testid="speaker-badge"]')
  ).toBeVisible()
  await expect(firstEntry.locator('[data-testid="timestamp"]')).toBeVisible()
  await expect(firstEntry.locator('[data-testid="confidence"]')).toBeVisible()
  await expect(firstEntry.locator('text=Welcome everyone')).toBeVisible()
})
```

### Test 3.2: Speaker Summary Panel

```typescript
test('displays speaker summary with correct count', async ({ page }) => {
  await page.goto('/')

  // Upload file with 3 speakers
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample-3-speakers.mp4')

  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Verify speaker summary
  await expect(page.getByText('Identified Speakers')).toBeVisible()
  await expect(page.getByText('3')).toBeVisible() // Count badge

  // Verify all 3 speaker badges
  await expect(page.getByText('Speaker 1')).toBeVisible()
  await expect(page.getByText('Speaker 2')).toBeVisible()
  await expect(page.getByText('Speaker 3')).toBeVisible()
})
```

### Test 3.3: Speaker Color Coding

```typescript
test('applies correct colors to speaker badges', async ({ page }) => {
  await page.goto('/')

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample-3-speakers.mp4')

  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Check Speaker 1 - Blue
  const speaker1Badge = page.locator('[data-speaker="1"]').first()
  const bg1 = await speaker1Badge.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg1).toContain('59, 130, 246') // Blue

  // Check Speaker 2 - Emerald
  const speaker2Badge = page.locator('[data-speaker="2"]').first()
  const bg2 = await speaker2Badge.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg2).toContain('16, 185, 129') // Emerald

  // Check Speaker 3 - Purple
  const speaker3Badge = page.locator('[data-speaker="3"]').first()
  const bg3 = await speaker3Badge.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg3).toContain('168, 85, 247') // Purple
})
```

### Test 3.4: Transcript Entry Hover Effects

```typescript
test('applies hover effects to transcript entries', async ({ page }) => {
  await page.goto('/')

  // Upload and wait for transcript
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  const firstEntry = page.locator('[data-testid="transcript-entry"]').first()

  // Get initial styles
  const initialBg = await firstEntry.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )

  // Hover
  await firstEntry.hover()

  // Verify background changed
  const hoverBg = await firstEntry.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )

  expect(hoverBg).not.toBe(initialBg)

  // Verify shadow increased (shadow-lg)
  const shadow = await firstEntry.evaluate(
    el => window.getComputedStyle(el).boxShadow
  )
  expect(shadow).not.toBe('none')
})
```

---

## Test Suite 4: Export Functionality

**File**: `04-export.spec.ts`

### Test 4.1: Export Button Visibility

```typescript
test('shows export button after transcription completes', async ({ page }) => {
  await page.goto('/')

  // Verify button not visible initially
  await expect(page.getByRole('button', { name: /export/i })).not.toBeVisible()

  // Upload and process
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Verify export button appears
  await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
})
```

### Test 4.2: Export JSON Format

```typescript
test('exports transcript as JSON file', async ({ page }) => {
  await page.goto('/')

  // Upload and process
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Trigger JSON export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /export json/i }).click(),
  ])

  // Verify download
  expect(download.suggestedFilename()).toMatch(/transcript.*\.json$/)

  // Verify JSON content
  const path = await download.path()
  const content = await fs.readFile(path!, 'utf-8')
  const json = JSON.parse(content)

  expect(json).toHaveProperty('id')
  expect(json).toHaveProperty('entries')
  expect(json).toHaveProperty('speakers')
  expect(json).toHaveProperty('metadata')
})
```

### Test 4.3: Export SRT Format

```typescript
test('exports transcript as SRT file', async ({ page }) => {
  await page.goto('/')

  // Setup
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Trigger SRT export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /export srt/i }).click(),
  ])

  expect(download.suggestedFilename()).toMatch(/\.srt$/)

  // Verify SRT format
  const path = await download.path()
  const content = await fs.readFile(path!, 'utf-8')

  // Should have numbered blocks
  expect(content).toMatch(/^1\n/)

  // Should have timestamp format HH:MM:SS,mmm --> HH:MM:SS,mmm
  expect(content).toMatch(/\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}/)

  // Should have speaker labels
  expect(content).toMatch(/Speaker \d+:/)
})
```

### Test 4.4: Export VTT Format

```typescript
test('exports transcript as VTT file', async ({ page }) => {
  await page.goto('/')

  // Setup
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Trigger VTT export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /export vtt/i }).click(),
  ])

  expect(download.suggestedFilename()).toMatch(/\.vtt$/)

  // Verify VTT format
  const path = await download.path()
  const content = await fs.readFile(path!, 'utf-8')

  // Should start with WEBVTT
  expect(content).toMatch(/^WEBVTT/)

  // Should have timestamp format HH:MM:SS.mmm --> HH:MM:SS.mmm
  expect(content).toMatch(
    /\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}/
  )

  // Should have voice tags
  expect(content).toMatch(/<v Speaker \d+>/)
})
```

---

## Test Suite 5: Reset Workflow

**File**: `05-reset.spec.ts`

### Test 5.1: Process Another Video Button

```typescript
test('allows processing another video after completion', async ({ page }) => {
  await page.goto('/')

  // First video
  let fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')
  await expect(page.getByText('Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Click reset
  await page.getByRole('button', { name: /process another video/i }).click()

  // Verify reset to initial state
  await expect(page.getByText('Drop your video here')).toBeVisible()
  await expect(page.getByText('No transcript yet')).toBeVisible()
  await expect(page.locator('video')).not.toBeVisible()

  // Verify can upload again
  fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample-2-speakers.mp4')
  await expect(page.locator('video')).toBeVisible()
})
```

---

## Test Suite 6: Error Handling

**File**: `06-errors.spec.ts`

### Test 6.1: API Error Display

```typescript
test('displays error message when API fails', async ({ page }) => {
  await page.goto('/')

  // Mock API error
  await page.route('**/api/transcribe', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    })
  })

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Verify error state
  await expect(page.getByText(/processing failed|error/i)).toBeVisible({
    timeout: 10000,
  })
  await expect(page.locator('.text-red-600')).toBeVisible()
})
```

### Test 6.2: Network Error Recovery

```typescript
test('handles network errors gracefully', async ({ page }) => {
  await page.goto('/')

  // Simulate offline
  await page.context().setOffline(true)

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Verify error message
  await expect(page.getByText(/network error|offline/i)).toBeVisible({
    timeout: 10000,
  })

  // Restore connection
  await page.context().setOffline(false)

  // Verify retry option
  const retryButton = page.getByRole('button', { name: /retry|try again/i })
  if (await retryButton.isVisible()) {
    await retryButton.click()
    // Should attempt processing again
  }
})
```

---

## Test Suite 7: Responsive Behavior

**File**: `07-responsive.spec.ts`

### Test 7.1: Mobile Layout

```typescript
test('displays single column layout on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  // Verify single column
  const grid = page.locator('.grid')
  const columns = await grid.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.gridTemplateColumns
  })

  expect(columns.split(' ')).toHaveLength(1)

  // Verify upload zone is full width
  const uploadCard = page.getByText('Upload Video').locator('..')
  const width = await uploadCard.evaluate(el => el.offsetWidth)
  const viewportWidth = page.viewportSize()!.width

  expect(width).toBeGreaterThan(viewportWidth * 0.9) // At least 90% of viewport
})
```

### Test 7.2: Desktop Two-Column Layout

```typescript
test('displays two column layout on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  // Verify two columns
  const grid = page.locator('.grid.lg\\:grid-cols-2')
  const columns = await grid.evaluate(el => {
    const style = window.getComputedStyle(el)
    return style.gridTemplateColumns
  })

  const columnArray = columns.split(' ')
  expect(columnArray.length).toBeGreaterThan(1)
})
```

---

## Test Suite 8: Accessibility

**File**: `08-accessibility.spec.ts`

### Test 8.1: Keyboard Navigation

```typescript
test('supports full keyboard navigation', async ({ page }) => {
  await page.goto('/')

  // Tab through all interactive elements
  await page.keyboard.press('Tab')
  let focused = await page.evaluate(() => document.activeElement?.tagName)
  expect(focused).toBeTruthy()

  // Should be able to activate upload with Enter
  await page.keyboard.press('Enter')

  // Continue tabbing
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')

  // Verify focus indicators visible
  const focusedElement = page.locator(':focus')
  const outline = await focusedElement.evaluate(
    el => window.getComputedStyle(el).outline
  )
  expect(outline).not.toBe('none')
})
```

### Test 8.2: ARIA Labels

```typescript
test('has proper ARIA labels on all controls', async ({ page }) => {
  await page.goto('/')

  // Upload button
  const uploadButton = page.getByRole('button', { name: /choose file|upload/i })
  await expect(uploadButton).toHaveAttribute('aria-label')

  // Progress bar (when visible)
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  const progressBar = page.locator('[role="progressbar"]')
  if (await progressBar.isVisible()) {
    await expect(progressBar).toHaveAttribute('aria-valuenow')
    await expect(progressBar).toHaveAttribute('aria-valuemin')
    await expect(progressBar).toHaveAttribute('aria-valuemax')
  }
})
```

---

## Test Fixtures

Create these files in `tests/fixtures/`:

1. **sample.mp4** - 30 second video, 2-3 speakers, clear audio
2. **sample-2-speakers.mp4** - Video with exactly 2 speakers
3. **sample-3-speakers.mp4** - Video with exactly 3 speakers
4. **invalid-file.pdf** - Non-video file for validation testing
5. **corrupt-video.mp4** - Invalid video file for error handling

---

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific suite
npx playwright test 01-upload.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Run with debugging
npx playwright test --debug

# Generate report
npx playwright show-report
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-17
**Framework**: Playwright
**Coverage Target**: 100% of critical user flows
