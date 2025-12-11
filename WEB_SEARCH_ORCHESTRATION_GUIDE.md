# Web Search Orchestration System

## Overview

This system implements intelligent, multi-cycle web search with AI reasoning and analysis between searches. Instead of performing a single search and returning results, the AI systematically:

1. **Searches** for information on a topic
2. **Analyzes** the top 2-3 results
3. **Reasons** about findings and identifies gaps
4. **Decides** whether to continue, refine, or complete

## Architecture

### Core Components

#### 1. **web-search-orchestrator.ts**
Main orchestration logic with utility functions:

```typescript
// Initialize search state
const state = initializeWebSearchState("React hooks best practices");

// Calculate relevance scores for results
const scoredResults = results.map(r => ({
  ...r,
  relevanceScore: calculateRelevanceScore(r, query)
}));

// Analyze results and determine next action
const { analysis, nextAction, suggestedNextQuery } = analyzeSearchResults(
  results,
  query,
  cycleNumber
);
```

**Key Functions:**
- `initializeWebSearchState()` - Set up search tracking
- `calculateRelevanceScore()` - Score results by relevance
- `createSearchCycle()` - Package cycle with reasoning
- `groupResultsByDomain()` - Organize by source
- `generateSearchCycleReasoning()` - Create analysis prompts
- `generateSynthesisPrompt()` - Prepare final synthesis

#### 2. **WebSearchOrchestrator.tsx**
React component displaying search cycles:

```tsx
<WebSearchOrchestrator
  state={state}
  onRefineSearch={(query) => handleRefine(query)}
  onDeepSearch={(query) => handleDeepSearch(query)}
  onComplete={() => handleComplete()}
  isLoading={isLoading}
/>
```

**Features:**
- Expandable/collapsible cycle cards
- Source relevance visualization
- Real-time reasoning display
- Action buttons for refinement/deep search
- Table view of all sources

#### 3. **useWebSearchOrchestration Hook**
Custom React hook managing orchestration flow:

```typescript
const {
  state,
  startSearch,
  refineSearch,
  deepSearch,
  completeSearch,
  isLoading,
  error,
  reset
} = useWebSearchOrchestration({
  onSearch: async (query, cycleNumber) => {
    // Your search implementation
    return results;
  },
  onAnalyze: async (cycle) => {
    // Optional: custom analysis
  }
});
```

#### 4. **System Prompts Integration**
Enhanced prompts in `enhanced-system-prompts.ts`:

- `WEB_SEARCH_REQUIREMENTS` - Formatting and citation standards
- `WEB_SEARCH_ORCHESTRATION_PROMPT` - Multi-cycle protocol
- Task modes include full orchestration instructions

## Search Cycle Protocol

### Anatomy of a Search Cycle

```
Cycle 1: Initial Search
├── 🔍 Search Phase
│   └── Query: "What are React hooks?"
│
├── 📊 Analysis Phase (2-3 top results)
│   ├── <analyze> Result 1: React official docs
│   ├── <analyze> Result 2: Dev.to article
│   └── <analyze> Result 3: Medium guide
│
├── 🧠 Reasoning Phase
│   └── <deepresearch>
│       - Good overview but need practical examples
│       - No comparison with class components
│       - Next search: "React hooks vs class components examples"
│
└── 🎯 Decision
    └── nextAction: "refine_search"
         suggestedNextQuery: "React hooks vs class components examples"
```

### Decision Tree

```
Results retrieved
    ↓
Calculate relevance scores (0-1.0)
    ↓
Is coverage > 50%?
    ├─ No → REFINE_SEARCH (try different query)
    └─ Yes
        ↓
        Is cycle number < 2?
            ├─ No → COMPLETE (gather final thoughts)
            └─ Yes → Continue analyzing
                ↓
                DEEP_SEARCH (specific details)
```

## Implementation Example

### Basic Usage

```typescript
// 1. Set up search handler
const handleSearch = async (query: string, cycleNumber: number) => {
  const results = await fetchWebSearchResults(query);
  return results.map(r => ({
    title: r.title,
    url: r.url,
    description: r.snippet,
    domain: new URL(r.url).hostname,
    sourceType: classifySource(r.url),
    publishDate: r.lastModified,
  }));
};

// 2. Initialize orchestrator
const orchestrator = useWebSearchOrchestration({
  onSearch: handleSearch
});

// 3. Start search
await orchestrator.startSearch("latest AI trends 2024");

// 4. Process cycles automatically or manually control
// - Let AI decide: Wait for isComplete
// - Manual control: refineSearch() / deepSearch() as needed
```

### AI Reasoning Example

**Initial Query:** "What are the latest developments in quantum computing?"

**Cycle 1:**
```
<reason>
I'm searching for recent quantum computing breakthroughs to understand 
the current state of the field and identify key players.
</reason>

<analyze>
Top 3 sources:
1. IBM Quantum blog - Company announcement of 1121-qubit processor
   - Very recent (Dec 2024)
   - Official source, high reliability
   
2. Nature article - Quantum error correction advances
   - Peer-reviewed, highly credible
   - Published 3 months ago
   
3. MIT News - Quantum computing breakthrough
   - Institutional source, credible
   - Published 2 months ago

Common themes:
- Error correction is major focus
- Hardware scaling continues
- Both software and hardware innovations

Gaps identified:
- No comparison of different approaches (IBM vs Google vs others)
- Limited information on practical applications
- Not enough on near-term timelines
</analyze>

<deepresearch>
Coverage: 60%
Need to search for:
1. Comparison of quantum approaches (IBM, Google, IonQ)
2. Practical applications and timeline
3. Commercial quantum computing landscape

Suggested next query: "quantum computing companies 2024 comparison IBM Google"
</deepresearch>
```

**Decision:** nextAction = "deep_search"

---

**Cycle 2:**
```
<reason>
Now searching for landscape comparison to understand competitive positioning
and practical applications of quantum computing in 2024.
</reason>

<analyze>
Top 3 new sources:
1. Forbes - Quantum computing companies ranking 2024
   - Comprehensive comparison
   - Business perspective
   
2. Gartner Report - Quantum computing hype cycle
   - Industry analysis
   - Timeline projections
   
3. ZDNet - Practical quantum computing applications
   - Real-world use cases
   - Current maturity level

New findings:
- Google claimed "quantum advantage" with Willow chip
- IBM focusing on enterprise applications
- Drug discovery and optimization are near-term applications

Confirmation of previous findings:
- Error correction remains critical blocker
- Hardware scaling is happening rapidly
- Multi-year timeline for general-purpose quantum computers
</analyze>

<deepresearch>
Coverage: 85%
Sufficient information gathered on:
✓ Recent breakthroughs
✓ Competitive landscape
✓ Practical applications timeline
✓ Technical challenges

Ready for synthesis
</deepresearch>
```

**Decision:** nextAction = "complete"

---

## Source Relevance Scoring

### Scoring Algorithm

```
Base Score = Source Type Weight (0.5-1.0)
  + Title Match Bonus (0-0.15)
  + Description Match (0-0.2)
  + Domain Authority (0-0.2)
  + Recency Bonus (0-0.15)
```

### Source Type Weights

| Type | Weight | Use Case |
|------|--------|----------|
| Academic | 1.0 | Research, studies, peer-reviewed |
| Official | 0.95 | Gov, company official docs |
| News | 0.85 | Current events, breaking news |
| Blog | 0.7 | Tutorials, opinion, guides |
| Other | 0.5 | General web content |

### Domain Authority Bonuses

- `.edu`, `.gov` → +0.20 (official/academic)
- `.org` → +0.10 (nonprofit, established)
- Published within 30 days → +0.15 (recency)

## UI Display

### Cycle Card Layout

```
┌─────────────────────────────────────────┐
│ ▼ Cycle 1 [Latest]                    │
│ 5 sources • Next: deep_search         │
├─────────────────────────────────────────┤
│ 🧠 Reasoning                           │
│ [Top 3 sources analyzed...]           │
│                                       │
│ 📋 Sources (Table)                    │
│ [Source list with relevance bars]     │
│                                       │
│ 📊 Analysis                           │
│ [Coverage assessment & decision]      │
└─────────────────────────────────────────┘
```

### Relevance Bar Visualization

```
████░ 80%    (High relevance)
███░░ 60%    (Medium relevance)
██░░░ 40%    (Low relevance)
█░░░░ 20%    (Very low)
```

## System Prompts

### Web Search Requirements Prompt
- Defines when to search (current, factual, verification needed)
- Beautiful markdown table format for results
- Citation style options (Harvard, APA, Footnote)
- Source prioritization (academic > news > blogs)

### Orchestration Protocol Prompt
- 3-phase cycle structure (Search → Analyze → Decide)
- 2-3 result analysis requirement
- Decision tree logic
- Reasoning format with trigger tags
- Final synthesis instructions

### Task Mode Prompts
- **Research mode:** Includes full orchestration with 2-3 minimum cycles
- **Standard mode:** Basic orchestration available
- **Reasoning mode:** Can trigger searches for verification
- **Creative mode:** Limited search (optional for inspiration)

## Integration Points

### With Existing Systems

#### Trigger Tags
```xml
<reason>Initial search reasoning</reason>
<analyze>Analysis of 2-3 results</analyze>
<deepresearch>Gap identification for next search</deepresearch>
```

#### Memory System
- Store search cycles in memory
- Reference previous searches
- Learn from past research patterns

#### Backend Integration
- Hook into your web search API
- Filter results by domain
- Cache relevance calculations

## Best Practices

### Query Formulation

✅ **Good Queries:**
- "React hooks best practices 2024"
- "quantum computing error correction latest research"
- "sustainable energy solutions implementation"

❌ **Poor Queries:**
- "stuff about React" (too vague)
- "good technology" (too broad)
- "is AI bad" (too opinionated)

### Cycle Management

✅ **Effective Cycles:**
1. Start broad, get overview
2. Refine based on gaps
3. Deep search for specifics
4. Synthesize findings

❌ **Ineffective:**
- Too many cycles (>3) for simple topics
- Ignoring low-relevance results without analysis
- Searching same topic with identical queries

### Citation Standards

```markdown
According to [Source Name](URL), [claim].

## Sources Consulted

| Source | Relevance | Type |
|--------|-----------|------|
| [React Official Docs](https://react.dev) | 95% | Official |
| [Dev.to Tutorial](https://dev.to/...) | 78% | Blog |
```

## API Reference

### WebSearchOrchestrator Functions

```typescript
// Initialize
initializeWebSearchState(query: string): WebSearchState

// Score & organize
calculateRelevanceScore(result, query): number
groupResultsByDomain(results): Map<string, SearchResult[]>

// Analysis
generateSearchCycleReasoning(results, cycleNumber): string
analyzeSearchResults(results, query, cycleNumber): AnalysisResult

// Query refinement
generateRefinedQuery(originalQuery, results): string
generateDeepSearchQuery(originalQuery, results): string

// Formatting
formatSearchResultsAsTable(results, cycleNumber?): string
generateRelevanceBar(score: number): string

// State management
createSearchCycle(...): SearchCycle
updateSearchState(state, cycle): WebSearchState

// Synthesis
generateSynthesisPrompt(state): string
getSearchStrategy(query): SearchStrategy
```

### React Hook API

```typescript
useWebSearchOrchestration(props): {
  state: WebSearchState
  startSearch(query): Promise<void>
  refineSearch(query): Promise<void>
  deepSearch(query): Promise<void>
  completeSearch(): string
  isLoading: boolean
  error: string | null
  reset(): void
}

useSearchSynthesis(state): {
  generateSummary(): string
  getTopSources(count?): SearchResult[]
  getSourcesByType(type): SearchResult[]
  exportResults(): string
}
```

## Examples

### Example 1: Research Mode

**User Query:** "What are the latest developments in CRISPR gene therapy?"

**System Response:**

```
## 🔍 Web Search Orchestration

Original Query: What are the latest developments in CRISPR gene therapy?

### Cycle 1: Overview
[3 academic sources + 2 news articles]
- Coverage: 60%
- Decision: DEEP_SEARCH

[AI Reasoning & Analysis...]

### Cycle 2: Deep Dive  
[2 peer-reviewed studies + 1 company announcement]
- Coverage: 90%
- Decision: COMPLETE

[AI Synthesis of all findings...]

## Final Answer

Based on multi-source research across 2 cycles analyzing 8 authoritative sources:

CRISPR developments in 2024 include:
1. [Claim with citation]
2. [Claim with citation]
...

Sources Ranked by Relevance:
[Table of all sources]
```

### Example 2: Automatic Refinement

**Cycle 1 Results:** Too many general articles, low relevance

**System Decision:** REFINE_SEARCH

**New Query:** "CRISPR gene therapy clinical trials FDA approval 2024"

**Cycle 2 Results:** Highly specific, directly relevant

---

## Configuration

### Search Strategy Options

```typescript
const strategy = getSearchStrategy(query);

// Returns:
{
  maxCycles: 2,                    // For normal topics
  preferredSourceTypes: [...],      // Academic, Official, News, Blog
  minResultsPerCycle: 5,
  minRelevanceThreshold: 0.5
}

// Academic topics:
{
  maxCycles: 3,
  preferredSourceTypes: ['academic', 'official', 'news', 'blog'],
  minResultsPerCycle: 5,
  minRelevanceThreshold: 0.65       // Higher threshold
}

// Time-sensitive topics:
{
  maxCycles: 2,
  preferredSourceTypes: ['news', 'official', 'academic', 'blog'],
  minResultsPerCycle: 7,            // More results
  minRelevanceThreshold: 0.5
}
```

## Troubleshooting

### Issue: Too Few Relevant Results

**Solution:** System automatically triggers REFINE_SEARCH with modified query

### Issue: Search Stuck in Loop

**Solution:** Hard stop at `maxCycles` (typically 3)

### Issue: Missing Specific Information

**Solution:** Use DEEP_SEARCH with more targeted query

### Issue: Conflicting Information Between Sources

**Solution:** Synthesis phase highlights disagreements and source reliability

---

## Future Enhancements

- [ ] Support for academic database APIs (PubMed, arXiv)
- [ ] Automatic source credibility scoring
- [ ] Multi-language search support
- [ ] Visual clustering of similar findings
- [ ] Automatic fact-checking across sources
- [ ] Knowledge graph generation from searches
- [ ] Search cost optimization
