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
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import {
  Bookmark,
  BookmarkPlus,
  Folder,
  FolderPlus,
  MoreVertical,
  Trash2,
  Search,
  Copy,
  Download,
  FileText,
  Grid,
  List,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Bookmark {
  id: string;
  message_id: string;
  message_content: string;
  folder_id?: string;
  created_at: string;
  chat_title?: string;
}

interface BookmarkFolder {
  id: string;
  name: string;
  created_at: string;
  bookmark_count?: number;
}

interface BookmarksPanelProps {
  visible?: boolean;
}

const CITATION_FORMATS = {
  APA: (content: string) =>
    `Author. (Year). "${content}". Retrieved from bookmark.`,
  MLA: (content: string) => `"${content}." Bookmark, n.d. Web.`,
  Chicago: (content: string) => `"${content}." Accessed through bookmark.`,
};

export default function BookmarksPanel({ visible = true }: BookmarksPanelProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago'>(
    'APA'
  );

  useEffect(() => {
    if (visible) {
      loadBookmarks();
      loadFolders();
    }
  }, [visible]);

  const loadBookmarks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast.error('Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFolders = async () => {
    try {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error('Folder name is required');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .insert({ name: newFolderName })
        .select()
        .single();

      if (error) throw error;
      setFolders([...folders, data]);
      setNewFolderName('');
      toast.success('Folder created');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;
      setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
      toast.success('Bookmark removed');
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast.error('Failed to delete bookmark');
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const { error } = await supabase
        .from('bookmark_folders')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      setFolders(folders.filter((f) => f.id !== folderId));
      if (selectedFolder === folderId) setSelectedFolder(null);
      toast.success('Folder deleted');
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
    }
  };

  const moveBookmarkToFolder = async (bookmarkId: string, folderId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .update({ folder_id: folderId })
        .eq('id', bookmarkId);

      if (error) throw error;
      loadBookmarks();
      toast.success('Bookmark moved');
    } catch (error) {
      console.error('Error moving bookmark:', error);
      toast.error('Failed to move bookmark');
    }
  };

  const copyCitation = (content: string) => {
    const citation = CITATION_FORMATS[citationFormat](content);
    navigator.clipboard.writeText(citation);
    toast.success(`Citation copied (${citationFormat})`);
  };

  const exportBookmarks = () => {
    const data = {
      bookmarks: bookmarks.map((b) => ({
        content: b.message_content,
        folder: folders.find((f) => f.id === b.folder_id)?.name,
        created: b.created_at,
        from_chat: b.chat_title,
      })),
      exported_at: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Bookmarks exported');
  };

  const filteredBookmarks = bookmarks
    .filter((b) =>
      b.message_content
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .filter((b) => !selectedFolder || b.folder_id === selectedFolder);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-3">
        <h2 className="text-lg font-semibold">My Bookmarks</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Controls */}
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

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Bookmarks</DialogTitle>
                <DialogDescription>
                  Choose citation format for export
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="format" className="text-sm">
                    Citation Format
                  </Label>
                  <select
                    id="format"
                    value={citationFormat}
                    onChange={(e) =>
                      setCitationFormat(e.target.value as any)
                    }
                    className="w-full mt-2 px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="APA">APA</option>
                    <option value="MLA">MLA</option>
                    <option value="Chicago">Chicago</option>
                  </select>
                </div>
                <Button onClick={exportBookmarks} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="flex-1 flex flex-col">
        <TabsList className="border-b border-border rounded-none w-full justify-start px-4 py-0">
          <TabsTrigger value="all" className="rounded-none">
            All ({bookmarks.length})
          </TabsTrigger>
          <TabsTrigger value="folders" className="rounded-none">
            Folders
          </TabsTrigger>
        </TabsList>

        {/* All Bookmarks Tab */}
        <TabsContent value="all" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading bookmarks...
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {searchQuery
                    ? 'No bookmarks match your search'
                    : 'No bookmarks yet. Start bookmarking important messages!'}
                </div>
              ) : viewMode === 'list' ? (
                filteredBookmarks.map((bookmark) => {
                  const folderName = folders.find(
                    (f) => f.id === bookmark.folder_id
                  )?.name;
                  return (
                    <div
                      key={bookmark.id}
                      className="bg-card border border-border rounded-lg p-3 space-y-2 hover:border-primary transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm line-clamp-3">
                            {bookmark.message_content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            From: {bookmark.chat_title || 'Unknown Chat'}
                          </p>
                          {folderName && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Folder className="h-3 w-3" />
                              {folderName}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                copyCitation(bookmark.message_content)
                              }
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              Citation
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  bookmark.message_content
                                );
                                toast.success('Copied to clipboard');
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => deleteBookmark(bookmark.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bookmark.created_at).toLocaleString()}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredBookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="bg-card border border-border rounded-lg p-3 space-y-2 hover:border-primary transition-colors group flex flex-col"
                    >
                      <p className="text-sm line-clamp-4 flex-1">
                        {bookmark.message_content}
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">
                          {bookmark.chat_title || 'Unknown Chat'}
                        </p>
                        <div className="flex gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs flex-1"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  deleteBookmark(bookmark.id)
                                }
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Folders Tab */}
        <TabsContent value="folders" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {/* Create Folder */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="sm">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Folder
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                    <DialogDescription>
                      Organize your bookmarks
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <Button
                      onClick={createFolder}
                      className="w-full"
                      disabled={!newFolderName.trim()}
                    >
                      Create Folder
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Folder List */}
              {folders.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No folders yet
                </div>
              ) : (
                folders.map((folder) => {
                  const folderBookmarks = bookmarks.filter(
                    (b) => b.folder_id === folder.id
                  );
                  return (
                    <div
                      key={folder.id}
                      className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg group cursor-pointer"
                      onClick={() =>
                        setSelectedFolder(
                          selectedFolder === folder.id ? null : folder.id
                        )
                      }
                    >
                      <Folder className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{folder.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {folderBookmarks.length} item
                          {folderBookmarks.length !== 1 ? 's' : ''}
                        </p>
                      </div>
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
                          <DropdownMenuItem
                            onClick={() => deleteFolder(folder.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
