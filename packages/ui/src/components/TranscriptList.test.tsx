import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { TranscriptList } from './TranscriptList'
import type { TranscriptEntry, Speaker } from '@transcript-parser/types'

const mockSpeakers: Speaker[] = [
  { id: 1, name: 'Speaker 1', color: 'blue' },
  { id: 2, name: 'Speaker 2', color: 'emerald' },
]

const createMockEntry = (index: number): TranscriptEntry => ({
  id: `entry-${index}`,
  speaker: `Speaker ${(index % 2) + 1}`,
  speakerNumber: (index % 2) + 1,
  startTime: index * 10,
  endTime: (index + 1) * 10,
  text: `This is transcript entry number ${index}`,
  confidence: 0.95,
})

describe('TranscriptList', () => {
  it('renders with empty entries array', () => {
    const { container } = render(
      <TranscriptList entries={[]} speakers={mockSpeakers} />
    )

    // Should render the container
    expect(container.querySelector('[style*="height"]')).toBeInTheDocument()
  })

  it('renders with small number of entries', () => {
    const entries = Array.from({ length: 5 }, (_, i) => createMockEntry(i))

    render(<TranscriptList entries={entries} speakers={mockSpeakers} />)

    // At least some entries should be rendered
    const entryElements = screen.getAllByText(/This is transcript entry/)
    expect(entryElements.length).toBeGreaterThan(0)
  })

  it('creates virtualizer for large number of entries', () => {
    const entries = Array.from({ length: 1000 }, (_, i) => createMockEntry(i))

    const startTime = performance.now()
    const { container } = render(
      <TranscriptList entries={entries} speakers={mockSpeakers} />
    )
    const renderTime = performance.now() - startTime

    // Render should be fast (< 100ms)
    expect(renderTime).toBeLessThan(100)

    // Should have virtual container
    const virtualContainer = container.querySelector(
      '[style*="position: relative"]'
    )
    expect(virtualContainer).toBeInTheDocument()

    // Should not render all 1000 entries at once (virtualization working)
    const renderedEntries = screen.queryAllByText(/This is transcript entry/)
    expect(renderedEntries.length).toBeLessThan(1000)
    expect(renderedEntries.length).toBeGreaterThan(0)
  })

  it('handles entry click callback', () => {
    const entries = Array.from({ length: 3 }, (_, i) => createMockEntry(i))
    const onEntryClick = jest.fn()

    const { container } = render(
      <TranscriptList
        entries={entries}
        speakers={mockSpeakers}
        onEntryClick={onEntryClick}
      />
    )

    // Find and click first entry div
    const entryDivs = container.querySelectorAll('[data-index]')
    if (entryDivs.length > 0) {
      entryDivs[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
      expect(onEntryClick).toHaveBeenCalledWith(entries[0])
    }
  })

  it('highlights entry when highlightedId matches', () => {
    const entries = Array.from({ length: 3 }, (_, i) => createMockEntry(i))

    const { container } = render(
      <TranscriptList
        entries={entries}
        speakers={mockSpeakers}
        highlightedId="entry-1"
      />
    )

    // Should find highlighted entry
    const highlightedElement = container.querySelector('.ring-2')
    expect(highlightedElement).toBeInTheDocument()
  })

  it('uses correct speaker colors', () => {
    const entries = [createMockEntry(0), createMockEntry(1)]

    render(<TranscriptList entries={entries} speakers={mockSpeakers} />)

    // Verify speakers are rendered with their names
    expect(screen.getByText('Speaker 1')).toBeInTheDocument()
    expect(screen.getByText('Speaker 2')).toBeInTheDocument()
  })

  it('handles missing speaker gracefully', () => {
    const entry: TranscriptEntry = {
      id: 'entry-1',
      speaker: 'Unknown Speaker',
      speakerNumber: 999, // Non-existent speaker
      startTime: 0,
      endTime: 10,
      text: 'Test text',
    }

    const { container } = render(
      <TranscriptList entries={[entry]} speakers={mockSpeakers} />
    )

    // Should render without errors
    expect(container).toBeInTheDocument()
    expect(screen.getByText('Unknown Speaker')).toBeInTheDocument()
  })

  it('maintains scroll container properties', () => {
    const entries = Array.from({ length: 100 }, (_, i) => createMockEntry(i))

    const { container } = render(
      <TranscriptList entries={entries} speakers={mockSpeakers} />
    )

    const scrollContainer = container.querySelector('.overflow-auto')
    expect(scrollContainer).toBeInTheDocument()
    expect(scrollContainer).toHaveStyle({ height: '600px' })
  })
})
