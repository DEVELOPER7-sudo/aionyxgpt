import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { useVisionAI } from '@/hooks/useVisionAI';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useAnalytics } from '@/hooks/useFeatures';
import { toast } from 'sonner';

import LoadingDots from '@/components/LoadingDots';
import WelcomeMessage from '@/components/WelcomeMessage';
import CollapsibleTriggerTag from '@/components/CollapsibleTriggerTag';

import {
    Send,
    Image as ImageIcon,
    Copy,
    RotateCcw,
    Loader2,
    Square,
    X,
    Paperclip,
    ChevronDown,
    Edit2,
  } from 'lucide-react';
import { Chat, Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (content: string, imageData?: { imageUrl: string; prompt: string }, selectedTriggers?: string[]) => void;
  onRegenerateMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  isLoading: boolean;
  onStopGeneration: () => void;
  webSearchEnabled: boolean;
  deepSearchEnabled: boolean;
  onToggleWebSearch: () => void;
  onToggleDeepSearch: () => void;
  currentModel?: string;
  taskMode?: 'standard' | 'reasoning' | 'research' | 'creative';
  onTaskModeChange?: (mode: 'standard' | 'reasoning' | 'research' | 'creative') => void;
}

const ChatArea = ({
  chat,
  onSendMessage,
  onRegenerateMessage,
  onEditMessage,
  isLoading,
  onStopGeneration,
  webSearchEnabled,
  deepSearchEnabled,
  onToggleWebSearch,
  onToggleDeepSearch,
  currentModel = 'gpt-5-nano',
  taskMode = 'standard',
  onTaskModeChange,
}: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set());
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
   const scrollRef = useRef<HTMLDivElement>(null);
   const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userHasScrolled = useRef(false);
  const lastMessageCount = useRef(0);
  const { analyzeImage, isAnalyzing } = useVisionAI();
  const { uploadFile, isUploading } = useFileUpload();
  const { playButtonClick, playMessageSent } = useSoundEffects();
  const { recordStats } = useAnalytics();

  // Extract thinking and main content separately - handle incomplete tags
  const processThinking = (content: string): { thinking: string | null; main: string; isThinking: boolean } => {
    const thinkStartIndex = content.indexOf('<think>');
    const thinkEndIndex = content.indexOf('</think>');
    
    // No thinking tags at all
    if (thinkStartIndex === -1) {
      return { thinking: null, main: content, isThinking: false };
    }
    
    // Has opening tag but no closing tag yet (still streaming thinking)
    if (thinkStartIndex !== -1 && thinkEndIndex === -1) {
      const thinking = content.slice(thinkStartIndex + 7); // Everything after <think>
      return { thinking, main: '', isThinking: true };
    }
    
    // Has both tags (thinking complete)
    if (thinkStartIndex !== -1 && thinkEndIndex !== -1) {
      const thinking = content.slice(thinkStartIndex + 7, thinkEndIndex).trim();
      const main = content.slice(thinkEndIndex + 8).trim(); // Everything after </think>
      return { thinking, main, isThinking: false };
    }
    
    return { thinking: null, main: content, isThinking: false };
  };

  const scrollToBottom = (instant = false) => {
    if (bottomRef.current) {
      // Always scroll during loading, unless user explicitly scrolled up
      if (!isLoading || !userHasScrolled.current) {
        bottomRef.current.scrollIntoView({ behavior: instant ? 'auto' : 'smooth', block: 'end' });
      }
    }
  };

  // Detect user scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      userHasScrolled.current = !isAtBottom;
      setShowScrollBottom(!isAtBottom);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // Allow free scrolling - disable auto-scroll when user scrolls up
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      if (!isAtBottom) {
        userHasScrolled.current = true;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: true });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  // Reset scroll lock when chat changes or new message from user
  useEffect(() => {
    userHasScrolled.current = false;
    lastMessageCount.current = 0;
    scrollToBottom(true);
  }, [chat?.id]);

  // Auto-scroll only if user hasn't manually scrolled up
  useEffect(() => {
    const messageCount = chat?.messages.length || 0;
    const isNewUserMessage = messageCount > lastMessageCount.current;
    
    if (isNewUserMessage) {
      userHasScrolled.current = false;
    }
    
    lastMessageCount.current = messageCount;
    scrollToBottom();
  }, [chat?.messages, isLoading]);

  useEffect(() => {
    if (!scrollRef.current || userHasScrolled.current) return;
    const observer = new MutationObserver(() => {
      if (isLoading && !userHasScrolled.current) scrollToBottom();
    });
    observer.observe(scrollRef.current, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [isLoading]);

  // Persist input drafts per chat to prevent accidental loss
  useEffect(() => {
    if (chat) {
      const draft = localStorage.getItem(`draft_${chat.id}`);
      if (draft) setInput(draft);
    }
  }, [chat?.id]);

  useEffect(() => {
    if (chat) {
      localStorage.setItem(`draft_${chat.id}`, input);
    }
  }, [chat?.id, input]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = (file.type && file.type.startsWith('image/')) || /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(file.name);
    if (!isImage) {
      toast.error('Please select an image file');
      return;
    }

    // Upload to storage
    const uploadedFile = await uploadFile(file);
    if (uploadedFile) {
      setUploadedImage(uploadedFile.url);
      toast.success('Image uploaded! Add a question or click send to analyze.');
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !uploadedImage) return;
    if (isLoading || isAnalyzing) return;

    playMessageSent();

    // If image is uploaded, pass it to parent with message
    if (uploadedImage) {
      const prompt = input.trim() || 'What do you see in this image?';
      onSendMessage(prompt, { imageUrl: uploadedImage, prompt }, selectedTriggers);
      setInput('');
      setUploadedImage(null);
      if (chat) localStorage.removeItem(`draft_${chat.id}`);
    } else {
      onSendMessage(input, undefined, selectedTriggers);
      setInput('');
      if (chat) localStorage.removeItem(`draft_${chat.id}`);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const startEditingMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditingMessageContent(content);
  };

  const saveEditedMessage = () => {
    if (editingMessageId && editingMessageContent.trim()) {
      onEditMessage(editingMessageId, editingMessageContent);
      setEditingMessageId(null);
      setEditingMessageContent('');
    }
  };

  const cancelEditingMessage = () => {
    setEditingMessageId(null);
    setEditingMessageContent('');
  };

  if (!chat) {
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No chat selected</h3>
            <p className="text-muted-foreground">Start a new chat or select an existing one</p>
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="flex flex-col h-full w-full overflow-hidden">
       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-2 md:p-4 relative" ref={scrollRef}>
        {chat.messages.length === 0 ? (
          <WelcomeMessage />
        ) : (
          <div className="max-w-4xl mx-auto space-y-4 pb-4">
            {chat.messages.map((message, idx) => (
              <div
                key={message.id + '-' + idx}
                className={cn(
                  'flex gap-3 w-full',
                  message.role === 'user' ? 'justify-end animate-slide-in-right' : 'justify-start animate-slide-in-left'
                )}
              >
              <div
                className={cn(
                  'max-w-[90%] sm:max-w-[85%] min-w-0 rounded-2xl p-3 md:p-4 shadow-lg transition-all duration-300 hover:shadow-xl animate-blur-in',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground hover:scale-[1.02] hover:shadow-primary/50'
                    : 'bg-card border border-border hover:border-primary/30 hover:shadow-primary/20'
                )}
              >
                {message.imageUrl && (
                  <div className="mb-3">
                    <img
                      src={message.imageUrl}
                      alt={message.imagePrompt || 'Uploaded image'}
                      className="rounded-lg max-w-full h-auto max-h-96 object-contain"
                    />
                    {message.imagePrompt && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Prompt: {message.imagePrompt}
                      </p>
                    )}
                  </div>
                )}
                {message.role === 'assistant' ? (
                  (() => {
                    const { thinking, main, isThinking } = processThinking(message.content);
                    const isExpanded = expandedThinking.has(message.id);
                    
                    return (
                      <div className="w-full">
                        {thinking && (
                          <Card className={cn(
                            "my-4 p-4 border-2 border-indigo-500/30 bg-indigo-500/5 transition-all duration-300 hover:shadow-xl hover:border-indigo-500/60 hover:bg-indigo-500/10",
                            isThinking && "animate-pulse-blur"
                          )}>
                            <button
                              onClick={() => {
                                const newExpanded = new Set(expandedThinking);
                                if (isExpanded) {
                                  newExpanded.delete(message.id);
                                } else {
                                  newExpanded.add(message.id);
                                }
                                setExpandedThinking(newExpanded);
                              }}
                              className="w-full flex items-center gap-2 pb-2 border-b border-indigo-500/20 hover:bg-indigo-500/5 transition-colors duration-300 rounded px-2 -mx-2"
                            >
                              <span className="text-lg animate-float">💭</span>
                              <Badge variant="outline" className="font-mono text-xs bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20 transition-all duration-300">
                                &lt;think&gt;
                              </Badge>
                              <span className={cn(
                                "text-xs text-muted-foreground ml-auto",
                                isThinking && "animate-pulse font-semibold text-indigo-500"
                              )}>
                                {isThinking ? '🔄 Streaming...' : 'Reasoning Process'}
                              </span>
                              <span className={cn(
                                "text-xs transition-transform duration-300",
                                isExpanded && "rotate-180"
                              )}>{isExpanded ? '▼' : '▶'}</span>
                            </button>
                            {isExpanded && (
                              <div className="mt-3 prose prose-sm dark:prose-invert max-w-none animate-expand-blur overflow-hidden">
                                <ReactMarkdown 
                                  remarkPlugins={[remarkGfm, remarkMath]}
                                  rehypePlugins={[rehypeKatex]}
                                >
                                  {thinking}
                                </ReactMarkdown>
                                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-indigo-500/20 opacity-60 hover:opacity-100 transition-opacity duration-300">
                                  <Badge variant="outline" className="font-mono text-xs bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:bg-indigo-500/20 transition-all duration-300">
                                    &lt;/think&gt;
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </Card>
                        )}
                        
                        {/* Collapsible trigger tags - only showing tagged content */}
                          {message.taggedSegments && message.taggedSegments.length > 0 ? (
                            <>
                              {message.taggedSegments.map((segment, idx) => {
                                const trigger = message.triggers?.find(t => t.tag === segment.tag);
                                return (
                                  <CollapsibleTriggerTag
                                    key={`${message.id}-${segment.tag}-${idx}`}
                                    tagName={segment.tag}
                                    content={segment.content}
                                    category={trigger?.category}
                                    autoExpand={false}
                                    onCopy={() => {
                                      const textToCopy = `<${segment.tag}>\n${segment.content}\n</${segment.tag}>`;
                                      navigator.clipboard.writeText(textToCopy);
                                      toast.success(`Copied ${segment.tag} content to clipboard`);
                                    }}
                                  />
                                );
                              })}
                             {/* Show any remaining content after all tags */}
                             {main && main.trim() && (
                               <div className="prose prose-sm dark:prose-invert max-w-none min-w-0 overflow-hidden mt-4">
                                 <ReactMarkdown 
                                   remarkPlugins={[remarkGfm, remarkMath]}
                                   rehypePlugins={[rehypeKatex]}
                                 >
                                   {main}
                                 </ReactMarkdown>
                               </div>
                             )}
                           </>
                         ) : (
                           <div className="prose prose-sm dark:prose-invert max-w-none min-w-0 overflow-hidden">
                             <ReactMarkdown 
                               remarkPlugins={[remarkGfm, remarkMath]}
                               rehypePlugins={[rehypeKatex]}
                             >
                               {main || message.content || ''}
                             </ReactMarkdown>
                           </div>
                         )}
                      </div>
                    );
                  })()
                ) : editingMessageId === message.id ? (
                  <div className="space-y-2 animate-scale-in">
                    <Textarea
                      value={editingMessageContent}
                      onChange={(e) => setEditingMessageContent(e.target.value)}
                      className="min-h-[100px] bg-background/50"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={saveEditedMessage}
                        disabled={isLoading}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Save & Regenerate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingMessage}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere min-w-0" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                    {message.content}
                  </p>
                )}
                {message.role === 'assistant' && (
                   <div className="flex gap-2 mt-3 pt-3 border-t border-border animate-fade-in flex-wrap">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 transition-all duration-200 hover:scale-110"
                        onClick={() => copyToClipboard(message.content)}
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 transition-all duration-200 hover:scale-110 hover:rotate-180"
                        onClick={() => onRegenerateMessage(message.id)}
                        title="Regenerate message"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                {message.role === 'user' && !editingMessageId && (
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs transition-all duration-200 hover:scale-105"
                      onClick={() => startEditingMessage(message.id, message.content)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                )}

              </div>
            </div>
          ))}
          {/* Show loading spinner with stop button visible */}
          {isLoading && (
            <div className="flex gap-3 animate-bounce-in items-start">
              <div className="bg-card border border-primary/40 rounded-2xl p-4 shadow-lg shadow-primary/20 flex items-center gap-3 animate-glow-pulse backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <LoadingDots />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onStopGeneration}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 font-semibold hover:scale-105"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Stop
                </Button>
              </div>
            </div>
          )}
           </div>
          )}
          <div ref={bottomRef} />
          
          {/* Scroll to Bottom Button */}
          {showScrollBottom && (
           <div className="fixed bottom-24 right-8 animate-bounce-in">
             <Button
               onClick={() => {
                 userHasScrolled.current = false;
                 scrollToBottom();
               }}
               className="rounded-full h-12 w-12 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
               size="icon"
             >
               <ChevronDown className="w-5 h-5" />
             </Button>
           </div>
          )}
          </div>



      {/* Input Area */}
      <div className="border-t border-border p-2 md:p-4 bg-card/50 backdrop-blur-sm flex-shrink-0 z-10 safe-bottom">
        <div className="max-w-4xl mx-auto space-y-2 md:space-y-3">
          {/* Image Preview */}
          {uploadedImage && (
            <div className="relative inline-block animate-scale-in hover:shadow-lg hover:shadow-primary/30 rounded-lg transition-all duration-300">
              <img src={uploadedImage} alt="Upload preview" className="h-20 w-20 object-cover rounded-lg border border-primary/40 hover:border-primary/80 transition-all duration-300 hover:scale-105" />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive hover:bg-destructive/90 animate-scale-in hover:scale-110 transition-all duration-200"
                onClick={() => setUploadedImage(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Input with Character Counter */}
          <div className="space-y-1">
            <div className="flex gap-1 md:gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => {
                    if (e.target.value.length <= 10000) {
                      setInput(e.target.value);
                    }
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message or /img for images..."
                  maxLength={10000}
                  className="flex-1 min-h-[60px] max-h-[150px] resize-none text-base"
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {input.length}/10000
                </span>
              </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
               variant="ghost"
               size="icon"
               className="h-10 w-10 flex-shrink-0 hover:scale-110 hover:bg-primary/10 transition-all duration-300 hover:text-primary"
               onClick={() => fileInputRef.current?.click()}
               title="Upload image for vision AI"
             >
               <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
             </Button>

             <Button
               onClick={handleSend}
               disabled={isLoading || isAnalyzing || isUploading}
               className={cn(
                 "h-10 w-10 flex-shrink-0 transition-all duration-300 hover:scale-110",
                 isLoading || isAnalyzing || isUploading ? "bg-primary/70" : "hover:shadow-lg hover:shadow-primary/50"
               )}
               size="icon"
             >
               {isLoading || isAnalyzing || isUploading ? (
                 <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
               ) : (
                 <Send className="w-4 h-4 md:w-5 md:h-5" />
               )}
             </Button>
            </div>
            </div>
            </div>
      </div>
    </div>
  );
};

export default ChatArea;
