import { describe, it, expect, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TranscriptSearch } from './TranscriptSearch'

describe('TranscriptSearch', () => {
  it('should render search input', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText('Search transcript...')
    expect(input).toBeDefined()
  })

  it('should call onSearchChange when typing', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText('Search transcript...')
    await user.type(input, 'hello')

    // Should be called for each character
    expect(onSearchChange).toHaveBeenCalled()
  })

  it('should display search value', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText(
      'Search transcript...'
    ) as HTMLInputElement
    await user.type(input, 'test query')

    expect(input.value).toBe('test query')
  })

  it('should show clear button when search has value', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    // Clear button should not be visible initially
    expect(screen.queryByLabelText('Clear search')).toBeNull()

    const input = screen.getByPlaceholderText('Search transcript...')
    await user.type(input, 'test')

    // Clear button should now be visible
    const clearButton = screen.getByLabelText('Clear search')
    expect(clearButton).toBeDefined()
  })

  it('should clear search when clear button is clicked', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText(
      'Search transcript...'
    ) as HTMLInputElement
    await user.type(input, 'test query')

    expect(input.value).toBe('test query')

    const clearButton = screen.getByLabelText('Clear search')
    await user.click(clearButton)

    expect(input.value).toBe('')
    expect(onSearchChange).toHaveBeenCalledWith('')
  })

  it('should display result count when provided', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} resultCount={5} />)

    expect(screen.getByText('5 results')).toBeDefined()
  })

  it('should display singular "result" for count of 1', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} resultCount={1} />)

    expect(screen.getByText('1 result')).toBeDefined()
  })

  it('should not display result count when undefined', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    expect(screen.queryByText(/result/)).toBeNull()
  })

  it('should have proper ARIA attributes', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText('Search transcript...')
    expect(input.getAttribute('aria-label')).toBe('Search transcript')
  })

  it('should have role="search" on container', () => {
    const onSearchChange = jest.fn()
    const { container } = render(
      <TranscriptSearch onSearchChange={onSearchChange} />
    )

    const searchContainer = container.querySelector('[role="search"]')
    expect(searchContainer).toBeDefined()
  })

  it('should link result count to input with aria-describedby', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} resultCount={3} />)

    const input = screen.getByPlaceholderText('Search transcript...')
    const resultCount = screen.getByText('3 results')

    expect(input.getAttribute('aria-describedby')).toBe('search-results')
    expect(resultCount.id).toBe('search-results')
  })

  it('should have aria-live on result count for screen readers', () => {
    const onSearchChange = jest.fn()
    render(<TranscriptSearch onSearchChange={onSearchChange} resultCount={5} />)

    const resultCount = screen.getByText('5 results')
    expect(resultCount.getAttribute('aria-live')).toBe('polite')
  })

  it('should handle empty search gracefully', async () => {
    const onSearchChange = jest.fn()
    const user = userEvent.setup()

    render(<TranscriptSearch onSearchChange={onSearchChange} />)

    const input = screen.getByPlaceholderText('Search transcript...')

    // Type and then clear
    await user.type(input, 'test')
    await user.clear(input)

    const inputElement = input as HTMLInputElement
    expect(inputElement.value).toBe('')
  })
})
