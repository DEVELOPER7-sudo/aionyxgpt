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
         return {
           bg: 'bg-blue-500/15',
           text: 'text-blue-700 dark:text-blue-400',
           border: 'border-blue-500/40',
           hover: 'hover:bg-blue-500/25 hover:border-blue-500/60',
           shadow: 'shadow-lg shadow-blue-500/15',
           cardBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(96, 165, 250, 0.06))',
           borderLeft: '#3b82f6'
         };
       case 'Research & Information':
         return {
           bg: 'bg-emerald-500/15',
           text: 'text-emerald-700 dark:text-emerald-400',
           border: 'border-emerald-500/40',
           hover: 'hover:bg-emerald-500/25 hover:border-emerald-500/60',
           shadow: 'shadow-lg shadow-emerald-500/15',
           cardBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(52, 211, 153, 0.06))',
           borderLeft: '#10b981'
         };
       case 'Planning & Organization':
         return {
           bg: 'bg-violet-500/15',
           text: 'text-violet-700 dark:text-violet-400',
           border: 'border-violet-500/40',
           hover: 'hover:bg-violet-500/25 hover:border-violet-500/60',
           shadow: 'shadow-lg shadow-violet-500/15',
           cardBg: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(196, 108, 250, 0.06))',
           borderLeft: '#a855f7'
         };
       case 'Communication & Style':
         return {
           bg: 'bg-amber-500/15',
           text: 'text-amber-700 dark:text-amber-400',
           border: 'border-amber-500/40',
           hover: 'hover:bg-amber-500/25 hover:border-amber-500/60',
           shadow: 'shadow-lg shadow-amber-500/15',
           cardBg: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(251, 146, 60, 0.06))',
           borderLeft: '#f97316'
         };
       default:
         return {
           bg: 'bg-slate-500/15',
           text: 'text-slate-700 dark:text-slate-400',
           border: 'border-slate-500/40',
           hover: 'hover:bg-slate-500/25 hover:border-slate-500/60',
           shadow: 'shadow-lg shadow-slate-500/15',
           cardBg: 'linear-gradient(135deg, rgba(107, 114, 128, 0.12), rgba(148, 163, 184, 0.06))',
           borderLeft: '#6b7280'
         };
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
    <Card className="mb-4 bg-gradient-to-r from-background/80 via-background/60 to-background/80 border border-foreground/10 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-t-lg border-b border-foreground/10">
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
            const categoryColor = getCategoryColor(trigger.category);
            
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
                       'cursor-pointer transition-all duration-300 px-4 py-2 text-xs font-bold border hover:scale-105 hover:-translate-y-1',
                       categoryColor.bg,
                       categoryColor.text,
                       categoryColor.border,
                       categoryColor.hover,
                       categoryColor.shadow
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
                   <Card className="p-4 border-l-4 border-2 shadow-lg" style={{
                     borderLeftColor: categoryColor.borderLeft,
                     backgroundImage: categoryColor.cardBg,
                     backgroundColor: 'transparent'
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
