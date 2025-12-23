import { useState, useMemo, useEffect } from 'react'
import { Download, Copy, X, FileText, Film, Code, Table, ChevronRight, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from './ui/dialog'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { useToast } from './ui/toast'
import type { TranscriptEntry } from '@transcript-parser/types'
import {
  toPlainText,
  toSRT,
  toVTT,
  toJSON,
  toCSV,
  downloadFile,
  copyToClipboard,
  type ExportOptions,
} from '@transcript-parser/export'

interface ExportDialogProps {
  entries: TranscriptEntry[]
  isOpen: boolean
  onClose: () => void
}

type ExportFormat = 'txt' | 'srt' | 'vtt' | 'json' | 'csv'
type TimeFormat = 'MM:SS' | 'HH:MM:SS'

// Device detection
function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return { isMobile: false, isIOS: false, isAndroid: false }
  }
  const ua = navigator.userAgent || navigator.vendor || ''
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /Android/i.test(ua)
  const isMobile = isIOS || isAndroid || /webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)
  return { isMobile, isIOS, isAndroid }
}

const formatConfig: Record<
  ExportFormat,
  {
    name: string
    shortName: string
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
    shortName: 'Text',
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
    shortName: 'SRT',
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
    shortName: 'VTT',
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
    shortName: 'JSON',
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
    shortName: 'CSV',
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
  const [viewportHeight, setViewportHeight] = useState(0)

  const device = useMemo(() => getDeviceInfo(), [])
  const config = formatConfig[selectedFormat]

  // Handle viewport height for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.visualViewport?.height || window.innerHeight
      setViewportHeight(vh)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    window.visualViewport?.addEventListener('resize', updateViewportHeight)
    return () => {
      window.removeEventListener('resize', updateViewportHeight)
      window.visualViewport?.removeEventListener('resize', updateViewportHeight)
    }
  }, [])

  // Lock body scroll on mobile
  useEffect(() => {
    if (!isOpen || !device.isMobile) return
    const originalStyle = document.body.style.cssText
    document.body.style.cssText = `
      overflow: hidden;
      position: fixed;
      width: 100%;
      height: 100%;
      touch-action: none;
    `
    return () => {
      document.body.style.cssText = originalStyle
    }
  }, [isOpen, device.isMobile])

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

  const handleDownload = () => {
    try {
      const content = generateContent()
      const date = new Date().toISOString().split('T')[0]
      const filename = `transcript-${date}${config.extension}`
      downloadFile(content, filename, config.mimeType)
      addToast(`Transcript exported as ${config.name}`, 'success')
      if (device.isMobile) onClose()
    } catch (error) {
      addToast('Failed to export transcript', 'error')
    }
  }

  const handleCopy = async () => {
    const content = generateContent()
    const success = await copyToClipboard(content)
    if (success) {
      addToast('Copied to clipboard', 'success')
      if (device.isMobile) onClose()
    } else {
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  // Mobile layout - simplified single-column with no scroll needed
  if (device.isMobile) {
    const modalHeight = viewportHeight > 0 ? viewportHeight : '100vh'

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="w-screen p-0 m-0 rounded-none border-0 bg-white flex flex-col"
          style={{ height: modalHeight, maxHeight: modalHeight }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 flex-shrink-0 safe-area-inset-top">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-slate-900">Export</span>
              <span className="text-sm text-slate-500">({entries.length} entries)</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Format Selection - Horizontal scrollable pills */}
          <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {(Object.keys(formatConfig) as ExportFormat[]).map(format => {
                const info = formatConfig[format]
                const isSelected = selectedFormat === format
                return (
                  <button
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                      isSelected
                        ? `${info.iconBg} text-white shadow-md`
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" />}
                    {info.shortName}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Options - Compact */}
          <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={options.includeTimestamps}
                  onCheckedChange={() => setOptions(prev => ({ ...prev, includeTimestamps: !prev.includeTimestamps }))}
                />
                <span className="text-sm text-slate-700">Timestamps</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={options.includeSpeakers}
                  onCheckedChange={() => setOptions(prev => ({ ...prev, includeSpeakers: !prev.includeSpeakers }))}
                />
                <span className="text-sm text-slate-700">Speakers</span>
              </label>
              <label className="flex items-center gap-2">
                <Checkbox
                  checked={options.includeConfidence}
                  onCheckedChange={() => setOptions(prev => ({ ...prev, includeConfidence: !prev.includeConfidence }))}
                />
                <span className="text-sm text-slate-700">Confidence</span>
              </label>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setTimeFormat('MM:SS')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  timeFormat === 'MM:SS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                MM:SS
              </button>
              <button
                onClick={() => setTimeFormat('HH:MM:SS')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                  timeFormat === 'HH:MM:SS' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                HH:MM:SS
              </button>
            </div>
          </div>

          {/* Selected Format Info */}
          <div className="flex-1 flex items-center justify-center px-4 py-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-2xl ${config.iconBg} flex items-center justify-center mb-4`}>
                <config.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{config.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{config.description}</p>
              <p className="text-xs text-slate-400 mt-2">{config.extension} file</p>
            </div>
          </div>

          {/* Action Buttons - Fixed at bottom */}
          <div className="px-4 py-4 border-t border-slate-200 flex-shrink-0 safe-area-inset-bottom">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 h-12 rounded-xl"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleDownload}
                className={`flex-1 h-12 rounded-xl ${config.buttonColor} text-white`}
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop layout - Original two-column design
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 bg-white/95 backdrop-blur-xl border-white/20 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200/50 flex-shrink-0">
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
        <div className="grid grid-cols-2 gap-6 p-6 overflow-y-auto flex-1">
          {/* Left: Export Formats */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-800">Export Format</h3>
            <div className="space-y-3">
              {(Object.keys(formatConfig) as ExportFormat[]).map(format => {
                const info = formatConfig[format]
                const Icon = info.icon
                const isSelected = selectedFormat === format

                return (
                  <div
                    key={format}
                    onClick={() => setSelectedFormat(format)}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${info.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${info.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800">{info.name}</div>
                        <div className="text-xs text-slate-500">{info.description}</div>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1">
                          <Button
                            onClick={(e) => { e.stopPropagation(); handleDownload() }}
                            className={`${info.buttonColor} text-white rounded-lg h-8 px-3`}
                            size="sm"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleCopy() }}
                            className="w-8 h-8 p-0 rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Options */}
          <div className="space-y-5">
            {/* Export Options */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-800">Export Options</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeTimestamps}
                    onCheckedChange={() => setOptions(prev => ({ ...prev, includeTimestamps: !prev.includeTimestamps }))}
                  />
                  <span className="text-sm text-slate-700">Include timestamps</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeSpeakers}
                    onCheckedChange={() => setOptions(prev => ({ ...prev, includeSpeakers: !prev.includeSpeakers }))}
                  />
                  <span className="text-sm text-slate-700">Include speaker labels</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={options.includeConfidence}
                    onCheckedChange={() => setOptions(prev => ({ ...prev, includeConfidence: !prev.includeConfidence }))}
                  />
                  <span className="text-sm text-slate-700">Include confidence scores</span>
                </label>
              </div>
            </div>

            {/* Time Format */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-slate-800">Time Format</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeFormat('MM:SS')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFormat === 'MM:SS'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  MM:SS
                </button>
                <button
                  onClick={() => setTimeFormat('HH:MM:SS')}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFormat === 'HH:MM:SS'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  HH:MM:SS
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  className={`flex-1 ${config.buttonColor} text-white rounded-xl h-11`}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download {config.name}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="h-11 px-4 rounded-xl"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">Ready to export</span>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
