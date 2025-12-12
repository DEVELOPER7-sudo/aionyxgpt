# Web Search Auto-Injection - Backend System Prompt

## Overview

When the **Web Search Toggle** is enabled, the `/websearch` command system prompt is **automatically injected** into the backend system prompt. Users don't see the command, but AI treats every message as if `/websearch` was explicitly called.

## How It Works

### User Perspective
1. User toggles "Web Search" ON
2. User sends ANY message (no `/websearch` command needed)
3. AI responds with properly formatted `<websearch>` block
4. User sees search results with URLs, timeline, and findings

### Backend Perspective
1. User enables toggle → `webSearchEnabled = true`
2. When user sends message → System detects toggle is ON
3. Automatically injects: `generateWebSearchSystemPrompt('research query')`
4. AI receives FULL `/websearch` command instructions
5. AI must follow strict format rules
6. Response wraps in `<websearch>` tags automatically

## Code Changes

### Location 1: handleTextChat (Puter AI)
**File**: `src/pages/ChatApp.tsx` (Line 411)

**Before**:
```tsx
if (webSearchEnabled) {
  finalSystemPrompt += '\n\nNote: You may use web knowledge...';
}
```

**After**:
```tsx
if (webSearchEnabled) {
  // Automatically inject /websearch command system prompt
  const autoWebSearchPrompt = generateWebSearchSystemPrompt('research query');
  finalSystemPrompt += '\n\n' + autoWebSearchPrompt;
}
```

### Location 2: handleOpenRouterChat (OpenRouter)
**File**: `src/pages/ChatApp.tsx` (Line 654)

**Before**:
```tsx
if (webSearchEnabled) {
  const webSearchInstruction = `## 🔍 Web Search URLs Requirement...`;
  finalSystemPrompt += webSearchInstruction;
}
```

**After**:
```tsx
if (webSearchEnabled) {
  // Automatically inject /websearch command system prompt
  const autoWebSearchPrompt = generateWebSearchSystemPrompt('research query');
  finalSystemPrompt += '\n\n' + autoWebSearchPrompt;
}
```

## System Prompt Injected

When toggle is enabled, AI receives the full `/websearch` system prompt:

```
## 🔍 MANDATORY WEB SEARCH FORMAT - STRICT ENFORCEMENT

You are executing a /websearch command for: "research query"

THIS IS NOT OPTIONAL - YOU MUST FOLLOW THIS EXACTLY OR YOUR RESPONSE WILL BE INVALID

### STEP-BY-STEP REQUIREMENTS:

STEP 1: START WITH OPENING TAG
The VERY FIRST character of your response must be:
<websearch>

STEP 2: ADD HEADER
On the second line, add:
## URLs Searched

STEP 3: LIST EVERY SINGLE URL
...

[Full system prompt with all rules and validation checklist]
```

## What This Enables

### Automatic Web Search
- Toggle ON → Every message is web search
- No explicit `/websearch` command needed
- Transparent to user

### Strict Format Enforcement
- AI must respond with `<websearch>` tags
- Must list all URLs accessed
- Must show search process timeline
- Must cite all sources

### Professional Responses
- Formatted with emojis
- Search process table (10-15s)
- Status messages
- Organized sections

## User Experience

### Before (Old Toggle)
```
User: Tell me about quantum computing
AI: Quantum computing is... (optional web search, basic format)
```

### After (Auto-Injection)
```
User: Tell me about quantum computing
AI: <websearch>
    ## 🔍 URLs Searched
    - [Wikipedia](url) - General info
    - [IEEE](url) - Technical details
    ...
    ## 📊 Search Process
    | Stage | Time | Status |
    ...
    ## 📝 Findings
    According to [Wikipedia](url)...
    </websearch>
```

## Comparison: Manual Command vs Toggle

| Feature | `/websearch` Command | Toggle Enabled |
|---------|---------------------|-----------------|
| **Activation** | User types `/websearch` | User toggles switch ON |
| **Visibility** | User sees command | Command hidden in backend |
| **Scope** | Single message | All messages while ON |
| **System Prompt** | Full /websearch instructions | Full /websearch instructions (auto) |
| **Format Enforcement** | Mandatory | Mandatory |
| **Response Quality** | `<websearch>` block | `<websearch>` block |
| **User Effort** | Type command each time | Toggle once, enjoy all responses |

## Technical Implementation

### Auto-Injection Flow

```
User sends message
         ↓
Check: Is webSearchEnabled === true?
         ↓
    YES → Inject generateWebSearchSystemPrompt()
         ↓
System prompt now includes FULL /websearch instructions
         ↓
AI receives system prompt
         ↓
AI must follow strict format rules
         ↓
Response wrapped in <websearch> tags
         ↓
User sees formatted web search response
```

### Code Flow

1. **Message Sent**: User types message and presses send
2. **Check Toggle**: System checks if `webSearchEnabled === true`
3. **Auto-Inject**: If true, calls `generateWebSearchSystemPrompt('research query')`
4. **Inject Prompt**: Adds returned system prompt to final system prompt string
5. **Send to API**: Includes full /websearch system prompt in API call
6. **AI Processes**: AI receives strict format instructions
7. **AI Responds**: AI follows format rules, outputs `<websearch>` block
8. **User Sees**: Professional formatted response with URLs, timeline, findings

## Both AI Providers Supported

### Puter AI (handleTextChat)
- Location: Line 411 in ChatApp.tsx
- Injected into: finalSystemPrompt for Puter.ai.chat
- Works seamlessly with existing Puter integration

### OpenRouter (handleOpenRouterChat)
- Location: Line 654 in ChatApp.tsx
- Injected into: finalSystemPrompt for OpenRouter API
- Works with all OpenRouter supported models

## Validation

When toggle is enabled:
- ✅ Validation function applies full /websearch rules
- ✅ Checks for `<websearch>` tags required
- ✅ Enforces 3+ URLs minimum
- ✅ Detects shortened/fake URLs
- ✅ Validates search process section
- ✅ Requires source citations

## Benefits

1. **Automatic**: No explicit command typing
2. **Consistent**: All responses follow same format
3. **Professional**: Always properly formatted
4. **Transparent**: Users see all sources
5. **Flexible**: Toggle on/off as needed
6. **Seamless**: Works transparently in backend

## Settings Integration

The toggle is located:
- **UI**: Below the prompt box
- **State Variable**: `webSearchEnabled` in ChatApp.tsx
- **Storage**: Saved to browser localStorage via settings
- **Toggle Function**: `onToggleWebSearch()`
- **Persistent**: Remembers user preference

## No User Visibility

The injected system prompt:
- ❌ NOT shown to users
- ❌ NOT displayed in chat
- ❌ NOT visible in UI anywhere
- ✅ Only exists in backend system prompt
- ✅ Only affects AI behavior
- ✅ Users see clean formatted responses

## Example Use Case

### Scenario: User wants automatic web search

1. **Action**: Click toggle "Web Search" → ON
2. **Backend**: System ready to auto-inject
3. **User asks**: "What are latest AI developments?"
4. **System**: Auto-injects /websearch system prompt
5. **AI**: Receives strict format instructions
6. **Response**: 
   ```
   <websearch>
   ## 🔍 URLs Searched
   - [TechCrunch](url) - Latest AI news
   - [OpenAI Blog](url) - Official announcements
   ...
   ## 📊 Search Process
   [Timeline table]
   ## 📝 Findings
   [Research with citations]
   </websearch>
   ```

## Commit Info

**Hash**: `3f7f10d`

**Message**: `feat: Auto-inject /websearch system prompt when toggle is enabled`

**Changes**:
- 10 insertions
- 25 deletions
- Replaces verbose toggle instruction with full /websearch system prompt

## Summary

When Web Search toggle is enabled:
- `/websearch` command system prompt is **automatically injected** in the backend
- Users don't see the command or complex instructions
- Every message treated as web search query
- AI must follow strict `<websearch>` format
- Responses include URLs, timeline, and findings
- Transparent, professional, automatic web search
