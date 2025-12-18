import { useState, useCallback } from 'react';
import { botService } from '@/services/botService';
import { Bot } from '@/types/chat';

export const useBot = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBots = useCallback(
    async (userId?: string, category?: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await botService.fetchBots(userId, category);
        setBots(data);
        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bots';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchBotByUuid = useCallback(
    async (uuid: string, userId?: string) => {
      setLoading(true);
      setError(null);
      try {
        const bot = await botService.fetchBotByUuid(uuid, userId);
        return bot;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch bot';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createBot = useCallback(
    async (config: any, userId: string, pfpFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const newBot = await botService.createBot(config, userId, pfpFile);
        setBots((prev) => [newBot, ...prev]);
        return newBot;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create bot';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateBot = useCallback(
    async (uuid: string, config: any, userId: string, pfpFile?: File) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await botService.updateBot(uuid, config, userId, pfpFile);
        setBots((prev) =>
          prev.map((b) => (b.uuid === uuid ? updated : b))
        );
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update bot';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteBot = useCallback(
    async (uuid: string, userId: string) => {
      setLoading(true);
      setError(null);
      try {
        await botService.deleteBot(uuid, userId);
        setBots((prev) => prev.filter((b) => b.uuid !== uuid));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete bot';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchBots = useCallback(
    async (query: string, userId?: string, limit?: number) => {
      setLoading(true);
      setError(null);
      try {
        const results = await botService.searchBots(query, userId, limit);
        return results;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to search bots';
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    bots,
    loading,
    error,
    fetchBots,
    fetchBotByUuid,
    createBot,
    updateBot,
    deleteBot,
    searchBots,
  };
};
