import { useState, useMemo } from 'react'
import { Download, Copy, X, FileText, Film, Code, Table } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast'
import type { TranscriptEntry } from '@/types/transcript'
import {
  toPlainText,
  toSRT,
  toVTT,
  toJSON,
  toCSV,
  downloadFile,
  copyToClipboard,
  type ExportOptions,
} from '@/utils/exportFormats'

interface ExportDialogProps {
  entries: TranscriptEntry[]
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'txt' | 'srt' | 'vtt' | 'json' | 'csv'
type TimeFormat = 'MM:SS' | 'HH:MM:SS'

const formatConfig: Record<
  ExportFormat,
  {
    name: string
    extension: string
    description: string
    icon: any
    iconBg: string
    iconColor: string
    buttonColor: string
    mimeType: string
  }
> = {
  txt: {
    name: 'Plain Text',
    extension: '.txt',
    description: 'Readable format with timestamps',
    icon: FileText,
    iconBg: 'bg-slate-600',
    iconColor: 'text-white',
    buttonColor: 'bg-slate-600 hover:bg-slate-700',
    mimeType: 'text/plain',
  },
  srt: {
    name: 'SRT Subtitles',
    extension: '.srt',
    description: 'SubRip format for video players',
    icon: Film,
    iconBg: 'bg-blue-600',
    iconColor: 'text-white',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    mimeType: 'application/x-subrip',
  },
  vtt: {
    name: 'WebVTT',
    extension: '.vtt',
    description: 'HTML5 video subtitle format',
    icon: Film,
    iconBg: 'bg-purple-600',
    iconColor: 'text-white',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    mimeType: 'text/vtt',
  },
  json: {
    name: 'JSON',
    extension: '.json',
    description: 'Structured data for developers',
    icon: Code,
    iconBg: 'bg-green-600',
    iconColor: 'text-white',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    mimeType: 'application/json',
  },
  csv: {
    name: 'CSV',
    extension: '.csv',
    description: 'Spreadsheet-compatible format',
    icon: Table,
    iconBg: 'bg-orange-600',
    iconColor: 'text-white',
    buttonColor: 'bg-orange-600 hover:bg-orange-700',
    mimeType: 'text/csv',
  },
}

export function ExportDialog({ entries, isOpen, onClose }: ExportDialogProps) {
  const { addToast } = useToast()
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('txt')
  const [timeFormat, setTimeFormat] = useState<TimeFormat>('MM:SS')
  const [options, setOptions] = useState({
    includeTimestamps: true,
    includeSpeakers: true,
    includeConfidence: true,
  })

  const config = formatConfig[selectedFormat]

  const exportOptions: ExportOptions = {
    ...options,
    timeFormat: timeFormat === 'MM:SS' ? 'short' : 'long',
  }

  const generateContent = (): string => {
    switch (selectedFormat) {
      case 'txt':
        return toPlainText(entries, exportOptions)
      case 'srt':
        return toSRT(entries, exportOptions)
      case 'vtt':
        return toVTT(entries, exportOptions)
      case 'json':
        return toJSON(entries, exportOptions)
      case 'csv':
        return toCSV(entries, exportOptions)
    }
  }

  // Generate preview with first 4 entries
  const preview = useMemo(() => {
    const previewEntries = entries.slice(0, 4)
    const previewOptions: ExportOptions = {
      includeTimestamps: options.includeTimestamps,
      includeSpeakers: options.includeSpeakers,
      includeConfidence: options.includeConfidence,
      timeFormat: timeFormat === 'MM:SS' ? 'short' : 'long',
    }

    switch (selectedFormat) {
      case 'txt':
        return toPlainText(previewEntries, previewOptions)
      case 'srt':
        return toSRT(previewEntries, previewOptions)
      case 'vtt':
        return toVTT(previewEntries, previewOptions)
      case 'json':
        return toJSON(previewEntries, previewOptions)
      case 'csv':
        return toCSV(previewEntries, previewOptions)
    }
  }, [entries, selectedFormat, options.includeTimestamps, options.includeSpeakers, options.includeConfidence, timeFormat])

  const handleDownload = () => {
    try {
      const content = generateContent()
      const date = new Date().toISOString().split('T')[0]
      const filename = `transcript-${date}${config.extension}`
      downloadFile(content, filename, config.mimeType)
      addToast(`Transcript exported as ${config.name}`, 'success')
    } catch (error) {
      addToast('Failed to export transcript', 'error')
    }
  }

  const handleCopy = async (content: string) => {
    const success = await copyToClipboard(content)
    if (success) {
      addToast('Copied to clipboard', 'success')
    } else {
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 bg-white/95 backdrop-blur-xl border-white/20 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-30" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Download className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Export Transcript</h2>
                <p className="text-sm text-slate-600">{entries.length} entries ready to export</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {/* Left: Export Formats */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-800">Export Format</h3>
            <div className="space-y-4">
              {(Object.keys(formatConfig) as ExportFormat[]).map(format => {
                const info = formatConfig[format]
                const Icon = info.icon
                const isSelected = selectedFormat === format

                return (
                  <div
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${info.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${info.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">{info.name}</div>
                        <div className="text-xs text-slate-500">{info.extension}</div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{info.description}</p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload()
                        }}
                        className={`flex-1 ${info.buttonColor} text-white rounded-xl`}
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const content = generateContent()
                          handleCopy(content)
                        }}
                        className="w-12 h-10 p-0 rounded-xl"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Options & Preview */}
          <div className="space-y-6">
            {/* Export Options */}
            <div>
              <h3 className="text-sm font-semibold mb-4 text-slate-800">Export Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeTimestamps}
                    onCheckedChange={() =>
                      setOptions(prev => ({
                        ...prev,
                        includeTimestamps: !prev.includeTimestamps,
                      }))
                    }
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    Include timestamps
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeSpeakers}
                    onCheckedChange={() =>
                      setOptions(prev => ({
                        ...prev,
                        includeSpeakers: !prev.includeSpeakers,
                      }))
                    }
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    Include speaker labels
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeConfidence}
                    onCheckedChange={() =>
                      setOptions(prev => ({
                        ...prev,
                        includeConfidence: !prev.includeConfidence,
                      }))
                    }
                  />
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
                    Include confidence scores
                  </span>
                </label>
              </div>
            </div>

            {/* Time Format */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-800">Time Format</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFormat('MM:SS')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    timeFormat === 'MM:SS'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  MM:SS
                </button>
                <button
                  onClick={() => setTimeFormat('HH:MM:SS')}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    timeFormat === 'HH:MM:SS'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  HH:MM:SS
                </button>
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-800">Preview</h3>
              <div className="bg-slate-900 rounded-xl p-4 max-h-80 overflow-auto">
                <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap break-words">
                  {preview}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-200/50 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">Ready to export</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={handleDownload}
                className={`${config.buttonColor} text-white rounded-xl`}
              >
                <Download className="w-4 h-4 mr-2" />
                Download {config.name}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
