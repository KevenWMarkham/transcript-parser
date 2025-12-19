import { memo, useState } from 'react'
import { Clock, Check, Edit2, Save, X, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { formatTimestamp } from '@/utils/fileUtils'
import { highlightText } from '@/utils/textHighlight'
import type { TranscriptEntry as TranscriptEntryType } from '@/types/transcript'

interface TranscriptEntryProps {
  entry: TranscriptEntryType
  speakerColor: string
  speakerName?: string
  searchQuery?: string
  isEdited?: boolean
  onEdit?: (
    entryId: string,
    field: 'text' | 'startTime' | 'endTime',
    value: string | number
  ) => void
  enableEditing?: boolean
}

export const TranscriptEntry = memo(function TranscriptEntry({
  entry,
  speakerColor,
  speakerName,
  searchQuery,
  isEdited = false,
  onEdit,
  enableEditing = false,
}: TranscriptEntryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(entry.text)
  const [editedStartTime, setEditedStartTime] = useState(
    entry.startTime.toString()
  )
  const [editedEndTime, setEditedEndTime] = useState(entry.endTime.toString())

  const handleSave = () => {
    if (!onEdit) return

    // Validate and save changes
    if (editedText.trim() !== entry.text) {
      onEdit(entry.id, 'text', editedText.trim())
    }

    const startTime = parseFloat(editedStartTime)
    const endTime = parseFloat(editedEndTime)

    if (!isNaN(startTime) && startTime !== entry.startTime) {
      onEdit(entry.id, 'startTime', startTime)
    }

    if (!isNaN(endTime) && endTime !== entry.endTime) {
      onEdit(entry.id, 'endTime', endTime)
    }

    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedText(entry.text)
    setEditedStartTime(entry.startTime.toString())
    setEditedEndTime(entry.endTime.toString())
    setIsEditing(false)
  }

  const handleDoubleClick = () => {
    if (enableEditing) {
      setIsEditing(true)
    }
  }

  const getDotColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      emerald: 'bg-emerald-500',
      purple: 'bg-purple-500',
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div
      className="backdrop-blur-sm bg-white/60 rounded-2xl p-4 border border-white/80 hover:bg-white/80 transition-all duration-300 relative group"
      onDoubleClick={handleDoubleClick}
    >
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-slate-800 border border-blue-200/50">
          <span
            className={`w-2 h-2 rounded-full mr-2 ${getDotColorClasses(speakerColor)}`}
          ></span>
          {speakerName || entry.speaker}
        </span>

        {isEditing ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Start:</span>
            <Input
              type="number"
              step="0.1"
              value={editedStartTime}
              onChange={e => setEditedStartTime(e.target.value)}
              className="w-20 h-7 text-xs"
              aria-label="Start time in seconds"
            />
            <span className="text-muted-foreground">End:</span>
            <Input
              type="number"
              step="0.1"
              value={editedEndTime}
              onChange={e => setEditedEndTime(e.target.value)}
              className="w-20 h-7 text-xs"
              aria-label="End time in seconds"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {formatTimestamp(entry.startTime)} -{' '}
                {formatTimestamp(entry.endTime)}
              </span>
            </div>

            {/* Confidence Badge - Inline with metadata */}
            {entry.confidence && (
              <div className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3 h-3 mr-1" />
                {Math.round(entry.confidence * 100)}%
              </div>
            )}
          </>
        )}

        {isEdited && !isEditing && (
          <Badge variant="secondary" className="gap-1">
            <RotateCcw className="w-3 h-3" />
            Edited
          </Badge>
        )}

        {/* Edit button - shows on hover */}
        {enableEditing && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 ml-auto"
            aria-label="Edit entry"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {/* Save/Cancel buttons - shows when editing */}
        {isEditing && (
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="h-7 px-2"
              aria-label="Save changes"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-7 px-2"
              aria-label="Cancel editing"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
      </div>

      {isEditing ? (
        <Textarea
          value={editedText}
          onChange={e => setEditedText(e.target.value)}
          className="min-h-[100px]"
          aria-label="Edit transcript text"
          autoFocus
        />
      ) : (
        <p className="text-slate-700 leading-relaxed">
          {searchQuery
            ? highlightText(entry.text, searchQuery).map((part, index) =>
                part.highlight ? (
                  <mark
                    key={index}
                    className="bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 px-0.5 rounded"
                  >
                    {part.text}
                  </mark>
                ) : (
                  <span key={index}>{part.text}</span>
                )
              )
            : entry.text}
        </p>
      )}

      {enableEditing && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Double-click to edit
        </div>
      )}
    </div>
  )
})
