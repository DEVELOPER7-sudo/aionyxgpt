# Bot System - Architecture Diagrams

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        OnyxGPT Application                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Header Component                    │   │
│  │  ┌─────────────────────────────────────────────────┐ │   │
│  │  │ Logo │ Chat  │ Bots (🤖) │ Settings │ User Menu │ │   │
│  │  └──────┬───────┬───────────┬──────────┬───────────┘ │   │
│  └─────────┼───────┼───────────┼──────────┼─────────────┘   │
│            │       │           │          │                  │
│    ┌───────▼───────▼────┬──────▼──────────▼─────────┐        │
│    │                    │                           │        │
│    ▼                    ▼                           ▼        │
│  /chat               /bots                      /settings    │
│ (Main Chat)       (Gallery)                                  │
│    ▲                    │                                    │
│    │                    │                                    │
│    │                    ▼ (click bot)                        │
│    │          ┌──────────────────┐                           │
│    │          │  /bot/{uuid}     │                           │
│    │          │ (Bot Launcher)   │                           │
│    │          └──────────────────┘                           │
│    │                    │                                    │
│    └────────────────────┴────────────────────────────────┐   │
│                                                         │    │
│                    Same Chat Engine                     │    │
│            (Message streaming, Web search, etc)        │    │
│                                                         │    │
└─────────────────────────────────────────────────────────────┘
```

## User Flow Diagrams

### Creating a Bot

```
User at /chat
      ↓
Click 🤖 (Bots button in header)
      ↓
Navigate to /bots (Gallery)
      ↓
Click "Create Bot" button
      ↓
Navigate to /bot/create (Creator form)
      ├─ Fill Name
      ├─ Fill Description
      ├─ Select Category
      ├─ Upload Avatar (optional)
      ├─ Write System Prompt
      ├─ Select Visibility
      ├─ Toggle Capabilities
      └─ Click "Create Bot"
      ↓
Submit form → botService.createBot()
      ↓
Database: INSERT into bots table
      ↓
Generate UUID (auto)
      ↓
Upload avatar to storage (if provided)
      ↓
Navigate to /bot/{uuid} (Auto-redirect)
      ↓
New chat session created
      ↓
Ready to chat with new bot
```

### Discovering and Using a Bot

```
User at /chat
      ↓
Click 🤖 (Bots button)
      ↓
/bots (Gallery page)
      ├─ Show public bots
      ├─ Show user's own bots
      └─ Allow search & filtering
      ↓
User searches or filters
      ↓
Click bot card
      ↓
Navigate to /bot/{uuid}
      ↓
BotLauncher loads bot config by UUID
      ├─ Fetch from database
      ├─ Check visibility + permissions
      └─ Load system_prompt & capabilities
      ↓
Create/select chat session
      ↓
User sends message
      ↓
System prompt injected:
  [SYSTEM: {bot.system_prompt}]
  [USER: {user message}]
      ↓
Send to AI model
      ↓
Receive response
      ↓
Display in chat
```

## Data Flow - Message Sending

```
┌──────────────────────────────────────────────────────────┐
│ User Types Message in /bot/{uuid} chat interface         │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ handleSendMessage()   │
         │ (BotLauncher.tsx)     │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────────┐
         │ Add to chat messages      │
         │ Save to localStorage      │
         └───────────┬───────────────┘
                     │
                     ▼
         ┌─────────────────────────────────────┐
         │ handleBotChat(messages, chatId)     │
         │ (BotLauncher.tsx)                   │
         └───────────┬─────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────────────────────┐
         │ Build message array:                         │
         │ [{                                           │
         │   role: "system",                            │
         │   content: bot.system_prompt ← KEY PART!    │
         │ },                                           │
         │ {                                            │
         │   role: "user",                              │
         │   content: "user message"                    │
         │ }]                                           │
         └───────────┬─────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────────────┐
         │ Call puter.ai.chat(messages, {      │
         │   model: 'gpt-5',                   │
         │   stream: true,                     │
         │   temperature: 0.7,                 │
         │   ...                               │
         │ })                                   │
         └───────────┬────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────────┐
         │ Stream response chunks           │
         │ Update UI in real-time          │
         └───────────┬──────────────────────┘
                     │
                     ▼
         ┌──────────────────────────────────┐
         │ Full response received           │
         │ Save to localStorage            │
         │ Update chat state               │
         └──────────────────────────────────┘
```

## Database Schema Diagram

```
┌─────────────────────────────────────┐
│            bots table               │
├─────────────────────────────────────┤
│ uuid UUID (PK)                      │
│ creator_id UUID (FK → auth.users)   │
│ name TEXT                           │
│ description TEXT                    │
│ category TEXT                       │
│ pfp_url TEXT                        │
│ system_prompt TEXT (IMPORTANT!)     │
│ visibility TEXT (enum)              │
│ capabilities JSONB                  │
│   ├─ memory: boolean                │
│   ├─ files: boolean                 │
│   └─ tools: string[]                │
│ created_at TIMESTAMP                │
│ updated_at TIMESTAMP                │
│ usage_count INTEGER                 │
│                                     │
│ Indexes:                            │
│ - creator_id                        │
│ - visibility                        │
│ - category                          │
│ - created_at DESC                   │
│                                     │
│ RLS Policies:                       │
│ - Public bots visible to all        │
│ - User can see own bots             │
│ - Creator-only updates/deletes      │
└──────────────────┬──────────────────┘
                   │
                   │ 1:N
                   │
┌──────────────────▼──────────────────┐
│       bot_chats table               │
├─────────────────────────────────────┤
│ id UUID (PK)                        │
│ bot_uuid UUID (FK → bots)           │
│ chat_id TEXT                        │
│ user_id UUID (FK → auth.users)      │
│ bot_config JSONB (snapshot)         │
│ created_at TIMESTAMP                │
│                                     │
│ Indexes:                            │
│ - bot_uuid                          │
│ - user_id                           │
│ - chat_id                           │
│                                     │
│ RLS Policies:                       │
│ - User sees own bot_chats           │
└─────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── ProtectedRoute
│   ├── BrowserRouter
│   │   ├── /                     → Landing
│   │   ├── /auth                 → Auth
│   │   ├── /chat                 → ChatApp
│   │   │
│   │   ├── /bots                 → BotsGallery ←─ BOT SYSTEM
│   │   │   ├── Header
│   │   │   ├── SearchBar
│   │   │   ├── CategoryFilter
│   │   │   └── Grid
│   │   │       └── BotCard (multiple)
│   │   │           ├── Avatar
│   │   │           ├── Name
│   │   │           ├── Description
│   │   │           └── Stats
│   │   │
│   │   ├── /bot/create           → BotCreator ←─ BOT SYSTEM
│   │   │   ├── Header
│   │   │   ├── AvatarUpload
│   │   │   ├── NameField
│   │   │   ├── DescriptionField
│   │   │   ├── CategorySelect
│   │   │   ├── SystemPromptEditor
│   │   │   ├── CapabilitiesToggles
│   │   │   ├── VisibilitySelect
│   │   │   └── SubmitButton
│   │   │
│   │   └── /bot/:uuid            → BotLauncher ←─ BOT SYSTEM
│   │       ├── Header (with bot info)
│   │       ├── ChatSidebar (no navigation features)
│   │       │   ├── NewChatButton
│   │       │   └── ChatList
│   │       └── ChatArea
│   │           ├── MessageList
│   │           └── MessageInput
```

## Visibility & Permission Model

```
┌────────────────────────────────────────────────┐
│ Bot Visibility & Access Control                │
├────────────────────────────────────────────────┤
│                                                │
│ PRIVATE                                        │
│ └─ Only creator can see                        │
│    └─ Can only be accessed via direct link     │
│    └─ Does not appear in gallery               │
│                                                │
│ UNLISTED                                       │
│ └─ Appears in gallery ONLY for creator        │
│ └─ Others need direct link: /bot/{uuid}       │
│ └─ Link can be shared with others              │
│ └─ Others can use but won't see in gallery    │
│                                                │
│ PUBLIC                                         │
│ └─ Appears in gallery for all users            │
│ └─ Anyone can discover and use                 │
│ └─ Shows in search results                     │
│ └─ Shows usage count                           │
│                                                │
├────────────────────────────────────────────────┤
│ Access Control Matrix (RLS Enforced)           │
├─────────────────────┬──────┬─────┬──────────┤
│ Action              │Owner │Other│Guest     │
├─────────────────────┼──────┼─────┼──────────┤
│ View Private Bot    │ ✅   │ ❌  │ ❌       │
│ View Unlisted Bot   │ ✅   │ ✅* │ ❌       │
│ View Public Bot     │ ✅   │ ✅  │ ✅       │
│ Use Private Bot     │ ✅   │ ❌  │ ❌       │
│ Use Unlisted Bot    │ ✅   │ ✅* │ ❌       │
│ Use Public Bot      │ ✅   │ ✅  │ ✅       │
│ Edit Bot            │ ✅   │ ❌  │ ❌       │
│ Delete Bot          │ ✅   │ ❌  │ ❌       │
└─────────────────────┴──────┴─────┴──────────┘
* Only with direct link
```

## System Prompt Injection

```
User Message
     │
     ▼
┌──────────────────────────────────────┐
│ Format message array:                │
├──────────────────────────────────────┤
│ [                                    │
│   {                                  │
│     role: "system",                  │
│     content: bot.system_prompt    ◄──┼─ FROM DATABASE
│                    "You are a code  │
│                     assistant that  │
│                     helps with..."  │
│   },                                 │
│   {                                  │
│     role: "user",                    │
│     content: "How do I reverse a str"│
│   }                                  │
│ ]                                    │
└──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ Send to AI Model                     │
│ (Same for all bots, just different   │
│  system prompts)                     │
└──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────┐
│ Model responds with bot's behavior   │
│ (Determined by system_prompt)        │
└──────────────────────────────────────┘
```

## File Organization

```
src/
├── App.tsx
│   └─ Routes: /bots, /bot/create, /bot/:uuid
│
├── pages/
│   ├── BotsGallery.tsx
│   │   ├─ Fetches bots (public + user's)
│   │   ├─ Search & filtering
│   │   └─ Displays BotCard grid
│   │
│   ├── BotCreator.tsx
│   │   ├─ Form for creating/editing
│   │   ├─ Avatar upload
│   │   └─ Calls botService.createBot()
│   │
│   └── BotLauncher.tsx
│       ├─ Loads bot by UUID
│       ├─ Manages chat state
│       ├─ Injects system prompt
│       └─ Same chat engine as /chat
│
├── components/
│   ├── BotCard.tsx
│   │   └─ Displays bot in gallery
│   │
│   └── Header.tsx
│       └─ Added 🤖 button → /bots
│
├── services/
│   └── botService.ts
│       ├─ fetchBots()
│       ├─ fetchBotByUuid()
│       ├─ createBot()
│       ├─ updateBot()
│       ├─ deleteBot()
│       ├─ recordBotUsage()
│       ├─ searchBots()
│       └─ getBotStats()
│
├── hooks/
│   └── useBot.ts
│       └─ Wrapper around botService
│
└── types/
    └── chat.ts
        ├─ Bot interface
        ├─ BotConfig interface
        └─ BotChat interface
```

---

**Key Insight:** The system uses a single chat engine (same as /chat) but injects different system prompts from the database for each bot. No bot explosion, just configuration management.
