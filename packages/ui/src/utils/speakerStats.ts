import type { TranscriptEntry, Speaker } from '@transcript-parser/types'

export interface SpeakerStats {
  speaker: Speaker
  segmentCount: number
  totalDuration: number
  percentage: number
}

/**
 * Calculate statistics for each speaker in the transcript
 */
export function calculateSpeakerStats(
  entries: TranscriptEntry[],
  speakers: Speaker[]
): SpeakerStats[] {
  // Calculate total transcript duration
  const totalDuration = entries.reduce((total, entry) => {
    return total + (entry.endTime - entry.startTime)
  }, 0)

  // Calculate stats for each speaker
  const statsMap = new Map<
    number,
    { segmentCount: number; totalDuration: number }
  >()

  entries.forEach(entry => {
    const duration = entry.endTime - entry.startTime
    const existing = statsMap.get(entry.speakerNumber) || {
      segmentCount: 0,
      totalDuration: 0,
    }

    statsMap.set(entry.speakerNumber, {
      segmentCount: existing.segmentCount + 1,
      totalDuration: existing.totalDuration + duration,
    })
  })

  // Convert to SpeakerStats array
  return speakers
    .map(speaker => {
      const stats = statsMap.get(speaker.id) || {
        segmentCount: 0,
        totalDuration: 0,
      }

      return {
        speaker,
        segmentCount: stats.segmentCount,
        totalDuration: stats.totalDuration,
        percentage:
          totalDuration > 0 ? (stats.totalDuration / totalDuration) * 100 : 0,
      }
    })
    .sort((a, b) => b.totalDuration - a.totalDuration) // Sort by duration descending
}

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  }
  return `${minutes}m ${secs}s`
}
