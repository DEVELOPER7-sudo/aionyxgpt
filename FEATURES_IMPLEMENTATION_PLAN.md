# Non-AI API Features Implementation Plan

Complete roadmap for adding feature-rich capabilities to OnyxGPT without additional AI API dependencies.

---

## 1. Data & Analytics

### 1.1 Chat History Search & Filtering
**Database Tables:**
- `chat_search_index` - Full-text search index
- `chat_metadata` - Search filters (model, date range, tags)

**Components:**
- `ChatSearchBar.tsx` - Advanced search interface
- `SearchFilters.tsx` - Filter UI (date, model, tag)

**Features:**
- Full-text search across messages
- Filter by model, date, tags
- Search highlighting in results
- Saved searches

### 1.2 Analytics Dashboard
**Database:**
- `user_analytics` - Daily stats (messages, tokens, models)
- `usage_metrics` - Aggregated data

**Components:**
- `AnalyticsDashboard.tsx` - Main dashboard
- `UsageChart.tsx` - Recharts visualizations
- `TokenAnalytics.tsx` - Token consumption over time
- `ModelBreakdown.tsx` - Model usage distribution

**Metrics:**
- Messages/day, week, month
- Token consumption
- Model preferences
- Average response time
- Cost estimation (if billing added)

### 1.3 Export Data
**Formats:** JSON, CSV, Markdown
- Single chat export
- Bulk export (date range/tags)
- Export with/without metadata

**Components:**
- `ExportDialog.tsx` - Export options
- Utility functions for format conversion

---

## 2. User Management

### 2.1 User Profiles
**Database:**
- `user_profiles` - Extended user info
- `user_avatars` - Avatar storage in Supabase

**Components:**
- `ProfilePage.tsx` - User profile editor
- `AvatarUpload.tsx` - Avatar with cropping
- `ProfileSettings.tsx` - Bio, display name, preferences

**Features:**
- Avatar upload with image optimization
- Bio/display name
- Profile visibility settings
- Account creation date display

### 2.2 Team/Workspace Support
**Database:**
- `workspaces` - Team spaces
- `workspace_members` - Membership with roles
- `workspace_invites` - Invite tokens
- `workspace_settings` - Workspace config

**Components:**
- `WorkspaceManager.tsx` - Create/manage workspaces
- `MembersList.tsx` - Manage team members
- `WorkspaceSettings.tsx` - Workspace config
- `InviteDialog.tsx` - Send invites

**Roles:** Owner, Admin, Editor, Viewer

**Features:**
- Create/switch workspaces
- Invite members via email
- Role-based access control
- Workspace-specific chat history
- Shared resources (bots, templates)

---

## 3. Organization

### 3.1 Chat Collections/Folders
**Database:**
- `chat_collections` - Folders/collections
- `collection_items` - Chat -> Collection mapping
- `collection_tags` - Tag system

**Components:**
- `CollectionManager.tsx` - Create/rename folders
- `TagManager.tsx` - Tag UI
- `ChatOrganizer.tsx` - Drag-drop organization

**Features:**
- Nested folders (up to 5 levels)
- Drag-drop chat organization
- Color-coded collections
- Multi-tag support per chat

### 3.2 Prompt Template Library
**Database:**
- `prompt_templates` - Saved prompts
- `template_categories` - Organization
- `template_favorites` - User favorites

**Components:**
- `TemplateLibrary.tsx` - Browse templates
- `TemplateEditor.tsx` - Create/edit
- `TemplatePreview.tsx` - Live preview
- `QuickAccessTemplates.tsx` - Sidebar widget

**Features:**
- Pre-built templates by category
- Variables ({{name}}, {{topic}})
- Favorite/reorder
- Search templates
- Community templates

### 3.3 Keyboard Shortcuts Customization
**Database:**
- `user_shortcuts` - Custom key bindings
- `shortcut_presets` - Vim, Emacs, etc.

**Components:**
- `ShortcutsSettings.tsx` - Configure shortcuts
- `ShortcutsDialog.tsx` - View all shortcuts
- `ShortcutPresetSelector.tsx` - Load presets

**Shortcuts:**
- Cmd/Ctrl+K - Command palette
- Cmd/Ctrl+N - New chat
- Cmd/Ctrl+/ - Toggle sidebar
- Cmd/Ctrl+S - Save chat
- Tab completion for templates
- Custom user-defined

### 3.4 Conversation Branching/Versions
**Database:**
- `chat_branches` - Version branches
- `chat_versions` - Individual versions
- `branch_metadata` - Branch names, descriptions

**Components:**
- `VersionHistory.tsx` - Branch tree view
- `BranchSelector.tsx` - Choose branch
- `BranchDiff.tsx` - Compare versions
- `MergeDialog.tsx` - Merge branches

**Features:**
- Branch at any message point
- Named branches ("Question A", "Question B")
- Switch between branches
- Visual diff of branches
- Merge branches together

---

## 4. Collaboration

### 4.1 Chat Sharing with Expiring Links
**Database:**
- `shared_chats` - Share records
- `share_links` - Unique tokens
- `share_access_logs` - Access tracking

**Components:**
- `ShareDialog.tsx` - Generate share links
- `ShareSettings.tsx` - Expiry, password, view-only
- `AccessLog.tsx` - View who accessed

**Features:**
- Expiring links (24h, 7d, 30d, never)
- Password protection optional
- View-only or comment permission
- Track access count
- Revoke anytime

### 4.2 Comments/Annotations
**Database:**
- `message_comments` - Comments on messages
- `comment_threads` - Threaded discussions
- `comment_reactions` - Like/emoji reactions

**Components:**
- `CommentsPanel.tsx` - Side panel for comments
- `CommentThread.tsx` - Threaded view
- `CommentForm.tsx` - Write comments
- `CommentReactions.tsx` - Emoji reactions

**Features:**
- Inline comments on messages
- Reply threads
- @mentions for notifications
- Emoji reactions
- Comment editing/deletion

### 4.3 Read Receipts & Presence
**Database:**
- `presence_sessions` - Active sessions
- `message_reads` - Read status per user
- `typing_indicators` - Live typing

**Components:**
- `PresenceIndicator.tsx` - Show active users
- `TypingIndicator.tsx` - "[User] is typing..."
- `ReadReceipts.tsx` - Checkmarks for read

**Features:**
- Show active workspace members
- Live typing indicators
- Message read status (1/2 checkmarks)
- Last seen timestamp
- Online/offline status

### 4.4 Real-time Collaboration (Supabase Realtime)
**Implementation:**
- Use Supabase Realtime for live updates
- Optimistic updates for UI
- Conflict resolution for simultaneous edits

**Features:**
- Live message sync in shared chats
- Real-time presence
- Collaborative editing on templates
- Instant notifications for comments

---

## 5. Notifications & Preferences

### 5.1 Email Digests
**Database:**
- `notification_preferences` - User settings
- `digest_schedule` - Daily/weekly settings
- `email_logs` - Sent emails

**Background Job:**
- Scheduled Supabase function (daily/weekly)

**Features:**
- Daily digest of new messages
- Weekly summary of activity
- Configurable send time
- Opt-in/opt-out per digest type

### 5.2 Notification Preferences
**Components:**
- `NotificationPreferences.tsx` - All settings
- `NotificationChannels.tsx` - Email/browser/in-app

**Options:**
- New comments notification
- Shared chat accessed
- Team member joined
- Mention in comment
- Per-notification-type settings

### 5.3 Desktop Notifications
**Implementation:**
- Browser Notification API
- Service Worker for background notifications

**Features:**
- Browser notifications for comments
- Permission request on first use
- Sound/silent option
- Click to navigate

### 5.4 Scheduled Reminders
**Database:**
- `reminders` - User-created reminders
- `reminder_jobs` - Scheduled tasks

**Components:**
- `ReminderDialog.tsx` - Create reminder
- `RemindersPanel.tsx` - View upcoming

**Features:**
- Remind on specific date/time
- Recurring reminders (daily, weekly)
- Notification + email
- Snooze option

---

## 6. Content Management

### 6.1 Bookmark/Favorite Responses
**Database:**
- `bookmarks` - Favorited messages
- `bookmark_folders` - Organization

**Components:**
- `BookmarkButton.tsx` - Star/bookmark icon
- `BookmarksPanel.tsx` - View all bookmarks
- `BookmarkFolders.tsx` - Organize bookmarks

**Features:**
- Star individual messages
- Organize into folders
- Search bookmarks
- Export bookmarks
- Bookmark notes

### 6.2 Citation Management
**Database:**
- `citations` - Citation records
- `citation_formats` - APA, MLA, Chicago styles

**Components:**
- `CitationGenerator.tsx` - Generate citations
- `CitationPanel.tsx` - View/edit citations
- `CitationCopy.tsx` - Copy in format

**Formats Supported:**
- APA 7th edition
- MLA 9th edition
- Chicago Manual of Style
- Harvard
- IEEE

**Features:**
- Auto-detect citable content
- Generate citations from links
- Copy/export citations
- Create bibliography

### 6.3 Research Paper Library
**Database:**
- `research_items` - Papers, articles
- `research_tags` - Subject tagging
- `research_annotations` - Notes

**Components:**
- `ResearchLibrary.tsx` - Browse library
- `PaperUpload.tsx` - Upload PDFs
- `PaperViewer.tsx` - View with annotations
- `ResearchNotes.tsx` - Take notes

**Features:**
- Upload PDF papers
- Extract metadata (title, authors, DOI)
- Full-text search in PDFs
- Highlight and annotate
- Link papers to relevant chats

### 6.4 Document Comparison Tools
**Implementation:**
- Diff algorithm for text comparison
- Visual diff display

**Components:**
- `ComparisonPanel.tsx` - Side-by-side or unified diff
- `ComparisonSelector.tsx` - Choose items to compare

**Features:**
- Compare two chat responses
- Compare two document versions
- Syntax highlighting for code
- Word-level and line-level diffs

---

## 7. Social Features

### 7.1 Public Marketplace
**Database:**
- `marketplace_items` - Listed bots/templates
- `item_categories` - Organization
- `item_reviews` - Ratings and reviews

**Components:**
- `Marketplace.tsx` - Browse all items
- `MarketplaceCard.tsx` - Item preview
- `PublishDialog.tsx` - Publish to marketplace
- `ReviewPanel.tsx` - Ratings section

**Features:**
- Browse community bots and templates
- Filter by category, rating
- One-click import
- View creator profile
- See usage stats

### 7.2 User Ratings & Reviews
**Database:**
- `item_reviews` - Review records
- `review_responses` - Creator replies

**Components:**
- `ReviewForm.tsx` - Write review
- `ReviewList.tsx` - Display reviews
- `CreatorReply.tsx` - Reply to reviews

**Features:**
- 5-star ratings
- Written reviews
- Helpful counter
- Report inappropriate reviews
- Creator responses

### 7.3 Weekly Digest Emails
**Background Job:**
- Scheduled function (Sundays 8am)

**Content:**
- Popular new marketplace items
- Your activity summary
- Top community creators
- Feature highlights

**Features:**
- Personalized based on categories
- Unsubscribe link
- Configurable delivery time

### 7.4 Community Guidelines & Moderation
**Database:**
- `flagged_items` - Reports
- `moderation_logs` - Actions taken
- `community_guidelines` - Terms

**Components:**
- `FlagButton.tsx` - Report content
- `ModerationDashboard.tsx` - Admin panel
- `GuidelinesModal.tsx` - Display guidelines

**Features:**
- Flag inappropriate content
- Moderation dashboard for admins
- Auto-remove after X flags
- Permanent ban for serious violations
- Appeal system

---

## 8. System Utilities

### 8.1 Redis Caching Layer
**Purpose:** Improve performance for frequently accessed data

**Cached Items:**
- User profiles
- Popular marketplace items
- Template library
- Analytics aggregates

**Strategy:**
- Cache for 1 hour by default
- Invalidate on write
- Fallback to database if cache miss

### 8.2 Database Backup/Restore
**Implementation:**
- Automated daily backups via Supabase
- Manual backup trigger UI
- Restore point selection

**Components:**
- `BackupSettings.tsx` - Manage backups
- `RestoreDialog.tsx` - Restore from point

**Features:**
- Daily automatic backups
- Manual backup on-demand
- Backup retention (30 days)
- Restore to any point
- Backup size indicator

---

## Database Schema

### Core Tables
```sql
-- User Management
- users (Supabase auth, extended)
- user_profiles (display_name, bio, avatar_url)
- user_avatars (image_data in storage)

-- Workspaces
- workspaces (id, name, owner_id, created_at)
- workspace_members (workspace_id, user_id, role)
- workspace_invites (workspace_id, email, token, expires_at)

-- Chat Organization
- chat_collections (id, workspace_id, name, color, parent_id)
- collection_items (collection_id, chat_id)
- chat_tags (id, name, color)
- chat_tag_mapping (chat_id, tag_id)

-- Sharing & Collaboration
- shared_chats (id, chat_id, creator_id, token, expires_at, password_hash, access_count)
- share_access_logs (share_id, accessed_by, accessed_at)
- message_comments (id, message_id, author_id, content, created_at)
- comment_reactions (comment_id, user_id, emoji)

-- Templates
- prompt_templates (id, workspace_id, name, content, category, variables, is_public)
- template_favorites (user_id, template_id)

-- Bookmarks
- bookmarks (id, user_id, message_id, folder_id, created_at)
- bookmark_folders (id, user_id, name)

-- Analytics
- user_analytics (user_id, date, message_count, token_count, models_used)
- chat_metadata (chat_id, model, token_count, created_at)

-- Marketplace
- marketplace_items (id, creator_id, type, name, description, category, downloads, rating)
- item_reviews (id, item_id, reviewer_id, rating, review_text, helpful_count)
- review_responses (review_id, creator_id, response_text)

-- Moderation
- flagged_items (id, item_id, reported_by, reason, status, created_at)
- moderation_logs (id, action, target_id, moderator_id, timestamp)

-- Reminders & Notifications
- reminders (id, user_id, title, scheduled_for, recurrence, is_completed)
- notification_preferences (user_id, channel, enabled, quiet_hours)

-- Research
- research_items (id, user_id, title, authors, doi, file_url, uploaded_at)
- research_annotations (id, item_id, text, note, page)

-- Versioning
- chat_branches (id, chat_id, name, created_from_message_id)
- chat_versions (id, branch_id, parent_id, message_id, created_at)

-- Shortcuts
- user_shortcuts (user_id, key_combo, action, custom)
```

---

## Implementation Priority

### Phase 1 (High Priority)
1. User profiles & avatars
2. Chat collections/folders
3. Bookmarks & favorites
4. Chat search
5. Analytics dashboard

### Phase 2 (Medium Priority)
6. Workspace/teams support
7. Chat sharing
8. Prompt templates
9. Keyboard shortcuts
10. Comments & annotations

### Phase 3 (Lower Priority)
11. Conversation branching
12. Real-time collaboration
13. Email digests & reminders
14. Desktop notifications
15. Research library

### Phase 4 (Social/Nice-to-Have)
16. Marketplace
17. Ratings & reviews
18. Social features
19. Moderation system
20. Advanced utilities (caching, backups)

---

## Technology Stack
- **Frontend:** React, TypeScript, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Functions, Realtime, Storage)
- **Caching:** Supabase built-in caching (or Redis if needed)
- **Background Jobs:** Supabase scheduled functions
- **Notifications:** Browser API, Supabase Realtime
- **File Storage:** Supabase Storage

---

## Testing Strategy
- Unit tests for utilities
- Integration tests for Supabase interactions
- E2E tests for user workflows
- Performance testing for analytics queries

---

**Status:** Ready for implementation  
**Last Updated:** November 16, 2025
