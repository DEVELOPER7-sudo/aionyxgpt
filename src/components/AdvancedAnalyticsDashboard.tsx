import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdvancedAnalyticsDashboard() {
  return (
    <div className="h-full w-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track your AI usage, model performance, and interaction patterns
            </p>
          </div>

          {/* Info Card */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500" />
                Analytics Coming Soon
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Advanced analytics features are currently in development. Once available, you'll be able to:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Track message and token usage over time
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  View model performance metrics and comparisons
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Analyze conversation patterns and insights
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  Export detailed reports and visualizations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Placeholder Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Messages</CardDescription>
                <CardTitle className="text-3xl">--</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Tokens Used</CardDescription>
                <CardTitle className="text-3xl">--</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Active Chats</CardDescription>
                <CardTitle className="text-3xl">--</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg Response Time</CardDescription>
                <CardTitle className="text-3xl">--</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
