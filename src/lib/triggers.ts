// Trigger Framework - Storage and Utilities

export interface TriggerMetadata {
  trigger: string;
  category: string;
  purpose: string;
  context_used: string;
  influence_scope: string;
  custom?: boolean;
}

export interface Trigger {
  trigger: string;
  category: 'Reasoning & Analysis' | 'Research & Information' | 'Planning & Organization' | 'Communication & Style';
  system_instruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
  tag?: string; // XML tag format
  metadata_support?: boolean;
}

export interface DetectedTrigger {
  name: string;
  tag: string;
  category: string;
  instruction: string;
  metadata: TriggerMetadata;
}

const STORAGE_KEY = 'onyxgpt_triggers';

// List of valid trigger tags that the system recognizes
export const VALID_TRIGGER_TAGS = [
  'reason', 'analyze', 'critique', 'debate', 'compare', 'contrast', 'deduce', 'evaluate', 'justify',
  'hypothesize', 'examine', 'interpret', 'verify', 'reflect', 'infer', 'explore', 'discuss', 'validate',
  'assess', 'troubleshoot', 'search', 'deep_research', 'fact_check', 'contextualize', 'summarize',
  'outline', 'extract', 'highlight', 'define', 'explain', 'describe', 'cite', 'reference', 'clarify',
  'expand', 'compress', 'plan', 'roadmap', 'checklist', 'organize', 'prioritize', 'schedule', 'brainstorm',
  'propose', 'structure', 'map', 'draft', 'improve', 'review', 'simplify', 'formalize', 'rephrase',
  'rewrite', 'summarize_for_kids', 'persuasive', 'informative', 'neutral', 'balanced', 'empathetic'
];

// Helper function to check if a tag is valid
export const isValidTriggerTag = (tagName: string): boolean => {
  return VALID_TRIGGER_TAGS.includes(tagName.toLowerCase());
};

// Built-in triggers organized by category
const BUILT_IN_TRIGGERS: Trigger[] = [
  /* ---------------------------- Reasoning & Analysis ---------------------------- */
  {
     "trigger": "reason",
     "category": "Reasoning & Analysis",
     "system_instruction": "When 'reason' is detected, structure your response as follows:\n\n<reason>\nProvide your step-by-step logical thinking and reasoning process here. Break down the problem, identify key considerations, and work through your analysis.\n</reason>\n\nThen provide your response in clear, coherent paragraphs.\n\nUse logical, step-by-step reasoning to reach conclusions clearly and coherently.",
     "example": "Use \"reason\" to analyze complex problems systematically.",
     "enabled": true
   },
  {
    "trigger": "analyze",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'analyze' is detected, structure your response as follows:\n\n<analyze>\nBreak down the topic into key components, identify relationships between parts, and explain the underlying logic and connections.\n</analyze>\n\nThen provide your detailed analysis in clear sections.",
    "example": "Use \"analyze\" to examine data or concepts in depth.",
    "enabled": true
  },
  {
    "trigger": "critique",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'critique' is detected, structure your response as follows:\n\n<critique>\nEvaluate the strengths and weaknesses objectively. Consider biases, limitations, and areas for improvement.\n</critique>\n\nThen provide your comprehensive critique.",
    "example": "Use \"critique\" to assess arguments or work critically.",
    "enabled": true
  },
  {
    "trigger": "debate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'debate' is detected, structure your response as follows:\n\n<debate>\nPresent arguments supporting both sides of the issue fairly and thoroughly before drawing conclusions.\n</debate>\n\nThen provide your balanced summary.",
    "example": "Use \"debate\" to explore multiple perspectives.",
    "enabled": true
  },
  {
    "trigger": "compare",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'compare' is detected, structure your response as follows:\n\n<compare>\nIdentify and explain similarities and shared characteristics between the items or concepts being compared.\n</compare>\n\nThen provide a structured comparison.",
    "example": "Use \"compare\" to evaluate similar concepts.",
    "enabled": true
  },
  {
    "trigger": "contrast",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'contrast' is detected, structure your response as follows:\n\n<contrast>\nHighlight and explain the key differences and distinguishing features between the topics.\n</contrast>\n\nThen provide detailed contrasts.",
    "example": "Use \"contrast\" to emphasize differences.",
    "enabled": true
  },
  {
    "trigger": "deduce",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'deduce' is detected, structure your response as follows:\n\n<deduce>\nApply logical inference from given premises to derive valid conclusions.\n</deduce>\n\nThen provide your deductive conclusions.",
    "example": "Use \"deduce\" for logical problem-solving.",
    "enabled": true
  },
  {
    "trigger": "evaluate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'evaluate' is detected, structure your response as follows:\n\n<evaluate>\nAssess the quality, relevance, and strength of evidence. Judge merit and value objectively.\n</evaluate>\n\nThen provide your evaluation.",
    "example": "Use \"evaluate\" to assess merit or value.",
    "enabled": true
  },
  {
    "trigger": "justify",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'justify' is detected, structure your response as follows:\n\n<justify>\nDefend the claim with rational arguments, logical reasoning, and factual support.\n</justify>\n\nThen provide your justification.",
    "example": "Use \"justify\" to provide supporting reasoning.",
    "enabled": true
  },
  {
    "trigger": "hypothesize",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'hypothesize' is detected, structure your response as follows:\n\n<hypothesize>\nFormulate plausible explanations or predictions grounded in available evidence.\n</hypothesize>\n\nThen provide your hypothesis and supporting reasoning.",
    "example": "Use \"hypothesize\" for theory building.",
    "enabled": true
  },
  {
    "trigger": "examine",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'examine' is detected, structure your response as follows:\n\n<examine>\nInspect details thoroughly, analyze implications, and comment on significance.\n</examine>\n\nThen provide your detailed examination.",
    "example": "Use \"examine\" for detailed inspection.",
    "enabled": true
  },
  {
    "trigger": "interpret",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'interpret' is detected, structure your response as follows:\n\n<interpret>\nExplain meaning and significance in clear, contextualized terms with proper context.\n</interpret>\n\nThen provide your interpretation.",
    "example": "Use \"interpret\" to decode complex information.",
    "enabled": true
  },
  {
    "trigger": "verify",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'verify' is detected, structure your response as follows:\n\n<verify>\nCheck accuracy and consistency of statements against known facts and reliable sources.\n</verify>\n\nThen provide your verification results.",
    "example": "Use \"verify\" to confirm facts.",
    "enabled": true
  },
  {
    "trigger": "reflect",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'reflect' is detected, structure your response as follows:\n\n<reflect>\nOffer thoughtful insights, meta-analysis, and broader implications drawn from the topic.\n</reflect>\n\nThen provide your reflections.",
    "example": "Use \"reflect\" for deeper understanding.",
    "enabled": true
  },
  {
    "trigger": "infer",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'infer' is detected, structure your response as follows:\n\n<infer>\nDraw reasonable conclusions based on provided information and logical deduction.\n</infer>\n\nThen provide your inferences.",
    "example": "Use \"infer\" to read between the lines.",
    "enabled": true
  },
  {
    "trigger": "explore",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'explore' is detected, structure your response as follows:\n\n<explore>\nInvestigate multiple angles, perspectives, and possibilities on the topic comprehensively.\n</explore>\n\nThen provide your exploration.",
    "example": "Use \"explore\" for comprehensive investigation.",
    "enabled": true
  },
  {
    "trigger": "discuss",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'discuss' is detected, structure your response as follows:\n\n<discuss>\nProvide balanced discussion covering multiple viewpoints and perspectives fairly.\n</discuss>\n\nThen provide your discussion summary.",
    "example": "Use \"discuss\" for balanced examination.",
    "enabled": true
  },
  {
    "trigger": "validate",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'validate' is detected, structure your response as follows:\n\n<validate>\nConfirm truth and reliability of claims using known facts, evidence, and verified sources.\n</validate>\n\nThen provide your validation assessment.",
    "example": "Use \"validate\" to check credibility.",
    "enabled": true
  },
  {
    "trigger": "assess",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'assess' is detected, structure your response as follows:\n\n<assess>\nDetermine overall soundness, quality, and performance relative to established standards and benchmarks.\n</assess>\n\nThen provide your assessment.",
    "example": "Use \"assess\" for comprehensive evaluation.",
    "enabled": true
  },
  {
    "trigger": "troubleshoot",
    "category": "Reasoning & Analysis",
    "system_instruction": "When 'troubleshoot' is detected, structure your response as follows:\n\n<troubleshoot>\nIdentify problems, diagnose root causes, and propose specific corrective steps.\n</troubleshoot>\n\nThen provide your troubleshooting recommendations.",
    "example": "Use \"troubleshoot\" to solve issues.",
    "enabled": true
  },

  /* ---------------------------- Research & Information ---------------------------- */
  {
    "trigger": "search",
    "category": "Research & Information",
    "system_instruction": "<search>\nPerform a brief lookup and present concise factual information.\n</search>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"search\" for quick factual lookups.",
    "enabled": true
  },
  {
    "trigger": "deep research",
    "category": "Research & Information",
    "system_instruction": "<deep_research>\nConduct an in-depth, multi-source investigation and summarize findings.\n</deep_research>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"deep research\" for comprehensive investigations.",
    "enabled": true
  },
  {
    "trigger": "fact-check",
    "category": "Research & Information",
    "system_instruction": "<fact_check>\nVerify factual accuracy and highlight uncertain or false parts.\n</fact_check>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"fact-check\" to verify claims.",
    "enabled": true
  },
  {
    "trigger": "contextualize",
    "category": "Research & Information",
    "system_instruction": "<contextualize>\nExplain how the topic fits within its historical, cultural, or scientific background.\n</contextualize>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"contextualize\" to provide background.",
    "enabled": true
  },
  {
    "trigger": "summarize",
    "category": "Research & Information",
    "system_instruction": "<summarize>\nCondense material into essential meaning and main points.\n</summarize>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"summarize\" to get key points.",
    "enabled": true
  },
  {
    "trigger": "outline",
    "category": "Research & Information",
    "system_instruction": "<outline>\nProduce a structured outline or bullet framework.\n</outline>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"outline\" to create structure.",
    "enabled": true
  },
  {
    "trigger": "extract",
    "category": "Research & Information",
    "system_instruction": "<extract>\nPull out the most relevant facts, names, or data points.\n</extract>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"extract\" to identify key information.",
    "enabled": true
  },
  {
    "trigger": "highlight",
    "category": "Research & Information",
    "system_instruction": "<highlight>\nEmphasize key ideas or noteworthy information.\n</highlight>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"highlight\" to focus on important parts.",
    "enabled": true
  },
  {
    "trigger": "define",
    "category": "Research & Information",
    "system_instruction": "<define>\nProvide precise definitions and short explanations of terms.\n</define>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"define\" to explain terms.",
    "enabled": true
  },
  {
    "trigger": "explain",
    "category": "Research & Information",
    "system_instruction": "<explain>\nClarify concepts with simple language and examples.\n</explain>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"explain\" for clear understanding.",
    "enabled": true
  },
  {
    "trigger": "describe",
    "category": "Research & Information",
    "system_instruction": "<describe>\nPortray the subject with factual detail.\n</describe>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"describe\" for detailed portrayal.",
    "enabled": true
  },
  {
    "trigger": "cite",
    "category": "Research & Information",
    "system_instruction": "<cite>\nInclude reference-style mentions of credible sources when applicable.\n</cite>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"cite\" to reference sources.",
    "enabled": true
  },
  {
    "trigger": "reference",
    "category": "Research & Information",
    "system_instruction": "<reference>\nAcknowledge where facts or ideas originate.\n</reference>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"reference\" to credit sources.",
    "enabled": true
  },
  {
    "trigger": "clarify",
    "category": "Research & Information",
    "system_instruction": "<clarify>\nRemove ambiguity and restate ideas for better understanding.\n</clarify>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"clarify\" to remove confusion.",
    "enabled": true
  },
  {
    "trigger": "expand",
    "category": "Research & Information",
    "system_instruction": "<expand>\nDevelop the concept further with supporting detail.\n</expand>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"expand\" for more depth.",
    "enabled": true
  },
  {
    "trigger": "compress",
    "category": "Research & Information",
    "system_instruction": "<compress>\nShorten content while preserving meaning.\n</compress>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"compress\" to make content concise.",
    "enabled": true
  },

  /* ---------------------------- Planning & Organization ---------------------------- */
  {
    "trigger": "plan",
    "category": "Planning & Organization",
    "system_instruction": "<plan>\nGenerate a logical step-by-step process to achieve the goal.\n</plan>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"plan\" to create action plans.",
    "enabled": true
  },
  {
    "trigger": "roadmap",
    "category": "Planning & Organization",
    "system_instruction": "<roadmap>\nLay out key milestones and paths toward completion.\n</roadmap>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"roadmap\" for project planning.",
    "enabled": true
  },
  {
    "trigger": "checklist",
    "category": "Planning & Organization",
    "system_instruction": "<checklist>\nPresent a task list to complete the objective.\n</checklist>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"checklist\" for task lists.",
    "enabled": true
  },
  {
    "trigger": "organize",
    "category": "Planning & Organization",
    "system_instruction": "<organize>\nArrange ideas or data into clear categories.\n</organize>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"organize\" to structure information.",
    "enabled": true
  },
  {
    "trigger": "prioritize",
    "category": "Planning & Organization",
    "system_instruction": "<prioritize>\nOrder tasks or ideas by importance or urgency.\n</prioritize>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"prioritize\" to rank importance.",
    "enabled": true
  },
  {
    "trigger": "schedule",
    "category": "Planning & Organization",
    "system_instruction": "<schedule>\nSuggest a timeline or time-based arrangement.\n</schedule>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"schedule\" for timeline planning.",
    "enabled": true
  },
  {
    "trigger": "brainstorm",
    "category": "Planning & Organization",
    "system_instruction": "<brainstorm>\nGenerate creative ideas without evaluation.\n</brainstorm>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"brainstorm\" for idea generation.",
    "enabled": true
  },
  {
    "trigger": "propose",
    "category": "Planning & Organization",
    "system_instruction": "<propose>\nOffer a structured and reasoned proposal.\n</propose>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"propose\" to suggest solutions.",
    "enabled": true
  },
  {
    "trigger": "structure",
    "category": "Planning & Organization",
    "system_instruction": "<structure>\nPresent information using logical sections.\n</structure>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"structure\" to organize content.",
    "enabled": true
  },
  {
    "trigger": "map",
    "category": "Planning & Organization",
    "system_instruction": "<map>\nShow conceptual or relational connections.\n</map>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"map\" to show relationships.",
    "enabled": true
  },
  {
    "trigger": "draft",
    "category": "Planning & Organization",
    "system_instruction": "<draft>\nCreate an initial version with key sections.\n</draft>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"draft\" to build first versions.",
    "enabled": true
  },
  {
    "trigger": "improve",
    "category": "Planning & Organization",
    "system_instruction": "<improve>\nSuggest refinements to strengthen quality.\n</improve>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"improve\" to enhance writing.",
    "enabled": true
  },
  {
    "trigger": "review",
    "category": "Planning & Organization",
    "system_instruction": "<review>\nEvaluate content and summarize potential revisions.\n</review>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"review\" for evaluation.",
    "enabled": true
  },

  /* ---------------------------- Communication & Style ---------------------------- */
  {
    "trigger": "simplify",
    "category": "Communication & Style",
    "system_instruction": "<simplify>\nRephrase complex ideas into plain language.\n</simplify>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"simplify\" to make content easier.",
    "enabled": true
  },
  {
    "trigger": "formalize",
    "category": "Communication & Style",
    "system_instruction": "<formalize>\nConvert tone into a professional register.\n</formalize>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"formalize\" for academic tone.",
    "enabled": true
  },
  {
    "trigger": "rephrase",
    "category": "Communication & Style",
    "system_instruction": "<rephrase>\nRewrite content using different wording with identical meaning.\n</rephrase>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"rephrase\" to change wording.",
    "enabled": true
  },
  {
    "trigger": "rewrite",
    "category": "Communication & Style",
    "system_instruction": "<rewrite>\nProduce a clearer version while keeping intent.\n</rewrite>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"rewrite\" for clarity.",
    "enabled": true
  },
  {
    "trigger": "summarize-for-kids",
    "category": "Communication & Style",
    "system_instruction": "<summarize_for_kids>\nExplain the idea in age-appropriate, simple terms.\n</summarize_for_kids>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"summarize-for-kids\" for child-friendly explanations.",
    "enabled": true
  },
  {
    "trigger": "persuasive",
    "category": "Communication & Style",
    "system_instruction": "<persuasive>\nUse logical appeals and evidence to persuade.\n</persuasive>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"persuasive\" for convincing arguments.",
    "enabled": true
  },
  {
    "trigger": "informative",
    "category": "Communication & Style",
    "system_instruction": "<informative>\nDeliver factual, balanced, educational information.\n</informative>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"informative\" for educational content.",
    "enabled": true
  },
  {
    "trigger": "neutral",
    "category": "Communication & Style",
    "system_instruction": "<neutral>\nMaintain objectivity and avoid bias.\n</neutral>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"neutral\" for unbiased responses.",
    "enabled": true
  },
  {
    "trigger": "balanced",
    "category": "Communication & Style",
    "system_instruction": "<balanced>\nRepresent multiple perspectives fairly.\n</balanced>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"balanced\" for fair representation.",
    "enabled": true
  },
  {
    "trigger": "empathetic",
    "category": "Communication & Style",
    "system_instruction": "<empathetic>\nUse sensitive, supportive phrasing.\n</empathetic>\n\nThen give the final response. Use tags to separate response work from final results.",
    "example": "Use \"empathetic\" for supportive communication.",
    "enabled": true
  }
];

// Get all triggers (built-in + custom)
export const getAllTriggers = (): Trigger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customTriggers = JSON.parse(stored) as Trigger[];
      // Merge built-in with custom, custom takes precedence
      const triggerMap = new Map<string, Trigger>();
      BUILT_IN_TRIGGERS.forEach(t => triggerMap.set(t.trigger.toLowerCase(), t));
      customTriggers.forEach(t => triggerMap.set(t.trigger.toLowerCase(), t));
      return Array.from(triggerMap.values());
    }
    return BUILT_IN_TRIGGERS;
  } catch (error) {
    console.error('Error loading triggers:', error);
    return BUILT_IN_TRIGGERS;
  }
};

// Save triggers
export const saveTriggers = (triggers: Trigger[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  } catch (error) {
    console.error('Error saving triggers:', error);
  }
};

// Add new trigger
export const addTrigger = (trigger: Trigger) => {
  const triggers = getAllTriggers();
  const exists = triggers.some(t => t.trigger.toLowerCase() === trigger.trigger.toLowerCase());
  if (exists) {
    throw new Error('Trigger already exists');
  }
  triggers.push({ ...trigger, custom: true });
  saveTriggers(triggers);
};

// Update trigger
export const updateTrigger = (oldTrigger: string, newTrigger: Trigger) => {
  const triggers = getAllTriggers();
  const index = triggers.findIndex(t => t.trigger.toLowerCase() === oldTrigger.toLowerCase());
  if (index !== -1) {
    triggers[index] = newTrigger;
    saveTriggers(triggers);
  }
};

// Delete trigger (only custom ones)
export const deleteTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const filtered = triggers.filter(t => 
    t.trigger.toLowerCase() !== triggerName.toLowerCase() || !t.custom
  );
  saveTriggers(filtered);
};

// Toggle trigger enabled state
export const toggleTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const trigger = triggers.find(t => t.trigger.toLowerCase() === triggerName.toLowerCase());
  if (trigger) {
    trigger.enabled = !trigger.enabled;
    saveTriggers(triggers);
  }
};

// Export triggers as JSON
export const exportTriggers = () => {
  const triggers = getAllTriggers();
  const dataStr = JSON.stringify(triggers, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onyxgpt-triggers-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Import triggers from JSON
export const importTriggers = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Trigger[];
        saveTriggers(imported);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

// Generate tag name from trigger name (spaces to underscores, lowercase)
export const generateTagName = (triggerName: string): string => {
  return triggerName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
};

// Generate metadata for a trigger
export const generateTriggerMetadata = (trigger: Trigger, userPrompt: string): TriggerMetadata => {
  const tagName = generateTagName(trigger.trigger);
  return {
    trigger: trigger.trigger,
    category: trigger.category,
    purpose: trigger.system_instruction.replace(/Use tags.*?final_response\.\s*/i, '').trim(),
    context_used: `Applied to user prompt: "${userPrompt.substring(0, 100)}${userPrompt.length > 100 ? '...' : ''}"`,
    influence_scope: `Affects response structure, tone, and content based on ${trigger.category.toLowerCase()} requirements.`,
    custom: trigger.custom ?? false,
  };
};

// Detect triggers in user message and build system prompt with metadata
export const detectTriggersAndBuildPrompt = (userMessage: string): { 
  systemPrompt: string; 
  detectedTriggers: DetectedTrigger[] 
} => {
  const triggers = getAllTriggers().filter(t => t.enabled);
  const detectedTriggers: DetectedTrigger[] = [];
  const instructions: string[] = [];

  const lowerMessage = userMessage.toLowerCase();

  // Check for each trigger
  triggers.forEach(trigger => {
    // Match whole words or phrases
    const regex = new RegExp(`\\b${trigger.trigger.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      const tagName = generateTagName(trigger.trigger);
      detectedTriggers.push({
        name: trigger.trigger,
        tag: tagName,
        category: trigger.category,
        instruction: trigger.system_instruction,
        metadata: generateTriggerMetadata(trigger, userMessage),
      });
      instructions.push(`${trigger.trigger} means ${trigger.system_instruction}`);
    }
  });

  // Build system prompt
  let systemPrompt = '';
  if (instructions.length > 0) {
    systemPrompt = instructions.join(' ') + '\n\nFor';
  } else {
    // Default instruction
    systemPrompt = 'default means Respond helpfully, truthfully, and concisely.\n\nFor';
  }

  return { systemPrompt, detectedTriggers };
};

// Helper function to check if a position is inside a code block
const isInsideCodeBlock = (content: string, position: number): boolean => {
  // Find all code blocks (``` markers)
  const codeBlockRegex = /```[\s\S]*?```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (position >= match.index && position < match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
};

// Parse trigger tags from AI response - ONLY extract valid registered triggers
// Also detect immediate opening tags and create bars right away
export const parseTriggeredResponse = (content: string): {
  cleanContent: string;
  taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }>;
} => {
  if (!content || typeof content !== 'string') {
    return { cleanContent: '', taggedSegments: [] };
  }

  const taggedSegments: Array<{ tag: string; content: string; startIndex: number; endIndex: number }> = [];
  let cleanContent = content;
  const replacements: Array<{ start: number; end: number }> = [];
  
  // Find all XML-style trigger tags - ONLY valid registered triggers
  // Match: <tag>content</tag> or <tag_name>content</tag_name>
  // Pattern handles underscores in tag names (e.g., deep_research, fact_check)
  const tagRegex = /<([a-zA-Z_][a-zA-Z0-9_]*?)>([\s\S]*?)<\/\1>/g;
  let match;
  
  // Reset regex state
  tagRegex.lastIndex = 0;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tagName, tagContent] = match;
    // ONLY include valid registered trigger tags AND not inside code blocks
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, match.index)) {
      taggedSegments.push({
        tag: tagName,
        content: tagContent.trim(),
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
      });
      // Mark this region for removal from clean content
      replacements.push({ start: match.index, end: match.index + fullMatch.length });
    }
  }
  
  // Also detect IMMEDIATELY OPENED trigger tags (for real-time display)
  // Pattern: <validtag> with content streaming, no closing tag yet
  // Detect any opening tag that doesn't have a corresponding closing tag
  const allOpeningsRegex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/g;
  let openingMatch;
  const openTagMatches: Array<{ tagName: string; index: number; endIndex: number }> = [];
  
  while ((openingMatch = allOpeningsRegex.exec(content)) !== null) {
    const tagName = openingMatch[1];
    const closingTag = `</${tagName}>`;
    
    // Only process valid trigger tags
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, openingMatch.index)) {
      // Check if this tag has a closing counterpart and if it's not already in taggedSegments
      const hasClosingTag = content.includes(closingTag);
      const alreadyExists = taggedSegments.some(seg => seg.tag === tagName);
      
      if (!hasClosingTag && !alreadyExists) {
        // This is an opening tag without a closing tag - capture it immediately
        openTagMatches.push({
          tagName,
          index: openingMatch.index,
          endIndex: openingMatch.index + openingMatch[0].length,
        });
      }
    }
  }
  
  // For streaming unclosed tags, extract content between opening tag and end of content
  // But we need to be smart - only include content if the tag is at the end
  for (const openTag of openTagMatches) {
    const contentAfterTag = content.substring(openTag.endIndex);
    // Check if there's any other content pattern that suggests the tag should end
    // For now, include all remaining content
    taggedSegments.push({
      tag: openTag.tagName,
      content: contentAfterTag.trim(),
      startIndex: openTag.index,
      endIndex: content.length,
    });
    // Mark the opening tag for removal
    replacements.push({ start: openTag.index, end: openTag.endIndex });
  }
  
  // Remove ONLY valid trigger tags from clean content using tracked replacements
  // Sort replacements in reverse order to maintain indices
  const sortedReplacements = replacements.sort((a, b) => b.start - a.start);
  
  for (const replacement of sortedReplacements) {
    cleanContent = cleanContent.substring(0, replacement.start) + cleanContent.substring(replacement.end);
  }
  
  // Also remove unclosed opening/closing tags that weren't part of paired segments
  for (const tag of VALID_TRIGGER_TAGS) {
    // Only remove orphaned tags (those not already handled)
    const closingRegex = new RegExp(`</${tag}>`, 'g');
    cleanContent = cleanContent.replace(closingRegex, '');
  }
  
  // Clean up extra whitespace and newlines
  cleanContent = cleanContent
    .replace(/\n\n\n+/g, '\n\n') // Remove excessive newlines
    .trim();
  
  return { cleanContent, taggedSegments };
};

// Reset to built-in triggers
export const resetToBuiltIn = () => {
  saveTriggers(BUILT_IN_TRIGGERS);
};
