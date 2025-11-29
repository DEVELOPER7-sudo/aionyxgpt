import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Copy, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DetectedTrigger } from '@/lib/triggers';

interface InlineTriggerBarProps {
  trigger: DetectedTrigger;
  isCustom?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
}

const InlineTriggerBar = ({ 
  trigger, 
  isCustom = false,
  onDelete,
  onEdit,
  onCopy,
}: InlineTriggerBarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30 hover:bg-blue-500/20';
      case 'Research & Information':
        return 'bg-green-500/10 text-green-500 border-green-500/30 hover:bg-green-500/20';
      case 'Planning & Organization':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30 hover:bg-purple-500/20';
      case 'Communication & Style':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/30 hover:bg-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30 hover:bg-gray-500/20';
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

  const getBorderColor = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return '#3b82f6';
      case 'Research & Information':
        return '#10b981';
      case 'Planning & Organization':
        return '#a855f7';
      case 'Communication & Style':
        return '#f97316';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="my-2">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
        <CollapsibleTrigger asChild>
          <Badge
            className={cn(
              'cursor-pointer transition-all duration-200 px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1',
              getCategoryColor(trigger.category)
            )}
          >
            <span>{getCategoryIcon(trigger.category)}</span>
            <span className="font-mono font-bold">&lt;{trigger.tag}/&gt;</span>
            <span className="text-xs opacity-70 ml-1">{trigger.name}</span>
            {isExpanded ? (
              <ChevronUp className="ml-1 w-3 h-3" />
            ) : (
              <ChevronDown className="ml-1 w-3 h-3" />
            )}
          </Badge>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2 mb-4">
          <Card className="p-3 bg-muted/30 border-l-4 shadow-sm" style={{
            borderLeftColor: getBorderColor(trigger.category)
          }}>
            <div className="space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="font-semibold text-foreground block mb-1">Category:</span>
                  <span className="text-muted-foreground">{trigger.category}</span>
                </div>
                {isCustom && (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 ml-2">
                    Custom
                  </Badge>
                )}
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Purpose:</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {trigger.metadata.purpose}
                </p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Context Used:</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {trigger.metadata.contextUsed}
                </p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Influence Scope:</span>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {trigger.metadata.influenceScope}
                </p>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">System Instruction:</span>
                <div className="mt-1 p-2 bg-background/50 rounded border border-border font-mono">
                  <code className="text-xs text-muted-foreground leading-relaxed break-words">
                    {trigger.instruction}
                  </code>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                {onCopy && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={onCopy}
                    title="Copy trigger instruction"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                )}
                {isCustom && onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={onEdit}
                    title="Edit custom trigger"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
                {isCustom && onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                    onClick={onDelete}
                    title="Delete custom trigger"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default InlineTriggerBar;
