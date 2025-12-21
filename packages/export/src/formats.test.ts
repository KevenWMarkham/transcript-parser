import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { TranscriptEntry } from '@transcript-parser/types'
import {
  formatTime,
  formatSrtTime,
  toPlainText,
  toSRT,
  toVTT,
  toJSON,
  toCSV,
  downloadFile,
  copyToClipboard,
} from './formats'

// Mock transcript entries for testing
const mockEntries: TranscriptEntry[] = [
  {
    id: '1',
    speaker: 'Speaker 1',
    speakerNumber: 1,
    startTime: 0,
    endTime: 5.5,
    text: 'Hello, this is the first entry.',
    confidence: 0.95,
  },
  {
    id: '2',
    speaker: 'Speaker 2',
    speakerNumber: 2,
    startTime: 5.5,
    endTime: 12.25,
    text: 'This is the second entry with "quotes" in it.',
    confidence: 0.88,
  },
  {
    id: '3',
    speaker: 'Speaker 1',
    speakerNumber: 1,
    startTime: 3665.123,
    endTime: 3670.456,
    text: 'This entry has hours in the timestamp.',
    confidence: 0.92,
  },
]

describe('formatTime', () => {
  it('should format time in short format (MM:SS)', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(5.5)).toBe('00:05')
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(125.7)).toBe('02:05')
  })

  it('should format time in long format (HH:MM:SS)', () => {
    expect(formatTime(0, true)).toBe('00:00:00')
    expect(formatTime(5.5, true)).toBe('00:00:05')
    expect(formatTime(65, true)).toBe('00:01:05')
    expect(formatTime(3665, true)).toBe('01:01:05')
  })

  it('should auto-detect hours when time exceeds 1 hour', () => {
    expect(formatTime(3600)).toBe('01:00:00')
    expect(formatTime(3665)).toBe('01:01:05')
  })

  it('should handle edge cases', () => {
    expect(formatTime(0)).toBe('00:00')
    expect(formatTime(59.9)).toBe('00:59')
    expect(formatTime(60)).toBe('01:00')
    expect(formatTime(3599)).toBe('59:59')
    expect(formatTime(3600)).toBe('01:00:00')
  })

  it('should pad single digits with zeros', () => {
    expect(formatTime(5)).toBe('00:05')
    expect(formatTime(65)).toBe('01:05')
    expect(formatTime(3665, true)).toBe('01:01:05')
  })
})

describe('formatSrtTime', () => {
  it('should format time with comma separator', () => {
    expect(formatSrtTime(0, ',')).toBe('00:00:00,000')
    expect(formatSrtTime(5.5, ',')).toBe('00:00:05,500')
    expect(formatSrtTime(65.123, ',')).toBe('00:01:05,123')
    expect(formatSrtTime(3665.456, ',')).toBe('01:01:05,456')
  })

  it('should format time with dot separator', () => {
    expect(formatSrtTime(0, '.')).toBe('00:00:00.000')
    expect(formatSrtTime(5.5, '.')).toBe('00:00:05.500')
    expect(formatSrtTime(65.123, '.')).toBe('00:01:05.123')
  })

  it('should default to comma separator', () => {
    expect(formatSrtTime(5.5)).toBe('00:00:05,500')
  })

  it('should handle milliseconds correctly', () => {
    // Note: Using values that don't cause floating point precision issues
    expect(formatSrtTime(1.5, ',')).toBe('00:00:01,500')
    expect(formatSrtTime(1.25, ',')).toBe('00:00:01,250')
    expect(formatSrtTime(1.75, ',')).toBe('00:00:01,750')
  })

  it('should pad all components with zeros', () => {
    expect(formatSrtTime(3665.5, ',')).toBe('01:01:05,500')
  })
})

describe('toPlainText', () => {
  it('should export with default options (timestamps + speakers)', () => {
    const result = toPlainText(mockEntries.slice(0, 2))
    expect(result).toContain(
      '[00:00 - 00:05] Speaker 1: Hello, this is the first entry.'
    )
    expect(result).toContain(
      '[00:05 - 00:12] Speaker 2: This is the second entry with "quotes" in it.'
    )
  })

  it('should export without timestamps', () => {
    const result = toPlainText(mockEntries.slice(0, 1), {
      includeTimestamps: false,
    })
    expect(result).toBe('Speaker 1: Hello, this is the first entry.')
    expect(result).not.toContain('[00:00 - 00:05]')
  })

  it('should export without speakers', () => {
    const result = toPlainText(mockEntries.slice(0, 1), {
      includeSpeakers: false,
    })
    expect(result).toContain('[00:00 - 00:05]')
    expect(result).not.toContain('Speaker 1:')
  })

  it('should export with confidence scores', () => {
    const result = toPlainText(mockEntries.slice(0, 1), {
      includeConfidence: true,
    })
    expect(result).toContain('(95%)')
  })

  it('should use long time format when specified', () => {
    const result = toPlainText([mockEntries[2]], { timeFormat: 'long' })
    expect(result).toContain('[01:01:05 - 01:01:10]')
  })

  it('should separate entries with double newline', () => {
    const result = toPlainText(mockEntries.slice(0, 2))
    const entries = result.split('\n\n')
    expect(entries).toHaveLength(2)
  })

  it('should handle minimal options', () => {
    const result = toPlainText(mockEntries.slice(0, 1), {
      includeTimestamps: false,
      includeSpeakers: false,
    })
    expect(result).toBe('Hello, this is the first entry.')
  })
})

describe('toSRT', () => {
  it('should export in SRT format with speakers', () => {
    const result = toSRT(mockEntries.slice(0, 2))

    expect(result).toContain(
      '1\n00:00:00,000 --> 00:00:05,500\nSpeaker 1: Hello, this is the first entry.'
    )
    expect(result).toContain(
      '2\n00:00:05,500 --> 00:00:12,250\nSpeaker 2: This is the second entry with "quotes" in it.'
    )
  })

  it('should export without speakers when specified', () => {
    const result = toSRT(mockEntries.slice(0, 1), { includeSpeakers: false })
    expect(result).toContain(
      '00:00:00,000 --> 00:00:05,500\nHello, this is the first entry.'
    )
    expect(result).not.toContain('Speaker 1:')
  })

  it('should include sequence numbers', () => {
    const result = toSRT(mockEntries.slice(0, 2))
    expect(result).toMatch(/^1\n/)
    expect(result).toContain('\n\n2\n')
  })

  it('should use comma separator in timestamps', () => {
    const result = toSRT(mockEntries.slice(0, 1))
    expect(result).toContain('00:00:00,000 --> 00:00:05,500')
  })

  it('should separate entries with blank lines', () => {
    const result = toSRT(mockEntries.slice(0, 2))
    // SRT format starts with 1, so no blank line before first entry
    expect(result).toMatch(/^1\n/)
    expect(result).toMatch(/\n\n2\n/)
  })
})

describe('toVTT', () => {
  it('should start with WEBVTT header', () => {
    const result = toVTT(mockEntries.slice(0, 1))
    expect(result).toMatch(/^WEBVTT\n\n/)
  })

  it('should export with speaker voice tags', () => {
    const result = toVTT(mockEntries.slice(0, 1))
    expect(result).toContain('<v Speaker 1>Hello, this is the first entry.</v>')
  })

  it('should export without speaker tags when specified', () => {
    const result = toVTT(mockEntries.slice(0, 1), { includeSpeakers: false })
    expect(result).toContain('Hello, this is the first entry.')
    expect(result).not.toContain('<v Speaker 1>')
  })

  it('should use dot separator in timestamps', () => {
    const result = toVTT(mockEntries.slice(0, 1))
    expect(result).toContain('00:00:00.000 --> 00:00:05.500')
  })

  it('should include cue identifiers', () => {
    const result = toVTT(mockEntries.slice(0, 2))
    expect(result).toContain('\n1\n00:00:00.000')
    expect(result).toContain('\n2\n00:00:05.500')
  })
})

describe('toJSON', () => {
  it('should export as formatted JSON with confidence', () => {
    const result = toJSON(mockEntries.slice(0, 1))
    const parsed = JSON.parse(result)

    expect(parsed).toHaveLength(1)
    expect(parsed[0]).toEqual({
      id: '1',
      speaker: 'Speaker 1',
      speakerNumber: 1,
      startTime: 0,
      endTime: 5.5,
      text: 'Hello, this is the first entry.',
      confidence: 0.95,
    })
  })

  it('should exclude confidence when specified', () => {
    const result = toJSON(mockEntries.slice(0, 1), { includeConfidence: false })
    const parsed = JSON.parse(result)

    expect(parsed[0]).not.toHaveProperty('confidence')
  })

  it('should be pretty-printed with 2-space indentation', () => {
    const result = toJSON(mockEntries.slice(0, 1))
    expect(result).toContain('  ')
    expect(result).toContain('\n')
  })

  it('should handle entries without confidence', () => {
    const entryWithoutConfidence: TranscriptEntry = {
      id: '4',
      speaker: 'Speaker 3',
      speakerNumber: 3,
      startTime: 0,
      endTime: 5,
      text: 'No confidence score',
    }

    const result = toJSON([entryWithoutConfidence], { includeConfidence: true })
    const parsed = JSON.parse(result)

    expect(parsed[0]).not.toHaveProperty('confidence')
  })
})

describe('toCSV', () => {
  it('should export with CSV headers and confidence', () => {
    const result = toCSV(mockEntries.slice(0, 1))
    const lines = result.split('\n')

    expect(lines[0]).toBe('ID,Speaker,Start Time,End Time,Text,Confidence')
    expect(lines[1]).toBe(
      '1,Speaker 1,00:00,00:05,"Hello, this is the first entry.",95%'
    )
  })

  it('should exclude confidence column when specified', () => {
    const result = toCSV(mockEntries.slice(0, 1), { includeConfidence: false })
    const lines = result.split('\n')

    expect(lines[0]).toBe('ID,Speaker,Start Time,End Time,Text')
    expect(lines[1]).toBe(
      '1,Speaker 1,00:00,00:05,"Hello, this is the first entry."'
    )
  })

  it('should escape quotes in text', () => {
    const result = toCSV(mockEntries.slice(1, 2))
    expect(result).toContain(
      '"This is the second entry with ""quotes"" in it."'
    )
  })

  it('should use long time format when specified', () => {
    const result = toCSV([mockEntries[2]], { timeFormat: 'long' })
    // CSV has headers, so check the actual data line
    expect(result).toContain('3,Speaker 1,01:01:05,01:01:10')
  })

  it('should handle entries without confidence', () => {
    const entryWithoutConfidence: TranscriptEntry = {
      id: '4',
      speaker: 'Speaker 3',
      speakerNumber: 3,
      startTime: 0,
      endTime: 5,
      text: 'No confidence',
    }

    const result = toCSV([entryWithoutConfidence])
    const lines = result.split('\n')

    // Check that the line has commas and ends with an empty confidence field
    expect(lines[1]).toContain(',')
    // Entry without confidence should have an empty confidence column
    expect(lines[1].split(',').length).toBe(6) // ID,Speaker,Start,End,Text,Confidence
  })
})

describe('downloadFile', () => {
  let createElementSpy: ReturnType<typeof vi.spyOn>
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>
  let appendChildSpy: ReturnType<typeof vi.spyOn>
  let removeChildSpy: ReturnType<typeof vi.spyOn>
  let mockAnchor: HTMLAnchorElement

  beforeEach(() => {
    vi.useFakeTimers()

    mockAnchor = {
      href: '',
      download: '',
      style: { display: '' },
      click: vi.fn(),
    } as unknown as HTMLAnchorElement

    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(mockAnchor)
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:mock-url')
    revokeObjectURLSpy = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => {})
    appendChildSpy = vi
      .spyOn(document.body, 'appendChild')
      .mockImplementation(() => mockAnchor)
    removeChildSpy = vi
      .spyOn(document.body, 'removeChild')
      .mockImplementation(() => mockAnchor)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should create and trigger download for text file', () => {
    downloadFile('test content', 'test.txt', 'text/plain')

    expect(createElementSpy).toHaveBeenCalledWith('a')
    expect(createObjectURLSpy).toHaveBeenCalled()
    expect(mockAnchor.href).toBe('blob:mock-url')
    expect(mockAnchor.download).toBe('test.txt')
    expect(mockAnchor.style.display).toBe('none')
    expect(mockAnchor.click).toHaveBeenCalled()
    expect(appendChildSpy).toHaveBeenCalledWith(mockAnchor)
  })

  it('should add BOM for CSV files', () => {
    const blobConstructorSpy = vi.spyOn(global, 'Blob')

    downloadFile('test,csv,content', 'test.csv', 'text/csv')

    expect(blobConstructorSpy).toHaveBeenCalledWith(
      ['\uFEFFtest,csv,content'],
      { type: 'text/csv;charset=utf-8' }
    )
  })

  it('should not add BOM for non-CSV files', () => {
    const blobConstructorSpy = vi.spyOn(global, 'Blob')

    downloadFile('test content', 'test.txt', 'text/plain')

    expect(blobConstructorSpy).toHaveBeenCalledWith(['test content'], {
      type: 'text/plain;charset=utf-8',
    })
  })

  it('should clean up after download', () => {
    downloadFile('test content', 'test.txt')

    vi.advanceTimersByTime(100)

    expect(removeChildSpy).toHaveBeenCalledWith(mockAnchor)
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
  })

  it('should default to text/plain mime type', () => {
    const blobConstructorSpy = vi.spyOn(global, 'Blob')

    downloadFile('test content', 'test.txt')

    expect(blobConstructorSpy).toHaveBeenCalledWith(['test content'], {
      type: 'text/plain;charset=utf-8',
    })
  })
})

describe('copyToClipboard', () => {
  it('should copy text to clipboard successfully', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    })

    const result = await copyToClipboard('test content')

    expect(writeTextMock).toHaveBeenCalledWith('test content')
    expect(result).toBe(true)
  })

  it('should return false on clipboard error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const writeTextMock = vi
      .fn()
      .mockRejectedValue(new Error('Clipboard error'))
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      writable: true,
    })

    const result = await copyToClipboard('test content')

    expect(result).toBe(false)
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should handle missing clipboard API', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    })

    const result = await copyToClipboard('test content')

    expect(result).toBe(false)
    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })
})
