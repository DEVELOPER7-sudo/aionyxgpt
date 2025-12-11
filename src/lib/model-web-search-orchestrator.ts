/**
 * Model-Based Web Search Orchestrator
 * AI model performs searches directly without external APIs
 * Works with Claude, ChatGPT, and other models with web search capabilities
 */

export interface ModelSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore: number;
  foundInCycle: number;
}

export interface ModelSearchCycle {
  cycleNumber: number;
  query: string;
  searchPrompt: string;
  aiReasoning: string;
  resultsFromModel: ModelSearchResult[];
  nextAction: 'analyze' | 'refine_search' | 'deep_search' | 'complete';
  suggestedNextQuery?: string;
}

export interface ModelWebSearchState {
  originalQuery: string;
  cycles: ModelSearchCycle[];
  allResults: ModelSearchResult[];
  aiThoughts: string[];
  currentCycleNumber: number;
  isComplete: boolean;
  modelMessagesCount: number;
}

/**
 * Initialize model-based web search state
 */
export const initializeModelWebSearchState = (query: string): ModelWebSearchState => {
  return {
    originalQuery: query,
    cycles: [],
    allResults: [],
    aiThoughts: [],
    currentCycleNumber: 0,
    isComplete: false,
    modelMessagesCount: 0,
  };
};

/**
 * Generate the system prompt for model-based web search
 * This tells the AI to search the web and manage the orchestration
 */
export const generateModelWebSearchSystemPrompt = (): string => {
  return `You are an expert research assistant with web search capabilities.

## Web Search Orchestration Protocol

When researching topics, you MUST follow this multi-cycle approach:

### Cycle Structure
Each cycle consists of:
1. **Search Phase**: Use your web search to find relevant information
2. **Analysis Phase**: Review 2-3 top results from your search
3. **Decision Phase**: Determine if you need another cycle or if you have enough info

### Before Each Search, Write Your Reasoning:

\`\`\`
<reason>
[Why you're searching for this and what you expect to find]
</reason>
\`\`\`

### After You Get Search Results:

\`\`\`
<analyze>
[Analyze the top 2-3 results you found]
- Result 1: Key findings
- Result 2: Key findings
- Result 3: Key findings

Patterns I notice:
- Common themes across sources
- Disagreements or differences
- What information is still missing
</analyze>

<deepresearch>
[Assess if I need to search again]

Coverage assessment:
- What I've learned so far
- What gaps remain
- Whether to continue, refine, or complete

Next action: [ANALYZE | REFINE_SEARCH | DEEP_SEARCH | COMPLETE]
Suggested next query (if searching again): [specific query]
</deepresearch>
\`\`\`

### Search Query Guidelines:
- Start broad to understand the landscape
- If results are off-topic → REFINE with different terms
- If you need specific details → DEEP_SEARCH with targeted query
- After 2-3 cycles or sufficient coverage → COMPLETE

### Citation Format During Research:
When presenting findings, cite like:
"According to [Source Name](URL), [claim]."

### Final Answer Requirements:
After all cycles, synthesize by:
1. Comparing multiple sources
2. Highlighting what sources agree on
3. Noting any disagreements
4. Citing each major claim with sources
5. Indicating source reliability`;
};

/**
 * Generate initial search cycle prompt for the AI
 */
export const generateInitialSearchPrompt = (userQuery: string): string => {
  return `Research the following topic using web search: "${userQuery}"

Follow the orchestration protocol:

1. Write your initial reasoning about what you'll search for
2. Perform your first web search
3. Analyze the top 2-3 results you found
4. Decide if you need another cycle

Format your response with the trigger tags as specified:
- <reason> ... </reason>
- <analyze> ... </analyze>
- <deepresearch> ... </deepresearch>

Start now.`;
};

/**
 * Generate follow-up search prompt after cycle completion
 */
export const generateFollowUpSearchPrompt = (
  suggestedQuery: string,
  previousFindings: string[],
  cycleNumber: number
): string => {
  return `Continue your research with this search: "${suggestedQuery}"

This is cycle ${cycleNumber} of your orchestrated search.

Previous findings to build on:
${previousFindings.map((finding, i) => `${i + 1}. ${finding}`).join('\n')}

Perform your web search, analyze 2-3 results, and decide if you need another cycle.

Use the same format:
- <reason> ... </reason>
- <analyze> ... </analyze>
- <deepresearch> ... </deepresearch>

Start now.`;
};

/**
 * Generate synthesis prompt after all cycles complete
 */
export const generateSynthesisPrompt = (
  state: ModelWebSearchState
): string => {
  return `You have completed ${state.cycles.length} research cycles.

Here's what you found:
${state.aiThoughts.map((thought, i) => `**Cycle ${i + 1}:** ${thought}`).join('\n\n')}

Now generate a comprehensive final answer that:
1. Synthesizes findings from all cycles
2. Compares multiple sources
3. Uses proper citations: [Source](URL)
4. Highlights agreements and disagreements
5. Notes source reliability
6. Addresses the original question: "${state.originalQuery}"

Format the answer in markdown with clear sections and citations.`;
};

/**
 * Extract search results from AI response
 * AI will naturally present search results in its reasoning
 * We parse and structure them here
 */
export const extractResultsFromAIResponse = (
  aiResponse: string,
  cycleNumber: number
): ModelSearchResult[] => {
  const results: ModelSearchResult[] = [];
  
  // Look for markdown links [text](url) in the response
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const titlePattern = /(?:from|according to|via|found at)?\s*\*\*([^*]+)\*\*|###\s+([^\n]+)/gi;
  
  let linkMatch;
  let titleMatch;
  const foundLinks = new Map<string, string>();
  
  // Extract all links
  while ((linkMatch = linkPattern.exec(aiResponse)) !== null) {
    foundLinks.set(linkMatch[1], linkMatch[2]);
  }
  
  // Convert to structured results
  let index = 0;
  foundLinks.forEach((url, title) => {
    if (title && url && (url.startsWith('http://') || url.startsWith('https://'))) {
      results.push({
        title,
        url,
        snippet: extractSnippetNearLink(aiResponse, url),
        source: extractDomain(url),
        relevanceScore: 0.8 - (index * 0.1), // Decrease relevance for later results
        foundInCycle: cycleNumber,
      });
      index++;
    }
  });
  
  return results.slice(0, 10); // Limit to 10 results
};

/**
 * Extract snippet of text near a URL in the response
 */
function extractSnippetNearLink(text: string, url: string): string {
  const index = text.indexOf(url);
  if (index === -1) return '';
  
  // Get 200 chars before and after the URL
  const start = Math.max(0, index - 200);
  const end = Math.min(text.length, index + 200);
  
  let snippet = text.substring(start, end).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Clean up and limit
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  
  return snippet.substring(0, 200).trim();
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

/**
 * Parse AI response to extract next action and query
 */
export const parseAIDecision = (
  aiResponse: string
): {
  nextAction: 'analyze' | 'refine_search' | 'deep_search' | 'complete';
  suggestedQuery?: string;
} => {
  const lowerResponse = aiResponse.toLowerCase();
  
  // Check for completion indicators
  if (
    lowerResponse.includes('complete') ||
    lowerResponse.includes('sufficient information') ||
    lowerResponse.includes('ready to synthesize') ||
    lowerResponse.includes('final answer')
  ) {
    return { nextAction: 'complete' };
  }
  
  // Check for refine search
  if (
    lowerResponse.includes('refine') ||
    lowerResponse.includes('off-topic') ||
    lowerResponse.includes('low coverage') ||
    lowerResponse.includes('different terms')
  ) {
    const queryMatch = aiResponse.match(
      /suggested next query[:\s]*["`]?([^"`\n]+)["`]?/i
    );
    return {
      nextAction: 'refine_search',
      suggestedQuery: queryMatch ? queryMatch[1].trim() : undefined,
    };
  }
  
  // Check for deep search
  if (
    lowerResponse.includes('deep search') ||
    lowerResponse.includes('deeper') ||
    lowerResponse.includes('specific') ||
    lowerResponse.includes('detailed')
  ) {
    const queryMatch = aiResponse.match(
      /suggested next query[:\s]*["`]?([^"`\n]+)["`]?/i
    );
    return {
      nextAction: 'deep_search',
      suggestedQuery: queryMatch ? queryMatch[1].trim() : undefined,
    };
  }
  
  // Default to analyze
  return { nextAction: 'analyze' };
};

/**
 * Extract reasoning from AI response for display
 */
export const extractReasoningFromResponse = (aiResponse: string): string => {
  // Try to extract trigger tag content
  const reasonMatch = aiResponse.match(
    /<reason>([\s\S]*?)<\/reason>/i
  );
  if (reasonMatch) {
    return reasonMatch[1].trim();
  }
  
  // Fallback to first paragraph
  const paragraphs = aiResponse.split('\n\n');
  return paragraphs[0] || aiResponse.substring(0, 300);
};

/**
 * Create a model search cycle
 */
export const createModelSearchCycle = (
  cycleNumber: number,
  query: string,
  aiResponse: string,
  searchPrompt: string
): ModelSearchCycle => {
  const results = extractResultsFromAIResponse(aiResponse, cycleNumber);
  const { nextAction, suggestedQuery } = parseAIDecision(aiResponse);
  const reasoning = extractReasoningFromResponse(aiResponse);
  
  return {
    cycleNumber,
    query,
    searchPrompt,
    aiReasoning: reasoning,
    resultsFromModel: results,
    nextAction,
    suggestedNextQuery: suggestedQuery,
  };
};

/**
 * Update model web search state
 */
export const updateModelSearchState = (
  state: ModelWebSearchState,
  cycle: ModelSearchCycle,
  aiResponseLength: number = 0
): ModelWebSearchState => {
  return {
    ...state,
    cycles: [...state.cycles, cycle],
    allResults: [...state.allResults, ...cycle.resultsFromModel],
    aiThoughts: [...state.aiThoughts, extractReasoningFromResponse('')],
    currentCycleNumber: cycle.cycleNumber,
    isComplete: cycle.nextAction === 'complete',
    modelMessagesCount: state.modelMessagesCount + 1,
  };
};

/**
 * Format search results for display (model already found them)
 */
export const formatModelSearchResultsAsTable = (
  results: ModelSearchResult[],
  cycleNumber?: number
): string => {
  let markdown = cycleNumber
    ? `### 📋 Web Search Results - Cycle ${cycleNumber}\n\n`
    : `### 📋 Web Search Results\n\n`;

  markdown += `| # | Source | URL | Domain | Relevance |\n`;
  markdown += `|---|--------|-----|--------|--------|\n`;

  results.slice(0, 8).forEach((result, idx) => {
    const relevanceBar = generateModelRelevanceBar(result.relevanceScore);
    markdown += `| ${idx + 1} | **${result.title}** | [Link](${result.url}) | ${result.source} | ${relevanceBar} |\n`;
  });

  return markdown;
};

/**
 * Generate visual relevance bar for model results
 */
export const generateModelRelevanceBar = (score: number): string => {
  const filled = Math.round(score * 5);
  const empty = 5 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = Math.round(score * 100);
  return `${bar} ${percentage}%`;
};

/**
 * Generate analysis guidance for each cycle
 */
export const generateCycleAnalysisGuidance = (
  cycleNumber: number,
  previousCycles: ModelSearchCycle[] = []
): string => {
  let guidance = `### Cycle ${cycleNumber} - Analysis Guidance\n\n`;
  
  guidance += `You've found information from your web search.\n\n`;
  
  guidance += `**Your task for this cycle:**\n`;
  guidance += `1. Review the search results you found\n`;
  guidance += `2. Identify the 2-3 most relevant results\n`;
  guidance += `3. Extract key findings from each\n`;
  guidance += `4. Look for patterns, agreements, and disagreements\n`;
  guidance += `5. Identify any remaining gaps\n\n`;
  
  if (cycleNumber === 1) {
    guidance += `**First Cycle Focus:**\n`;
    guidance += `- Get an overview of the topic\n`;
    guidance += `- Identify main concepts and key players\n`;
    guidance += `- Find authoritative sources\n\n`;
  } else if (cycleNumber === 2) {
    guidance += `**Second Cycle Focus:**\n`;
    guidance += `- Build depth on the most relevant areas\n`;
    guidance += `- Compare different perspectives\n`;
    guidance += `- Fill gaps from cycle 1\n\n`;
  } else {
    guidance += `**Follow-up Cycle Focus:**\n`;
    guidance += `- Address remaining gaps\n`;
    guidance += `- Get specific details or examples\n`;
    guidance += `- Verify key claims\n\n`;
  }
  
  guidance += `**Decision Tree for Next Action:**\n`;
  guidance += `- Have I found enough quality sources? → COMPLETE\n`;
  guidance += `- Are results off-topic or low quality? → REFINE_SEARCH\n`;
  guidance += `- Do I need specific details? → DEEP_SEARCH\n`;
  guidance += `- Do I need to explore more? → Continue analyzing\n`;
  
  return guidance;
};

/**
 * Generate final synthesis instruction for AI
 */
export const generateFinalSynthesisInstruction = (
  state: ModelWebSearchState
): string => {
  return `# Final Research Synthesis

You have completed ${state.cycles.length} research cycle(s) with web searches.

## Sources Found:
You found ${state.allResults.length} unique sources across all cycles.

## Your Research Journey:
${state.cycles
  .map(
    (cycle) =>
      `- Cycle ${cycle.cycleNumber}: Searched for "${cycle.query}", found ${cycle.resultsFromModel.length} sources`
  )
  .join('\n')}

## Task: Generate Final Answer

Now create a comprehensive answer to the original question: "${state.originalQuery}"

Your answer MUST:
1. Synthesize findings from all search cycles
2. Compare perspectives from multiple sources
3. Use markdown citations: [Source Name](URL)
4. Highlight what sources agree on
5. Note any disagreements
6. Assess source credibility
7. Present information clearly and concisely

Format your answer with:
- Clear headers and sections
- Bullet points where appropriate
- Proper citations for each claim
- A sources section at the end`;
};

/**
 * Get recommended number of cycles based on topic
 */
export const getRecommendedCycles = (query: string): number => {
  const simpleKeywords = ['what is', 'how to', 'when did', 'where is'];
  const complexKeywords = ['analysis', 'comparison', 'trends', 'research', 'study'];
  
  const isSimple = simpleKeywords.some(kw => query.toLowerCase().includes(kw));
  const isComplex = complexKeywords.some(kw => query.toLowerCase().includes(kw));
  
  if (isComplex) return 3;
  if (isSimple) return 1;
  return 2;
};

/**
 * Generate progress message for UI
 */
export const generateProgressMessage = (
  state: ModelWebSearchState
): string => {
  const recommended = getRecommendedCycles(state.originalQuery);
  const progress = Math.min(
    100,
    Math.round((state.currentCycleNumber / recommended) * 100)
  );
  
  const cyclesPassed = state.currentCycleNumber;
  
  if (state.isComplete) {
    return `✓ Research complete (${state.cycles.length} cycles, ${state.allResults.length} sources)`;
  }
  
  return `Researching... Cycle ${cyclesPassed} of ~${recommended} (${progress}% complete)`;
};
