// Extended Trigger Manager - Integrates AI auto-selection with extended triggers
import { Trigger, getAllTriggers, saveTriggers } from '@/lib/triggers';
import {
  getAllExtendedTriggers,
  autoSelectTriggers,
  getExtendedCategorySystemPrompt,
  CATEGORY_SYSTEM_PROMPTS,
} from '@/lib/triggers-extended';

/**
 * Initialize extended triggers in the system
 * Merges extended triggers with built-in triggers
 */
export const initializeExtendedTriggerSystem = (): void => {
  try {
    const currentTriggers = getAllTriggers();
    const extendedTriggers = getAllExtendedTriggers();
    const triggerMap = new Map<string, Trigger>();

    // Add all current triggers
    currentTriggers.forEach(t => triggerMap.set(t.trigger.toLowerCase(), t));

    // Add extended triggers (won't override existing ones by default)
    extendedTriggers.forEach(t => {
      if (!triggerMap.has(t.trigger.toLowerCase())) {
        triggerMap.set(t.trigger.toLowerCase(), t);
      }
    });

    const mergedTriggers = Array.from(triggerMap.values());
    saveTriggers(mergedTriggers);

    console.log(`Extended trigger system initialized with ${mergedTriggers.length} total triggers`);
  } catch (error) {
    console.error('Error initializing extended trigger system:', error);
  }
};

/**
 * Get enhanced system prompt for auto-suggested triggers
 */
export const getAutoSuggestionSystemPrompt = (suggestedTriggers: string[]): string => {
  const triggers = getAllTriggers().filter(t => suggestedTriggers.includes(t.trigger));

  if (triggers.length === 0) return '';

  const prompts: string[] = [];

  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push('AI AUTO-SUGGESTED TRIGGERS CONFIGURATION');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push('');

  // Add category-specific guidance
  const categories = [...new Set(triggers.map(t => t.category))];
  categories.forEach(category => {
    const categoryPrompt = CATEGORY_SYSTEM_PROMPTS[category as keyof typeof CATEGORY_SYSTEM_PROMPTS];
    if (categoryPrompt) {
      prompts.push(categoryPrompt);
      prompts.push('');
    }
  });

  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push(`ACTIVE AUTO-SELECTED TRIGGERS: ${suggestedTriggers.length}`);
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');

  suggestedTriggers.forEach((trigger, idx) => {
    const triggerObj = triggers.find(t => t.trigger === trigger);
    if (triggerObj) {
      prompts.push(`\n${idx + 1}. ${trigger.toUpperCase()}`);
      prompts.push(`   Category: ${triggerObj.category}`);
      prompts.push(`   Instruction: ${triggerObj.systemInstruction}`);
    }
  });

  prompts.push('');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');

  return prompts.join('\n');
};

/**
 * Analyze message and return auto-selection metadata
 */
export const analyzeAndAutoSelectTriggers = (userMessage: string): {
  suggestedTriggers: string[];
  confidence: number;
  systemPrompt: string;
  category: string;
} => {
  const result = autoSelectTriggers(userMessage);

  return {
    suggestedTriggers: result.suggestedTriggers,
    confidence: result.confidence,
    systemPrompt: getAutoSuggestionSystemPrompt(result.suggestedTriggers),
    category: result.category,
  };
};

/**
 * Build comprehensive prompt combining auto-selection and manual triggers
 */
export const buildCombinedTriggerPrompt = (
  autoSuggestedTriggers: string[],
  manuallySelectedTriggers: string[],
  userMessage: string
): {
  systemPrompt: string;
  allActiveTriggers: string[];
  autoSelected: string[];
  manualSelected: string[];
  confidence: number;
} => {
  const allActiveTriggers = Array.from(
    new Set([...autoSuggestedTriggers, ...manuallySelectedTriggers])
  );

  const triggers = getAllTriggers().filter(t => allActiveTriggers.includes(t.trigger));

  const prompts: string[] = [];

  // Header
  prompts.push('╔═══════════════════════════════════════════════════════════════════════════════╗');
  prompts.push('║             COMBINED TRIGGER CONFIGURATION - HYBRID MODE                      ║');
  prompts.push('╚═══════════════════════════════════════════════════════════════════════════════╝');
  prompts.push('');

  // AI Auto-Selection Info
  if (autoSuggestedTriggers.length > 0) {
    prompts.push('▌ AI AUTO-SELECTED TRIGGERS (Context-Aware)');
    prompts.push('═══════════════════════════════════════════════════════════════════════════════');
    const result = autoSelectTriggers(userMessage);
    prompts.push(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    prompts.push(`Reasoning: ${result.reasoning}`);
    prompts.push('Triggers:');
    autoSuggestedTriggers.forEach(t => {
      const trigger = triggers.find(tr => tr.trigger === t);
      if (trigger) {
        prompts.push(`  ◆ ${t} [${trigger.category}]`);
      }
    });
    prompts.push('');
  }

  // Manual Selection Info
  if (manuallySelectedTriggers.length > 0) {
    prompts.push('▌ MANUALLY SELECTED TRIGGERS');
    prompts.push('═══════════════════════════════════════════════════════════════════════════════');
    manuallySelectedTriggers.forEach(t => {
      const trigger = triggers.find(tr => tr.trigger === t);
      if (trigger) {
        prompts.push(`  ◈ ${t} [${trigger.category}]`);
      }
    });
    prompts.push('');
  }

  // Category-Specific Guidance
  const categories = [...new Set(triggers.map(t => t.category))];
  if (categories.length > 0) {
    prompts.push('▌ CATEGORY-SPECIFIC GUIDANCE');
    prompts.push('═══════════════════════════════════════════════════════════════════════════════');
    categories.forEach(category => {
      const categoryPrompt = CATEGORY_SYSTEM_PROMPTS[category as keyof typeof CATEGORY_SYSTEM_PROMPTS];
      if (categoryPrompt) {
        prompts.push(categoryPrompt);
        prompts.push('');
      }
    });
  }

  // Integrated Instructions
  prompts.push('▌ INTEGRATED TRIGGER INSTRUCTIONS');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  triggers.forEach((trigger, idx) => {
    const isAutoSelected = autoSuggestedTriggers.includes(trigger.trigger);
    const badge = isAutoSelected ? '[AUTO]' : '[MANUAL]';
    prompts.push(`\n${idx + 1}. ${trigger.trigger.toUpperCase()} ${badge}`);
    prompts.push(`   Category: ${trigger.category}`);
    prompts.push(`   Instruction: ${trigger.systemInstruction}`);
  });

  prompts.push('');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push('RESPONSE FORMAT REQUIREMENTS');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push('1. Header: 🔴 [Primary Trigger] Trigger Active | Mode: [Category]');
  prompts.push('2. Working section: <triggertag>detailed analysis</triggertag>');
  prompts.push('3. Final answer: Clear, comprehensive response');
  prompts.push('═══════════════════════════════════════════════════════════════════════════════');
  prompts.push('');

  const systemPrompt = prompts.join('\n');
  const result = autoSelectTriggers(userMessage);

  return {
    systemPrompt,
    allActiveTriggers,
    autoSelected: autoSuggestedTriggers,
    manualSelected: manuallySelectedTriggers,
    confidence: result.confidence,
  };
};

/**
 * Get trigger statistics
 */
export const getTriggerStatistics = () => {
  const allTriggers = getAllTriggers();
  const extendedTriggers = getAllExtendedTriggers();

  const categories = new Map<string, number>();
  allTriggers.forEach(t => {
    categories.set(t.category, (categories.get(t.category) || 0) + 1);
  });

  return {
    totalTriggers: allTriggers.length,
    totalExtendedTriggers: extendedTriggers.length,
    enabledTriggers: allTriggers.filter(t => t.enabled).length,
    customTriggers: allTriggers.filter(t => t.custom).length,
    categoriesBreakdown: Object.fromEntries(categories),
    categories: Array.from(categories.keys()),
  };
};

/**
 * Export extended triggers for sharing/backup
 */
export const exportExtendedTriggers = (format: 'json' | 'markdown' = 'json'): string => {
  const triggers = getAllExtendedTriggers();

  if (format === 'markdown') {
    let markdown = '# Extended Triggers Library\n\n';
    const categories = [...new Set(triggers.map(t => t.category))];

    categories.forEach(category => {
      const categoryTriggers = triggers.filter(t => t.category === category);
      markdown += `## ${category}\n\n`;
      markdown += `**Total Triggers:** ${categoryTriggers.length}\n\n`;

      categoryTriggers.forEach(trigger => {
        markdown += `### ${trigger.trigger}\n`;
        markdown += `- **Category:** ${trigger.category}\n`;
        markdown += `- **Instruction:** ${trigger.systemInstruction}\n`;
        markdown += `- **Example:** ${trigger.example}\n`;
        markdown += `- **Enabled:** ${trigger.enabled}\n\n`;
      });
    });

    return markdown;
  }

  return JSON.stringify(triggers, null, 2);
};
