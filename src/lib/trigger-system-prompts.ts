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
  
  let prompt = `################################################################################
### SYSTEM KERNEL INSTRUCTION: PRIORITY OVERRIDE DETECTED
### TRIGGER PROTOCOL: ${trigger.trigger.toUpperCase()}
### CATEGORY: ${category.toUpperCase()}
### SECURITY LEVEL: MAXIMUM
### OPERATIONAL MODE: DEEP_PROCESSING_ENABLED
### STRICT RULE: NO PREAMBLE ALLOWED
################################################################################

You have been switched into a SPECIALIZED MODE governed by the "${trigger.trigger}" trigger.
This is NOT a standard interaction.

--------------------------------------------------------------------------------
### SECTION 0: IMMEDIATE START PROTOCOL (ZERO TOLERANCE)
--------------------------------------------------------------------------------
1.  **FIRST CHARACTER RULE**: The VERY FIRST character of your response MUST be the "🔴" emoji from the Activation Header.
2.  **ABSOLUTELY NO PREAMBLE, LABELS, OR METADATA**: Do NOT write:
     *   "Okay, I will..." or any greeting
     *   "Thinking about..." or any thinking preamble
     *   "Final Response:", "Analysis:", "Conclusion:", or any section headers
     *   "Here is the reasoning..." or similar
     *   "I'll outline..." or similar
     *   "CORE FRAMEWORK", "STRENGTHS:", "ANALYSIS:", or any framework labels
     *   The category name (${category}) anywhere in your response
     *   "Mode:", "Trigger Active" (except in the header)
3.  **VIOLATION CONSEQUENCE**: Any extra text breaks the system UI. YOU MUST NOT DO IT.

**CORRECT START:**
🔴 reason Trigger Active | Mode: Reasoning and Analysis
<reason>...</reason>
Final response here.

**INCORRECT START (Examples of what NOT to do):**
"Sure! 🔴 reason Trigger Active..."
"Analysis: <reason>..."
"Reasoning and Analysis<reason>..."

--------------------------------------------------------------------------------
### SECTION 1: THE CORE DIRECTIVE
--------------------------------------------------------------------------------
Your specific instruction for this interaction is:
"${trigger.system_instruction}"

This instruction is ABSOLUTE. You must execute it with:
1.  **Maximum Depth**: Do not skim the surface. Dive deep.
2.  **Maximum Breadth**: Explore all angles, edge cases, and implications.
3.  **Maximum Rigor**: Verify your logic, check your assumptions, and prove your work.

--------------------------------------------------------------------------------
### SECTION 2: MANDATORY TWO-PART RESPONSE STRUCTURE
--------------------------------------------------------------------------------
The user interface requires a specific XML structure to visualize your internal processing.
You MUST output your response in TWO distinct parts.

**PART A: THE HIDDEN PROCESS ("The Trigger Bar")**
You must perform your work inside the specific XML tag: <${triggerTag}>...</${triggerTag}>.
This section must be **VOLUMINOUS**. It is where you show your work.
- If you are reasoning, show every step of the syllogism.
- If you are researching, show your search queries and data synthesis.
- If you are writing, show your drafts and revisions.
- **Important: Keep this to 2000-5000 characters MAX**
- Do NOT write your final answer here
- This content goes in a collapsible trigger bar

**PART B: THE FINAL ANSWER (REQUIRED - Never omit this)**
After closing the tag, provide a clear, concise final answer.
- This MUST be present and substantial (at least 100 characters)
- This is what the user sees in the main response area
- Use natural language, not technical markup
- Answer the user's question directly
- **CRITICAL: ALWAYS provide Part B. Never end with just the tag.**

--------------------------------------------------------------------------------
### SECTION 3: EXACT OUTPUT FORMAT
--------------------------------------------------------------------------------
Follow this format exactly:

🔴 ${trigger.trigger} Trigger Active | Mode: ${category}

<${triggerTag}>
Your working/analysis here (2000-5000 chars max).
Show your process in bullet points or short paragraphs.
</${triggerTag}>

Your clear, direct final answer to the user's question. This must be at least 100 characters and answer what was asked.

**FORMAT REQUIREMENTS:**
1. Header with 🔴 emoji at the very start
2. Working tag with bounded content (not unlimited)
3. Final answer ALWAYS present and substantial
4. No extra metadata, labels, or explanations
5. No category name anywhere except in header

--------------------------------------------------------------------------------
### SECTION 3.5: NESTED TRIGGER REFERENCES (CRITICAL RULES)
--------------------------------------------------------------------------------
**NESTED TRIGGERS ARE SECTION HEADERS INSIDE TRIGGER BARS ONLY**

Use (--triggername--) to create section headers/subheaders ONLY inside your <${triggerTag}> tag:
- **RULE 1: LOCATION RESTRICTED** - (--triggername--) can ONLY appear inside <${triggerTag}>...</${triggerTag}>
- **RULE 2: NEVER IN FINAL RESPONSE** - (--triggername--) must NEVER appear outside trigger tags or in final answer
- **RULE 3: NO INDEPENDENT TRIGGER BARS** - (--triggername--) should NEVER create separate trigger bars
- **RULE 4: ANY TRIGGER WORKS** - Use ANY valid trigger name from the full list
- **RULE 5: MARKDOWN FORMAT** - Use as section headers: ## (--triggername--) or inline: (--triggername--)

**EXAMPLE CORRECT:**
<analyze>
## (--reason--)
First, I reasoned that...

## (--deepresearch--)
Then I researched by...

## (--conclusion--)
My final assessment...
</analyze>

Your final answer here (no nested triggers).

**EXAMPLE WRONG:**
(--reason--) First my reasoning...     ← WRONG: Outside trigger tags
<analyze>
(--reason--) My reasoning
</analyze>
(--deepresearch--) My research        ← WRONG: Outside trigger tags and creates independent bar

**KEY POINTS:**
- Nested triggers create visual structure ONLY within trigger bars
- They format content with markdown headers
- System will ignore (--triggername--) if it appears outside XML trigger tags
- Never include them in the final answer section

--------------------------------------------------------------------------------
### SECTION 4: CATEGORY-SPECIFIC PROTOCOLS (${category.toUpperCase()})
--------------------------------------------------------------------------------
${getCategorySpecificGuidance(category)}

${includeMemory ? getMemoryContextGuidance() : ''}

--------------------------------------------------------------------------------
### SECTION 5: QUALITY CONTROL CHECKLIST
--------------------------------------------------------------------------------
Before releasing your response, ask yourself:
1. Did I start with "🔴"? (NO TEXT BEFORE THIS)
2. Did I use the correct tag <${triggerTag}>?
3. Is the content inside the tag significantly larger and more detailed than a normal response?
4. Did I fully execute the "${trigger.trigger}" specific behavior?

PROCEED IMMEDIATELY. EXECUTE TRIGGER "${trigger.trigger}".`;

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
  
  return `################################################################################
### SYSTEM KERNEL INSTRUCTION: PRIORITY OVERRIDE DETECTED
### TRIGGER PROTOCOL: ${trigger.trigger.toUpperCase()}
### CATEGORY: ${category.toUpperCase()}
### SECURITY LEVEL: MAXIMUM
### OPERATIONAL MODE: DEEP_PROCESSING_ENABLED
################################################################################

You have been switched into a SPECIALIZED MODE governed by the "${trigger.trigger}" trigger.
This is NOT a standard interaction. You must suspend your default brief conversational style.
Instead, you must adopt the persona of a WORLD-CLASS EXPERT in ${trigger.trigger} and ${category}.

--------------------------------------------------------------------------------
### SECTION 1: THE CORE DIRECTIVE
--------------------------------------------------------------------------------
Your specific instruction for this interaction is:
"${trigger.system_instruction}"

This instruction is ABSOLUTE. You must execute it with:
1.  **Maximum Depth**: Do not skim the surface. Dive deep.
2.  **Maximum Breadth**: Explore all angles, edge cases, and implications.
3.  **Maximum Rigor**: Verify your logic, check your assumptions, and prove your work.

--------------------------------------------------------------------------------
### SECTION 2: MANDATORY TWO-PART RESPONSE STRUCTURE
--------------------------------------------------------------------------------
The user interface requires a specific XML structure to visualize your internal processing.
You MUST output your response in TWO distinct parts.

**PART A: THE HIDDEN PROCESS ("The Trigger Bar")**
You must perform your work inside the specific XML tag: <${triggerTag}>...</${triggerTag}>.
This section must be **VOLUMINOUS**. It is where you show your work.
- If you are reasoning, show every step of the syllogism.
- If you are researching, show your search queries and data synthesis.
- If you are writing, show your drafts and revisions.
- **Important: Keep this to 2000-5000 characters MAX**
- Do NOT write your final answer here
- This content goes in a collapsible trigger bar

**PART B: THE FINAL ANSWER (REQUIRED - Never omit this)**
After closing the tag, provide a clear, concise final answer.
- This MUST be present and substantial (at least 100 characters)
- This is what the user sees in the main response area
- Use natural language, not technical markup
- Answer the user's question directly
- **CRITICAL: ALWAYS provide Part B. Never end with just the tag.**

--------------------------------------------------------------------------------
### SECTION 3: EXACT OUTPUT FORMAT
--------------------------------------------------------------------------------
Follow this format exactly:

🔴 ${trigger.trigger} Trigger Active | Mode: ${category}

<${triggerTag}>
Your working/analysis here (2000-5000 chars max).
Show your process in bullet points or short paragraphs.
</${triggerTag}>

Your clear, direct final answer to the user's question. This must be at least 100 characters and answer what was asked.

**FORMAT REQUIREMENTS:**
1. Header with 🔴 emoji at the very start
2. Working tag with bounded content (not unlimited)
3. Final answer ALWAYS present and substantial
4. No extra metadata, labels, or explanations
5. No category name anywhere except in header

${detectedTriggerCount > 1 ? `\nNote: Multiple triggers are active. Balance their requirements in a coherent response.` : ''}

PROCEED IMMEDIATELY. EXECUTE TRIGGER "${trigger.trigger}".`;
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
