import { test, expect } from '@playwright/test'
import path from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'

test('video thumbnail generation', async ({ page }) => {
  // Collect all console messages for debugging
  const consoleMessages: string[] = []
  page.on('console', msg => {
    const text = `[${msg.type()}] ${msg.text()}`
    consoleMessages.push(text)
    console.log(`Browser console: ${text}`)
  })

  // Navigate to the app
  await page.goto('http://localhost:5174')
  await page.waitForLoadState('networkidle')

  console.log('Page loaded, taking initial screenshot...')
  await page.screenshot({ path: 'test-results/01-initial-page.png', fullPage: true })

  // Generate a test video using page.evaluate to create it in the browser context
  // and then download it for upload
  const buffer = await page.evaluate(async () => {
    return new Promise<number[]>((resolve) => {
      const canvas = document.createElement('canvas')
      canvas.width = 640
      canvas.height = 480
      const ctx = canvas.getContext('2d')!

      // Draw a RED rectangle with white text - this will be our thumbnail
      ctx.fillStyle = '#FF0000'
      ctx.fillRect(0, 0, 640, 480)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 48px Arial'
      ctx.fillText('RED TEST FRAME', 150, 240)

      const stream = canvas.captureStream(25)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8'
      })

      const chunks: Blob[] = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const arrayBuffer = await blob.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)
        resolve(Array.from(uint8Array))
      }

      mediaRecorder.start()
      setTimeout(() => {
        mediaRecorder.stop()
      }, 1000)
    })
  })

  // Write the video file to disk
  const fixturesDir = path.join(process.cwd(), 'tests', 'fixtures')
  if (!existsSync(fixturesDir)) {
    mkdirSync(fixturesDir, { recursive: true })
  }
  const videoPath = path.join(fixturesDir, 'test-video.webm')
  writeFileSync(videoPath, Buffer.from(buffer))

  console.log('Test video created at:', videoPath)

  // Upload the video file using Playwright's setInputFiles
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles(videoPath)

  console.log('File uploaded, waiting for processing...')

  // Wait for video preview to appear
  await page.waitForSelector('video[data-testid="video-preview-player"]', { timeout: 10000 })

  // Take screenshot after upload
  await page.screenshot({ path: 'test-results/02-after-upload.png', fullPage: true })

  // Check if video element exists
  const videoElement = page.locator('video[data-testid="video-preview-player"]')
  const videoExists = await videoElement.count() > 0
  console.log('Video element exists:', videoExists)

  if (videoExists) {
    // Wait for video to load metadata
    await page.waitForTimeout(2000)

    // Get video element properties
    const videoInfo = await videoElement.evaluate((video: HTMLVideoElement) => {
      return {
        src: video.src,
        poster: video.poster,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        duration: video.duration,
        readyState: video.readyState,
        currentTime: video.currentTime,
        preload: video.preload,
        hasAttribute_poster: video.hasAttribute('poster'),
        networkState: video.networkState
      }
    })

    console.log('Video element info:', JSON.stringify(videoInfo, null, 2))

    // Check if poster was generated
    if (videoInfo.poster) {
      console.log('✓ Poster URL exists:', videoInfo.poster)
    } else {
      console.log('✗ No poster URL set on video element')
    }

    // Wait a bit more for poster generation
    console.log('Waiting for poster generation...')
    await page.waitForTimeout(3000)

    // Check again after waiting
    const finalVideoInfo = await videoElement.evaluate((video: HTMLVideoElement) => {
      return {
        poster: video.poster,
        hasAttribute_poster: video.hasAttribute('poster')
      }
    })

    console.log('Final video info:', JSON.stringify(finalVideoInfo, null, 2))

    // Take a screenshot of just the video element
    await videoElement.screenshot({ path: 'test-results/03-video-element.png' })
  }

  // Print all collected console messages
  console.log('\n=== All Console Messages ===')
  consoleMessages.forEach(msg => console.log(msg))

  // Final screenshot
  await page.screenshot({ path: 'test-results/04-final.png', fullPage: true })

  // Assertions
  expect(videoExists).toBe(true)

  console.log('\nTest complete. Check test-results/ folder for screenshots.')
})
