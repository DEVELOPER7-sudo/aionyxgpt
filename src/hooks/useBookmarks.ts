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
      // Database table doesn't exist yet - feature coming soon
      console.log('Bookmarks feature coming soon');
      setBookmarks([]);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFolders = useCallback(async () => {
    try {
      // Database table doesn't exist yet - feature coming soon
      console.log('Bookmark folders feature coming soon');
      setFolders([]);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast.error('Failed to load folders');
    }
  }, []);

  const addBookmark = useCallback(
    async (messageId: string, messageContent: string, folderId?: string) => {
      try {
        // Database table doesn't exist yet - feature coming soon
        console.log('Add bookmark feature coming soon');
        toast.info('Bookmarks feature coming soon');
        return null;
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
        // Database table doesn't exist yet - feature coming soon
        console.log('Remove bookmark feature coming soon');
        toast.info('Bookmarks feature coming soon');
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
        // Database table doesn't exist yet - feature coming soon
        console.log('Create folder feature coming soon');
        toast.info('Bookmark folders feature coming soon');
        return null;
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
        // Database table doesn't exist yet - feature coming soon
        console.log('Delete folder feature coming soon');
        toast.info('Bookmark folders feature coming soon');
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
        // Database table doesn't exist yet - feature coming soon
        console.log('Move bookmark feature coming soon');
        toast.info('Bookmarks feature coming soon');
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
