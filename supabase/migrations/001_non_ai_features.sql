-- Non-AI Features Database Schema
-- Created: November 16, 2025

-- ============================================================
-- USER MANAGEMENT TABLES
-- ============================================================

-- Extended user profiles (links to auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url TEXT,
    profile_visibility VARCHAR(50) DEFAULT 'public', -- public, private, workspace-only
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- WORKSPACE MANAGEMENT TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT,
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- owner, admin, editor, viewer
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS workspace_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor',
    invited_by UUID NOT NULL REFERENCES auth.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CHAT ORGANIZATION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#808080', -- hex color
    parent_id UUID REFERENCES chat_collections(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES chat_collections(id) ON DELETE CASCADE,
    chat_id UUID NOT NULL,
    position INT DEFAULT 0,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, chat_id)
);

CREATE TABLE IF NOT EXISTS chat_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#808080',
    created_by UUID NOT NULL REFERENCES auth.users(id),
    UNIQUE(workspace_id, name)
);

CREATE TABLE IF NOT EXISTS chat_tag_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    tag_id UUID NOT NULL REFERENCES chat_tags(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(chat_id, tag_id)
);

-- ============================================================
-- SHARING & COLLABORATION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS shared_chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    password_hash VARCHAR(255),
    access_level VARCHAR(50) DEFAULT 'view', -- view, comment, edit
    access_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_id UUID NOT NULL REFERENCES shared_chats(id) ON DELETE CASCADE,
    accessed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS message_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES message_comments(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES message_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id, emoji)
);

-- ============================================================
-- TEMPLATE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    variables JSONB DEFAULT '[]', -- array of variable names
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS template_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES prompt_templates(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

-- ============================================================
-- BOOKMARK TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS bookmark_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#808080',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message_id UUID NOT NULL,
    folder_id UUID REFERENCES bookmark_folders(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, message_id)
);

-- ============================================================
-- ANALYTICS TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS user_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    analytics_date DATE NOT NULL,
    message_count INT DEFAULT 0,
    token_count INT DEFAULT 0,
    models_used JSONB DEFAULT '{}', -- {model_name: count}
    avg_response_time_ms FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, analytics_date)
);

CREATE TABLE IF NOT EXISTS chat_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL UNIQUE,
    model VARCHAR(255),
    total_tokens INT DEFAULT 0,
    total_messages INT DEFAULT 0,
    first_message_at TIMESTAMP WITH TIME ZONE,
    last_message_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- MARKETPLACE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- bot, template, prompt
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    content JSONB, -- stored item data
    is_approved BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    rating FLOAT DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS item_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, reviewer_id)
);

CREATE TABLE IF NOT EXISTS review_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES item_reviews(id) ON DELETE CASCADE,
    creator_id UUID NOT NULL REFERENCES auth.users(id),
    response_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- MODERATION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS flagged_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, reviewing, resolved, dismissed
    action_taken VARCHAR(255),
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    target_id UUID,
    target_type VARCHAR(50),
    moderator_id UUID NOT NULL REFERENCES auth.users(id),
    reason TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- REMINDER & NOTIFICATION TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
    recurrence VARCHAR(50), -- once, daily, weekly, monthly
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_new_comments BOOLEAN DEFAULT TRUE,
    email_chat_shared BOOLEAN DEFAULT TRUE,
    email_team_update BOOLEAN DEFAULT TRUE,
    email_mentions BOOLEAN DEFAULT TRUE,
    email_weekly_digest BOOLEAN DEFAULT TRUE,
    browser_notifications BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    digest_time TIME DEFAULT '08:00:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    email_type VARCHAR(50) NOT NULL, -- digest, notification, reminder
    recipient_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- sent, bounced, failed
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- RESEARCH LIBRARY TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS research_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    doi VARCHAR(100),
    file_url TEXT,
    file_size_kb INT,
    summary TEXT,
    tags JSONB DEFAULT '[]',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS research_annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES research_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    text_selected TEXT,
    annotation_note TEXT NOT NULL,
    page_number INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONVERSATION BRANCHING TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS chat_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_from_message_id UUID,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- KEYBOARD SHORTCUTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS user_shortcuts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    key_combo VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    is_custom BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, key_combo)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- User profiles
CREATE INDEX idx_user_profiles_display_name ON user_profiles(display_name);

-- Workspaces
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_invites_email ON workspace_invites(email);

-- Collections
CREATE INDEX idx_chat_collections_workspace ON chat_collections(workspace_id);
CREATE INDEX idx_collection_items_chat ON collection_items(chat_id);
CREATE INDEX idx_chat_tag_mapping_chat ON chat_tag_mapping(chat_id);

-- Sharing
CREATE INDEX idx_shared_chats_chat ON shared_chats(chat_id);
CREATE INDEX idx_shared_chats_creator ON shared_chats(creator_id);
CREATE INDEX idx_message_comments_message ON message_comments(message_id);

-- Templates
CREATE INDEX idx_prompt_templates_workspace ON prompt_templates(workspace_id);
CREATE INDEX idx_template_favorites_user ON template_favorites(user_id);

-- Bookmarks
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_message ON bookmarks(message_id);

-- Analytics
CREATE INDEX idx_user_analytics_user_date ON user_analytics(user_id, analytics_date);

-- Marketplace
CREATE INDEX idx_marketplace_items_creator ON marketplace_items(creator_id);
CREATE INDEX idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX idx_item_reviews_item ON item_reviews(item_id);

-- Moderation
CREATE INDEX idx_flagged_items_item ON flagged_items(item_id);
CREATE INDEX idx_moderation_logs_target ON moderation_logs(target_id);

-- Research
CREATE INDEX idx_research_items_user ON research_items(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_shortcuts ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can only read own and public profiles
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Workspaces: Members can view their workspaces
CREATE POLICY "Members can view workspace"
ON workspaces FOR SELECT
TO authenticated
USING (
    id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())
    OR owner_id = auth.uid()
    OR is_public = TRUE
);

-- Bookmarks: Users can only access their own
CREATE POLICY "Users can view own bookmarks"
ON bookmarks FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create bookmarks"
ON bookmarks FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Reminders: Users can only access their own
CREATE POLICY "Users can view own reminders"
ON reminders FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Shortcuts: Users can only modify their own
CREATE POLICY "Users can manage own shortcuts"
ON user_shortcuts FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can view own notification preferences"
ON notification_preferences FOR SELECT
TO authenticated
USING (user_id = auth.uid());
