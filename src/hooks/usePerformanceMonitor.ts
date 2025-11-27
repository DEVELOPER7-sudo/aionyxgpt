import { useEffect, useRef, useCallback } from 'react';
import { featureFlagManager, TestMetrics } from '@/lib/test-features';

export interface PerformanceMonitorConfig {
  enabled: boolean;
  trackRenders: boolean;
  trackUpdates: boolean;
  slowThreshold: number; // milliseconds
}

const defaultConfig: PerformanceMonitorConfig = {
  enabled: true,
  trackRenders: true,
  trackUpdates: true,
  slowThreshold: 16, // 60fps target
};

/**
 * Hook to monitor component performance
 */
export function usePerformanceMonitor(
  componentName: string,
  config: Partial<PerformanceMonitorConfig> = {}
) {
  const mergedConfig = { ...defaultConfig, ...config };
  const renderTimeRef = useRef<number>(performance.now());
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    renderCountRef.current += 1;

    if (mergedConfig.enabled && mergedConfig.trackRenders) {
      const renderTime = performance.now() - renderTimeRef.current;

      if (renderTime > mergedConfig.slowThreshold) {
        console.warn(
          `Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`
        );
      }

      featureFlagManager.recordMetric(
        `render-${componentName}`,
        renderTime,
        renderTime <= mergedConfig.slowThreshold
      );
    }

    renderTimeRef.current = performance.now();
  });

  const getMetrics = useCallback(() => {
    return featureFlagManager.getMetrics(`render-${componentName}`);
  }, [componentName]);

  const getRenderCount = useCallback(() => {
    return renderCountRef.current;
  }, []);

  return {
    renderCount: getRenderCount(),
    metrics: getMetrics(),
  };
}

/**
 * Hook to measure async operations
 */
export function useAsyncPerformance(operationName: string) {
  const metricsRef = useRef<TestMetrics[]>([]);

  const measure = useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      const startTime = performance.now();
      try {
        const result = await asyncFn();
        const duration = performance.now() - startTime;
        featureFlagManager.recordMetric(operationName, duration, true);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        featureFlagManager.recordMetric(
          operationName,
          duration,
          false,
          error instanceof Error ? error.message : String(error)
        );
        throw error;
      }
    },
    [operationName]
  );

  const getMetrics = useCallback(() => {
    return featureFlagManager.getMetrics(operationName);
  }, [operationName]);

  return { measure, getMetrics };
}

/**
 * Hook to monitor memory usage (if available)
 */
export function useMemoryMonitor() {
  const memoryRef = useRef<number[]>([]);

  const recordMemory = useCallback(() => {
    if (performance.memory) {
      const used = performance.memory.usedJSHeapSize;
      const total = performance.memory.totalJSHeapSize;
      memoryRef.current.push(used);
      return { used, total, percentage: (used / total) * 100 };
    }
    return null;
  }, []);

  const getAverageMemory = useCallback(() => {
    if (memoryRef.current.length === 0) return 0;
    const sum = memoryRef.current.reduce((a, b) => a + b, 0);
    return sum / memoryRef.current.length;
  }, []);

  return { recordMemory, getAverageMemory, history: memoryRef.current };
}
