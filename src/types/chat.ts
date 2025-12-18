import { DetectedTrigger } from '@/lib/triggers';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
  imagePrompt?: string;
  attachments?: string[];
  triggers?: DetectedTrigger[]; // Triggers detected in user message
  rawContent?: string; // Original content with tags (for assistant messages)
  taggedSegments?: Array<{ 
    tag: string; 
    content: string; 
    startIndex: number; 
    endIndex: number;
  }>;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  model: string;
}

export interface ImageGeneration {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
  model: string;
  chatId?: string;
}

export interface Memory {
  id: string;
  title: string;  // Only field - the memory content
  timestamp: number;
  category?: string;
  expiresAt?: number;
  importance?: 'low' | 'medium' | 'high';
  tags?: string[];
  autoExtracted?: boolean;
  organization?: string;
}

export interface AppSettings {
  textModel: string;
  imageModel: string;
  temperature: number;
  maxTokens: number;
  enableWebSearch: boolean;
  enableDeepSearch: boolean;
  enableDebugLogs?: boolean;
  themeColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  sidebarColor?: string; // New: sidebar color customization
  taskMode?: 'standard' | 'reasoning' | 'research' | 'creative';
  provider?: 'puter' | 'openrouter';
  customOpenRouterKey?: string;
  streamingEnabled?: boolean; // New: toggle streaming
  defaultTriggers?: string[]; // Default triggers to apply to all messages
  customModelPrefix?: 'openrouter' | 'togetherai'; // Custom model API prefix
  useCustomSystemPrompt?: boolean; // Toggle custom system prompt
  customSystemPrompt?: string; // Custom system prompt text
  speechEnabled?: boolean; // Enable text-to-speech for responses
  speechVoice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'; // Voice for text-to-speech
  autoPlaySpeech?: boolean; // Auto-play speech for assistant responses
}

export interface CustomBot {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  logo?: string;
  category?: string;
  isPublic: boolean;
  createdBy?: string;
  createdAt: number;
  updatedAt: number;
  usageCount?: number;
}

export interface Bot {
  uuid: string;
  creator_id: string;
  name: string;
  description?: string;
  category?: string;
  pfp_url?: string;
  system_prompt: string;
  visibility: 'private' | 'unlisted' | 'public';
  capabilities: {
    memory: boolean;
    files: boolean;
    tools: string[];
  };
  created_at: string;
  updated_at: string;
  usage_count: number;
}

export interface BotChat {
  id: string;
  bot_uuid: string;
  chat_id: string;
  user_id: string;
  bot_config: Partial<Bot>;
  created_at: string;
}

export interface BotConfig {
  name: string;
  description: string;
  category: string;
  pfpUrl?: string;
  systemPrompt: string;
  visibility: 'private' | 'unlisted' | 'public';
  capabilities: {
    memory: boolean;
    files: boolean;
    tools: string[];
  };
}
