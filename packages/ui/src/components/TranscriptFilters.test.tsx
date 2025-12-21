import { describe, it, expect, jest } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptFilters, TranscriptFilterOptions } from './TranscriptFilters'
import type { Speaker } from '@transcript-parser/types'

const mockSpeakers: Speaker[] = [
  { id: 1, name: 'Speaker 1', color: 'blue' },
  { id: 2, name: 'Speaker 2', color: 'emerald' },
  { id: 3, name: 'Speaker 3', color: 'purple' },
]

const defaultFilters: TranscriptFilterOptions = {
  selectedSpeakers: new Set<number>(),
  timeRange: { start: 0, end: 300 },
  minConfidence: 0,
}

describe('TranscriptFilters', () => {
  it('should render filters component', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.getByText('Filters')).toBeDefined()
  })

  it('should render all speakers', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.getByText('Speaker 1')).toBeDefined()
    expect(screen.getByText('Speaker 2')).toBeDefined()
    expect(screen.getByText('Speaker 3')).toBeDefined()
  })

  it('should toggle speaker selection when clicked', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const speaker1Button = screen.getByText('Speaker 1').closest('button')!
    await user.click(speaker1Button)

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedSpeakers: expect.any(Set),
      })
    )

    const call = onFiltersChange.mock.calls[0][0]
    expect(call.selectedSpeakers.has(1)).toBe(true)
  })

  it('should deselect speaker when clicked again', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    const filtersWithSelection: TranscriptFilterOptions = {
      ...defaultFilters,
      selectedSpeakers: new Set([1]),
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={filtersWithSelection}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const speaker1Button = screen.getByText('Speaker 1').closest('button')!
    await user.click(speaker1Button)

    const call = onFiltersChange.mock.calls[0][0]
    expect(call.selectedSpeakers.has(1)).toBe(false)
  })

  it('should update time range start', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const startInput = screen.getByLabelText('Start time in seconds')
    await user.clear(startInput)
    await user.type(startInput, '10')

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        timeRange: expect.objectContaining({ start: 10 }),
      })
    )
  })

  it('should update time range end', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const endInput = screen.getByLabelText('End time in seconds')
    await user.clear(endInput)
    await user.type(endInput, '250')

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        timeRange: expect.objectContaining({ end: 250 }),
      })
    )
  })

  it('should display formatted time range', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    const filtersWithTimeRange: TranscriptFilterOptions = {
      ...defaultFilters,
      timeRange: { start: 65, end: 185 },
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={filtersWithTimeRange}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    // 65 seconds = 1:05, 185 seconds = 3:05
    expect(screen.getByText('(1:05)')).toBeDefined()
    expect(screen.getByText('(3:05)')).toBeDefined()
  })

  it('should update confidence filter', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const slider = screen.getByLabelText('Minimum confidence threshold')
    fireEvent.change(slider, { target: { value: '75' } })

    expect(onFiltersChange).toHaveBeenCalledWith(
      expect.objectContaining({
        minConfidence: 75,
      })
    )
  })

  it('should display confidence percentage', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    const filtersWithConfidence: TranscriptFilterOptions = {
      ...defaultFilters,
      minConfidence: 80,
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={filtersWithConfidence}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.getByText('80%')).toBeDefined()
  })

  it('should show "Active" badge when filters are applied', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    const activeFilters: TranscriptFilterOptions = {
      selectedSpeakers: new Set([1]),
      timeRange: { start: 0, end: 300 },
      minConfidence: 0,
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={activeFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.getByText('Active')).toBeDefined()
  })

  it('should not show "Active" badge when no filters are applied', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.queryByText('Active')).toBeNull()
  })

  it('should show clear all button when filters are active', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    const activeFilters: TranscriptFilterOptions = {
      selectedSpeakers: new Set([1]),
      timeRange: { start: 0, end: 300 },
      minConfidence: 0,
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={activeFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    expect(screen.getByText('Clear all')).toBeDefined()
  })

  it('should call onClearFilters when clear all is clicked', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    const activeFilters: TranscriptFilterOptions = {
      selectedSpeakers: new Set([1]),
      timeRange: { start: 0, end: 300 },
      minConfidence: 0,
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={activeFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const clearButton = screen.getByText('Clear all')
    await user.click(clearButton)

    expect(onClearFilters).toHaveBeenCalled()
  })

  it('should collapse and expand when toggle button is clicked', async () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()
    const user = userEvent.setup()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    // Initially expanded, should see speaker filter label
    expect(screen.getByText('Filter by Speaker')).toBeDefined()

    // Find and click collapse button
    const collapseButton = screen.getByLabelText('Collapse filters')
    await user.click(collapseButton)

    // After collapse, speaker filter should not be visible
    expect(screen.queryByText('Filter by Speaker')).toBeNull()

    // Click to expand again
    const expandButton = screen.getByLabelText('Expand filters')
    await user.click(expandButton)

    // Should be visible again
    expect(screen.getByText('Filter by Speaker')).toBeDefined()
  })

  it('should have proper ARIA attributes on speaker buttons', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={defaultFilters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const speaker1Button = screen.getByText('Speaker 1').closest('button')!
    expect(speaker1Button.getAttribute('aria-pressed')).toBe('false')
  })

  it('should mark selected speaker with aria-pressed="true"', () => {
    const onFiltersChange = jest.fn()
    const onClearFilters = jest.fn()

    const filtersWithSelection: TranscriptFilterOptions = {
      ...defaultFilters,
      selectedSpeakers: new Set([1]),
    }

    render(
      <TranscriptFilters
        speakers={mockSpeakers}
        maxDuration={300}
        filters={filtersWithSelection}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
      />
    )

    const speaker1Button = screen.getByText('Speaker 1').closest('button')!
    expect(speaker1Button.getAttribute('aria-pressed')).toBe('true')
  })
})
