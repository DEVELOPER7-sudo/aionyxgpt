// Custom Bots Storage and Management
import { CustomBot } from '@/types/chat';

const STORAGE_KEY = 'onyxgpt_custom_bots';

// Get all custom bots
export const getAllBots = (): CustomBot[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CustomBot[];
    }
    return [];
  } catch (error) {
    console.error('Error loading custom bots:', error);
    return [];
  }
};

// Save bots
export const saveBots = (bots: CustomBot[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bots));
  } catch (error) {
    console.error('Error saving custom bots:', error);
  }
};

// Add new bot
export const addBot = (bot: Omit<CustomBot, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): CustomBot => {
  const bots = getAllBots();
  const newBot: CustomBot = {
    ...bot,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    usageCount: 0,
  };
  bots.push(newBot);
  saveBots(bots);
  return newBot;
};

// Update bot
export const updateBot = (id: string, updates: Partial<CustomBot>) => {
  const bots = getAllBots();
  const index = bots.findIndex(b => b.id === id);
  if (index !== -1) {
    bots[index] = {
      ...bots[index],
      ...updates,
      updatedAt: Date.now(),
    };
    saveBots(bots);
  }
};

// Delete bot
export const deleteBot = (id: string) => {
  const bots = getAllBots();
  const filtered = bots.filter(b => b.id !== id);
  saveBots(filtered);
};

// Get bot by ID
export const getBotById = (id: string): CustomBot | undefined => {
  const bots = getAllBots();
  return bots.find(b => b.id === id);
};

// Increment bot usage
export const incrementBotUsage = (id: string) => {
  const bot = getBotById(id);
  if (bot) {
    updateBot(id, { usageCount: (bot.usageCount || 0) + 1 });
  }
};

// Get public bots only
export const getPublicBots = (): CustomBot[] => {
  return getAllBots().filter(b => b.isPublic);
};

// Export bots as JSON
export const exportBots = () => {
  const bots = getAllBots();
  const dataStr = JSON.stringify(bots, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onyxgpt-custom-bots-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import bots from JSON
export const importBots = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as CustomBot[];
        const currentBots = getAllBots();
        // Merge, avoiding duplicates by ID
        const existingIds = new Set(currentBots.map(b => b.id));
        const newBots = imported.filter(b => !existingIds.has(b.id));
        saveBots([...currentBots, ...newBots]);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
