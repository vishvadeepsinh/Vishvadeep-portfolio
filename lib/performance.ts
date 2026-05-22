"use client"

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private marks: Map<string, number> = new Map()

  startMeasure(name: string): void {
    this.marks.set(name, performance.now())
  }

  endMeasure(name: string): number {
    const startTime = this.marks.get(name)
    if (!startTime) {
      console.warn(`[Performance] No start mark found for: ${name}`)
      return 0
    }

    const duration = performance.now() - startTime
    this.marks.delete(name)

    this.metrics.push({
      name,
      value: duration,
      timestamp: Date.now(),
    })

    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`)
    return duration
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getAverageMetric(name: string): number {
    const filtered = this.metrics.filter((m) => m.name === name)
    if (filtered.length === 0) return 0

    const sum = filtered.reduce((acc, m) => acc + m.value, 0)
    return sum / filtered.length
  }

  clearMetrics(): void {
    this.metrics = []
  }

  logSummary(): void {
    const uniqueNames = [...new Set(this.metrics.map((m) => m.name))]
    console.log("\n[Performance Summary]")
    uniqueNames.forEach((name) => {
      const avg = this.getAverageMetric(name)
      console.log(`  ${name}: ${avg.toFixed(2)}ms (avg)`)
    })
  }
}

export const perfMonitor = new PerformanceMonitor()

// Log summary on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    perfMonitor.logSummary()
  })
}
