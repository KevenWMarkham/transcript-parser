/**
 * Speaker color palette and utility functions
 * Centralized color management for consistent speaker identification
 */

export const SPEAKER_COLORS = [
  'blue',
  'emerald',
  'purple',
  'orange',
  'pink',
  'cyan',
] as const

export type SpeakerColor = (typeof SPEAKER_COLORS)[number]

// Tailwind color class mappings for speaker badges
export const SPEAKER_COLOR_CLASSES: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  emerald:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  purple:
    'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  orange:
    'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300 border-pink-200 dark:border-pink-800',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
}

// Tailwind color classes for speaker dots
export const SPEAKER_DOT_CLASSES: Record<string, string> = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  cyan: 'bg-cyan-500',
}

/**
 * Get speaker color class for badges
 */
export function getSpeakerColorClasses(color: string): string {
  return SPEAKER_COLOR_CLASSES[color] || SPEAKER_COLOR_CLASSES.blue
}

/**
 * Get speaker dot color class
 */
export function getSpeakerDotClasses(color: string): string {
  return SPEAKER_DOT_CLASSES[color] || SPEAKER_DOT_CLASSES.blue
}

/**
 * Assign color to speaker based on their ID
 */
export function assignSpeakerColor(speakerId: number): SpeakerColor {
  return SPEAKER_COLORS[(speakerId - 1) % SPEAKER_COLORS.length]
}
