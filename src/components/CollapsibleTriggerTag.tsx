import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatNestedTriggerReferences } from '@/lib/triggers';

interface CollapsibleTriggerTagProps {
  tagName: string;
  content: string;
  category?: string;
  autoExpand?: boolean;
  onCopy?: (text: string) => void;
  innerTriggers?: Array<{ tag: string; content: string; startIndex: number; endIndex: number }>;
}

// Color scheme for different trigger categories
const TRIGGER_COLORS = {
  'Reasoning & Analysis': {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    icon: '🧠',
    dark: 'dark:border-blue-400/30 dark:bg-blue-400/5',
  },
  'Research & Information': {
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    badge: 'bg-green-500/10 text-green-500 border-green-500/20',
    icon: '🔍',
    dark: 'dark:border-green-400/30 dark:bg-green-400/5',
  },
  'Planning & Organization': {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    badge: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    icon: '📋',
    dark: 'dark:border-purple-400/30 dark:bg-purple-400/5',
  },
  'Communication & Style': {
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/5',
    badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    icon: '✨',
    dark: 'dark:border-orange-400/30 dark:bg-orange-400/5',
  },
};

const DEFAULT_COLORS = {
  border: 'border-gray-500/30',
  bg: 'bg-gray-500/5',
  badge: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  icon: '⚡',
  dark: 'dark:border-gray-400/30 dark:bg-gray-400/5',
};

const CollapsibleTriggerTag = ({
  tagName,
  content,
  category,
  autoExpand = false,
  onCopy,
}: CollapsibleTriggerTagProps) => {
  const [isExpanded, setIsExpanded] = useState(autoExpand);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showCreationConfirm, setShowCreationConfirm] = useState(true);
  
  // Show confirmation that trigger bar was created
  useEffect(() => {
    console.log(`✓ TRIGGER BAR CREATED: <${tagName}> with ${content.length} chars`);
    
    // Hide confirmation after 2 seconds (no toast to reduce notification spam)
    const timer = setTimeout(() => {
      setShowCreationConfirm(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [tagName]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get color scheme for this category
  const colorScheme = category 
    ? TRIGGER_COLORS[category as keyof typeof TRIGGER_COLORS] || DEFAULT_COLORS
    : DEFAULT_COLORS;

  const handleCopy = () => {
    const textToCopy = `<${tagName}>\n${content}\n</${tagName}>`;
    navigator.clipboard.writeText(textToCopy);
    toast.success(`Copied ${tagName} content to clipboard`);
    onCopy?.(textToCopy);
  };

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={cn(
      'my-3 border-2 transition-all duration-300 overflow-hidden',
      'hover:shadow-lg hover:scale-[1.01]',
      colorScheme.border,
      colorScheme.bg,
      colorScheme.dark
    )}>
      {/* Clickable Header - Full width toggle */}
      <button
        onClick={handleToggle}
        className={cn(
          'w-full px-3 md:px-4 py-3 md:py-4 flex items-center justify-between',
          'hover:opacity-80 transition-opacity cursor-pointer',
          'border-b',
          colorScheme.border
        )}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <span className="text-lg md:text-xl flex-shrink-0">{colorScheme.icon}</span>
          
          <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  'font-mono text-xs font-bold',
                  colorScheme.badge,
                  'truncate max-w-[150px] md:max-w-none'
                )}
              >
                &lt;{tagName}/&gt;
              </Badge>
              {showCreationConfirm && (
                <div className="flex items-center gap-1 animate-in fade-in-50 duration-300">
                  <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-xs text-green-500 font-semibold hidden sm:inline">Created</span>
                </div>
              )}
            </div>
            {category && (
              <p className="text-xs text-muted-foreground hidden md:block">
                {category}
              </p>
            )}
          </div>
        </div>

        {/* Toggle indicator */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {isExpanded ? 'Hide' : 'View'}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 md:w-5 md:h-5 transition-transform duration-300',
              isExpanded ? 'rotate-180' : 'rotate-0'
            )}
          />
        </div>
      </button>

      {/* Content - Collapsible */}
       {isExpanded && (
         <div className="px-3 md:px-4 py-3 md:py-4 animate-in fade-in slide-in-from-top-2">
           <div className="prose prose-sm dark:prose-invert max-w-none space-y-3 text-sm md:text-base">
             <ReactMarkdown
               remarkPlugins={[remarkGfm, remarkMath]}
               rehypePlugins={[rehypeKatex]}
               components={{
                 h1: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-bold mt-3 mb-2" {...props} />,
                 h2: ({ node, ...props }) => <h3 className="text-base md:text-lg font-bold mt-2 mb-1" {...props} />,
                 h3: ({ node, ...props }) => <h4 className="text-sm md:text-base font-semibold mt-2 mb-1" {...props} />,
                 p: ({ node, ...props }) => <p className="text-xs md:text-sm leading-relaxed" {...props} />,
                 ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 text-xs md:text-sm" {...props} />,
                 ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 text-xs md:text-sm" {...props} />,
                 li: ({ node, ...props }) => <li className="text-xs md:text-sm" {...props} />,
                 code: ({ node, className, ...props }) =>
                   className ?
                     <code className="block bg-black/30 p-2 rounded text-xs font-mono overflow-x-auto" {...props} /> :
                     <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs font-mono" {...props} />,
                 blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-current/30 pl-3 italic opacity-80" {...props} />,
               }}
             >
               {formatNestedTriggerReferences(content)}
             </ReactMarkdown>
           </div>

           {/* Inner Trigger Bars */}
           {innerTriggers && innerTriggers.length > 0 && (
             <div className="space-y-2 mt-4 pt-3 border-t" style={{ borderColor: `currentColor`, opacity: 0.2 }}>
               {innerTriggers.map((innerTrigger, idx) => (
                 <InnerTriggerBar
                   key={`${tagName}-inner-${innerTrigger.tag}-${idx}`}
                   tagName={innerTrigger.tag}
                   content={innerTrigger.content}
                   parentTag={tagName}
                 />
               ))}
             </div>
           )}

          {/* Footer with action buttons */}
          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t" style={{ borderColor: `currentColor`, opacity: 0.2 }}>
            <span className="text-xs font-mono text-muted-foreground truncate">
              /{tagName}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs gap-1 hover:bg-current/10"
            >
              <Copy className="w-3 h-3" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

/**
 * InnerTriggerBar Component - Renders inner trigger bars inside parent trigger bars
 * Format: <--triggername-->content</--triggername-->
 */
const InnerTriggerBar = ({ tagName, content, parentTag }: { tagName: string; content: string; parentTag: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-current/5 border border-current/20 rounded-md overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-current/10 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-xs font-mono font-bold text-current/70">
            &lt;--{tagName}--&gt;
          </span>
        </div>
        <ChevronDown className="w-3 h-3 transition-transform" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {isExpanded && (
        <div className="px-3 py-2 border-t border-current/20 bg-current/2">
          <div className="prose prose-xs dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({ node, ...props }) => <h3 className="text-sm font-bold mt-2 mb-1" {...props} />,
                h2: ({ node, ...props }) => <h4 className="text-xs font-semibold mt-1" {...props} />,
                p: ({ node, ...props }) => <p className="text-xs leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-0.5 text-xs" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-0.5 text-xs" {...props} />,
                code: ({ node, className, ...props }) =>
                  className ?
                    <code className="block bg-black/20 p-1 rounded text-xs font-mono overflow-x-auto" {...props} /> :
                    <code className="bg-black/10 px-1 rounded text-xs font-mono" {...props} />,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollapsibleTriggerTag;
