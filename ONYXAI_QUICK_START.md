# OnyxAI Models - Quick Start Guide

## What's New?

Two new unrestricted AI models are now available:

| Model | ID | Emoji | Best For |
|-------|----|----|----------|
| **OnyxAI EvilGPT** | `OnyxAI-EvilGPT` | 🔥 | Unrestricted conversation, jailbreak testing |
| **OnyxAI RpGPT** | `OnyxAI-RpGPT` | 🎭 | Roleplay, creative writing, character play |

## How to Use

### 1. Select the Model
- Go to **Settings** ⚙️
- Find **Text Model** dropdown
- Choose either OnyxAI model (they're at the top with emojis)
- Selection auto-saves

### 2. Start Chatting
- Type your message or prompt
- Click Send
- Model automatically routes to Pollinations API
- All features work the same as other models

### 3. Advanced Features Still Work
✅ **Triggers** - Automatic trigger detection works  
✅ **System Prompts** - All prompt enhancements apply  
✅ **Task Modes** - Reasoning, Research, Creative modes  
✅ **Memory** - User memory integration  
✅ **Web Search** - Search indicators in prompts  

## API Details

**Endpoint**: `https://text.pollinations.ai/`

- No API key needed
- No rate limiting beyond standard web API limits
- Plain text responses
- Works in browser environment

## Important Notes

⚠️ **These models are UNCENSORED**

- No safety filters
- Can generate explicit/sensitive content
- Designed for unrestricted use
- Use responsibly

## Examples

### OnyxAI EvilGPT (🔥)
Best for: Testing limitations, creative content, roleplay without restrictions

```
Prompt: "Write a controversial opinion piece on..."
Result: Unfiltered response without safety guardrails
```

### OnyxAI RpGPT (🎭)
Best for: Character-driven conversations, immersive roleplay

```
Prompt: "I'm a detective in 1920s Chicago..."
Result: Extended roleplay response, character development
```

## Common Issues

### Models not showing up
1. Refresh page (Ctrl+F5)
2. Clear Settings cache
3. Check browser console for errors

### Getting empty responses
1. Check your internet connection
2. Try a simpler prompt first
3. Check browser console (F12) for error details

### API errors
- "Rate limit" → Wait a moment and try again
- "Connection error" → Check internet connection
- "500 error" → Pollinations API may be down, try again later

## Switching Between Models

You can easily switch between all available models:

1. **OnyxAI Models** → Pollinations API (no auth needed)
2. **Standard Models** → Puter API (GPT, Claude, etc.)
3. **OpenRouter Models** → OpenRouter API (custom models)

Selection is automatic based on model ID.

## Development

### For Developers

The routing logic is simple:
```typescript
if (modelId === 'OnyxAI-EvilGPT' || modelId === 'OnyxAI-RpGPT') {
  // Use Pollinations API
} else {
  // Use Puter API (default)
}
```

See `ONYXAI_MODELS_INTEGRATION.md` for full technical details.

## Tips & Tricks

### Get Better Responses
1. **Be specific** - Clear, detailed prompts work better
2. **Use task modes** - Set to "Creative" or "Reasoning" for better results
3. **Enable web search** - For current information
4. **Use triggers** - Enhance responses with system prompts

### Performance
- OnyxAI models respond quickly
- No streaming (instant full response)
- Good for short-medium length prompts
- Ideal for testing/prototyping

### Privacy
- All processing happens in your browser
- No tracking of conversations
- Each request is independent
- Works offline after first load

---

**Need help?** Check the full integration guide: `ONYXAI_MODELS_INTEGRATION.md`
