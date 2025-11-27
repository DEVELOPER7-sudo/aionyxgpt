import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { featureFlagManager, measurePerformance } from '@/lib/test-features';
import { TestSuite, assert, testDataGenerator } from '@/lib/test-utils';
import { usePerformanceMonitor, useAsyncPerformance } from '@/hooks/usePerformanceMonitor';

export default function TestFeatures() {
  const [report, setReport] = useState<any>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { renderCount, metrics } = usePerformanceMonitor('TestFeatures');
  const { measure } = useAsyncPerformance('test-async-operation');

  const handleRunFeatureTests = async () => {
    setLoading(true);
    const suite = new TestSuite('Feature Flag Tests');

    suite.addTest('Feature flag registration', () => {
      const flags = featureFlagManager.getAllFlags();
      assert.truthy(flags.length > 0, 'Should have registered flags');
    });

    suite.addTest('Enable/Disable features', () => {
      featureFlagManager.enableFeature('beta-ui-components');
      assert.truthy(
        featureFlagManager.isFeatureEnabled('beta-ui-components'),
        'Feature should be enabled'
      );
      featureFlagManager.disableFeature('beta-ui-components');
      assert.falsy(
        featureFlagManager.isFeatureEnabled('beta-ui-components'),
        'Feature should be disabled'
      );
    });

    suite.addTest('Metrics recording', async () => {
      featureFlagManager.clearMetrics();
      await measurePerformance('test-feature', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });
      const metrics = featureFlagManager.getMetrics('test-feature');
      assert.truthy(metrics.length > 0, 'Should have recorded metrics');
    });

    suite.addTest('Async performance measurement', async () => {
      const result = await measure(async () => {
        await new Promise(resolve => setTimeout(resolve, 5));
        return 'success';
      });
      assert.equal(result, 'success', 'Should return correct result');
    });

    suite.addTest('Test data generation', () => {
      const user = testDataGenerator.randomUser();
      assert.truthy(user.id, 'User should have ID');
      assert.truthy(user.email, 'User should have email');
      const nums = testDataGenerator.randomArray(() => testDataGenerator.randomNumber(), 5);
      assert.equal(nums.length, 5, 'Should generate correct array length');
    });

    const results = await suite.run();
    setTestResults(results);
    setReport(featureFlagManager.getReport());
    setLoading(false);
  };

  const handleToggleFeature = (featureName: string) => {
    if (featureFlagManager.isFeatureEnabled(featureName)) {
      featureFlagManager.disableFeature(featureName);
    } else {
      featureFlagManager.enableFeature(featureName);
    }
    setReport(featureFlagManager.getReport());
  };

  useEffect(() => {
    setReport(featureFlagManager.getReport());
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Test Features</h1>
        <p className="text-gray-600">
          Feature flags, performance monitoring, and testing utilities
        </p>
      </div>

      {/* Component Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Component Performance</CardTitle>
          <CardDescription>Current component render metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>Render Count:</strong> {renderCount}
            </p>
            <p>
              <strong>Latest Metrics:</strong> {metrics.length} recorded
            </p>
            {metrics.length > 0 && (
              <p>
                <strong>Last Duration:</strong> {metrics[metrics.length - 1].duration.toFixed(2)}ms
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <CardDescription>Enable/disable features for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.flags.map((flag: any) => (
                <div key={flag.name} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{flag.name}</p>
                    <p className="text-sm text-gray-600">{flag.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                      {flag.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleToggleFeature(flag.name)}
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Recent test execution results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testResults.map((result: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-600">{result.duration.toFixed(2)}ms</p>
                </div>
                <Badge variant={result.passed ? 'default' : 'destructive'}>
                  {result.passed ? 'Passed' : 'Failed'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Report */}
      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
            <CardDescription>Overall metrics summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Metrics</p>
                <p className="text-2xl font-bold">{report.summary.totalMetrics}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{report.summary.successRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Duration</p>
                <p className="text-2xl font-bold">
                  {report.summary.averageDuration.toFixed(2)}ms
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={handleRunFeatureTests} disabled={loading} size="lg">
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            featureFlagManager.clearMetrics();
            setReport(featureFlagManager.getReport());
          }}
          size="lg"
        >
          Clear Metrics
        </Button>
      </div>
    </div>
  );
}
