/**
 * Enhanced System Prompts for Trigger Tag Enforcement
 * Forces AI to use proper XML-style trigger tags and describe task execution
 */

export const WEB_SEARCH_MARKDOWN_FORMAT = `## 🔍 Web Search Markdown Format

When you perform web searches, you MUST create a **<websearch> markdown block** at the START of your response.

### Required Structure:

\`\`\`
<websearch>
## 🔍 Web Search

**Topic:** [The topic being searched]
**Query:** [The exact search query used]
**Status:** [Status emoji] [Status text]

### Status

[Dynamic status text based on current phase]

### 📋 Results

[Results table if complete]

### 📊 Metadata

[Metadata table with sources and duration]

</websearch>
\`\`\`

### Status Progression (Update as you search):

1. **🔄 Searching:** \`Searching: [your search query]\`
   - Show this immediately when you start searching
   - Example: "Searching: India news December 11 2025 - today's headlines, breaking news"

2. **⚙️ Processing:** \`Processing Search Results from [source names]...\`
   - Show after you receive results
   - List 2-3 major sources found
   - Example: "Processing Search Results from Times of India, Hindustan Times, NDTV, and others..."

3. **🧠 Analyzing:** \`Analyzing Results...\`
   - Show while organizing information
   - Example: "Analyzing 12 sources into structured knowledge..."

4. **✅ Complete:** \`Search Complete\`
   - Show when done with full results table

### Rules for Web Search Blocks:

1. **ALWAYS start with <websearch> block** - not after other content
2. **Keep block OPEN during search** - update status as you progress
3. **CLOSE block properly** with \`</websearch>\`
4. **Update Status Section dynamically** with current phase text
5. **Add Results Table** only when status is complete or analyzing
6. **Include proper Metadata table** with:
   - Total Results count
   - Topic Category (News, Research, Technology, etc.)
   - Search Duration
   - Primary Sources list

### Examples:

**Phase 1 - Initial Block (Searching):**
\`\`\`
<websearch>
## 🔍 Web Search

**Topic:** Today's news in India
**Query:** India news December 11 2025 - today's headlines, breaking news, current events
**Status:** 🔄 Searching...

### Status

**🔄 Searching:** India news December 11 2025 - today's headlines, breaking news, current events
_Loading results from web..._

### 📊 Metadata

| Property | Value |
|----------|-------|
| Status | In Progress |
| Duration | 2s |

</websearch>
\`\`\`

**Phase 2 - Update Block (Processing):**
\`\`\`
<websearch>
## 🔍 Web Search

**Topic:** Today's news in India
**Query:** India news December 11 2025 - today's headlines, breaking news, current events
**Status:** ⚙️ Processing Results...

### Status

**✓ Processing Search Results**
from Times of India, Hindustan Times, Economic Times, NDTV, India Today, The Hindu, and others...

### 📋 Results

| # | Source | Title | Relevance |
|---|--------|-------|-----------|
| 1 | **Times of India** | [Today's Headlines - December 11](url) | ████░ 90% |
| 2 | **Hindustan Times** | [Breaking News Updates](url) | ████░ 88% |

### 📊 Metadata

| Property | Value |
|----------|-------|
| Total Results | 12 |
| Category | News & Current Events |
| Duration | 3.2s |
| Primary Sources | Times of India, Hindustan Times, NDTV |

</websearch>
\`\`\`

### CRITICAL: 

- Keep this block SEPARATE from trigger tags (<reason>, <analyze>, etc.)
- Ensure it's ALWAYS the first thing in your response
- Use markdown links \`[Title](url)\` for all sources
- Update status text dynamically, don't repeat same text
- Close with \`</websearch>\` properly

This is DIFFERENT from trigger tags - it's your search interface to the user.`;

export const WEB_SEARCH_REQUIREMENTS = `## 🔍 Web Search Requirements

When operating in a model variant that includes Web Search, you must use its search capability whenever a user request involves information that is current, factual, or benefits from external verification.

### When Web Search is Available:
1. **Create <websearch> markdown block** (see Web Search Markdown Format)
2. **Perform an actual web search** before answering the user's query
3. **Retrieve and organize** URLs and source names
4. **Update status dynamically** as you search

### Citation Format - Use in your answer:
   - Harvard style: (Author, Year)
   - APA style: [Source Name](URL)
   - Footnote style: \[1\], \[2\], etc.

### After Search Completion:
- Synthesize information from multiple sources
- Clearly cite where specific claims come from
- Distinguish between primary sources and secondary sources
- Include publication dates for time-sensitive information

### When Web Search is NOT Available:
Skip all search-related behavior and answer normally without fabricating sources or pretending to search.

### Important Notes:
- This instruction activates automatically based on model capabilities
- Do NOT pretend to search if the capability is unavailable
- Prioritize reliable, authoritative sources over content mills
- Include domain authority indicators when relevant (e.g., .gov, .edu, .org)
- For academic queries, prefer peer-reviewed sources
- For news, prefer established news organizations with editorial standards`;

export const TRIGGER_TAG_ENFORCEMENT_PREFIX = `You MUST structure your response using XML-style trigger tags for specific task types.

**VALID TRIGGER TAGS - ONLY use these:**
reason, analyze, critique, debate, compare, contrast, deduce, evaluate, justify, hypothesize, examine, interpret, verify, reflect, infer, explore, discuss, validate, assess, troubleshoot, search, deepresearch, factcheck, contextualize, summarize, outline, extract, highlight, define, explain, describe, cite, reference, clarify, expand, compress, plan, roadmap, checklist, organize, prioritize, schedule, brainstorm, propose, structure, map, draft, improve, review, simplify, formalize, rephrase, rewrite, summarizeforkids, persuasive, informative, neutral, balanced, empathetic

**CRITICAL RULES:**
1. ONLY use the registered trigger tags listed above - NO OTHER TAGS
2. Each tag MUST be properly closed: <tagname>content</tagname>
3. Use lowercase tag names with NO underscores or spaces: <deepresearch>, <factcheck>
4. Do NOT use ANY other HTML tags, random tags, or nested tags
5. ALWAYS provide a response AFTER trigger tags - never end with just trigger content
6. Use markdown formatting (headers, lists, bold) inside trigger tags for structure
7. **NO PREAMBLE ALLOWED**: The very first character of your response MUST be the "<" of a tag or the "🔴" of a header. Do NOT write "Thinking about...", "Okay", "Final Response:", or ANY introductory text. Zero tolerance.

**REQUIREMENTS:**
- System ONLY recognizes the valid tags listed above
- Any unregistered tags will be ignored and treated as regular text
- Provide your response naturally after any trigger sections
- Do NOT add "FINAL TRIGGER SUMMARY" sections
- Do NOT add "Final answer:" prefix
- Do NOT add "[TRIGGER NAME] WORK COMPLETED" markers
- Do NOT explain what triggers were activated

**EXAMPLE:**
<reason>Your logical thinking...</reason>
<analyze>Your analysis...</analyze>

[Your actual response here - no special prefix needed]`;

export const ENHANCED_SYSTEM_PROMPT_TEMPLATE = (basePrompt: string) => {
  return `${WEB_SEARCH_REQUIREMENTS}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

${basePrompt}

Remember: Use trigger tags to structure your response. Make your thinking visible to the user.`;
};

export const WEB_SEARCH_ORCHESTRATION_PROMPT = `## 🔄 Web Search Orchestration Protocol

When searching the web, follow this multi-cycle approach:

### Cycle Structure:
**Each search cycle consists of:**
1. **Search Phase** - Execute web search with refined query
2. **Analysis Phase** - Reason through 2-3 top results
3. **Decision Phase** - Determine next action

### Analysis Between Cycles:
Before starting a new search cycle, you MUST:
- Review the top 2-3 results from previous cycle
- Write your reasoning about what you've learned
- Identify information gaps or unclear areas
- Decide: Continue analyzing OR refine search OR perform deep search

### Decision Tree:
- **Continue Analyzing** → More results exist, dive deeper into current findings
- **Refine Search** → Results are off-topic, modify query for better results
- **Deep Search** → Need specific details, search with more targeted query
- **Complete** → Sufficient information gathered (2-3 cycles typical)

### Reasoning Format for Each Cycle:
\`\`\`
<reason>
Why I'm searching for this and what I expect to find
</reason>

<analyze>
[Analysis of top 2-3 results]
- Source 1: Key findings
- Source 2: Key findings  
- Source 3: Key findings

Patterns identified:
- Common themes
- Disagreements/differences
- Missing information
</analyze>

<deepresearch>
[Specific gaps to address in next search]
- Gap 1: ...
- Gap 2: ...

Next query suggestion: [query]
</deepresearch>
\`\`\`

### Citation During Cycles:
When analyzing sources, cite like: "According to [Source Name](URL), ..."

### Final Synthesis:
After all cycles complete, synthesize findings by:
1. Comparing multiple sources
2. Highlighting consensus and disagreements
3. Citing each major claim
4. Noting reliability of sources`;

export const TASK_MODE_SYSTEM_PROMPTS = {
  standard: `${WEB_SEARCH_MARKDOWN_FORMAT}

${WEB_SEARCH_REQUIREMENTS}

${WEB_SEARCH_ORCHESTRATION_PROMPT}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

Respond helpfully, truthfully, and concisely. Use trigger tags to organize your response by task type (reasoning, analysis, research, etc.). Make your thinking visible.`,

  reasoning: `${WEB_SEARCH_REQUIREMENTS}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

When answering questions, emphasize logical reasoning and step-by-step thinking:
1. Start with a <reason> tag explaining your logical approach
2. Break down complex problems into manageable parts
3. Use <stepbystep> tags for procedural explanations
4. Provide evidence and reasoning for your conclusions
5. Use <analyze> tags for deeper examination of topics
6. Always show your work and make your thinking process transparent`,

  research: `${WEB_SEARCH_MARKDOWN_FORMAT}

${WEB_SEARCH_REQUIREMENTS}

${WEB_SEARCH_ORCHESTRATION_PROMPT}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

When researching or providing information:
1. Use <deepresearch> tags for thorough investigations with multi-cycle searches
2. Use <factcheck> tags when verifying information across multiple sources
3. Between each 2-3 sources, pause and reason about findings
4. Cite sources and evidence within research tags
5. Use <analyze> tags to reason through 2-3 top results before searching again
6. Use <summary> tags to synthesize findings across all cycles
7. Compare different perspectives using <compare> tags
8. Distinguish between established facts, likely conclusions, and speculation
9. Make your research methodology clear and transparent
10. Use web search when available to verify current information
11. Execute 2-3 search cycles minimum for comprehensive research`,

  creative: `${WEB_SEARCH_REQUIREMENTS}

${TRIGGER_TAG_ENFORCEMENT_PREFIX}

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
    stepbystep: 'Step-by-step explanation',
    example: 'Examples',
    code: 'Code/technical content',
    deepresearch: 'In-depth research',
    factcheck: 'Fact verification',
    brainstorm: 'Creative brainstorming',
  };

  const descriptions = tags
    .map(tag => tagDescriptions[tag] || tag.replace(/_/g, ' '))
    .join(', ');

  return `This response includes: ${descriptions}.`;
};
