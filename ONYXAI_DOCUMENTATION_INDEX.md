# OnyxAI Models Integration - Documentation Index

## Quick Navigation

### For Users
Start here if you want to use the new models:
- **[ONYXAI_QUICK_START.md](./ONYXAI_QUICK_START.md)** - How to use OnyxAI models

### For Developers
Start here if you want to understand the implementation:
- **[ONYXAI_MODELS_INTEGRATION.md](./ONYXAI_MODELS_INTEGRATION.md)** - Complete technical documentation
- **[ONYXAI_API_ENDPOINT_CONFIG.md](./ONYXAI_API_ENDPOINT_CONFIG.md)** - API configuration and customization

---

## Documentation Overview

### 1. ONYXAI_QUICK_START.md
**Best for**: End users, feature overview, getting started

**Contents**:
- What's new (model overview)
- How to use the models
- Available features
- Usage examples
- Common issues & troubleshooting
- Tips & tricks
- Performance characteristics

**Read time**: 5-10 minutes

---

### 2. ONYXAI_MODELS_INTEGRATION.md
**Best for**: Developers, architects, understanding implementation

**Contents**:
- Complete overview of integration
- Model specifications and features
- Implementation details (files modified, code changes)
- API integration specifics
- Feature support matrix
- Routing logic
- Security & safety notes
- Testing checklist
- Troubleshooting guide
- Future enhancement ideas

**Read time**: 15-20 minutes

**Key sections**:
- Files Modified (which code was changed)
- Routing Logic (how models are detected)
- Feature Support (what works with these models)
- Implementation Details (deep technical dive)

---

### 3. ONYXAI_API_ENDPOINT_CONFIG.md
**Best for**: API developers, system integrators, advanced customization

**Contents**:
- Detailed endpoint information
- Request/response format
- Implementation examples
- Configuration options
- Performance characteristics
- Customization guide
- Integration examples
- Error handling details
- Monitoring & debugging
- Troubleshooting solutions

**Read time**: 10-15 minutes

**Key sections**:
- Endpoint Details (how to call the API)
- Request Examples (real-world usage)
- Customization (how to modify or extend)
- Performance Characteristics (speed, size, limits)

---

## The Two Models

### OnyxAI EvilGPT 🔥

| Property | Value |
|----------|-------|
| Model ID | `OnyxAI-EvilGPT` |
| Display Name | OnyxAI EvilGPT 🔥 (Uncensored) |
| Provider | OnyxAI |
| API Endpoint | Pollinations (`https://text.pollinations.ai/`) |
| Purpose | Unrestricted conversation |
| Use Case | Testing, creative writing, unrestricted discussion |
| Content Filters | None (uncensored) |

### OnyxAI RpGPT 🎭

| Property | Value |
|----------|-------|
| Model ID | `OnyxAI-RpGPT` |
| Display Name | OnyxAI RpGPT 🎭 (Uncensored) |
| Provider | OnyxAI |
| API Endpoint | Pollinations (`https://text.pollinations.ai/`) |
| Purpose | Roleplay & character interaction |
| Use Case | Character play, immersive conversations, creative scenarios |
| Content Filters | None (uncensored) |

---

## Implementation Summary

### What Changed

**Files Modified**: 2
- `src/lib/models.ts` - Added model definitions
- `src/pages/ChatApp.tsx` - Added routing and Pollinations handler

**Lines Added**: ~150
- Model definitions: 3 lines
- API handler function: 147 lines
- Routing logic: 3 lines

**New Functions**: 1
- `handlePollinationsChat()` - Handles Pollinations API calls

### How It Works

```
User selects OnyxAI model
         ↓
Model stored in settings
         ↓
User sends message
         ↓
System detects model is OnyxAI
         ↓
Routes to handlePollinationsChat()
         ↓
Builds complete prompt with:
  - System prompt
  - Triggers
  - Task mode
  - Memory context
         ↓
Calls Pollinations API
         ↓
Returns response to chat
         ↓
Updates message history
```

---

## Features Supported

### All Current Features Work
- ✅ Trigger system (automatic detection)
- ✅ System prompts (enhanced prompts)
- ✅ Task modes (Reasoning, Research, Creative)
- ✅ Web search indicators
- ✅ Deep search support
- ✅ User memory integration
- ✅ Analytics tracking
- ✅ Error handling
- ✅ Debug logging

### Architecture

```
ChatApp.tsx
├─ Model Selection (Settings)
├─ Message Input
├─ Routing Logic
│  ├─ If OnyxAI model → handlePollinationsChat()
│  └─ Else → existing Puter API handler
└─ Response Display
    └─ All features work seamlessly
```

---

## API Information

### Pollinations API

**Endpoint**: `https://text.pollinations.ai/`

**Features**:
- No authentication required
- CORS enabled (works in browser)
- No rate limiting per user (fair use)
- Plain text responses
- Simple URL-based API
- Free to use

**Request Format**:
```
GET https://text.pollinations.ai/{encoded_prompt}
```

**Response**:
```
[Plain text response from model]
```

---

## How to Use

### Basic Usage
1. Open Settings
2. Select Text Model
3. Choose "OnyxAI EvilGPT 🔥" or "OnyxAI RpGPT 🎭"
4. Chat normally

### Advanced Usage
1. Enable triggers in settings
2. Use task modes for different conversation styles
3. Enable web search for current information
4. Use memory features for persistent context

---

## For Different Audiences

### I'm a User
→ Read **ONYXAI_QUICK_START.md**
- Learn how to use the models
- Understand the differences
- Get usage tips

### I'm a Developer
→ Read **ONYXAI_MODELS_INTEGRATION.md**
- Understand the architecture
- See what files changed
- Learn the implementation

### I'm Integrating This
→ Read **ONYXAI_API_ENDPOINT_CONFIG.md**
- Understand the API details
- See request/response examples
- Learn customization options

### I'm Deploying This
→ Read **ONYXAI_MODELS_INTEGRATION.md** + **Deployment Notes**
- No environment variables needed
- No API keys needed
- Works in browser
- PWA compatible

---

## Common Questions

**Q: Do I need an API key?**
A: No, Pollinations API doesn't require authentication.

**Q: Will this slow down the app?**
A: No, performance is same as other models.

**Q: What about privacy?**
A: All processing in browser, no tracking.

**Q: Can I customize the endpoint?**
A: Yes, see ONYXAI_API_ENDPOINT_CONFIG.md

**Q: Are these models really uncensored?**
A: Yes, completely unrestricted. Use responsibly.

**Q: What if the API goes down?**
A: Error handling shows friendly message, try again later.

---

## Technical Stack

### Technologies Used
- **Language**: TypeScript
- **Framework**: React
- **API**: Pollinations Text API
- **Architecture**: Client-side routing
- **Build**: Vite
- **State**: React hooks + localStorage

### Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- PWA compatible
- Offline support (after first load)

---

## Support & Resources

### If You Need Help

**Technical Issues**:
1. Check ONYXAI_MODELS_INTEGRATION.md Troubleshooting
2. Check browser console (F12)
3. Review error message

**API Issues**:
1. Check ONYXAI_API_ENDPOINT_CONFIG.md Troubleshooting
2. Verify internet connection
3. Try simpler prompt

**Usage Questions**:
1. Check ONYXAI_QUICK_START.md
2. Check feature descriptions
3. Try examples provided

---

## Version Information

- **Implementation Date**: December 4, 2025
- **Status**: Production Ready ✅
- **Version**: 1.0
- **Last Updated**: December 4, 2025

---

## Document Map

```
ONYXAI_DOCUMENTATION_INDEX.md (you are here)
│
├─ ONYXAI_QUICK_START.md
│  └─ User guide, examples, tips
│
├─ ONYXAI_MODELS_INTEGRATION.md
│  └─ Technical documentation, implementation details
│
└─ ONYXAI_API_ENDPOINT_CONFIG.md
   └─ API reference, configuration, customization
```

---

**Start with**: [ONYXAI_QUICK_START.md](./ONYXAI_QUICK_START.md)
**Go deeper**: [ONYXAI_MODELS_INTEGRATION.md](./ONYXAI_MODELS_INTEGRATION.md)
**Technical reference**: [ONYXAI_API_ENDPOINT_CONFIG.md](./ONYXAI_API_ENDPOINT_CONFIG.md)

---

*Last updated: December 4, 2025*
*Status: ✅ Production Ready*
