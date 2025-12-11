/**
 * useWebSearchMarkdown Hook
 * Manages web search markdown generation and state transitions
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  WebSearchMarkdownState,
  WebSearchResult,
  initializeWebSearchState,
  updateToProcessing,
  updateToAnalyzing,
  updateToComplete,
  generateWebSearchMarkdown,
  generatePeekResultsFromSources,
  extractWebSearchBlocks,
} from '@/lib/web-search-markdown-generator';

interface UseWebSearchMarkdownProps {
  onStatusChange?: (status: WebSearchMarkdownState['status']) => void;
  onMarkdownUpdate?: (markdown: string) => void;
}

interface UseWebSearchMarkdownReturn {
  state: WebSearchMarkdownState;
  markdown: string;
  startSearch: (topic: string, query: string) => void;
  updateToProcessing: (sources: string[]) => void;
  updateToAnalyzing: (results: WebSearchResult[]) => void;
  completeSearch: () => void;
  reset: () => void;
}

export const useWebSearchMarkdown = ({
  onStatusChange,
  onMarkdownUpdate,
}: UseWebSearchMarkdownProps): UseWebSearchMarkdownReturn => {
  const [state, setState] = useState<WebSearchMarkdownState | null>(null);
  const [markdown, setMarkdown] = useState('');
  const stateRef = useRef<WebSearchMarkdownState | null>(null);

  /**
   * Start a new search
   */
  const startSearch = useCallback((topic: string, query: string) => {
    const newState = initializeWebSearchState(topic, query);
    setState(newState);
    stateRef.current = newState;

    const newMarkdown = generateWebSearchMarkdown(newState);
    setMarkdown(newMarkdown);
    onMarkdownUpdate?.(newMarkdown);
    onStatusChange?.('searching');
  }, [onStatusChange, onMarkdownUpdate]);

  /**
   * Update to processing state
   */
  const handleUpdateToProcessing = useCallback((sources: string[]) => {
    if (!stateRef.current) return;

    const peekResults = generatePeekResultsFromSources(sources);
    const newState = updateToProcessing(stateRef.current, sources, peekResults);
    setState(newState);
    stateRef.current = newState;

    const newMarkdown = generateWebSearchMarkdown(newState);
    setMarkdown(newMarkdown);
    onMarkdownUpdate?.(newMarkdown);
    onStatusChange?.('processing');
  }, [onStatusChange, onMarkdownUpdate]);

  /**
   * Update to analyzing state
   */
  const handleUpdateToAnalyzing = useCallback((results: WebSearchResult[]) => {
    if (!stateRef.current) return;

    const newState = updateToAnalyzing(stateRef.current, results);
    setState(newState);
    stateRef.current = newState;

    const newMarkdown = generateWebSearchMarkdown(newState);
    setMarkdown(newMarkdown);
    onMarkdownUpdate?.(newMarkdown);
    onStatusChange?.('analyzing');
  }, [onStatusChange, onMarkdownUpdate]);

  /**
   * Complete search
   */
  const handleCompleteSearch = useCallback(() => {
    if (!stateRef.current) return;

    const newState = updateToComplete(stateRef.current);
    setState(newState);
    stateRef.current = newState;

    const newMarkdown = generateWebSearchMarkdown(newState);
    setMarkdown(newMarkdown);
    onMarkdownUpdate?.(newMarkdown);
    onStatusChange?.('complete');
  }, [onStatusChange, onMarkdownUpdate]);

  /**
   * Reset state
   */
  const handleReset = useCallback(() => {
    setState(null);
    setMarkdown('');
    stateRef.current = null;
  }, []);

  return {
    state: state || { id: '', status: 'searching', topic: '', searchQuery: '', results: [], sources: [], startTime: 0, metadata: { totalResults: 0, topicCategory: '', searchDuration: 0 } },
    markdown,
    startSearch,
    updateToProcessing: handleUpdateToProcessing,
    updateToAnalyzing: handleUpdateToAnalyzing,
    completeSearch: handleCompleteSearch,
    reset: handleReset,
  };
};

/**
 * Hook for managing web search markdown in chat messages
 */
interface UseWebSearchInChatProps {
  messageContent: string;
  onExtract?: (blocks: Array<{ markdown: string; content: string }>) => void;
}

export const useWebSearchInChat = ({ messageContent, onExtract }: UseWebSearchInChatProps) => {
  const [webSearchBlocks, setWebSearchBlocks] = useState<Array<{ markdown: string; content: string }>>([]);

  useEffect(() => {
    const blocks = extractWebSearchBlocks(messageContent);
    setWebSearchBlocks(blocks);
    onExtract?.(blocks);
  }, [messageContent, onExtract]);

  const hasWebSearch = webSearchBlocks.length > 0;
  const isSearching = webSearchBlocks.some((block) =>
    block.content.includes('Searching:') || block.content.includes('searching')
  );
  const isProcessing = webSearchBlocks.some((block) =>
    block.content.includes('Processing') || block.content.includes('processing')
  );
  const isComplete = webSearchBlocks.some((block) =>
    block.content.includes('✅') || block.content.includes('Complete')
  );

  return {
    webSearchBlocks,
    hasWebSearch,
    isSearching,
    isProcessing,
    isComplete,
  };
};

/**
 * Hook for streaming web search markdown updates
 */
interface UseStreamingWebSearchProps {
  enabled: boolean;
  initialQuery: string;
}

export const useStreamingWebSearch = ({ enabled, initialQuery }: UseStreamingWebSearchProps) => {
  const [status, setStatus] = useState<WebSearchMarkdownState['status']>('searching');
  const [sources, setSources] = useState<string[]>([]);
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!enabled) return;

    const phases = [
      {
        delay: 300,
        status: 'searching' as const,
        text: `Searching: ${initialQuery}`,
      },
      {
        delay: 2500,
        status: 'processing' as const,
        text: `Processing Search Results from multiple sources...`,
        sources: ['News Source 1', 'News Source 2', 'News Source 3'],
      },
      {
        delay: 4000,
        status: 'analyzing' as const,
        text: `Analyzing Results...`,
      },
      {
        delay: 5500,
        status: 'complete' as const,
        text: `Search Complete`,
      },
    ];

    const timers = phases.map((phase) =>
      setTimeout(() => {
        setStatus(phase.status);
        setDisplayText(phase.text);
        if (phase.sources) {
          setSources(phase.sources);
        }
      }, phase.delay)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, [enabled, initialQuery]);

  return {
    status,
    sources,
    displayText,
  };
};
