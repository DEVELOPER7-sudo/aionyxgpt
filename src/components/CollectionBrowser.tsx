import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  FolderPlus,
  Folder,
  FolderOpen,
  MoreVertical,
  Trash2,
  Edit2,
  Archive,
  Share2,
  ChevronRight,
  Plus,
  Search,
  Tag,
  Grid,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Chat } from '@/types/chat';

interface Collection {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  chat_count?: number;
  color?: string;
}

interface CollectionTag {
  id: string;
  tag_name: string;
  color: string;
  chat_count: number;
}

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
];

interface CollectionBrowserProps {
  chats: Chat[];
  onSelectChat?: (chatId: string) => void;
  onNavigateToChat?: () => void;
}

export default function CollectionBrowser({
  chats,
  onSelectChat,
  onNavigateToChat,
}: CollectionBrowserProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<CollectionTag[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    loadCollections();
    loadTags();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('chat_collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCollections(data || []);
    } catch (error) {
      console.error('Error loading collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTags = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_tags')
        .select('*')
        .order('tag_name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const createCollection = async () => {
    if (!newCollectionName.trim()) {
      toast.error('Collection name is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_collections')
        .insert({
          name: newCollectionName,
          color: COLORS[selectedColorIndex],
        })
        .select()
        .single();

      if (error) throw error;
      setCollections([data, ...collections]);
      setNewCollectionName('');
      setIsCreateDialogOpen(false);
      toast.success('Collection created');
    } catch (error) {
      console.error('Error creating collection:', error);
      toast.error('Failed to create collection');
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) {
      toast.error('Tag name is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('chat_tags')
        .insert({
          tag_name: newTagName,
          color: COLORS[selectedColorIndex],
        })
        .select()
        .single();

      if (error) throw error;
      setTags([...tags, data]);
      setNewTagName('');
      toast.success('Tag created');
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_collections')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;
      setCollections(collections.filter((c) => c.id !== collectionId));
      if (selectedCollection === collectionId) setSelectedCollection(null);
      toast.success('Collection deleted');
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('chat_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;
      setTags(tags.filter((t) => t.id !== tagId));
      if (selectedTag === tagId) setSelectedTag(null);
      toast.success('Tag deleted');
    } catch (error) {
      console.error('Error deleting tag:', error);
      toast.error('Failed to delete tag');
    }
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const nestedCollections = collections.filter((c) => !c.parent_id);
  const filteredCollections = nestedCollections.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChatsForCollection = (collectionId: string) => {
    return chats.filter((chat) => chat.id?.includes(collectionId));
  };

  const getChatsForTag = (tagId: string) => {
    return chats.filter((chat) => {
      const chatTags = chat.tags || [];
      return chatTags.includes(tagId);
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <h2 className="text-lg font-semibold mb-4">Collections & Tags</h2>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View Mode & Create */}
        <div className="flex gap-2">
          <div className="flex gap-1 border border-border rounded-md p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1">
                <FolderPlus className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
                <DialogDescription>
                  Organize your chats into collections
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex gap-2">
                    {COLORS.map((color, idx) => (
                      <button
                        key={idx}
                        className={cn(
                          'h-8 w-8 rounded-full border-2 transition-transform',
                          selectedColorIndex === idx
                            ? 'border-foreground scale-110'
                            : 'border-transparent'
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColorIndex(idx)}
                      />
                    ))}
                  </div>
                </div>
                <Button onClick={createCollection} className="w-full">
                  Create Collection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="collections" className="flex-1 flex flex-col">
        <TabsList className="border-b border-border rounded-none w-full justify-start px-4 py-0">
          <TabsTrigger value="collections" className="rounded-none">
            Collections
          </TabsTrigger>
          <TabsTrigger value="tags" className="rounded-none">
            Tags
          </TabsTrigger>
        </TabsList>

        {/* Collections Tab */}
        <TabsContent value="collections" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading collections...
                </div>
              ) : filteredCollections.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No collections yet. Create one to get started!
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 gap-3">
                  {filteredCollections.map((collection) => {
                    const collectionChats = getChatsForCollection(
                      collection.id
                    );
                    return (
                      <div
                        key={collection.id}
                        className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group"
                        onClick={() => {
                          setSelectedCollection(collection.id);
                          onNavigateToChat?.();
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Folder
                            className="h-6 w-6 text-primary"
                            style={{
                              color: collection.color || '#3B82F6',
                            }}
                          />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>
                                <Edit2 className="h-4 w-4 mr-2" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem disabled>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteCollection(collection.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <h3 className="font-medium mb-1 line-clamp-2">
                          {collection.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {collectionChats.length} chat
                          {collectionChats.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCollections.map((collection) => {
                    const collectionChats = getChatsForCollection(
                      collection.id
                    );
                    const isExpanded = expandedFolders.has(collection.id);

                    return (
                      <div key={collection.id}>
                        <div
                          className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer group"
                          onClick={() =>
                            setSelectedCollection(collection.id)
                          }
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFolder(collection.id);
                            }}
                            className="p-1"
                          >
                            <ChevronRight
                              className={cn(
                                'h-4 w-4 transition-transform',
                                isExpanded && 'rotate-90'
                              )}
                            />
                          </button>
                          <Folder
                            className="h-4 w-4 text-primary"
                            style={{
                              color: collection.color || '#3B82F6',
                            }}
                          />
                          <span className="flex-1 text-sm font-medium">
                            {collection.name}
                          </span>
                          <span className="text-xs text-muted-foreground px-2">
                            {collectionChats.length}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteCollection(collection.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {isExpanded && collectionChats.length > 0 && (
                          <div className="pl-8 space-y-1">
                            {collectionChats.slice(0, 5).map((chat) => (
                              <div
                                key={chat.id}
                                className="flex items-center gap-2 p-2 hover:bg-accent rounded text-sm text-muted-foreground cursor-pointer"
                                onClick={() => {
                                  onSelectChat?.(chat.id);
                                  onNavigateToChat?.();
                                }}
                              >
                                <span className="truncate">
                                  {chat.title || 'Untitled'}
                                </span>
                              </div>
                            ))}
                            {collectionChats.length > 5 && (
                              <p className="text-xs text-muted-foreground p-2">
                                +{collectionChats.length - 5} more
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {/* Create Tag */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Create Tag
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Tag</DialogTitle>
                    <DialogDescription>
                      Add tags to organize your chats
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Tag name..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Color</label>
                      <div className="flex gap-2">
                        {COLORS.map((color, idx) => (
                          <button
                            key={idx}
                            className={cn(
                              'h-8 w-8 rounded-full border-2 transition-transform',
                              selectedColorIndex === idx
                                ? 'border-foreground scale-110'
                                : 'border-transparent'
                            )}
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColorIndex(idx)}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={createTag} className="w-full">
                      Create Tag
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tag List */}
              {tags.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No tags yet
                </div>
              ) : (
                <div className="space-y-2">
                  {tags.map((tag) => {
                    const tagChats = getChatsForTag(tag.id);
                    return (
                      <div
                        key={tag.id}
                        className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg group"
                        onClick={() => setSelectedTag(tag.id)}
                      >
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{tag.tag_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {tagChats.length} chat
                            {tagChats.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => deleteTag(tag.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
