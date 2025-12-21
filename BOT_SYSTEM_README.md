# 🤖 Bot System - Complete Implementation

## Quick Start (5 Minutes)

Getting the "Could not find the table 'public.bots'" error? 

**→ See `BOT_SETUP_INSTRUCTIONS.md`**

---

## What is the Bot System?

Create custom AI bots with your own system prompts, models, and settings. Each bot can:
- Run with any AI model (GPT, Claude, custom, etc.)
- Be public (everyone sees), private (only you), or unlisted (link-only)
- Have a profile picture
- Track usage statistics
- Run independent chat sessions

---

## Features

### ✅ Core Features
- Create/edit/delete bots
- Select from 6+ AI models or use custom model IDs
- Upload bot avatars
- Categorize bots
- Control visibility (public/private/unlisted)
- Launch bot-specific chat sessions

### ✅ Advanced Features
- Bot usage tracking
- Bot search and filtering by category
- Creator attribution with random usernames
- Memory and file upload capabilities
- Full mobile support
- Theme color integration

### ✅ Security
- Row-level security (RLS) policies
- Creator-only edit/delete permissions
- Public bots viewable by everyone
- Private bots only visible to creator

---

## Getting Started

### Step 1: Setup Database (Required)

1. Go to your **Supabase Dashboard**
2. Open **SQL Editor**
3. Click **New Query**
4. Copy ALL contents from **`SETUP_BOTS_TABLE.sql`**
5. Paste into the editor
6. Click **Run**
7. Wait for success message ✅

### Step 2: Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name it: `bot-avatars`
4. Toggle **Public** ON
5. Create bucket ✅

### Step 3: Test

1. Go to `/bots` in your app
2. Click **Create Bot**
3. Fill in: Name, System Prompt, Model
4. Click **Create**
5. Should create successfully! ✅

---

## Usage Examples

### Create a Coding Bot
```
Name: Code Assistant
Category: Coding
System Prompt: You are an expert Python developer. Help users write clean, efficient code.
Model: Claude Sonnet
Visibility: Public
```

### Create a Writing Bot
```
Name: Creative Writer
Category: Writing
System Prompt: You are a professional creative writer. Help users craft engaging stories and content.
Model: GPT-4o
Visibility: Public
```

### Create a Custom Model Bot
```
Name: OpenRouter Bot
Model: Custom Model
Custom Model ID: openrouter:anthropic/claude-3-opus
System Prompt: Your custom prompt here
Visibility: Private
```

---

## API/Database Info

### Bots Table Structure
```sql
CREATE TABLE bots (
  uuid UUID PRIMARY KEY,
  creator_id UUID NOT NULL,        -- User who created
  creator_username TEXT,            -- Random name
  name TEXT NOT NULL,               -- Bot name
  description TEXT,                 -- Optional description
  category TEXT,                    -- Category (coding, writing, etc.)
  pfp_url TEXT,                     -- Avatar URL
  system_prompt TEXT NOT NULL,      -- How bot behaves
  model_id TEXT NOT NULL,           -- AI model to use
  visibility TEXT,                  -- private/unlisted/public
  capabilities JSONB,               -- memory, files, tools
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  usage_count INTEGER               -- Times used
);
```

### RLS Policies
- **Public bots**: Anyone can view
- **Own bots**: Only creator can view
- **Create**: Logged-in users only
- **Edit/Delete**: Owner only

---

## File Overview

### Core Files
| File | Purpose |
|------|---------|
| `src/pages/BotsGallery.tsx` | View all bots |
| `src/pages/BotCreator.tsx` | Create/edit bots |
| `src/pages/BotLauncher.tsx` | Chat with bot |
| `src/components/BotCard.tsx` | Bot display card |
| `src/services/botService.ts` | API layer |

### Database
| File | Purpose |
|------|---------|
| `SETUP_BOTS_TABLE.sql` | Complete SQL setup |
| `supabase/migrations/20251218_create_bots_table.sql` | Table migration |

### Documentation
| File | Read When |
|------|-----------|
| `BOT_SETUP_INSTRUCTIONS.md` | Setting up for first time |
| `SUPABASE_SETUP_GUIDE.md` | Need detailed setup steps |
| `BOT_SYSTEM_CHECKLIST.md` | Testing the system |
| `BOT_ERROR_FIXES_ACTUAL.md` | Understanding technical details |
| `QUICK_FIX_REFERENCE.md` | Need quick error reference |

---

## Routes

| Route | Purpose |
|-------|---------|
| `/bots` | Bot gallery (view all) |
| `/bot/create` | Create new bot |
| `/bot/:uuid` | Launch bot chat |
| `/bot/:uuid/edit` | Edit existing bot |

---

## Troubleshooting

### "Table 'public.bots' not found"
→ Run `SETUP_BOTS_TABLE.sql` in Supabase SQL Editor

### "RLS Policy Error"
→ Make sure all policies were created (check Supabase Dashboard)

### "Can't upload avatar"
→ Verify `bot-avatars` bucket exists and is PUBLIC

### "Can't see my bot"
→ Check visibility setting and make sure you're logged in

### "Bot chat not working"
→ Check that model_id is valid for your AI provider

**For more troubleshooting:** See `SUPABASE_SETUP_GUIDE.md`

---

## Testing

Complete testing checklist available in `BOT_SYSTEM_CHECKLIST.md` covering:
- ✅ Bot creation
- ✅ Bot editing
- ✅ Bot deletion
- ✅ Visibility control
- ✅ Custom models
- ✅ Mobile responsiveness
- ✅ Error handling
- ✅ Database verification

---

## Key Technical Decisions

### Error Handling
- Empty optional fields → NULL (not empty strings)
- All text fields trimmed of whitespace
- Detailed error messages passed to UI
- Console logging for debugging

### Security
- RLS policies handle access control
- No client-side visibility filtering
- Creator-only edit/delete enforced at database level

### Performance
- Indexed lookups on creator_id, visibility, category
- Timestamps for sorting
- Usage count for popularity

### Architecture
- Modular service layer (botService)
- Type-safe interfaces
- Separate pages for each feature
- Reusable BotCard component

---

## Models Supported

### Predefined Models
- GPT-5
- GPT-4o
- Claude Sonnet 4.5
- Gemini 2.5 Pro
- DeepSeek R1
- Grok 3

### Custom Models
Enter any model ID supported by your provider:
- `openrouter:anthropic/claude-3-opus`
- `together:meta-llama/Llama-2-7b`
- Any proprietary model ID

---

## Build & Deployment

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

Build status: ✅ All checks passing

---

## What Changed Recently

### Fixed Errors
1. ✅ Failed to create bot (null handling)
2. ✅ Failed to fetch bots (RLS policies)
3. ✅ Failed to update bot (partial updates)
4. ✅ Theme not applying (useTheme hook)
5. ✅ Guest user prevention (form validation)
6. ✅ Mobile bots button (visibility)

### Added Features
- ✅ Custom model ID input
- ✅ Edit button in bot cards
- ✅ Better error messages
- ✅ Debug logging
- ✅ Theme integration

---

## Support & Documentation

**Just started?** → `BOT_SETUP_INSTRUCTIONS.md`  
**Setting up?** → `SUPABASE_SETUP_GUIDE.md`  
**Testing?** → `BOT_SYSTEM_CHECKLIST.md`  
**Need details?** → `BOT_ERROR_FIXES_ACTUAL.md`  
**Quick reference?** → `QUICK_FIX_REFERENCE.md`  
**Complete overview?** → `BOT_SYSTEM_COMPLETE.md`

---

## Status

🟢 **Complete & Ready**

- All features implemented
- All errors fixed
- Full documentation provided
- Testing checklist included
- Ready for production

Deploy with confidence! 🚀
