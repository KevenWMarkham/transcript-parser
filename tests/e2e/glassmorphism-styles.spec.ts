import { test, expect } from '@playwright/test'

test.describe('Sprint 6: Glassmorphism Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5174/')
  })

  test('should have gradient background on main container', async ({ page }) => {
    const mainDiv = page.locator('body > div > div').first()

    // Check for gradient background
    const background = await mainDiv.evaluate((el) => {
      return window.getComputedStyle(el).background
    })

    console.log('Main container background:', background)
    expect(background).toContain('linear-gradient')
  })

  test('should have glassmorphism effect on Card components', async ({ page }) => {
    // Wait for Header card to be visible
    const headerCard = page.locator('[class*="rounded-3xl"]').first()
    await expect(headerCard).toBeVisible()

    // Check backdrop-blur
    const backdropFilter = await headerCard.evaluate((el) => {
      return window.getComputedStyle(el).backdropFilter
    })

    console.log('Header card backdrop-filter:', backdropFilter)
    expect(backdropFilter).toContain('blur')
  })

  test('should have semi-transparent background on cards', async ({ page }) => {
    const headerCard = page.locator('[class*="rounded-3xl"]').first()
    await expect(headerCard).toBeVisible()

    const backgroundColor = await headerCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    console.log('Header card background-color:', backgroundColor)
    // Should be semi-transparent (rgba or oklab with alpha < 1)
    expect(backgroundColor).toMatch(/(?:rgba?\(.*,\s*0\.\d+\)|oklab\(.*\/\s*0\.\d+\))/)
  })

  test('should have gradient text on header title', async ({ page }) => {
    const title = page.locator('h1').filter({ hasText: 'Video Transcript Parser' })
    await expect(title).toBeVisible()

    const backgroundImage = await title.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage
    })

    const backgroundClip = await title.evaluate((el) => {
      return window.getComputedStyle(el).webkitBackgroundClip || window.getComputedStyle(el).backgroundClip
    })

    console.log('Title background-image:', backgroundImage)
    console.log('Title background-clip:', backgroundClip)

    expect(backgroundImage).toContain('linear-gradient')
    expect(backgroundClip).toBe('text')
  })

  test('should have gradient glow effect on header icon', async ({ page }) => {
    // The gradient icon container
    const iconGlow = page.locator('.absolute.inset-0.bg-gradient-to-br').first()
    await expect(iconGlow).toBeVisible()

    const backgroundImage = await iconGlow.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage
    })

    const filter = await iconGlow.evaluate((el) => {
      return window.getComputedStyle(el).filter
    })

    console.log('Icon glow background-image:', backgroundImage)
    console.log('Icon glow filter:', filter)

    expect(backgroundImage).toContain('linear-gradient')
    expect(filter).toContain('blur')
  })

  test('should have rounded-3xl corners on cards', async ({ page }) => {
    const headerCard = page.locator('[class*="rounded-3xl"]').first()
    await expect(headerCard).toBeVisible()

    const borderRadius = await headerCard.evaluate((el) => {
      return window.getComputedStyle(el).borderRadius
    })

    console.log('Card border-radius:', borderRadius)
    // rounded-3xl in Tailwind is 1.5rem = 24px
    expect(borderRadius).toContain('24px')
  })

  test('should have white border with transparency', async ({ page }) => {
    const headerCard = page.locator('[class*="rounded-3xl"]').first()
    await expect(headerCard).toBeVisible()

    const borderColor = await headerCard.evaluate((el) => {
      return window.getComputedStyle(el).borderColor
    })

    console.log('Card border-color:', borderColor)
    // Should be semi-transparent (rgba or oklab with alpha < 1)
    expect(borderColor).toMatch(/(?:rgba?\(.*,\s*0\.\d+\)|oklab\(.*\/\s*0\.\d+\))/)
  })

  test('should have smooth animations on header', async ({ page }) => {
    // Check that framer-motion animation classes are applied
    const motionDiv = page.locator('motion-div').or(page.locator('[style*="opacity"]')).first()

    // The element should start with opacity animation
    const style = await motionDiv.getAttribute('style')
    console.log('Motion div style:', style)

    // Wait a bit for animation to complete
    await page.waitForTimeout(500)

    // After animation, opacity should be 1
    const opacity = await motionDiv.evaluate((el) => {
      return window.getComputedStyle(el).opacity
    })

    console.log('Final opacity:', opacity)
    expect(parseFloat(opacity)).toBeCloseTo(1, 1)
  })

  test('should take screenshot for visual verification', async ({ page }) => {
    // Wait for all animations to complete
    await page.waitForTimeout(1000)

    // Take full page screenshot
    await page.screenshot({
      path: 'tests/e2e/screenshots/glassmorphism-design.png',
      fullPage: true
    })
  })
})
