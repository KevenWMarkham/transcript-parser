import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import fs from 'fs/promises'

export async function extractAudio(videoPath: string, outputDir: string): Promise<string> {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true })

  const audioPath = path.join(outputDir, `${path.basename(videoPath, path.extname(videoPath))}.mp3`)

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .audioChannels(1)
      .audioFrequency(16000)
      .on('end', () => resolve(audioPath))
      .on('error', (err) => {
        console.error('FFmpeg error:', err)
        reject(err)
      })
      .on('progress', (progress) => {
        console.log(`Processing: ${progress.percent}% done`)
      })
      .run()
  })
}

export async function getVideoDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('FFprobe error:', err)
        return reject(err)
      }
      resolve(metadata.format.duration || 0)
    })
  })
}

export async function getAudioInfo(audioPath: string): Promise<{
  duration: number
  size: number
  format: string
}> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, async (err, metadata) => {
      if (err) {
        console.error('FFprobe error:', err)
        return reject(err)
      }

      const stats = await fs.stat(audioPath)

      resolve({
        duration: metadata.format.duration || 0,
        size: stats.size,
        format: metadata.format.format_name || 'unknown'
      })
    })
  })
}
