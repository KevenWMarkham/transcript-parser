/**
 * Performance benchmarking utilities for monitoring component render times,
 * virtual list performance, and memory usage
 */

export interface PerformanceMetrics {
  componentName: string
  renderTime: number
  timestamp: number
}

export interface MemoryMetrics {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
}

class PerformanceBenchmark {
  private metrics: PerformanceMetrics[] = []
  private renderStartTimes: Map<string, number> = new Map()

  /**
   * Start measuring render time for a component
   */
  startRender(componentName: string): void {
    this.renderStartTimes.set(componentName, performance.now())
  }

  /**
   * End measuring render time and record metrics
   */
  endRender(componentName: string): number {
    const startTime = this.renderStartTimes.get(componentName)
    if (!startTime) {
      console.warn(`No start time found for component: ${componentName}`)
      return 0
    }

    const renderTime = performance.now() - startTime
    this.renderStartTimes.delete(componentName)

    const metric: PerformanceMetrics = {
      componentName,
      renderTime,
      timestamp: Date.now(),
    }

    this.metrics.push(metric)

    // Keep only last 100 measurements to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics.shift()
    }

    return renderTime
  }

  /**
   * Measure a function execution time
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now()
    const result = await fn()
    const duration = performance.now() - start

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  }

  /**
   * Measure a synchronous function execution time
   */
  measure<T>(name: string, fn: () => T): { result: T; duration: number } {
    const start = performance.now()
    const result = fn()
    const duration = performance.now() - start

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return { result, duration }
  }

  /**
   * Get average render time for a component
   */
  getAverageRenderTime(componentName: string): number {
    const componentMetrics = this.metrics.filter(
      m => m.componentName === componentName
    )

    if (componentMetrics.length === 0) return 0

    const total = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0)
    return total / componentMetrics.length
  }

  /**
   * Get all metrics for a component
   */
  getMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.componentName === componentName)
  }

  /**
   * Get all recorded metrics
   */
  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.renderStartTimes.clear()
  }

  /**
   * Get current memory usage (Chrome only)
   */
  getMemoryUsage(): MemoryMetrics | null {
    if ('memory' in performance && performance.memory) {
      const memory = performance.memory as {
        usedJSHeapSize: number
        totalJSHeapSize: number
        jsHeapSizeLimit: number
      }

      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      }
    }

    return null
  }

  /**
   * Format memory size to human-readable string
   */
  formatMemorySize(bytes: number): string {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  /**
   * Log performance summary
   */
  logSummary(): void {
    const componentNames = new Set(this.metrics.map(m => m.componentName))

    console.log('=== Performance Summary ===')

    componentNames.forEach(name => {
      const avg = this.getAverageRenderTime(name)
      const metrics = this.getMetrics(name)
      const min = Math.min(...metrics.map(m => m.renderTime))
      const max = Math.max(...metrics.map(m => m.renderTime))

      console.log(`${name}:`)
      console.log(`  Renders: ${metrics.length}`)
      console.log(`  Average: ${avg.toFixed(2)}ms`)
      console.log(`  Min: ${min.toFixed(2)}ms`)
      console.log(`  Max: ${max.toFixed(2)}ms`)
    })

    const memory = this.getMemoryUsage()
    if (memory) {
      console.log('\nMemory Usage:')
      console.log(`  Used: ${this.formatMemorySize(memory.usedJSHeapSize)}`)
      console.log(`  Total: ${this.formatMemorySize(memory.totalJSHeapSize)}`)
      console.log(`  Limit: ${this.formatMemorySize(memory.jsHeapSizeLimit)}`)
    }

    console.log('==========================')
  }

  /**
   * Monitor FPS (frames per second)
   */
  monitorFPS(callback: (fps: number) => void, duration = 5000): () => void {
    let frameCount = 0
    let lastTime = performance.now()
    let rafId: number

    const countFrame = () => {
      frameCount++
      const currentTime = performance.now()
      const elapsed = currentTime - lastTime

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed)
        callback(fps)
        frameCount = 0
        lastTime = currentTime
      }

      rafId = requestAnimationFrame(countFrame)
    }

    rafId = requestAnimationFrame(countFrame)

    // Auto-stop after duration
    const timeoutId = setTimeout(() => {
      cancelAnimationFrame(rafId)
    }, duration)

    // Return cleanup function
    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
    }
  }
}

// Export singleton instance
export const performanceBenchmark = new PerformanceBenchmark()

// Export class for testing
export { PerformanceBenchmark }
