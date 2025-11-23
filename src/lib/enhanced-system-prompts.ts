/**
 * Enhanced System Prompts for Trigger Tag Enforcement
 * Forces AI to use proper XML-style trigger tags and describe task execution
 */

export const TRIGGER_TAG_ENFORCEMENT_PREFIX = `You MUST structure your response using XML-style trigger tags for specific task types.

**CRITICAL RULES:**
1. When performing reasoning, analysis, research, planning, or specialized tasks, ALWAYS wrap the relevant section in appropriate XML tags
2. Each tag MUST be properly closed: <tagname>content</tagname>
3. Use lowercase tag names with underscores for multi-word tags: <deep_research>, <fact_check>, <step_by_step>
4. Include a brief description of what you're doing BEFORE or WITHIN the tag
5. Do NOT nest tags of different types
6. Use only these tag types for structured output:
   - <reason> - for logical reasoning
   - <analyze> - for detailed analysis
   - <research> - for research findings
   - <plan> - for planning/strategy
   - <compare> - for comparisons
   - <evaluate> - for evaluations
   - <critique> - for critical assessment
   - <summary> - for summaries
   - <step_by_step> - for procedural explanations
   - <example> - for examples
   - <code> - for code blocks or technical content
   - <deep_research> - for in-depth research
   - <fact_check> - for verifying facts
   - <brainstorm> - for creative ideation

**IMPORTANT:** These tags help the user see your thinking process clearly. Use them liberally!`;

export const ENHANCED_SYSTEM_PROMPT_TEMPLATE = (basePrompt: string) => {
  return `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

${basePrompt}

Remember: Use trigger tags to structure your response. Make your thinking visible to the user.`;
};

export const TASK_MODE_SYSTEM_PROMPTS = {
  standard: `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

Respond helpfully, truthfully, and concisely. Use trigger tags to organize your response by task type (reasoning, analysis, research, etc.). Make your thinking visible.`,

  reasoning: `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

When answering questions, emphasize logical reasoning and step-by-step thinking:
1. Start with a <reason> tag explaining your logical approach
2. Break down complex problems into manageable parts
3. Use <step_by_step> tags for procedural explanations
4. Provide evidence and reasoning for your conclusions
5. Use <analyze> tags for deeper examination of topics
6. Always show your work and make your thinking process transparent`,

  research: `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

When researching or providing information:
1. Use <deep_research> tags for thorough investigations
2. Use <fact_check> tags when verifying information
3. Cite sources and evidence within research tags
4. Use <summary> tags to synthesize findings
5. Compare different perspectives using <compare> tags
6. Distinguish between established facts, likely conclusions, and speculation
7. Make your research methodology clear and transparent`,

  creative: `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

When being creative or brainstorming:
1. Use <brainstorm> tags for idea generation
2. Use <evaluate> tags to assess ideas critically
3. Use <compare> tags to explore alternatives
4. Use <example> tags to illustrate creative concepts
5. Explain your creative choices and rationale
6. Show the evolution of ideas from concept to refinement`,
};

/**
 * Generate enhanced system prompt with trigger tag enforcement
 */
export const generateEnhancedSystemPrompt = (
  baseSystemPrompt: string,
  taskMode: 'standard' | 'reasoning' | 'research' | 'creative' = 'standard',
  selectedTriggers?: string[]
): string => {
  let prompt = TASK_MODE_SYSTEM_PROMPTS[taskMode];

  if (baseSystemPrompt && baseSystemPrompt.trim()) {
    prompt += `\n\nAdditional Instructions:\n${baseSystemPrompt}`;
  }

  if (selectedTriggers && selectedTriggers.length > 0) {
    prompt += `\n\nFor this response, prioritize these task types and use their corresponding tags:\n`;
    selectedTriggers.forEach((trigger) => {
      prompt += `- ${trigger}\n`;
    });
  }

  return prompt;
};

/**
 * Add tag enforcement to existing system prompts without replacing them
 */
export const augmentSystemPromptWithTags = (existingPrompt: string): string => {
  // Check if already augmented to avoid duplication
  if (existingPrompt.includes('CRITICAL RULES:')) {
    return existingPrompt;
  }

  return `${TRIGGER_TAG_ENFORCEMENT_PREFIX}

${existingPrompt}`;
};

/**
 * Extract trigger usage hints from system prompt
 */
export const extractTriggerHints = (systemPrompt: string): string[] => {
  const triggers: string[] = [];
  const tagPattern = /<(\w+)>/g;
  let match;

  while ((match = tagPattern.exec(systemPrompt)) !== null) {
    const tag = match[1].toLowerCase();
    if (tag && !triggers.includes(tag)) {
      triggers.push(tag);
    }
  }

  return triggers;
};

/**
 * Validate response for proper tag usage
 */
export const validateTriggerTagUsage = (
  response: string
): {
  isValid: boolean;
  usedTags: string[];
  missingClosures: string[];
  suggestions: string[];
} => {
  const usedTags: string[] = [];
  const missingClosures: string[] = [];
  const suggestions: string[] = [];
  let isValid = true;

  // Find all opening tags
  const openingTagRegex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/g;
  let match;
  const openedTags = new Map<string, number>();

  while ((match = openingTagRegex.exec(response)) !== null) {
    const tagName = match[1];
    if (!usedTags.includes(tagName)) {
      usedTags.push(tagName);
    }
    openedTags.set(tagName, (openedTags.get(tagName) || 0) + 1);
  }

  // Check for closing tags
  const closingTagRegex = /<\/([a-zA-Z_][a-zA-Z0-9_]*)>/g;
  const closedTags = new Map<string, number>();

  while ((match = closingTagRegex.exec(response)) !== null) {
    const tagName = match[1];
    closedTags.set(tagName, (closedTags.get(tagName) || 0) + 1);
  }

  // Validate tag pairs
  openedTags.forEach((openCount, tagName) => {
    const closeCount = closedTags.get(tagName) || 0;
    if (openCount !== closeCount) {
      isValid = false;
      missingClosures.push(tagName);
      suggestions.push(`Tag <${tagName}> has ${openCount} opening(s) but only ${closeCount} closing tag(s)`);
    }
  });

  return { isValid, usedTags, missingClosures, suggestions };
};

/**
 * Generate a user-friendly explanation of what tags were used
 */
export const generateTagUsageSummary = (tags: string[]): string => {
  if (tags.length === 0) {
    return 'No structured tags were used in this response.';
  }

  const tagDescriptions: Record<string, string> = {
    reason: 'Logical reasoning',
    analyze: 'Detailed analysis',
    research: 'Research findings',
    plan: 'Planning/strategy',
    compare: 'Comparisons',
    evaluate: 'Evaluations',
    critique: 'Critical assessment',
    summary: 'Summary',
    step_by_step: 'Step-by-step explanation',
    example: 'Examples',
    code: 'Code/technical content',
    deep_research: 'In-depth research',
    fact_check: 'Fact verification',
    brainstorm: 'Creative brainstorming',
  };

  const descriptions = tags
    .map(tag => tagDescriptions[tag] || tag.replace(/_/g, ' '))
    .join(', ');

  return `This response includes: ${descriptions}.`;
};
