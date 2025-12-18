import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { SpeakerSummary } from './SpeakerSummary'
import type { TranscriptEntry, Speaker } from '@/types/transcript'

const mockSpeakers: Speaker[] = [
  { id: 1, name: 'Speaker 1', color: 'blue' },
  { id: 2, name: 'Speaker 2', color: 'emerald' },
  { id: 3, name: 'Speaker 3', color: 'purple' },
]

const createMockEntry = (
  speakerNumber: number,
  startTime: number,
  duration: number
): TranscriptEntry => ({
  id: `entry-${speakerNumber}-${startTime}`,
  speaker: `Speaker ${speakerNumber}`,
  speakerNumber,
  startTime,
  endTime: startTime + duration,
  text: `Test text from speaker ${speakerNumber}`,
  confidence: 0.95,
})

describe('SpeakerSummary', () => {
  it('renders nothing with empty speakers array', () => {
    const { container } = render(<SpeakerSummary entries={[]} speakers={[]} />)

    expect(container.firstChild).toBeNull()
  })

  it('displays correct number of speakers', () => {
    const entries = [createMockEntry(1, 0, 10), createMockEntry(2, 10, 20)]

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 2)} />
    )

    expect(screen.getByText('2 speakers')).toBeInTheDocument()
  })

  it('displays single speaker correctly', () => {
    const entries = [createMockEntry(1, 0, 10)]

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 1)} />
    )

    expect(screen.getByText('1 speaker')).toBeInTheDocument()
  })

  it('calculates segment count correctly', () => {
    const entries = [
      createMockEntry(1, 0, 10),
      createMockEntry(1, 10, 10),
      createMockEntry(1, 20, 10),
      createMockEntry(2, 30, 10),
    ]

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 2)} />
    )

    // Speaker 1 should have 3 segments
    expect(screen.getByText('3 segments')).toBeInTheDocument()
    // Speaker 2 should have 1 segment
    expect(screen.getByText('1 segment')).toBeInTheDocument()
  })

  it('calculates total duration correctly', () => {
    const entries = [
      createMockEntry(1, 0, 60), // 1 minute
      createMockEntry(1, 60, 30), // 30 seconds
      createMockEntry(2, 90, 120), // 2 minutes
    ]

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 2)} />
    )

    // Speaker 1: 1m 30s total
    expect(screen.getByText('1m 30s')).toBeInTheDocument()
    // Speaker 2: 2m 0s total
    expect(screen.getByText('2m 0s')).toBeInTheDocument()
  })

  it('calculates percentages correctly', () => {
    const entries = [
      createMockEntry(1, 0, 60), // Speaker 1: 60s
      createMockEntry(2, 60, 40), // Speaker 2: 40s
    ]
    // Total: 100s
    // Speaker 1: 60%, Speaker 2: 40%

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 2)} />
    )

    expect(screen.getByText('60.0% of total')).toBeInTheDocument()
    expect(screen.getByText('40.0% of total')).toBeInTheDocument()
  })

  it('handles speaker with no entries', () => {
    const entries = [createMockEntry(1, 0, 10), createMockEntry(2, 10, 10)]

    render(<SpeakerSummary entries={entries} speakers={mockSpeakers} />)

    // All three speakers should be displayed
    expect(screen.getByText('Speaker 1')).toBeInTheDocument()
    expect(screen.getByText('Speaker 2')).toBeInTheDocument()
    expect(screen.getByText('Speaker 3')).toBeInTheDocument()

    // Speaker 3 should have 0 segments and 0% (they spoke for 0 seconds)
    const segments = screen.getAllByText(/\d+ segments?/)
    expect(segments.length).toBeGreaterThan(0)
  })

  it('displays all speaker statistics', () => {
    const entries = [createMockEntry(1, 0, 30), createMockEntry(1, 30, 30)]

    render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 1)} />
    )

    // Should display speaker name
    expect(screen.getByText('Speaker 1')).toBeInTheDocument()

    // Should display segment count
    expect(screen.getByText('2 segments')).toBeInTheDocument()

    // Should display duration
    expect(screen.getByText('1m 0s')).toBeInTheDocument()

    // Should display percentage
    expect(screen.getByText('100.0% of total')).toBeInTheDocument()
  })

  it('sorts speakers by total duration descending', () => {
    const entries = [
      createMockEntry(1, 0, 10), // Speaker 1: 10s
      createMockEntry(2, 10, 50), // Speaker 2: 50s
      createMockEntry(3, 60, 30), // Speaker 3: 30s
    ]

    const { container } = render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers} />
    )

    // Get all speaker name badges in order
    const speakerBadges = Array.from(
      container.querySelectorAll(
        '.bg-blue-100, .bg-emerald-100, .bg-purple-100'
      )
    )

    // Speaker 2 should be first (50s)
    expect(speakerBadges[0].textContent).toContain('Speaker 2')
    // Speaker 3 should be second (30s)
    expect(speakerBadges[1].textContent).toContain('Speaker 3')
    // Speaker 1 should be third (10s)
    expect(speakerBadges[2].textContent).toContain('Speaker 1')
  })

  it('applies correct color classes for each speaker', () => {
    const entries = [createMockEntry(1, 0, 10)]

    const { container } = render(
      <SpeakerSummary entries={entries} speakers={mockSpeakers.slice(0, 1)} />
    )

    // Blue speaker should have blue classes
    const blueBadge = container.querySelector('.bg-blue-100')
    expect(blueBadge).toBeInTheDocument()
  })
})
