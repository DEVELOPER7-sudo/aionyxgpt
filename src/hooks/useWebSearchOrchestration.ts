/**
 * useWebSearchOrchestration Hook
 * Manages multi-cycle web search with AI reasoning between cycles
 */

import { useState, useCallback } from 'react';
import {
  WebSearchState,
  SearchCycle,
  SearchResult,
  initializeWebSearchState,
  createSearchCycle,
  updateSearchState,
  getSearchStrategy,
  generateSynthesisPrompt,
  calculateRelevanceScore,
} from '@/lib/web-search-orchestrator';

interface UseWebSearchOrchestrationProps {
  onSearch: (query: string, cycleNumber: number) => Promise<SearchResult[]>;
  onAnalyze?: (cycle: SearchCycle) => Promise<void>;
}

interface UseWebSearchOrchestrationReturn {
  state: WebSearchState;
  startSearch: (query: string) => Promise<void>;
  refineSearch: (query: string) => Promise<void>;
  deepSearch: (query: string) => Promise<void>;
  completeSearch: () => string;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export const useWebSearchOrchestration = ({
  onSearch,
  onAnalyze,
}: UseWebSearchOrchestrationProps): UseWebSearchOrchestrationReturn => {
  const [state, setState] = useState<WebSearchState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a search cycle
   */
  const executeCycle = useCallback(
    async (query: string, cycleNumber: number, previousFindings: string[] = []) => {
      setIsLoading(true);
      setError(null);

      try {
        // Perform web search
        const results = await onSearch(query, cycleNumber);

        if (!results || results.length === 0) {
          throw new Error('No search results returned');
        }

        // Calculate relevance scores
        const scoredResults = results.map(result => ({
          ...result,
          relevanceScore: calculateRelevanceScore(result, query),
        }));

        // Sort by relevance
        scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Create cycle
        const cycle = createSearchCycle(cycleNumber, query, scoredResults, previousFindings);

        // Call analysis hook if provided
        if (onAnalyze) {
          await onAnalyze(cycle);
        }

        // Update state
        setState(prevState => {
          if (!prevState) return prevState;
          return updateSearchState(prevState, cycle);
        });

        return cycle;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, onAnalyze]
  );

  /**
   * Start initial search
   */
  const startSearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize state
        const newState = initializeWebSearchState(query);
        setState(newState);

        // Get search strategy
        const strategy = getSearchStrategy(query);

        // Execute first cycle
        await executeCycle(query, 1, []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start search';
        setError(errorMessage);
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [executeCycle]
  );

  /**
   * Refine search based on analysis
   */
  const refineSearch = useCallback(
    async (refinedQuery: string) => {
      if (!state) {
        setError('No active search state');
        return;
      }

      try {
        const cycleNumber = state.currentCycleNumber + 1;
        const previousFindings = state.synthesisNotes;

        await executeCycle(refinedQuery, cycleNumber, previousFindings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Refinement failed';
        setError(errorMessage);
        console.error('Refinement error:', err);
      }
    },
    [state, executeCycle]
  );

  /**
   * Perform deep search
   */
  const deepSearch = useCallback(
    async (deepQuery: string) => {
      if (!state) {
        setError('No active search state');
        return;
      }

      try {
        const cycleNumber = state.currentCycleNumber + 1;
        const previousFindings = state.synthesisNotes;

        await executeCycle(deepQuery, cycleNumber, previousFindings);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Deep search failed';
        setError(errorMessage);
        console.error('Deep search error:', err);
      }
    },
    [state, executeCycle]
  );

  /**
   * Complete search and generate synthesis prompt
   */
  const completeSearch = useCallback((): string => {
    if (!state || state.cycles.length === 0) {
      return 'No search data available';
    }

    return generateSynthesisPrompt(state);
  }, [state]);

  /**
   * Reset search state
   */
  const reset = useCallback(() => {
    setState(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    state: state || initializeWebSearchState(''),
    startSearch,
    refineSearch,
    deepSearch,
    completeSearch,
    isLoading,
    error,
    reset,
  };
};

/**
 * Hook for managing search result synthesis
 */
export const useSearchSynthesis = (state: WebSearchState) => {
  const generateSummary = useCallback((): string => {
    if (state.cycles.length === 0) return '';

    let summary = `## Search Summary\n\n`;
    summary += `**Total Cycles:** ${state.cycles.length}\n`;
    summary += `**Total Sources:** ${state.allResults.length}\n\n`;

    summary += `### Source Breakdown:\n`;
    const sourceTypeCounts = state.allResults.reduce((acc, result) => {
      acc[result.sourceType] = (acc[result.sourceType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(sourceTypeCounts).forEach(([type, count]) => {
      summary += `- **${type.charAt(0).toUpperCase() + type.slice(1)}:** ${count} sources\n`;
    });

    summary += `\n### Top Sources by Relevance:\n`;
    state.allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
      .forEach((result, idx) => {
        summary += `${idx + 1}. [${result.title}](${result.url}) - ${(result.relevanceScore * 100).toFixed(0)}%\n`;
      });

    return summary;
  }, [state]);

  const getTopSources = useCallback(
    (count: number = 10): SearchResult[] => {
      return state.allResults
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, count);
    },
    [state.allResults]
  );

  const getSourcesByType = useCallback(
    (type: string): SearchResult[] => {
      return state.allResults.filter(r => r.sourceType === type);
    },
    [state.allResults]
  );

  const exportResults = useCallback((): string => {
    let exported = `# Web Search Results for: ${state.originalQuery}\n\n`;
    exported += `Generated: ${new Date().toISOString()}\n`;
    exported += `Total Sources: ${state.allResults.length}\n\n`;

    exported += `## All Sources\n\n`;
    state.allResults.forEach((result, idx) => {
      exported += `### ${idx + 1}. ${result.title}\n`;
      exported += `- **URL:** ${result.url}\n`;
      exported += `- **Domain:** ${result.domain}\n`;
      exported += `- **Type:** ${result.sourceType}\n`;
      exported += `- **Relevance:** ${(result.relevanceScore * 100).toFixed(0)}%\n`;
      if (result.publishDate) {
        exported += `- **Published:** ${result.publishDate}\n`;
      }
      exported += `- **Description:** ${result.description}\n\n`;
    });

    return exported;
  }, [state]);

  return {
    generateSummary,
    getTopSources,
    getSourcesByType,
    exportResults,
  };
};
