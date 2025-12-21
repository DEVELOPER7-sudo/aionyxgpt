import { supabase } from '@/integrations/supabase/client';
import { Bot, BotConfig, BotChat } from '@/types/chat';

export const botService = {
  /**
   * Fetch all public bots and user's own bots
   */
  async fetchBots(userId?: string, category?: string): Promise<Bot[]> {
    try {
      let query = supabase.from('bots').select('*');

      // Filter by visibility - RLS will handle private/unlisted bots
      // Publicly visible bots can be seen by anyone
      // User's own bots can be seen only by that user (RLS enforces this)
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Order by creation date
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching bots:', error);
        console.error('Error details:', error.message, error.details);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in fetchBots:', error);
      return [];
    }
  },

  /**
   * Fetch a single bot by UUID
   */
  async fetchBotByUuid(uuid: string, userId?: string): Promise<Bot | null> {
    const { data, error } = await supabase
      .from('bots')
      .select('*')
      .eq('uuid', uuid)
      .single();

    if (error) {
      console.error('Error fetching bot:', error);
      return null;
    }

    if (!data) return null;

    // Check visibility
    if (
      data.visibility === 'private' &&
      data.creator_id !== userId
    ) {
      return null;
    }

    return data;
  },

  /**
   * Create a new bot
   */
  async createBot(
    config: BotConfig,
    userId: string,
    creatorUsername: string,
    pfpFile?: File
  ): Promise<Bot> {
    let pfpUrl = config.pfpUrl || null;

    // Upload profile picture if provided
    if (pfpFile) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${pfpFile.name}`;
      const { data, error } = await supabase.storage
        .from('bot-avatars')
        .upload(filename, pfpFile);

      if (error) {
        console.error('Error uploading avatar:', error);
      } else if (data) {
        pfpUrl = supabase.storage
          .from('bot-avatars')
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const botData = {
      creator_id: userId,
      creator_username: creatorUsername || null,
      name: config.name.trim(),
      description: config.description && config.description.trim() ? config.description.trim() : null,
      category: config.category || null,
      pfp_url: pfpUrl,
      system_prompt: config.systemPrompt.trim(),
      model_id: config.model_id || 'gpt-5',
      visibility: config.visibility || 'private',
      capabilities: config.capabilities || { memory: false, files: false, tools: [] },
    };

    console.log('Creating bot with data:', botData);

    const { data, error } = await supabase
      .from('bots')
      .insert([botData])
      .select()
      .single();

    if (error) {
      console.error('Error creating bot:', error);
      console.error('Sent data:', botData);
      const errorMessage = error.message || 'Failed to create bot. Please check your input and try again.';
      const err = new Error(errorMessage);
      throw err;
    }

    return data;
  },

  /**
   * Update an existing bot
   */
  async updateBot(
    uuid: string,
    config: Partial<BotConfig>,
    userId: string,
    pfpFile?: File
  ): Promise<Bot> {
    let pfpUrl = config.pfpUrl;

    // Upload new profile picture if provided
    if (pfpFile) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${pfpFile.name}`;
      const { data, error } = await supabase.storage
        .from('bot-avatars')
        .upload(filename, pfpFile);

      if (error) {
        console.error('Error uploading avatar:', error);
      } else if (data) {
        pfpUrl = supabase.storage
          .from('bot-avatars')
          .getPublicUrl(data.path).data.publicUrl;
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (config.name) updateData.name = config.name.trim();
    if (config.description !== undefined) updateData.description = config.description && config.description.trim() ? config.description.trim() : null;
    if (config.category) updateData.category = config.category;
    if (config.systemPrompt) updateData.system_prompt = config.systemPrompt.trim();
    if (config.model_id) updateData.model_id = config.model_id;
    if (config.visibility) updateData.visibility = config.visibility;
    if (config.capabilities) updateData.capabilities = config.capabilities;
    if (pfpUrl) updateData.pfp_url = pfpUrl;

    console.log('Updating bot with data:', updateData);

    const { data, error } = await supabase
      .from('bots')
      .update(updateData)
      .eq('uuid', uuid)
      .eq('creator_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating bot:', error);
      console.error('Sent data:', updateData);
      const errorMessage = error.message || 'Failed to update bot. Please check your input and try again.';
      const err = new Error(errorMessage);
      throw err;
    }

    return data;
  },

  /**
   * Delete a bot
   */
  async deleteBot(uuid: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('uuid', uuid)
      .eq('creator_id', userId);

    if (error) {
      console.error('Error deleting bot:', error);
      throw error;
    }
  },

  /**
   * Record bot usage in chat
   */
  async recordBotUsage(
    botUuid: string,
    chatId: string,
    userId: string,
    botConfig: Partial<Bot>
  ): Promise<BotChat> {
    const { data, error } = await supabase
      .from('bot_chats')
      .insert([
        {
          bot_uuid: botUuid,
          chat_id: chatId,
          user_id: userId,
          bot_config: botConfig,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error recording bot usage:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get bot by chat ID
   */
  async getBotByChat(chatId: string, userId: string): Promise<Bot | null> {
    const { data, error } = await supabase
      .from('bot_chats')
      .select('bot_uuid, bot_config')
      .eq('chat_id', chatId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    // Return the snapshot config
    return data.bot_config as Bot;
  },

  /**
   * Increment bot usage count
   */
  async incrementUsageCount(uuid: string): Promise<void> {
    const { error } = await supabase.rpc('increment_bot_usage', {
      bot_uuid: uuid,
    });

    if (error) {
      console.error('Error incrementing usage count:', error);
    }
  },

  /**
   * Get bot statistics
   */
  async getBotStats(uuid: string): Promise<{ usage_count: number } | null> {
    const { data, error } = await supabase
      .from('bots')
      .select('usage_count')
      .eq('uuid', uuid)
      .single();

    if (error) {
      console.error('Error fetching bot stats:', error);
      return null;
    }

    return data;
  },

  /**
   * Search bots by name or description
   */
  async searchBots(
    query: string,
    userId?: string,
    limit: number = 10
  ): Promise<Bot[]> {
    let q = supabase
      .from('bots')
      .select('*')
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );

    if (userId) {
      q = q.or(`visibility.eq.public,creator_id.eq.${userId}`);
    } else {
      q = q.eq('visibility', 'public');
    }

    const { data, error } = await q
      .order('usage_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching bots:', error);
      return [];
    }

    return data || [];
  },
};
