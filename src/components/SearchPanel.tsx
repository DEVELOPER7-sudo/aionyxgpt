import { useState, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Chat, ImageGeneration, Memory } from '@/types/chat';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MessageSquare, Image, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchPanelProps {
  onSelectChat: (chatId: string) => void;
}

const SearchPanel = ({ onSelectChat }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats] = useState<Chat[]>(storage.getChats());
  const [images] = useState<ImageGeneration[]>(storage.getImages());
  const [memories] = useState<Memory[]>(storage.getMemories());

  const searchResults = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    const chatResults = chats.filter(chat =>
      chat.title.toLowerCase().includes(query) ||
      chat.messages.some(m => m.content.toLowerCase().includes(query))
    );

    const imageResults = images.filter(img =>
      img.prompt.toLowerCase().includes(query)
    );

    const memoryResults = memories.filter(mem => {
      const title = mem.title || mem.key || '';
      const content = mem.content || mem.value || '';
      return (
        title.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query)
      );
    });

    return { chatResults, imageResults, memoryResults };
  }, [searchQuery, chats, images, memories]);

  const totalResults = 
    searchResults.chatResults.length + 
    searchResults.imageResults.length + 
    searchResults.memoryResults.length;

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-4 animate-fadeIn">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Search</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search across chats, images, and memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glow-blue"
            autoFocus
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {totalResults} result{totalResults !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {!searchQuery ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Type to search across all your data</p>
          </div>
        ) : (
          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="chats">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chats ({searchResults.chatResults.length})
              </TabsTrigger>
              <TabsTrigger value="images">
                <Image className="w-4 h-4 mr-2" />
                Images ({searchResults.imageResults.length})
              </TabsTrigger>
              <TabsTrigger value="memories">
                <Brain className="w-4 h-4 mr-2" />
                Memories ({searchResults.memoryResults.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats" className="space-y-3">
              {searchResults.chatResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No chats found</p>
              ) : (
                searchResults.chatResults.map((chat) => (
                  <Card key={chat.id} className="p-4 animate-slideUp hover:shadow-lg transition-all cursor-pointer" onClick={() => onSelectChat(chat.id)}>
                    <h3 className="font-semibold mb-2">{chat.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chat.messages[chat.messages.length - 1]?.content || 'No messages'}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>{chat.messages.length} messages</span>
                      <span>{new Date(chat.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-3">
              {searchResults.imageResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No images found</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {searchResults.imageResults.map((img) => (
                    <Card key={img.id} className="overflow-hidden animate-slideUp hover:shadow-lg transition-all">
                      <img src={img.imageUrl} alt={img.prompt} className="w-full aspect-square object-cover" />
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground line-clamp-2">{img.prompt}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="memories" className="space-y-3">
              {searchResults.memoryResults.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No memories found</p>
              ) : (
                searchResults.memoryResults.map((memory) => (
                   <Card key={memory.id} className="p-4 animate-slideUp hover:shadow-lg transition-all">
                     <h3 className="font-semibold text-sm badge-blue mb-2">{memory.title || memory.key}</h3>
                     <p className="text-sm">{memory.content || memory.value}</p>
                   </Card>
                 ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
