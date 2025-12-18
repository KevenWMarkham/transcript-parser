/**
 * LLM Usage Tracking Service
 * Tracks token usage and costs for LLM API calls per user
 */

export interface UsageMetrics {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
}

export interface UsageRecord extends UsageMetrics {
  id?: number
  userId: number
  model: string
  operation: string
  metadata?: Record<string, any>
  createdAt: Date
}

// Gemini 2.5 Flash pricing (as of Dec 2024)
// Source: https://ai.google.dev/pricing
const GEMINI_PRICING = {
  'gemini-2.5-flash': {
    input: 0.075 / 1_000_000, // $0.075 per 1M input tokens
    output: 0.30 / 1_000_000, // $0.30 per 1M output tokens
    cachedInput: 0.01875 / 1_000_000, // $0.01875 per 1M cached tokens (75% discount)
  },
  'gemini-1.5-flash': {
    input: 0.075 / 1_000_000,
    output: 0.30 / 1_000_000,
  },
  'gemini-1.5-pro': {
    input: 1.25 / 1_000_000, // $1.25 per 1M input tokens
    output: 5.0 / 1_000_000, // $5.00 per 1M output tokens
  },
}

/**
 * Calculate the cost for a given model and token usage
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  usedCache: boolean = false
): number {
  const pricing = GEMINI_PRICING[model as keyof typeof GEMINI_PRICING]
  if (!pricing) {
    console.warn(`Unknown model pricing: ${model}, using default rates`)
    return 0
  }

  const inputCost = usedCache && 'cachedInput' in pricing
    ? inputTokens * pricing.cachedInput
    : inputTokens * pricing.input

  const outputCost = outputTokens * pricing.output

  return inputCost + outputCost
}

/**
 * Usage tracker class for tracking LLM usage in-memory and persisting to DB
 */
export class UsageTracker {
  private usageRecords: Map<number, UsageRecord[]> = new Map()

  /**
   * Track a usage event
   */
  track(record: Omit<UsageRecord, 'id' | 'createdAt' | 'estimatedCost'>): UsageMetrics {
    const estimatedCost = calculateCost(
      record.model,
      record.inputTokens,
      record.outputTokens
    )

    const fullRecord: UsageRecord = {
      ...record,
      totalTokens: record.inputTokens + record.outputTokens,
      estimatedCost,
      createdAt: new Date(),
    }

    // Store in memory
    const userRecords = this.usageRecords.get(record.userId) || []
    userRecords.push(fullRecord)
    this.usageRecords.set(record.userId, userRecords)

    // TODO: Persist to database via API
    // In a real app, you would call an API endpoint here to persist to DB

    return {
      inputTokens: record.inputTokens,
      outputTokens: record.outputTokens,
      totalTokens: fullRecord.totalTokens,
      estimatedCost,
    }
  }

  /**
   * Get usage statistics for a user
   */
  getUserUsage(userId: number): {
    totalTokens: number
    totalCost: number
    operations: number
    byModel: Record<string, { tokens: number; cost: number; count: number }>
    byOperation: Record<string, { tokens: number; cost: number; count: number }>
  } {
    const records = this.usageRecords.get(userId) || []

    const stats = {
      totalTokens: 0,
      totalCost: 0,
      operations: records.length,
      byModel: {} as Record<string, { tokens: number; cost: number; count: number }>,
      byOperation: {} as Record<string, { tokens: number; cost: number; count: number }>,
    }

    for (const record of records) {
      stats.totalTokens += record.totalTokens
      stats.totalCost += record.estimatedCost

      // Group by model
      if (!stats.byModel[record.model]) {
        stats.byModel[record.model] = { tokens: 0, cost: 0, count: 0 }
      }
      stats.byModel[record.model].tokens += record.totalTokens
      stats.byModel[record.model].cost += record.estimatedCost
      stats.byModel[record.model].count++

      // Group by operation
      if (!stats.byOperation[record.operation]) {
        stats.byOperation[record.operation] = { tokens: 0, cost: 0, count: 0 }
      }
      stats.byOperation[record.operation].tokens += record.totalTokens
      stats.byOperation[record.operation].cost += record.estimatedCost
      stats.byOperation[record.operation].count++
    }

    return stats
  }

  /**
   * Get all usage records for a user
   */
  getUserRecords(userId: number): UsageRecord[] {
    return this.usageRecords.get(userId) || []
  }

  /**
   * Clear usage records for a user (for testing)
   */
  clearUserRecords(userId: number): void {
    this.usageRecords.delete(userId)
  }

  /**
   * Get total usage across all users (admin function)
   */
  getTotalUsage(): {
    totalTokens: number
    totalCost: number
    totalOperations: number
    totalUsers: number
  } {
    let totalTokens = 0
    let totalCost = 0
    let totalOperations = 0

    for (const records of this.usageRecords.values()) {
      for (const record of records) {
        totalTokens += record.totalTokens
        totalCost += record.estimatedCost
        totalOperations++
      }
    }

    return {
      totalTokens,
      totalCost,
      totalOperations,
      totalUsers: this.usageRecords.size,
    }
  }
}

// Singleton instance
export const usageTracker = new UsageTracker()
