/**
 * Trigger Tag Guide - Mobile-optimized educational component
 * Shows users how to use triggers effectively
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, X, Zap } from 'lucide-react';

interface TriggerGuide {
  name: string;
  tag: string;
  category: string;
  description: string;
  example: string;
  icon: string;
  color: string;
}

const TRIGGER_GUIDES: TriggerGuide[] = [
  {
    name: 'Reason',
    tag: 'reason',
    category: 'Reasoning & Analysis',
    description: 'Get step-by-step logical analysis',
    example: 'Ask: "Can you reason through this problem?"',
    icon: '🧠',
    color: 'blue',
  },
  {
    name: 'Research',
    tag: 'research',
    category: 'Research & Information',
    description: 'Get thorough research and information',
    example: 'Ask: "Research the latest developments in AI"',
    icon: '🔍',
    color: 'green',
  },
  {
    name: 'Plan',
    tag: 'plan',
    category: 'Planning & Organization',
    description: 'Get strategic planning and organization',
    example: 'Ask: "Help me plan my project"',
    icon: '📋',
    color: 'purple',
  },
  {
    name: 'Analyze',
    tag: 'analyze',
    category: 'Reasoning & Analysis',
    description: 'Deep analysis of topics',
    example: 'Ask: "Analyze this concept for me"',
    icon: '🔬',
    color: 'blue',
  },
  {
    name: 'Step by Step',
    tag: 'step_by_step',
    category: 'Planning & Organization',
    description: 'Break down into clear steps',
    example: 'Ask: "Explain this step by step"',
    icon: '📍',
    color: 'purple',
  },
  {
    name: 'Brainstorm',
    tag: 'brainstorm',
    category: 'Communication & Style',
    description: 'Creative idea generation',
    example: 'Ask: "Brainstorm creative solutions"',
    icon: '🌟',
    color: 'orange',
  },
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; border: string; badge: string }> = {
    blue: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/30',
      badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    green: {
      bg: 'bg-green-500/5',
      border: 'border-green-500/30',
      badge: 'bg-green-500/10 text-green-500 border-green-500/20',
    },
    purple: {
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/30',
      badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    orange: {
      bg: 'bg-orange-500/5',
      border: 'border-orange-500/30',
      badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
  };
  return colors[color] || colors.blue;
};

interface TriggerTagGuideProps {
  onClose?: () => void;
  compact?: boolean;
}

const TriggerTagGuide = ({ onClose, compact = false }: TriggerTagGuideProps) => {
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [showFullGuide, setShowFullGuide] = useState(!compact);

  if (!showFullGuide && compact) {
    return (
      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <button
          onClick={() => setShowFullGuide(true)}
          className="flex items-center gap-2 text-sm font-semibold text-primary w-full"
        >
          <Zap className="w-4 h-4" />
          Learn about Trigger Tags
          <ChevronDown className="w-4 h-4 ml-auto" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4 safe-area">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b bg-card z-10">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg md:text-xl font-bold">Trigger Tags Guide</h2>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Introduction */}
        <div className="p-4 space-y-3">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-sm text-foreground">
              <strong>Trigger Tags</strong> help AI structure responses using special tags.
              The AI automatically uses tags like <code className="bg-black/20 px-1 rounded text-xs">&lt;research&gt;</code> to organize different types of thinking.
            </p>
          </div>

          {/* Quick Tips */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Quick Tips:</h3>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Each trigger tag opens in an expandable card</li>
              <li>✓ Click to show/hide content</li>
              <li>✓ Different colors represent different task types</li>
              <li>✓ Works great on mobile and desktop</li>
            </ul>
          </div>

          {/* Guide Items */}
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-semibold">Common Trigger Tags:</h3>
            <div className="space-y-2">
              {TRIGGER_GUIDES.map((guide) => {
                const colors = getColorClasses(guide.color);
                const isExpanded = expandedGuide === guide.tag;

                return (
                  <button
                    key={guide.tag}
                    onClick={() =>
                      setExpandedGuide(isExpanded ? null : guide.tag)
                    }
                    className={cn(
                      'w-full text-left p-3 rounded-lg border-2 transition-all duration-200',
                      colors.bg,
                      colors.border,
                      'hover:shadow-md'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg">{guide.icon}</span>
                        <div className="min-w-0">
                          <Badge
                            variant="outline"
                            className={cn(
                              'font-mono text-xs truncate',
                              colors.badge
                            )}
                          >
                            &lt;{guide.tag}/&gt;
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {guide.description}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 flex-shrink-0 transition-transform',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-current/20 space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Category:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {guide.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Try saying:
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            "{guide.example}"
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-green-500/5 border border-green-500/30 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-green-600 mb-2">
              Best Practices
            </h4>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Use triggers to guide AI on how to approach your question</li>
              <li>• Combine multiple task modes for best results</li>
              <li>• Enable Web Search for research-heavy questions</li>
              <li>• Try different task modes (Reasoning, Research, Creative)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <Button
            className="w-full"
            onClick={() => {
              setShowFullGuide(false);
              onClose?.();
            }}
          >
            Got it!
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TriggerTagGuide;
