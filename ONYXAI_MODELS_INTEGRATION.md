# OnyxAI Models Integration - Pollinations API

## Overview
Successfully integrated two uncensored OnyxAI models that use the Pollinations API endpoint, while all other models continue using the Puter API.

## Models Added

### 1. **OnyxAI EvilGPT** 🔥
- **ID**: `OnyxAI-EvilGPT`
- **Display Name**: OnyxAI EvilGPT 🔥 (Uncensored)
- **Provider**: OnyxAI
- **API**: Pollinations (`https://text.pollinations.ai/`)
- **Type**: Unrestricted/Uncensored

### 2. **OnyxAI RpGPT** 🎭
- **ID**: `OnyxAI-RpGPT`
- **Display Name**: OnyxAI RpGPT 🎭 (Uncensored)
- **Provider**: OnyxAI
- **API**: Pollinations (`https://text.pollinations.ai/`)
- **Type**: Unrestricted/Uncensored (RP-optimized)

## Implementation Details

### Files Modified

1. **src/lib/models.ts**
   - Added both OnyxAI models to `TEXT_MODELS` array
   - Marked with `isPollinations: true` property for easy identification
   - Positioned at the top of the list for visibility

2. **src/pages/ChatApp.tsx**
   - Added `handlePollinationsChat()` function to handle API calls to Pollinations
   - Modified `handleTextChat()` to detect and route OnyxAI models to Pollinations handler
   - Full support for:
     - Trigger system (automatic trigger detection and tag enforcement)
     - System prompts (including memory context integration)
     - Task modes (standard, reasoning, research, creative)
     - Web search and deep search flags
     - Message history tracking
     - Error handling and rate limiting

### API Integration

#### Pollinations API Endpoint
```
https://text.pollinations.ai/{prompt}
```

**Request Format**:
- Single GET request with encoded prompt
- Combines system prompt + user message
- Returns plain text response

**Features Supported**:
- ✅ System prompts and instructions
- ✅ Trigger system (tag enforcement)
- ✅ Task modes
- ✅ Memory context
- ✅ Web search indicators
- ✅ Error handling
- ✅ Analytics tracking

### Routing Logic

```typescript
// Automatic detection
const isPollinationsModel = modelId === 'OnyxAI-EvilGPT' || modelId === 'OnyxAI-RpGPT';

if (isPollinationsModel) {
  await handlePollinationsChat(...);
} else {
  // Use existing Puter API handler for all other models
}
```

## Feature Support

### ✅ Supported Features
- **Triggers**: Full trigger system integration with tag enforcement
- **System Prompts**: Enhanced system prompts with memory integration
- **Task Modes**: Standard, Reasoning, Research, Creative modes
- **Web Search**: Web search indication in prompts
- **Deep Search**: Deep reasoning indicators
- **Memory Context**: User memory integration
- **Analytics**: Token estimation and usage tracking
- **Error Handling**: Comprehensive error messages
- **Debug Logging**: Development mode logging

### Usage Example

1. Open Settings
2. Select either "OnyxAI EvilGPT 🔥" or "OnyxAI RpGPT 🎭" from model dropdown
3. Chat normally - API routing is automatic
4. All triggers, system prompts, and features work seamlessly

## API Rate Limiting

- Pollinations API has built-in rate limiting
- Errors handled gracefully with user-friendly messages
- Automatic retry guidance provided

## Security & Safety

⚠️ **Important Notes**:
- These models are explicitly uncensored
- They may generate unrestricted content
- Use responsibly within your jurisdiction's laws
- Content filtering is disabled by default on these models
- Consider implementing content moderation if needed for production

## Testing Checklist

- [x] Models appear in settings dropdown
- [x] Model selection persists
- [x] Pollinations API calls work
- [x] Responses display correctly
- [x] Trigger system integrates properly
- [x] System prompts apply correctly
- [x] Error handling works
- [x] Analytics tracking functions
- [x] Build compiles without errors

## Future Enhancements

1. Add streaming support for Pollinations API (if available)
2. Implement model-specific system prompt overrides
3. Add content filtering options
4. Create model comparison view
5. Add usage statistics per model

## Troubleshooting

### Models not appearing
- Clear browser cache
- Check if `src/lib/models.ts` was saved correctly
- Verify localStorage settings are cleared

### API errors
- Check internet connection
- Verify Pollinations API is accessible
- Check browser console for detailed error logs
- Verify no CORS issues (they should be handled)

### Responses seem incomplete
- Pollinations API has different response patterns
- Check debug logs in development mode
- Verify prompt is being formatted correctly

## Code References

### Model Detection (ChatApp.tsx, line ~304)
```typescript
const isPollinationsModel = modelId === 'OnyxAI-EvilGPT' || modelId === 'OnyxAI-RpGPT';
if (isPollinationsModel) {
  await handlePollinationsChat(messages, chatId, userText, selectedTriggers);
  return;
}
```

### Pollinations API Call (ChatApp.tsx, line ~260)
```typescript
const pollinationsUrl = `https://text.pollinations.ai/${encodeURIComponent(combinedPrompt)}`;
const response = await fetch(pollinationsUrl);
const fullResponse = await response.text();
```

## Deployment Notes

- No environment variables required for Pollinations API
- No authentication tokens needed
- Works on any domain (no CORS restrictions)
- Fully client-side implementation
- No additional dependencies needed

---

**Last Updated**: December 4, 2025
**Status**: ✅ Complete and Production Ready
