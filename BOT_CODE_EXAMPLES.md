# Bot System - Code Examples & Patterns

## Core Patterns

### 1. Creating a Bot

**Frontend (BotCreator.tsx)**
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user?.id) {
    toast.error('You must be logged in');
    return;
  }
  
  try {
    const bot = await botService.createBot(
      formData,           // BotConfig
      user.id,            // userId
      pfpFile || undefined // optional avatar
    );
    
    navigate(`/bot/${bot.uuid}`);
  } catch (error) {
    toast.error('Failed to create bot');
  }
};
```

**Backend (botService.ts)**
```typescript
async createBot(
  config: BotConfig,
  userId: string,
  pfpFile?: File
): Promise<Bot> {
  // 1. Upload avatar if provided
  let pfpUrl = config.pfpUrl;
  if (pfpFile) {
    const filename = `${Date.now()}-${pfpFile.name}`;
    const { data, error } = await supabase.storage
      .from('bot-avatars')
      .upload(filename, pfpFile);
    
    if (data) {
      pfpUrl = supabase.storage
        .from('bot-avatars')
        .getPublicUrl(data.path).data.publicUrl;
    }
  }
  
  // 2. Insert into database
  const { data, error } = await supabase
    .from('bots')
    .insert([
      {
        creator_id: userId,
        name: config.name,
        description: config.description,
        category: config.category,
        pfp_url: pfpUrl,
        system_prompt: config.systemPrompt,
        visibility: config.visibility,
        capabilities: config.capabilities,
      },
    ])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}
```

### 2. Loading and Using a Bot

**BotLauncher.tsx - Load Bot**
```typescript
useEffect(() => {
  const loadBot = async () => {
    if (!uuid) {
      setState(prev => ({ ...prev, notFound: true }));
      return;
    }
    
    try {
      // Load bot by UUID with permission check
      const botData = await botService.fetchBotByUuid(uuid, user?.id);
      
      if (!botData) {
        setState(prev => ({ ...prev, notFound: true }));
        return;
      }
      
      setState(prev => ({ ...prev, bot: botData }));
    } catch (error) {
      toast.error('Failed to load bot');
    }
  };
  
  if (!authLoading && user) {
    loadBot();
  }
}, [uuid, user?.id, authLoading]);
```

**BotLauncher.tsx - Inject System Prompt**
```typescript
const handleBotChat = async (
  messages: Message[],
  chatId: string,
  bot: Bot
) => {
  // 1. Get the bot's system prompt (THIS IS KEY!)
  const finalSystemPrompt = bot.system_prompt;
  
  // 2. Build message array with bot's system prompt
  const baseMessages = messages
    .filter(m => typeof m.content === 'string' && m.content.trim().length > 0)
    .map(m => ({ role: m.role, content: m.content }));

  const formattedMessages = [
    { 
      role: 'system', 
      content: finalSystemPrompt  // ← BOT BEHAVIOR INJECTED HERE
    },
    ...baseMessages,
  ];
  
  // 3. Send to AI with bot's constraints
  const response = await puter.ai.chat(formattedMessages, {
    model: 'gpt-5',
    stream: true,
    temperature: 0.7,
    max_tokens: 2048,
  });
  
  // 4. Stream response...
};
```

### 3. Fetching Bots with Filtering

**botService.ts**
```typescript
async fetchBots(userId?: string, category?: string): Promise<Bot[]> {
  let query = supabase.from('bots').select('*');

  // Filter by visibility (only show public or user-owned)
  if (userId) {
    query = query.or(`visibility.eq.public,creator_id.eq.${userId}`);
  } else {
    query = query.eq('visibility', 'public');
  }

  // Optional: filter by category
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // Order by creation date (newest first)
  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  
  return data || [];
}
```

**React Component**
```typescript
useEffect(() => {
  const loadBots = async () => {
    try {
      setLoading(true);
      // Load public + user-owned bots, filtered by category
      const botList = await botService.fetchBots(
        user?.id,
        selectedCategory
      );
      setBots(botList);
    } catch (error) {
      toast.error('Failed to load bots');
    } finally {
      setLoading(false);
    }
  };

  loadBots();
}, [user?.id, selectedCategory]);
```

## Advanced Patterns

### 4. Searching Bots

**botService.ts**
```typescript
async searchBots(
  query: string,
  userId?: string,
  limit: number = 10
): Promise<Bot[]> {
  let q = supabase
    .from('bots')
    .select('*')
    .or(
      `name.ilike.%${query}%,description.ilike.%${query}%`
    );

  // Only show public or user-owned
  if (userId) {
    q = q.or(`visibility.eq.public,creator_id.eq.${userId}`);
  } else {
    q = q.eq('visibility', 'public');
  }

  const { data, error } = await q
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}
```

### 5. Tracking Bot Usage

**Automatic on Chat Creation**
```typescript
// When creating new chat with bot
const newChat: Chat = {
  id: Date.now().toString(),
  title: `${bot.name} Chat`,
  messages: [welcomeMessage],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  model: 'gpt-5',
};

// Save chat
storage.addChat(newChat);

// Record bot usage in database
if (bot && user) {
  try {
    await botService.recordBotUsage(
      bot.uuid,
      newChat.id,
      user.id,
      bot  // Snapshot of bot config at this time
    );
    
    // Increment usage count
    await botService.incrementUsageCount(bot.uuid);
  } catch (error) {
    console.error('Failed to record usage:', error);
  }
}
```

### 6. Permission Checking

**RLS in Database (auto-enforced)**
```sql
-- Users can only see public bots
CREATE POLICY "Users can view public bots"
  ON bots FOR SELECT
  USING (visibility = 'public');

-- Users can view their own bots
CREATE POLICY "Users can view their own bots"
  ON bots FOR SELECT
  USING (creator_id = auth.uid());

-- Only creator can update
CREATE POLICY "Users can update their own bots"
  ON bots FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());
```

**In Service (defensive check)**
```typescript
async fetchBotByUuid(uuid: string, userId?: string): Promise<Bot | null> {
  const { data, error } = await supabase
    .from('bots')
    .select('*')
    .eq('uuid', uuid)
    .single();

  if (error || !data) return null;

  // Check visibility (RLS should enforce, but belt + suspenders)
  if (
    data.visibility === 'private' &&
    data.creator_id !== userId
  ) {
    return null; // Forbidden
  }

  return data;
}
```

## React Patterns

### 7. Using the Bot Hook

**useBot.ts Hook**
```typescript
const {
  bots,
  loading,
  error,
  fetchBots,
  fetchBotByUuid,
  createBot,
  updateBot,
  deleteBot,
  searchBots,
} = useBot();
```

**Usage in Component**
```typescript
const MyBotComponent = ({ botId }: { botId: string }) => {
  const { bots, loading, fetchBotByUuid } = useBot();
  
  useEffect(() => {
    fetchBotByUuid(botId, user?.id);
  }, [botId, user?.id]);
  
  if (loading) return <Spinner />;
  if (!bots.length) return <NotFound />;
  
  return <BotCard bot={bots[0]} />;
};
```

### 8. Form Handling

**BotCreator.tsx**
```typescript
const [formData, setFormData] = useState<BotConfig>({
  name: '',
  description: '',
  category: 'general',
  systemPrompt: '',
  visibility: 'private',
  capabilities: {
    memory: false,
    files: false,
    tools: [],
  },
});

// Update form
const handleNameChange = (e) => {
  setFormData(prev => ({
    ...prev,
    name: e.target.value
  }));
};

// Toggle capability
const toggleMemory = (checked: boolean) => {
  setFormData(prev => ({
    ...prev,
    capabilities: {
      ...prev.capabilities,
      memory: checked
    }
  }));
};
```

## State Management Patterns

### 9. BotLauncher State

```typescript
interface BotLauncherState {
  bot: Bot | null;              // Loaded bot config
  loading: boolean;             // Loading state
  notFound: boolean;            // Access denied/not found
  chats: Chat[];                // All chats with this bot
  currentChatId: string | null; // Active chat
  isLoading: boolean;           // Response loading
  mobileMenuOpen: boolean;      // Mobile sidebar
  sidebarCollapsed: boolean;    // Desktop sidebar
}

const [state, setState] = useState<BotLauncherState>({
  bot: null,
  loading: true,
  notFound: false,
  chats: [],
  currentChatId: null,
  isLoading: false,
  mobileMenuOpen: false,
  sidebarCollapsed: false,
});

// Update state (functional)
setState(prev => ({
  ...prev,
  currentChatId: newChatId,
  chats: [newChat, ...prev.chats]
}));
```

## Database Query Patterns

### 10. Complex Filtering

```typescript
// Get all bots matching criteria
let query = supabase
  .from('bots')
  .select('*')
  
// Filter by visibility
if (userId) {
  // User can see: public bots + own bots
  query = query.or(`visibility.eq.public,creator_id.eq.${userId}`);
} else {
  // Non-authenticated can only see public
  query = query.eq('visibility', 'public');
}

// Filter by category
if (category) {
  query = query.eq('category', category);
}

// Sort
query = query.order('usage_count', { ascending: false });

// Limit
query = query.limit(10);

const { data } = await query;
```

## Error Handling Patterns

### 11. Graceful Degradation

```typescript
const handleBotChat = async (messages: Message[]) => {
  try {
    const response = await puter.ai.chat(formattedMessages, options);
    // Success...
  } catch (error: any) {
    // Extract error type
    const errorMsg = error?.message || String(error);
    const lowerMsg = errorMsg.toLowerCase();
    
    // Provide specific feedback
    if (lowerMsg.includes('rate limit')) {
      toast.error('Rate limit exceeded. Try again later.');
    } else if (lowerMsg.includes('network')) {
      toast.error('Network error. Check your connection.');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }
};
```

## UI Component Patterns

### 12. Bot Card Component

```typescript
<Card>
  <CardHeader>
    {/* Avatar */}
    <img src={bot.pfp_url} className="w-12 h-12 rounded-lg" />
    
    {/* Visibility Badge */}
    <Badge>
      {bot.visibility === 'private' && '🔒 Private'}
      {bot.visibility === 'unlisted' && '👁 Unlisted'}
      {bot.visibility === 'public' && '👥 Public'}
    </Badge>
    
    {/* Name & Category */}
    <h3>{bot.name}</h3>
    <Badge variant="secondary">{bot.category}</Badge>
  </CardHeader>
  
  <CardContent>
    {/* Description */}
    <p className="line-clamp-3">{bot.description}</p>
    
    {/* Stats */}
    <div className="flex justify-between text-xs">
      <span>🔥 {bot.usage_count} uses</span>
      <span>{new Date(bot.created_at).toLocaleDateString()}</span>
    </div>
  </CardContent>
</Card>
```

### 13. Empty States

```typescript
{filteredBots.length > 0 ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredBots.map(bot => (
      <BotCard key={bot.uuid} bot={bot} />
    ))}
  </div>
) : (
  <div className="flex flex-col items-center justify-center h-64">
    <p className="text-lg text-muted-foreground">
      {searchQuery || selectedCategory !== 'all'
        ? 'No bots found. Try adjusting your search.'
        : 'Create your first bot to get started!'}
    </p>
  </div>
)}
```

## Testing Patterns

### 14. Mock Bot for Testing

```typescript
const mockBot: Bot = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  creator_id: 'user-123',
  name: 'Test Bot',
  description: 'A test bot',
  category: 'general',
  pfp_url: null,
  system_prompt: 'You are a helpful assistant.',
  visibility: 'public',
  capabilities: {
    memory: true,
    files: false,
    tools: [],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  usage_count: 5,
};
```

### 15. Integration Test Example

```typescript
test('Create and use a bot', async () => {
  // 1. Create bot
  const bot = await botService.createBot(
    {
      name: 'Test Bot',
      systemPrompt: 'You are helpful',
      category: 'general',
      visibility: 'private',
      description: 'Test',
      capabilities: { memory: false, files: false, tools: [] }
    },
    'user-id'
  );
  
  // 2. Verify created
  expect(bot.uuid).toBeDefined();
  expect(bot.name).toBe('Test Bot');
  
  // 3. Fetch bot
  const fetched = await botService.fetchBotByUuid(bot.uuid, 'user-id');
  expect(fetched).not.toBeNull();
  
  // 4. Record usage
  await botService.recordBotUsage(bot.uuid, 'chat-1', 'user-id', bot);
  
  // 5. Check usage count
  const stats = await botService.getBotStats(bot.uuid);
  expect(stats?.usage_count).toBe(1);
});
```

---

**Key Takeaways:**
- System prompt injection is the core mechanism
- RLS enforces security at database level
- Service layer abstracts Supabase queries
- React patterns follow standard conventions
- Error handling is graceful and user-friendly
