// Performance monitoring utilities

import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.setupWebVitals();
    this.setupResourceTiming();
  }

  // Start timing a custom metric
  startTiming(name: string): void {
    this.timers.set(name, performance.now());
  }

  // End timing and record metric
  endTiming(name: string, metadata?: Record<string, unknown>): number {
    const startTime = this.timers.get(name);
    if (!startTime) {
      logger.warn(`No start time found for metric: ${name}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.recordMetric(name, duration, metadata);
    this.timers.delete(name);

    return duration;
  }

  // Record a custom metric
  recordMetric(name: string, duration: number, metadata?: Record<string, unknown>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    logger.debug('Performance metric recorded', { name, duration, metadata });
  }

  // Get metrics by name
  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  // Get average duration for a metric
  getAverageDuration(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const total = metrics.reduce((sum, metric) => sum + metric.duration, 0);
    return total / metrics.length;
  }

  // Clear old metrics (keep last 1000)
  clearOldMetrics(): void {
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  // Setup Web Vitals monitoring
  private setupWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Largest Contentful Paint
    this.observeLCP();

    // First Input Delay
    this.observeFID();

    // Cumulative Layout Shift
    this.observeCLS();

    // First Contentful Paint
    this.observeFCP();
  }

  private observeLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('LCP', lastEntry.startTime, {
          element: (lastEntry as PerformanceEntry & { element?: Element }).element?.tagName,
          url: (lastEntry as PerformanceEntry & { url?: string }).url,
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    }
  }

  private observeFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & { processingStart: number };
          this.recordMetric('FID', fidEntry.processingStart - fidEntry.startTime, {
            eventType: fidEntry.name,
          });
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    }
  }

  private observeCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
          }
        });
        this.recordMetric('CLS', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    }
  }

  private observeFCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric('FCP', entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    }
  }

  // Setup resource timing monitoring
  private setupResourceTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      resources.forEach((resource) => {
        const resourceEntry = resource as PerformanceEntry & { initiatorType: string; transferSize: number };
        this.recordMetric('Resource Load', resourceEntry.duration, {
          name: resourceEntry.name,
          type: resourceEntry.initiatorType,
          size: resourceEntry.transferSize,
        });
      });
    });
  }

  // Monitor API calls
  monitorApiCall<T>(
    apiCall: () => Promise<T>,
    name: string,
    metadata?: Record<string, unknown>
  ): Promise<T> {
    this.startTiming(name);

    return apiCall()
      .then((result) => {
        this.endTiming(name, { ...metadata, success: true });
        return result;
      })
      .catch((error) => {
        this.endTiming(name, { ...metadata, success: false, error: error.message });
        throw error;
      });
  }

  // Monitor component render time
  monitorComponentRender(componentName: string, renderFn: () => void): void {
    this.startTiming(`render_${componentName}`);
    renderFn();
    this.endTiming(`render_${componentName}`);
  }

  // Get performance summary
  getPerformanceSummary(): Record<string, unknown> {
    const summary: Record<string, unknown> = {};

    // Group metrics by name
    const groupedMetrics = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) {
        acc[metric.name] = [];
      }
      acc[metric.name].push(metric.duration);
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate statistics for each metric
    Object.entries(groupedMetrics).forEach(([name, durations]) => {
      const sorted = durations.sort((a, b) => a - b);
      summary[name] = {
        count: durations.length,
        average: durations.reduce((a, b) => a + b, 0) / durations.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p50: sorted[Math.floor(sorted.length * 0.5)],
        p95: sorted[Math.floor(sorted.length * 0.95)],
        p99: sorted[Math.floor(sorted.length * 0.99)],
      };
    });

    return summary;
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startTiming = (metricName: string) => {
    performanceMonitor.startTiming(`${componentName}_${metricName}`);
  };

  const endTiming = (metricName: string, metadata?: Record<string, unknown>) => {
    return performanceMonitor.endTiming(`${componentName}_${metricName}`, metadata);
  };

  const recordMetric = (metricName: string, duration: number, metadata?: Record<string, unknown>) => {
    performanceMonitor.recordMetric(`${componentName}_${metricName}`, duration, metadata);
  };

  return {
    startTiming,
    endTiming,
    recordMetric,
  };
}
