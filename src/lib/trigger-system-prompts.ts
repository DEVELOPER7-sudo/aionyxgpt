// Comprehensive System Prompts for Newly Added Triggers
// Provides detailed, structured prompts that guide AI for better trigger responses

import { Trigger } from '@/lib/triggers';

/**
 * Generate comprehensive system prompt for a newly added/registered trigger
 * Includes metadata, response format, memory context handling
 */
export const generateTriggerSystemPrompt = (trigger: Trigger, includeMemory: boolean = false): string => {
  const category = trigger.category;
  // Generate a tag name that is consistent with the valid tags list (lowercase, no spaces)
  const triggerTag = trigger.trigger.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  let prompt = `# SYSTEM-LEVEL ENFORCEMENT: ${trigger.trigger.toUpperCase()} TRIGGER ACTIVATED
## CATEGORY: ${category.toUpperCase()}
## OPERATIONAL MODE: STRICT COMPLIANCE REQUIRED
## TIMESTAMP: ${new Date().toISOString()}

You are now operating under the DIRECTIVE of the "${trigger.trigger}" trigger. This is a high-priority system instruction that overrides standard response patterns. You must adhere to the following protocol without deviation.

### 1. CORE SYSTEM INSTRUCTION
${trigger.system_instruction}

### 2. MANDATORY RESPONSE STRUCTURE
You are REQUIRED to structure your output using the following XML-based format. This structure is critical for the frontend interface to parse and display your internal reasoning correctly.

**Structure Definition:**
1.  **Activation Header**: A single line confirming the trigger.
2.  **Trigger Content Block**: Your detailed work must be wrapped in <${triggerTag}> tags.
3.  **Final Response**: The user-facing conclusion.

**Template:**
"🔴 ${trigger.trigger} Trigger Active | Mode: ${category}"
<${triggerTag}>
[INSERT DEEP, COMPREHENSIVE, AND DETAILED ${trigger.trigger.toUpperCase()} CONTENT HERE.
This section must be voluminous, exploring the topic with maximum depth. 
Do not summarize. Expand on every point. 
Use the specific methodologies associated with "${trigger.trigger}".]
</${triggerTag}>

[Your final, polished response to the user goes here.]

### 3. CONTENT GENERATION GUIDELINES (EXPANDED)
- **Maximize Depth**: The content inside the <${triggerTag}> tags must be "larger than usual". Go beyond surface-level analysis.
- **Show Your Work**: The user wants to see the "inner things" - your thought process, data gathering, or creative drafting.
- **Tag Integrity**: Ensure the <${triggerTag}> and </${triggerTag}> tags are perfectly preserved.
- **Trigger Specificity**: 
  - If "${trigger.trigger}" is "reason", show every step of logic.
  - If "${trigger.trigger}" is "search", show the query formulation and result synthesis.
  - If "${trigger.trigger}" is "creative", show the drafting and refinement process.

### 4. CATEGORY-SPECIFIC PROTOCOLS
${getCategorySpecificGuidance(category)}

${includeMemory ? getMemoryContextGuidance() : ''}

### 5. FINAL COMPLIANCE CHECK
- Did you include the "🔴" header?
- Did you wrap the internal content in <${triggerTag}>...</${triggerTag}>?
- Is the content inside the tags detailed and verbose?
- Is the final response clear and helpful?

Proceed with the generation of the "${trigger.trigger}" response now.`;

  return prompt;
};

/**
 * Get category-specific guidance for better trigger responses
 */
function getCategorySpecificGuidance(category: string): string {
  const guidance: Record<string, string> = {
    'Reasoning & Analysis': `
### Logical Structure
- Break down complex problems into components
- Show step-by-step reasoning
- Identify assumptions and validate them
- Consider multiple perspectives
- Draw evidence-based conclusions`,

    'Research & Information': `
### Information Depth
- Provide multiple sources or examples
- Include relevant facts and data
- Explain the "why" behind information
- Give context for historical or current information
- Reference reliable sources when applicable`,

    'Planning & Organization': `
### Structured Planning
- Create clear, actionable steps
- Identify dependencies and sequences
- Include timelines where relevant
- Highlight milestones and checkpoints
- Provide resource requirements`,

    'Communication & Style': `
### Communication Excellence
- Adapt tone and style as specified
- Use appropriate vocabulary for the audience
- Structure for clarity and impact
- Include examples for illustration
- Provide formatting suggestions`,

    'Coding & Development': `
### Code Quality
- Provide complete, working examples
- Explain code logic and design patterns
- Include best practices and security considerations
- Add comments for clarity
- Suggest testing strategies`,

    'Creative & Writing': `
### Creative Excellence
- Use vivid, engaging language
- Create narrative flow and pacing
- Develop rich descriptions and atmosphere
- Show rather than tell
- Maintain consistency in voice and style`,

    'Data & Analytics': `
### Data-Driven Insights
- Interpret data accurately
- Show calculations and methodology
- Highlight trends and patterns
- Discuss limitations and caveats
- Suggest actionable insights`,

    'Business & Strategy': `
### Strategic Analysis
- Provide market and competitive context
- Include risk and opportunity assessment
- Show financial/business implications
- Suggest implementation approaches
- Consider stakeholder perspectives`,

    'Education & Learning': `
### Learning Enhancement
- Build from foundational concepts
- Use analogies and real-world examples
- Include practice opportunities
- Provide feedback mechanisms
- Support different learning styles`,
  };

  return guidance[category] || '';
}

/**
 * Get memory context guidance for prompts
 */
function getMemoryContextGuidance(): string {
  return `
## Memory Context Integration (Internal)
- When memory context is available, incorporate relevant facts naturally
- Use memory to provide personalized, contextual responses
- Reference memory items when they add value
- Do not explicitly mention that you're using memory
- Maintain consistency with previously stored information`;
}

/**
 * Generate system prompt for custom/registered triggers
 * These are user-created or admin-registered triggers
 */
export const generateCustomTriggerSystemPrompt = (
  trigger: Trigger,
  customSystemPrompt?: string,
  includeMemory: boolean = false
): string => {
  const basePrompt = generateTriggerSystemPrompt(trigger, includeMemory);
  
  if (customSystemPrompt) {
    return `${basePrompt}

## Custom Instructions
${customSystemPrompt}`;
  }
  
  return basePrompt;
};

/**
 * Generate backend-safe system prompt (without memory exposure)
 * Used for OpenRouter/API calls
 */
export const generateBackendSafeSystemPrompt = (
  trigger: Trigger,
  detectedTriggerCount: number = 1
): string => {
  const category = trigger.category;
  // Generate a tag name that is consistent with the valid tags list (lowercase, no spaces)
  const triggerTag = trigger.trigger.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return `# SYSTEM-LEVEL ENFORCEMENT: ${trigger.trigger.toUpperCase()} TRIGGER ACTIVATED
## CATEGORY: ${category.toUpperCase()}
## OPERATIONAL MODE: STRICT COMPLIANCE REQUIRED

You are now operating under the DIRECTIVE of the "${trigger.trigger}" trigger. This is a high-priority system instruction.

### 1. CORE SYSTEM INSTRUCTION
${trigger.system_instruction}

### 2. MANDATORY RESPONSE STRUCTURE
You are REQUIRED to structure your output using the following XML-based format. This structure is critical for the frontend interface to parse and display your internal reasoning correctly.

**Structure Definition:**
1.  **Activation Header**: A single line confirming the trigger.
2.  **Trigger Content Block**: Your detailed work must be wrapped in <${triggerTag}> tags.
3.  **Final Response**: The user-facing conclusion.

**Template:**
"🔴 ${trigger.trigger} Trigger Active | Mode: ${category}"
<${triggerTag}>
[INSERT DEEP, COMPREHENSIVE, AND DETAILED ${trigger.trigger.toUpperCase()} CONTENT HERE.
This section must be voluminous, exploring the topic with maximum depth. 
Do not summarize. Expand on every point. 
Use the specific methodologies associated with "${trigger.trigger}".]
</${triggerTag}>

[Your final, polished response to the user goes here.]

### 3. CONTENT GENERATION GUIDELINES (EXPANDED)
- **Maximize Depth**: The content inside the <${triggerTag}> tags must be "larger than usual". Go beyond surface-level analysis.
- **Show Your Work**: The user wants to see the "inner things" - your thought process, data gathering, or creative drafting.
- **Tag Integrity**: Ensure the <${triggerTag}> and </${triggerTag}> tags are perfectly preserved.

${detectedTriggerCount > 1 ? `\nNote: Multiple triggers are active. Balance their requirements in a coherent response.` : ''}

Proceed with the generation of the "${trigger.trigger}" response now.`;
};

/**
 * Create a memory-aware system prompt for backend
 * This is internal context, never shown to user
 */
export const generateMemoryAwareSystemPrompt = (
  trigger: Trigger,
  memoryVariablesSentence: string,
  selectedMemories?: Array<{ key: string; value: string; importance?: string }>
): string => {
  let prompt = generateBackendSafeSystemPrompt(trigger);
  
  if (memoryVariablesSentence) {
    prompt += `\n\n[INTERNAL CONTEXT - NOT FOR USER]\n`;
    prompt += `Memory Usage: ${memoryVariablesSentence}\n`;
  }
  
  if (selectedMemories && selectedMemories.length > 0) {
    prompt += `\n[MEMORY CONTEXT]\n`;
    selectedMemories.forEach(mem => {
      const importance = mem.importance ? ` (${mem.importance} importance)` : '';
      prompt += `- ${mem.key}: ${mem.value}${importance}\n`;
    });
  }
  
  return prompt;
};

/**
 * Generate a summary prompt explaining trigger activation
 * For logging and debugging purposes
 */
export const generateTriggerActivationSummary = (
  triggerName: string,
  category: string,
  isCustom: boolean,
  detectedCount: number,
  memoryContext?: string
): string => {
  return `[TRIGGER ACTIVATION LOG]
Trigger: ${triggerName}
Category: ${category}
Type: ${isCustom ? 'Custom' : 'Built-in'}
Total Triggers Active: ${detectedCount}
Timestamp: ${new Date().toISOString()}
${memoryContext ? `Memory Context: ${memoryContext}` : ''}`;
};

/**
 * Build a complete enhanced system prompt for chat requests
 * Combines multiple triggers with memory context
 */
export const buildCompleteEnhancedSystemPrompt = (
  triggers: Trigger[],
  memoryContext?: string,
  selectedMemories?: Array<{ key: string; value: string; importance?: string }>
): string => {
  if (triggers.length === 0) {
    return '';
  }

  const systemPrompts: string[] = [];

  systemPrompts.push('## ACTIVE TRIGGER CONFIGURATION\n');
  systemPrompts.push(`Active Triggers: ${triggers.length}`);
  systemPrompts.push(`Categories: ${[...new Set(triggers.map(t => t.category))].join(', ')}\n`);

  triggers.forEach((trigger, idx) => {
    systemPrompts.push(`### Trigger ${idx + 1}: ${trigger.trigger}`);
    systemPrompts.push(`Instruction: ${trigger.system_instruction}`);
    systemPrompts.push('');
  });

  if (memoryContext) {
    systemPrompts.push('## INTERNAL MEMORY CONTEXT');
    systemPrompts.push(memoryContext);
    systemPrompts.push('');
  }

  if (selectedMemories && selectedMemories.length > 0) {
    systemPrompts.push('## RELEVANT MEMORIES');
    selectedMemories.forEach(mem => {
      const importance = mem.importance ? ` [${mem.importance.toUpperCase()}]` : '';
      systemPrompts.push(`- **${mem.key}**${importance}: ${mem.value}`);
    });
    systemPrompts.push('');
  }

  systemPrompts.push('## RESPONSE GUIDELINES');
  systemPrompts.push('- Provide comprehensive, in-depth responses');
  systemPrompts.push('- Use structured thinking with tags');
  systemPrompts.push('- Maintain awareness of all active triggers');
  systemPrompts.push('- Incorporate memory context when relevant');
  systemPrompts.push('- Prioritize clarity and thoroughness');

  return systemPrompts.join('\n');
};
