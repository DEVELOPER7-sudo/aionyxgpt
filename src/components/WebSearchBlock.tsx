/**
 * Web Search Block Component
 * Displays organized web search markdown blocks with real-time status updates
 */

import React, { useState, useEffect } from 'react';
import { WebSearchMarkdownState } from '@/lib/web-search-markdown-generator';

interface WebSearchBlockProps {
  markdown: string;
  state?: WebSearchMarkdownState;
  animated?: boolean;
}

export const WebSearchBlock: React.FC<WebSearchBlockProps> = ({ markdown, state, animated = true }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (animated && state?.status !== 'complete') {
      // Animate text for searching/processing states
      let index = 0;
      const interval = setInterval(() => {
        if (index < markdown.length) {
          setDisplayedContent(markdown.substring(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 5);

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(markdown);
    }
  }, [markdown, animated, state?.status]);

  const getStatusColor = () => {
    if (!state) return 'border-slate-600';
    switch (state.status) {
      case 'searching':
        return 'border-blue-500 shadow-lg shadow-blue-500/20';
      case 'processing':
        return 'border-purple-500 shadow-lg shadow-purple-500/20';
      case 'analyzing':
        return 'border-cyan-500 shadow-lg shadow-cyan-500/20';
      case 'complete':
        return 'border-green-500 shadow-lg shadow-green-500/20';
      default:
        return 'border-slate-600';
    }
  };

  const getBackgroundGradient = () => {
    if (!state) return 'from-slate-900 to-slate-800';
    switch (state.status) {
      case 'searching':
        return 'from-blue-900/20 to-slate-800';
      case 'processing':
        return 'from-purple-900/20 to-slate-800';
      case 'analyzing':
        return 'from-cyan-900/20 to-slate-800';
      case 'complete':
        return 'from-green-900/20 to-slate-800';
      default:
        return 'from-slate-900 to-slate-800';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getBackgroundGradient()} border ${getStatusColor()} rounded-lg overflow-hidden transition-all duration-300`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/30 transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl animate-pulse">{getStatusEmoji(state?.status)}</span>
          <span className="font-bold text-white">
            {state?.status === 'searching' && `Searching: ${state.searchQuery}`}
            {state?.status === 'processing' && `Processing Search Results from ${state.peekResults?.slice(0, 3).join(', ')}...`}
            {state?.status === 'analyzing' && `Analyzing ${state?.results.length} Sources`}
            {state?.status === 'complete' && `Search Complete (${state?.results.length} sources)`}
          </span>
        </div>
        <span className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 max-h-96 overflow-y-auto">
          <div className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
            {displayedContent}
            {animated && state?.status !== 'complete' && <span className="animate-pulse">▌</span>}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {state && state.status !== 'complete' && (
        <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  state.status === 'searching'
                    ? 'w-1/3 bg-blue-500'
                    : state.status === 'processing'
                    ? 'w-2/3 bg-purple-500'
                    : state.status === 'analyzing'
                    ? 'w-5/6 bg-cyan-500'
                    : 'w-full bg-green-500'
                }`}
              />
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {formatDuration(state.metadata.searchDuration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Web Search Results Display Component
 */
interface WebSearchResultsProps {
  state: WebSearchMarkdownState;
}

export const WebSearchResults: React.FC<WebSearchResultsProps> = ({ state }) => {
  if (state.results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/30">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">📋 Search Results</h3>

        <div className="space-y-2">
          {state.results.slice(0, 10).map((result, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition border border-slate-600"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm line-clamp-2"
                  title={result.title}
                >
                  {result.title}
                </a>
                <span className="text-xs text-slate-400 flex-shrink-0">{result.source}</span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-2">{result.snippet}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{result.url}</span>
                <div className="text-xs font-mono text-slate-400">
                  Relevance: {generateRelevanceBar(result.relevance)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.results.length > 10 && (
          <p className="text-xs text-slate-400 mt-3 text-center">
            And {state.results.length - 10} more results...
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Streaming Web Search Component
 * For real-time streaming of web search blocks
 */
interface StreamingWebSearchProps {
  initialQuery: string;
  onStatusChange?: (status: string) => void;
}

export const StreamingWebSearch: React.FC<StreamingWebSearchProps> = ({ initialQuery, onStatusChange }) => {
  const [status, setStatus] = useState<'searching' | 'processing' | 'analyzing' | 'complete'>('searching');
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    // Simulate search progression
    const timeline = [
      { delay: 500, status: 'searching' as const },
      { delay: 2000, status: 'processing' as const, sources: ['Times of India', 'Hindustan Times', 'NDTV'] },
      { delay: 3500, status: 'analyzing' as const },
      { delay: 5000, status: 'complete' as const },
    ];

    const timers = timeline.map((event) =>
      setTimeout(() => {
        setStatus(event.status);
        if (event.sources) {
          setSources(event.sources);
        }
        onStatusChange?.(event.status);
      }, event.delay)
    );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [initialQuery, onStatusChange]);

  return (
    <div className="space-y-3">
      <div className="border border-slate-600 rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="px-4 py-3 flex items-center gap-3">
          <span className="text-xl animate-pulse">{getStatusEmoji(status)}</span>
          <div>
            {status === 'searching' && (
              <span className="text-white font-semibold">
                Searching: <span className="text-blue-400">{initialQuery}</span>
              </span>
            )}
            {status === 'processing' && (
              <div>
                <span className="text-white font-semibold">Processing Search Results</span>
                <p className="text-xs text-slate-400 mt-1">
                  from {sources.slice(0, 3).join(', ')}
                  {sources.length > 3 ? `, and ${sources.length - 3} others` : ''}...
                </p>
              </div>
            )}
            {status === 'analyzing' && (
              <span className="text-white font-semibold">Analyzing Results...</span>
            )}
            {status === 'complete' && (
              <span className="text-white font-semibold">Search Complete</span>
            )}
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-900/50 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-700 rounded-full h-1">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  status === 'searching'
                    ? 'w-1/3 bg-blue-500'
                    : status === 'processing'
                    ? 'w-2/3 bg-purple-500'
                    : status === 'analyzing'
                    ? 'w-5/6 bg-cyan-500'
                    : 'w-full bg-green-500'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions

function getStatusEmoji(status?: string): string {
  switch (status) {
    case 'searching':
      return '🔄';
    case 'processing':
      return '⚙️';
    case 'analyzing':
      return '🧠';
    case 'complete':
      return '✅';
    default:
      return '❓';
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function generateRelevanceBar(score: number): string {
  const filled = Math.round(score * 5);
  const empty = 5 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = Math.round(score * 100);
  return `${bar} ${percentage}%`;
}
