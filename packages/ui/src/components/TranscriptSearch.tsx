import { useState, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useDebounce } from '../hooks/useDebounce'

interface TranscriptSearchProps {
  onSearchChange: (query: string) => void
  resultCount?: number
}

export function TranscriptSearch({
  onSearchChange,
  resultCount,
}: TranscriptSearchProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleClear = useCallback(() => {
    setSearchValue('')
    onSearchChange('')
  }, [onSearchChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    onSearchChange(value)
  }

  return (
    <div className="relative w-full" role="search">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search transcript..."
          value={searchValue}
          onChange={handleInputChange}
          className="pl-10 pr-20"
          aria-label="Search transcript"
          aria-describedby={resultCount !== undefined ? 'search-results' : undefined}
        />
        {searchValue && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            {resultCount !== undefined && (
              <span
                id="search-results"
                className="text-xs text-muted-foreground px-2"
                aria-live="polite"
              >
                {resultCount} {resultCount === 1 ? 'result' : 'results'}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
