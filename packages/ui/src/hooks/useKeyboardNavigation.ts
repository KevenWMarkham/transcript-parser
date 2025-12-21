import { useEffect, useState, useCallback, useRef } from 'react'

export interface KeyboardNavigationOptions {
  itemCount: number
  onSelect?: (index: number) => void
  onSearch?: () => void
  onEscape?: () => void
  enabled?: boolean
}

export interface KeyboardNavigationState {
  selectedIndex: number
  setSelectedIndex: (index: number) => void
  handleKeyDown: (event: KeyboardEvent) => void
}

/**
 * Hook for keyboard navigation through a list of items
 * @param options Configuration options
 * @returns Navigation state and handlers
 */
export function useKeyboardNavigation({
  itemCount,
  onSelect,
  onSearch,
  onEscape,
  enabled = true,
}: KeyboardNavigationOptions): KeyboardNavigationState {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const selectedIndexRef = useRef(selectedIndex)

  // Keep ref in sync with state for event handlers
  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || itemCount === 0) return

      const currentIndex = selectedIndexRef.current

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex < itemCount - 1) {
            const newIndex = currentIndex + 1
            setSelectedIndex(newIndex)
            onSelect?.(newIndex)
          }
          break

        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex > 0) {
            const newIndex = currentIndex - 1
            setSelectedIndex(newIndex)
            onSelect?.(newIndex)
          } else if (currentIndex === -1 && itemCount > 0) {
            // If nothing selected, select last item when pressing up
            const newIndex = itemCount - 1
            setSelectedIndex(newIndex)
            onSelect?.(newIndex)
          }
          break

        case 'Home':
          event.preventDefault()
          if (itemCount > 0) {
            setSelectedIndex(0)
            onSelect?.(0)
          }
          break

        case 'End':
          event.preventDefault()
          if (itemCount > 0) {
            const newIndex = itemCount - 1
            setSelectedIndex(newIndex)
            onSelect?.(newIndex)
          }
          break

        case 'f':
          // Ctrl+F or Cmd+F
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault()
            onSearch?.()
          }
          break

        case 'Escape':
          event.preventDefault()
          setSelectedIndex(-1)
          onEscape?.()
          break

        default:
          break
      }
    },
    [enabled, itemCount, onSelect, onSearch, onEscape]
  )

  // Add keyboard event listener
  useEffect(() => {
    if (!enabled) return

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  // Reset selection when item count changes significantly
  useEffect(() => {
    if (selectedIndex >= itemCount && itemCount > 0) {
      setSelectedIndex(itemCount - 1)
    } else if (itemCount === 0) {
      setSelectedIndex(-1)
    }
  }, [itemCount, selectedIndex])

  return {
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,
  }
}
