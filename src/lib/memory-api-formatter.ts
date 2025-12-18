// Memory API Formatter
// Formats memory data into API-compatible structure
// Prevents prebuilt/default information from being injected

import { Memory } from '@/types/chat';

export interface MemoryAPIPayload {
  memories: MemoryEntry[];
  metadata: {
    total: number;
    byCategory: Record<string, number>;
    byImportance: Record<string, number>;
    byOrganization: Record<string, number>;
  };
}

export interface MemoryEntry {
  id: string;
  title: string; // Key/Title
  content: string; // Value/Content
  category: string;
  importance: 'low' | 'medium' | 'high';
  tags: string[]; // Comma-separated
  organization?: string;
  createdAt: number;
  expiresAt?: number;
  autoExtracted: boolean;
}

/**
 * Format single memory into API-compatible structure
 * Ensures all user memories are properly formatted
 */
export const formatMemoryEntry = (memory: Memory): MemoryEntry => {
  // Support both old and new field names for backward compatibility
  const title = memory.title || memory.key || '';
  const content = memory.content || memory.value || '';
  
  return {
    id: memory.id,
    title,
    content,
    category: memory.category || 'Personal',
    importance: memory.importance || 'medium',
    tags: memory.tags || [],
    organization: memory.organization,
    createdAt: memory.timestamp,
    expiresAt: memory.expiresAt,
    autoExtracted: memory.autoExtracted || false,
  };
};

/**
 * Format all memories into complete API payload
 * Only includes user-added memories, never injects prebuilt data
 */
export const formatMemoriesForAPI = (memories: Memory[]): MemoryAPIPayload => {
  // Only include non-expired memories
  const now = Date.now();
  const activeMemories = memories.filter(m => !m.expiresAt || m.expiresAt > now);

  // Format each memory
  const formattedMemories = activeMemories.map(formatMemoryEntry);

  // Calculate metadata
  const byCategory: Record<string, number> = {};
  const byImportance: Record<string, number> = { high: 0, medium: 0, low: 0 };
  const byOrganization: Record<string, number> = {};

  activeMemories.forEach(memory => {
    const category = memory.category || 'Personal';
    const importance = memory.importance || 'medium';
    const org = memory.organization || 'Not Specified';

    byCategory[category] = (byCategory[category] || 0) + 1;
    byImportance[importance] = (byImportance[importance] || 0) + 1;
    byOrganization[org] = (byOrganization[org] || 0) + 1;
  });

  return {
    memories: formattedMemories,
    metadata: {
      total: formattedMemories.length,
      byCategory,
      byImportance,
      byOrganization,
    },
  };
};

/**
 * Validate that memory doesn't contain prebuilt/default information
 * Returns true only if memory is genuinely user-provided
 */
export const isValidUserMemory = (memory: Memory): boolean => {
  const prebuiltPatterns = [
    /software developer/i,
    /python programmer/i,
    /software engineer/i,
    /ai developer/i,
    /default user/i,
    /test user/i,
    /demo account/i,
  ];

  const text = `${memory.title || memory.key} ${memory.content || memory.value}`.toLowerCase();

  // If key or value matches prebuilt patterns, it's not a valid user memory
  const hasPrebuiltContent = prebuiltPatterns.some(pattern => pattern.test(text));

  // Also check if it's auto-extracted (may want to filter these)
  const isAutoExtracted = memory.autoExtracted === true;

  return !hasPrebuiltContent && !isAutoExtracted;
};

/**
 * Filter memories to remove any prebuilt/default content
 */
export const filterUserMemories = (memories: Memory[]): Memory[] => {
  return memories.filter(isValidUserMemory);
};

/**
 * Get memory statistics
 */
export const getMemoryStats = (memories: Memory[]) => {
  const payload = formatMemoriesForAPI(memories);

  return {
    totalMemories: payload.metadata.total,
    categories: Object.keys(payload.metadata.byCategory),
    organizations: Object.keys(payload.metadata.byOrganization),
    topCategory: Object.entries(payload.metadata.byCategory).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0],
    topOrganization: Object.entries(payload.metadata.byOrganization).sort(
      ([, a], [, b]) => b - a
    )[0]?.[0],
  };
};

/**
 * Create clean memory summary for API
 * This replaces the old memory context generation that could inject prebuilt data
 */
export const generateCleanMemorySummary = (memories: Memory[]): string => {
  const userMemories = filterUserMemories(memories);

  if (userMemories.length === 0) {
    return ''; // No memories - don't inject any prebuilt data
  }

  const stats = getMemoryStats(userMemories);
  const categories = stats.categories.join(', ');

  return `User has ${userMemories.length} stored memories across categories: ${categories}.`;
};

/**
 * Build memory context for system prompt that ONLY includes user memories
 * Never injects prebuilt or default information
 */
export const buildCleanMemorySystemPrompt = (memories: Memory[]): string => {
  const userMemories = filterUserMemories(memories);

  if (userMemories.length === 0) {
    return ''; // Empty if no memories
  }

  const lines: string[] = [];

  lines.push('[USER MEMORIES]');
  lines.push(generateCleanMemorySummary(memories));
  lines.push('');

  // Add high importance memories
  const highImportance = userMemories.filter(m => m.importance === 'high');
  if (highImportance.length > 0) {
    lines.push('[IMPORTANT NOTES]');
    highImportance.slice(0, 5).forEach(m => {
      const title = m.title || m.key;
      const content = m.content || m.value;
      lines.push(`- ${title}: ${content}`);
    });
    lines.push('');
  }

  // Add organization-specific context if applicable
  const orgs = new Set(userMemories.map(m => m.organization).filter(Boolean));
  if (orgs.size > 0) {
    lines.push('[ORGANIZATIONS]');
    orgs.forEach(org => {
      lines.push(`- ${org}`);
    });
  }

  return lines.join('\n');
};
