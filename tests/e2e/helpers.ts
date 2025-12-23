import { Page, expect } from '@playwright/test'

/**
 * Helper function to upload a file and wait for transcription
 */
export async function uploadTranscript(page: Page, filePath: string) {
  await page.setInputFiles('input[type="file"]', filePath)
  // Wait for transcription to complete (Export button appears)
  await page.waitForSelector('button:has-text("Export")', {
    timeout: 60000
  })
  // Wait for "No transcript yet" to disappear
  await page.waitForSelector('text=No transcript yet', { state: 'hidden', timeout: 5000 })
}

/**
 * Helper function to clear all app state (cookies, localStorage, sessionStorage)
 */
export async function clearAppState(page: Page) {
  await page.context().clearCookies()
  // Only clear storage if page has been navigated to
  try {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  } catch (error) {
    // Ignore errors if page hasn't loaded yet
    console.log('Could not clear storage (page not loaded yet)')
  }
}

/**
 * Helper function to set API key in localStorage
 */
export async function setApiKey(page: Page, apiKey: string) {
  await page.evaluate((key) => {
    const config = {
      mode: 'free' as const,
      freeApiKey: key,
      timestamp: Date.now(),
    }
    localStorage.setItem('gemini-api-config', JSON.stringify(config))
  }, apiKey)
}

/**
 * Helper function to wait for a file download and return its path
 */
export async function waitForDownload(page: Page, action: () => Promise<void>) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    action(),
  ])
  return download
}

/**
 * Helper function to check if an element exists without throwing
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  const element = await page.locator(selector).count()
  return element > 0
}

/**
 * Helper function to authenticate a test user
 */
export async function authenticateUser(page: Page, email: string, password: string) {
  // Check if already authenticated
  const isLoggedIn = await elementExists(page, 'text=Logout')
  if (isLoggedIn) {
    return
  }

  // Click login button
  const loginButton = page.locator('button', { hasText: 'Login / Register' })
  if (await loginButton.isVisible()) {
    await loginButton.click()
  }

  // Fill in credentials
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)

  // Submit login
  await page.click('button[type="submit"]')

  // Wait for successful login
  await expect(page.locator('text=Logout')).toBeVisible({ timeout: 5000 })
}

/**
 * Helper function to register a new user
 */
export async function registerUser(
  page: Page,
  email: string,
  password: string,
  name: string = 'Test User'
) {
  // Click login/register button
  await page.click('button', { hasText: 'Login / Register' })

  // Switch to register mode
  const registerLink = page.locator('text=Create an account')
  if (await registerLink.isVisible()) {
    await registerLink.click()
  }

  // Fill in registration form
  await page.fill('input[name="name"]', name)
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)

  // Submit registration
  await page.click('button[type="submit"]')

  // Wait for successful registration
  await expect(page.locator('text=Logout')).toBeVisible({ timeout: 5000 })
}

/**
 * Helper function to load demo transcript
 */
export async function loadDemoTranscript(page: Page) {
  await page.click('button', { hasText: 'Load Sprint 4 Demo' })
  // Wait for network to settle
  await page.waitForLoadState('networkidle')
  // Wait for transcript to load (Export button appears when transcript is available)
  await page.waitForSelector('button:has-text("Export")', { timeout: 15000 })
  // Also wait for "No transcript yet" message to disappear
  await page.waitForSelector('text=No transcript yet', { state: 'hidden', timeout: 10000 })
}

/**
 * Helper function to wait for processing to complete
 */
export async function waitForProcessingComplete(page: Page) {
  // Wait for processing status to show complete
  await page.waitForSelector('text=Processing complete', { timeout: 60000 })
}

/**
 * Helper function to open export dialog with proper waiting
 */
export async function openExportDialog(page: Page) {
  await page.click('button:has-text("Export")')
  // Wait for the dialog heading to appear (Radix UI dialog with animation)
  await page.waitForSelector('h2:has-text("Export Transcript")', { timeout: 15000, state: 'visible' })
  // Extra wait for animations to complete
  await page.waitForTimeout(300)
}

/**
 * Helper function to select an export format in the export dialog (for tests that don't download)
 */
export async function selectExportFormat(page: Page, format: 'Plain Text' | 'SRT' | 'WebVTT' | 'JSON' | 'CSV') {
  // Click on the format card (use cursor-pointer class which indicates clickable divs)
  const formatCard = page.locator('.cursor-pointer').filter({ hasText: format }).first()
  await formatCard.click()
  // Wait a moment for format selection to register
  await page.waitForTimeout(200)
}

/**
 * Helper function to download a specific export format
 * Finds the format card and clicks the Download button within that card
 */
export async function downloadSelectedFormat(page: Page, format: 'Plain Text' | 'SRT' | 'WebVTT' | 'JSON' | 'CSV') {
  // Find the parent div that contains this format name and has cursor-pointer class
  const formatCard = page.locator('div.cursor-pointer').filter({ hasText: format })

  // Within that card, find and click the Download button
  const downloadButton = formatCard.locator('button').filter({ hasText: /^Download$/ })
  await downloadButton.click()
}

/**
 * Helper function to open API settings modal with proper waiting
 */
export async function openApiSettings(page: Page) {
  await page.click('button:has-text("Configure API"), button:has-text("API Configured")')
  // Wait for the modal heading to appear (Radix UI dialog with animation)
  await page.waitForSelector('text=API Configuration', { timeout: 15000, state: 'visible' })
  // Extra wait for animations to complete
  await page.waitForTimeout(300)
}

/**
 * Helper function to configure API settings
 */
export async function configureApiSettings(page: Page, apiKey: string, mode: 'free' | 'paid' = 'free') {
  // Open API settings with proper waiting
  await openApiSettings(page)

  // Select mode
  if (mode === 'paid') {
    await page.click('text=Paid Mode')
  } else {
    await page.click('text=Free Mode')
  }

  // Enter API key
  await page.fill('input[placeholder*="API"]', apiKey)

  // Save
  await page.click('button', { hasText: 'Save' })

  // Wait for modal to close
  await page.waitForSelector('text=API Configuration', { state: 'hidden' })
}
