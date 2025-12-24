/**
 * Web Search Orchestrator
 * Manages intelligent web search cycles with reasoning and analysis between searches
 */

export interface SearchResult {
  title: string;
  url: string;
  description: string;
  domain: string;
  relevanceScore: number;
  sourceType: 'academic' | 'news' | 'official' | 'blog' | 'other';
  publishDate?: string;
}

export interface SearchCycle {
  cycleNumber: number;
  query: string;
  results: SearchResult[];
  reasoning: string;
  analysis: string;
  nextAction: 'analyze' | 'refine_search' | 'deep_search' | 'complete';
  suggestedNextQuery?: string;
}

export interface WebSearchState {
  originalQuery: string;
  cycles: SearchCycle[];
  allResults: SearchResult[];
  synthesisNotes: string[];
  currentCycleNumber: number;
  isComplete: boolean;
}

/**
 * Initialize a new web search state
 */
export const initializeWebSearchState = (query: string): WebSearchState => {
  return {
    originalQuery: query,
    cycles: [],
    allResults: [],
    synthesisNotes: [],
    currentCycleNumber: 0,
    isComplete: false,
  };
};

/**
 * Calculate relevance score for a search result
 */
export const calculateRelevanceScore = (
  result: SearchResult,
  query: string,
  sourceTypeWeights: Record<string, number> = {}
): number => {
  const defaultWeights = {
    academic: 1.0,
    official: 0.95,
    news: 0.85,
    blog: 0.7,
    other: 0.5,
  };

  const weights = { ...defaultWeights, ...sourceTypeWeights };
  
  // Base relevance from source type
  let score = weights[result.sourceType] || weights.other;

  // Title relevance boost
  const titleMatch = result.title.toLowerCase().includes(query.toLowerCase()) ? 0.15 : 0;
  
  // Description relevance boost
  const descriptionWords = query.toLowerCase().split(' ');
  const descriptionMatches = descriptionWords.filter(word => 
    result.description.toLowerCase().includes(word)
  ).length / descriptionWords.length;
  
  score += titleMatch + (descriptionMatches * 0.2);

  // Domain authority boost
  if (result.domain.endsWith('.gov') || result.domain.endsWith('.edu')) {
    score += 0.2;
  } else if (result.domain.endsWith('.org')) {
    score += 0.1;
  }

  // Recent content boost (within last month)
  if (result.publishDate) {
    const publishDate = new Date(result.publishDate);
    const daysSince = Math.floor((Date.now() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 30) {
      score += 0.15;
    }
  }

  return Math.min(score, 1.0); // Cap at 1.0
};

/**
 * Group results by domain to avoid duplication
 */
export const groupResultsByDomain = (results: SearchResult[]): Map<string, SearchResult[]> => {
  const grouped = new Map<string, SearchResult[]>();
  
  results.forEach(result => {
    const domain = result.domain;
    if (!grouped.has(domain)) {
      grouped.set(domain, []);
    }
    grouped.get(domain)!.push(result);
  });

  return grouped;
};

/**
 * Generate reasoning for current search cycle
 */
export const generateSearchCycleReasoning = (
  results: SearchResult[],
  cycleNumber: number,
  previousFindings?: string[]
): string => {
  const topResults = results.slice(0, 3);
  const domainGroups = groupResultsByDomain(results);
  
  let reasoning = `## 🧠 Cycle ${cycleNumber} Analysis\n\n`;
  
  reasoning += `**Top Sources Reviewed:**\n`;
  topResults.forEach((result, idx) => {
    reasoning += `${idx + 1}. [${result.title}](${result.url}) - ${result.sourceType.toUpperCase()}\n`;
    reasoning += `   - Relevance: ${(result.relevanceScore * 100).toFixed(0)}%\n`;
    reasoning += `   - Domain: ${result.domain}\n`;
  });

  reasoning += `\n**Source Distribution:**\n`;
  domainGroups.forEach((results, domain) => {
    reasoning += `- **${domain}**: ${results.length} result(s)\n`;
  });

  if (previousFindings && previousFindings.length > 0) {
    reasoning += `\n**Findings So Far:**\n`;
    previousFindings.forEach((finding, idx) => {
      reasoning += `${idx + 1}. ${finding}\n`;
    });
  }

  return reasoning;
};

/**
 * Analyze results and determine next action
 */
export const analyzeSearchResults = (
  results: SearchResult[],
  query: string,
  cycleNumber: number
): { analysis: string; nextAction: 'analyze' | 'refine_search' | 'deep_search' | 'complete'; suggestedNextQuery?: string } => {
  let analysis = `### Analysis of Current Results\n\n`;
  let nextAction: 'analyze' | 'refine_search' | 'deep_search' | 'complete' = 'analyze';
  let suggestedNextQuery: string | undefined;

  const relevantResults = results.filter(r => r.relevanceScore > 0.6);
  const coverage = (relevantResults.length / results.length) * 100;

  analysis += `**Coverage Assessment:**\n`;
  analysis += `- Relevant results: ${relevantResults.length}/${results.length} (${coverage.toFixed(0)}%)\n`;
  analysis += `- Average relevance score: ${(results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length * 100).toFixed(0)}%\n\n`;

  // Decision logic
  if (cycleNumber >= 3) {
    nextAction = 'complete';
    analysis += `**Decision:** Sufficient information gathered across ${cycleNumber} cycles. Ready for synthesis.\n`;
  } else if (coverage < 50) {
    nextAction = 'refine_search';
    suggestedNextQuery = generateRefinedQuery(query, results);
    analysis += `**Decision:** Low coverage (${coverage.toFixed(0)}%). Refining search with: "${suggestedNextQuery}"\n`;
  } else if (cycleNumber === 2) {
    nextAction = 'deep_search';
    suggestedNextQuery = generateDeepSearchQuery(query, results);
    analysis += `**Decision:** Good coverage. Performing deep search for: "${suggestedNextQuery}"\n`;
  } else {
    nextAction = 'analyze';
    analysis += `**Decision:** Continuing analysis of current results for synthesis.\n`;
  }

  return { analysis, nextAction, suggestedNextQuery };
};

/**
 * Generate a refined query based on gaps in current results
 */
export const generateRefinedQuery = (originalQuery: string, results: SearchResult[]): string => {
  const keywords = originalQuery.split(' ').filter(w => w.length > 3);
  const topDomains = groupResultsByDomain(results);
  
  // If too many results from one domain, add specificity
  if (topDomains.size === 1) {
    return `${originalQuery} alternatives`;
  }
  
  // Add negation for low-relevance domains
  const lowRelevanceDomains = Array.from(topDomains.entries())
    .filter(([_, results]) => results.every(r => r.relevanceScore < 0.5))
    .map(([domain]) => domain);

  let refined = originalQuery;
  if (lowRelevanceDomains.length > 0) {
    refined += ` -${lowRelevanceDomains[0]}`;
  }

  return refined;
};

/**
 * Generate a deep search query for more specific information
 */
export const generateDeepSearchQuery = (originalQuery: string, results: SearchResult[]): string => {
  const sourceTypes = [...new Set(results.map(r => r.sourceType))];
  
  // If mostly blog posts, ask for official sources
  if (sourceTypes.includes('blog') && !sourceTypes.includes('official')) {
    return `official ${originalQuery}`;
  }
  
  // If mostly news, ask for detailed analysis
  if (sourceTypes.includes('news') && !sourceTypes.includes('academic')) {
    return `${originalQuery} research study`;
  }

  return `${originalQuery} detailed analysis`;
};

/**
 * Format search results as markdown table
 */
export const formatSearchResultsAsTable = (
  results: SearchResult[],
  cycleNumber?: number
): string => {
  let markdown = cycleNumber 
    ? `### 📋 Web Search Results - Cycle ${cycleNumber}\n\n`
    : `### 📋 Web Search Results\n\n`;

  markdown += `| # | Source | URL | Type | Relevance | Updated |\n`;
  markdown += `|---|--------|-----|------|-----------|----------|\n`;

  results.slice(0, 10).forEach((result, idx) => {
    const relevanceBar = generateRelevanceBar(result.relevanceScore);
    const date = result.publishDate 
      ? new Date(result.publishDate).toLocaleDateString()
      : 'N/A';
    
    markdown += `| ${idx + 1} | **${result.title}** | [Link](${result.url}) | ${result.sourceType.toUpperCase()} | ${relevanceBar} | ${date} |\n`;
  });

  return markdown;
};

/**
 * Generate visual relevance bar
 */
export const generateRelevanceBar = (score: number): string => {
  const filled = Math.round(score * 5);
  const empty = 5 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = Math.round(score * 100);
  return `${bar} ${percentage}%`;
};

/**
 * Create a search cycle
 */
export const createSearchCycle = (
  cycleNumber: number,
  query: string,
  results: SearchResult[],
  previousFindings: string[] = []
): SearchCycle => {
  const reasoning = generateSearchCycleReasoning(results, cycleNumber, previousFindings);
  const { analysis, nextAction, suggestedNextQuery } = analyzeSearchResults(results, query, cycleNumber);

  return {
    cycleNumber,
    query,
    results,
    reasoning,
    analysis,
    nextAction,
    suggestedNextQuery,
  };
};

/**
 * Update web search state with new cycle
 */
export const updateSearchState = (
  state: WebSearchState,
  cycle: SearchCycle
): WebSearchState => {
  return {
    ...state,
    cycles: [...state.cycles, cycle],
    allResults: [...state.allResults, ...cycle.results],
    currentCycleNumber: cycle.cycleNumber,
    isComplete: cycle.nextAction === 'complete',
  };
};

/**
 * Generate synthesis prompt for final answer
 */
export const generateSynthesisPrompt = (state: WebSearchState): string => {
  let prompt = `## 🔗 Synthesis Guide\n\n`;
  prompt += `You have completed ${state.cycles.length} search cycle(s) with ${state.allResults.length} unique sources.\n\n`;

  prompt += `### Sources by Cycle:\n`;
  state.cycles.forEach(cycle => {
    prompt += `**Cycle ${cycle.cycleNumber}:** ${cycle.results.length} sources\n`;
    prompt += `- Next action determined: ${cycle.nextAction}\n`;
  });

  prompt += `\n### Instructions for Final Answer:\n`;
  prompt += `1. Synthesize findings from all cycles\n`;
  prompt += `2. Cite specific sources using [Source](URL) format\n`;
  prompt += `3. Highlight agreements and disagreements between sources\n`;
  prompt += `4. Distinguish between established facts and opinions\n`;
  prompt += `5. Include relevance assessment from search analysis\n`;
  prompt += `6. Note any areas requiring additional research\n`;

  return prompt;
};

/**
 * Detect if topic needs academic sources
 */
export const isAcademicTopic = (query: string): boolean => {
  const academicKeywords = [
    'research', 'study', 'theory', 'analysis', 'method', 'scientific',
    'hypothesis', 'experiment', 'data', 'statistical', 'peer review',
    'journal', 'academic', 'scholarly'
  ];

  return academicKeywords.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
};

/**
 * Detect if topic is time-sensitive
 */
export const isTimeSensitive = (query: string): boolean => {
  const timeSensitiveKeywords = [
    'latest', 'recent', 'news', 'current', 'today', 'this year',
    'breaking', 'update', '2024', '2025', 'upcoming', 'trend'
  ];

  return timeSensitiveKeywords.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
};

/**
 * Adjust search strategy based on query type
 */
export const getSearchStrategy = (query: string) => {
  const academic = isAcademicTopic(query);
  const timeSensitive = isTimeSensitive(query);

  let strategy: {
    maxCycles: number;
    preferredSourceTypes: ('academic' | 'news' | 'official' | 'blog' | 'other')[];
    minResultsPerCycle: number;
    minRelevanceThreshold: number;
  } = {
    maxCycles: 2,
    preferredSourceTypes: ['official', 'academic', 'news', 'blog'],
    minResultsPerCycle: 5,
    minRelevanceThreshold: 0.5,
  };

  if (academic) {
    strategy.preferredSourceTypes = ['academic', 'official', 'news', 'blog'];
    strategy.maxCycles = 3;
    strategy.minRelevanceThreshold = 0.65;
  }

  if (timeSensitive) {
    strategy.preferredSourceTypes = ['news', 'official', 'academic', 'blog'];
    strategy.minResultsPerCycle = 7;
  }

  return strategy;
};
