import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Sparkles, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getAllTriggers, Trigger } from '@/lib/triggers';

interface TriggerSelectorProps {
  selectedTriggers: string[];
  onTriggersChange: (triggers: string[]) => void;
}

const TriggerSelector = ({ selectedTriggers, onTriggersChange }: TriggerSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggers = getAllTriggers().filter(t => t.enabled);

  const filteredTriggers = useMemo(() => {
    if (!searchQuery) return triggers;
    const query = searchQuery.toLowerCase();
    return triggers.filter(
      t =>
        t.trigger.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.system_instruction.toLowerCase().includes(query)
    );
  }, [triggers, searchQuery]);

  const groupedTriggers = useMemo(() => {
    const groups: Record<string, Trigger[]> = {};
    filteredTriggers.forEach(trigger => {
      if (!groups[trigger.category]) {
        groups[trigger.category] = [];
      }
      groups[trigger.category].push(trigger);
    });
    return groups;
  }, [filteredTriggers]);

  const toggleTrigger = (triggerName: string) => {
    if (selectedTriggers.includes(triggerName)) {
      onTriggersChange(selectedTriggers.filter(t => t !== triggerName));
    } else {
      onTriggersChange([...selectedTriggers, triggerName]);
    }
  };

  const clearAll = () => {
    onTriggersChange([]);
  };

  const getCategoryColor = (category: Trigger['category']) => {
    switch (category) {
      case 'Reasoning & Analysis':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Research & Information':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Planning & Organization':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Communication & Style':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getCategoryIcon = (category: Trigger['category']) => {
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
    <div className="flex flex-wrap gap-2 items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'gap-2',
              selectedTriggers.length > 0 && 'border-primary bg-primary/5'
            )}
          >
            <Sparkles className="w-4 h-4" />
            Triggers
            {selectedTriggers.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {selectedTriggers.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <div className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Select Triggers</span>
                {selectedTriggers.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAll}
                    className="h-7 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search triggers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8"
                />
              </div>
            </div>

            {/* Triggers List */}
            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {Object.keys(groupedTriggers).length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No triggers found
                  </div>
                ) : (
                  Object.entries(groupedTriggers).map(([category, categoryTriggers]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {getCategoryIcon(category as Trigger['category'])} {category}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {categoryTriggers.map(trigger => {
                          const isSelected = selectedTriggers.includes(trigger.trigger);
                          return (
                            <button
                              key={trigger.trigger}
                              onClick={() => toggleTrigger(trigger.trigger)}
                              className={cn(
                                'w-full text-left p-2 rounded-lg border transition-all',
                                'hover:shadow-sm',
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium">{trigger.trigger}</span>
                                {isSelected && (
                                  <Badge variant="default" className="h-5 px-1.5 text-xs">
                                    ✓
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {trigger.system_instruction.replace(/Use tags.*?final_response\.\s*/i, '')}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>

      {/* Selected Triggers Pills */}
      {selectedTriggers.map(triggerName => {
        const trigger = triggers.find(t => t.trigger === triggerName);
        if (!trigger) return null;
        return (
          <Badge
            key={triggerName}
            className={cn(
              'gap-1 cursor-pointer',
              getCategoryColor(trigger.category)
            )}
            onClick={() => toggleTrigger(triggerName)}
          >
            {trigger.trigger}
            <X className="w-3 h-3" />
          </Badge>
        );
      })}
    </div>
  );
};

export default TriggerSelector;
