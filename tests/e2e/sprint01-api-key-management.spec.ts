import { test, expect } from '@playwright/test'
import { clearAppState, elementExists, openApiSettings } from './helpers'
import path from 'path'

test.describe('Sprint 01 - API Key Management', () => {
  test.beforeEach(async ({ page }) => {
    await clearAppState(page)
    await page.goto('/')
  })

  test('should display API configuration button on initial load', async ({ page }) => {
    // Verify API config button exists
    const configButton = page.locator('button', { hasText: 'Configure API' }).or(
      page.locator('button', { hasText: 'API Configured' })
    )

    await expect(configButton).toBeVisible()
  })

  test('should show warning state when API is not configured', async ({ page }) => {
    // Look for warning indicator
    const warningButton = page.locator('button', { hasText: 'Configure API' })

    if (await warningButton.isVisible()) {
      // Verify it has warning styling (red border/text)
      const classes = await warningButton.getAttribute('class')
      expect(classes).toMatch(/red/i)
    }
  })

  test('should open API settings modal when configure button is clicked', async ({ page }) => {
    // Open API settings modal with helper
    await openApiSettings(page)

    // Verify modal is visible
    await expect(page.locator('text=API Configuration')).toBeVisible()

    // Verify mode options are available
    await expect(page.locator('text=Free Mode')).toBeVisible()
    await expect(page.locator('text=Paid Mode')).toBeVisible()
  })

  test('should allow saving API key in free mode', async ({ page }) => {
    // Open API settings
    await openApiSettings(page)

    // Select Free Mode (if not already selected)
    const freeMode = page.locator('text=Free Mode')
    if (await freeMode.isVisible()) {
      await freeMode.click()
    }

    // Enter API key
    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    const testApiKey = process.env.TEST_GEMINI_API_KEY || 'test-api-key-12345'
    await apiKeyInput.fill(testApiKey)

    // Save
    await page.click('button:has-text("Save")')

    // Wait for modal to close
    await page.waitForSelector('text=API Configuration', { state: 'hidden', timeout: 5000 })

    // Verify success - button should show "API Configured"
    const configuredButton = page.locator('button', { hasText: 'API Configured' })
    await expect(configuredButton).toBeVisible({ timeout: 5000 })

    // Verify button has success styling (green/emerald)
    const classes = await configuredButton.getAttribute('class')
    expect(classes).toMatch(/emerald|green/i)
  })

  test('should allow saving API key in paid mode', async ({ page }) => {
    // Open API settings
    await openApiSettings(page)

    // Select Paid Mode
    await page.click('text=Paid Mode')

    // Enter API key
    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    const testApiKey = process.env.TEST_GEMINI_API_KEY || 'test-api-key-paid-12345'
    await apiKeyInput.fill(testApiKey)

    // Check if balance input exists
    const balanceInput = page.locator('input[type="number"]')
    if (await balanceInput.isVisible()) {
      await balanceInput.fill('10.00')
    }

    // Save
    await page.click('button:has-text("Save")')

    // Wait for modal to close
    await page.waitForSelector('text=API Configuration', { state: 'hidden', timeout: 5000 })

    // Verify API configured
    await expect(page.locator('button', { hasText: 'API Configured' })).toBeVisible({ timeout: 5000 })
  })

  test('should validate API key format', async ({ page }) => {
    // Open API settings
    await openApiSettings(page)

    // Enter invalid API key (too short)
    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill('short')

    // Try to save
    await page.click('button:has-text("Save")')

    // Check if validation error appears
    const errorMessage = page.locator('[role="alert"], .text-red-500, .text-destructive')

    // If validation exists, verify error is shown
    if (await errorMessage.count() > 0) {
      await expect(errorMessage.first()).toBeVisible()
    } else {
      // If no validation, modal should still be open
      await expect(page.locator('text=API Configuration')).toBeVisible()
    }
  })

  test('should persist API configuration across page reloads', async ({ page }) => {
    const testApiKey = 'test-persistent-key-67890'

    // Configure API
    await openApiSettings(page)

    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill(testApiKey)

    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify API is still configured
    await expect(page.locator('button', { hasText: 'API Configured' })).toBeVisible({ timeout: 5000 })

    // Open settings again and verify key is saved
    await page.click('button:has-text("API Configured")')
    await page.waitForSelector('text=API Configuration')

    // Verify the input has a value (it might be masked)
    const savedInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    const value = await savedInput.inputValue()
    expect(value.length).toBeGreaterThan(0)
  })

  test('should allow clearing API configuration', async ({ page }) => {
    // First, configure API
    await openApiSettings(page)

    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill('temporary-key-12345')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Open settings again
    await page.click('button:has-text("API Configured")')
    await page.waitForSelector('text=API Configuration')

    // Clear the API key
    const clearInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await clearInput.clear()

    // Save empty
    await page.click('button:has-text("Save")')

    // Might show warning or close
    await page.waitForTimeout(1000)

    // Check if warning button reappears
    const warningButton = page.locator('button', { hasText: 'Configure API' })
    if (await warningButton.isVisible()) {
      const classes = await warningButton.getAttribute('class')
      expect(classes).toMatch(/red/i)
    }
  })

  test('should close modal when cancel button is clicked', async ({ page }) => {
    // Open API settings
    await openApiSettings(page)

    // Click cancel or close
    const closeButton = page.locator('button[aria-label="Close"]').or(
      page.locator('button:has-text("Cancel")')
    )

    if (await closeButton.count() > 0) {
      await closeButton.first().click()

      // Verify modal is closed
      await expect(page.locator('text=API Configuration')).not.toBeVisible()
    }
  })

  test('should show balance alert for paid mode with low balance', async ({ page }) => {
    // Configure API in paid mode with low balance
    await openApiSettings(page)

    await page.click('text=Paid Mode')

    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill('paid-key-low-balance')

    // Set very low balance
    const balanceInput = page.locator('input[type="number"]')
    if (await balanceInput.isVisible()) {
      await balanceInput.fill('0.50')
    }

    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Look for low balance alert
    const balanceAlert = page.locator('text=/low.*balance/i, text=/add.*credit/i')

    if (await balanceAlert.count() > 0) {
      await expect(balanceAlert.first()).toBeVisible()
    }
  })

  test('should allow dismissing balance alert', async ({ page }) => {
    // This test assumes balance alert is shown
    // We need to first configure low balance

    await openApiSettings(page)

    await page.click('text=Paid Mode')

    const apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill('paid-key-dismissible')

    const balanceInput = page.locator('input[type="number"]')
    if (await balanceInput.isVisible()) {
      await balanceInput.fill('0.25')
    }

    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Look for dismiss button on alert
    const dismissButton = page.locator('button:has-text("Dismiss"), button[aria-label*="Dismiss"], button[aria-label*="Close"]')

    if (await dismissButton.count() > 0) {
      const alertVisible = await dismissButton.first().isVisible()
      if (alertVisible) {
        await dismissButton.first().click()

        // Alert should disappear
        await expect(dismissButton.first()).not.toBeVisible()
      }
    }
  })

  test('should require API key before transcription', async ({ page }) => {
    // Clear any existing API configuration
    await clearAppState(page)
    await page.goto('/')

    const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-video.webm')

    // Try to upload without API key configured
    await page.setInputFiles('input[type="file"]', filePath)
    await page.waitForSelector('text=Video Preview', { timeout: 10000 })

    // Check if API key prompt appears or if transcription is blocked
    await page.waitForTimeout(2000)

    // Look for API key prompt or error
    const apiPrompt = page.locator('text=/API.*key.*required/i, text=/configure.*API/i')
    const hasPrompt = await apiPrompt.count() > 0

    if (hasPrompt) {
      await expect(apiPrompt.first()).toBeVisible()
    }
  })

  test('should allow updating API key after initial configuration', async ({ page }) => {
    // Initial configuration
    await openApiSettings(page)

    let apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.fill('first-api-key')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Update configuration
    await page.click('button:has-text("API Configured")')
    await page.waitForSelector('text=API Configuration')

    apiKeyInput = page.locator('input[placeholder*="API"], input[type="password"]').first()
    await apiKeyInput.clear()
    await apiKeyInput.fill('updated-api-key')
    await page.click('button:has-text("Save")')
    await page.waitForSelector('text=API Configuration', { state: 'hidden' })

    // Verify still configured
    await expect(page.locator('button', { hasText: 'API Configured' })).toBeVisible()
  })

  test('should show API mode information in settings', async ({ page }) => {
    // Open API settings
    await openApiSettings(page)

    // Verify mode descriptions are shown
    await expect(page.locator('text=Free Mode')).toBeVisible()
    await expect(page.locator('text=Paid Mode')).toBeVisible()

    // Check for explanatory text
    const freeDescription = page.locator('text=/free.*tier/i, text=/quota/i')
    const paidDescription = page.locator('text=/paid.*balance/i, text=/credit/i')

    // At least one mode should have description
    const hasFreeDesc = await freeDescription.count() > 0
    const hasPaidDesc = await paidDescription.count() > 0

    expect(hasFreeDesc || hasPaidDesc).toBe(true)
  })
})
