/**
 * Web Search Orchestrator UI Component
 * Displays multi-cycle web search with reasoning and analysis between searches
 */

import React, { useState } from 'react';
import {
  WebSearchState,
  SearchCycle,
  formatSearchResultsAsTable,
  generateRelevanceBar,
  SearchResult,
} from '@/lib/web-search-orchestrator';

interface WebSearchOrchestratorProps {
  state: WebSearchState;
  onRefineSearch?: (query: string) => void;
  onDeepSearch?: (query: string) => void;
  onComplete?: () => void;
  isLoading?: boolean;
}

export const WebSearchOrchestrator: React.FC<WebSearchOrchestratorProps> = ({
  state,
  onRefineSearch,
  onDeepSearch,
  onComplete,
  isLoading = false,
}) => {
  const [expandedCycles, setExpandedCycles] = useState<Set<number>>(new Set([state.currentCycleNumber]));

  const toggleCycle = (cycleNumber: number) => {
    const newExpanded = new Set(expandedCycles);
    if (newExpanded.has(cycleNumber)) {
      newExpanded.delete(cycleNumber);
    } else {
      newExpanded.add(cycleNumber);
    }
    setExpandedCycles(newExpanded);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg border border-slate-700">
      {/* Header */}
      <div className="border-b border-slate-600 pb-4">
        <h2 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <span>🔍</span> Web Search Orchestration
        </h2>
        <p className="text-slate-400 mt-2">
          Query: <span className="text-white font-semibold">{state.originalQuery}</span>
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Cycles:</span>
            <span className="text-cyan-400 font-bold">{state.currentCycleNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Total Sources:</span>
            <span className="text-cyan-400 font-bold">{state.allResults.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold ${state.isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
              {state.isComplete ? '✓ Complete' : 'In Progress'}
            </span>
          </div>
        </div>
      </div>

      {/* Search Cycles */}
      <div className="space-y-4">
        {state.cycles.map((cycle) => (
          <SearchCycleCard
            key={cycle.cycleNumber}
            cycle={cycle}
            isExpanded={expandedCycles.has(cycle.cycleNumber)}
            onToggle={() => toggleCycle(cycle.cycleNumber)}
            isLatest={cycle.cycleNumber === state.currentCycleNumber}
          />
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="p-4 bg-blue-900/30 border border-blue-600 rounded-lg">
          <div className="flex items-center gap-2 text-blue-400">
            <span className="animate-spin">⟳</span>
            <span>Searching and analyzing...</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!state.isComplete && state.cycles.length > 0 && (
        <div className="pt-4 border-t border-slate-600 space-y-3">
          {state.cycles[state.cycles.length - 1].suggestedNextQuery && (
            <>
              {state.cycles[state.cycles.length - 1].nextAction === 'refine_search' && (
                <button
                  onClick={() => onRefineSearch?.(state.cycles[state.cycles.length - 1].suggestedNextQuery!)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg font-semibold text-white transition"
                >
                  🔄 Refine Search: "{state.cycles[state.cycles.length - 1].suggestedNextQuery}"
                </button>
              )}
              {state.cycles[state.cycles.length - 1].nextAction === 'deep_search' && (
                <button
                  onClick={() => onDeepSearch?.(state.cycles[state.cycles.length - 1].suggestedNextQuery!)}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-semibold text-white transition"
                >
                  🔎 Deep Search: "{state.cycles[state.cycles.length - 1].suggestedNextQuery}"
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Complete Button */}
      {state.isComplete && (
        <div className="pt-4 border-t border-slate-600">
          <button
            onClick={onComplete}
            className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-white transition"
          >
            ✓ Complete Search & Generate Answer
          </button>
        </div>
      )}
    </div>
  );
};

interface SearchCycleCardProps {
  cycle: SearchCycle;
  isExpanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
}

const SearchCycleCard: React.FC<SearchCycleCardProps> = ({ cycle, isExpanded, onToggle, isLatest }) => {
  return (
    <div className={`border rounded-lg overflow-hidden transition ${
      isLatest 
        ? 'bg-slate-800/50 border-blue-500 shadow-lg shadow-blue-500/20' 
        : 'bg-slate-800/30 border-slate-600'
    }`}>
      {/* Cycle Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl ${isLatest ? 'text-blue-400' : 'text-slate-400'}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">
              Cycle {cycle.cycleNumber}
              {isLatest && <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">Latest</span>}
            </h3>
            <p className="text-sm text-slate-400">
              {cycle.results.length} sources • Next action: <span className="text-cyan-400 font-semibold">{cycle.nextAction}</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl text-yellow-400">▶</span>
        </div>
      </button>

      {/* Cycle Details */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-4 bg-slate-900/50">
          {/* Reasoning */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-400">🧠 Reasoning</h4>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap font-mono">
              {cycle.reasoning}
            </div>
          </div>

          {/* Results Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-400">📋 Sources</h4>
            <SearchResultsTable results={cycle.results} cycleNumber={cycle.cycleNumber} />
          </div>

          {/* Analysis */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-400">📊 Analysis</h4>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm text-slate-300 whitespace-pre-wrap">
              {cycle.analysis}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SearchResultsTableProps {
  results: SearchResult[];
  cycleNumber?: number;
}

const SearchResultsTable: React.FC<SearchResultsTableProps> = ({ results, cycleNumber }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-700">
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">#</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Source</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Type</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Relevance</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Domain</th>
          </tr>
        </thead>
        <tbody>
          {results.slice(0, 8).map((result, idx) => (
            <tr key={idx} className="hover:bg-slate-700/50 border-b border-slate-700">
              <td className="border border-slate-600 px-3 py-2 text-slate-300">{idx + 1}</td>
              <td className="border border-slate-600 px-3 py-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline truncate max-w-xs"
                  title={result.title}
                >
                  {result.title}
                </a>
              </td>
              <td className="border border-slate-600 px-3 py-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${getSourceTypeColor(result.sourceType)}`}>
                  {result.sourceType.toUpperCase()}
                </span>
              </td>
              <td className="border border-slate-600 px-3 py-2">
                <div className="flex items-center gap-2">
                  {generateRelevanceBar(result.relevanceScore)}
                </div>
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-400 text-xs">
                {result.domain}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length > 8 && (
        <p className="text-xs text-slate-400 mt-2">
          Showing 8 of {results.length} results
        </p>
      )}
    </div>
  );
};

function getSourceTypeColor(sourceType: string): string {
  switch (sourceType) {
    case 'academic':
      return 'bg-purple-900 text-purple-200';
    case 'official':
      return 'bg-green-900 text-green-200';
    case 'news':
      return 'bg-blue-900 text-blue-200';
    case 'blog':
      return 'bg-orange-900 text-orange-200';
    default:
      return 'bg-slate-700 text-slate-200';
  }
}
