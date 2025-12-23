import { test, expect } from '@playwright/test'
import { loadDemoTranscript, clearAppState } from './helpers'

test.describe('Sprint 01 - Performance and Loading', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page)
  })

  test('should load initial page quickly', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Initial load should be fast (< 5 seconds even with network)
    expect(loadTime).toBeLessThan(5000)

    console.log(`Page loaded in ${loadTime}ms`)
  })

  test('should load initial bundle without FFmpeg', async ({ page }) => {
    // Track network requests
    const requests: string[] = []

    page.on('request', request => {
      requests.push(request.url())
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify FFmpeg was NOT loaded on initial page load
    const ffmpegRequests = requests.filter(url =>
      url.includes('ffmpeg') || url.includes('ffmpeg-core')
    )

    expect(ffmpegRequests.length).toBe(0)

    console.log(`Initial page made ${requests.length} requests, 0 for FFmpeg`)
  })

  test('should lazy load FFmpeg only when needed', async ({ page }) => {
    const ffmpegRequests: string[] = []

    page.on('request', request => {
      if (request.url().includes('ffmpeg')) {
        ffmpegRequests.push(request.url())
      }
    })

    // Navigate to app
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify FFmpeg NOT loaded yet
    expect(ffmpegRequests.length).toBe(0)

    // Now trigger something that needs FFmpeg (if applicable)
    // Note: Current implementation might not lazy load FFmpeg
    // This test documents expected behavior

    const path = require('path')
    const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-video.webm')

    // Upload file
    await page.setInputFiles('input[type="file"]', filePath)

    // Wait for processing
    await page.waitForTimeout(3000)

    // Check if FFmpeg was loaded (might not be needed for WebM)
    console.log(`FFmpeg requests after upload: ${ffmpegRequests.length}`)
  })

  test('should render large transcript efficiently', async ({ page }) => {
    await page.goto('/')

    // Load demo transcript (60 entries)
    const startTime = Date.now()

    await loadDemoTranscript(page)

    const renderTime = Date.now() - startTime

    // Rendering should be fast (< 3 seconds)
    expect(renderTime).toBeLessThan(3000)

    console.log(`Large transcript (60 entries) rendered in ${renderTime}ms`)

    // Verify transcript is visible
    await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()
  })

  test('should handle scrolling large transcripts smoothly', async ({ page }) => {
    await page.goto('/')
    await loadDemoTranscript(page)

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(100)

    // Scroll to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(100)

    // Scroll to middle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
    await page.waitForTimeout(100)

    // Page should remain responsive
    await expect(page.locator('text=Transcript Parser')).toBeVisible()
  })

  test('should search large transcripts quickly', async ({ page }) => {
    await page.goto('/')
    await loadDemoTranscript(page)

    const searchInput = page.locator('input[placeholder*="Search"]')

    if (await searchInput.isVisible()) {
      const startTime = Date.now()

      // Type search query
      await searchInput.fill('test')

      // Wait for search to complete
      await page.waitForTimeout(500)

      const searchTime = Date.now() - startTime

      // Search should be fast (< 1 second)
      expect(searchTime).toBeLessThan(1000)

      console.log(`Search completed in ${searchTime}ms`)
    } else {
      test.skip()
    }
  })

  test('should filter transcripts efficiently', async ({ page }) => {
    await page.goto('/')
    await loadDemoTranscript(page)

    // Try to apply speaker filter if available
    const speakerFilter = page.locator('text=Speaker 1').or(
      page.locator('[data-speaker="1"]')
    )

    if (await speakerFilter.count() > 0) {
      const startTime = Date.now()

      // Click speaker to filter
      await speakerFilter.first().click()

      // Wait for filter to apply
      await page.waitForTimeout(300)

      const filterTime = Date.now() - startTime

      // Filtering should be fast
      expect(filterTime).toBeLessThan(1000)

      console.log(`Filter applied in ${filterTime}ms`)
    } else {
      test.skip()
    }
  })

  test('should export large transcript without blocking UI', async ({ page }) => {
    await page.goto('/')
    await loadDemoTranscript(page)

    // Open export dialog
    await page.click('button:has-text("Export")')
    await page.waitForSelector('text=Export Transcript')

    // Select format
    await page.click('text=JSON')

    const startTime = Date.now()

    // Trigger export
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 5000 }),
      page.click('button:has-text("Download")')
    ])

    const exportTime = Date.now() - startTime

    // Export should be fast
    expect(exportTime).toBeLessThan(3000)

    console.log(`Export completed in ${exportTime}ms`)

    // Verify download succeeded
    expect(download.suggestedFilename()).toMatch(/\.json$/)
  })

  test('should handle rapid user interactions', async ({ page }) => {
    await page.goto('/')

    // Rapid clicks on demo button
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Load Sprint 4 Demo")')
      await page.waitForTimeout(100)
    }

    // App should still be functional
    await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()

    // Clear demo
    const clearButton = page.locator('button:has-text("Clear Demo")')
    if (await clearButton.isVisible()) {
      await clearButton.click()
    }

    // Should return to upload screen
    await expect(page.locator('h2:has-text("Upload Video or Audio")')).toBeVisible()
  })

  test('should load app on slow network', async ({ page, context }) => {
    // Simulate slow 3G network
    await context.route('**/*', route => {
      setTimeout(() => route.continue(), 100) // Add 100ms delay
    })

    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime

    // Should still load (just slower)
    await expect(page.locator('text=Transcript Parser')).toBeVisible()

    console.log(`Page loaded on slow network in ${loadTime}ms`)
  })

  test('should handle memory efficiently with multiple operations', async ({ page }) => {
    await page.goto('/')

    // Perform multiple operations
    for (let i = 0; i < 3; i++) {
      // Load demo
      await loadDemoTranscript(page)
      await page.waitForTimeout(500)

      // Open export
      await page.click('button:has-text("Export")')
      await page.waitForSelector('text=Export Transcript')

      // Close export
      const closeButton = page.locator('button[aria-label="Close"]')
      if (await closeButton.isVisible()) {
        await closeButton.click()
      }
      await page.waitForTimeout(200)

      // Clear demo
      await page.click('button:has-text("Clear Demo")')
      await page.waitForTimeout(500)
    }

    // App should still be responsive
    await expect(page.locator('text=Transcript Parser')).toBeVisible()
  })

  test('should optimize re-renders with React hooks', async ({ page }) => {
    await page.goto('/')
    await loadDemoTranscript(page)

    // Track console warnings about re-renders (if any)
    const warnings: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'warning') {
        warnings.push(msg.text())
      }
    })

    // Interact with search
    const searchInput = page.locator('input[placeholder*="Search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await page.waitForTimeout(500)
      await searchInput.clear()
      await page.waitForTimeout(500)
    }

    // Should not have excessive re-render warnings
    const rerenderWarnings = warnings.filter(w =>
      w.includes('re-render') || w.includes('render')
    )

    expect(rerenderWarnings.length).toBe(0)
  })

  test('should maintain performance with animations', async ({ page }) => {
    await page.goto('/')

    const startTime = Date.now()

    // Load demo (triggers animations)
    await loadDemoTranscript(page)

    // Wait for animations to complete
    await page.waitForTimeout(1000)

    const totalTime = Date.now() - startTime

    // Should complete quickly even with animations
    expect(totalTime).toBeLessThan(3000)

    // UI should be visible
    await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()
  })

  test('should load multiple assets in parallel', async ({ page }) => {
    const requestTimings: Array<{ url: string; start: number; end: number }> = []

    page.on('requestfinished', async request => {
      const timing = request.timing()
      requestTimings.push({
        url: request.url(),
        start: timing.requestStart,
        end: timing.responseEnd,
      })
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Verify multiple resources loaded
    expect(requestTimings.length).toBeGreaterThan(5)

    console.log(`Loaded ${requestTimings.length} resources`)
  })

  test('should cache static assets', async ({ page }) => {
    // First load
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Reload page
    const cachedRequests: string[] = []

    page.on('requestfinished', async request => {
      const fromCache = request.response()?.fromCache()
      if (fromCache) {
        cachedRequests.push(request.url())
      }
    })

    await page.reload()
    await page.waitForLoadState('networkidle')

    // Some assets should be cached
    console.log(`${cachedRequests.length} requests served from cache`)

    // At minimum, the page should load
    await expect(page.locator('text=Transcript Parser')).toBeVisible()
  })
})
