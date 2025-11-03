export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
  imagePrompt?: string;
  attachments?: string[];
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
  key: string;
  value: string;
  timestamp: number;
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
  taskMode?: 'standard' | 'reasoning' | 'research' | 'creative';
  provider?: 'puter' | 'openrouter';
  customOpenRouterKey?: string;
}
