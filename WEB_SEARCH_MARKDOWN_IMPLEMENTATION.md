# Web Search Markdown Implementation Guide

## Overview

This system enables dynamic, organized web search markdown blocks that update in real-time as the AI searches, processes, and analyzes results.

**Key Feature:** The `<websearch>` markdown block is **separate from trigger tags** and provides a clean, organized interface for web search operations.

---

## User Experience Flow

### Example: User searches "India news December 11 2025"

**Step 1: AI Starts Searching**
```
🔄 Searching: India news December 11 2025 - today's headlines, breaking news, current events

Loading results from web...
```

**Step 2: AI Receives & Processes Results**
```
⚙️ Processing Search Results
from Times of India, Hindustan Times, Economic Times, NDTV, India Today, The Hindu, and others...

[Progress bar shows 50-60%]
```

**Step 3: AI Analyzes Data**
```
🧠 Analyzing Results

Organizing 15 sources into structured knowledge...

[Progress bar shows 80-90%]
```

**Step 4: AI Completes Search**
```
✅ Search Complete

| # | Source | Title | Relevance |
|---|--------|-------|-----------|
| 1 | Times of India | Today's Top Headlines... | ████░ 90% |
| 2 | Hindustan Times | Breaking: ... | ███░░ 85% |
...
```

---

## Architecture

### Core Files

| File | Purpose | Size |
|------|---------|------|
| `src/lib/web-search-markdown-generator.ts` | Markdown generation & state management | ~350 lines |
| `src/components/WebSearchBlock.tsx` | React component for display | ~280 lines |
| `src/hooks/useWebSearchMarkdown.ts` | State management hook | ~200 lines |
| `src/lib/enhanced-system-prompts.ts` | *(Updated)* System prompt integration | +150 lines |

### Data Flow

```
User Query
    ↓
System Prompt (WEB_SEARCH_MARKDOWN_FORMAT)
    ↓
AI Starts Search → Creates <websearch> block
    ↓
AI Receives Results → Updates to Processing
    ↓
AI Organizes Data → Updates to Analyzing
    ↓
AI Completes → Updates with Results Table & Metadata
    ↓
UI Component displays dynamically
```

---

## Markdown Block Structure

### Complete Example

```xml
<websearch>
## 🔍 Web Search

**Topic:** India news today
**Query:** India news December 11 2025 - today's headlines, breaking news, current events
**Status:** ✅ Complete

### Status

**✅ Search Complete**
Gathered 15 sources in 3.2s

### 📋 Results

| # | Source | Title | Relevance |
|---|--------|-------|-----------|
| 1 | **Times of India** | [Today's Headlines - December 11](url) | ████░ 90% |
| 2 | **Hindustan Times** | [Breaking News Updates](url) | ████░ 88% |
| 3 | **NDTV** | [Latest News](url) | ███░░ 85% |

### 📊 Metadata

| Property | Value |
|----------|-------|
| Total Results | 15 |
| Category | News & Current Events |
| Duration | 3.2s |
| Primary Sources | Times of India, Hindustan Times, NDTV |

</websearch>
```

---

## System Prompt Integration

### WEB_SEARCH_MARKDOWN_FORMAT

Tells AI to create `<websearch>` blocks with proper structure and dynamic status updates.

```typescript
import { WEB_SEARCH_MARKDOWN_FORMAT } from '@/lib/enhanced-system-prompts';

// Use in system prompt for all searches
const systemPrompt = `${WEB_SEARCH_MARKDOWN_FORMAT}...rest of prompt`;
```

### Status Progression

```
Phase 1: 🔄 Searching: [query]
    ↓
Phase 2: ⚙️ Processing Search Results from [sources]...
    ↓
Phase 3: 🧠 Analyzing Results...
    ↓
Phase 4: ✅ Search Complete
```

---

## React Components

### WebSearchBlock Component

Displays the markdown block with real-time updates.

```tsx
import { WebSearchBlock } from '@/components/WebSearchBlock';

<WebSearchBlock
  markdown={markdownString}
  state={webSearchState}
  animated={true}
/>
```

**Features:**
- ✅ Dynamic status color coding
- ✅ Expandable/collapsible
- ✅ Progress bar
- ✅ Animated text streaming
- ✅ Duration timer

### StreamingWebSearch Component

Standalone component for immediate web search display.

```tsx
import { StreamingWebSearch } from '@/components/WebSearchBlock';

<StreamingWebSearch
  initialQuery="India news today"
  onStatusChange={(status) => console.log(status)}
/>
```

---

## React Hooks

### useWebSearchMarkdown

Main hook for managing web search markdown state and generation.

```typescript
import { useWebSearchMarkdown } from '@/hooks/useWebSearchMarkdown';

const search = useWebSearchMarkdown({
  onStatusChange: (status) => console.log(status),
  onMarkdownUpdate: (markdown) => updateUI(markdown),
});

// Start search
search.startSearch('India news', 'India news December 11 2025 - today...');

// Update phases
search.updateToProcessing(['Times of India', 'NDTV', 'Hindustan Times']);
search.updateToAnalyzing(results);
search.completeSearch();
```

### useWebSearchInChat

Extracts web search blocks from chat messages.

```typescript
import { useWebSearchInChat } from '@/hooks/useWebSearchMarkdown';

const { webSearchBlocks, hasWebSearch, isSearching, isComplete } = 
  useWebSearchInChat({ messageContent });
```

### useStreamingWebSearch

Manages real-time streaming of web search status.

```typescript
import { useStreamingWebSearch } from '@/hooks/useWebSearchMarkdown';

const { status, sources, displayText } = useStreamingWebSearch({
  enabled: true,
  initialQuery: 'India news December 11',
});
```

---

## Usage Examples

### Example 1: Basic Web Search with Hook

```typescript
function SearchComponent() {
  const search = useWebSearchMarkdown({
    onMarkdownUpdate: (md) => setMarkdown(md),
  });

  const handleSearch = async (query: string) => {
    // Start
    search.startSearch('News', query);

    // Simulate search phases
    setTimeout(() => {
      search.updateToProcessing(['Source1', 'Source2', 'Source3']);
    }, 1000);

    setTimeout(() => {
      search.updateToAnalyzing([...results]);
    }, 2500);

    setTimeout(() => {
      search.completeSearch();
    }, 4000);
  };

  return (
    <>
      <button onClick={() => handleSearch('India news')}>
        Search
      </button>
      <WebSearchBlock markdown={search.markdown} state={search.state} />
    </>
  );
}
```

### Example 2: In Chat Message

```typescript
function ChatMessage({ content, role }) {
  const { webSearchBlocks, hasWebSearch, isComplete } = 
    useWebSearchInChat({ messageContent: content });

  return (
    <div>
      {hasWebSearch && (
        <div className="space-y-4">
          {webSearchBlocks.map((block, idx) => (
            <WebSearchBlock key={idx} markdown={block.markdown} />
          ))}
        </div>
      )}
      <div className="prose">{content}</div>
    </div>
  );
}
```

### Example 3: AI-Generated Search with Streaming

```typescript
import { generateWebSearchMarkdown, initializeWebSearchState } from '@/lib/web-search-markdown-generator';

async function aiSearch(query: string) {
  // Initialize
  let state = initializeWebSearchState('News', query);
  
  // Phase 1: Searching
  let markdown = generateWebSearchMarkdown(state);
  displayMarkdown(markdown);
  
  // Wait for AI to search...
  await delay(2000);
  
  // Phase 2: Processing
  state = updateToProcessing(state, ['TOI', 'HT', 'NDTV']);
  markdown = generateWebSearchMarkdown(state);
  displayMarkdown(markdown);
  
  // Phase 3: Analyzing
  state = updateToAnalyzing(state, results);
  markdown = generateWebSearchMarkdown(state);
  displayMarkdown(markdown);
  
  // Phase 4: Complete
  state = updateToComplete(state);
  markdown = generateWebSearchMarkdown(state);
  displayMarkdown(markdown);
}
```

---

## Status Phases

### Phase 1: Searching (🔄)

**When:** AI starts searching
**Display:** 
```
🔄 Searching: India news December 11 2025 - today's headlines...
Loading results from web...
```

**Duration:** 1-3 seconds

**Markdown:**
```xml
<websearch>
...
**Status:** 🔄 Searching...

### Status

**🔄 Searching:** [query text]
_Loading results from web..._
</websearch>
```

---

### Phase 2: Processing (⚙️)

**When:** Results received, AI reviewing them
**Display:**
```
⚙️ Processing Search Results
from Times of India, Hindustan Times, Economic Times, NDTV, India Today, and others...
```

**Duration:** 1-2 seconds

**Key Point:** Show specific source names found

**Markdown:**
```xml
**Status:** ⚙️ Processing Results...

### Status

**✓ Processing Search Results**
from Times of India, Hindustan Times, Economic Times, NDTV, and others...
```

---

### Phase 3: Analyzing (🧠)

**When:** Organizing and analyzing information
**Display:**
```
🧠 Analyzing Results
Organizing 15 sources into structured knowledge...
```

**Duration:** 1-2 seconds

**Markdown:**
```xml
**Status:** 🧠 Analyzing...

### Status

**🧠 Analyzing Results**
Organizing [n] sources into structured knowledge...
```

---

### Phase 4: Complete (✅)

**When:** All processing done, results ready
**Display:** Full markdown with results table and metadata
**Duration:** Persistent

**Markdown:**
```xml
**Status:** ✅ Complete

### Status

**✅ Search Complete**
Gathered 15 sources in 3.2s

### 📋 Results

[Results table here]

### 📊 Metadata

[Metadata table here]
```

---

## Best Practices

### 1. Dynamic Status Text

❌ **Don't repeat:**
```
Searching...
Searching...
Searching...
```

✅ **Do update:**
```
🔄 Searching: India news December 11 2025...
⚙️ Processing Results from Times of India, Hindustan Times...
🧠 Analyzing Results...
✅ Search Complete
```

### 2. Proper Closing

❌ **Don't forget:**
```xml
<websearch>
...content...
```

✅ **Always close:**
```xml
<websearch>
...content...
</websearch>
```

### 3. Separate from Trigger Tags

❌ **Don't mix:**
```xml
<reason>
  <websearch>
  ...
  </websearch>
</reason>
```

✅ **Keep separate:**
```xml
<websearch>
...
</websearch>

<reason>
...
</reason>
```

### 4. Dynamic Source Names

❌ **Generic:**
```
Processing Search Results from sources...
```

✅ **Specific:**
```
Processing Search Results from Times of India, Hindustan Times, NDTV, India Today, and others...
```

---

## Component Props

### WebSearchBlock

```typescript
interface WebSearchBlockProps {
  markdown: string;              // Full markdown string
  state?: WebSearchMarkdownState; // State object for styling
  animated?: boolean;             // Animate text streaming
}
```

### StreamingWebSearch

```typescript
interface StreamingWebSearchProps {
  initialQuery: string;           // Query to display
  onStatusChange?: (status: string) => void;
}
```

---

## Utilities

### Markdown Generator Functions

```typescript
// Initialize
initializeWebSearchState(topic, searchQuery)

// Update phases
updateToProcessing(state, sources, peekResults?)
updateToAnalyzing(state, results)
updateToComplete(state)

// Generate markdown
generateWebSearchMarkdown(state)

// Extract from response
extractWebSearchBlocks(response)
parseWebSearchMarkdown(markdown)

// Utilities
generatePeekResultsFromSources(sources)
generateWebSearchMarkdownInstruction()
```

---

## Styling

### Status Colors

```
Searching:   Blue (#3b82f6)
Processing:  Purple (#a855f7)
Analyzing:   Cyan (#06b6d4)
Complete:    Green (#22c55e)
```

### Animation

- Text streams at 5ms per character
- Progress bar animates smoothly
- Pulsing status emoji

---

## Integration with Chat

### In Message Display

```tsx
function ChatMessage({ message }) {
  const { webSearchBlocks } = useWebSearchInChat({ 
    messageContent: message.content 
  });

  return (
    <div className="space-y-4">
      {webSearchBlocks.map((block) => (
        <WebSearchBlock key={block.markdown} markdown={block.markdown} />
      ))}
      <div className="prose max-w-none">
        {message.content.replace(/<websearch>[\s\S]*?<\/websearch>/g, '')}
      </div>
    </div>
  );
}
```

---

## Performance Considerations

- **Markdown generation:** O(n) where n = number of results
- **Component re-renders:** Only when state changes
- **Memory:** ~5-10KB per search block
- **Animation:** GPU-accelerated via CSS

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Block not displaying | Missing markdown | Ensure `<websearch>` and `</websearch>` |
| Wrong status emoji | Incorrect status value | Check status values match enum |
| Results not showing | Empty results array | Verify results populated before Complete |
| Text not animating | animated=false | Set animated={true} on component |
| Overlapping text | Long results titles | Titles are truncated to 50 chars |

---

## Examples in Action

### News Search
```
User: "India news December 11"
AI creates: <websearch> block
Status progression: Searching → Processing (show TOI, HT, NDTV) → Analyzing → Complete
```

### Academic Research
```
User: "Latest quantum computing research"
AI creates: <websearch> block
Status progression: Searching → Processing (show Nature, arXiv, IEEE) → Analyzing → Complete
```

### Product Information
```
User: "iPhone 15 Pro specs and price"
AI creates: <websearch> block
Status progression: Searching → Processing (show Apple, TechCrunch) → Analyzing → Complete
```

---

## Deployment

1. ✅ Add files to src/
2. ✅ Update system prompts (already done)
3. ✅ Import components in chat UI
4. ✅ Connect to web search API/AI model
5. ✅ Test with sample queries

Ready to use!
