/**
 * Model-Based Web Search Orchestrator UI Component
 * Displays AI's web search reasoning and results across multiple cycles
 */

import React, { useState } from 'react';
import { ModelWebSearchState, ModelSearchCycle } from '@/lib/model-web-search-orchestrator';

interface ModelWebSearchOrchestratorProps {
  state: ModelWebSearchState;
  onContinueSearch?: () => void;
  onRefineSearch?: (query: string) => void;
  onDeepSearch?: (query: string) => void;
  onComplete?: () => void;
  isLoading?: boolean;
}

export const ModelWebSearchOrchestrator: React.FC<ModelWebSearchOrchestratorProps> = ({
  state,
  onContinueSearch,
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
          <span>🔍</span> Web Search Research
        </h2>
        <p className="text-slate-400 mt-2">
          Query: <span className="text-white font-semibold">{state.originalQuery}</span>
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Cycles:</span>
            <span className="text-cyan-400 font-bold">{state.currentCycleNumber}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Sources Found:</span>
            <span className="text-cyan-400 font-bold">{state.allResults.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Status:</span>
            <span className={`font-bold ${state.isComplete ? 'text-green-400' : 'text-yellow-400'}`}>
              {state.isComplete ? '✓ Complete' : 'In Progress'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-400">Messages:</span>
            <span className="text-cyan-400 font-bold">{state.modelMessagesCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {!state.isComplete && (
        <div className="space-y-2">
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (state.currentCycleNumber / 3) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {state.currentCycleNumber === 0
              ? 'Starting research...'
              : `Cycle ${state.currentCycleNumber} • ${state.allResults.length} sources collected`}
          </p>
        </div>
      )}

      {/* Search Cycles */}
      <div className="space-y-4">
        {state.cycles.map((cycle) => (
          <ModelSearchCycleCard
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
            <span>AI is searching the web and analyzing results...</span>
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
          {state.cycles[state.cycles.length - 1].nextAction === 'analyze' && (
            <button
              onClick={onContinueSearch}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg font-semibold text-white transition"
            >
              → Continue Analyzing
            </button>
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
            ✓ Generate Final Answer
          </button>
        </div>
      )}
    </div>
  );
};

interface ModelSearchCycleCardProps {
  cycle: ModelSearchCycle;
  isExpanded: boolean;
  onToggle: () => void;
  isLatest: boolean;
}

const ModelSearchCycleCard: React.FC<ModelSearchCycleCardProps> = ({
  cycle,
  isExpanded,
  onToggle,
  isLatest,
}) => {
  return (
    <div
      className={`border rounded-lg overflow-hidden transition ${
        isLatest
          ? 'bg-slate-800/50 border-blue-500 shadow-lg shadow-blue-500/20'
          : 'bg-slate-800/30 border-slate-600'
      }`}
    >
      {/* Cycle Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition"
      >
        <div className="flex items-center gap-3 flex-1">
          <span className={`text-xl ${isLatest ? 'text-blue-400' : 'text-slate-400'}`}>
            {isExpanded ? '▼' : '▶'}
          </span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">
              Cycle {cycle.cycleNumber}
              {isLatest && <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">Latest</span>}
            </h3>
            <p className="text-sm text-slate-400">
              Query: <span className="text-cyan-300">{cycle.query}</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {cycle.resultsFromModel.length} sources found • Decision: {cycle.nextAction}
            </p>
          </div>
        </div>
      </button>

      {/* Cycle Details */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 space-y-4 bg-slate-900/50">
          {/* AI Reasoning */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-400">🧠 AI Reasoning</h4>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm text-slate-300 max-h-48 overflow-y-auto">
              <p className="whitespace-pre-wrap">{cycle.aiReasoning}</p>
            </div>
          </div>

          {/* Results Found */}
          {cycle.resultsFromModel.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-bold text-cyan-400">
                📋 Results Found ({cycle.resultsFromModel.length})
              </h4>
              <ModelSearchResultsTable results={cycle.resultsFromModel} cycleNumber={cycle.cycleNumber} />
            </div>
          )}

          {/* Next Action */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-400">🎯 Decision</h4>
            <div className="bg-slate-900 p-3 rounded border border-slate-700 text-sm">
              <p className="text-slate-300">
                <span className="font-semibold">Next Action:</span>{' '}
                <span className="text-yellow-400 font-bold capitalize">{cycle.nextAction}</span>
              </p>
              {cycle.suggestedNextQuery && (
                <p className="text-slate-300 mt-2">
                  <span className="font-semibold">Suggested Query:</span>{' '}
                  <span className="text-blue-300">"{cycle.suggestedNextQuery}"</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface ModelSearchResultsTableProps {
  results: Array<{ title: string; url: string; source: string; relevanceScore: number }>;
  cycleNumber?: number;
}

const ModelSearchResultsTable: React.FC<ModelSearchResultsTableProps> = ({ results }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-slate-700">
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">#</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Source</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Domain</th>
            <th className="border border-slate-600 px-3 py-2 text-left text-cyan-400">Relevance</th>
          </tr>
        </thead>
        <tbody>
          {results.slice(0, 6).map((result, idx) => (
            <tr key={idx} className="hover:bg-slate-700/50 border-b border-slate-700">
              <td className="border border-slate-600 px-3 py-2 text-slate-300 font-bold">{idx + 1}</td>
              <td className="border border-slate-600 px-3 py-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline truncate block max-w-xs"
                  title={result.title}
                >
                  {result.title}
                </a>
              </td>
              <td className="border border-slate-600 px-3 py-2 text-slate-400 text-xs">{result.source}</td>
              <td className="border border-slate-600 px-3 py-2">
                <div className="flex items-center gap-2">
                  {generateRelevanceVisualization(result.relevanceScore)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {results.length > 6 && (
        <p className="text-xs text-slate-400 mt-2">Showing 6 of {results.length} results</p>
      )}
    </div>
  );
};

function generateRelevanceVisualization(score: number): string {
  const filled = Math.round(score * 5);
  const empty = 5 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = Math.round(score * 100);
  return `${bar} ${percentage}%`;
}
