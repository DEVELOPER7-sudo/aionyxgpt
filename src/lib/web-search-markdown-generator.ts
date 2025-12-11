/**
 * Web Search Markdown Generator
 * Creates organized, semantic <websearch> markdown blocks with real-time status updates
 */

export interface WebSearchMarkdownState {
  id: string;
  status: 'searching' | 'processing' | 'analyzing' | 'complete';
  topic: string;
  searchQuery: string;
  results: WebSearchResult[];
  sources: string[];
  startTime: number;
  endTime?: number;
  peekResults?: string[];
  metadata: {
    totalResults: number;
    topicCategory: string;
    searchDuration: number;
  };
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevance: number;
  timestamp?: string;
}

/**
 * Generate dynamic websearch markdown block
 */
export const generateWebSearchMarkdown = (state: WebSearchMarkdownState): string => {
  let markdown = '\n<websearch>\n';
  markdown += generateWebSearchHeader(state);
  markdown += generateStatusSection(state);
  markdown += generateResultsSection(state);
  markdown += generateMetadataSection(state);
  markdown += '</websearch>\n\n';

  return markdown;
};

/**
 * Generate header with topic and query
 */
function generateWebSearchHeader(state: WebSearchMarkdownState): string {
  let header = `## 🔍 Web Search\n\n`;
  header += `**Topic:** ${state.topic}\n`;
  header += `**Query:** ${state.searchQuery}\n`;
  header += `**Status:** ${getStatusEmoji(state.status)} ${formatStatus(state.status)}\n\n`;

  return header;
}

/**
 * Generate status section with dynamic text
 */
function generateStatusSection(state: WebSearchMarkdownState): string {
  let section = `### Status\n\n`;

  if (state.status === 'searching') {
    section += `**🔄 Searching:** ${state.searchQuery}\n`;
    section += `_Loading results from web..._\n\n`;
  } else if (state.status === 'processing') {
    const peekText = state.peekResults && state.peekResults.length > 0
      ? `from ${state.peekResults.slice(0, 3).join(', ')}, and others`
      : 'from multiple authoritative sources';

    section += `**✓ Processing Search Results**\n`;
    section += `Analyzing data ${peekText}...\n\n`;
  } else if (state.status === 'analyzing') {
    section += `**🧠 Analyzing Results**\n`;
    section += `Organizing ${state.results.length} sources into structured knowledge...\n\n`;
  } else if (state.status === 'complete') {
    const duration = state.endTime 
      ? ((state.endTime - state.startTime) / 1000).toFixed(1)
      : 'N/A';

    section += `**✅ Search Complete**\n`;
    section += `Gathered ${state.results.length} sources in ${duration}s\n\n`;
  }

  return section;
}

/**
 * Generate results section
 */
function generateResultsSection(state: WebSearchMarkdownState): string {
  if (state.results.length === 0) return '';

  let section = `### 📋 Results\n\n`;

  if (state.status !== 'searching') {
    section += `| # | Source | Title | Relevance |\n`;
    section += `|---|--------|-------|----------|\n`;

    state.results.slice(0, 8).forEach((result, idx) => {
      const relevanceBar = generateRelevanceBar(result.relevance);
      const title = result.title.substring(0, 50) + (result.title.length > 50 ? '...' : '');
      
      section += `| ${idx + 1} | **${result.source}** | [${title}](${result.url}) | ${relevanceBar} |\n`;
    });

    if (state.results.length > 8) {
      section += `\n_And ${state.results.length - 8} more sources..._\n\n`;
    } else {
      section += '\n';
    }
  }

  return section;
}

/**
 * Generate metadata section
 */
function generateMetadataSection(state: WebSearchMarkdownState): string {
  let section = `### 📊 Metadata\n\n`;

  section += `| Property | Value |\n`;
  section += `|----------|-------|\n`;
  section += `| Total Results | ${state.metadata.totalResults} |\n`;
  section += `| Category | ${state.metadata.topicCategory} |\n`;
  section += `| Duration | ${state.metadata.searchDuration}ms |\n`;

  if (state.sources.length > 0) {
    section += `| Primary Sources | ${state.sources.slice(0, 3).join(', ')}${state.sources.length > 3 ? ', ...' : ''} |\n`;
  }

  section += '\n';

  return section;
}

/**
 * Format status text
 */
function formatStatus(status: WebSearchMarkdownState['status']): string {
  switch (status) {
    case 'searching':
      return 'Searching...';
    case 'processing':
      return 'Processing Results...';
    case 'analyzing':
      return 'Analyzing Data...';
    case 'complete':
      return 'Complete';
    default:
      return 'Unknown';
  }
}

/**
 * Get emoji for status
 */
function getStatusEmoji(status: WebSearchMarkdownState['status']): string {
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

/**
 * Generate relevance bar
 */
function generateRelevanceBar(score: number): string {
  const filled = Math.round(score * 5);
  const empty = 5 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percentage = Math.round(score * 100);
  return `${bar} ${percentage}%`;
}

/**
 * Initialize search state
 */
export const initializeWebSearchState = (topic: string, searchQuery: string): WebSearchMarkdownState => {
  return {
    id: `search-${Date.now()}`,
    status: 'searching',
    topic,
    searchQuery,
    results: [],
    sources: [],
    startTime: Date.now(),
    metadata: {
      totalResults: 0,
      topicCategory: detectCategory(topic),
      searchDuration: 0,
    },
  };
};

/**
 * Update search state to processing
 */
export const updateToProcessing = (
  state: WebSearchMarkdownState,
  sources: string[],
  peekResults?: string[]
): WebSearchMarkdownState => {
  return {
    ...state,
    status: 'processing',
    sources,
    peekResults,
    metadata: {
      ...state.metadata,
      searchDuration: Date.now() - state.startTime,
    },
  };
};

/**
 * Update search state to analyzing
 */
export const updateToAnalyzing = (
  state: WebSearchMarkdownState,
  results: WebSearchResult[]
): WebSearchMarkdownState => {
  return {
    ...state,
    status: 'analyzing',
    results,
    metadata: {
      ...state.metadata,
      totalResults: results.length,
      searchDuration: Date.now() - state.startTime,
    },
  };
};

/**
 * Update search state to complete
 */
export const updateToComplete = (
  state: WebSearchMarkdownState
): WebSearchMarkdownState => {
  return {
    ...state,
    status: 'complete',
    endTime: Date.now(),
    metadata: {
      ...state.metadata,
      searchDuration: Date.now() - state.startTime,
    },
  };
};

/**
 * Detect category from topic
 */
function detectCategory(topic: string): string {
  const lowerTopic = topic.toLowerCase();

  if (lowerTopic.includes('news') || lowerTopic.includes('current') || lowerTopic.includes('today')) {
    return 'News & Current Events';
  }
  if (lowerTopic.includes('research') || lowerTopic.includes('study') || lowerTopic.includes('academic')) {
    return 'Academic Research';
  }
  if (lowerTopic.includes('how to') || lowerTopic.includes('tutorial') || lowerTopic.includes('guide')) {
    return 'How-To & Guides';
  }
  if (lowerTopic.includes('product') || lowerTopic.includes('review') || lowerTopic.includes('price')) {
    return 'Product Information';
  }
  if (lowerTopic.includes('technology') || lowerTopic.includes('tech') || lowerTopic.includes('ai')) {
    return 'Technology';
  }

  return 'General';
}

/**
 * Extract snippet preview from URL or title
 */
export const generatePeekResultsFromSources = (sources: string[]): string[] => {
  return sources.map((source) => {
    // Extract domain name
    try {
      const url = new URL(source);
      const domain = url.hostname.replace('www.', '');
      const name = domain.split('.')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    } catch {
      return source;
    }
  });
};

/**
 * Format WebSearch markdown for AI response embedding
 */
export const embedWebSearchMarkdown = (
  aiResponse: string,
  webSearchMarkdown: string
): string => {
  // Insert web search block at the beginning if not already present
  if (!aiResponse.includes('<websearch>')) {
    return webSearchMarkdown + aiResponse;
  }

  return aiResponse;
};

/**
 * Extract web search blocks from response
 */
export const extractWebSearchBlocks = (response: string): Array<{ markdown: string; content: string }> => {
  const blockRegex = /<websearch>([\s\S]*?)<\/websearch>/g;
  const blocks: Array<{ markdown: string; content: string }> = [];

  let match;
  while ((match = blockRegex.exec(response)) !== null) {
    blocks.push({
      markdown: match[0],
      content: match[1],
    });
  }

  return blocks;
};

/**
 * Parse web search markdown for display
 */
export const parseWebSearchMarkdown = (markdown: string): WebSearchMarkdownState | null => {
  try {
    // Extract topic
    const topicMatch = markdown.match(/\*\*Topic:\*\*\s*(.+?)(?:\n|$)/);
    const topic = topicMatch ? topicMatch[1].trim() : 'Unknown';

    // Extract query
    const queryMatch = markdown.match(/\*\*Query:\*\*\s*(.+?)(?:\n|$)/);
    const query = queryMatch ? queryMatch[1].trim() : '';

    // Extract status
    const statusMatch = markdown.match(/\*\*Status:\*\*\s*[^*]+\*\*([^*]+)\*\*/);
    let status: WebSearchMarkdownState['status'] = 'searching';
    if (statusMatch) {
      const statusText = statusMatch[1].toLowerCase();
      if (statusText.includes('processing')) status = 'processing';
      if (statusText.includes('analyzing')) status = 'analyzing';
      if (statusText.includes('complete')) status = 'complete';
    }

    return {
      id: `parsed-${Date.now()}`,
      status,
      topic,
      searchQuery: query,
      results: [],
      sources: [],
      startTime: Date.now(),
      metadata: {
        totalResults: 0,
        topicCategory: detectCategory(topic),
        searchDuration: 0,
      },
    };
  } catch (error) {
    console.error('Error parsing web search markdown:', error);
    return null;
  }
};

/**
 * Generate AI instruction for web search markdown
 */
export const generateWebSearchMarkdownInstruction = (): string => {
  return `When performing web searches, you MUST:

1. **Create a <websearch> block** at the START of your response
2. **Use this exact structure:**

\`\`\`
<websearch>
## 🔍 Web Search

**Topic:** [The topic being searched]
**Query:** [The exact search query used]
**Status:** [Current status emoji] [Status text]

### Status

[Dynamic status text based on current phase]

### 📋 Results

[Results table if complete]

### 📊 Metadata

[Metadata table]

</websearch>
\`\`\`

3. **Status Flow:**
   - **Searching:** Show "🔄 Searching: [query]"
   - **Processing:** Show "✓ Processing Search Results from [sources...]"
   - **Analyzing:** Show "🧠 Analyzing Results..."
   - **Complete:** Show "✅ Search Complete"

4. **Keep the block open and update it** as you progress through the search
5. **Close it properly** with \`</websearch>\`
6. **Format results as markdown tables** when complete
7. **Cite all sources** with proper links

This block is SEPARATE from trigger tags and must be properly closed.`;
};
