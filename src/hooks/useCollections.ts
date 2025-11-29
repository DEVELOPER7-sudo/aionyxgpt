import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Collection {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  color?: string;
}

interface CollectionTag {
  id: string;
  tag_name: string;
  color: string;
}

export const useCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [tags, setTags] = useState<CollectionTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCollections = useCallback(async () => {
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
  }, []);

  const loadTags = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('chat_tags')
        .select('*')
        .order('tag_name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast.error('Failed to load tags');
    }
  }, []);

  const createCollection = useCallback(
    async (name: string, color?: string, description?: string) => {
      try {
        const { data, error } = await supabase
          .from('chat_collections')
          .insert({ name, color, description })
          .select()
          .single();

        if (error) throw error;
        setCollections([data, ...collections]);
        toast.success('Collection created');
        return data;
      } catch (error) {
        console.error('Error creating collection:', error);
        toast.error('Failed to create collection');
        return null;
      }
    },
    [collections]
  );

  const updateCollection = useCallback(
    async (collectionId: string, updates: Partial<Collection>) => {
      try {
        const { data, error } = await supabase
          .from('chat_collections')
          .update(updates)
          .eq('id', collectionId)
          .select()
          .single();

        if (error) throw error;
        setCollections(
          collections.map((c) => (c.id === collectionId ? data : c))
        );
        toast.success('Collection updated');
        return data;
      } catch (error) {
        console.error('Error updating collection:', error);
        toast.error('Failed to update collection');
        return null;
      }
    },
    [collections]
  );

  const deleteCollection = useCallback(
    async (collectionId: string) => {
      try {
        const { error } = await supabase
          .from('chat_collections')
          .delete()
          .eq('id', collectionId);

        if (error) throw error;
        setCollections(collections.filter((c) => c.id !== collectionId));
        toast.success('Collection deleted');
      } catch (error) {
        console.error('Error deleting collection:', error);
        toast.error('Failed to delete collection');
      }
    },
    [collections]
  );

  const addChatToCollection = useCallback(async (chatId: string, collectionId: string) => {
    try {
      const { error } = await supabase
        .from('collection_items')
        .insert({ chat_id: chatId, collection_id: collectionId });

      if (error) throw error;
      toast.success('Chat added to collection');
    } catch (error) {
      console.error('Error adding chat to collection:', error);
      toast.error('Failed to add chat to collection');
    }
  }, []);

  const removeChatFromCollection = useCallback(async (chatId: string, collectionId: string) => {
    try {
      const { error } = await supabase
        .from('collection_items')
        .delete()
        .eq('chat_id', chatId)
        .eq('collection_id', collectionId);

      if (error) throw error;
      toast.success('Chat removed from collection');
    } catch (error) {
      console.error('Error removing chat from collection:', error);
      toast.error('Failed to remove chat from collection');
    }
  }, []);

  const createTag = useCallback(
    async (tagName: string, color?: string) => {
      try {
        const { data, error } = await supabase
          .from('chat_tags')
          .insert({ tag_name: tagName, color })
          .select()
          .single();

        if (error) throw error;
        setTags([...tags, data]);
        toast.success('Tag created');
        return data;
      } catch (error) {
        console.error('Error creating tag:', error);
        toast.error('Failed to create tag');
        return null;
      }
    },
    [tags]
  );

  const deleteTag = useCallback(
    async (tagId: string) => {
      try {
        const { error } = await supabase
          .from('chat_tags')
          .delete()
          .eq('id', tagId);

        if (error) throw error;
        setTags(tags.filter((t) => t.id !== tagId));
        toast.success('Tag deleted');
      } catch (error) {
        console.error('Error deleting tag:', error);
        toast.error('Failed to delete tag');
      }
    },
    [tags]
  );

  const addTagToChat = useCallback(async (chatId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('chat_tag_mapping')
        .insert({ chat_id: chatId, tag_id: tagId });

      if (error) throw error;
      toast.success('Tag added to chat');
    } catch (error) {
      console.error('Error adding tag to chat:', error);
      toast.error('Failed to add tag to chat');
    }
  }, []);

  const removeTagFromChat = useCallback(async (chatId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('chat_tag_mapping')
        .delete()
        .eq('chat_id', chatId)
        .eq('tag_id', tagId);

      if (error) throw error;
      toast.success('Tag removed from chat');
    } catch (error) {
      console.error('Error removing tag from chat:', error);
      toast.error('Failed to remove tag from chat');
    }
  }, []);

  return {
    collections,
    tags,
    isLoading,
    loadCollections,
    loadTags,
    createCollection,
    updateCollection,
    deleteCollection,
    addChatToCollection,
    removeChatFromCollection,
    createTag,
    deleteTag,
    addTagToChat,
    removeTagFromChat,
  };
};

export default useCollections;
