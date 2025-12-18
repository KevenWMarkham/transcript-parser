# Visual Regression Testing Specification

**Purpose**: Ensure the final implementation matches the Figma design pixel-perfect
**Based on**: `tests/SITEMAP.md` and Demo implementation

---

## Test Coverage

### 1. Page States to Capture

Each state should be captured at multiple breakpoints:

- **Mobile**: 375px × 667px (iPhone SE)
- **Tablet**: 768px × 1024px (iPad)
- **Desktop**: 1920px × 1080px (Full HD)

---

## Test Scenarios

### Scenario 1: Initial Load (Empty State)

**Viewport**: All (Mobile, Tablet, Desktop)

**Elements to Verify**:

- [ ] Header with gradient icon and text
- [ ] Video uploader in initial state (dashed border)
- [ ] Empty transcript viewer
- [ ] No processing status card
- [ ] No API guide

**Screenshot Name**: `01-initial-empty-{viewport}.png`

**Visual Checks**:

```typescript
// Playwright Visual Test
test('01 - Initial Empty State', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  // Desktop
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page).toHaveScreenshot('01-initial-empty-desktop.png')

  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(page).toHaveScreenshot('01-initial-empty-tablet.png')

  // Mobile
  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page).toHaveScreenshot('01-initial-empty-mobile.png')
})
```

**Critical Design Elements**:

1. Gradient background (slate-50 → blue-50/30 → purple-50/30)
2. Glassmorphic header card with blur
3. Icon glow effect (blur-lg behind video icon)
4. Gradient text on h1
5. Upload zone animations (rotate, sparkle pulse)

---

### Scenario 2: Upload Zone Hover State

**Viewport**: Desktop only (hover not applicable on mobile)

**Elements to Verify**:

- [ ] Border changes from dashed slate-300 to violet-400
- [ ] Background gradient (violet-50 to purple-50)
- [ ] Upload icon scale animation
- [ ] Button gradient intensifies

**Screenshot Name**: `02-upload-hover-desktop.png`

**Visual Checks**:

```typescript
test('02 - Upload Zone Hover', async ({ page }) => {
  await page.goto('/')
  await page.setViewportSize({ width: 1920, height: 1080 })

  const uploadZone = page.getByTestId('upload-drop-zone')
  await uploadZone.hover()

  await expect(page).toHaveScreenshot('02-upload-hover-desktop.png')
})
```

---

### Scenario 3: File Selected State

**Viewport**: All

**Elements to Verify**:

- [ ] Video preview displays with controls
- [ ] Green success indicator with pulse animation
- [ ] "Video uploaded successfully" text
- [ ] Video maintains aspect ratio

**Screenshot Name**: `03-file-selected-{viewport}.png`

**Visual Checks**:

```typescript
test('03 - File Selected State', async ({ page }) => {
  await page.goto('/')

  // Upload a test video
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Wait for video preview
  await expect(page.locator('video')).toBeVisible()

  // Capture all viewports
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page).toHaveScreenshot('03-file-selected-desktop.png')

  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(page).toHaveScreenshot('03-file-selected-tablet.png')

  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page).toHaveScreenshot('03-file-selected-mobile.png')
})
```

**Critical Design Elements**:

1. Video element with max-height 320px
2. Green pulse indicator (animated)
3. Success message styling

---

### Scenario 4: Uploading State

**Viewport**: Desktop

**Elements to Verify**:

- [ ] Processing Status card appears
- [ ] Upload progress bar (blue gradient)
- [ ] Percentage display
- [ ] Loader icon rotating
- [ ] "Transcribing with AI" step greyed out

**Screenshot Name**: `04-uploading-state-desktop.png`

**Visual Checks**:

```typescript
test('04 - Uploading State', async ({ page }) => {
  await page.goto('/')
  await page.setViewportSize({ width: 1920, height: 1080 })

  // Mock slow upload
  await page.route('**/upload', route => {
    setTimeout(() => route.continue(), 5000)
  })

  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Wait for uploading state (not complete)
  await page.waitForTimeout(1000)

  await expect(page).toHaveScreenshot('04-uploading-state-desktop.png')
})
```

**Critical Design Elements**:

1. Blue gradient background on uploading step (blue-50 to cyan-50)
2. Progress bar styling
3. Rotating Loader2 icon
4. Grey "waiting" state for next step

---

### Scenario 5: Processing State

**Viewport**: Desktop

**Elements to Verify**:

- [ ] Upload step shows green checkmark
- [ ] Processing step active (purple gradient)
- [ ] Wand2 icon rotating with sparkles
- [ ] AI Processing Pipeline section expanded
- [ ] Pipeline steps showing checkmarks and loaders

**Screenshot Name**: `05-processing-state-desktop.png`

**Visual Checks**:

```typescript
test('05 - Processing State', async ({ page }) => {
  await page.goto('/')
  await page.setViewportSize({ width: 1920, height: 1080 })

  // Upload and wait for processing
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  // Wait for processing state
  await expect(page.locator('text=Transcribing with AI')).toBeVisible()

  await expect(page).toHaveScreenshot('05-processing-state-desktop.png')
})
```

**Critical Design Elements**:

1. Purple gradient (purple-50 to pink-50)
2. Rotating Wand2 with pulsing Sparkles
3. AI Pipeline section background (purple/pink gradient)
4. CheckCircle2 for completed steps
5. Rotating loader for active steps

---

### Scenario 6: Complete State with Transcript

**Viewport**: All

**Elements to Verify**:

- [ ] Processing Status shows all green checkmarks
- [ ] "Process Another Video" button visible
- [ ] Transcript viewer populated with entries
- [ ] Speaker summary panel with 3 speakers
- [ ] Speaker badges color-coded (blue, green, purple)
- [ ] Export button visible
- [ ] API Integration Guide appears at bottom

**Screenshot Name**: `06-complete-with-transcript-{viewport}.png`

**Visual Checks**:

```typescript
test('06 - Complete State', async ({ page }) => {
  await page.goto('/')

  // Upload and wait for completion
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('tests/fixtures/sample.mp4')

  await expect(page.locator('text=Transcription complete')).toBeVisible({
    timeout: 60000,
  })

  // Capture all viewports
  await page.setViewportSize({ width: 1920, height: 1080 })
  await expect(page).toHaveScreenshot('06-complete-desktop.png', {
    fullPage: true,
  })

  await page.setViewportSize({ width: 768, height: 1024 })
  await expect(page).toHaveScreenshot('06-complete-tablet.png', {
    fullPage: true,
  })

  await page.setViewportSize({ width: 375, height: 667 })
  await expect(page).toHaveScreenshot('06-complete-mobile.png', {
    fullPage: true,
  })
})
```

**Critical Design Elements**:

1. Green checkmarks on both status steps
2. Speaker summary panel (slate/blue gradient)
3. Transcript entries with hover states
4. Speaker color badges matching specification
5. Confidence percentage badges (green background)
6. API guide card at bottom (blue/purple gradient)

---

### Scenario 7: Transcript Entry Hover State

**Viewport**: Desktop

**Elements to Verify**:

- [ ] Entry background changes from white/60 to white/80
- [ ] Shadow increases to shadow-lg
- [ ] Left border changes from slate-300 to blue-400
- [ ] Smooth transition (300ms)

**Screenshot Name**: `07-transcript-entry-hover-desktop.png`

**Visual Checks**:

```typescript
test('07 - Transcript Entry Hover', async ({ page }) => {
  // Setup: Complete transcript visible
  // ...

  await page.setViewportSize({ width: 1920, height: 1080 })

  const firstEntry = page.locator('[data-testid="transcript-entry"]').first()
  await firstEntry.hover()

  await expect(page).toHaveScreenshot('07-transcript-entry-hover-desktop.png')
})
```

---

### Scenario 8: Empty Transcript (Processing)

**Viewport**: Desktop

**Elements to Verify**:

- [ ] File icon rotating
- [ ] Sparkles pulsing
- [ ] "Processing your video..." text
- [ ] Animated loading dots (● ● ●)

**Screenshot Name**: `08-transcript-processing-desktop.png`

**Visual Checks**:

```typescript
test('08 - Transcript Processing State', async ({ page }) => {
  // Upload file and capture during processing
  // ...

  await expect(page.locator('text=Processing your video')).toBeVisible()
  await expect(page).toHaveScreenshot('08-transcript-processing-desktop.png')
})
```

---

### Scenario 9: Speaker Summary Panel

**Viewport**: Desktop (detail view)

**Elements to Verify**:

- [ ] Speaker count badge (slate background)
- [ ] Each speaker badge with correct color and icon
- [ ] Badge styling (outline variant)
- [ ] Proper spacing and layout

**Screenshot Name**: `09-speaker-summary-desktop.png`

**Visual Checks**:

```typescript
test('09 - Speaker Summary Panel', async ({ page }) => {
  // Setup: Complete transcript with 3 speakers
  // ...

  const speakerSummary = page.locator('[data-testid="speaker-summary"]')
  await expect(speakerSummary).toBeVisible()

  await expect(speakerSummary).toHaveScreenshot('09-speaker-summary.png')
})
```

---

### Scenario 10: API Integration Guide

**Viewport**: Desktop

**Elements to Verify**:

- [ ] Gradient background (blue-50/80 to purple-50/80)
- [ ] Plug emoji in blue square
- [ ] Blue-900 heading
- [ ] Each option in white/60 rounded card
- [ ] Code snippet styling

**Screenshot Name**: `10-api-guide-desktop.png`

**Visual Checks**:

```typescript
test('10 - API Integration Guide', async ({ page }) => {
  // Setup: Complete state
  // ...

  const apiGuide = page.locator('text=API Integration Guide').locator('..')
  await expect(apiGuide).toBeVisible()

  await expect(apiGuide).toHaveScreenshot('10-api-guide.png')
})
```

---

## Color Verification Tests

### Test: Gradient Accuracy

**Purpose**: Verify all gradients match Figma specification

```typescript
test('Color - Gradients Match Specification', async ({ page }) => {
  await page.goto('/')

  // Check page background gradient
  const body = page.locator('body')
  const bgGradient = await body.evaluate(
    el => window.getComputedStyle(el).backgroundImage
  )

  expect(bgGradient).toContain('linear-gradient')
  expect(bgGradient).toContain('slate')

  // Check header icon gradient
  const icon = page.locator('.bg-gradient-to-br').first()
  const iconGradient = await icon.evaluate(
    el => window.getComputedStyle(el).backgroundImage
  )

  expect(iconGradient).toContain('rgb(59, 130, 246)') // blue-500
  expect(iconGradient).toContain('rgb(147, 51, 234)') // purple-600
})
```

### Test: Speaker Colors

**Purpose**: Verify speaker badge colors match specification

```typescript
test('Color - Speaker Badges Correct', async ({ page }) => {
  // Setup: Complete transcript
  // ...

  const speakers = page.locator('[data-testid="speaker-badge"]')

  // Speaker 1 - Blue
  const speaker1 = speakers.nth(0)
  const bg1 = await speaker1.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg1).toContain('59, 130, 246') // #3B82F6

  // Speaker 2 - Emerald
  const speaker2 = speakers.nth(1)
  const bg2 = await speaker2.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg2).toContain('16, 185, 129') // #10B981

  // Speaker 3 - Purple
  const speaker3 = speakers.nth(2)
  const bg3 = await speaker3.evaluate(
    el => window.getComputedStyle(el).backgroundColor
  )
  expect(bg3).toContain('168, 85, 247') // #A855F7
})
```

---

## Typography Verification Tests

### Test: Font Sizes

```typescript
test('Typography - Font Sizes Match', async ({ page }) => {
  await page.goto('/')

  // H1 (Title)
  const h1 = page.locator('h1')
  const h1Size = await h1.evaluate(el => window.getComputedStyle(el).fontSize)
  expect(h1Size).toBe('24px') // text-2xl

  // H2 (Card titles)
  const h2 = page.locator('h2').first()
  const h2Size = await h2.evaluate(el => window.getComputedStyle(el).fontSize)
  expect(h2Size).toBe('20px') // text-xl

  // Body text
  const p = page.locator('p').first()
  const pSize = await p.evaluate(el => window.getComputedStyle(el).fontSize)
  expect(pSize).toBe('16px') // text-base
})
```

---

## Animation Verification Tests

### Test: Page Load Animations

```typescript
test('Animation - Page Load Sequence', async ({ page }) => {
  await page.goto('/')

  // Header should fade in from top
  const header = page.locator('header').first()
  const initialOpacity = await header.evaluate(
    el => window.getComputedStyle(el).opacity
  )
  expect(parseFloat(initialOpacity)).toBeLessThan(1)

  // Wait for animation complete
  await page.waitForTimeout(500)

  const finalOpacity = await header.evaluate(
    el => window.getComputedStyle(el).opacity
  )
  expect(parseFloat(finalOpacity)).toBe(1)
})
```

### Test: Upload Icon Rotation

```typescript
test('Animation - Upload Icon Rotates', async ({ page }) => {
  await page.goto('/')

  const uploadIcon = page.locator('[data-testid="upload-icon"]')

  // Capture initial rotation
  const initialTransform = await uploadIcon.evaluate(
    el => window.getComputedStyle(el).transform
  )

  // Wait for animation cycle
  await page.waitForTimeout(2000)

  // Rotation should have changed
  const finalTransform = await uploadIcon.evaluate(
    el => window.getComputedStyle(el).transform
  )

  expect(initialTransform).not.toBe(finalTransform)
})
```

---

## Glassmorphism Verification Tests

### Test: Backdrop Blur

```typescript
test('Glassmorphism - Backdrop Blur Applied', async ({ page }) => {
  await page.goto('/')

  const cards = page.locator('.backdrop-blur-xl')
  const count = await cards.count()

  expect(count).toBeGreaterThan(0)

  // Check first card has blur
  const blur = await cards
    .first()
    .evaluate(el => window.getComputedStyle(el).backdropFilter)

  expect(blur).toContain('blur')
})
```

---

## Responsive Layout Tests

### Test: Mobile Single Column

```typescript
test('Responsive - Mobile Single Column', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  const grid = page.locator('.grid')
  const gridColumns = await grid.evaluate(
    el => window.getComputedStyle(el).gridTemplateColumns
  )

  // Should be single column (1fr or similar)
  expect(gridColumns.split(' ')).toHaveLength(1)
})
```

### Test: Desktop Two Column

```typescript
test('Responsive - Desktop Two Column', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('/')

  const grid = page.locator('.grid.lg\\:grid-cols-2')
  const gridColumns = await grid.evaluate(
    el => window.getComputedStyle(el).gridTemplateColumns
  )

  // Should be two columns
  const columns = gridColumns.split(' ')
  expect(columns.length).toBeGreaterThan(1)
})
```

---

## Accessibility Visual Tests

### Test: Focus Indicators Visible

```typescript
test('A11y - Focus Indicators Visible', async ({ page }) => {
  await page.goto('/')

  // Tab to first focusable element
  await page.keyboard.press('Tab')

  // Capture focus state
  await expect(page).toHaveScreenshot('focus-indicator.png')

  // Verify outline/ring is visible
  const focused = page.locator(':focus')
  const outline = await focused.evaluate(
    el => window.getComputedStyle(el).outline
  )

  expect(outline).not.toBe('none')
})
```

---

## Performance Visual Tests

### Test: No Layout Shift

```typescript
test('Performance - No Cumulative Layout Shift', async ({ page }) => {
  await page.goto('/')

  // Measure CLS
  const cls = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries()
        const cls = entries.reduce((sum, entry: any) => {
          return sum + (entry.hadRecentInput ? 0 : entry.value)
        }, 0)
        resolve(cls)
      }).observe({ type: 'layout-shift', buffered: true })

      setTimeout(() => resolve(0), 3000)
    })
  })

  expect(cls).toBeLessThan(0.1) // Good CLS score
})
```

---

## Test Fixtures Required

Create these in `tests/fixtures/`:

- `sample.mp4` - Small test video (10-30 seconds, 2-3 speakers)
- `large-video.mp4` - 2GB test file for size validation
- `corrupt-video.mp4` - Invalid file for error handling
- `no-audio.mp4` - Video without audio track

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run visual tests
        run: npm run test:visual

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: visual-test-results
          path: test-results/
```

---

**Document Version**: 1.0
**Last Updated**: 2025-12-17
**Test Framework**: Playwright with expect().toHaveScreenshot()
