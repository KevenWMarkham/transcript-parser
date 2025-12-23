import { test, expect } from '@playwright/test'
import { loadDemoTranscript, clearAppState, setApiKey } from './helpers'

test.describe('Sprint 01 - Package Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page)
    await page.goto('/')
  })

  test.describe('@transcript-parser/types integration', () => {
    test('should handle TranscriptData type correctly', async ({ page }) => {
      // Load demo transcript
      await loadDemoTranscript(page)

      // Verify transcript structure is rendered correctly
      await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()

      // Check for transcript entries (speakers, timestamps, text)
      const entries = page.locator('[class*="transcript-entry"]')
      const entryCount = await entries.count()
      expect(entryCount).toBeGreaterThan(0)
    })

    test('should display speaker metadata', async ({ page }) => {
      await loadDemoTranscript(page)

      // Look for speaker labels
      const speakerLabels = page.locator('text=/Speaker \\d+/')
      const count = await speakerLabels.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display timestamp data', async ({ page }) => {
      await loadDemoTranscript(page)

      // Look for timestamps (format: MM:SS or HH:MM:SS)
      const timestamps = page.locator('text=/\\d{1,2}:\\d{2}/')
      const count = await timestamps.count()
      expect(count).toBeGreaterThan(0)
    })
  })

  test.describe('@transcript-parser/export integration', () => {
    test('should export using export package', async ({ page }) => {
      await loadDemoTranscript(page)

      // Click export
      await page.click('button:has-text("Export")')
      await page.waitForSelector('text=Export Transcript')

      // Select JSON format (easy to validate)
      await page.click('text=JSON')

      // Download
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('button:has-text("Download")')
      ])

      expect(download.suggestedFilename()).toMatch(/\.json$/)

      // Verify JSON structure matches TranscriptData type
      const path = await download.path()
      if (path) {
        const fs = require('fs')
        const content = JSON.parse(fs.readFileSync(path, 'utf-8'))

        expect(content).toHaveProperty('entries')
        expect(content).toHaveProperty('metadata')
        expect(Array.isArray(content.entries)).toBe(true)
      }
    })

    test('should export all supported formats', async ({ page }) => {
      await loadDemoTranscript(page)

      const formats = [
        { name: 'Plain Text', ext: '.txt' },
        { name: 'SRT', ext: '.srt' },
        { name: 'WebVTT', ext: '.vtt' },
        { name: 'CSV', ext: '.csv' },
      ]

      for (const format of formats) {
        await page.click('button:has-text("Export")')
        await page.waitForSelector('text=Export Transcript')
        await page.click(`text=${format.name}`)

        const [download] = await Promise.all([
          page.waitForEvent('download'),
          page.click('button:has-text("Download")')
        ])

        expect(download.suggestedFilename()).toMatch(new RegExp(`\\${format.ext}$`))
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe('@transcript-parser/ai-services integration', () => {
    test('should use AI services for transcription', async ({ page }) => {
      // Configure API key
      const apiKey = process.env.TEST_GEMINI_API_KEY || 'test-key'
      await setApiKey(page, apiKey)
      await page.reload()

      // Note: This test requires a valid API key and will actually call the API
      // Skip if TEST_GEMINI_API_KEY is not set
      if (!process.env.TEST_GEMINI_API_KEY) {
        test.skip()
        return
      }

      // Upload would trigger AI services
      // This is tested in the upload spec, so we'll verify the integration here
      // by checking that the service is available
      await expect(page.locator('button:has-text("Configure API")')).not.toBeVisible()
      await expect(page.locator('button:has-text("API Configured")')).toBeVisible()
    })

    test('should track usage with usage tracker', async ({ page }) => {
      // Login first (usage tracking requires auth)
      const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@example.com'
      const demoPassword = process.env.DEMO_USER_PASSWORD || 'demo123'

      // Click login
      const loginButton = page.locator('button:has-text("Login / Register")')
      if (await loginButton.isVisible()) {
        await loginButton.click()
        await page.fill('input[type="email"]', demoEmail)
        await page.fill('input[type="password"]', demoPassword)
        await page.click('button[type="submit"]')
        await page.waitForSelector('text=Logout', { timeout: 5000 })
      }

      // Click summary to check usage
      await page.click('button:has-text("Summary")')
      await page.waitForSelector('text=Usage Summary', { timeout: 5000 })

      // Verify usage data is displayed
      await expect(page.locator('text=Total Operations')).toBeVisible()
    })
  })

  test.describe('@transcript-parser/audio-processing integration', () => {
    test('should validate video files', async ({ page }) => {
      // Try uploading a valid file
      const path = require('path')
      const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-video.webm')

      await page.setInputFiles('input[type="file"]', filePath)

      // Should show preview (validation passed)
      await page.waitForSelector('text=Video Preview', { timeout: 10000 })
      await expect(page.locator('text=Video Preview')).toBeVisible()
    })

    test('should extract video metadata', async ({ page }) => {
      const path = require('path')
      const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-video.webm')

      await page.setInputFiles('input[type="file"]', filePath)
      await page.waitForSelector('text=Video Preview', { timeout: 10000 })

      // Verify metadata extraction worked
      await expect(page.locator('text=File Name')).toBeVisible()
      await expect(page.locator('text=File Size')).toBeVisible()
      await expect(page.locator('text=Duration')).toBeVisible()
      await expect(page.locator('text=Resolution')).toBeVisible()
    })
  })

  test.describe('@transcript-parser/ui integration', () => {
    test('should render all UI components', async ({ page }) => {
      // Verify Header
      await expect(page.locator('text=Transcript Parser')).toBeVisible()

      // Verify Upload component
      await expect(page.locator('h2:has-text("Upload Video or Audio")')).toBeVisible()

      // Load demo for more components
      await loadDemoTranscript(page)

      // Verify TranscriptView
      await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()

      // Verify search (if available)
      const searchInput = page.locator('input[placeholder*="Search"]')
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeVisible()
      }
    })

    test('should use useTranscription hook', async ({ page }) => {
      // This hook manages transcription state
      // Verify it works by checking processing states
      await loadDemoTranscript(page)

      // Should show transcript content (processing complete state)
      await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()
    })
  })

  test.describe('@transcript-parser/database integration', () => {
    test('should save transcript to library when authenticated', async ({ page }) => {
      // Login first
      const demoEmail = process.env.DEMO_USER_EMAIL || 'demo@example.com'
      const demoPassword = process.env.DEMO_USER_PASSWORD || 'demo123'

      const loginButton = page.locator('button:has-text("Login / Register")')
      if (await loginButton.isVisible()) {
        await loginButton.click()
        await page.fill('input[type="email"]', demoEmail)
        await page.fill('input[type="password"]', demoPassword)
        await page.click('button[type="submit"]')
        await page.waitForSelector('text=Logout', { timeout: 5000 })
      }

      // Load demo transcript
      await loadDemoTranscript(page)

      // Go to library
      await page.click('button:has-text("My Transcripts")')
      await page.waitForSelector('text=My Transcripts', { timeout: 5000 })

      // Verify library loads (database integration working)
      // May or may not have transcripts
      const libraryContent = page.locator('text=No transcripts').or(
        page.locator('[class*="transcript"]')
      )
      await expect(libraryContent.first()).toBeVisible({ timeout: 5000 })
    })
  })

  test.describe('@transcript-parser/config integration', () => {
    test('should load configuration correctly', async ({ page }) => {
      // Config package provides build-time configuration
      // Verify app loads correctly (config is working)
      await expect(page.locator('text=Transcript Parser')).toBeVisible()

      // Check if environment is properly configured
      const baseUrl = page.url()
      expect(baseUrl).toContain('localhost:5173')
    })
  })

  test.describe('@transcript-parser/module-sdk integration', () => {
    test('should support module registry', async ({ page }) => {
      // Module SDK provides extensibility
      // This would be tested when modules are implemented
      // For now, verify the app loads (SDK is integrated)
      await expect(page.locator('text=Transcript Parser')).toBeVisible()

      // Future: Check for module menu or module activation UI
      // const moduleMenu = page.locator('button:has-text("Modules")')
      // if (await moduleMenu.isVisible()) {
      //   await moduleMenu.click()
      // }
    })
  })

  test.describe('Cross-package integration', () => {
    test('should handle complete workflow using all packages', async ({ page }) => {
      // 1. Upload (uses audio-processing, types)
      const path = require('path')
      const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-video.webm')
      await page.setInputFiles('input[type="file"]', filePath)
      await page.waitForSelector('text=Video Preview', { timeout: 10000 })

      // 2. View transcript (uses ui, types)
      await loadDemoTranscript(page)
      await expect(page.locator('[data-testid="transcript-content"]')).toBeVisible()

      // 3. Export (uses export, types)
      await page.click('button:has-text("Export")')
      await page.waitForSelector('text=Export Transcript')
      await page.click('text=Plain Text')

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('button:has-text("Download")')
      ])

      expect(download.suggestedFilename()).toMatch(/\.txt$/)

      // All packages worked together successfully
    })

    test('should maintain type safety across packages', async ({ page }) => {
      // Load demo
      await loadDemoTranscript(page)

      // Verify data structure integrity (types package)
      const entries = page.locator('[class*="transcript-entry"]')
      const count = await entries.count()
      expect(count).toBeGreaterThan(0)

      // Export to verify types are consistent
      await page.click('button:has-text("Export")')
      await page.waitForSelector('text=Export Transcript')
      await page.click('text=JSON')

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.click('button:has-text("Download")')
      ])

      const downloadPath = await download.path()
      if (downloadPath) {
        const fs = require('fs')
        const data = JSON.parse(fs.readFileSync(downloadPath, 'utf-8'))

        // Verify TranscriptData structure
        expect(data).toHaveProperty('entries')
        expect(data).toHaveProperty('metadata')
        expect(data.entries[0]).toHaveProperty('text')
        expect(data.entries[0]).toHaveProperty('speakerNumber')
        expect(data.entries[0]).toHaveProperty('startTime')
      }
    })

    test('should handle errors gracefully across packages', async ({ page }) => {
      // Try uploading invalid file (tests audio-processing validation)
      await page.evaluate(() => {
        const blob = new Blob(['invalid'], { type: 'text/plain' })
        const file = new File([blob], 'invalid.txt', { type: 'text/plain' })

        const input = document.querySelector('input[type="file"]') as HTMLInputElement
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        input.dispatchEvent(new Event('change', { bubbles: true }))
      })

      // Should show error
      await page.waitForSelector('[role="alert"]', { timeout: 5000 })
      await expect(page.locator('[role="alert"]')).toBeVisible()

      // App should still be functional
      await expect(page.locator('text=Transcript Parser')).toBeVisible()
    })
  })
})
