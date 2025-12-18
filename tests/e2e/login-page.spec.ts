import { test } from '@playwright/test'

test('Login page screenshot', async ({ page }) => {
  await page.goto('http://localhost:5174/')

  // Click the Login / Register button
  await page.click('text=Login / Register')

  // Wait for animations to complete
  await page.waitForTimeout(1000)

  // Take screenshot
  await page.screenshot({
    path: 'tests/e2e/screenshots/login-page.png',
    fullPage: true
  })
})
