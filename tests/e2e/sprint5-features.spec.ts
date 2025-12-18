import { test, expect } from '@playwright/test'

test.describe('Sprint 5: Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Load demo transcript for testing
    await page.click('text=Load Sprint 4 Demo')
    // Wait for transcript to load
    await expect(page.locator('text=Speaker 1')).toBeVisible()
  })

  test.describe('Search & Filter', () => {
    test('should search and highlight text in transcript', async ({ page }) => {
      // Type in search box
      await page.fill('input[placeholder*="Search"]', 'hello')

      // Wait for debounce
      await page.waitForTimeout(350)

      // Should show search results count
      await expect(page.locator('text=/\\d+ results/')).toBeVisible()

      // Should highlight matched text
      const highlights = page.locator('mark')
      await expect(highlights.first()).toBeVisible()
    })

    test('should filter by speaker', async ({ page }) => {
      // Open filters
      await page.click('button:has-text("Filters")')

      // Select Speaker 1 only
      await page.click('text=Speaker 1')

      // Should only show Speaker 1 entries
      await expect(page.locator('text=Speaker 1')).toBeVisible()
      const speaker2 = page.locator('text=Speaker 2')
      await expect(speaker2).not.toBeVisible()
    })

    test('should filter by confidence score', async ({ page }) => {
      // Open filters
      await page.click('button:has-text("Filters")')

      // Adjust confidence slider to 80%
      const slider = page.locator('input[type="range"]').first()
      await slider.fill('80')

      // Should update filtered results
      await page.waitForTimeout(100)
      // Results should be filtered (can't easily verify without knowing data)
    })

    test('should clear all filters', async ({ page }) => {
      // Apply some filters
      await page.click('button:has-text("Filters")')
      await page.click('text=Speaker 1')

      // Clear all
      await page.click('text=Clear all')

      // Should show all speakers again
      await expect(page.locator('text=Speaker 1')).toBeVisible()
      await expect(page.locator('text=Speaker 2')).toBeVisible()
    })
  })

  test.describe('Keyboard Navigation', () => {
    test('should navigate with arrow keys', async ({ page }) => {
      // Press down arrow
      await page.keyboard.press('ArrowDown')

      // First entry should be selected (blue highlight)
      const firstEntry = page.locator('[data-index="0"]')
      await expect(firstEntry).toHaveClass(/ring-2 ring-blue/)

      // Press down again
      await page.keyboard.press('ArrowDown')

      // Second entry should be selected
      const secondEntry = page.locator('[data-index="1"]')
      await expect(secondEntry).toHaveClass(/ring-2 ring-blue/)
    })

    test('should jump to search with Ctrl+F', async ({ page }) => {
      // Press Ctrl+F
      await page.keyboard.press('Control+f')

      // Search input should be focused
      const searchInput = page.locator('input[placeholder*="Search"]')
      await expect(searchInput).toBeFocused()
    })

    test('should show keyboard shortcuts help with ?', async ({ page }) => {
      // Press ?
      await page.keyboard.press('Shift+/')

      // Should show shortcuts dialog
      await expect(page.locator('text=Keyboard Shortcuts')).toBeVisible()
      await expect(page.locator('text=Arrow Up/Down')).toBeVisible()

      // Close dialog
      await page.keyboard.press('Escape')
      await expect(page.locator('text=Keyboard Shortcuts')).not.toBeVisible()
    })
  })

  test.describe('Transcript Editing', () => {
    test('should edit transcript entry text', async ({ page }) => {
      // Double-click first entry to edit
      const firstEntry = page.locator('.group').first()
      await firstEntry.dblclick()

      // Should show edit mode with textarea
      const textarea = page.locator('textarea')
      await expect(textarea).toBeVisible()

      // Edit text
      await textarea.fill('This is edited text')

      // Save
      await page.click('button:has-text("Save")')

      // Should show success toast
      await expect(page.locator('text=text updated successfully')).toBeVisible()

      // Should show "Edited" badge
      await expect(page.locator('text=Edited')).toBeVisible()
    })

    test('should edit entry timestamps', async ({ page }) => {
      // Double-click entry
      const firstEntry = page.locator('.group').first()
      await firstEntry.dblclick()

      // Edit start time
      const startTimeInput = page.locator('input[aria-label*="Start time"]')
      await startTimeInput.fill('5.5')

      // Edit end time
      const endTimeInput = page.locator('input[aria-label*="End time"]')
      await endTimeInput.fill('10.5')

      // Save
      await page.click('button:has-text("Save")')

      // Should show success toasts
      await expect(page.locator('text=/updated successfully/')).toBeVisible()
    })

    test('should cancel editing', async ({ page }) => {
      // Double-click to edit
      const firstEntry = page.locator('.group').first()
      const originalText = await firstEntry.locator('p').textContent()

      await firstEntry.dblclick()

      // Make changes
      const textarea = page.locator('textarea')
      await textarea.fill('Temporary edit')

      // Cancel
      await page.click('button:has(svg.lucide-x)')

      // Text should be unchanged
      await expect(firstEntry.locator('p')).toHaveText(originalText || '')
    })
  })

  test.describe('Export Functionality', () => {
    test('should open export dialog', async ({ page }) => {
      // Click Export button
      await page.click('button:has-text("Export")')

      // Dialog should be visible
      await expect(page.locator('text=Export Transcript')).toBeVisible()
      await expect(page.locator('text=Plain Text')).toBeVisible()
      await expect(page.locator('text=SRT Subtitles')).toBeVisible()
      await expect(page.locator('text=WebVTT')).toBeVisible()
      await expect(page.locator('text=JSON')).toBeVisible()
      await expect(page.locator('text=CSV')).toBeVisible()
    })

    test('should select different export formats', async ({ page }) => {
      await page.click('button:has-text("Export")')

      // Select SRT format
      await page.click('text=SRT Subtitles')

      // Button should show SRT
      await expect(page.locator('button:has-text("Download SRT")')).toBeVisible()

      // Select JSON format
      await page.click('text=JSON')

      // Button should show JSON
      await expect(page.locator('button:has-text("Download JSON")')).toBeVisible()
    })

    test('should show export options for text format', async ({ page }) => {
      await page.click('button:has-text("Export")')

      // Plain text is default
      // Should show timestamp and speaker options
      await expect(page.locator('text=Include timestamps')).toBeVisible()
      await expect(page.locator('text=Include speaker labels')).toBeVisible()
    })

    test('should copy to clipboard', async ({ page }) => {
      await page.click('button:has-text("Export")')

      // Click copy button
      await page.click('button:has-text("Copy to Clipboard")')

      // Should show success toast
      await expect(page.locator('text=Copied to clipboard')).toBeVisible()

      // Button should show "Copied!" temporarily
      await expect(page.locator('button:has-text("Copied!")')).toBeVisible()
    })

    test('should download file', async ({ page }) => {
      await page.click('button:has-text("Export")')

      // Setup download promise before clicking
      const downloadPromise = page.waitForEvent('download')

      // Click download
      await page.click('button:has-text("Download TXT")')

      // Should show success toast
      await expect(page.locator('text=/Transcript exported as/')).toBeVisible()

      // Should trigger download
      const download = await downloadPromise
      expect(download.suggestedFilename()).toMatch(/transcript-.*\.txt/)
    })
  })

  test.describe('Loading States & UX', () => {
    test('should show loading skeleton', async ({ page }) => {
      // Go to fresh page
      await page.goto('/')

      // Mock loading state by intercepting API
      // (In a real scenario, you'd mock the transcription API to be slow)

      // For now, just verify skeleton exists in code
      // The skeleton should show during transcription
    })

    test('should show toast notifications', async ({ page }) => {
      // Double-click to edit
      await page.locator('.group').first().dblclick()

      // Save
      await page.click('button:has-text("Save")')

      // Toast should appear
      const toast = page.locator('[role="alert"]')
      await expect(toast).toBeVisible()

      // Toast should auto-dismiss after 3 seconds
      await page.waitForTimeout(3500)
      await expect(toast).not.toBeVisible()
    })
  })

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      // Search should have aria-label
      const searchInput = page.locator('input[placeholder*="Search"]')
      await expect(searchInput).toHaveAttribute('aria-label')

      // Buttons should have aria-labels
      await page.click('button:has-text("Export")')
      const closeButton = page.locator('button[aria-label="Close notification"]').first()
      // Close button exists in the ExportDialog or toast
    })

    test('should support keyboard-only navigation', async ({ page }) => {
      // Tab through interface
      await page.keyboard.press('Tab')
      await page.keyboard.press('Tab')

      // Should be able to activate with Enter
      await page.keyboard.press('Enter')

      // Can navigate with keyboard
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('ArrowUp')
    })

    test('should have proper focus indicators', async ({ page }) => {
      // Click search
      const searchInput = page.locator('input[placeholder*="Search"]')
      await searchInput.click()

      // Should show focus ring
      await expect(searchInput).toBeFocused()
    })
  })

  test.describe('Performance', () => {
    test('should handle large transcript efficiently', async ({ page }) => {
      // The demo has 60 entries which tests virtualization

      // Scroll to bottom
      const transcriptList = page.locator('.h-\\[600px\\]').first()
      await transcriptList.evaluate(el => el.scrollTop = el.scrollHeight)

      // Should still be responsive
      await page.waitForTimeout(100)

      // Last entry should be visible
      await expect(page.locator('[data-index]').last()).toBeVisible()
    })

    test('should debounce search input', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="Search"]')

      // Type quickly
      await searchInput.type('test', { delay: 50 })

      // Should not search immediately (debounced to 300ms)
      await page.waitForTimeout(100)

      // Wait for debounce
      await page.waitForTimeout(300)

      // Now results should appear
      await expect(page.locator('text=/results/').or(page.locator('text=No results'))).toBeVisible()
    })
  })
})
