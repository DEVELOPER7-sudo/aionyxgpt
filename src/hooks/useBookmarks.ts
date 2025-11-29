import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookmarkedMessageIds, setBookmarkedMessageIds] = useState<Set<string>>(
    new Set()
  );

  const loadBookmarks = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
      setBookmarkedMessageIds(
        new Set((data || []).map((b) => b.message_id))
      );
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFolders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setFolders(data || []);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    }
  }, []);

  const addBookmark = useCallback(
    async (messageId: string, messageContent: string, folderId?: string) => {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .insert({
            message_id: messageId,
            message_content: messageContent,
            folder_id: folderId,
          })
          .select()
          .single();

        if (error) throw error;
        setBookmarks([data, ...bookmarks]);
        setBookmarkedMessageIds((prev) => new Set([...prev, messageId]));
        toast.success('Message bookmarked');
        return data;
      } catch (error) {
        console.error('Error adding bookmark:', error);
        toast.error('Failed to bookmark message');
        return null;
      }
    },
    [bookmarks]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string, messageId: string) => {
      try {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('id', bookmarkId);

        if (error) throw error;
        setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
        setBookmarkedMessageIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
        toast.success('Bookmark removed');
      } catch (error) {
        console.error('Error removing bookmark:', error);
        toast.error('Failed to remove bookmark');
      }
    },
    [bookmarks]
  );

  const createFolder = useCallback(
    async (name: string) => {
      try {
        const { data, error } = await supabase
          .from('bookmark_folders')
          .insert({ name })
          .select()
          .single();

        if (error) throw error;
        setFolders([...folders, data]);
        toast.success('Folder created');
        return data;
      } catch (error) {
        console.error('Error creating folder:', error);
        toast.error('Failed to create folder');
        return null;
      }
    },
    [folders]
  );

  const deleteFolder = useCallback(
    async (folderId: string) => {
      try {
        const { error } = await supabase
          .from('bookmark_folders')
          .delete()
          .eq('id', folderId);

        if (error) throw error;
        setFolders(folders.filter((f) => f.id !== folderId));
        toast.success('Folder deleted');
      } catch (error) {
        console.error('Error deleting folder:', error);
        toast.error('Failed to delete folder');
      }
    },
    [folders]
  );

  const moveBookmarkToFolder = useCallback(
    async (bookmarkId: string, folderId: string) => {
      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .update({ folder_id: folderId })
          .eq('id', bookmarkId)
          .select()
          .single();

        if (error) throw error;
        setBookmarks(
          bookmarks.map((b) => (b.id === bookmarkId ? data : b))
        );
        toast.success('Bookmark moved');
      } catch (error) {
        console.error('Error moving bookmark:', error);
        toast.error('Failed to move bookmark');
      }
    },
    [bookmarks]
  );

  const isBookmarked = (messageId: string) => {
    return bookmarkedMessageIds.has(messageId);
  };

  return {
    bookmarks,
    folders,
    isLoading,
    loadBookmarks,
    loadFolders,
    addBookmark,
    removeBookmark,
    createFolder,
    deleteFolder,
    moveBookmarkToFolder,
    isBookmarked,
  };
};

export default useBookmarks;
