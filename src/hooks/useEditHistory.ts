import { useState, useCallback } from 'react'

export interface EditHistoryEntry {
  entryId: string
  field: 'text' | 'speaker' | 'startTime' | 'endTime'
  oldValue: any
  newValue: any
  timestamp: string
}

const MAX_HISTORY_SIZE = 100

export interface UseEditHistoryReturn {
  history: EditHistoryEntry[]
  addEdit: (edit: Omit<EditHistoryEntry, 'timestamp'>) => void
  undo: () => EditHistoryEntry | null
  redo: () => EditHistoryEntry | null
  canUndo: boolean
  canRedo: boolean
  clearHistory: () => void
  getEditsForEntry: (entryId: string) => EditHistoryEntry[]
}

/**
 * Hook for managing edit history with undo/redo functionality
 * @returns Edit history state and methods
 */
export function useEditHistory(): UseEditHistoryReturn {
  const [history, setHistory] = useState<EditHistoryEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const addEdit = useCallback(
    (edit: Omit<EditHistoryEntry, 'timestamp'>) => {
      const newEdit: EditHistoryEntry = {
        ...edit,
        timestamp: new Date().toISOString(),
      }

      setHistory(prev => {
        // Remove any history after current index (we're creating a new branch)
        const newHistory = prev.slice(0, currentIndex + 1)

        // Add new edit
        newHistory.push(newEdit)

        // Limit history size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(-MAX_HISTORY_SIZE)
        }

        return newHistory
      })

      setCurrentIndex(prev => {
        const newIndex = prev + 1
        return Math.min(newIndex, MAX_HISTORY_SIZE - 1)
      })
    },
    [currentIndex]
  )

  const undo = useCallback((): EditHistoryEntry | null => {
    if (currentIndex < 0) return null

    const edit = history[currentIndex]
    setCurrentIndex(prev => prev - 1)
    return edit
  }, [currentIndex, history])

  const redo = useCallback((): EditHistoryEntry | null => {
    if (currentIndex >= history.length - 1) return null

    const edit = history[currentIndex + 1]
    setCurrentIndex(prev => prev + 1)
    return edit
  }, [currentIndex, history])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  const getEditsForEntry = useCallback(
    (entryId: string): EditHistoryEntry[] => {
      return history.filter(edit => edit.entryId === entryId)
    },
    [history]
  )

  return {
    history: history.slice(0, currentIndex + 1), // Only return history up to current index
    addEdit,
    undo,
    redo,
    canUndo: currentIndex >= 0,
    canRedo: currentIndex < history.length - 1,
    clearHistory,
    getEditsForEntry,
  }
}
