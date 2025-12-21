-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_username TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  pfp_url TEXT,
  system_prompt TEXT NOT NULL,
  model_id TEXT NOT NULL DEFAULT 'gpt-5',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  capabilities JSONB DEFAULT '{"memory": false, "files": false, "tools": []}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

-- Create index for faster lookups
CREATE INDEX idx_bots_creator_id ON bots(creator_id);
CREATE INDEX idx_bots_visibility ON bots(visibility);
CREATE INDEX idx_bots_category ON bots(category);
CREATE INDEX idx_bots_created_at ON bots(created_at DESC);

-- Create bot_chats junction table to track bot usage in chats
CREATE TABLE IF NOT EXISTS bot_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_uuid UUID NOT NULL REFERENCES bots(uuid) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_config JSONB NOT NULL, -- Snapshot of bot config at chat creation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bot_chats
CREATE INDEX idx_bot_chats_bot_uuid ON bot_chats(bot_uuid);
CREATE INDEX idx_bot_chats_user_id ON bot_chats(user_id);
CREATE INDEX idx_bot_chats_chat_id ON bot_chats(chat_id);

-- Enable RLS
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bots
-- Public bots viewable by everyone (including guests)
CREATE POLICY "Users can view public bots"
  ON bots FOR SELECT
  USING (visibility = 'public');

-- Users can view their own bots (private, unlisted, public)
CREATE POLICY "Users can view their own bots"
  ON bots FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can create bots"
  ON bots FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own bots"
  ON bots FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own bots"
  ON bots FOR DELETE
  USING (creator_id = auth.uid());

-- RLS Policies for bot_chats
CREATE POLICY "Users can view their own bot_chats"
  ON bot_chats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bot_chats"
  ON bot_chats FOR INSERT
  WITH CHECK (user_id = auth.uid());
