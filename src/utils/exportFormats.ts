import type { TranscriptEntry } from '@/types/transcript'

/**
 * Format timestamp for display (MM:SS or HH:MM:SS)
 */
export function formatTime(seconds: number, useHours: boolean = false): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (useHours || hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Format timestamp for SRT/VTT (HH:MM:SS,mmm or HH:MM:SS.mmm)
 */
export function formatSrtTime(
  seconds: number,
  separator: ',' | '.' = ','
): string {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}${separator}${ms.toString().padStart(3, '0')}`
}

export interface ExportOptions {
  includeTimestamps?: boolean
  includeSpeakers?: boolean
  includeConfidence?: boolean
  timeFormat?: 'short' | 'long' // MM:SS vs HH:MM:SS
}

/**
 * Export to plain text format
 */
export function toPlainText(
  entries: TranscriptEntry[],
  options: ExportOptions = {}
): string {
  const {
    includeTimestamps = true,
    includeSpeakers = true,
    includeConfidence = false,
    timeFormat = 'short',
  } = options

  return entries
    .map(entry => {
      let line = ''

      if (includeTimestamps) {
        const start = formatTime(entry.startTime, timeFormat === 'long')
        const end = formatTime(entry.endTime, timeFormat === 'long')
        line += `[${start} - ${end}] `
      }

      if (includeSpeakers) {
        line += `${entry.speaker}: `
      }

      line += entry.text

      if (includeConfidence && entry.confidence) {
        line += ` (${Math.round(entry.confidence * 100)}%)`
      }

      return line
    })
    .join('\n\n')
}

/**
 * Export to SRT subtitle format
 */
export function toSRT(
  entries: TranscriptEntry[],
  options: ExportOptions = {}
): string {
  const { includeSpeakers = true } = options

  return entries
    .map((entry, index) => {
      const lines = []

      // Sequence number
      lines.push((index + 1).toString())

      // Timestamp
      const start = formatSrtTime(entry.startTime, ',')
      const end = formatSrtTime(entry.endTime, ',')
      lines.push(`${start} --> ${end}`)

      // Text (optionally with speaker)
      const text = includeSpeakers ? `${entry.speaker}: ${entry.text}` : entry.text
      lines.push(text)

      // Blank line separator
      lines.push('')

      return lines.join('\n')
    })
    .join('\n')
}

/**
 * Export to WebVTT subtitle format
 */
export function toVTT(
  entries: TranscriptEntry[],
  options: ExportOptions = {}
): string {
  const { includeSpeakers = true } = options

  const lines = ['WEBVTT', '', '']

  entries.forEach((entry, index) => {
    // Cue identifier (optional but recommended)
    lines.push((index + 1).toString())

    // Timestamp
    const start = formatSrtTime(entry.startTime, '.')
    const end = formatSrtTime(entry.endTime, '.')
    lines.push(`${start} --> ${end}`)

    // Text with optional speaker tag
    if (includeSpeakers) {
      lines.push(`<v ${entry.speaker}>${entry.text}</v>`)
    } else {
      lines.push(entry.text)
    }

    // Blank line separator
    lines.push('')
  })

  return lines.join('\n')
}

/**
 * Export to JSON format
 */
export function toJSON(
  entries: TranscriptEntry[],
  options: ExportOptions = {}
): string {
  const { includeConfidence = true } = options

  const data = entries.map(entry => {
    const item: any = {
      id: entry.id,
      speaker: entry.speaker,
      speakerNumber: entry.speakerNumber,
      startTime: entry.startTime,
      endTime: entry.endTime,
      text: entry.text,
    }

    if (includeConfidence && entry.confidence !== undefined) {
      item.confidence = entry.confidence
    }

    return item
  })

  return JSON.stringify(data, null, 2)
}

/**
 * Export to CSV format
 */
export function toCSV(
  entries: TranscriptEntry[],
  options: ExportOptions = {}
): string {
  const { includeConfidence = true, timeFormat = 'short' } = options

  // CSV Header
  const headers = includeConfidence
    ? ['ID', 'Speaker', 'Start Time', 'End Time', 'Text', 'Confidence']
    : ['ID', 'Speaker', 'Start Time', 'End Time', 'Text']

  const rows = [headers]

  // CSV Rows
  entries.forEach(entry => {
    const row = [
      entry.id,
      entry.speaker,
      formatTime(entry.startTime, timeFormat === 'long'),
      formatTime(entry.endTime, timeFormat === 'long'),
      `"${entry.text.replace(/"/g, '""')}"`, // Escape quotes in text
    ]

    if (includeConfidence) {
      row.push(
        entry.confidence !== undefined
          ? Math.round(entry.confidence * 100).toString() + '%'
          : ''
      )
    }

    rows.push(row)
  })

  return rows.map(row => row.join(',')).join('\n')
}

/**
 * Download file helper
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Copy to clipboard helper
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}
