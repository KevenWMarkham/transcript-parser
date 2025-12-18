import { test, expect } from '@playwright/test'

test.describe('Sprint 6: Cost Summary Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174/')
  })

  test('should show Summary button when authenticated', async ({ page }) => {
    // Click login button
    await page.click('text=Login / Register')

    // Wait for login page to load
    await page.waitForSelector('input[type="email"]')

    // Fill in demo credentials
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')

    // Click sign in button
    await page.click('button[type="submit"]')

    // Wait for main page to load
    await page.waitForSelector('text=Summary', { timeout: 5000 })

    // Verify Summary button is visible
    const summaryButton = page.locator('button:has-text("Summary")')
    await expect(summaryButton).toBeVisible()
  })

  test('should open cost summary modal when clicking Summary button', async ({ page }) => {
    // Login first
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })

    // Click Summary button
    await page.click('button:has-text("Summary")')

    // Wait for modal to appear
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Verify modal title is visible
    const modalTitle = page.locator('h2:has-text("Token Usage & Cost Summary")')
    await expect(modalTitle).toBeVisible()
  })

  test('should display usage metrics in the modal', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Verify metrics cards are visible
    await expect(page.locator('text=Total Tokens')).toBeVisible()
    await expect(page.locator('text=Total Cost')).toBeVisible()
    await expect(page.locator('text=Operations')).toBeVisible()
    await expect(page.locator('text=Avg Cost')).toBeVisible()
  })

  test('should display breakdown by model', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Verify "By Model" section exists
    await expect(page.locator('text=By Model')).toBeVisible()
    await expect(page.locator('text=gemini-2.5-flash')).toBeVisible()
  })

  test('should display breakdown by operation', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Verify "By Operation" section exists
    await expect(page.locator('text=By Operation')).toBeVisible()
    await expect(page.locator('text=Transcribe Video')).toBeVisible()
    await expect(page.locator('text=Speaker Diarization')).toBeVisible()
  })

  test('should close modal when clicking Close button', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Click Close button
    await page.click('button:has-text("Close")')

    // Wait a bit for modal to close
    await page.waitForTimeout(500)

    // Verify modal is no longer visible
    await expect(page.locator('text=Token Usage & Cost Summary')).not.toBeVisible()
  })

  test('should have glassmorphism styling on modal', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Find the modal dialog content
    const modalContent = page.locator('[role="dialog"]').first()

    // Check for backdrop-blur
    const backdropFilter = await modalContent.evaluate((el) => {
      return window.getComputedStyle(el).backdropFilter
    })

    console.log('Modal backdrop-filter:', backdropFilter)
    expect(backdropFilter).toContain('blur')
  })

  test('should take screenshot of cost summary modal', async ({ page }) => {
    // Login and open modal
    await page.click('text=Login / Register')
    await page.waitForSelector('input[type="email"]')
    await page.fill('input[type="email"]', 'demo@example.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button[type="submit"]')
    await page.waitForSelector('text=Summary', { timeout: 5000 })
    await page.click('button:has-text("Summary")')
    await page.waitForSelector('text=Token Usage & Cost Summary', { timeout: 3000 })

    // Wait for animations to complete
    await page.waitForTimeout(1000)

    // Take screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/cost-summary-modal.png',
      fullPage: true
    })
  })
})
