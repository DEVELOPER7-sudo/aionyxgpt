/**
 * useModelWebSearchOrchestration Hook
 * Manages AI model-based web search with multi-cycle orchestration
 * Works with Claude, ChatGPT, and other LLMs with web search capabilities
 */

import { useState, useCallback } from 'react';
import {
  ModelWebSearchState,
  ModelSearchCycle,
  initializeModelWebSearchState,
  createModelSearchCycle,
  updateModelSearchState,
  generateInitialSearchPrompt,
  generateFollowUpSearchPrompt,
  generateSynthesisPrompt,
  getRecommendedCycles,
} from '@/lib/model-web-search-orchestrator';

interface UseModelWebSearchOrchestrationProps {
  onAISearch: (prompt: string) => Promise<string>;
  maxCycles?: number;
}

interface UseModelWebSearchOrchestrationReturn {
  state: ModelWebSearchState;
  startResearch: (query: string) => Promise<void>;
  continueSearch: () => Promise<void>;
  refineSearch: (query: string) => Promise<void>;
  deepSearch: (query: string) => Promise<void>;
  generateFinalAnswer: () => Promise<string>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export const useModelWebSearchOrchestration = ({
  onAISearch,
  maxCycles = 3,
}: UseModelWebSearchOrchestrationProps): UseModelWebSearchOrchestrationReturn => {
  const [state, setState] = useState<ModelWebSearchState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a single search cycle
   */
  const executeCycle = useCallback(
    async (prompt: string, cycleNumber: number, query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Request AI to search and analyze
        const aiResponse = await onAISearch(prompt);

        if (!aiResponse) {
          throw new Error('No response from AI');
        }

        // Parse AI response into structured cycle
        const cycle = createModelSearchCycle(cycleNumber, query, aiResponse, prompt);

        // Update state
        setState((prevState) => {
          if (!prevState) return prevState;
          return updateModelSearchState(prevState, cycle, aiResponse.length);
        });

        // Check if we should stop
        if (cycle.nextAction === 'complete' || cycleNumber >= maxCycles) {
          setState((prevState) => {
            if (!prevState) return prevState;
            return { ...prevState, isComplete: true };
          });
        }

        return cycle;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Search cycle failed';
        setError(errorMessage);
        console.error('Cycle error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [onAISearch, maxCycles]
  );

  /**
   * Start initial research
   */
  const startResearch = useCallback(
    async (query: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Initialize state
        const newState = initializeModelWebSearchState(query);
        setState(newState);

        // Generate initial search prompt
        const prompt = generateInitialSearchPrompt(query);

        // Execute first cycle
        await executeCycle(prompt, 1, query);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to start research';
        setError(errorMessage);
        console.error('Research start error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [executeCycle]
  );

  /**
   * Continue with current search results
   */
  const continueSearch = useCallback(async () => {
    if (!state || state.currentCycleNumber === 0) {
      setError('No active search state');
      return;
    }

    const currentCycle = state.cycles[state.cycles.length - 1];
    if (!currentCycle) return;

    try {
      const nextCycleNumber = state.currentCycleNumber + 1;

      if (nextCycleNumber > maxCycles) {
        setState((prev) => (prev ? { ...prev, isComplete: true } : prev));
        return;
      }

      // Continue with same query but deeper analysis
      const prompt = generateFollowUpSearchPrompt(
        currentCycle.query,
        state.aiThoughts,
        nextCycleNumber
      );

      await executeCycle(prompt, nextCycleNumber, currentCycle.query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Continue search failed';
      setError(errorMessage);
      console.error('Continue error:', err);
    }
  }, [state, executeCycle, maxCycles]);

  /**
   * Refine search with new query
   */
  const refineSearch = useCallback(
    async (refinedQuery: string) => {
      if (!state || state.currentCycleNumber === 0) {
        setError('No active search state');
        return;
      }

      try {
        const nextCycleNumber = state.currentCycleNumber + 1;

        if (nextCycleNumber > maxCycles) {
          setState((prev) => (prev ? { ...prev, isComplete: true } : prev));
          return;
        }

        // Search with refined query
        const prompt = generateFollowUpSearchPrompt(
          refinedQuery,
          state.aiThoughts,
          nextCycleNumber
        );

        await executeCycle(prompt, nextCycleNumber, refinedQuery);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Refinement failed';
        setError(errorMessage);
        console.error('Refinement error:', err);
      }
    },
    [state, executeCycle, maxCycles]
  );

  /**
   * Deep search with specific query
   */
  const deepSearch = useCallback(
    async (deepQuery: string) => {
      if (!state || state.currentCycleNumber === 0) {
        setError('No active search state');
        return;
      }

      try {
        const nextCycleNumber = state.currentCycleNumber + 1;

        if (nextCycleNumber > maxCycles) {
          setState((prev) => (prev ? { ...prev, isComplete: true } : prev));
          return;
        }

        // Deep search with targeted query
        const prompt = generateFollowUpSearchPrompt(deepQuery, state.aiThoughts, nextCycleNumber);

        await executeCycle(prompt, nextCycleNumber, deepQuery);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Deep search failed';
        setError(errorMessage);
        console.error('Deep search error:', err);
      }
    },
    [state, executeCycle, maxCycles]
  );

  /**
   * Generate final answer with synthesis prompt
   */
  const generateFinalAnswer = useCallback(async (): Promise<string> => {
    if (!state) {
      throw new Error('No search state available');
    }

    try {
      const synthPrompt = generateSynthesisPrompt(state);
      const finalAnswer = await onAISearch(synthPrompt);
      return finalAnswer;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate answer';
      setError(errorMessage);
      throw err;
    }
  }, [state, onAISearch]);

  /**
   * Reset search state
   */
  const reset = useCallback(() => {
    setState(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    state: state || initializeModelWebSearchState(''),
    startResearch,
    continueSearch,
    refineSearch,
    deepSearch,
    generateFinalAnswer,
    isLoading,
    error,
    reset,
  };
};

/**
 * Hook for managing research results display and export
 */
export const useModelSearchResults = (state: ModelWebSearchState) => {
  const generateCitationFormat = (format: 'markdown' | 'harvard' | 'apa' = 'markdown') => {
    return state.allResults.map((result) => {
      switch (format) {
        case 'harvard':
          return `${result.title.replace(/[^\w\s]/g, '')}, ${new Date(result.foundInCycle).getFullYear()}`;
        case 'apa':
          return `${result.title}. Retrieved from ${result.url}`;
        default:
          return `[${result.title}](${result.url})`;
      }
    });
  };

  const exportAsMarkdown = () => {
    let markdown = `# Research: ${state.originalQuery}\n\n`;
    markdown += `**Total Search Cycles:** ${state.cycles.length}\n`;
    markdown += `**Total Sources:** ${state.allResults.length}\n\n`;

    markdown += `## Search Cycles\n\n`;
    state.cycles.forEach((cycle) => {
      markdown += `### Cycle ${cycle.cycleNumber}: "${cycle.query}"\n`;
      markdown += `- Sources found: ${cycle.resultsFromModel.length}\n`;
      markdown += `- Decision: ${cycle.nextAction}\n\n`;
    });

    markdown += `## All Sources\n\n`;
    state.allResults.forEach((result, idx) => {
      markdown += `${idx + 1}. [${result.title}](${result.url})\n`;
      markdown += `   - Domain: ${result.source}\n`;
      markdown += `   - Found in: Cycle ${result.foundInCycle}\n\n`;
    });

    return markdown;
  };

  const getSourcesByRelevance = (limit = 10) => {
    return state.allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  };

  return {
    generateCitationFormat,
    exportAsMarkdown,
    getSourcesByRelevance,
  };
};
