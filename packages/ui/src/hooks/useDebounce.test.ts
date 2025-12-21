import { renderHook, act } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    expect(result.current).toBe('initial')

    // Update value
    rerender({ value: 'updated' })
    expect(result.current).toBe('initial') // Still initial, not debounced yet

    // Fast-forward time by 299ms
    act(() => {
      jest.advanceTimersByTime(299)
    })
    expect(result.current).toBe('initial') // Still initial

    // Fast-forward the remaining 1ms
    act(() => {
      jest.advanceTimersByTime(1)
    })
    expect(result.current).toBe('updated') // Now updated
  })

  it('should reset debounce timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    // Rapid updates
    rerender({ value: 'update1' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    rerender({ value: 'update2' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    rerender({ value: 'final' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Should still be initial because timer keeps resetting
    expect(result.current).toBe('initial')

    // Complete the debounce
    act(() => {
      jest.advanceTimersByTime(200)
    })

    // Should now be final
    expect(result.current).toBe('final')
  })

  it('should work with custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })

    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current).toBe('updated')
  })

  it('should handle different value types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 0 } }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42 })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    expect(result.current).toBe(42)
  })

  it('should cleanup timer on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'updated' })
    unmount()

    // No error should occur
    act(() => {
      jest.advanceTimersByTime(300)
    })
  })
})
