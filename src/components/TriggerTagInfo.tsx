/**
 * Trigger Tag Info Panel
 * Shows information about used trigger tags and provides help
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MessageCircle, Zap } from 'lucide-react';

interface TriggerInfo {
  tag: string;
  category?: string;
  description: string;
  icon: string;
}

const TRIGGER_INFO_MAP: Record<string, TriggerInfo> = {
  reason: {
    tag: 'reason',
    category: 'Reasoning & Analysis',
    description: 'Shows step-by-step logical thinking and reasoning process',
    icon: '🧠',
  },
  analyze: {
    tag: 'analyze',
    category: 'Reasoning & Analysis',
    description: 'Breaks down topics into components and examines relationships',
    icon: '🔬',
  },
  research: {
    tag: 'research',
    category: 'Research & Information',
    description: 'Contains research findings and information gathering',
    icon: '🔍',
  },
  deepresearch: {
    tag: 'deepresearch',
    category: 'Research & Information',
    description: 'In-depth investigation and comprehensive research results',
    icon: '🔎',
  },
  factcheck: {
    tag: 'factcheck',
    category: 'Research & Information',
    description: 'Verification and validation of facts and claims',
    icon: '✓',
  },
  plan: {
    tag: 'plan',
    category: 'Planning & Organization',
    description: 'Strategic planning and organization approach',
    icon: '📋',
  },
  stepbystep: {
    tag: 'stepbystep',
    category: 'Planning & Organization',
    description: 'Detailed procedural breakdown with sequential steps',
    icon: '📍',
  },
  compare: {
    tag: 'compare',
    category: 'Reasoning & Analysis',
    description: 'Comparison of similarities between items or concepts',
    icon: '⚖️',
  },
  evaluate: {
    tag: 'evaluate',
    category: 'Reasoning & Analysis',
    description: 'Assessment of quality, relevance, and value',
    icon: '📊',
  },
  critique: {
    tag: 'critique',
    category: 'Reasoning & Analysis',
    description: 'Critical assessment of strengths and weaknesses',
    icon: '🎯',
  },
  summary: {
    tag: 'summary',
    category: 'Communication & Style',
    description: 'Synthesis and summary of key points',
    icon: '📝',
  },
  example: {
    tag: 'example',
    category: 'Communication & Style',
    description: 'Illustrative examples and demonstrations',
    icon: '💡',
  },
  code: {
    tag: 'code',
    category: 'Communication & Style',
    description: 'Code snippets or technical content',
    icon: '💻',
  },
  brainstorm: {
    tag: 'brainstorm',
    category: 'Communication & Style',
    description: 'Creative ideation and brainstorming results',
    icon: '🌟',
  },
};

interface TriggerTagInfoProps {
  tagsUsed: string[];
  compact?: boolean;
}

export const TriggerTagInfo = ({ tagsUsed, compact = false }: TriggerTagInfoProps) => {
  if (tagsUsed.length === 0) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2 mb-3">
        {tagsUsed.map((tag) => {
          const info = TRIGGER_INFO_MAP[tag];
          return (
            <Badge
              key={tag}
              variant="outline"
              className="flex items-center gap-1 px-2 py-1 text-xs"
              title={info?.description}
            >
              <span>{info?.icon || '⚡'}</span>
              <span>{tag}</span>
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="mt-4 p-4 border-primary/20 bg-primary/5">
      <div className="flex items-start gap-3">
        <MessageCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold mb-2">Structured Output Used</h4>
          <div className="space-y-2">
            {tagsUsed.map((tag) => {
              const info = TRIGGER_INFO_MAP[tag];
              return (
                <div key={tag} className="flex items-start gap-2">
                  <span className="text-lg">{info?.icon || '⚡'}</span>
                  <div className="flex-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs mb-1"
                    >
                      &lt;{tag}/&gt;
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {info?.description || `Custom tag: ${tag}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TriggerTagInfo;
