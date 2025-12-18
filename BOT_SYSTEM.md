# Bot System Implementation Guide

## Overview

The bot system enables users to create, discover, and use AI bots with custom configurations. Each bot is identified by a UUID and controlled by a unified chat engine with bot-specific constraints.

### Architecture

```
/bots                    → Gallery (Read-heavy discovery)
  ├─ Search by name/description
  ├─ Filter by category
  ├─ Display public + user-owned bots
  └─ Each card links to /bot/{uuid}

/bot/create              → Bot creation form
  ├─ Name, description, category
  ├─ Avatar upload
  ├─ System prompt editor
  └─ Capability toggles (memory, files, tools)

/bot/{uuid}              → Launcher & Chat Engine
  ├─ Load bot config by UUID
  ├─ Initialize chat session
  ├─ Apply bot's system prompt + capabilities
  ├─ Sidebar for chat navigation (no bot switching)
  └─ Same chat engine as main /chat route

Database                 → Bot records
  ├─ bots table (UUID, config, visibility)
  ├─ bot_chats table (snapshots at creation)
  └─ Usage tracking
```

## Database Schema

### bots table
```sql
uuid UUID PRIMARY KEY
creator_id UUID (owner)
name TEXT
description TEXT
category TEXT
pfp_url TEXT (avatar)
system_prompt TEXT (behavior definition)
visibility TEXT ('private', 'unlisted', 'public')
capabilities JSONB {
  memory: boolean,
  files: boolean,
  tools: string[]
}
created_at TIMESTAMP
updated_at TIMESTAMP
usage_count INTEGER
```

### bot_chats table
```sql
id UUID PRIMARY KEY
bot_uuid UUID (FK to bots)
chat_id TEXT (FK to chats)
user_id UUID (FK to users)
bot_config JSONB (snapshot of bot at creation)
created_at TIMESTAMP
```

## File Structure

```
src/
├── pages/
│   ├── BotsGallery.tsx       # Gallery route (/bots)
│   ├── BotCreator.tsx        # Creator form (/bot/create)
│   └── BotLauncher.tsx       # Launcher & chat (/bot/{uuid})
├── components/
│   └── BotCard.tsx           # Bot display card
├── services/
│   └── botService.ts         # API service layer
├── hooks/
│   └── useBot.ts             # Bot operations hook
├── types/
│   └── chat.ts               # Bot, BotConfig, BotChat types
└── supabase/migrations/
    ├── 20251218_create_bots_table.sql
    └── 20251218_create_increment_bot_usage_function.sql
```

## Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/bots` | BotsGallery | Browse and search bots |
| `/bot/create` | BotCreator | Create new bot |
| `/bot/:uuid` | BotLauncher | Use bot in chat |

## Key Features

### 1. Bot Gallery (`/bots`)
- **Read-heavy discovery page**
- Search bots by name/description
- Filter by category
- Display public + user-owned bots
- Show usage count and creation date
- Link to `/bot/{uuid}` on click

### 2. Bot Launcher (`/bot/{uuid}`)
- **Single chat engine, bot-specific config**
- Load bot config by UUID
- Check visibility + permissions
- Create chat session
- Inject bot's system prompt
- Sidebar for chat navigation
- **Cannot switch bots** mid-conversation
- Same UI as main ChatApp, just bot-constrained

### 3. Bot Creator (`/bot/create`)
- **Configuration profile builder**
- Upload avatar
- Name, description, category
- System prompt editor
- Toggle capabilities (memory, files)
- Set visibility (private/unlisted/public)

## API Service (botService.ts)

```typescript
// Fetch public bots + user's own
fetchBots(userId?: string, category?: string): Promise<Bot[]>

// Get single bot by UUID
fetchBotByUuid(uuid: string, userId?: string): Promise<Bot | null>

// Create new bot
createBot(config: BotConfig, userId: string, pfpFile?: File): Promise<Bot>

// Update existing bot
updateBot(uuid: string, config: Partial<BotConfig>, userId: string, pfpFile?: File): Promise<Bot>

// Delete bot
deleteBot(uuid: string, userId: string): Promise<void>

// Record bot usage in a chat
recordBotUsage(botUuid: string, chatId: string, userId: string, botConfig: Partial<Bot>): Promise<BotChat>

// Get bot by chat ID
getBotByChat(chatId: string, userId: string): Promise<Bot | null>

// Increment usage count
incrementUsageCount(uuid: string): Promise<void>

// Get bot stats
getBotStats(uuid: string): Promise<{ usage_count: number } | null>

// Search bots
searchBots(query: string, userId?: string, limit?: number): Promise<Bot[]>
```

## Usage Flow

### Creating a Bot
1. User navigates to `/bot/create`
2. Fills in bot configuration (name, prompt, capabilities)
3. Submits form
4. botService.createBot() stores in database
5. Redirects to `/bot/{uuid}`
6. New chat initialized

### Discovering Bots
1. User navigates to `/bots`
2. BotsGallery fetches public bots + user-owned
3. Can search by name/description
4. Can filter by category
5. Click bot card → navigate to `/bot/{uuid}`

### Using a Bot
1. User at `/bot/{uuid}`
2. BotLauncher loads bot config
3. Creates new chat session
4. Injects bot's system_prompt into every request
5. Applies capability restrictions
6. Chat behaves like normal ChatApp but with bot rules
7. Cannot switch bots (would require new /bot/{uuid2})

## System Prompt Injection

In BotLauncher.tsx, when sending messages:

```typescript
const finalSystemPrompt = bot.system_prompt;

const formattedMessages = [
  { role: 'system', content: finalSystemPrompt },
  ...baseMessages,
];

const response = await puter.ai.chat(formattedMessages, {
  model: 'gpt-5',
  stream: true,
  // Bot's capabilities restrict tools/memory/files
  ...
});
```

The bot's system_prompt overrides any default or user-selected prompt for that session.

## Row-Level Security (RLS)

### bots table
- Users can view public bots
- Users can view their own bots
- Only creator can update/delete
- Private bots hidden from others

### bot_chats table
- Users can only view their own chat records
- Records snapshot bot config at creation time

## Capabilities

Each bot can enable/disable:
- **memory**: User memory and context persistence
- **files**: File upload capability
- **tools**: Array of enabled tools (extensible)

These are stored in capabilities JSONB and can be checked when rendering UI in BotLauncher.

## Integration with Main Chat Engine

The main ChatApp (`/chat`) and BotLauncher (`/bot/{uuid}`) use the same:
- Chat message schema
- Streaming logic
- Moderation layer
- Memory handling
- API calls (Puter/OpenRouter)

The **only difference** is:
1. BotLauncher loads system_prompt from bot config
2. BotLauncher applies bot's capability restrictions
3. BotLauncher records usage to bot_chats table

## Visibility & Permissions

- **private**: Only creator sees
- **unlisted**: Only creator and those with link
- **public**: Visible in gallery to all

Enforced by RLS policies on bots table.

## Usage Tracking

- Bot's `usage_count` incremented when chat created
- `bot_chats` table stores chat-bot relationship
- Each record snapshots bot config at time of creation
- Enables analytics on bot adoption

## Next Steps for Enhancement

1. **Sharing**: Allow sharing unlisted bots via link
2. **Versioning**: Track bot config changes over time
3. **Analytics**: Dashboard showing bot performance metrics
4. **Bot Store**: Featured/trending bots section
5. **Forking**: Clone popular bots with modifications
6. **Ratings**: User reviews and ratings for bots
7. **Tools Integration**: Extended tools per bot
8. **Multi-modal**: Bots with vision, image gen, etc.

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| 404 on /bot/{uuid} | Bot doesn't exist or no access | Check UUID, verify visibility |
| "AI service not available" | Puter.js not loaded | Refresh page |
| Cannot create bot | Missing system_prompt | Ensure required fields |
| Bot not in gallery | visibility = 'private' | Change to 'public' |
| Chat stuck loading | API timeout | Check Puter/OpenRouter status |

## Testing

To test the bot system:

```
1. Go to /bots → should show gallery
2. Click "Create Bot" → fill form, submit
3. Should redirect to /bot/{uuid} with new chat
4. Send message → should use bot's system prompt
5. Create another chat in sidebar → shouldn't change bot
6. Go back to /bots → new bot should appear in list
```
