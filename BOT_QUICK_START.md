# Bot System - Quick Start Guide

## What Are Bots?

Bots are AI personalities with custom configurations. Each bot has:
- **UUID**: Unique identifier
- **System Prompt**: Custom behavior definition
- **Profile Picture**: Avatar for the gallery
- **Capabilities**: Memory, files, tools
- **Visibility**: Private, unlisted, or public
- **Creator**: User who owns the bot

## User Journey

### For Creating a Bot

1. **Click Bot Icon** in header (🤖) → goes to `/bots`
2. **Click "Create Bot"** button
3. **Fill in the form:**
   - Name (e.g., "Code Assistant")
   - Description (what it does)
   - Category (general, coding, writing, etc.)
   - System Prompt (how it behaves)
   - Avatar (optional image upload)
   - Visibility (private/unlisted/public)
   - Capabilities (toggle memory, files)
4. **Click "Create Bot"**
5. **Auto-redirects to /bot/{uuid}** with new chat ready
6. **Start chatting!**

### For Discovering Bots

1. **Click Bot Icon** in header (🤖) → goes to `/bots`
2. **Browse gallery:**
   - See bot cards with avatar, name, description
   - Filter by category (coding, writing, research, etc.)
   - Search by name or description
3. **Click any bot card** → goes to `/bot/{uuid}`
4. **Click "Start a new chat"** to chat with that bot
5. **Sidebar shows all chats** with this bot
6. **Click "Back to Gallery"** to switch bots

### Using a Bot

- **System Prompt Injected**: Every message uses the bot's custom system prompt
- **Same Features**: Web search, memory, tools work if enabled
- **Chat Navigation**: Sidebar shows all chats with this bot
- **Cannot Switch Bots**: Would need to go back to `/bots` and select different bot
- **Each Bot Has Own Chats**: Creates separate chat threads per bot

## Technical Architecture

```
Entry Point: Header Button (🤖)
     ↓
   /bots (Gallery)
     ├─ Search & filter
     ├─ View public + your bots
     └─ Click bot → /bot/{uuid}
         ├─ Load bot config
         ├─ Create/select chat
         └─ Inject system prompt into every message
```

## File Locations

| File | Purpose |
|------|---------|
| `src/pages/BotsGallery.tsx` | Bot discovery & search |
| `src/pages/BotCreator.tsx` | Create/edit bot form |
| `src/pages/BotLauncher.tsx` | Chat with bot |
| `src/components/BotCard.tsx` | Gallery card component |
| `src/services/botService.ts` | API layer |
| `src/hooks/useBot.ts` | Bot operations hook |
| `src/types/chat.ts` | Bot types (Bot, BotConfig) |

## Database

**bots table:** Stores bot configurations
- UUID (primary key)
- creator_id (owner)
- name, description, category
- pfp_url (avatar)
- system_prompt (the behavior)
- visibility (private/unlisted/public)
- capabilities (memory, files, tools)
- usage_count

**bot_chats table:** Tracks bot usage
- bot_uuid → which bot
- chat_id → which chat
- user_id → who used it
- bot_config (snapshot of bot config at creation)

## API Endpoints (botService)

```typescript
// Fetch bots
botService.fetchBots(userId?, category?) → Bot[]

// Get single bot
botService.fetchBotByUuid(uuid, userId?) → Bot | null

// Create bot
botService.createBot(config, userId, pfpFile?) → Bot

// Update bot
botService.updateBot(uuid, config, userId, pfpFile?) → Bot

// Delete bot
botService.deleteBot(uuid, userId) → void

// Record bot usage
botService.recordBotUsage(botUuid, chatId, userId, config) → BotChat

// Search bots
botService.searchBots(query, userId?, limit?) → Bot[]

// Get usage stats
botService.getBotStats(uuid) → { usage_count: number }
```

## Security & Permissions

- **Private bots**: Only creator sees
- **Unlisted bots**: Only creator and those with link
- **Public bots**: Visible in gallery to all
- **RLS enforced**: Database policies prevent access violations
- **Creator-only**: Only bot creator can update/delete

## Integration with Main Chat

Same chat engine (`/chat`), but:
- ✅ Same message streaming
- ✅ Same web search
- ✅ Same memory system
- ✅ Same model selection
- ❌ Cannot select different system prompt (locked to bot's)
- ❌ Cannot access other features via sidebar
- ✅ Can still create multiple chats with same bot

## Common Tasks

### Create a Tutoring Bot

```
Name: Math Tutor
Description: Explains math concepts step-by-step
Category: tutoring
System Prompt: "You are an expert math tutor. Break down problems step-by-step. Use examples. Encourage the student to think."
Visibility: public
Capabilities: memory (ON)
```

### Create a Code Assistant

```
Name: Python Expert
Description: Helps with Python coding
Category: coding
System Prompt: "You are a Python expert. Provide clean, readable code. Explain your solutions. Follow PEP 8."
Visibility: private (or public if want to share)
Capabilities: files (ON), memory (ON)
```

### Create a Writing Coach

```
Name: Story Writer
Description: Helps write creative fiction
Category: creative
System Prompt: "You are a creative writing coach. Help users develop stories. Suggest improvements. Ask clarifying questions."
Visibility: unlisted (share via link)
Capabilities: memory (ON)
```

## Sharing Bots

1. Create bot with **visibility: unlisted**
2. Copy URL from address bar: `https://yoursite.com/bot/{uuid}`
3. Share link with others
4. They can use bot but it won't appear in their gallery

## Monitoring Bot Usage

- **usage_count field**: Auto-incremented when chat is created
- **bot_chats table**: Records each use
- **Future feature**: Analytics dashboard showing popularity

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not in gallery | Check visibility = 'public' |
| Cannot create bot | Check name & system_prompt are filled |
| Cannot switch bots | Go back to /bots, select different bot (creates new chat) |
| Avatar not uploading | Check file size < 5MB, PNG/JPG format |
| System prompt not applied | Refresh page, check bot loaded correctly |

## Next Steps

1. ✅ Run migrations (see IMPLEMENTATION_CHECKLIST.md)
2. ✅ Create storage bucket (bot-avatars)
3. ✅ Test bot creation
4. ✅ Test bot discovery
5. ✅ Test using bots in chat
6. 📊 Monitor usage stats
7. 🚀 Announce to users

## Example Bot Prompts

### Code Reviewer
```
You are an experienced code reviewer. When code is shared, analyze it for:
- Code quality and style
- Performance issues
- Security vulnerabilities
- Readability and maintainability
- Suggest concrete improvements
```

### Debate Coach
```
You are a debate coach. Help users prepare arguments and counter-arguments.
- Ask probing questions
- Point out logical fallacies
- Suggest stronger arguments
- Provide evidence and sources
```

### Study Buddy
```
You are a helpful study buddy. Create study guides, quiz questions, and flashcards.
- Summarize complex topics
- Create practice questions
- Test understanding
- Suggest study strategies
```

## Extending Bots

Future enhancements:
- Per-bot tool configuration
- Per-bot model selection
- Versioning (track changes)
- Bot templates/marketplace
- Ratings & reviews
- Sharing with specific users
- Advanced analytics

---

**Ready to create your first bot?**
1. Click the 🤖 icon in the header
2. Click "Create Bot"
3. Fill in the form
4. Start chatting!
