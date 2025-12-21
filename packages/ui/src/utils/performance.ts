/**
 * Performance monitoring utilities for tracking render performance
 */

export interface PerformanceMetrics {
  duration: number
  timestamp: number
  operation: string
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics[]> = new Map()
  private enabled: boolean = import.meta.env.DEV

  /**
   * Start timing an operation
   */
  start(operationName: string): () => void {
    if (!this.enabled) return () => {}

    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      this.recordMetric(operationName, duration)
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(operation: string, duration: number) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, [])
    }

    const metrics = this.metrics.get(operation)!
    metrics.push({
      duration,
      timestamp: Date.now(),
      operation,
    })

    // Keep only last 100 measurements per operation
    if (metrics.length > 100) {
      metrics.shift()
    }

    // Log slow operations (> 16ms for 60fps)
    if (duration > 16) {
      console.warn(
        `[Performance] Slow operation "${operation}": ${duration.toFixed(2)}ms`
      )
    }
  }

  /**
   * Get metrics for an operation
   */
  getMetrics(operation: string): PerformanceMetrics[] {
    return this.metrics.get(operation) || []
  }

  /**
   * Get average duration for an operation
   */
  getAverageDuration(operation: string): number {
    const metrics = this.getMetrics(operation)
    if (metrics.length === 0) return 0

    const total = metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / metrics.length
  }

  /**
   * Get all operations and their average durations
   */
  getAllMetrics(): Record<string, { avg: number; count: number; max: number }> {
    const result: Record<
      string,
      { avg: number; count: number; max: number }
    > = {}

    this.metrics.forEach((metrics, operation) => {
      const avg = this.getAverageDuration(operation)
      const max = Math.max(...metrics.map(m => m.duration))
      result[operation] = {
        avg,
        count: metrics.length,
        max,
      }
    })

    return result
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics.clear()
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Hook for monitoring component render performance
 */
export function usePerformanceMonitor(componentName: string) {
  if (import.meta.env.DEV) {
    const endTiming = performanceMonitor.start(`${componentName} render`)
    return () => endTiming()
  }
  return () => {}
}

/**
 * Measure the execution time of a function
 */
export async function measureAsync<T>(
  operation: string,
  fn: () => Promise<T>
): Promise<T> {
  const end = performanceMonitor.start(operation)
  try {
    return await fn()
  } finally {
    end()
  }
}

/**
 * Measure the execution time of a synchronous function
 */
export function measure<T>(operation: string, fn: () => T): T {
  const end = performanceMonitor.start(operation)
  try {
    return fn()
  } finally {
    end()
  }
}
