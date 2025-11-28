import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { autoSelectTriggers, TriggerDetectionResult } from '@/lib/triggers-extended';

interface AIAutoTriggerSelectorProps {
  userMessage: string;
  selectedTriggers: string[];
  onTriggersChange: (triggers: string[]) => void;
  isVisible?: boolean;
}

const AIAutoTriggerSelector = ({
  userMessage,
  selectedTriggers,
  onTriggersChange,
  isVisible = true,
}: AIAutoTriggerSelectorProps) => {
  const [suggestion, setSuggestion] = useState<TriggerDetectionResult | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Auto-analyze on message change
  useEffect(() => {
    if (!userMessage || userMessage.trim().length < 10 || !isVisible) {
      setSuggestion(null);
      setShowSuggestion(false);
      return;
    }

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      try {
        const result = autoSelectTriggers(userMessage);
        if (result.suggestedTriggers.length > 0 && result.confidence > 0.7) {
          setSuggestion(result);
          setShowSuggestion(true);
        } else {
          setSuggestion(null);
          setShowSuggestion(false);
        }
      } catch (error) {
        console.error('Error analyzing triggers:', error);
        setSuggestion(null);
      } finally {
        setIsAnalyzing(false);
      }
    }, 300); // Debounce

    return () => clearTimeout(timer);
  }, [userMessage, isVisible]);

  if (!isVisible || !suggestion || !showSuggestion) {
    return null;
  }

  const handleApplySuggestion = () => {
    const newTriggers = Array.from(
      new Set([...selectedTriggers, ...suggestion.suggestedTriggers])
    );
    onTriggersChange(newTriggers);
  };

  const handleDismiss = () => {
    setShowSuggestion(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical Deep Dive':
        return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30';
      case 'Advanced Problem Solving':
        return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'Specialist Domains':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'Synthesis and Integration':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
    }
  };

  const isAlreadySelected = suggestion.suggestedTriggers.every(t =>
    selectedTriggers.includes(t)
  );

  return (
    <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2 flex-1">
            <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <CardTitle className="text-sm flex items-center gap-2">
                AI Trigger Suggestion
                {isAnalyzing && (
                  <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3" />
                    Analyzing...
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {suggestion.reasoning}
                <span className="ml-2 inline-block px-2 py-0.5 bg-primary/10 rounded text-primary font-semibold">
                  {(suggestion.confidence * 100).toFixed(0)}% confidence
                </span>
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Category:</span>
          <Badge className={cn('rounded-full', getCategoryColor(suggestion.category))}>
            {suggestion.category}
          </Badge>
        </div>

        {/* Suggested Triggers */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-muted-foreground">Suggested Triggers:</span>
          <div className="flex flex-wrap gap-2">
            {suggestion.suggestedTriggers.map(trigger => {
              const isSelected = selectedTriggers.includes(trigger);
              return (
                <Badge
                  key={trigger}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all gap-1',
                    isSelected && 'ring-1 ring-primary'
                  )}
                  onClick={() => {
                    if (isSelected) {
                      onTriggersChange(selectedTriggers.filter(t => t !== trigger));
                    } else {
                      onTriggersChange([...selectedTriggers, trigger]);
                    }
                  }}
                >
                  <Zap className="w-3 h-3" />
                  {trigger}
                  {isSelected && ' ✓'}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {!isAlreadySelected && (
            <Button
              size="sm"
              onClick={handleApplySuggestion}
              className="gap-2 flex-1"
            >
              <Sparkles className="w-4 h-4" />
              Apply Suggestion
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={handleDismiss}
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAutoTriggerSelector;
