# Web Search Orchestration - Integration Examples

## Complete Implementation Example

### 1. Backend Search API Integration

```typescript
// src/lib/web-search-api.ts

import { SearchResult } from '@/lib/web-search-orchestrator';

/**
 * Fetch search results from your web search provider
 * (Google, Bing, DuckDuckGo, SerpAPI, etc.)
 */
export async function fetchWebSearchResults(
  query: string,
  options?: {
    maxResults?: number;
    language?: string;
    includeDate?: boolean;
  }
): Promise<SearchResult[]> {
  try {
    const response = await fetch('/api/web-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, ...options }),
    });

    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();
    return data.results.map((item: any) => ({
      title: item.title,
      url: item.url,
      description: item.snippet || item.description,
      domain: new URL(item.url).hostname,
      sourceType: classifySourceType(item.url),
      publishDate: item.date || undefined,
    }));
  } catch (error) {
    console.error('Web search error:', error);
    throw error;
  }
}

/**
 * Classify source by domain
 */
function classifySourceType(
  url: string
): 'academic' | 'news' | 'official' | 'blog' | 'other' {
  const hostname = new URL(url).hostname.toLowerCase();

  // Academic domains
  if (
    hostname.includes('.edu') ||
    hostname.includes('arxiv') ||
    hostname.includes('pubmed') ||
    hostname.includes('scholar.google')
  ) {
    return 'academic';
  }

  // Official sources
  if (
    hostname.includes('.gov') ||
    hostname.includes('official') ||
    hostname.includes('developer.') ||
    hostname.includes('.org') && !hostname.includes('medium')
  ) {
    return 'official';
  }

  // News outlets
  if (
    hostname.includes('cnn') ||
    hostname.includes('bbc') ||
    hostname.includes('nyt') ||
    hostname.includes('reuters') ||
    hostname.includes('ap.org') ||
    hostname.includes('news')
  ) {
    return 'news';
  }

  // Blogs and personal sites
  if (
    hostname.includes('medium.com') ||
    hostname.includes('dev.to') ||
    hostname.includes('substack') ||
    hostname.includes('wordpress') ||
    hostname.includes('blogger')
  ) {
    return 'blog';
  }

  return 'other';
}
```

### 2. React Component Integration

```typescript
// src/pages/ResearchPage.tsx

import React, { useState } from 'react';
import { WebSearchOrchestrator } from '@/components/WebSearchOrchestrator';
import { useWebSearchOrchestration } from '@/hooks/useWebSearchOrchestration';
import { fetchWebSearchResults } from '@/lib/web-search-api';

export default function ResearchPage() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [synthesizing, setSynthesizing] = useState(false);

  const orchestrator = useWebSearchOrchestration({
    onSearch: async (query, cycleNumber) => {
      console.log(`[Cycle ${cycleNumber}] Searching for: ${query}`);
      return await fetchWebSearchResults(query, { maxResults: 10 });
    },

    onAnalyze: async (cycle) => {
      console.log(`[Cycle ${cycle.cycleNumber}] Analysis complete`);
      console.log(`  - Sources analyzed: ${cycle.results.length}`);
      console.log(`  - Next action: ${cycle.nextAction}`);
      if (cycle.suggestedNextQuery) {
        console.log(`  - Suggested query: ${cycle.suggestedNextQuery}`);
      }
    },
  });

  const handleInitiate = async (query: string) => {
    setAnswer(null);
    await orchestrator.startSearch(query);
  };

  const handleComplete = async () => {
    setSynthesizing(true);
    try {
      // Get synthesis prompt
      const synthPrompt = orchestrator.completeSearch();

      // Send to AI for final answer generation
      const response = await fetch('/api/generate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searchState: orchestrator.state,
          synthPrompt,
        }),
      });

      const data = await response.json();
      setAnswer(data.answer);
    } finally {
      setSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-lg font-semibold text-white">
          What would you like to research?
        </label>
        <SearchInput onSearch={handleInitiate} />
      </div>

      {/* Orchestrator UI */}
      {orchestrator.state.currentCycleNumber > 0 && (
        <WebSearchOrchestrator
          state={orchestrator.state}
          onRefineSearch={orchestrator.refineSearch}
          onDeepSearch={orchestrator.deepSearch}
          onComplete={handleComplete}
          isLoading={orchestrator.isLoading || synthesizing}
        />
      )}

      {/* Error Display */}
      {orchestrator.error && (
        <div className="bg-red-900/30 border border-red-600 rounded p-4 text-red-300">
          Error: {orchestrator.error}
        </div>
      )}

      {/* Final Answer */}
      {answer && (
        <div className="bg-green-900/20 border border-green-600 rounded p-6">
          <h2 className="text-2xl font-bold text-green-400 mb-4">Answer</h2>
          <div className="text-white prose prose-invert max-w-none">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

interface SearchInputProps {
  onSearch: (query: string) => void;
}

function SearchInput({ onSearch }: SearchInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., 'Latest developments in CRISPR gene therapy'"
        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold text-white transition"
      >
        Search
      </button>
    </form>
  );
}
```

### 3. Backend API Route

```typescript
// src/pages/api/web-search.ts

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, maxResults = 10 } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid query' });
  }

  try {
    // Use your preferred search provider
    // Examples: SerpAPI, Google Search API, DuckDuckGo API, etc.

    const results = await searchWithProvider(query, maxResults);

    res.status(200).json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

/**
 * Example using SerpAPI (https://serpapi.com)
 */
async function searchWithProvider(query: string, maxResults: number) {
  const apiKey = process.env.SERPAPI_KEY;

  const params = new URLSearchParams({
    q: query,
    api_key: apiKey,
    num: String(maxResults),
    engine: 'google',
  });

  const response = await fetch(`https://serpapi.com/search?${params}`);
  const data = await response.json();

  return data.organic_results.map((result: any) => ({
    title: result.title,
    url: result.link,
    snippet: result.snippet,
    date: result.date,
  }));
}
```

### 4. System Prompt Integration

```typescript
// src/lib/chat-system-prompts.ts

import {
  WEB_SEARCH_REQUIREMENTS,
  WEB_SEARCH_ORCHESTRATION_PROMPT,
  TRIGGER_TAG_ENFORCEMENT_PREFIX,
} from '@/lib/enhanced-system-prompts';

export const RESEARCH_SYSTEM_PROMPT = `${WEB_SEARCH_REQUIREMENTS}

${WEB_SEARCH_ORCHESTRATION_PROMPT}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

You are an expert research assistant. When a user asks for research:

1. Use the web search orchestration system
2. Execute 2-3 search cycles minimum
3. Analyze 2-3 top sources per cycle
4. Show your reasoning between cycles
5. Synthesize findings across all sources
6. Provide comprehensive, well-cited answers

Focus on:
- Academic and official sources
- Recent information (prefer < 6 months)
- Multiple perspectives
- Clear citations in markdown format
`;

export const CHAT_SYSTEM_PROMPT = `${WEB_SEARCH_REQUIREMENTS}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

You are a helpful AI assistant. When appropriate:
- Use web search for current information
- Cite all sources properly
- Show your reasoning
- Use trigger tags to structure responses
`;
```

### 5. useSearchSynthesis Hook Usage

```typescript
// src/hooks/useResearchSynthesis.ts

import { useSearchSynthesis } from '@/hooks/useWebSearchOrchestration';
import { WebSearchState } from '@/lib/web-search-orchestrator';

export function useResearchSynthesis(searchState: WebSearchState) {
  const synthesis = useSearchSynthesis(searchState);

  const generateReport = () => {
    return `
# Research Report

${synthesis.generateSummary()}

## Top Sources by Relevance

${synthesis
  .getTopSources(5)
  .map(
    (source, i) =>
      `${i + 1}. [${source.title}](${source.url}) - ${(source.relevanceScore * 100).toFixed(0)}%`
  )
  .join('\n')}

## Sources by Category

### Academic Sources
${synthesis
  .getSourcesByType('academic')
  .map((s) => `- [${s.title}](${s.url})`)
  .join('\n')}

### News Sources
${synthesis
  .getSourcesByType('news')
  .map((s) => `- [${s.title}](${s.url})`)
  .join('\n')}

## Export

[Download Full Results](data:text/plain;base64,${btoa(synthesis.exportResults())})
    `;
  };

  return { synthesis, generateReport };
}
```

## Real-World Example Flow

### User Query: "What are the latest AI breakthroughs in 2024?"

---

### **Cycle 1: Initial Overview**

**Search Query:** "latest AI breakthroughs 2024"

**Results (sorted by relevance):**
1. OpenAI Blog - GPT-4 Turbo announcement (95%)
2. TechCrunch - AI trends 2024 (88%)
3. MIT News - AI research advances (82%)

**Reasoning:**
```
<reason>
Searching for major AI breakthroughs in 2024 to understand the current 
landscape and identify key developments from leading organizations.
</reason>

<analyze>
Top sources reviewed:
1. OpenAI Blog - Official announcement of GPT-4 improvements
   - Reliability: Very high (official source)
   - Scope: Focuses on language models
   
2. TechCrunch article - AI industry trends
   - Reliability: High (tech journalism)
   - Scope: Covers multiple areas
   
3. MIT News - Research breakthroughs
   - Reliability: Very high (academic institution)
   - Scope: Academic research focus

Common themes:
- Language models continue improving
- Multimodal AI gaining importance
- Open source models rising

Coverage: 65% - Good overview but limited depth
</analyze>

<deepresearch>
Need more specific information:
- Specific benchmark improvements
- Company-by-company comparison
- Practical applications

Suggested next search: "AI breakthroughs comparison OpenAI Google Meta 2024"
</deepresearch>
```

**Decision:** → **DEEP_SEARCH**

---

### **Cycle 2: Competitive Landscape**

**Search Query:** "AI breakthroughs comparison OpenAI Google Meta 2024"

**Results:**
1. Google AI Blog - Gemini announcement (94%)
2. Meta Research - LLaMA advances (90%)
3. ArXiv - Latest AI papers (88%)

**Reasoning:**
```
<reason>
Now diving into competitive landscape to understand how different 
organizations are advancing AI and where each is focusing.
</reason>

<analyze>
New sources reveal:
1. Google's Gemini - Multimodal capabilities
   - Large context window
   - Strong reasoning abilities
   
2. Meta's LLaMA - Open source advancement
   - Better efficiency than proprietary models
   - Growing adoption in industry
   
3. ArXiv papers - Research direction
   - Focus on reasoning and planning
   - Multimodal learning improvements

Patterns confirmed:
- Multimodal is major trend (all major players)
- Open source becoming competitive
- Reasoning improvements critical

New findings:
- Efficiency improvements significant
- Context window expansions (100K+ tokens)
- Real-world applications accelerating
</analyze>

<deepresearch>
Coverage now at 80% - sufficient for good synthesis
All major players covered, key trends identified, competitive landscape clear
Ready to synthesize findings for final answer
</deepresearch>
```

**Decision:** → **COMPLETE**

---

### **Final Answer (Synthesized)**

Based on research across 2 cycles with 6 authoritative sources:

## Key AI Breakthroughs in 2024

### 1. **Language Model Evolution**
- **OpenAI**: GPT-4 Turbo improvements in accuracy and speed ([OpenAI Blog](https://openai.com/blog/...))
- **Google**: Gemini multimodal model with 1M token context ([Google AI](https://deepmind.google/...))
- **Meta**: LLaMA 3 with improved efficiency ([Meta Research](https://research.facebook.com/...))

### 2. **Multimodal AI**
According to multiple sources, 2024 marked the breakthrough year for multimodal capabilities:
- Combined text, image, and reasoning understanding
- Better integration across modalities
- Practical applications in industry

### 3. **Open Source Impact**
Meta's LLaMA advancement ([Meta Research](url)) showed that open-source models can compete with proprietary solutions, democratizing AI access.

### 4. **Context Window Expansion**
Extended context windows (100K-1M tokens) enabling:
- Longer document processing
- Better reasoning across large information sets
- Novel applications like full codebase understanding

## Sources Ranked by Relevance

| Rank | Source | Relevance | Type |
|------|--------|-----------|------|
| 1 | OpenAI Blog | 95% | Official |
| 2 | Google AI Blog | 94% | Official |
| 3 | Meta Research | 90% | Official |
| 4 | TechCrunch | 88% | News |
| 5 | MIT News | 82% | Academic |
| 6 | ArXiv Papers | 88% | Academic |

---

## Advanced Integration: Custom Analysis Callbacks

```typescript
// src/hooks/useAdvancedOrchestration.ts

interface CustomAnalysisOptions {
  onCycleComplete?: (cycle: SearchCycle) => void;
  onRelevanceUpdate?: (score: number) => void;
  onSourceFound?: (source: SearchResult) => void;
  shouldContinue?: (state: WebSearchState) => boolean;
}

export function useAdvancedOrchestration(
  options: CustomAnalysisOptions
) {
  const orchestrator = useWebSearchOrchestration({
    onSearch: async (query, cycleNumber) => {
      const results = await fetchWebSearchResults(query);
      
      // Notify on each source found
      results.forEach(source => {
        options.onSourceFound?.(source);
      });
      
      return results;
    },

    onAnalyze: async (cycle) => {
      // Custom completion logic
      if (options.shouldContinue && !options.shouldContinue(orchestrator.state)) {
        // Force completion if custom condition met
      }
      
      options.onCycleComplete?.(cycle);
    },
  });

  return orchestrator;
}
```

---

## Configuration Examples

### For Academic Research

```typescript
const academicConfig = {
  maxCycles: 4,
  minRelevanceThreshold: 0.7,
  preferredSourceTypes: ['academic', 'official'],
  minResultsPerCycle: 8,
};

// Will prioritize peer-reviewed sources
// Perform more cycles for thorough research
// Strict relevance standards
```

### For Breaking News

```typescript
const newsConfig = {
  maxCycles: 1,
  minRelevanceThreshold: 0.5,
  preferredSourceTypes: ['news', 'official'],
  minResultsPerCycle: 5,
};

// Fast turnaround
// Focus on news sources
// Lower threshold for speed
```

### For Technical Documentation

```typescript
const techConfig = {
  maxCycles: 2,
  minRelevanceThreshold: 0.65,
  preferredSourceTypes: ['official', 'academic', 'blog'],
  minResultsPerCycle: 6,
};

// Official docs preferred
// Couple of cycles for depth
// Accept quality blogs
```

---

## Debugging & Monitoring

```typescript
// src/utils/search-logging.ts

export function enableSearchLogging() {
  const originalSearch = window.fetch;
  
  window.fetch = async (...args) => {
    if (args[0].toString().includes('/api/web-search')) {
      console.group('🔍 Web Search Request');
      console.log('Query:', args[1]);
      console.time('Search Duration');
      
      const response = await originalSearch(...args);
      
      console.timeEnd('Search Duration');
      const data = await response.clone().json();
      console.log('Results:', data.results.length);
      console.groupEnd();
      
      return response;
    }
    
    return originalSearch(...args);
  };
}

// Enable in development
if (process.env.NODE_ENV === 'development') {
  enableSearchLogging();
}
```

This comprehensive system ensures intelligent, multi-cycle web searching with clear reasoning between cycles!
