/**
 * Test Features Module
 * Provides utilities for testing and feature toggling
 */

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  version: string;
}

export interface TestMetrics {
  timestamp: number;
  feature: string;
  duration: number;
  success: boolean;
  error?: string;
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private metrics: TestMetrics[] = [];

  constructor() {
    this.initializeFlags();
  }

  private initializeFlags() {
    this.registerFlag('advanced-analytics', true, 'Advanced analytics tracking', '1.0.0');
    this.registerFlag('beta-ui-components', false, 'Beta UI component library', '1.1.0');
    this.registerFlag('performance-monitoring', true, 'Real-time performance monitoring', '1.0.0');
    this.registerFlag('experimental-ai-features', false, 'Experimental AI features', '2.0.0');
    this.registerFlag('enhanced-caching', true, 'Enhanced response caching', '1.0.0');
  }

  registerFlag(name: string, enabled: boolean, description: string, version: string) {
    this.flags.set(name, { name, enabled, description, version });
  }

  isFeatureEnabled(name: string): boolean {
    return this.flags.get(name)?.enabled ?? false;
  }

  enableFeature(name: string) {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = true;
    }
  }

  disableFeature(name: string) {
    const flag = this.flags.get(name);
    if (flag) {
      flag.enabled = false;
    }
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  recordMetric(feature: string, duration: number, success: boolean, error?: string) {
    this.metrics.push({
      timestamp: Date.now(),
      feature,
      duration,
      success,
      error,
    });
  }

  getMetrics(feature?: string): TestMetrics[] {
    if (!feature) return this.metrics;
    return this.metrics.filter(m => m.feature === feature);
  }

  clearMetrics() {
    this.metrics = [];
  }

  getReport() {
    return {
      flags: this.getAllFlags(),
      metrics: this.metrics,
      summary: {
        totalMetrics: this.metrics.length,
        successRate: this.calculateSuccessRate(),
        averageDuration: this.calculateAverageDuration(),
      },
    };
  }

  private calculateSuccessRate(): number {
    if (this.metrics.length === 0) return 0;
    const successful = this.metrics.filter(m => m.success).length;
    return (successful / this.metrics.length) * 100;
  }

  private calculateAverageDuration(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }
}

// Export singleton instance
export const featureFlagManager = new FeatureFlagManager();

/**
 * Measure execution time and record metrics
 */
export async function measurePerformance<T>(
  featureName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    featureFlagManager.recordMetric(featureName, duration, true);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    featureFlagManager.recordMetric(
      featureName,
      duration,
      false,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}

/**
 * Synchronous version of performance measurement
 */
export function measurePerformanceSync<T>(
  featureName: string,
  fn: () => T
): T {
  const startTime = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - startTime;
    featureFlagManager.recordMetric(featureName, duration, true);
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    featureFlagManager.recordMetric(
      featureName,
      duration,
      false,
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
