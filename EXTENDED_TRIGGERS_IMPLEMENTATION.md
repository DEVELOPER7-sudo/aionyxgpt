# Extended Triggers System - Implementation Guide

## Quick Start

### Step 1: Initialize System on App Load

In your `ChatApp.tsx` or main app file, add initialization:

```typescript
import { initializeExtendedTriggerSystem } from '@/lib/trigger-manager-extended';

// In useEffect on app startup
useEffect(() => {
  initializeExtendedTriggerSystem();
}, []);
```

### Step 2: Add Auto-Trigger Selector Component

In your chat input area, add the auto-selector:

```typescript
import AIAutoTriggerSelector from '@/components/AIAutoTriggerSelector';

// In your chat component
<AIAutoTriggerSelector
  userMessage={inputMessage}
  selectedTriggers={selectedTriggers}
  onTriggersChange={setSelectedTriggers}
  isVisible={true}
/>
```

### Step 3: Use Combined Trigger Prompt

When sending messages, build combined prompts:

```typescript
import { buildCombinedTriggerPrompt, analyzeAndAutoSelectTriggers } 
  from '@/lib/trigger-manager-extended';

// On message send
const autoResult = analyzeAndAutoSelectTriggers(userMessage);
const combinedResult = buildCombinedTriggerPrompt(
  autoResult.suggestedTriggers,
  selectedTriggers,
  userMessage
);

// Use combinedResult.systemPrompt in your API call
```

---

## Integration Checklist

- [ ] Import `triggers-extended.ts` library
- [ ] Import `trigger-manager-extended.ts` library
- [ ] Import `AIAutoTriggerSelector` component
- [ ] Call `initializeExtendedTriggerSystem()` on app load
- [ ] Add `<AIAutoTriggerSelector>` to chat input UI
- [ ] Update message handler to use `buildCombinedTriggerPrompt()`
- [ ] Test auto-suggestion with sample messages
- [ ] Verify extended triggers appear in trigger selector
- [ ] Test combined auto + manual trigger selection
- [ ] Verify system prompts include category guidance

---

## File Locations

```
✅ CREATED:
├── src/lib/triggers-extended.ts (400+ triggers)
├── src/lib/trigger-manager-extended.ts (manager)
├── src/components/AIAutoTriggerSelector.tsx (UI)
├── EXTENDED_TRIGGERS_GUIDE.md (complete guide)
└── EXTENDED_TRIGGERS_IMPLEMENTATION.md (this file)

EXISTING (No changes required):
├── src/lib/triggers.ts
├── src/lib/trigger-system-prompts.ts
├── src/components/TriggerSelector.tsx
└── src/components/[other trigger components]
```

---

## Code Integration Examples

### Example 1: Chat Component Integration

```typescript
// src/pages/ChatApp.tsx

import { initializeExtendedTriggerSystem } from '@/lib/trigger-manager-extended';
import AIAutoTriggerSelector from '@/components/AIAutoTriggerSelector';
import { buildCombinedTriggerPrompt } from '@/lib/trigger-manager-extended';

const ChatApp = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  // Initialize on mount
  useEffect(() => {
    initializeExtendedTriggerSystem();
  }, []);

  // Handle message send
  const handleSendMessage = async () => {
    // Build combined prompt
    const { systemPrompt, allActiveTriggers } = buildCombinedTriggerPrompt(
      [], // Auto-selected (can add if desired)
      selectedTriggers,
      inputMessage
    );

    // Send to API with systemPrompt
    const response = await sendChatMessage(inputMessage, systemPrompt);
    
    // Process response...
  };

  return (
    <div>
      {/* Auto-trigger suggestion component */}
      <AIAutoTriggerSelector
        userMessage={inputMessage}
        selectedTriggers={selectedTriggers}
        onTriggersChange={setSelectedTriggers}
      />

      {/* Chat input */}
      <input
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
      />

      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
```

### Example 2: Auto-Selection Only

```typescript
// Use only auto-selection, no manual selection

import { autoSelectTriggers } from '@/lib/triggers-extended';
import { getAutoSuggestionSystemPrompt } from '@/lib/trigger-manager-extended';

const result = autoSelectTriggers(userMessage);

// Apply only auto-suggested triggers
const systemPrompt = getAutoSuggestionSystemPrompt(
  result.suggestedTriggers
);

// Send message with auto-suggested triggers
await sendChatMessage(userMessage, systemPrompt);
```

### Example 3: Statistics & Monitoring

```typescript
import { getTriggerStatistics } from '@/lib/trigger-manager-extended';

// Get system statistics
const stats = getTriggerStatistics();

console.log(`Total Triggers: ${stats.totalTriggers}`);
console.log(`Extended Triggers: ${stats.totalExtendedTriggers}`);
console.log(`Enabled: ${stats.enabledTriggers}`);
console.log(`Categories: ${stats.categories.length}`);

// By category breakdown
Object.entries(stats.categoriesBreakdown).forEach(([cat, count]) => {
  console.log(`${cat}: ${count} triggers`);
});
```

### Example 4: Custom Extended Trigger

```typescript
import { Trigger } from '@/lib/triggers';
import { addTrigger } from '@/lib/triggers';

const customTrigger: Trigger = {
  trigger: '════ QUANTUM_COMPUTING ════',
  category: 'Specialist Domains',
  systemInstruction: 'Provide expert analysis on quantum computing with emphasis on quantum algorithms, qubit operations, and quantum advantages over classical computing.',
  example: 'Explain quantum entanglement and superposition.',
  enabled: true,
  custom: true,
};

// Add custom trigger
addTrigger(customTrigger);
```

---

## Testing the Integration

### Test 1: Auto-Suggestion Detection

```typescript
import { autoSelectTriggers } from '@/lib/triggers-extended';

// Test message
const message = "How do I optimize my React app performance?";
const result = autoSelectTriggers(message);

console.log('Suggested:', result.suggestedTriggers);
console.log('Confidence:', result.confidence);
console.log('Category:', result.category);
// Expected: Frontend Optimization, ~90%+ confidence
```

### Test 2: Combined Triggers

```typescript
import { buildCombinedTriggerPrompt } from '@/lib/trigger-manager-extended';

const result = buildCombinedTriggerPrompt(
  ['optimize', 'performance'],
  ['debug', 'refactor'],
  'Optimize React app'
);

console.log('All Triggers:', result.allActiveTriggers);
console.log('Auto Selected:', result.autoSelected);
console.log('Manual Selected:', result.manualSelected);
console.log('System Prompt Length:', result.systemPrompt.length);
```

### Test 3: Extended Triggers Loading

```typescript
import { getAllExtendedTriggers } from '@/lib/triggers-extended';

const extended = getAllExtendedTriggers();
console.log(`Loaded ${extended.length} extended triggers`);
console.log('Categories:', [...new Set(extended.map(t => t.category))]);
```

---

## Performance Optimization

### Lazy Load Extended Triggers

If file size is a concern, lazy load extended triggers:

```typescript
// In trigger-manager-extended.ts
let extendedTriggersCache: Trigger[] | null = null;

export const getAllExtendedTriggersCached = async (): Promise<Trigger[]> => {
  if (extendedTriggersCache) return extendedTriggersCache;
  
  // Dynamic import
  const module = await import('@/lib/triggers-extended');
  extendedTriggersCache = module.getAllExtendedTriggers();
  return extendedTriggersCache;
};
```

### Debounce Auto-Selection

Component already includes 300ms debounce:

```typescript
// Already implemented in AIAutoTriggerSelector
const timer = setTimeout(() => {
  const result = autoSelectTriggers(userMessage);
  // ... process result
}, 300); // Debounce delay
```

---

## Troubleshooting

### Issue: Extended triggers not appearing

**Solution:**
```typescript
import { initializeExtendedTriggerSystem } from '@/lib/trigger-manager-extended';

// Call explicitly and verify
initializeExtendedTriggerSystem();

// Check localStorage
const stored = localStorage.getItem('onyxgptTriggers');
console.log('Stored triggers:', JSON.parse(stored || '[]').length);
```

### Issue: Auto-selection not showing

**Checklist:**
1. Message length > 10 characters
2. Contains relevant keywords
3. Confidence > 0.7 (70%)
4. Component `isVisible={true}`
5. Check browser console for errors

### Issue: Duplicate triggers in selection

**Solution:**
```typescript
// Deduplicate manually
const unique = Array.from(new Set(selectedTriggers));
setSelectedTriggers(unique);
```

---

## API Integration Example

If using OpenRouter or similar API:

```typescript
import { buildCombinedTriggerPrompt } from '@/lib/trigger-manager-extended';

async function sendMessageWithTriggers(
  userMessage: string,
  selectedTriggers: string[],
  model: string = 'openai/gpt-4'
) {
  // Build system prompt with triggers
  const { systemPrompt } = buildCombinedTriggerPrompt(
    [], // Auto-selected triggers (optional)
    selectedTriggers,
    userMessage
  );

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  return response.json();
}
```

---

## Configuration Options

### Adjust Auto-Selection Confidence Threshold

In `triggers-extended.ts`:

```typescript
// Change minimum confidence for showing suggestion
// Current: 0.7 (70%)
// Increase for stricter filtering
// Decrease for more suggestions

const shouldShow = result.confidence > 0.7; // Change this value
```

### Adjust Debounce Delay

In `AIAutoTriggerSelector.tsx`:

```typescript
// Current: 300ms
// Increase for slower typing, decrease for faster response
const timer = setTimeout(() => {
  // ... analysis
}, 300); // Change this value
```

---

## Monitoring & Analytics

### Track Auto-Selection Usage

```typescript
import { autoSelectTriggers } from '@/lib/triggers-extended';

function trackAutoSelection(userMessage: string) {
  const result = autoSelectTriggers(userMessage);
  
  // Send to analytics
  analytics.track('auto_trigger_suggestion', {
    suggestedCount: result.suggestedTriggers.length,
    confidence: result.confidence,
    category: result.category,
    applied: false, // Updated when user applies
  });
}
```

### Log Trigger Statistics

```typescript
import { getTriggerStatistics } from '@/lib/trigger-manager-extended';

const stats = getTriggerStatistics();
console.table(stats.categoriesBreakdown);
```

---

## Next Steps

1. ✅ Copy the 3 new files to your project
2. ✅ Add initialization to app startup
3. ✅ Add component to chat UI
4. ✅ Update message handler
5. ✅ Test with sample messages
6. ✅ Deploy to production

---

## Support

For issues or questions:
1. Check `EXTENDED_TRIGGERS_GUIDE.md` for detailed reference
2. Review code comments in implementation files
3. Test with console logging
4. Check browser DevTools for errors

---

**Version:** 1.0
**Last Updated:** 2024-11-28
**Status:** Ready for Integration
