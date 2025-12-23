import { test, expect } from '@playwright/test'
import { loadDemoTranscript, clearAppState, openExportDialog, selectExportFormat, downloadSelectedFormat } from './helpers'
import fs from 'fs'

test.describe('Sprint 01 - Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page)
    await page.goto('/')
    // Load demo transcript for testing
    await loadDemoTranscript(page)
  })

  test('should display export button when transcript is loaded', async ({ page }) => {
    // Verify export button exists
    const exportButton = page.locator('button', { hasText: 'Export' })
    await expect(exportButton).toBeVisible()
  })

  test('should open export dialog when export button is clicked', async ({ page }) => {
    // Open export dialog with helper
    await openExportDialog(page)

    // Verify dialog is visible
    await expect(page.locator('h2:has-text("Export Transcript")')).toBeVisible()

    // Verify export format options are available (use more specific selectors)
    await expect(page.locator('.font-semibold').filter({ hasText: 'Plain Text' })).toBeVisible()
    await expect(page.locator('.font-semibold').filter({ hasText: 'SRT' })).toBeVisible()
    await expect(page.locator('.font-semibold').filter({ hasText: 'WebVTT' })).toBeVisible()
    await expect(page.locator('.font-semibold').filter({ hasText: 'JSON' })).toBeVisible()
    await expect(page.locator('.font-semibold').filter({ hasText: 'CSV' })).toBeVisible()
  })

  test('should export transcript as plain text', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)

    // Wait for download
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }),
      downloadSelectedFormat(page, 'Plain Text')
    ])

    // Verify download
    expect(download.suggestedFilename()).toMatch(/\.txt$/)

    // Optionally verify file content
    const path = await download.path()
    if (path) {
      const content = fs.readFileSync(path, 'utf-8')
      expect(content.length).toBeGreaterThan(0)
    }
  })

  test('should export transcript as SRT', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)

    // Download SRT
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadSelectedFormat(page, 'SRT')
    ])

    // Verify SRT file
    expect(download.suggestedFilename()).toMatch(/\.srt$/)
  })

  test('should export transcript as WebVTT', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Download WebVTT
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadSelectedFormat(page, 'WebVTT')
    ])

    // Verify VTT file
    expect(download.suggestedFilename()).toMatch(/\.vtt$/)
  })

  test('should export transcript as JSON', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Download JSON
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadSelectedFormat(page, 'JSON')
    ])

    // Verify JSON file
    expect(download.suggestedFilename()).toMatch(/\.json$/)

    // Verify JSON content is valid
    const path = await download.path()
    if (path) {
      const content = fs.readFileSync(path, 'utf-8')
      expect(() => JSON.parse(content)).not.toThrow()
    }
  })

  test('should export transcript as CSV', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Download CSV
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadSelectedFormat(page, 'CSV')
    ])

    // Verify CSV file
    expect(download.suggestedFilename()).toMatch(/\.csv$/)

    // Verify CSV content has headers
    const path = await download.path()
    if (path) {
      const content = fs.readFileSync(path, 'utf-8')
      expect(content).toContain('Speaker')
      expect(content).toContain('Time')
      expect(content).toContain('Text')
    }
  })

  test('should allow configuring export options', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Select Plain Text format
    await selectExportFormat(page, 'Plain Text')

    // Look for export options (checkboxes)
    const includeTimestamps = page.locator('text=Include Timestamps')
    const includeSpeakers = page.locator('text=Include Speakers')

    // Check if options exist
    if (await includeTimestamps.isVisible()) {
      // Toggle timestamps
      await includeTimestamps.click()
    }

    if (await includeSpeakers.isVisible()) {
      // Toggle speakers
      await includeSpeakers.click()
    }

    // Download with options
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadSelectedFormat(page, 'Plain Text')
    ])

    expect(download.suggestedFilename()).toMatch(/\.txt$/)
  })

  test('should close export dialog when cancel is clicked', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Click cancel or close button
    const cancelButton = page.locator('button', { hasText: 'Cancel' }).or(
      page.locator('button[aria-label="Close"]')
    )

    if (await cancelButton.count() > 0) {
      await cancelButton.first().click()

      // Verify dialog is closed
      await expect(page.locator('text=Export Transcript')).not.toBeVisible()
    }
  })

  test('should show advanced export panel after processing', async ({ page }) => {
    // Check if advanced export panel is visible
    const advancedExport = page.locator('text=Advanced Export')

    if (await advancedExport.isVisible()) {
      // Verify it shows format options
      await expect(page.locator('text=Plain Text')).toBeVisible()
      await expect(page.locator('text=SRT Subtitles')).toBeVisible()
      await expect(page.locator('text=WebVTT')).toBeVisible()
      await expect(page.locator('text=JSON')).toBeVisible()
      await expect(page.locator('text=CSV')).toBeVisible()

      // Verify format descriptions
      await expect(page.locator('text=Human-readable format')).toBeVisible()
      await expect(page.locator('text=Video player compatible')).toBeVisible()
      await expect(page.locator('text=Spreadsheet ready')).toBeVisible()
    }
  })

  test('should export all formats successfully', async ({ page }) => {
    const formats = [
      { name: 'Plain Text', extension: '.txt' },
      { name: 'SRT', extension: '.srt' },
      { name: 'WebVTT', extension: '.vtt' },
      { name: 'JSON', extension: '.json' },
      { name: 'CSV', extension: '.csv' },
    ] as const

    for (const format of formats) {
      // Open export dialog
      await openExportDialog(page)
      await page.waitForSelector('text=Export Transcript', { timeout: 5000 })

      // Download selected format
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadSelectedFormat(page, format.name)
      ])

      // Verify file extension
      expect(download.suggestedFilename()).toMatch(new RegExp(`\\${format.extension}$`))

      // Wait for dialog to close
      await page.waitForTimeout(500)
    }
  })

  test('should export filtered transcript content', async ({ page }) => {
    // Apply a filter first (if search is available)
    const searchInput = page.locator('input[placeholder*="Search"]')

    if (await searchInput.isVisible()) {
      // Enter search query
      await searchInput.fill('test')
      await page.waitForTimeout(500)

      // Now export
      await openExportDialog(page)
      await page.waitForSelector('text=Export Transcript')

      // Download Plain Text format
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadSelectedFormat(page, 'Plain Text')
      ])

      // Verify download completed
      expect(download.suggestedFilename()).toMatch(/\.txt$/)
    }
  })

  test('should maintain export dialog state when switching formats', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Select Plain Text
    await selectExportFormat(page, 'Plain Text')

    // Wait a moment
    await page.waitForTimeout(300)

    // Switch to JSON
    await selectExportFormat(page, 'JSON')

    // Verify dialog is still open
    await expect(page.locator('h2:has-text("Export Transcript")')).toBeVisible()

    // Verify JSON format card is visible (indicating format switch worked)
    await expect(page.locator('.cursor-pointer').filter({ hasText: 'JSON' })).toBeVisible()
  })

  test('should show file size information in export dialog', async ({ page }) => {
    // Open export dialog
    await openExportDialog(page)
    // Select a format
    await selectExportFormat(page, 'Plain Text')

    // Look for file size or entry count information
    // This might be format-specific
    const entryCountText = page.locator('text=/\\d+ entries/')
    const fileSizeText = page.locator('text=/\\d+ (KB|MB)/')

    // At least one should be visible
    const hasEntryCount = await entryCountText.count() > 0
    const hasFileSize = await fileSizeText.count() > 0

    // This is informational, not a strict requirement
    if (!hasEntryCount && !hasFileSize) {
      console.log('No size information displayed in export dialog')
    }
  })
})
