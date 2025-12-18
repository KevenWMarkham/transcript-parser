import { useState, useCallback } from 'react'
import type { TranscriptEntry } from '@/types/transcript'

interface UseStreamingTranscriptReturn {
  entries: TranscriptEntry[]
  addEntry: (entry: TranscriptEntry) => void
  updateEntry: (id: string, updates: Partial<TranscriptEntry>) => void
  clearEntries: () => void
}

/**
 * Hook for managing streaming transcript entries with real-time updates
 */
export function useStreamingTranscript(): UseStreamingTranscriptReturn {
  const [entries, setEntries] = useState<TranscriptEntry[]>([])

  const addEntry = useCallback((entry: TranscriptEntry) => {
    setEntries(prevEntries => [...prevEntries, entry])
  }, [])

  const updateEntry = useCallback(
    (id: string, updates: Partial<TranscriptEntry>) => {
      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      )
    },
    []
  )

  const clearEntries = useCallback(() => {
    setEntries([])
  }, [])

  return {
    entries,
    addEntry,
    updateEntry,
    clearEntries,
  }
}
