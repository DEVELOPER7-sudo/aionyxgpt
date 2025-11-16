// Non-AI Features Type Definitions
export interface UserProfile {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  profile_visibility: 'public' | 'private' | 'workspace-only';
  created_at: string;
  updated_at: string;
}

// ============================================================
// WORKSPACE TYPES
// ============================================================

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  description?: string;
  avatar_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joined_at: string;
}

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  invited_by: string;
  token: string;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

// ============================================================
// COLLECTION & ORGANIZATION TYPES
// ============================================================

export interface ChatCollection {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  color: string;
  parent_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CollectionItem {
  id: string;
  collection_id: string;
  chat_id: string;
  position: number;
  added_at: string;
}

export interface ChatTag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_by: string;
}

// ============================================================
// SHARING & COLLABORATION TYPES
// ============================================================

export interface SharedChat {
  id: string;
  chat_id: string;
  creator_id: string;
  token: string;
  expires_at?: string;
  password_hash?: string;
  access_level: 'view' | 'comment' | 'edit';
  access_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShareAccessLog {
  id: string;
  share_id: string;
  accessed_by?: string;
  ip_address?: string;
  accessed_at: string;
}

export interface MessageComment {
  id: string;
  message_id: string;
  author_id: string;
  content: string;
  parent_comment_id?: string;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  reactions?: CommentReaction[];
}

export interface CommentReaction {
  id: string;
  comment_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

// ============================================================
// TEMPLATE TYPES
// ============================================================

export interface PromptTemplate {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  content: string;
  category?: string;
  variables: string[]; // variable names like "topic", "audience"
  is_public: boolean;
  created_by: string;
  download_count: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateFavorite {
  id: string;
  user_id: string;
  template_id: string;
  added_at: string;
}

// ============================================================
// BOOKMARK TYPES
// ============================================================

export interface BookmarkFolder {
  id: string;
  user_id: string;
  workspace_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  message_id: string;
  folder_id?: string;
  note?: string;
  created_at: string;
}

// ============================================================
// ANALYTICS TYPES
// ============================================================

export interface UserAnalytics {
  id: string;
  user_id: string;
  analytics_date: string;
  message_count: number;
  token_count: number;
  models_used: Record<string, number>;
  avg_response_time_ms?: number;
  created_at: string;
}

export interface ChatMetadata {
  id: string;
  chat_id: string;
  model?: string;
  total_tokens: number;
  total_messages: number;
  first_message_at?: string;
  last_message_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  dailyMessages: { date: string; count: number }[];
  dailyTokens: { date: string; count: number }[];
  modelBreakdown: { model: string; count: number; percentage: number }[];
  totalMessages: number;
  totalTokens: number;
  averageResponseTime: number;
  daysActive: number;
}

// ============================================================
// MARKETPLACE TYPES
// ============================================================

export interface MarketplaceItem {
  id: string;
  creator_id: string;
  item_type: 'bot' | 'template' | 'prompt';
  name: string;
  description?: string;
  category?: string;
  content: Record<string, unknown>;
  is_approved: boolean;
  download_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface ItemReview {
  id: string;
  item_id: string;
  reviewer_id: string;
  rating: number; // 1-5
  review_text?: string;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewResponse {
  id: string;
  review_id: string;
  creator_id: string;
  response_text: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// MODERATION TYPES
// ============================================================

export interface FlaggedItem {
  id: string;
  item_id: string;
  reported_by: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  action_taken?: string;
  resolved_by?: string;
  created_at: string;
  resolved_at?: string;
}

export interface ModerationLog {
  id: string;
  action: string;
  target_id?: string;
  target_type?: string;
  moderator_id: string;
  reason?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

// ============================================================
// REMINDER & NOTIFICATION TYPES
// ============================================================

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  scheduled_for: string;
  recurrence?: 'once' | 'daily' | 'weekly' | 'monthly';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_new_comments: boolean;
  email_chat_shared: boolean;
  email_team_update: boolean;
  email_mentions: boolean;
  email_weekly_digest: boolean;
  browser_notifications: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  digest_time: string;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  user_id: string;
  email_type: 'digest' | 'notification' | 'reminder';
  recipient_email: string;
  status: 'sent' | 'bounced' | 'failed';
  error_message?: string;
  created_at: string;
}

// ============================================================
// RESEARCH TYPES
// ============================================================

export interface ResearchItem {
  id: string;
  user_id: string;
  workspace_id: string;
  title: string;
  authors?: string;
  doi?: string;
  file_url?: string;
  file_size_kb?: number;
  summary?: string;
  tags: string[];
  uploaded_at: string;
}

export interface ResearchAnnotation {
  id: string;
  item_id: string;
  user_id: string;
  text_selected?: string;
  annotation_note: string;
  page_number?: number;
  created_at: string;
}

// ============================================================
// BRANCHING TYPES
// ============================================================

export interface ChatBranch {
  id: string;
  chat_id: string;
  name: string;
  description?: string;
  created_from_message_id?: string;
  created_by: string;
  created_at: string;
}

// ============================================================
// SHORTCUTS TYPES
// ============================================================

export interface UserShortcut {
  id: string;
  user_id: string;
  key_combo: string;
  action: string;
  is_custom: boolean;
  created_at: string;
}

export interface ShortcutPreset {
  name: string;
  shortcuts: Array<{
    key_combo: string;
    action: string;
  }>;
}

// ============================================================
// SEARCH TYPES
// ============================================================

export interface SearchFilters {
  query?: string;
  model?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  collections?: string[];
  hasBookmark?: boolean;
}

export interface SearchResult {
  chat_id: string;
  message_id: string;
  content: string;
  model: string;
  created_at: string;
  highlight?: string;
}

// ============================================================
// EXPORT TYPES
// ============================================================

export interface ExportOptions {
  format: 'json' | 'csv' | 'markdown';
  includeMetadata: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface ExportData {
  format: string;
  data: string | object[];
  filename: string;
}
