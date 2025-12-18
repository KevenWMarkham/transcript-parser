/**
 * Performance Monitoring Utility
 * Development-only monitoring with zero overhead in production
 */

const isDevelopment = import.meta.env.DEV;

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

interface PerformanceStats {
  count: number;
  total: number;
  avg: number;
  max: number;
  min: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private warningThreshold = 16; // 60fps threshold in ms

  /**
   * Measure synchronous operation performance
   */
  measure<T>(name: string, fn: () => T): T {
    if (!isDevelopment) return fn();

    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    return result;
  }

  /**
   * Measure asynchronous operation performance
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!isDevelopment) return fn();

    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    this.recordMetric(name, duration);
    return result;
  }

  /**
   * Start a manual measurement
   */
  start(name: string): () => void {
    if (!isDevelopment) return () => {};

    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  private recordMetric(name: string, duration: number) {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    // Warn about slow operations
    if (duration > this.warningThreshold) {
      console.warn(
        `⚠️ Slow operation detected: ${name} took ${duration.toFixed(2)}ms (threshold: ${this.warningThreshold}ms)`
      );
    }

    // Keep only last 1000 metrics to prevent memory leaks
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Get statistics for a specific operation
   */
  getStats(name?: string): Map<string, PerformanceStats> {
    if (!isDevelopment) return new Map();

    const metricsToAnalyze = name
      ? this.metrics.filter((m) => m.name === name)
      : this.metrics;

    const statsMap = new Map<string, PerformanceStats>();
    const groupedMetrics = new Map<string, number[]>();

    // Group metrics by name
    metricsToAnalyze.forEach((metric) => {
      const durations = groupedMetrics.get(metric.name) || [];
      durations.push(metric.duration);
      groupedMetrics.set(metric.name, durations);
    });

    // Calculate statistics for each group
    groupedMetrics.forEach((durations, metricName) => {
      const total = durations.reduce((sum, d) => sum + d, 0);
      const avg = total / durations.length;
      const max = Math.max(...durations);
      const min = Math.min(...durations);

      statsMap.set(metricName, {
        count: durations.length,
        total,
        avg,
        max,
        min,
      });
    });

    return statsMap;
  }

  /**
   * Clear all collected metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Log all statistics to console
   */
  logStats() {
    if (!isDevelopment) return;

    const stats = this.getStats();
    if (stats.size === 0) {
      console.log("No performance metrics collected");
      return;
    }

    console.group("📊 Performance Statistics");
    stats.forEach((stat, name) => {
      console.log(
        `${name}:`,
        `avg=${stat.avg.toFixed(2)}ms`,
        `max=${stat.max.toFixed(2)}ms`,
        `min=${stat.min.toFixed(2)}ms`,
        `count=${stat.count}`
      );
    });
    console.groupEnd();
  }
}

// Export singleton instance
export const perfMonitor = new PerformanceMonitor();

// Export utility functions
export const measure = perfMonitor.measure.bind(perfMonitor);
export const measureAsync = perfMonitor.measureAsync.bind(perfMonitor);
export const startMeasure = perfMonitor.start.bind(perfMonitor);
export const getStats = perfMonitor.getStats.bind(perfMonitor);
export const logStats = perfMonitor.logStats.bind(perfMonitor);
export const clearStats = perfMonitor.clear.bind(perfMonitor);
