import { describe, it, expect } from '@jest/globals'
import { renderHook, act } from '@testing-library/react'
import { useStreamingTranscript } from './useStreamingTranscript'
import type { TranscriptEntry } from '@/types/transcript'

const createMockEntry = (
  id: string,
  speakerNumber: number
): TranscriptEntry => ({
  id,
  speaker: `Speaker ${speakerNumber}`,
  speakerNumber,
  startTime: 0,
  endTime: 10,
  text: `Test text for entry ${id}`,
  confidence: 0.95,
})

describe('useStreamingTranscript', () => {
  it('initializes with empty entries array', () => {
    const { result } = renderHook(() => useStreamingTranscript())

    expect(result.current.entries).toEqual([])
  })

  it('adds a single entry', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry = createMockEntry('1', 1)

    act(() => {
      result.current.addEntry(entry)
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0]).toEqual(entry)
  })

  it('adds multiple entries', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry1 = createMockEntry('1', 1)
    const entry2 = createMockEntry('2', 2)
    const entry3 = createMockEntry('3', 1)

    act(() => {
      result.current.addEntry(entry1)
      result.current.addEntry(entry2)
      result.current.addEntry(entry3)
    })

    expect(result.current.entries).toHaveLength(3)
    expect(result.current.entries).toEqual([entry1, entry2, entry3])
  })

  it('updates an existing entry', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry = createMockEntry('1', 1)

    act(() => {
      result.current.addEntry(entry)
    })

    act(() => {
      result.current.updateEntry('1', {
        text: 'Updated text',
        confidence: 0.99,
      })
    })

    expect(result.current.entries[0].text).toBe('Updated text')
    expect(result.current.entries[0].confidence).toBe(0.99)
    // Other fields should remain unchanged
    expect(result.current.entries[0].speaker).toBe('Speaker 1')
    expect(result.current.entries[0].id).toBe('1')
  })

  it('updates only the matching entry', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry1 = createMockEntry('1', 1)
    const entry2 = createMockEntry('2', 2)
    const entry3 = createMockEntry('3', 3)

    act(() => {
      result.current.addEntry(entry1)
      result.current.addEntry(entry2)
      result.current.addEntry(entry3)
    })

    act(() => {
      result.current.updateEntry('2', { text: 'Updated entry 2' })
    })

    expect(result.current.entries[0].text).toBe('Test text for entry 1')
    expect(result.current.entries[1].text).toBe('Updated entry 2')
    expect(result.current.entries[2].text).toBe('Test text for entry 3')
  })

  it('does nothing when updating non-existent entry', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry = createMockEntry('1', 1)

    act(() => {
      result.current.addEntry(entry)
    })

    const originalEntries = [...result.current.entries]

    act(() => {
      result.current.updateEntry('999', { text: 'This should not apply' })
    })

    expect(result.current.entries).toEqual(originalEntries)
  })

  it('clears all entries', () => {
    const { result } = renderHook(() => useStreamingTranscript())

    act(() => {
      result.current.addEntry(createMockEntry('1', 1))
      result.current.addEntry(createMockEntry('2', 2))
      result.current.addEntry(createMockEntry('3', 3))
    })

    expect(result.current.entries).toHaveLength(3)

    act(() => {
      result.current.clearEntries()
    })

    expect(result.current.entries).toHaveLength(0)
  })

  it('handles rapid entry additions (stress test)', () => {
    const { result } = renderHook(() => useStreamingTranscript())

    act(() => {
      for (let i = 0; i < 100; i++) {
        result.current.addEntry(createMockEntry(`entry-${i}`, (i % 3) + 1))
      }
    })

    expect(result.current.entries).toHaveLength(100)
    expect(result.current.entries[0].id).toBe('entry-0')
    expect(result.current.entries[99].id).toBe('entry-99')
  })

  it('handles rapid updates (stress test)', () => {
    const { result } = renderHook(() => useStreamingTranscript())
    const entry = createMockEntry('1', 1)

    act(() => {
      result.current.addEntry(entry)
    })

    act(() => {
      for (let i = 0; i < 50; i++) {
        result.current.updateEntry('1', { confidence: 0.5 + i * 0.01 })
      }
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.entries[0].confidence).toBeCloseTo(0.5 + 49 * 0.01)
  })

  it('maintains entry order when adding', () => {
    const { result } = renderHook(() => useStreamingTranscript())

    act(() => {
      result.current.addEntry(createMockEntry('1', 1))
      result.current.addEntry(createMockEntry('2', 2))
      result.current.addEntry(createMockEntry('3', 3))
      result.current.addEntry(createMockEntry('4', 1))
    })

    const ids = result.current.entries.map(e => e.id)
    expect(ids).toEqual(['1', '2', '3', '4'])
  })

  it('preserves entries when updating', () => {
    const { result } = renderHook(() => useStreamingTranscript())

    act(() => {
      result.current.addEntry(createMockEntry('1', 1))
      result.current.addEntry(createMockEntry('2', 2))
    })

    const initialLength = result.current.entries.length

    act(() => {
      result.current.updateEntry('1', { text: 'Updated' })
    })

    expect(result.current.entries).toHaveLength(initialLength)
  })
})
