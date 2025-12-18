# 🤖 OnyxGPT Bot System

A comprehensive multi-bot system for OnyxGPT that enables users to create, discover, and use custom AI bots with isolated chat sessions.

## 📚 Documentation Index

Start here and follow the links based on your role:

### For Users 👤
**Want to use bots?** Start with:
- [Quick Start Guide](./BOT_QUICK_START.md) - Create and use your first bot in 5 minutes

### For Developers 👨‍💻
**Want to understand the code?** Read in order:
1. [System Summary](./BOT_SYSTEM_SUMMARY.md) - 2-minute overview
2. [System Architecture](./BOT_SYSTEM.md) - Deep dive into design
3. [Architecture Diagrams](./BOT_ARCHITECTURE_DIAGRAM.md) - Visual representations
4. [Code Examples](./BOT_CODE_EXAMPLES.md) - Real code patterns

### For DevOps/Deployment 🚀
**Want to deploy?** Follow:
1. [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md) - Complete setup guide
2. [Implementation Index](./BOT_IMPLEMENTATION_INDEX.md) - What was built

## 🎯 What's Included

### Routes
```
/bots                 → Bot Gallery (discover bots)
/bot/create          → Bot Creator (create new bot)
/bot/{uuid}          → Bot Launcher (use bot in chat)
```

### Features
- ✅ Create custom AI bots with system prompts
- ✅ Discover public bots in a searchable gallery
- ✅ Chat with bots in isolated sessions
- ✅ Upload custom bot avatars
- ✅ Set visibility (private, unlisted, public)
- ✅ Track bot usage statistics
- ✅ Full security with RLS policies

### Components
- `BotCard.tsx` - Bot display card
- `BotCreator.tsx` - Bot creation form
- `BotLauncher.tsx` - Bot chat interface
- `BotsGallery.tsx` - Bot discovery page

### Services
- `botService.ts` - Complete API layer (10 functions)
- `useBot.ts` - React hook wrapper

### Database
- `bots` table - Bot configurations (10 fields)
- `bot_chats` table - Usage tracking
- 8 RLS security policies

## 🚀 Quick Start (5 minutes)

### 1. Create Your First Bot
1. Click 🤖 button in header
2. Click "Create Bot"
3. Fill in the form
4. Click "Create Bot"
5. Start chatting!

### 2. Discover Bots
1. Click 🤖 button in header
2. Browse the gallery
3. Search or filter by category
4. Click a bot to use it

### 3. Deploy
1. Run Supabase migrations
2. Create storage bucket
3. Test bot creation
4. Done!

## 📂 File Structure

```
src/
├── pages/
│   ├── BotsGallery.tsx      # /bots route
│   ├── BotCreator.tsx       # /bot/create route
│   └── BotLauncher.tsx      # /bot/{uuid} route
├── components/
│   └── BotCard.tsx          # Bot gallery card
├── services/
│   └── botService.ts        # API layer
├── hooks/
│   └── useBot.ts            # React hook
└── types/
    └── chat.ts              # Interfaces

supabase/migrations/
├── 20251218_create_bots_table.sql
└── 20251218_create_increment_bot_usage_function.sql
```

## 🔧 Setup Checklist

### Before First Deploy
- [ ] Run Supabase migrations
- [ ] Create `bot-avatars` storage bucket
- [ ] Verify RLS policies

### Before Going Live
- [ ] Test bot creation
- [ ] Test bot discovery
- [ ] Test bot usage
- [ ] Test permissions

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) for detailed steps.

## 🏗️ Architecture Overview

### Routes
```
/bots (Gallery)
  ├─ Search & filter
  ├─ Public + user bots
  └─ Click → /bot/{uuid}

/bot/create (Creator)
  ├─ Upload avatar
  ├─ Write system prompt
  └─ Create bot

/bot/{uuid} (Launcher)
  ├─ Load bot config
  ├─ Create chat session
  ├─ Inject system prompt
  └─ Chat with bot
```

### Database
```
bots
├─ uuid (unique identifier)
├─ creator_id (owner)
├─ name, description, category
├─ system_prompt (behavior)
├─ visibility (private/unlisted/public)
└─ usage_count (statistics)

bot_chats
├─ bot_uuid (foreign key)
├─ chat_id (which chat)
├─ user_id (who used it)
└─ bot_config (snapshot)
```

## 🔐 Security

- **RLS Policies**: Enforced at database level
- **Access Control**: Private/unlisted/public tiers
- **Creator-only**: Only creator can edit/delete
- **User Validation**: All operations verify user_id
- **File Validation**: Avatar uploads validated

## 📊 Usage Example

### Create a Bot
```typescript
const bot = await botService.createBot({
  name: 'Code Assistant',
  description: 'Helps with programming',
  category: 'coding',
  systemPrompt: 'You are a Python expert...',
  visibility: 'public',
  capabilities: {
    memory: true,
    files: true,
    tools: []
  }
}, userId, avatarFile);
```

### Use a Bot
```typescript
// Load bot
const bot = await botService.fetchBotByUuid(uuid, userId);

// Inject system prompt
const messages = [
  { role: 'system', content: bot.system_prompt },
  { role: 'user', content: 'Hello' }
];

// Send to model
const response = await puter.ai.chat(messages);
```

### Discover Bots
```typescript
// Get public bots
const bots = await botService.fetchBots(userId);

// Search
const results = await botService.searchBots('code', userId);

// Filter by category
const codingBots = await botService.fetchBots(userId, 'coding');
```

## 🎓 Key Concepts

### System Prompt is King 👑
The bot's behavior is entirely defined by its `system_prompt`. Everything else (avatar, name, category) is metadata.

### Same Engine, Different Rules
Uses the same chat engine as `/chat`, but with:
- Different system prompt (from bot config)
- Isolated chat sessions
- Cannot switch bots mid-conversation

### UUID is the Identity
The UUID is the only unique identifier. It's used to:
- Load bot configuration
- Record usage
- Control access via RLS

### Usage Tracked Automatically
Every time a chat is created with a bot:
1. `bot_chats` record is created
2. `usage_count` is incremented
3. Bot config is snapshotted

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Bot not in gallery | Check visibility = 'public' |
| Cannot create bot | Check name & system_prompt filled |
| Cannot see bot | Check visibility & permissions |
| Avatar not uploading | Check file < 5MB, PNG/JPG |
| System prompt not applied | Refresh page, reload bot |

See [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md#-troubleshooting) for more.

## 📈 Metrics to Track

After deployment, monitor:
- Bot creation rate
- Gallery views
- Bot usage frequency
- Average chats per bot
- Error rates

## 🔮 Future Enhancements

- Bot rating system
- Featured bots section
- Bot versioning
- Bot marketplace
- Advanced analytics
- Per-bot model selection
- Bot collaboration

See [BOT_SYSTEM.md](./BOT_SYSTEM.md#-future-enhancements) for details.

## 💡 Tips & Tricks

### Best Bot System Prompts
```
// Tutor Bot
"You are a patient tutor. Explain concepts step-by-step. 
 Use examples. Encourage questions."

// Code Bot
"You are a code expert. Provide clean code. 
 Explain solutions. Follow best practices."

// Writing Coach
"You are a writing coach. Help develop stories. 
 Suggest improvements. Ask clarifying questions."
```

### Categories to Use
- general
- coding
- writing
- research
- creative
- tutoring
- business

## 🤝 Contributing

The bot system is designed to be extensible. Consider adding:
1. Per-bot tool configuration
2. Per-bot model selection
3. Bot versioning
4. Usage analytics dashboard
5. Bot marketplace

## 📞 Support

### Documentation
- [Quick Start](./BOT_QUICK_START.md) - User guide
- [System Architecture](./BOT_SYSTEM.md) - Technical details
- [Code Examples](./BOT_CODE_EXAMPLES.md) - Implementation patterns

### Key Files
- Service: `src/services/botService.ts`
- Components: `src/pages/BotLauncher.tsx`
- Types: `src/types/chat.ts`

## ✅ Implementation Status

- [x] Database schema & migrations
- [x] API service layer
- [x] React components
- [x] Routing
- [x] Authentication
- [x] File uploads
- [x] Documentation (1,900+ lines)
- [ ] Migrations run *(manual)*
- [ ] Storage bucket created *(manual)*
- [ ] Testing *(pending)*
- [ ] Deployment *(pending)*

## 📜 License

Same as OnyxGPT main project.

---

## Navigation

- **For Setup:** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
- **For Architecture:** [BOT_SYSTEM.md](./BOT_SYSTEM.md)
- **For Code:** [BOT_CODE_EXAMPLES.md](./BOT_CODE_EXAMPLES.md)
- **For Users:** [BOT_QUICK_START.md](./BOT_QUICK_START.md)

**Ready to deploy?** Follow the [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) 🚀
