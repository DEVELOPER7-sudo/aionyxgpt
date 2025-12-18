import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { botService } from '@/services/botService';
import { Bot } from '@/types/chat';
import ChatArea from '@/components/ChatArea';
import ChatSidebar from '@/components/ChatSidebar';
import Header from '@/components/Header';
import { Chat, Message } from '@/types/chat';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import MotionBackground from '@/components/MotionBackground';
import { cn } from '@/lib/utils';
import { useChatPersistence } from '@/hooks/useChatPersistence';
import { useChatSync } from '@/hooks/useChatSync';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAnalytics } from '@/hooks/useFeatures';
import { useDynamicIsland } from '@/hooks/useDynamicIsland';
import { useTheme } from '@/hooks/useTheme';
import { createPuterAPILogger } from '@/lib/api-logger';

interface BotLauncherState {
  bot: Bot | null;
  loading: boolean;
  notFound: boolean;
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
  mobileMenuOpen: boolean;
  sidebarCollapsed: boolean;
}

const BotLauncher = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { playMessageComplete, playError } = useSoundEffects();
  const { recordStats } = useAnalytics();
  const { createTask, updateProgress, completeTask, removeTask } = useDynamicIsland();

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

  // Load bot config
  useEffect(() => {
    const loadBot = async () => {
      if (!uuid) {
        setState((prev) => ({ ...prev, notFound: true, loading: false }));
        return;
      }

      try {
        const botData = await botService.fetchBotByUuid(uuid, user?.id);
        if (!botData) {
          setState((prev) => ({ ...prev, notFound: true, loading: false }));
          return;
        }

        setState((prev) => ({
          ...prev,
          bot: botData,
          loading: false,
        }));
      } catch (error) {
        console.error('Error loading bot:', error);
        setState((prev) => ({ ...prev, notFound: true, loading: false }));
        toast.error('Failed to load bot');
      }
    };

    if (!authLoading && user) {
      loadBot();
    }
  }, [uuid, user?.id, authLoading]);

  // Load chats
  useEffect(() => {
    try {
      const loadedChats = storage.getChats();
      setState((prev) => ({ ...prev, chats: loadedChats }));
      const savedChatId = storage.getCurrentChatId();
      if (savedChatId && loadedChats.find((c) => c.id === savedChatId)) {
        setState((prev) => ({ ...prev, currentChatId: savedChatId }));
      } else if (loadedChats.length > 0) {
        setState((prev) => ({ ...prev, currentChatId: loadedChats[0].id }));
        storage.setCurrentChatId(loadedChats[0].id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error('Failed to load chats');
    }
  }, []);

  // Apply theme if bot has custom theme
  useTheme({
    textModel: 'gpt-5',
    imageModel: 'flux-puter',
    temperature: 0.7,
    maxTokens: 2048,
    enableWebSearch: false,
    enableDeepSearch: false,
  });

  // Persist chats locally
  useChatPersistence(state.chats, state.currentChatId);

  // Sync chats to cloud
  useChatSync(state.chats, user?.id, (chats) =>
    setState((prev) => ({ ...prev, chats }))
  );

  const currentChat = state.chats.find((c) => c.id === state.currentChatId) || null;

  const createNewBotChat = () => {
    if (!state.bot) return;

    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `# 👋 Welcome to ${state.bot.name}

${state.bot.description || 'Ready to assist you with your needs.'}

**Bot created by:** ${state.bot.creator_id}
**Category:** ${state.bot.category || 'General'}

You can switch between chats using the sidebar or create a new chat. However, **you cannot switch to different bots** while in this chat session. To use another bot, go back to the bots gallery.`,
      timestamp: Date.now(),
    };

    const timestamp = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newChat: Chat = {
      id: Date.now().toString(),
      title: `${state.bot.name} Chat - ${timestamp}`,
      messages: [welcomeMessage],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: 'gpt-5',
    };

    storage.addChat(newChat);
    setState((prev) => ({
      ...prev,
      chats: [newChat, ...prev.chats],
      currentChatId: newChat.id,
      mobileMenuOpen: false,
    }));
    storage.setCurrentChatId(newChat.id);

    // Record bot usage
    if (state.bot && user) {
      botService.recordBotUsage(
        state.bot.uuid,
        newChat.id,
        user.id,
        state.bot
      ).catch((err) => console.error('Failed to record bot usage:', err));
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!state.currentChatId || !currentChat || !state.bot) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    const updatedChat = { ...currentChat };
    updatedChat.messages = [...updatedChat.messages, userMessage];
    storage.updateChat(state.currentChatId, { messages: updatedChat.messages });
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((c) =>
        c.id === state.currentChatId ? updatedChat : c
      ),
    }));

    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await handleBotChat(updatedChat.messages, state.currentChatId, state.bot);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleBotChat = async (
    messages: Message[],
    chatId: string,
    bot: Bot
  ) => {
    // @ts-ignore
    const puter = (window as any)?.puter;
    if (!puter?.ai?.chat) {
      toast.error('AI service not available');
      return;
    }

    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const userText = lastUser?.content ?? '';

    if (!userText.trim()) return;

    const controller = new AbortController();

    const logger = createPuterAPILogger();
    const taskTitle = `Chat: ${userText.substring(0, 20)}${
      userText.length > 20 ? '...' : ''
    }`;
    const islandTaskId = createTask(taskTitle, 'chat', 'Waiting for response...');
    let chunkCount = 0;

    try {
      // Inject bot's system prompt
      const finalSystemPrompt = bot.system_prompt;

      const baseMessages = messages
        .filter((m) => typeof m.content === 'string' && m.content.trim().length > 0)
        .map((m) => ({ role: m.role, content: m.content }));

      const formattedMessages = [
        { role: 'system', content: finalSystemPrompt },
        ...baseMessages,
      ];

      const response = await puter.ai.chat(formattedMessages, {
        model: 'gpt-5',
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      });

      let fullResponse = '';
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      const chat = state.chats.find((c) => c.id === chatId);
      if (!chat) return;

      try {
        for await (const part of response) {
          fullResponse += part?.text || '';
          chunkCount++;

          const estimatedProgress = Math.min(chunkCount * 5, 90);
          updateProgress(islandTaskId, estimatedProgress);

          const currentMessages = [
            ...messages,
            { ...assistantMessage, content: fullResponse },
          ];
          storage.updateChat(chatId, { messages: currentMessages });
          setState((prev) => ({
            ...prev,
            chats: prev.chats.map((c) =>
              c.id === chatId ? { ...c, messages: currentMessages } : c
            ),
          }));
        }

        completeTask(islandTaskId);
        removeTask(islandTaskId);

        const tokenEstimate = Math.ceil(fullResponse.length / 4);
        recordStats('gpt-5', tokenEstimate);

        playMessageComplete();
        logger.logSuccess('puter.ai.chat (bot)', { prompt: userText, model: 'gpt-5' }, fullResponse);
      } finally {
        // cleanup
      }
    } catch (error: any) {
      removeTask(islandTaskId);
      logger.logError('puter.ai.chat (bot)', { prompt: userText }, error);
      playError();
      toast.error(error?.message || 'Failed to get response');
      throw error;
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setState((prev) => ({
      ...prev,
      chats: prev.chats.filter((c) => c.id !== chatId),
    }));
    storage.saveChats(state.chats.filter((c) => c.id !== chatId));

    if (state.currentChatId === chatId) {
      setState((prev) => ({ ...prev, currentChatId: null }));
      storage.setCurrentChatId(null);
    }

    toast.success('Chat deleted');
  };

  const handleRegenerateMessage = async (messageId: string) => {
    if (!currentChat || !state.bot) return;

    const messageIndex = currentChat.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const previousMessages = currentChat.messages.slice(0, messageIndex);
    storage.updateChat(state.currentChatId!, { messages: previousMessages });
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((c) =>
        c.id === state.currentChatId ? { ...c, messages: previousMessages } : c
      ),
    }));

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await handleBotChat(previousMessages, state.currentChatId!, state.bot);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!currentChat || !state.bot) return;

    const messageIndex = currentChat.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    const updatedMessages = currentChat.messages.slice(0, messageIndex);
    const editedMessage = { ...currentChat.messages[messageIndex], content: newContent };
    updatedMessages.push(editedMessage);

    storage.updateChat(state.currentChatId!, { messages: updatedMessages });
    setState((prev) => ({
      ...prev,
      chats: prev.chats.map((c) =>
        c.id === state.currentChatId ? { ...c, messages: updatedMessages } : c
      ),
    }));

    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await handleBotChat(updatedMessages, state.currentChatId!, state.bot);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (authLoading || state.loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (state.notFound || !state.bot) {
    return (
      <div className="flex flex-col h-screen w-screen bg-background">
        <MotionBackground />
        <Header showMenuButton={false} user={user} onSignOut={signOut} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-2">Bot Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The bot you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/bots')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Bots Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden relative">
      <MotionBackground />

      <Header
        showMenuButton={true}
        user={user}
        onSignOut={signOut}
      />

      <div className="flex flex-1 overflow-hidden min-h-0 w-full">
        {/* Bot Info Header Bar */}
        <div className="absolute top-16 left-0 right-0 h-14 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b flex items-center px-4 z-20">
          <div className="flex items-center gap-3 flex-1">
            {state.bot.pfp_url ? (
              <img
                src={state.bot.pfp_url}
                alt={state.bot.name}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                {state.bot.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{state.bot.name}</span>
              <span className="text-xs text-muted-foreground">{state.bot.category}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate('/bots')}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Gallery</span>
          </Button>
        </div>

        {/* Sidebar */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            'md:static md:translate-x-0',
            'fixed inset-y-0 left-0 z-40 w-72 md:w-auto md:flex-shrink-0 mt-14',
            state.mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <ChatSidebar
            chats={state.chats}
            currentChatId={state.currentChatId}
            onNewChat={createNewBotChat}
            onSelectChat={(id) => {
              setState((prev) => ({
                ...prev,
                currentChatId: id,
                mobileMenuOpen: false,
              }));
              storage.setCurrentChatId(id);
            }}
            onDeleteChat={handleDeleteChat}
            collapsed={state.sidebarCollapsed}
            onToggleCollapse={() =>
              setState((prev) => ({
                ...prev,
                sidebarCollapsed: !prev.sidebarCollapsed,
              }))
            }
          />
        </div>

        {/* Overlay for mobile */}
        {state.mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden mt-14"
            onClick={() =>
              setState((prev) => ({ ...prev, mobileMenuOpen: false }))
            }
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden min-h-0 max-h-full flex flex-col w-full mt-14">
          {currentChat ? (
            <ChatArea
              chat={currentChat}
              onSendMessage={handleSendMessage}
              onRegenerateMessage={handleRegenerateMessage}
              onEditMessage={handleEditMessage}
              isLoading={state.isLoading}
              currentModel="gpt-5"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-semibold mb-4">No chat yet</p>
                <Button onClick={createNewBotChat} className="gap-2">
                  Start a new chat
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotLauncher;
