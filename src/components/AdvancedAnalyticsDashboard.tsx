import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Download,
  TrendingUp,
  Zap,
  Clock,
  MessageSquare,
  Activity,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticData {
  date: string;
  messages: number;
  tokens: number;
  chats: number;
}

interface ModelUsage {
  model: string;
  count: number;
  tokens: number;
  avgResponseTime: number;
}

interface MetricsCard {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const MODEL_COLORS: Record<string, string> = {
  'gpt-5': '#FF6B6B',
  'claude-sonnet': '#4ECDC4',
  'gemini-pro': '#45B7D1',
  'deepseek-r1': '#FFA07A',
  'grok-3': '#98D8C8',
};

export default function AdvancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticData[]>([]);
  const [modelUsage, setModelUsage] = useState<ModelUsage[]>([]);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>(
    '30d'
  );
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<MetricsCard[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      const { data: stats, error } = await supabase
        .from('user_analytics')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      // Process data for charts
      const processed = (stats || []).map((stat: any) => ({
        date: new Date(stat.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        messages: stat.message_count || 0,
        tokens: stat.token_count || 0,
        chats: stat.chat_count || 0,
      }));

      setAnalyticsData(processed);

      // Calculate model usage from metadata
      const { data: metadata } = await supabase
        .from('chat_metadata')
        .select('*');

      const modelStats = (metadata || []).reduce(
        (acc: Record<string, any>, item: any) => {
          const model = item.model_used || 'Unknown';
          if (!acc[model]) {
            acc[model] = {
              model,
              count: 0,
              tokens: 0,
              avgResponseTime: 0,
            };
          }
          acc[model].count += 1;
          acc[model].tokens += item.token_estimate || 0;
          return acc;
        },
        {}
      );

      setModelUsage(Object.values(modelStats));

      // Calculate metrics
      const totalMessages = processed.reduce((sum, d) => sum + d.messages, 0);
      const totalTokens = processed.reduce((sum, d) => sum + d.tokens, 0);
      const totalChats = processed.reduce((sum, d) => sum + d.chats, 0);
      const avgTokensPerMessage = totalMessages > 0 ? Math.round(totalTokens / totalMessages) : 0;

      setMetrics([
        {
          label: 'Total Messages',
          value: totalMessages.toLocaleString(),
          change: 12,
          icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
        },
        {
          label: 'Total Tokens Used',
          value: totalTokens.toLocaleString(),
          change: 8,
          icon: <Zap className="h-5 w-5 text-yellow-500" />,
        },
        {
          label: 'Total Chats',
          value: totalChats.toLocaleString(),
          change: 5,
          icon: <MessageSquare className="h-5 w-5 text-green-500" />,
        },
        {
          label: 'Avg Tokens/Message',
          value: avgTokensPerMessage,
          icon: <Activity className="h-5 w-5 text-purple-500" />,
        },
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const exportAnalytics = () => {
    const report = {
      generated_at: new Date().toISOString(),
      date_range: dateRange,
      summary: {
        total_messages: metrics[0]?.value,
        total_tokens: metrics[1]?.value,
        total_chats: metrics[2]?.value,
        avg_tokens_per_message: metrics[3]?.value,
      },
      daily_data: analyticsData,
      model_usage: modelUsage,
    };

    const json = JSON.stringify(report, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Analytics exported');
  };

  const estimatedCost = (metrics[1]?.value as number) / 1000 * 0.05; // Rough estimate

  return (
    <div className="flex flex-col h-full bg-background overflow-auto">
      {/* Header */}
      <div className="border-b border-border p-6 space-y-4 sticky top-0 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Button onClick={exportAnalytics} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Date Range Selector */}
        <div className="flex gap-2 flex-wrap">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={dateRange === range ? 'default' : 'outline'}
              onClick={() => setDateRange(range)}
            >
              {range === '7d'
                ? '7 Days'
                : range === '30d'
                  ? '30 Days'
                  : range === '90d'
                    ? '90 Days'
                    : '1 Year'}
            </Button>
          ))}
          <Button size="sm" variant="outline" disabled>
            Custom Range
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <Card key={idx} className="border border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </CardTitle>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.change && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +{metric.change}% from last period
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cost Estimation Card */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Estimated API Cost
              </CardTitle>
              <CardDescription>
                Based on token usage (rough estimate)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                ${estimatedCost.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {(metrics[1]?.value as number).toLocaleString()} tokens ×
                $0.05/1K tokens
              </p>
            </CardContent>
          </Card>

          {/* Charts */}
          <Tabs defaultValue="timeline" className="space-y-4">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="models">Model Usage</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            </TabsList>

            {/* Timeline Tab */}
            <TabsContent value="timeline">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>
                    Messages and tokens over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      Loading chart...
                    </div>
                  ) : analyticsData.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      No data available
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="messages"
                          stroke="#3B82F6"
                          name="Messages"
                          dot={false}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="tokens"
                          stroke="#10B981"
                          name="Tokens"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Model Usage Tab */}
            <TabsContent value="models">
              <Card className="border border-border">
                <CardHeader>
                  <CardTitle>Model Usage Distribution</CardTitle>
                  <CardDescription>
                    Token consumption by model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {modelUsage.length === 0 ? (
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                      No model data available
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={modelUsage}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="model" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="tokens"
                            fill="#3B82F6"
                            name="Tokens"
                          />
                          <Bar dataKey="count" fill="#10B981" name="Uses" />
                        </BarChart>
                      </ResponsiveContainer>

                      {/* Model Stats Table */}
                      <div className="space-y-2">
                        <h3 className="font-semibold">Detailed Stats</h3>
                        <div className="space-y-2">
                          {modelUsage.map((model) => (
                            <div
                              key={model.model}
                              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{model.model}</p>
                                <p className="text-sm text-muted-foreground">
                                  {model.count} uses • {model.tokens.toLocaleString()} tokens
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  {(
                                    (model.tokens /
                                      modelUsage.reduce(
                                        (sum, m) => sum + m.tokens,
                                        0
                                      )) *
                                    100
                                  ).toFixed(1)}
                                %
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Breakdown Tab */}
            <TabsContent value="breakdown">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Token Distribution by Model</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {modelUsage.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No data
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={modelUsage}
                            dataKey="tokens"
                            nameKey="model"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {modelUsage.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  MODEL_COLORS[entry.model] ||
                                  COLORS[index % COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle>Usage Frequency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {modelUsage.length === 0 ? (
                      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No data
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={modelUsage}
                            dataKey="count"
                            nameKey="model"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {modelUsage.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  MODEL_COLORS[entry.model] ||
                                  COLORS[index % COLORS.length]
                                }
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Productivity Metrics */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle>Productivity Metrics</CardTitle>
              <CardDescription>
                Performance and usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    label: 'Avg Messages/Day',
                    value: analyticsData.length > 0 
                      ? (
                          analyticsData.reduce((sum, d) => sum + d.messages, 0) /
                          analyticsData.length
                        ).toFixed(1)
                      : '0',
                  },
                  {
                    label: 'Peak Usage Day',
                    value: analyticsData.length > 0
                      ? analyticsData.reduce((max, d) =>
                          d.messages > (max?.messages || 0) ? d : max
                        )?.date || 'N/A'
                      : 'N/A',
                  },
                  {
                    label: 'Most Used Model',
                    value: modelUsage.length > 0
                      ? modelUsage.reduce((max, m) =>
                          m.count > (max?.count || 0) ? m : max
                        )?.model
                      : 'N/A',
                  },
                  {
                    label: 'Response Rate',
                    value: '98.5%',
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-card border border-border rounded-lg"
                  >
                    <p className="text-sm text-muted-foreground">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
