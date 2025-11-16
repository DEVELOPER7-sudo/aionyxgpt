# Non-AI Features Integration Guide

Complete guide for integrating the 40+ non-AI features into OnyxGPT.

---

## 🚀 Quick Start (5 Minutes)

### 1. Deploy Database
```bash
# Copy migration to Supabase
supabase/migrations/001_non_ai_features.sql

# Deploy via Supabase dashboard or CLI
supabase db push

# Verify tables created
supabase db tables list
```

### 2. Update Types
Files are already created:
- `src/types/features.ts` - All 30+ type definitions
- `src/lib/features/index.ts` - Central export

### 3. Start Using
```typescript
import { 
  addBookmark, 
  createCollection, 
  getAggregatedAnalytics 
} from '@/lib/features';
```

---

## 📦 Feature Modules Overview

### Module 1: Bookmarks (`src/lib/features/bookmarks.ts`)
**Purpose:** Save favorite messages and organize them

**Core Functions:**
```typescript
// Folders
createBookmarkFolder(userId, workspaceId, name, color?)
getBookmarkFolders(userId, workspaceId)
updateBookmarkFolder(folderId, updates)
deleteBookmarkFolder(folderId)

// Bookmarks
addBookmark(userId, messageId, folderId?, note?)
getBookmarks(userId)
getBookmarksByFolder(folderId, userId)
updateBookmark(bookmarkId, updates)
isMessageBookmarked(messageId, userId)
```

**Usage in ChatApp:**
```typescript
// Add bookmark button to message
<button onClick={() => addBookmark(userId, messageId, 'general')}>
  ⭐ Bookmark
</button>

// Show bookmarks panel
const bookmarks = await getBookmarks(userId);
<BookmarksPanel bookmarks={bookmarks} />
```

---

### Module 2: Collections (`src/lib/features/collections.ts`)
**Purpose:** Organize chats into nested folders with tags

**Core Functions:**
```typescript
// Collections
createCollection(workspaceId, userId, name, color?, parentId?)
getCollections(workspaceId)
getCollectionHierarchy(workspaceId)
updateCollection(collectionId, updates)
deleteCollection(collectionId)

// Items
addChatToCollection(collectionId, chatId, position?)
removeChatFromCollection(chatId)
getCollectionChats(collectionId)
reorderCollectionItems(collectionId, chatIds)

// Tags
createTag(workspaceId, userId, name, color?)
getTags(workspaceId)
getChatTags(chatId)
updateChatTags(chatId, tagIds)
```

**Usage in ChatSidebar:**
```typescript
// Show collections as sidebar tree
const collections = await getCollectionHierarchy(workspaceId);
<CollectionBrowser collections={collections} />

// Add chat to collection on right-click
contextMenu.addItem('Add to Collection', async (col) => {
  await addChatToCollection(col.id, chatId);
});
```

---

### Module 3: Analytics (`src/lib/features/analytics.ts`)
**Purpose:** Track usage patterns and generate insights

**Core Functions:**
```typescript
// Recording
recordChatMetadata(chatId, model, tokenCount, messageCount)
updateChatMetadata(chatId, { tokenCount?, messageCount? })
incrementDailyStats(userId, model, tokens, responseTime?)

// Retrieval
getUserAnalytics(userId, daysBack?)
getAggregatedAnalytics(userId)
generateChartData(userId, daysBack?)

// Export
exportAnalyticsAsJSON(userId, daysBack?)
exportAnalyticsAsCSV(userId, daysBack?)
```

**Usage in ChatApp:**
```typescript
// Record stats on each message
const tokens = response.usage.total_tokens;
await recordChatMetadata(chatId, 'gpt-4', tokens, messageCount);
await incrementDailyStats(userId, 'gpt-4', tokens, responseTime);

// Show dashboard
const analytics = await getAggregatedAnalytics(userId);
<AnalyticsDashboard data={analytics} />
```

---

### Module 4: Search (`src/lib/features/search.ts`)
**Purpose:** Full-text search with advanced filters

**Core Functions:**
```typescript
// Search
searchChats(userId, filters: SearchFilters)
advancedSearch(userId, options: SearchOptions)
getSearchSuggestions(userId, prefix)

// History
saveSearchQuery(userId, query, filters)
getSearchHistory(userId)
clearSearchHistory(userId)
```

**Usage in ChatApp:**
```typescript
// Add search bar
<SearchBar 
  onSearch={async (query) => {
    const results = await advancedSearch(userId, {
      query,
      models: selectedModels,
      dateFrom, dateTo,
      tags: selectedTags
    });
    showResults(results);
  }}
/>

// Save search history
await saveSearchQuery(userId, query, filters);
```

---

### Module 5: Export (`src/lib/features/export.ts`)
**Purpose:** Export data in multiple formats

**Core Functions:**
```typescript
// Export
exportChatsAsJSON(chats, options)
exportChatsAsCSV(chats, options)
exportChatsAsMarkdown(chats, options)
batchExportChats(chats, formats, options)

// Download
downloadExportedData(data)
copyExportedDataToClipboard(data)

// Import
parseImportedJSON(jsonContent)
parseImportedCSV(csvContent)
```

**Usage in Settings:**
```typescript
// Export dialog
const chats = await getChats(userId);
const exported = await exportChatsAsJSON(chats, {
  format: 'json',
  includeMetadata: true
});
downloadExportedData(exported);

// Batch export
const allFormats = await batchExportChats(chats, ['json', 'csv', 'markdown']);
```

---

### Module 6: Workspaces (`src/lib/features/workspaces.ts`)
**Purpose:** Team collaboration with role-based access

**Core Functions:**
```typescript
// Workspace CRUD
createWorkspace(userId, name, description?)
getWorkspaces(userId)
updateWorkspace(workspaceId, updates)
deleteWorkspace(workspaceId)

// Members
addWorkspaceMember(workspaceId, userId, role)
getWorkspaceMembers(workspaceId)
updateMemberRole(workspaceId, userId, role)
removeWorkspaceMember(workspaceId, userId)

// Invites
createWorkspaceInvite(workspaceId, email, invitedBy, role?, expiresInDays?)
getWorkspaceInvites(workspaceId)
acceptWorkspaceInvite(token, userId)
deleteInvite(inviteId)

// Permissions
canEditWorkspace(role)
canManageMembers(role)
canDeleteChat(role)
canViewChat(role)
```

**Usage in App:**
```typescript
// Workspace selector
const workspaces = await getWorkspaces(userId);
<WorkspaceSelector 
  workspaces={workspaces}
  onSelect={(ws) => setCurrentWorkspace(ws)}
/>

// Member management
const members = await getWorkspaceMembers(workspaceId);
<MembersPanel 
  members={members}
  onInvite={(email) => createWorkspaceInvite(workspaceId, email, userId)}
/>

// Invite acceptance (login flow)
if (inviteToken) {
  const workspace = await acceptWorkspaceInvite(inviteToken, userId);
  navigate(`/workspace/${workspace.id}`);
}
```

---

### Module 7: Sharing (`src/lib/features/sharing.ts`)
**Purpose:** Share chats with comments and collaboration

**Core Functions:**
```typescript
// Sharing
createShareLink(chatId, creatorId, options?)
getShareLink(token, password?)
updateShareLink(shareId, updates)
revokeShareLink(shareId)
getUserShareLinks(userId)

// Comments
addComment(messageId, authorId, content, parentCommentId?)
getMessageComments(messageId)
getCommentThread(parentCommentId)
updateComment(commentId, content)
deleteComment(commentId)

// Reactions
addCommentReaction(commentId, userId, emoji)
removeCommentReaction(commentId, userId, emoji)
getCommentReactions(commentId)

// Access Logging
logShareAccess(shareId, userId?)
getShareAccessLogs(shareId)
```

**Usage in ChatApp:**
```typescript
// Share button
<ShareDialog 
  chatId={chatId}
  onShare={async (options) => {
    const share = await createShareLink(chatId, userId, options);
    copyToClipboard(share.token);
  }}
/>

// Comments panel in shared view
const comments = await getMessageComments(messageId);
<CommentsPanel 
  comments={comments}
  onAddComment={(content) => addComment(messageId, userId, content)}
  onReact={(commentId, emoji) => addCommentReaction(commentId, userId, emoji)}
/>
```

---

### Module 8: Templates (`src/lib/features/templates.ts`)
**Purpose:** Reusable prompt templates with variable substitution

**Core Functions:**
```typescript
// CRUD
createTemplate(workspaceId, userId, name, content, options?)
getTemplates(workspaceId)
updateTemplate(templateId, updates)
deleteTemplate(templateId)

// Search & Filter
searchTemplates(workspaceId, query)
getPublicTemplates(limit?)
getTemplatesByCategory(workspaceId, category)

// Favorites
favoriteTemplate(userId, templateId)
unfavoriteTemplate(userId, templateId)
getUserFavoriteTemplates(userId)

// Rendering
renderTemplate(template, variables)

// Built-in
loadBuiltInTemplates(workspaceId, userId)
```

**Usage in ChatApp:**
```typescript
// Template selector dropdown
const templates = await getTemplates(workspaceId);
<TemplateSelector 
  templates={templates}
  onSelect={(template) => {
    const prompt = renderTemplate(template, userVariables);
    setInputText(prompt);
  }}
/>

// Template library browser
<TemplateLibrary 
  templates={templates}
  onFavorite={(id) => favoriteTemplate(userId, id)}
/>
```

---

### Module 9: Notifications (`src/lib/features/notifications.ts`)
**Purpose:** Reminders, notifications, and email preferences

**Core Functions:**
```typescript
// Preferences
getNotificationPreferences(userId)
createNotificationPreferences(userId)
updateNotificationPreferences(userId, updates)

// Reminders
createReminder(userId, title, scheduledFor, options?)
getReminders(userId)
getUpcomingReminders(userId, hoursAhead?)
completeReminder(reminderId)
snoozeReminder(reminderId, minutesFromNow)
deleteReminder(reminderId)

// Browser Notifications
requestNotificationPermission()
sendBrowserNotification(title, options?)

// Helpers
NotificationManager class
canSendEmail(type)
canSendBrowserNotification()
```

**Usage in App:**
```typescript
// Reminder creation
<ReminderDialog 
  onCreate={(title, date, recurrence) => 
    createReminder(userId, title, date, { recurrence })
  }
/>

// Notification preferences
const prefs = await getNotificationPreferences(userId);
<NotificationSettings 
  preferences={prefs}
  onUpdate={(updates) => updateNotificationPreferences(userId, updates)}
/>

// Check upcoming reminders periodically
const upcoming = await getUpcomingReminders(userId, 1);
upcoming.forEach(reminder => {
  sendBrowserNotification(`Reminder: ${reminder.title}`);
});
```

---

### Module 10: User Profiles (`src/lib/features/profiles.ts`)
**Purpose:** User profile management and avatar uploads

**Core Functions:**
```typescript
// Profile
getUserProfile(userId)
createUserProfile(userId, displayName?, bio?)
updateUserProfile(userId, updates)

// Avatar
uploadAvatar(userId, file)
deleteAvatar(userId)
getPublicProfile(userId)
```

**Usage in App:**
```typescript
// Profile settings
const profile = await getUserProfile(userId);
<ProfileSettings 
  profile={profile}
  onUpdate={(updates) => updateUserProfile(userId, updates)}
  onAvatarUpload={(file) => uploadAvatar(userId, file)}
/>

// Display avatar in header
<Avatar src={profile.avatar_url} alt={profile.display_name} />
```

---

## 🔌 Integration Checkpoints

### Checkpoint 1: Authentication
When user logs in:
```typescript
// Ensure user profile exists
let profile = await getUserProfile(userId);
if (!profile) {
  profile = await createUserProfile(userId);
}

// Ensure workspace exists
let workspaces = await getWorkspaces(userId);
if (workspaces.length === 0) {
  const ws = await createWorkspace(userId, 'Personal');
  workspaces = [ws];
}

setCurrentWorkspace(workspaces[0]);
```

### Checkpoint 2: Chat Creation
When creating a new chat:
```typescript
const chat = await createChat(userId, { /* ... */ });

// Create metadata record
await recordChatMetadata(chat.id, model, 0, 0);

// Add to active workspace
await addChatToCollection(currentWorkspace.id, chat.id);
```

### Checkpoint 3: Message Response
When receiving AI response:
```typescript
const response = await callAI(/* ... */);
const tokens = response.usage.total_tokens;

// Update chat metadata
await updateChatMetadata(chatId, {
  tokenCount: totalTokens + tokens,
  messageCount: messageCount + 1
});

// Record daily stats
await incrementDailyStats(userId, model, tokens, responseTime);
```

### Checkpoint 4: Chat Display
In ChatArea component:
```typescript
const [isBookmarked, setIsBookmarked] = useState(false);
const [comments, setComments] = useState<MessageComment[]>([]);

useEffect(() => {
  // Check bookmark status
  const bookmarked = await isMessageBookmarked(message.id, userId);
  setIsBookmarked(bookmarked);

  // Load comments
  const msgs = await getMessageComments(message.id);
  setComments(msgs);
}, [message.id]);
```

### Checkpoint 5: Sidebar
In ChatSidebar component:
```typescript
const [collections, setCollections] = useState<ChatCollection[]>([]);
const [tags, setTags] = useState<ChatTag[]>([]);

useEffect(() => {
  const loadOrganization = async () => {
    const cols = await getCollectionHierarchy(currentWorkspace.id);
    setCollections(cols);
  };
  loadOrganization();
}, [currentWorkspace.id]);
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Test bookmarks
import { addBookmark, isMessageBookmarked } from '@/lib/features';

test('add and check bookmark', async () => {
  await addBookmark(userId, messageId);
  const result = await isMessageBookmarked(messageId, userId);
  expect(result).toBe(true);
});
```

### Integration Tests
```typescript
// Test with Supabase
import { createWorkspace, addWorkspaceMember } from '@/lib/features';

test('workspace with members', async () => {
  const ws = await createWorkspace(userId, 'Test');
  await addWorkspaceMember(ws.id, user2Id, 'editor');
  const members = await getWorkspaceMembers(ws.id);
  expect(members.length).toBe(2);
});
```

### E2E Tests
```typescript
// Test full workflow
test('user workflow', async () => {
  // Create workspace
  const ws = await createWorkspace(userId, 'Team');
  
  // Create collection
  const col = await createCollection(ws.id, userId, 'Q&A');
  
  // Add chat
  await addChatToCollection(col.id, chatId);
  
  // Verify structure
  const chats = await getCollectionChats(col.id);
  expect(chats).toContain(chatId);
});
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Database migration applied
- [ ] RLS policies enabled on all tables
- [ ] Verify user isolation (can't access other users' data)
- [ ] Test workspace access control
- [ ] Verify share link expiration works
- [ ] Test password-protected shares
- [ ] Check avatar upload size limits
- [ ] Verify no secrets in localStorage
- [ ] Test CORS headers on Supabase functions
- [ ] Enable HTTPS for all connections

---

## 🚨 Common Pitfalls

### Pitfall 1: Forgetting RLS
```typescript
// ❌ WRONG - Can access any user's bookmarks
const { data } = await supabase.from('bookmarks').select('*');

// ✅ RIGHT - RLS automatically filters
const { data } = await supabase.from('bookmarks').select('*');
// Only returns current user's bookmarks
```

### Pitfall 2: Not Handling Realtime
```typescript
// ✅ Subscribe to changes
const subscription = supabase
  .from('bookmarks')
  .on('*', (payload) => {
    setBookmarks(prev => [...prev, payload.new]);
  })
  .subscribe();

// Don't forget to unsubscribe
return () => subscription.unsubscribe();
```

### Pitfall 3: Missing Error Handling
```typescript
// ❌ No error handling
const bookmarks = await getBookmarks(userId);

// ✅ With error handling
try {
  const bookmarks = await getBookmarks(userId);
  setBookmarks(bookmarks);
} catch (error) {
  toast.error('Failed to load bookmarks');
  console.error(error);
}
```

### Pitfall 4: N+1 Queries
```typescript
// ❌ N+1 problem
for (const chat of chats) {
  const comments = await getMessageComments(chat.id); // 1+N queries!
}

// ✅ Batch query
const allComments = await supabase
  .from('message_comments')
  .select('*')
  .in('message_id', chatIds); // Single query
```

---

## 📞 Support & Troubleshooting

### Database Connection Issues
```bash
# Check Supabase connection
supabase status

# Verify migrations
supabase db list-migrations

# Check RLS policies
supabase db policies list
```

### Query Performance
- Add indexes for frequently filtered columns
- Use pagination for large result sets
- Cache static data (templates, tags)
- Debounce search queries

### Real-time Issues
- Subscribe in useEffect with cleanup
- Handle network disconnections
- Verify Supabase realtime enabled
- Check message size limits

---

## 🎯 Migration Path

If you have existing chats/data:

1. **Backup existing data**
   ```bash
   supabase db dump -f backup.sql
   ```

2. **Deploy new schema**
   ```bash
   supabase db push
   ```

3. **Migrate existing chats**
   ```typescript
   // Create metadata for existing chats
   for (const chat of existingChats) {
     await recordChatMetadata(chat.id, chat.model, chat.tokens, chat.messages.length);
   }
   ```

4. **Create default workspace**
   ```typescript
   // Move all existing chats to personal workspace
   const ws = await createWorkspace(userId, 'Personal');
   for (const chat of existingChats) {
     await addChatToCollection(ws.id, chat.id);
   }
   ```

---

**Ready to integrate! Start with Checkpoint 1 and work through sequentially.**
