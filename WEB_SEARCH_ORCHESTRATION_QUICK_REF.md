# Web Search Orchestration - Quick Reference

## One-Minute Overview

The system performs **multi-cycle web searches** where the AI:
1. **Searches** for information
2. **Analyzes** top 2-3 results in depth
3. **Reasons** about findings and gaps
4. **Decides** to refine, deepen, or complete

Instead of: Search → Return Results

We do: **Search → Analyze → Reason → Decide → [Maybe Search Again]**

---

## File Structure

```
src/
├── lib/
│   ├── enhanced-system-prompts.ts      (System prompt integration)
│   └── web-search-orchestrator.ts      (Core logic)
├── components/
│   └── WebSearchOrchestrator.tsx       (React UI component)
└── hooks/
    └── useWebSearchOrchestration.ts    (React hook)

docs/
├── WEB_SEARCH_ORCHESTRATION_GUIDE.md   (Full guide)
└── WEB_SEARCH_ORCHESTRATION_QUICK_REF.md (This file)
```

---

## Key Components

### 1. System Prompts

```typescript
// In enhanced-system-prompts.ts

WEB_SEARCH_REQUIREMENTS
├─ When to search (current, factual, verification)
├─ Beautiful markdown table format
└─ Citation standards (Harvard, APA)

WEB_SEARCH_ORCHESTRATION_PROMPT
├─ 3-phase cycle structure
├─ 2-3 result analysis rule
└─ Decision tree
```

### 2. Orchestrator Logic

```typescript
// In web-search-orchestrator.ts

Core Functions:
├─ initializeWebSearchState()      // Setup
├─ calculateRelevanceScore()       // Score results (0-1.0)
├─ createSearchCycle()             // Package cycle
├─ analyzeSearchResults()          // Determine next action
├─ generateRefinedQuery()          // Better search terms
└─ generateSynthesisPrompt()       // Final answer guide

Types:
├─ SearchResult                    // Single result
├─ SearchCycle                     // Cycle data
└─ WebSearchState                  // Complete state
```

### 3. React Component

```typescript
// In WebSearchOrchestrator.tsx

<WebSearchOrchestrator
  state={state}                    // WebSearchState
  onRefineSearch={handler}         // Refine query
  onDeepSearch={handler}           // Deep dive
  onComplete={handler}             // Finish
  isLoading={boolean}
/>

Features:
├─ Expandable cycle cards
├─ Source relevance visualization
├─ Real-time reasoning display
└─ Action buttons
```

### 4. React Hook

```typescript
// In useWebSearchOrchestration.ts

const {
  state,           // WebSearchState
  startSearch,     // Begin orchestration
  refineSearch,    // Better query
  deepSearch,      // Specific info
  completeSearch,  // Synthesis
  isLoading,
  error,
  reset
} = useWebSearchOrchestration({
  onSearch: async (query, cycleNum) => SearchResult[],
  onAnalyze?: async (cycle) => void
});
```

---

## Search Cycle Flow

### Decision Tree

```
Execute Search
    ↓
    Score Results (0-1.0)
    ↓
    Coverage > 50%?
    ├─ NO  → REFINE_SEARCH (try different terms)
    └─ YES
        ├─ Cycle >= 3?
        │  └─ YES → COMPLETE
        └─ Cycle < 3 & Coverage > 60%?
           └─ YES → DEEP_SEARCH (specifics)
           └─ NO  → ANALYZE (more from this)
```

### Analysis Format

```
<reason>Why I'm searching & what I expect</reason>

<analyze>
Top 2-3 sources:
- Source 1: Key findings
- Source 2: Key findings
- Source 3: Key findings

Common themes:
- Theme 1
- Theme 2

Disagreements/gaps:
- Gap 1
- Gap 2
</analyze>

<deepresearch>
Next search suggestion: [query]
</deepresearch>
```

---

## Relevance Scoring

### Base Weights
- Academic: 1.0
- Official (.gov, .edu): 0.95
- News: 0.85
- Blog: 0.7
- Other: 0.5

### Bonuses
- Title match: +0.15
- Description match: +0.20
- Domain authority (.gov/.edu): +0.20
- Recent (< 30 days): +0.15

### Example
```
Blog post about React hooks:
0.70 (blog) + 0.15 (title match) + 0.15 (recent) = 1.0 (capped)
= 100% relevance score
```

---

## Usage Examples

### Quick Start

```typescript
// 1. Set up search function
const handleSearch = async (query, cycleNum) => {
  return await fetchWebResults(query); // Your API
};

// 2. Create hook
const orch = useWebSearchOrchestration({
  onSearch: handleSearch
});

// 3. Start
await orch.startSearch("React hooks best practices");

// 4. Wait for isComplete or control manually
// orch.refineSearch("query")
// orch.deepSearch("query")
```

### In React Component

```tsx
function SearchPage() {
  const orch = useWebSearchOrchestration({...});

  return (
    <>
      <WebSearchOrchestrator
        state={orch.state}
        onRefineSearch={orch.refineSearch}
        onDeepSearch={orch.deepSearch}
        onComplete={() => generateAnswer(orch.state)}
        isLoading={orch.isLoading}
      />
      {orch.error && <Error>{orch.error}</Error>}
    </>
  );
}
```

---

## Source Type Labels

| Type | Color | Use |
|------|-------|-----|
| Academic | 🟣 Purple | Research, studies |
| Official | 🟢 Green | Gov, docs |
| News | 🔵 Blue | Events, breaking |
| Blog | 🟠 Orange | Tutorials, opinion |
| Other | ⚪ Gray | General web |

---

## Trigger Tags Used

```
<reason>          // Why I'm searching
<analyze>         // Analysis of 2-3 sources
<deepresearch>    // Next search direction
<factcheck>       // Verify claims
<compare>         // Compare sources
<summary>         // Synthesize findings
```

---

## Configuration

### Search Strategy Detection

```typescript
getSearchStrategy(query)

Returns:
{
  maxCycles,
  preferredSourceTypes,
  minResultsPerCycle,
  minRelevanceThreshold
}

Examples:
- "React hooks" → 2 cycles, 0.5 threshold
- "quantum computing research" → 3 cycles, 0.65 threshold
- "latest AI news" → 2 cycles, 7+ results
```

### Query Refinement

```typescript
generateRefinedQuery("original", results)
// Removes low-relevance domains

generateDeepSearchQuery("original", results)
// Makes query more specific
// Examples:
// "AI" → "AI latest research 2024"
// "Python" → "Python advanced patterns"
```

---

## System Prompt Integration

### For Researchers

```typescript
// In system prompt
TASK_MODE_SYSTEM_PROMPTS.research

Includes:
✓ Web search requirements
✓ Orchestration protocol
✓ Multi-cycle instructions (2-3 minimum)
✓ Trigger tag enforcement
```

### For Standard Users

```typescript
TASK_MODE_SYSTEM_PROMPTS.standard

Includes:
✓ Web search when needed
✓ Basic orchestration available
✓ Citation standards
```

---

## Markdown Output Format

### Web Search Results Table

```markdown
### 📋 Web Search Results - Cycle 1

| # | Source | URL | Type | Relevance | Updated |
|---|--------|-----|------|-----------|---------|
| 1 | **Title** | [Link](url) | ACADEMIC | █████░ 85% | Jan 2024 |
| 2 | **Title** | [Link](url) | NEWS | ████░░ 70% | Dec 2024 |
```

### Citation Examples

```markdown
According to [Source Name](https://example.com), [claim].

(Smith & Johnson, 2024)

[Source Name](URL) reports that...
```

---

## Common Workflows

### Research Paper Topic

1. **Cycle 1:** Broad overview (main concepts)
2. **Cycle 2:** Deep dive (recent research, controversies)
3. **Synthesize:** Compare perspectives, highlight key studies

### Current Events

1. **Cycle 1:** What happened (breaking news)
2. **Cycle 2:** Context (background, similar events)
3. **Done:** Enough info for timely answer

### Technical Topic

1. **Cycle 1:** Official docs + tutorials
2. **Cycle 2:** Real-world examples + best practices
3. **Optional Cycle 3:** Advanced techniques/edge cases

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Low relevance results | Too broad query | Auto: REFINE_SEARCH |
| Missing specific info | Wrong angle | Auto: DEEP_SEARCH |
| Too many cycles | Complex topic | Stop at maxCycles |
| Conflicting sources | Normal variance | Document in synthesis |

---

## Performance Notes

### Relevance Score Calculation
- O(n) for each result
- Cached between cycles
- Domain grouping: O(n log n)

### UI Rendering
- Each cycle card independent
- Lazy load sources table
- Expandable for performance

### Search Cost
- Typical: 2-3 cycles
- Budget: max 3-5 per query
- Refine rather than repeat

---

## Next Steps

1. **Set up web search API** integration
2. **Import components** into your chat interface
3. **Test with research queries** ("latest AI trends")
4. **Monitor reasoning quality** in first cycles
5. **Adjust maxCycles** based on topic complexity

---

## API Quick Lookup

```typescript
// Initialize
initializeWebSearchState(query)

// Score
calculateRelevanceScore(result, query, weights?)
groupResultsByDomain(results)

// Analyze
analyzeSearchResults(results, query, cycleNumber)
generateSearchCycleReasoning(results, cycleNumber, findings?)

// Refine
generateRefinedQuery(original, results)
generateDeepSearchQuery(original, results)

// Format
formatSearchResultsAsTable(results, cycleNumber?)
generateRelevanceBar(score)

// Manage
createSearchCycle(num, query, results, findings?)
updateSearchState(state, cycle)
generateSynthesisPrompt(state)

// Detect
isAcademicTopic(query)
isTimeSensitive(query)
getSearchStrategy(query)
```

---

## Integration Checklist

- [ ] Import `web-search-orchestrator.ts`
- [ ] Import `WebSearchOrchestrator.tsx` component
- [ ] Add `useWebSearchOrchestration` hook
- [ ] Update system prompts with `WEB_SEARCH_REQUIREMENTS`
- [ ] Connect to web search API
- [ ] Test with sample queries
- [ ] Monitor reasoning quality
- [ ] Adjust thresholds as needed
