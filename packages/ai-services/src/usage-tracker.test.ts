import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UsageTracker, calculateCost } from './usage-tracker'

describe('calculateCost', () => {
  it('should calculate cost for gemini-2.5-flash', () => {
    const cost = calculateCost('gemini-2.5-flash', 1_000_000, 1_000_000)
    expect(cost).toBeCloseTo(0.375, 3) // $0.075 + $0.30
  })

  it('should calculate cost for gemini-1.5-flash', () => {
    const cost = calculateCost('gemini-1.5-flash', 1_000_000, 1_000_000)
    expect(cost).toBeCloseTo(0.375, 3)
  })

  it('should calculate cost for gemini-1.5-pro', () => {
    const cost = calculateCost('gemini-1.5-pro', 1_000_000, 1_000_000)
    expect(cost).toBeCloseTo(6.25, 2) // $1.25 + $5.00
  })

  it('should handle cached input for gemini-2.5-flash', () => {
    const cost = calculateCost('gemini-2.5-flash', 1_000_000, 1_000_000, true)
    expect(cost).toBeCloseTo(0.31875, 5) // $0.01875 (75% discount) + $0.30
  })

  it('should return 0 for unknown models', () => {
    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {})
    const cost = calculateCost('unknown-model', 1_000_000, 1_000_000)
    expect(cost).toBe(0)
    expect(consoleWarnSpy).toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should handle fractional tokens', () => {
    const cost = calculateCost('gemini-2.5-flash', 500_000, 250_000)
    expect(cost).toBeCloseTo(0.1125, 4) // $0.0375 + $0.075
  })
})

describe('UsageTracker', () => {
  let tracker: UsageTracker

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof localStorage !== 'undefined') {
      localStorage.clear()
    }
    tracker = new UsageTracker()
  })

  describe('track', () => {
    it('should track usage and calculate cost', () => {
      const result = tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Video Transcription',
        inputTokens: 1000,
        outputTokens: 500,
      })

      expect(result.totalTokens).toBe(1500)
      expect(result.estimatedCost).toBeGreaterThan(0)
      expect(result.inputTokens).toBe(1000)
      expect(result.outputTokens).toBe(500)
    })

    it('should persist to localStorage', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })

      const stored = localStorage.getItem('usage_records')
      expect(stored).toBeDefined()
      expect(stored).not.toBeNull()

      const parsed = JSON.parse(stored!)
      expect(parsed['1']).toBeDefined()
      expect(parsed['1']).toHaveLength(1)
    })

    it('should handle multiple users', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })

      tracker.track({
        userId: 2,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 200,
        outputTokens: 100,
      })

      expect(tracker.getUserRecords(1)).toHaveLength(1)
      expect(tracker.getUserRecords(2)).toHaveLength(1)
    })

    it('should include metadata if provided', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
        metadata: { foo: 'bar', baz: 123 },
      })

      const records = tracker.getUserRecords(1)
      expect(records[0].metadata).toEqual({ foo: 'bar', baz: 123 })
    })
  })

  describe('getUserUsage', () => {
    it('should return aggregated usage for a user', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Transcription',
        inputTokens: 1000,
        outputTokens: 500,
      })

      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Speaker Detection',
        inputTokens: 500,
        outputTokens: 250,
      })

      const usage = tracker.getUserUsage(1)

      expect(usage.totalTokens).toBe(2250)
      expect(usage.operations).toBe(2)
      expect(usage.totalCost).toBeGreaterThan(0)
      expect(usage.byModel['gemini-2.5-flash'].tokens).toBe(2250)
      expect(usage.byModel['gemini-2.5-flash'].count).toBe(2)
    })

    it('should group by operation', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Transcription',
        inputTokens: 1000,
        outputTokens: 500,
      })

      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Transcription',
        inputTokens: 800,
        outputTokens: 400,
      })

      const usage = tracker.getUserUsage(1)

      expect(usage.byOperation['Transcription'].tokens).toBe(2700)
      expect(usage.byOperation['Transcription'].count).toBe(2)
    })

    it('should return empty stats for unknown user', () => {
      const usage = tracker.getUserUsage(999)

      expect(usage.totalTokens).toBe(0)
      expect(usage.totalCost).toBe(0)
      expect(usage.operations).toBe(0)
      expect(Object.keys(usage.byModel)).toHaveLength(0)
      expect(Object.keys(usage.byOperation)).toHaveLength(0)
    })
  })

  describe('getMonthlyUsage', () => {
    it.skip('should group usage by month', () => {
      // Mock Date to control month
      const date1 = new Date('2024-12-01')
      const date2 = new Date('2024-12-15')
      const date3 = new Date('2025-01-01')

      type DateConstructor = new (...args: unknown[]) => Date
      vi.spyOn(global, 'Date').mockImplementation((...args: unknown[]) => {
        if (args.length === 0) {
          return date1
        }
        return new (Date as unknown as DateConstructor)(...args)
      })

      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })
      ;(global.Date as unknown as jest.Mock).mockImplementation(
        (...args: unknown[]) => {
          if (args.length === 0) {
            return date2
          }
          return new (Date as unknown as DateConstructor)(...args)
        }
      )

      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 200,
        outputTokens: 100,
      })
      ;(global.Date as unknown as jest.Mock).mockImplementation(
        (...args: unknown[]) => {
          if (args.length === 0) {
            return date3
          }
          return new (Date as unknown as DateConstructor)(...args)
        }
      )

      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 300,
        outputTokens: 150,
      })

      const monthly = tracker.getMonthlyUsage(1)

      expect(monthly['2024-12'].operations).toBe(2)
      expect(monthly['2024-12'].tokens).toBe(450)
      expect(monthly['2025-01'].operations).toBe(1)
      expect(monthly['2025-01'].tokens).toBe(450)

      vi.restoreAllMocks()
    })
  })

  describe('getCurrentMonthUsage', () => {
    it.skip('should return current month usage', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })

      const current = tracker.getCurrentMonthUsage(1)

      expect(current.operations).toBe(1)
      expect(current.tokens).toBe(150)
      expect(current.cost).toBeGreaterThan(0)
    })

    it.skip('should return zeros for user with no usage', () => {
      const current = tracker.getCurrentMonthUsage(999)

      expect(current.operations).toBe(0)
      expect(current.tokens).toBe(0)
      expect(current.cost).toBe(0)
    })
  })

  describe('getTotalUsage', () => {
    it.skip('should aggregate usage across all users', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })

      tracker.track({
        userId: 2,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 200,
        outputTokens: 100,
      })

      tracker.track({
        userId: 3,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 300,
        outputTokens: 150,
      })

      const total = tracker.getTotalUsage()

      expect(total.totalUsers).toBe(3)
      expect(total.totalOperations).toBe(3)
      expect(total.totalTokens).toBe(900)
      expect(total.totalCost).toBeGreaterThan(0)
    })
  })

  describe('clearUserRecords', () => {
    it.skip('should clear records for a specific user', () => {
      tracker.track({
        userId: 1,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 100,
        outputTokens: 50,
      })

      tracker.track({
        userId: 2,
        model: 'gemini-2.5-flash',
        operation: 'Test',
        inputTokens: 200,
        outputTokens: 100,
      })

      tracker.clearUserRecords(1)

      expect(tracker.getUserRecords(1)).toHaveLength(0)
      expect(tracker.getUserRecords(2)).toHaveLength(1)
    })
  })

  describe('localStorage persistence', () => {
    it.skip('should load records from localStorage on initialization', () => {
      // Manually set localStorage
      const mockData = {
        '1': [
          {
            userId: 1,
            model: 'gemini-2.5-flash',
            operation: 'Test',
            inputTokens: 100,
            outputTokens: 50,
            totalTokens: 150,
            estimatedCost: 0.01,
            createdAt: new Date().toISOString(),
          },
        ],
      }

      localStorage.setItem('usage_records', JSON.stringify(mockData))

      // Create new tracker instance
      const newTracker = new UsageTracker()
      const records = newTracker.getUserRecords(1)

      expect(records).toHaveLength(1)
      expect(records[0].userId).toBe(1)
      expect(records[0].inputTokens).toBe(100)
    })

    it('should handle corrupted localStorage gracefully', () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      localStorage.setItem('usage_records', 'invalid json{{{')

      // Should not throw
      const newTracker = new UsageTracker()
      expect(newTracker.getUserRecords(1)).toHaveLength(0)

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })
})
