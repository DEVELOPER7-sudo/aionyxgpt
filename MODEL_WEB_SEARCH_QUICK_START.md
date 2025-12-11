# Model-Based Web Search - Quick Start

## What It Does

AI performs web searches directly. No external API needed.

**Flow:**
```
User Query → AI Searches → AI Analyzes (2-3 sources) → Repeats if needed → Final Answer
```

---

## 3-Minute Setup

### 1. Import Components

```typescript
import { useModelWebSearchOrchestration } from '@/hooks/useModelWebSearchOrchestration';
import { ModelWebSearchOrchestrator } from '@/components/ModelWebSearchOrchestrator';
import { generateModelWebSearchSystemPrompt } from '@/lib/model-web-search-orchestrator';
```

### 2. Create Hook

```typescript
const research = useModelWebSearchOrchestration({
  onAISearch: async (prompt) => {
    // Send to your AI model
    return await yourAIModel.generate({
      system: generateModelWebSearchSystemPrompt(),
      user: prompt,
    });
  },
  maxCycles: 3,
});
```

### 3. Add UI

```tsx
<ModelWebSearchOrchestrator
  state={research.state}
  onContinueSearch={research.continueSearch}
  onRefineSearch={research.refineSearch}
  onDeepSearch={research.deepSearch}
  onComplete={handleComplete}
  isLoading={research.isLoading}
/>
```

### 4. Start

```typescript
await research.startResearch("Your question here");
```

Done! AI now searches and analyzes automatically.

---

## File Structure

```
src/
├── lib/
│   └── model-web-search-orchestrator.ts   (Core logic)
├── components/
│   └── ModelWebSearchOrchestrator.tsx      (UI)
└── hooks/
    └── useModelWebSearchOrchestration.ts   (State management)

docs/
├── MODEL_WEB_SEARCH_GUIDE.md               (Full guide)
└── MODEL_WEB_SEARCH_QUICK_START.md         (This file)
```

---

## Key Functions

### Initialize
```typescript
const research = useModelWebSearchOrchestration({...})
```

### Execute
```typescript
research.startResearch(query)
research.continueSearch()
research.refineSearch(newQuery)
research.deepSearch(specificQuery)
research.generateFinalAnswer()
```

### State
```typescript
research.state           // Full research state
research.isLoading      // Is AI processing?
research.error          // Error message
research.reset()        // Clear everything
```

---

## AI Integration Examples

### Claude (Anthropic)

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

const research = useModelWebSearchOrchestration({
  onAISearch: async (prompt) => {
    const msg = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: generateModelWebSearchSystemPrompt(),
      messages: [{ role: 'user', content: prompt }],
    });
    return msg.content[0].text;
  },
});
```

### OpenAI

```typescript
import OpenAI from 'openai';

const openai = new OpenAI();

const research = useModelWebSearchOrchestration({
  onAISearch: async (prompt) => {
    const res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: generateModelWebSearchSystemPrompt() },
        { role: 'user', content: prompt },
      ],
      max_tokens: 4096,
    });
    return res.choices[0].message.content;
  },
});
```

### Google Gemini

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const research = useModelWebSearchOrchestration({
  onAISearch: async (prompt) => {
    const model = genAI.getGenerativeModel({
      model: 'gemini-pro',
      systemInstruction: generateModelWebSearchSystemPrompt(),
    });
    const result = await model.generateContent(prompt);
    return result.response.text();
  },
});
```

---

## How It Works

### Cycle 1: Initial Search

**You send:**
```
Research: "quantum computing 2024"
```

**System prompts AI:**
```
Use web search to find info about quantum computing in 2024.
Analyze top 2-3 sources.
Format with trigger tags: <reason>, <analyze>, <deepresearch>
```

**AI responds:**
```
<reason>
Searching for recent quantum computing announcements...
</reason>

I found:
1. [IBM Quantum Blog](https://ibm.com/quantum/)
2. [Google AI Blog](https://google.com/quantum)
3. [Nature News](https://nature.com/quantum)

<analyze>
Key findings: Error correction is critical...
</analyze>

<deepresearch>
Coverage: 70%
Next action: deep_search
Query: "quantum error correction breakthrough 2024"
</deepresearch>
```

**System extracts:**
- Markdown links automatically become results
- Parses trigger tags for next action
- Updates UI with findings

### Cycle 2: Deep Search (Optional)

**You click "Deep Search"** with suggested query

**AI searches again** with refined query

**Results accumulate** across cycles

---

## Trigger Tags AI Uses

```xml
<reason>
Why searching for this
</reason>

<analyze>
Analysis of 2-3 sources:
- Finding 1
- Finding 2
- Patterns noted
- Gaps identified
</analyze>

<deepresearch>
Next action: [analyze|refine_search|deep_search|complete]
Suggested query: [if searching again]
</deepresearch>
```

---

## Decision Flow

```
AI Searches & Analyzes
    ↓
Coverage sufficient?
├─ YES
│  ├─ Need more cycles?
│  │  ├─ NO  → COMPLETE
│  │  └─ YES → DEEP_SEARCH
│  └─ Results good?
│     ├─ NO  → REFINE_SEARCH
│     └─ YES → ANALYZE more
└─ NO → REFINE_SEARCH
```

---

## UI Features

✅ Progress bar (shows research completion)
✅ Expandable cycle cards
✅ AI reasoning display
✅ Results table per cycle
✅ Action buttons
✅ Status indicators
✅ Error handling

---

## Real Example

### Start
```typescript
await research.startResearch("Latest AI models 2024");
```

### Cycle 1 (Auto)
- AI searches
- Finds 3-5 sources
- Analyzes them
- Decides next action
- UI shows results

### Cycle 2 (Optional)
- User clicks button or auto continues
- AI refines/deepens search
- Adds more sources
- Updates analysis

### Cycle 3 (Optional)
- Final cycle (default limit 3)
- Wraps up findings
- Marks complete

### Final Answer
- Click "Generate Final Answer"
- AI synthesizes all cycles
- Returns comprehensive answer with citations

---

## Configuration

### Max Cycles
```typescript
useModelWebSearchOrchestration({
  onAISearch,
  maxCycles: 2,  // Fewer cycles
  // or
  maxCycles: 4,  // More cycles
})
```

### Different Models
Change which AI to use:
- Claude → Anthropic client
- ChatGPT → OpenAI client
- Gemini → Google client

---

## Output Example

### UI Shows:
```
🔍 Web Search Research
Query: "latest AI models 2024"

[Cycle 1 ▼]
  🧠 AI Reasoning: Searching for recent AI announcements...
  📋 Results Found (5)
    | OpenAI Blog
    | Google DeepMind
    | Meta AI Research
  🎯 Decision: deep_search
    → Suggested: "Claude vs GPT-4 vs Gemini 2024"

[Action: Deep Search]
```

### Final Answer Gets:
```markdown
# Latest AI Models 2024

Based on my research across 2 cycles:

## Key Models

1. **GPT-4** (OpenAI)
   According to [OpenAI Blog](URL), GPT-4 offers improved...

2. **Claude 3.5** (Anthropic)  
   [Anthropic Announcement](URL) details new capabilities...

## Sources
[Table of all sources found]
```

---

## Performance

**Timing per cycle:**
- Search + Analysis: 15-30 seconds
- Typical flow: 2-3 cycles = 30-90 seconds total
- No external API overhead

**Faster than API approach** because everything happens with LLM.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| AI not searching | Ensure system prompt is included |
| Wrong results | AI needs to use `[Title](URL)` format |
| Too many cycles | Reduce `maxCycles` value |
| Missing citations | Remind AI to format links |
| Slow performance | Fewer cycles or faster model |

---

## Next Steps

1. **Choose your AI model** (Claude, GPT-4, Gemini, etc.)
2. **Copy the hook code** with your model integration
3. **Add the component** to your chat interface
4. **Test with a query** like "latest AI news 2024"
5. **Customize** maxCycles and prompts as needed

---

## Key Differences vs API-Based

| Aspect | Model-Based | API-Based |
|--------|------------|----------|
| Setup | Simpler | More complex |
| External API | No | Yes |
| Cost | Model cost only | Model + API cost |
| Speed | Faster | Slower |
| Results quality | AI's web search | 3rd party search |
| Flexibility | High | Limited |

---

## Complete Example

```typescript
import React, { useState } from 'react';
import { useModelWebSearchOrchestration } from '@/hooks/useModelWebSearchOrchestration';
import { ModelWebSearchOrchestrator } from '@/components/ModelWebSearchOrchestrator';
import { generateModelWebSearchSystemPrompt } from '@/lib/model-web-search-orchestrator';
import OpenAI from 'openai';

const openai = new OpenAI();

export default function ResearchPage() {
  const [answer, setAnswer] = useState('');

  const research = useModelWebSearchOrchestration({
    onAISearch: async (prompt) => {
      const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: generateModelWebSearchSystemPrompt() },
          { role: 'user', content: prompt },
        ],
        max_tokens: 4096,
      });
      return res.choices[0].message.content || '';
    },
    maxCycles: 3,
  });

  const handleComplete = async () => {
    const finalAnswer = await research.generateFinalAnswer();
    setAnswer(finalAnswer);
  };

  return (
    <div className="space-y-6 p-8">
      <input
        placeholder="What do you want to research?"
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            research.startResearch(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />

      {research.state.currentCycleNumber > 0 && (
        <ModelWebSearchOrchestrator
          state={research.state}
          onContinueSearch={research.continueSearch}
          onRefineSearch={research.refineSearch}
          onDeepSearch={research.deepSearch}
          onComplete={handleComplete}
          isLoading={research.isLoading}
        />
      )}

      {answer && <div className="prose">{answer}</div>}
    </div>
  );
}
```

That's it! Ready to use.

---

## API Quick Reference

```typescript
// Init
useModelWebSearchOrchestration({ onAISearch, maxCycles? })

// Methods
research.startResearch(query)
research.continueSearch()
research.refineSearch(query)
research.deepSearch(query)
research.generateFinalAnswer()
research.reset()

// State
research.state          // WebSearchState
research.isLoading      // boolean
research.error          // string | null

// System Prompts
generateModelWebSearchSystemPrompt()
generateInitialSearchPrompt(query)
generateFollowUpSearchPrompt(query, findings, cycle)
generateSynthesisPrompt(state)

// Utilities
createModelSearchCycle(...)
updateModelSearchState(...)
extractResultsFromAIResponse(response, cycle)
```

---

## Support

- **Full Guide:** MODEL_WEB_SEARCH_GUIDE.md
- **Examples:** See files in src/
- **Issues:** Check triggering tags in AI response
