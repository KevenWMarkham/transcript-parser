/**
 * Token Usage & Cost Tracking Service
 * Tracks LLM API usage with real-time cost calculations
 */

export interface UsageRecord {
  id: string;
  timestamp: number;
  model: string;
  operation: string;
  inputTokens: number;
  outputTokens: number;
  cachedTokens?: number;
  totalCost: number;
}

export interface UsageStats {
  totalTokens: number;
  totalCost: number;
  operationCount: number;
  byModel: Map<string, { tokens: number; cost: number; count: number }>;
  byOperation: Map<string, { tokens: number; cost: number; count: number }>;
  avgCostPerOperation: number;
}

// Gemini 2.5 Flash Pricing (as of Dec 2024)
// Source: https://ai.google.dev/pricing
const PRICING = {
  "gemini-2.5-flash": {
    input: 0.00001875, // $0.00001875 per 1K tokens ($0.075 per 1M)
    output: 0.00007500, // $0.00007500 per 1K tokens ($0.30 per 1M)
    inputCached: 0.0000046875, // 75% discount ($0.01875 per 1M)
    outputCached: 0.0000046875, // 75% discount
  },
  "gemini-1.5-flash": {
    input: 0.00001875,
    output: 0.00007500,
    inputCached: 0.0000046875,
    outputCached: 0.0000046875,
  },
  "gemini-1.5-pro": {
    input: 0.00125, // $1.25 per 1M tokens
    output: 0.005, // $5.00 per 1M tokens
    inputCached: 0.0003125, // 75% discount
    outputCached: 0.0003125,
  },
};

type ModelKey = keyof typeof PRICING;

class UsageTracker {
  private records: UsageRecord[] = [];
  private listeners: Set<(stats: UsageStats) => void> = new Set();

  /**
   * Track a new API usage
   */
  track(params: {
    model: ModelKey;
    operation: string;
    inputTokens: number;
    outputTokens: number;
    cachedTokens?: number;
  }): UsageRecord {
    const pricing = PRICING[params.model];
    if (!pricing) {
      console.warn(`Unknown model: ${params.model}, using default pricing`);
    }

    // Calculate cost
    const cachedTokens = params.cachedTokens || 0;
    const regularInputTokens = params.inputTokens - cachedTokens;

    const inputCost = (regularInputTokens / 1000) * (pricing?.input || 0);
    const cachedCost = (cachedTokens / 1000) * (pricing?.inputCached || 0);
    const outputCost = (params.outputTokens / 1000) * (pricing?.output || 0);
    const totalCost = inputCost + cachedCost + outputCost;

    const record: UsageRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      model: params.model,
      operation: params.operation,
      inputTokens: params.inputTokens,
      outputTokens: params.outputTokens,
      cachedTokens: params.cachedTokens,
      totalCost,
    };

    this.records.push(record);
    this.notifyListeners();

    // Log in development
    if (import.meta.env.DEV) {
      console.log(
        `💰 API Usage: ${params.operation} | ${params.inputTokens + params.outputTokens} tokens | $${totalCost.toFixed(6)}`
      );
    }

    return record;
  }

  /**
   * Get aggregated statistics
   */
  getStats(): UsageStats {
    if (this.records.length === 0) {
      return {
        totalTokens: 0,
        totalCost: 0,
        operationCount: 0,
        byModel: new Map(),
        byOperation: new Map(),
        avgCostPerOperation: 0,
      };
    }

    let totalTokens = 0;
    let totalCost = 0;
    const byModel = new Map<string, { tokens: number; cost: number; count: number }>();
    const byOperation = new Map<string, { tokens: number; cost: number; count: number }>();

    this.records.forEach((record) => {
      const tokens = record.inputTokens + record.outputTokens;
      totalTokens += tokens;
      totalCost += record.totalCost;

      // By model
      const modelStats = byModel.get(record.model) || { tokens: 0, cost: 0, count: 0 };
      modelStats.tokens += tokens;
      modelStats.cost += record.totalCost;
      modelStats.count++;
      byModel.set(record.model, modelStats);

      // By operation
      const opStats = byOperation.get(record.operation) || { tokens: 0, cost: 0, count: 0 };
      opStats.tokens += tokens;
      opStats.cost += record.totalCost;
      opStats.count++;
      byOperation.set(record.operation, opStats);
    });

    return {
      totalTokens,
      totalCost,
      operationCount: this.records.length,
      byModel,
      byOperation,
      avgCostPerOperation: totalCost / this.records.length,
    };
  }

  /**
   * Get recent records
   */
  getRecords(limit?: number): UsageRecord[] {
    const records = [...this.records].reverse();
    return limit ? records.slice(0, limit) : records;
  }

  /**
   * Clear all records
   */
  clear() {
    this.records = [];
    this.notifyListeners();
  }

  /**
   * Subscribe to stats updates
   */
  subscribe(listener: (stats: UsageStats) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const stats = this.getStats();
    this.listeners.forEach((listener) => listener(stats));
  }

  /**
   * Simulate usage for demo purposes
   */
  simulateUsage() {
    const operations = [
      "transcribe_video",
      "speaker_diarization",
      "timestamp_alignment",
      "confidence_scoring",
    ];
    const models: ModelKey[] = ["gemini-2.5-flash", "gemini-1.5-flash"];

    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const randomModel = models[Math.floor(Math.random() * models.length)];

    this.track({
      model: randomModel,
      operation: randomOp,
      inputTokens: Math.floor(Math.random() * 5000) + 1000,
      outputTokens: Math.floor(Math.random() * 2000) + 500,
      cachedTokens: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) : 0,
    });
  }
}

// Export singleton instance
export const usageTracker = new UsageTracker();

// Export utility functions
export const trackUsage = usageTracker.track.bind(usageTracker);
export const getUsageStats = usageTracker.getStats.bind(usageTracker);
export const getUsageRecords = usageTracker.getRecords.bind(usageTracker);
export const clearUsage = usageTracker.clear.bind(usageTracker);
export const subscribeToUsage = usageTracker.subscribe.bind(usageTracker);
export const simulateUsage = usageTracker.simulateUsage.bind(usageTracker);
