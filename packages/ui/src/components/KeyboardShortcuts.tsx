import { useEffect, useState } from 'react'
import { Keyboard, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'

interface ShortcutGroup {
  title: string
  shortcuts: Array<{
    keys: string[]
    description: string
  }>
}

const shortcutGroups: ShortcutGroup[] = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['↑', '↓'], description: 'Navigate through entries' },
      { keys: ['Home'], description: 'Jump to first entry' },
      { keys: ['End'], description: 'Jump to last entry' },
    ],
  },
  {
    title: 'Search',
    shortcuts: [
      { keys: ['Ctrl', 'F'], description: 'Focus search' },
      { keys: ['Esc'], description: 'Clear search and deselect' },
    ],
  },
  {
    title: 'Help',
    shortcuts: [{ keys: ['?'], description: 'Show keyboard shortcuts' }],
  },
]

export function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show help when ? is pressed (Shift + /)
      if (event.key === '?' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {/* Trigger button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
        aria-label="Show keyboard shortcuts"
      >
        <Keyboard className="w-4 h-4" />
        <span className="hidden sm:inline">Shortcuts</span>
      </Button>

      {/* Help dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {shortcutGroups.map(group => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  {group.title}
                </h3>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <span key={keyIndex} className="flex items-center">
                            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-xs text-muted-foreground">
                                +
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
