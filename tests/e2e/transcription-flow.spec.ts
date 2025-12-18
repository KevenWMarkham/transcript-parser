/**
 * E2E test for full transcription flow
 * Tests the complete workflow from video upload to transcript display
 */

import { test, expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

test.describe('Transcription Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should complete full transcription workflow', async ({ page }) => {
    // Step 1: Verify initial state
    await expect(
      page.getByRole('heading', { name: 'Upload Video' })
    ).toBeVisible()

    // Step 2: Upload video file
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    // Create file chooser promise before clicking
    const fileChooserPromise = page.waitForEvent('filechooser')

    // Click the upload area or choose file button
    await page.getByRole('button', { name: 'Choose File' }).click()

    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(videoPath)

    // Step 3: Verify video preview appears
    await expect(
      page.getByRole('heading', { name: 'Video Preview' })
    ).toBeVisible({ timeout: 10000 })

    // Step 4: Wait for processing status to appear
    await expect(
      page.getByRole('heading', { name: 'Processing Status' })
    ).toBeVisible({ timeout: 5000 })

    // Step 5: Verify audio extraction phase
    await expect(page.getByText('Extracting audio')).toBeVisible({
      timeout: 5000,
    })

    // Step 6: Verify transcription phase
    await expect(page.getByText('Transcribing with AI')).toBeVisible({
      timeout: 15000,
    })

    // Step 7: Wait for completion
    await expect(page.getByText('Processing complete')).toBeVisible({
      timeout: 30000,
    })

    // Step 8: Verify transcript appears
    await expect(
      page.getByRole('heading', { name: 'Transcript' })
    ).toBeVisible()

    // Step 9: Verify transcript entries are displayed
    await expect(page.getByText('Speaker 1')).toBeVisible()

    // Step 10: Verify export button is available
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })

  test('should show progress during processing', async ({ page }) => {
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(videoPath)

    // Wait for processing to start
    await expect(
      page.getByRole('heading', { name: 'Processing Status' })
    ).toBeVisible({ timeout: 5000 })

    // Verify progress bar appears
    const progressBar = page.locator('[role="progressbar"]')
    await expect(progressBar).toBeVisible({ timeout: 5000 })

    // Progress percentage should be visible
    await expect(page.getByText(/%$/)).toBeVisible({ timeout: 5000 })
  })

  test('should allow processing another video after completion', async ({
    page,
  }) => {
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    // Upload first video
    const fileChooserPromise1 = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser1 = await fileChooserPromise1
    await fileChooser1.setFiles(videoPath)

    // Wait for completion
    await expect(page.getByText('Processing complete')).toBeVisible({
      timeout: 30000,
    })

    // Click "Process Another Video" button
    await page
      .getByRole('button', { name: /process another video/i })
      .click()

    // Verify we're back to upload state
    await expect(
      page.getByRole('heading', { name: 'Upload Video' })
    ).toBeVisible()
  })

  test('should handle video removal during processing', async ({ page }) => {
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(videoPath)

    // Wait for video preview
    await expect(
      page.getByRole('heading', { name: 'Video Preview' })
    ).toBeVisible({ timeout: 10000 })

    // Remove video
    await page.getByRole('button', { name: /remove/i }).click()

    // Verify we're back to upload state
    await expect(
      page.getByRole('heading', { name: 'Upload Video' })
    ).toBeVisible()

    // Processing status should not be visible
    await expect(
      page.getByRole('heading', { name: 'Processing Status' })
    ).not.toBeVisible()
  })

  test('should display transcript entries with speakers', async ({ page }) => {
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(videoPath)

    // Wait for completion
    await expect(page.getByText('Processing complete')).toBeVisible({
      timeout: 30000,
    })

    // Verify transcript entries
    const transcriptEntries = page.locator('[data-testid="transcript-entry"]')
    await expect(transcriptEntries.first()).toBeVisible()

    // Each entry should have speaker name and timestamp
    await expect(page.getByText('Speaker 1')).toBeVisible()
    await expect(page.getByText(/0:\d{2}/)).toBeVisible() // Timestamp format
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Try uploading an invalid file type
    const textPath = path.join(__dirname, '..', 'fixtures', 'test-file.txt')

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(textPath)

    // Verify error message appears
    await expect(
      page.getByText(/invalid file type/i)
    ).toBeVisible({ timeout: 5000 })
  })

  test('should show accessible processing states', async ({ page }) => {
    const videoPath = path.join(__dirname, '..', 'fixtures', 'sample-video.mp4')

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Click to upload').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(videoPath)

    // Wait for processing
    await expect(
      page.getByRole('heading', { name: 'Processing Status' })
    ).toBeVisible({ timeout: 5000 })

    // Verify ARIA labels for accessibility
    const processingSection = page.locator(
      '[role="heading"][name="Processing Status"]'
    ).first()
    await expect(processingSection).toBeVisible()
  })
})
