/**
 * Test Utilities
 * Common testing helpers and utilities
 */

export interface TestResult {
  name: string;
  passed: boolean;
  duration: number;
  error?: string;
}

export class TestSuite {
  private name: string;
  private tests: Array<() => Promise<TestResult>> = [];
  private results: TestResult[] = [];

  constructor(name: string) {
    this.name = name;
  }

  addTest(name: string, fn: () => Promise<void> | void) {
    this.tests.push(async () => {
      const startTime = performance.now();
      try {
        await fn();
        return {
          name,
          passed: true,
          duration: performance.now() - startTime,
        };
      } catch (error) {
        return {
          name,
          passed: false,
          duration: performance.now() - startTime,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });
  }

  async run(): Promise<TestResult[]> {
    this.results = [];
    console.group(`Test Suite: ${this.name}`);

    for (const test of this.tests) {
      const result = await test();
      this.results.push(result);
      const status = result.passed ? '✓' : '✗';
      console.log(
        `${status} ${result.name} (${result.duration.toFixed(2)}ms)`,
        result.error ? `\n  Error: ${result.error}` : ''
      );
    }

    const summary = this.getSummary();
    console.log(`\nPassed: ${summary.passed}/${summary.total}`);
    console.groupEnd();

    return this.results;
  }

  getSummary() {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    return {
      name: this.name,
      passed,
      total,
      failed: total - passed,
      successRate: (passed / total) * 100,
      totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0),
    };
  }
}

/**
 * Assertion helpers
 */
export const assert = {
  equal: (actual: unknown, expected: unknown, message?: string) => {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },

  deepEqual: (actual: unknown, expected: unknown, message?: string) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  },

  truthy: (value: unknown, message?: string) => {
    if (!value) {
      throw new Error(message || `Expected truthy value, got ${value}`);
    }
  },

  falsy: (value: unknown, message?: string) => {
    if (value) {
      throw new Error(message || `Expected falsy value, got ${value}`);
    }
  },

  throws: async (fn: () => Promise<void> | void, message?: string) => {
    try {
      await fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (error instanceof Error && error.message === 'Expected function to throw') {
        throw error;
      }
    }
  },

  isEmpty: (value: unknown, message?: string) => {
    const isEmpty =
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.length === 0) ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && Object.keys(value).length === 0);

    if (!isEmpty) {
      throw new Error(message || `Expected empty value, got ${value}`);
    }
  },

  isType: (value: unknown, type: string, message?: string) => {
    if (typeof value !== type) {
      throw new Error(message || `Expected type ${type}, got ${typeof value}`);
    }
  },
};

/**
 * Create a delayed promise for testing async behavior
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a mock timer controller
 */
export function createMockTimer() {
  let timers: NodeJS.Timeout[] = [];

  return {
    setTimeout: (fn: () => void, ms: number) => {
      const timer = setTimeout(fn, ms);
      timers.push(timer);
      return timer;
    },

    clearAll: () => {
      timers.forEach(timer => clearTimeout(timer));
      timers = [];
    },

    count: () => timers.length,
  };
}

/**
 * Generate test data
 */
export const testDataGenerator = {
  randomString: (length: number = 10): string => {
    return Math.random().toString(36).substring(2, 2 + length);
  },

  randomNumber: (min: number = 0, max: number = 100): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  randomArray: <T,>(generator: () => T, length: number = 10): T[] => {
    return Array.from({ length }, () => generator());
  },

  randomUser: () => ({
    id: Math.random().toString(36).substring(7),
    name: `User_${Math.random().toString(36).substring(7)}`,
    email: `user_${Math.random().toString(36).substring(7)}@test.com`,
    createdAt: new Date(),
  }),
};
