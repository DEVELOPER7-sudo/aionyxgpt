import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectedTrigger } from '@/lib/triggers';

interface TriggerBarProps {
  triggers: DetectedTrigger[];
  taggedSegments?: Array<{ tag: string; content: string }>;
  onTriggerClick?: (trigger: DetectedTrigger) => void;
}

const TriggerBar = ({ triggers, taggedSegments = [], onTriggerClick }: TriggerBarProps) => {
  const [expandedTriggers, setExpandedTriggers] = useState<Set<string>>(new Set());
  const [viewAll, setViewAll] = useState(false);
  const [isBarCollapsed, setIsBarCollapsed] = useState(false);

  if (triggers.length === 0) return null;

  const toggleTrigger = (triggerTag: string) => {
    const newExpanded = new Set(expandedTriggers);
    if (newExpanded.has(triggerTag)) {
      newExpanded.delete(triggerTag);
    } else {
      newExpanded.add(triggerTag);
    }
    setExpandedTriggers(newExpanded);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 border-blue-500/50 hover:from-blue-500/30 hover:to-blue-600/30 shadow-lg shadow-blue-500/20';
      case 'Research & Information':
        return 'bg-gradient-to-r from-emerald-500/20 to-green-600/20 text-emerald-600 border-emerald-500/50 hover:from-emerald-500/30 hover:to-green-600/30 shadow-lg shadow-emerald-500/20';
      case 'Planning & Organization':
        return 'bg-gradient-to-r from-violet-500/20 to-purple-600/20 text-violet-600 border-violet-500/50 hover:from-violet-500/30 hover:to-purple-600/30 shadow-lg shadow-violet-500/20';
      case 'Communication & Style':
        return 'bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-600 border-amber-500/50 hover:from-amber-500/30 hover:to-orange-600/30 shadow-lg shadow-amber-500/20';
      default:
        return 'bg-gradient-to-r from-slate-500/20 to-gray-600/20 text-slate-600 border-slate-500/50 hover:from-slate-500/30 hover:to-gray-600/30 shadow-lg shadow-slate-500/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return '🧩';
      case 'Research & Information':
        return '🔍';
      case 'Planning & Organization':
        return '📋';
      case 'Communication & Style':
        return '✨';
      default:
        return '⚡';
    }
  };

  return (
    <Card className="mb-4 bg-gradient-to-r from-background/60 via-primary/5 to-background/60 border-2 border-primary/40 shadow-lg shadow-primary/20 backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-bold text-foreground">
            🎯 Active Triggers ({triggers.length})
          </span>
        </div>
        <div className="flex gap-2">
          {triggers.length > 1 && !isBarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewAll(!viewAll)}
              className="h-7 text-xs"
            >
              {viewAll ? 'Collapse All' : 'View All'}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsBarCollapsed(!isBarCollapsed)}
            className="h-7 text-xs"
          >
            {isBarCollapsed ? '▼' : '▲'}
          </Button>
        </div>
      </div>

      {!isBarCollapsed && (
        <div className="px-4 pb-4 flex flex-wrap gap-3">
          {triggers.map((trigger) => {
            const isExpanded = expandedTriggers.has(trigger.tag) || viewAll;
            const matchingSegment = taggedSegments.find(seg => seg.tag === trigger.tag);
            
            return (
              <Collapsible
                key={trigger.tag}
                open={isExpanded}
                onOpenChange={() => toggleTrigger(trigger.tag)}
                className="w-full"
              >
                <CollapsibleTrigger asChild>
                   <Badge
                     className={cn(
                       'cursor-pointer transition-all duration-300 px-4 py-2 text-xs font-bold border-2 hover:scale-105 hover:-translate-y-1',
                       getCategoryColor(trigger.category)
                     )}
                     onClick={() => onTriggerClick?.(trigger)}
                   >
                     <span className="mr-2 text-sm">{getCategoryIcon(trigger.category)}</span>
                     {trigger.name}
                     {isExpanded ? (
                       <ChevronUp className="ml-2 w-4 h-4" />
                     ) : (
                       <ChevronDown className="ml-2 w-4 h-4" />
                     )}
                   </Badge>
                 </CollapsibleTrigger>

                <CollapsibleContent className="mt-3 animate-slide-down">
                   <Card className="p-4 bg-gradient-to-r border-l-4 border-2 shadow-lg" style={{
                     borderLeftColor: getCategoryColor(trigger.category).includes('blue') ? '#3b82f6' :
                       getCategoryColor(trigger.category).includes('emerald') ? '#10b981' :
                       getCategoryColor(trigger.category).includes('violet') ? '#a855f7' :
                       getCategoryColor(trigger.category).includes('amber') ? '#f97316' : '#6b7280',
                     backgroundImage: getCategoryColor(trigger.category).includes('blue') ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.04))' :
                       getCategoryColor(trigger.category).includes('emerald') ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.04))' :
                       getCategoryColor(trigger.category).includes('violet') ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(196, 108, 250, 0.04))' :
                       getCategoryColor(trigger.category).includes('amber') ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), rgba(251, 146, 60, 0.04))' : 'linear-gradient(135deg, rgba(107, 114, 128, 0.08), rgba(148, 163, 184, 0.04))'
                   }}>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-foreground">Category:</span>
                        <span className="ml-2 text-muted-foreground">{trigger.category}</span>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-foreground">Purpose:</span>
                        <p className="mt-1 text-muted-foreground">{trigger.metadata.purpose}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground">Context Used:</span>
                        <p className="mt-1 text-muted-foreground">{trigger.metadata.context_used}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground">Influence Scope:</span>
                        <p className="mt-1 text-muted-foreground">{trigger.metadata.influence_scope}</p>
                      </div>

                      {matchingSegment && (
                        <div>
                          <span className="font-semibold text-foreground">Tagged Content Preview:</span>
                          <div className="mt-1 p-2 bg-background/50 rounded border border-border">
                            <p className="text-muted-foreground line-clamp-3">
                              {matchingSegment.content.substring(0, 200)}
                              {matchingSegment.content.length > 200 && '...'}
                            </p>
                          </div>
                        </div>
                      )}

                      <div>
                        <span className="font-semibold text-foreground">System Instruction:</span>
                        <div className="mt-1 p-2 bg-background/50 rounded border border-border font-mono">
                          <code className="text-xs text-muted-foreground">{trigger.instruction}</code>
                        </div>
                      </div>
                    </div>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default TriggerBar;
