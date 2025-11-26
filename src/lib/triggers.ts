// Trigger Framework Storage and Utilities
// Expanded with 9 categories and 250 plus triggers

export interface TriggerMetadata {
  trigger: string;
  category: string;
  purpose: string;
  contextUsed: string;
  influenceScope: string;
  custom?: boolean;
}

export interface Trigger {
  trigger: string;
  category: 'Reasoning and Analysis' | 'Research and Information' | 'Planning and Organization' | 'Communication and Style' | 'Coding and Development' | 'Creative and Writing' | 'Data and Analytics' | 'Business and Strategy' | 'Education and Learning';
  systemInstruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
  tag?: string;
  metadataSupport?: boolean;
  systemPromptTemplate?: string;
  triggerResponseFormat?: string;
  isRegistered?: boolean;
}

export interface DetectedTrigger {
  name: string;
  tag: string;
  category: string;
  instruction: string;
  metadata: TriggerMetadata;
}

const STORAGE_KEY = 'onyxgptTriggers';

// List of valid trigger tags that the system recognizes
export const VALID_TRIGGER_TAGS = [
  'reason', 'analyze', 'critique', 'debate', 'compare', 'contrast', 'deduce', 'evaluate', 'justify',
  'hypothesize', 'examine', 'interpret', 'verify', 'reflect', 'infer', 'explore', 'discuss', 'validate',
  'assess', 'troubleshoot', 'search', 'deepResearch', 'factCheck', 'contextualize', 'summarize',
  'outline', 'extract', 'highlight', 'define', 'explain', 'describe', 'cite', 'reference', 'clarify',
  'expand', 'compress', 'plan', 'roadmap', 'checklist', 'organize', 'prioritize', 'schedule', 'brainstorm',
  'propose', 'structure', 'map', 'draft', 'improve', 'review', 'simplify', 'formalize', 'rephrase',
  'rewrite', 'summarizeForKids', 'persuasive', 'informative', 'neutral', 'balanced', 'empathetic',
  'code', 'debug', 'refactor', 'optimize', 'document', 'test', 'reviewCode', 'architecture', 'securityReview',
  'performance', 'errorHandling', 'logging', 'apiDesign', 'databaseDesign', 'algorithm', 'pattern',
  'lint', 'unitTest', 'integrationTest', 'edgeCase', 'dependencyCheck', 'compatibility', 'scalability',
  'accessibility', 'usability', 'uiux', 'responsiveDesign', 'mobileFirst', 'crossBrowser',
  'storytelling', 'narrative', 'poem', 'dialogue', 'characterDevelopment', 'worldbuilding', 'plotTwist',
  'metaphor', 'symbolism', 'tone', 'mood', 'pacing', 'tension', 'foreshadowing', 'dramaticIrony',
  'alliteration', 'descriptive', 'sensory', 'emotionalAppeal', 'voice', 'style', 'grammarCheck',
  'punctuationCheck', 'plagiarismCheck', 'editing', 'proofreading', 'flow', 'coherence', 'readability',
  'analyzeData', 'statistics', 'correlation', 'trend', 'anomaly', 'prediction', 'classification',
  'clustering', 'regression', 'visualization', 'dataQuality', 'outlierDetection', 'hypothesisTesting',
  'abTest', 'metric', 'kpi', 'dashboard', 'reporting', 'dataStorytelling', 'benchmark',
  'swot', 'marketAnalysis', 'competitorAnalysis', 'businessModel', 'revenueModel', 'pricingStrategy',
  'customerJourney', 'userPersona', 'stakeholderAnalysis', 'riskAssessment', 'mitigation', 'opportunity',
  'competitiveAdvantage', 'valueProposition', 'goToMarket', 'productStrategy', 'scaling', 'automation',
  'efficiency', 'costOptimization', 'roiAnalysis', 'financialPlanning', 'budget', 'forecast',
  'learningPath', 'conceptExplanation', 'skillBuilding', 'practiceExercise', 'quiz', 'assessment',
  'rubric', 'feedback', 'metacognition', 'learningObjective', 'prerequisite', 'scaffolding', 'differentiation',
  'multipleIntelligences', 'learningStyle', 'activeLearning', 'peerLearning', 'socraticMethod',
  'caseStudy', 'simulation', 'gameBased', 'microlearning', 'spacedRepetition', 'retention'
];

// Helper function to check if a tag is valid
export const isValidTriggerTag = (tagName: string): boolean => {
  // Check against valid tags case-insensitively
  return VALID_TRIGGER_TAGS.map(t => t.toLowerCase()).includes(tagName.toLowerCase());
};

export const generateTagName = (triggerName: string): string => {
  // Standardize tag generation: lowercase, only alphanumeric
  return triggerName.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const buildDefaultSystemPromptTemplate = (trigger: Trigger): string => {
  const triggerTag = generateTagName(trigger.trigger);
  const category = trigger.category;
  
  return `################################################################################
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
"${trigger.systemInstruction}"

**IMPORTANT**: Do NOT output the trigger category name (${category}) anywhere in your response.
Do NOT write "Reasoning and Analysis:", "Mode:", or similar labels in your response.
The system UI automatically extracts and displays these.

This instruction is ABSOLUTE. You must execute it with:
1.  **Maximum Depth**: Do not skim the surface. Dive deep.
2.  **Maximum Breadth**: Explore all angles, edge cases, and implications.
3.  **Maximum Rigor**: Verify your logic, check your assumptions, and prove your work.

--------------------------------------------------------------------------------
### SECTION 2: MANDATORY "THINKING" ARCHITECTURE
--------------------------------------------------------------------------------
The user interface requires a specific XML structure to visualize your internal processing.
You MUST output your response in TWO distinct parts.

**PART A: THE HIDDEN PROCESS ("The Trigger Bar")**
You must perform your work inside the specific XML tag: <${triggerTag}>...</${triggerTag}>.
This section must be **VOLUMINOUS**. It is where you show your work.
- If you are reasoning, show every step of the syllogism.
- If you are researching, show your search queries and data synthesis.
- If you are writing, show your drafts and revisions.
- **Do NOT be brief here.** Write as much as necessary to fully exhaust the topic.
- Use headers, bullet points, and structured lists INSIDE the tag.

**PART B: THE FINAL OUTPUT**
Only after you have closed the XML tag do you present your final answer to the user.

--------------------------------------------------------------------------------
### SECTION 3: STRICT OUTPUT TEMPLATE
--------------------------------------------------------------------------------
You must adhere to this EXACT format string. Do not deviate.

ACTIVATION HEADER (output this exactly as shown):
🔴 ${trigger.trigger} Trigger Active | Mode: ${category}

Then immediately follow with:
<${triggerTag}>
[...INSERT MASSIVE, DETAILED INTERNAL PROCESSING HERE...]
[...EXPAND ON EVERY POINT...]
[...SHOW YOUR WORK...]
</${triggerTag}>

[...INSERT FINAL USER-FACING RESPONSE HERE...]

**CRITICAL**: Only output the header once at the very start. Do NOT repeat it. Do NOT output the category name (${category}) anywhere else in your response.

--------------------------------------------------------------------------------
### SECTION 4: QUALITY CONTROL CHECKLIST
--------------------------------------------------------------------------------
Before releasing your response, ask yourself:
1. Did I start with "🔴"? (NO TEXT BEFORE THIS)
2. Did I use the correct tag <${triggerTag}>?
3. Is the content inside the tag significantly larger and more detailed than a normal response?
4. Did I fully execute the "${trigger.trigger}" specific behavior?

PROCEED IMMEDIATELY. EXECUTE TRIGGER "${trigger.trigger}".`;
};
const BUILT_IN_TRIGGERS: Trigger[] = [
  {
    trigger: "reason",
    category: "Reasoning and Analysis",
    systemInstruction: "When reason is detected, you MUST wrap your logical thinking in <reason> tags. Provide step-by-step analysis inside these tags before your final response.",
    example: "Use reason to analyze complex problems systematically.",
    enabled: true
  },
  {
    trigger: "analyze",
    category: "Reasoning and Analysis",
    systemInstruction: "When analyze is detected, you MUST wrap your analysis in <analyze> tags. Break down components and relationships inside these tags before your final response.",
    example: "Use analyze to examine data or concepts in depth.",
    enabled: true
  },
  {
    trigger: "critique",
    category: "Reasoning and Analysis",
    systemInstruction: "When critique is detected structure your response as follows:\n\nEvaluate the strengths and weaknesses objectively. Consider biases limitations and areas for improvement.\n\nThen provide your comprehensive critique.",
    example: "Use critique to assess arguments or work critically.",
    enabled: true
  },
  {
    trigger: "debate",
    category: "Reasoning and Analysis",
    systemInstruction: "When debate is detected structure your response as follows:\n\nPresent arguments supporting both sides of the issue fairly and thoroughly before drawing conclusions.\n\nThen provide your balanced summary.",
    example: "Use debate to explore multiple perspectives.",
    enabled: true
  },
  {
    trigger: "compare",
    category: "Reasoning and Analysis",
    systemInstruction: "When compare is detected structure your response as follows:\n\nIdentify and explain similarities and shared characteristics between the items or concepts being compared.\n\nThen provide a structured comparison.",
    example: "Use compare to evaluate similar concepts.",
    enabled: true
  },
  {
    trigger: "contrast",
    category: "Reasoning and Analysis",
    systemInstruction: "When contrast is detected structure your response as follows:\n\nHighlight and explain the key differences and distinguishing features between the topics.\n\nThen provide detailed contrasts.",
    example: "Use contrast to emphasize differences.",
    enabled: true
  },
  {
    trigger: "deduce",
    category: "Reasoning and Analysis",
    systemInstruction: "When deduce is detected structure your response as follows:\n\nApply logical inference from given premises to derive valid conclusions.\n\nThen provide your deductive conclusions.",
    example: "Use deduce for logical problem solving.",
    enabled: true
  },
  {
    trigger: "evaluate",
    category: "Reasoning and Analysis",
    systemInstruction: "When evaluate is detected structure your response as follows:\n\nAssess the quality relevance and strength of evidence. Judge merit and value objectively.\n\nThen provide your evaluation.",
    example: "Use evaluate to assess merit or value.",
    enabled: true
  },
  {
    trigger: "justify",
    category: "Reasoning and Analysis",
    systemInstruction: "When justify is detected structure your response as follows:\n\nDefend the claim with rational arguments logical reasoning and factual support.\n\nThen provide your justification.",
    example: "Use justify to provide supporting reasoning.",
    enabled: true
  },
  {
    trigger: "hypothesize",
    category: "Reasoning and Analysis",
    systemInstruction: "When hypothesize is detected structure your response as follows:\n\nFormulate plausible explanations or predictions grounded in available evidence.\n\nThen provide your hypothesis and supporting reasoning.",
    example: "Use hypothesize for theory building.",
    enabled: true
  },
  {
    trigger: "examine",
    category: "Reasoning and Analysis",
    systemInstruction: "When examine is detected structure your response as follows:\n\nInspect details thoroughly analyze implications and comment on significance.\n\nThen provide your detailed examination.",
    example: "Use examine for detailed inspection.",
    enabled: true
  },
  {
    trigger: "interpret",
    category: "Reasoning and Analysis",
    systemInstruction: "When interpret is detected structure your response as follows:\n\nExplain meaning and significance in clear contextualized terms with proper context.\n\nThen provide your interpretation.",
    example: "Use interpret to decode complex information.",
    enabled: true
  },
  {
    trigger: "verify",
    category: "Reasoning and Analysis",
    systemInstruction: "When verify is detected structure your response as follows:\n\nCheck accuracy and consistency of statements against known facts and reliable sources.\n\nThen provide your verification results.",
    example: "Use verify to confirm facts.",
    enabled: true
  },
  {
    trigger: "reflect",
    category: "Reasoning and Analysis",
    systemInstruction: "When reflect is detected structure your response as follows:\n\nOffer thoughtful insights meta analysis and broader implications drawn from the topic.\n\nThen provide your reflections.",
    example: "Use reflect for deeper understanding.",
    enabled: true
  },
  {
    trigger: "infer",
    category: "Reasoning and Analysis",
    systemInstruction: "When infer is detected structure your response as follows:\n\nDraw reasonable conclusions based on provided information and logical deduction.\n\nThen provide your inferences.",
    example: "Use infer to read between the lines.",
    enabled: true
  },
  {
    trigger: "explore",
    category: "Reasoning and Analysis",
    systemInstruction: "When explore is detected structure your response as follows:\n\nInvestigate multiple angles perspectives and possibilities on the topic comprehensively.\n\nThen provide your exploration.",
    example: "Use explore for comprehensive investigation.",
    enabled: true
  },
  {
    trigger: "discuss",
    category: "Reasoning and Analysis",
    systemInstruction: "When discuss is detected structure your response as follows:\n\nProvide balanced discussion covering multiple viewpoints and perspectives fairly.\n\nThen provide your discussion summary.",
    example: "Use discuss for balanced examination.",
    enabled: true
  },
  {
    trigger: "validate",
    category: "Reasoning and Analysis",
    systemInstruction: "When validate is detected structure your response as follows:\n\nConfirm truth and reliability of claims using known facts evidence and verified sources.\n\nThen provide your validation assessment.",
    example: "Use validate to check credibility.",
    enabled: true
  },
  {
    trigger: "assess",
    category: "Reasoning and Analysis",
    systemInstruction: "When assess is detected structure your response as follows:\n\nDetermine overall soundness quality and performance relative to established standards and benchmarks.\n\nThen provide your assessment.",
    example: "Use assess for comprehensive evaluation.",
    enabled: true
  },
  {
    trigger: "troubleshoot",
    category: "Reasoning and Analysis",
    systemInstruction: "When troubleshoot is detected structure your response as follows:\n\nIdentify problems diagnose root causes and propose specific corrective steps.\n\nThen provide your troubleshooting recommendations.",
    example: "Use troubleshoot to solve issues.",
    enabled: true
  },
  {
    trigger: "search",
    category: "Research and Information",
    systemInstruction: "Perform a brief lookup and present concise factual information.\n\nThen give the final response.",
    example: "Use search for quick factual lookups.",
    enabled: true
  },
  {
    trigger: "deep research",
    category: "Research and Information",
    systemInstruction: "When deep research is detected, you MUST wrap your investigation in <deepresearch> tags. Cite sources and explore thoroughly inside these tags before your final response.",
    example: "Use deep research for comprehensive investigations.",
    enabled: true
  },
  {
    trigger: "fact check",
    category: "Research and Information",
    systemInstruction: "Verify factual accuracy and highlight uncertain or false parts.\n\nThen give the final response.",
    example: "Use fact check to verify claims.",
    enabled: true
  },
  {
    trigger: "contextualize",
    category: "Research and Information",
    systemInstruction: "Explain how the topic fits within its historical cultural or scientific background.\n\nThen give the final response.",
    example: "Use contextualize to provide background.",
    enabled: true
  },
  {
    trigger: "summarize",
    category: "Research and Information",
    systemInstruction: "Condense material into essential meaning and main points.\n\nThen give the final response.",
    example: "Use summarize to get key points.",
    enabled: true
  },
  {
    trigger: "outline",
    category: "Research and Information",
    systemInstruction: "Produce a structured outline or bullet framework.\n\nThen give the final response.",
    example: "Use outline to create structure.",
    enabled: true
  },
  {
    trigger: "extract",
    category: "Research and Information",
    systemInstruction: "Pull out the most relevant facts names or data points.\n\nThen give the final response.",
    example: "Use extract to identify key information.",
    enabled: true
  },
  {
    trigger: "highlight",
    category: "Research and Information",
    systemInstruction: "Emphasize key ideas or noteworthy information.\n\nThen give the final response.",
    example: "Use highlight to focus on important parts.",
    enabled: true
  },
  {
    trigger: "define",
    category: "Research and Information",
    systemInstruction: "Provide precise definitions and short explanations of terms.\n\nThen give the final response.",
    example: "Use define to explain terms.",
    enabled: true
  },
  {
    trigger: "explain",
    category: "Research and Information",
    systemInstruction: "Clarify concepts with simple language and examples.\n\nThen give the final response.",
    example: "Use explain for clear understanding.",
    enabled: true
  },
  {
    trigger: "describe",
    category: "Research and Information",
    systemInstruction: "Portray the subject with factual detail.\n\nThen give the final response.",
    example: "Use describe for detailed portrayal.",
    enabled: true
  },
  {
    trigger: "cite",
    category: "Research and Information",
    systemInstruction: "Include reference style mentions of credible sources when applicable.\n\nThen give the final response.",
    example: "Use cite to reference sources.",
    enabled: true
  },
  {
    trigger: "reference",
    category: "Research and Information",
    systemInstruction: "Acknowledge where facts or ideas originate.\n\nThen give the final response.",
    example: "Use reference to credit sources.",
    enabled: true
  },
  {
    trigger: "clarify",
    category: "Research and Information",
    systemInstruction: "Remove ambiguity and restate ideas for better understanding.\n\nThen give the final response.",
    example: "Use clarify to remove confusion.",
    enabled: true
  },
  {
    trigger: "expand",
    category: "Research and Information",
    systemInstruction: "Develop the concept further with supporting detail.\n\nThen give the final response.",
    example: "Use expand for more depth.",
    enabled: true
  },
  {
    trigger: "compress",
    category: "Research and Information",
    systemInstruction: "Shorten content while preserving meaning.\n\nThen give the final response.",
    example: "Use compress to make content concise.",
    enabled: true
  },
  {
    trigger: "timeline",
    category: "Research and Information",
    systemInstruction: "Present events or information in chronological order.\n\nThen give the final response.",
    example: "Use timeline for historical sequences.",
    enabled: true
  },
  {
    trigger: "encyclopedia",
    category: "Research and Information",
    systemInstruction: "Provide comprehensive encyclopedic style information.\n\nThen give the final response.",
    example: "Use encyclopedia for thorough reference material.",
    enabled: true
  },
  {
    trigger: "etymology",
    category: "Research and Information",
    systemInstruction: "Explain the origins and historical development of terms.\n\nThen give the final response.",
    example: "Use etymology to understand word origins.",
    enabled: true
  },
  {
    trigger: "glossary",
    category: "Research and Information",
    systemInstruction: "Create a glossary of key terms and definitions.\n\nThen give the final response.",
    example: "Use glossary to define terminology.",
    enabled: true
  },
  {
    trigger: "benchmark",
    category: "Research and Information",
    systemInstruction: "Compare against industry standards or best practices.\n\nThen give the final response.",
    example: "Use benchmark for comparative analysis.",
    enabled: true
  },
  {
    trigger: "case study",
    category: "Research and Information",
    systemInstruction: "Analyze a specific real world example in detail.\n\nThen give the final response.",
    example: "Use case study to examine specific instances.",
    enabled: true
  },
  {
    trigger: "whitepaper",
    category: "Research and Information",
    systemInstruction: "Provide in depth technical or policy analysis.\n\nThen give the final response.",
    example: "Use whitepaper for detailed documentation.",
    enabled: true
  },
  {
    trigger: "literature review",
    category: "Research and Information",
    systemInstruction: "Summarize and synthesize relevant research and sources.\n\nThen give the final response.",
    example: "Use literature review to survey existing work.",
    enabled: true
  },
  {
    trigger: "plan",
    category: "Planning and Organization",
    systemInstruction: "Generate a logical step by step process to achieve the goal.\n\nThen give the final response.",
    example: "Use plan to create action plans.",
    enabled: true
  },
  {
    trigger: "roadmap",
    category: "Planning and Organization",
    systemInstruction: "Lay out key milestones and paths toward completion.\n\nThen give the final response.",
    example: "Use roadmap for project planning.",
    enabled: true
  },
  {
    trigger: "checklist",
    category: "Planning and Organization",
    systemInstruction: "Present a task list to complete the objective.\n\nThen give the final response.",
    example: "Use checklist for task lists.",
    enabled: true
  },
  {
    trigger: "organize",
    category: "Planning and Organization",
    systemInstruction: "Arrange ideas or data into clear categories.\n\nThen give the final response.",
    example: "Use organize to structure information.",
    enabled: true
  },
  {
    trigger: "prioritize",
    category: "Planning and Organization",
    systemInstruction: "Order tasks or ideas by importance or urgency.\n\nThen give the final response.",
    example: "Use prioritize to rank importance.",
    enabled: true
  },
  {
    trigger: "schedule",
    category: "Planning and Organization",
    systemInstruction: "Suggest a timeline or time based arrangement.\n\nThen give the final response.",
    example: "Use schedule for timeline planning.",
    enabled: true
  },
  {
    trigger: "brainstorm",
    category: "Planning and Organization",
    systemInstruction: "Generate creative ideas without evaluation.\n\nThen give the final response.",
    example: "Use brainstorm for idea generation.",
    enabled: true
  },
  {
    trigger: "propose",
    category: "Planning and Organization",
    systemInstruction: "Offer a structured and reasoned proposal.\n\nThen give the final response.",
    example: "Use propose to suggest solutions.",
    enabled: true
  },
  {
    trigger: "structure",
    category: "Planning and Organization",
    systemInstruction: "Present information using logical sections.\n\nThen give the final response.",
    example: "Use structure to organize content.",
    enabled: true
  },
  {
    trigger: "map",
    category: "Planning and Organization",
    systemInstruction: "Show conceptual or relational connections.\n\nThen give the final response.",
    example: "Use map to show relationships.",
    enabled: true
  },
  {
    trigger: "draft",
    category: "Planning and Organization",
    systemInstruction: "Create an initial version with key sections.\n\nThen give the final response.",
    example: "Use draft to build first versions.",
    enabled: true
  },
  {
    trigger: "improve",
    category: "Planning and Organization",
    systemInstruction: "Suggest refinements to strengthen quality.\n\nThen give the final response.",
    example: "Use improve to enhance writing.",
    enabled: true
  },
  {
    trigger: "review",
    category: "Planning and Organization",
    systemInstruction: "Evaluate content and summarize potential revisions.\n\nThen give the final response.",
    example: "Use review for evaluation.",
    enabled: true
  },
  {
    trigger: "milestone",
    category: "Planning and Organization",
    systemInstruction: "Identify key checkpoints and progress markers.\n\nThen give the final response.",
    example: "Use milestone to track progress.",
    enabled: true
  },
  {
    trigger: "iteration",
    category: "Planning and Organization",
    systemInstruction: "Outline cycles of refinement and improvement.\n\nThen give the final response.",
    example: "Use iteration for cyclical development.",
    enabled: true
  },
  {
    trigger: "workflow",
    category: "Planning and Organization",
    systemInstruction: "Map out process flows and dependencies.\n\nThen give the final response.",
    example: "Use workflow for process mapping.",
    enabled: true
  },
  {
    trigger: "rephrase",
    category: "Planning and Organization",
    systemInstruction: "Say the same thing differently.\n\nThen give the final response.",
    example: "Use rephrase to alter wording.",
    enabled: true
  },
  {
    trigger: "rewrite",
    category: "Planning and Organization",
    systemInstruction: "Recreate content with new structure.\n\nThen give the final response.",
    example: "Use rewrite to reconstruct.",
    enabled: true
  },
  {
    trigger: "simplify",
    category: "Planning and Organization",
    systemInstruction: "Make content easier to understand.\n\nThen give the final response.",
    example: "Use simplify to reduce complexity.",
    enabled: true
  },
  {
    trigger: "formalize",
    category: "Planning and Organization",
    systemInstruction: "Make content more official or structured.\n\nThen give the final response.",
    example: "Use formalize for formal tone.",
    enabled: true
  },
  {
    trigger: "code",
    category: "Coding and Development",
    systemInstruction: "Write clean executable code.\n\nThen give the final response.",
    example: "Use code to generate code.",
    enabled: true
  },
  {
    trigger: "debug",
    category: "Coding and Development",
    systemInstruction: "Find and fix code errors.\n\nThen give the final response.",
    example: "Use debug to fix issues.",
    enabled: true
  },
  {
    trigger: "refactor",
    category: "Coding and Development",
    systemInstruction: "Improve code structure without changing behavior.\n\nThen give the final response.",
    example: "Use refactor to improve quality.",
    enabled: true
  },
  {
    trigger: "optimize",
    category: "Coding and Development",
    systemInstruction: "Enhance performance and efficiency.\n\nThen give the final response.",
    example: "Use optimize for speed improvements.",
    enabled: true
  },
  {
    trigger: "document",
    category: "Coding and Development",
    systemInstruction: "Create clear technical documentation.\n\nThen give the final response.",
    example: "Use document to write docs.",
    enabled: true
  },
  {
    trigger: "test",
    category: "Coding and Development",
    systemInstruction: "Create test cases and validation.\n\nThen give the final response.",
    example: "Use test for test creation.",
    enabled: true
  },
  {
    trigger: "review code",
    category: "Coding and Development",
    systemInstruction: "Evaluate code quality and practices.\n\nThen give the final response.",
    example: "Use review code for critique.",
    enabled: true
  },
  {
    trigger: "architecture",
    category: "Coding and Development",
    systemInstruction: "Design system structure.\n\nThen give the final response.",
    example: "Use architecture for system design.",
    enabled: true
  },
  {
    trigger: "security review",
    category: "Coding and Development",
    systemInstruction: "Check for security vulnerabilities.\n\nThen give the final response.",
    example: "Use security review to audit security.",
    enabled: true
  },
  {
    trigger: "performance",
    category: "Coding and Development",
    systemInstruction: "Analyze and improve speed.\n\nThen give the final response.",
    example: "Use performance to assess speed.",
    enabled: true
  },
  {
    trigger: "error handling",
    category: "Coding and Development",
    systemInstruction: "Create robust error management.\n\nThen give the final response.",
    example: "Use error handling for exception handling.",
    enabled: true
  },
  {
    trigger: "logging",
    category: "Coding and Development",
    systemInstruction: "Implement logging systems.\n\nThen give the final response.",
    example: "Use logging for debug tracking.",
    enabled: true
  },
  {
    trigger: "api design",
    category: "Coding and Development",
    systemInstruction: "Design clean APIs.\n\nThen give the final response.",
    example: "Use api design for API planning.",
    enabled: true
  },
  {
    trigger: "database design",
    category: "Coding and Development",
    systemInstruction: "Create efficient database schemas.\n\nThen give the final response.",
    example: "Use database design for schema design.",
    enabled: true
  },
  {
    trigger: "algorithm",
    category: "Coding and Development",
    systemInstruction: "Develop algorithms.\n\nThen give the final response.",
    example: "Use algorithm for algorithm design.",
    enabled: true
  },
  {
    trigger: "pattern",
    category: "Coding and Development",
    systemInstruction: "Apply design patterns.\n\nThen give the final response.",
    example: "Use pattern for design patterns.",
    enabled: true
  },
  {
    trigger: "lint",
    category: "Coding and Development",
    systemInstruction: "Check code style and standards.\n\nThen give the final response.",
    example: "Use lint for style checking.",
    enabled: true
  },
  {
    trigger: "unit test",
    category: "Coding and Development",
    systemInstruction: "Create unit tests.\n\nThen give the final response.",
    example: "Use unit test for unit testing.",
    enabled: true
  },
  {
    trigger: "integration test",
    category: "Coding and Development",
    systemInstruction: "Create integration tests.\n\nThen give the final response.",
    example: "Use integration test for integration testing.",
    enabled: true
  },
  {
    trigger: "edge case",
    category: "Coding and Development",
    systemInstruction: "Identify edge cases.\n\nThen give the final response.",
    example: "Use edge case for edge case analysis.",
    enabled: true
  },
  {
    trigger: "dependency check",
    category: "Coding and Development",
    systemInstruction: "Analyze dependencies.\n\nThen give the final response.",
    example: "Use dependency check for dependency analysis.",
    enabled: true
  },
  {
    trigger: "compatibility",
    category: "Coding and Development",
    systemInstruction: "Check cross platform compatibility.\n\nThen give the final response.",
    example: "Use compatibility for compatibility testing.",
    enabled: true
  },
  {
    trigger: "scalability",
    category: "Coding and Development",
    systemInstruction: "Design for scale.\n\nThen give the final response.",
    example: "Use scalability for scaling design.",
    enabled: true
  },
  {
    trigger: "accessibility",
    category: "Coding and Development",
    systemInstruction: "Ensure accessibility standards.\n\nThen give the final response.",
    example: "Use accessibility for accessibility audit.",
    enabled: true
  },
  {
    trigger: "usability",
    category: "Coding and Development",
    systemInstruction: "Optimize user experience.\n\nThen give the final response.",
    example: "Use usability for UX analysis.",
    enabled: true
  },
  {
    trigger: "ui ux",
    category: "Coding and Development",
    systemInstruction: "Design interfaces and experience.\n\nThen give the final response.",
    example: "Use ui ux for interface design.",
    enabled: true
  },
  {
    trigger: "responsive design",
    category: "Coding and Development",
    systemInstruction: "Create responsive layouts.\n\nThen give the final response.",
    example: "Use responsive design for responsive layouts.",
    enabled: true
  },
  {
    trigger: "mobile first",
    category: "Coding and Development",
    systemInstruction: "Design for mobile first.\n\nThen give the final response.",
    example: "Use mobile first for mobile design.",
    enabled: true
  },
  {
    trigger: "cross browser",
    category: "Coding and Development",
    systemInstruction: "Test across browsers.\n\nThen give the final response.",
    example: "Use cross browser for browser testing.",
    enabled: true
  },
  {
    trigger: "storytelling",
    category: "Creative and Writing",
    systemInstruction: "Craft engaging stories.\n\nThen give the final response.",
    example: "Use storytelling for narrative.",
    enabled: true
  },
  {
    trigger: "narrative",
    category: "Creative and Writing",
    systemInstruction: "Create narrative flow.\n\nThen give the final response.",
    example: "Use narrative for plot construction.",
    enabled: true
  },
  {
    trigger: "poem",
    category: "Creative and Writing",
    systemInstruction: "Write poetry.\n\nThen give the final response.",
    example: "Use poem for poetry writing.",
    enabled: true
  },
  {
    trigger: "dialogue",
    category: "Creative and Writing",
    systemInstruction: "Write conversations.\n\nThen give the final response.",
    example: "Use dialogue for conversation writing.",
    enabled: true
  },
  {
    trigger: "character development",
    category: "Creative and Writing",
    systemInstruction: "Develop characters.\n\nThen give the final response.",
    example: "Use character development for character creation.",
    enabled: true
  },
  {
    trigger: "worldbuilding",
    category: "Creative and Writing",
    systemInstruction: "Create fictional worlds.\n\nThen give the final response.",
    example: "Use worldbuilding for world creation.",
    enabled: true
  },
  {
    trigger: "plot twist",
    category: "Creative and Writing",
    systemInstruction: "Develop plot twists.\n\nThen give the final response.",
    example: "Use plot twist for surprise elements.",
    enabled: true
  },
  {
    trigger: "metaphor",
    category: "Creative and Writing",
    systemInstruction: "Use metaphors.\n\nThen give the final response.",
    example: "Use metaphor for figurative language.",
    enabled: true
  },
  {
    trigger: "symbolism",
    category: "Creative and Writing",
    systemInstruction: "Apply symbolism.\n\nThen give the final response.",
    example: "Use symbolism for symbolic meaning.",
    enabled: true
  },
  {
    trigger: "tone",
    category: "Creative and Writing",
    systemInstruction: "Set writing tone.\n\nThen give the final response.",
    example: "Use tone for voice control.",
    enabled: true
  },
  {
    trigger: "mood",
    category: "Creative and Writing",
    systemInstruction: "Create emotional mood.\n\nThen give the final response.",
    example: "Use mood for emotional atmosphere.",
    enabled: true
  },
  {
    trigger: "pacing",
    category: "Creative and Writing",
    systemInstruction: "Control pacing.\n\nThen give the final response.",
    example: "Use pacing for rhythm control.",
    enabled: true
  },
  {
    trigger: "tension",
    category: "Creative and Writing",
    systemInstruction: "Build tension.\n\nThen give the final response.",
    example: "Use tension for suspense.",
    enabled: true
  },
  {
    trigger: "foreshadowing",
    category: "Creative and Writing",
    systemInstruction: "Use foreshadowing.\n\nThen give the final response.",
    example: "Use foreshadowing for hints.",
    enabled: true
  },
  {
    trigger: "dramatic irony",
    category: "Creative and Writing",
    systemInstruction: "Create dramatic irony.\n\nThen give the final response.",
    example: "Use dramatic irony for ironic effect.",
    enabled: true
  },
  {
    trigger: "alliteration",
    category: "Creative and Writing",
    systemInstruction: "Use alliteration.\n\nThen give the final response.",
    example: "Use alliteration for sound effects.",
    enabled: true
  },
  {
    trigger: "descriptive",
    category: "Creative and Writing",
    systemInstruction: "Write descriptively.\n\nThen give the final response.",
    example: "Use descriptive for vivid description.",
    enabled: true
  },
  {
    trigger: "sensory",
    category: "Creative and Writing",
    systemInstruction: "Appeal to senses.\n\nThen give the final response.",
    example: "Use sensory for sensory details.",
    enabled: true
  },
  {
    trigger: "emotional appeal",
    category: "Creative and Writing",
    systemInstruction: "Create emotional impact.\n\nThen give the final response.",
    example: "Use emotional appeal for pathos.",
    enabled: true
  },
  {
    trigger: "voice",
    category: "Creative and Writing",
    systemInstruction: "Develop voice.\n\nThen give the final response.",
    example: "Use voice for authorial voice.",
    enabled: true
  },
  {
    trigger: "style",
    category: "Creative and Writing",
    systemInstruction: "Establish style.\n\nThen give the final response.",
    example: "Use style for stylistic choices.",
    enabled: true
  },
  {
    trigger: "grammar check",
    category: "Creative and Writing",
    systemInstruction: "Check grammar.\n\nThen give the final response.",
    example: "Use grammar check for editing.",
    enabled: true
  },
  {
    trigger: "punctuation check",
    category: "Creative and Writing",
    systemInstruction: "Check punctuation.\n\nThen give the final response.",
    example: "Use punctuation check for punctuation editing.",
    enabled: true
  },
  {
    trigger: "plagiarism check",
    category: "Creative and Writing",
    systemInstruction: "Check for plagiarism.\n\nThen give the final response.",
    example: "Use plagiarism check for originality.",
    enabled: true
  },
  {
    trigger: "editing",
    category: "Creative and Writing",
    systemInstruction: "Edit content.\n\nThen give the final response.",
    example: "Use editing for revision.",
    enabled: true
  },
  {
    trigger: "proofreading",
    category: "Creative and Writing",
    systemInstruction: "Proofread content.\n\nThen give the final response.",
    example: "Use proofreading for final review.",
    enabled: true
  },
  {
    trigger: "flow",
    category: "Creative and Writing",
    systemInstruction: "Improve flow.\n\nThen give the final response.",
    example: "Use flow for readability.",
    enabled: true
  },
  {
    trigger: "coherence",
    category: "Creative and Writing",
    systemInstruction: "Ensure coherence.\n\nThen give the final response.",
    example: "Use coherence for logical flow.",
    enabled: true
  },
  {
    trigger: "readability",
    category: "Creative and Writing",
    systemInstruction: "Optimize readability.\n\nThen give the final response.",
    example: "Use readability for reader ease.",
    enabled: true
  },
  {
    trigger: "analyze data",
    category: "Data and Analytics",
    systemInstruction: "Analyze data sets.\n\nThen give the final response.",
    example: "Use analyze data for data analysis.",
    enabled: true
  },
  {
    trigger: "statistics",
    category: "Data and Analytics",
    systemInstruction: "Apply statistics.\n\nThen give the final response.",
    example: "Use statistics for stat analysis.",
    enabled: true
  },
  {
    trigger: "correlation",
    category: "Data and Analytics",
    systemInstruction: "Find correlations.\n\nThen give the final response.",
    example: "Use correlation for relationship analysis.",
    enabled: true
  },
  {
    trigger: "trend",
    category: "Data and Analytics",
    systemInstruction: "Identify trends.\n\nThen give the final response.",
    example: "Use trend for trend spotting.",
    enabled: true
  },
  {
    trigger: "anomaly",
    category: "Data and Analytics",
    systemInstruction: "Detect anomalies.\n\nThen give the final response.",
    example: "Use anomaly for outlier detection.",
    enabled: true
  },
  {
    trigger: "prediction",
    category: "Data and Analytics",
    systemInstruction: "Make predictions.\n\nThen give the final response.",
    example: "Use prediction for forecasting.",
    enabled: true
  },
  {
    trigger: "classification",
    category: "Data and Analytics",
    systemInstruction: "Classify data.\n\nThen give the final response.",
    example: "Use classification for categorization.",
    enabled: true
  },
  {
    trigger: "clustering",
    category: "Data and Analytics",
    systemInstruction: "Cluster data.\n\nThen give the final response.",
    example: "Use clustering for grouping.",
    enabled: true
  },
  {
    trigger: "regression",
    category: "Data and Analytics",
    systemInstruction: "Perform regression.\n\nThen give the final response.",
    example: "Use regression for relationship modeling.",
    enabled: true
  },
  {
    trigger: "visualization",
    category: "Data and Analytics",
    systemInstruction: "Create visualizations.\n\nThen give the final response.",
    example: "Use visualization for data display.",
    enabled: true
  },
  {
    trigger: "data quality",
    category: "Data and Analytics",
    systemInstruction: "Assess data quality.\n\nThen give the final response.",
    example: "Use data quality for quality assessment.",
    enabled: true
  },
  {
    trigger: "outlier detection",
    category: "Data and Analytics",
    systemInstruction: "Detect outliers.\n\nThen give the final response.",
    example: "Use outlier detection for anomaly finding.",
    enabled: true
  },
  {
    trigger: "hypothesis testing",
    category: "Data and Analytics",
    systemInstruction: "Test hypotheses.\n\nThen give the final response.",
    example: "Use hypothesis testing for hypothesis validation.",
    enabled: true
  },
  {
    trigger: "ab test",
    category: "Data and Analytics",
    systemInstruction: "Design AB tests.\n\nThen give the final response.",
    example: "Use ab test for test design.",
    enabled: true
  },
  {
    trigger: "metric",
    category: "Data and Analytics",
    systemInstruction: "Define metrics.\n\nThen give the final response.",
    example: "Use metric for measurement.",
    enabled: true
  },
  {
    trigger: "kpi",
    category: "Data and Analytics",
    systemInstruction: "Establish KPIs.\n\nThen give the final response.",
    example: "Use kpi for key performance tracking.",
    enabled: true
  },
  {
    trigger: "dashboard",
    category: "Data and Analytics",
    systemInstruction: "Create dashboards.\n\nThen give the final response.",
    example: "Use dashboard for visualization display.",
    enabled: true
  },
  {
    trigger: "reporting",
    category: "Data and Analytics",
    systemInstruction: "Create reports.\n\nThen give the final response.",
    example: "Use reporting for report generation.",
    enabled: true
  },
  {
    trigger: "data storytelling",
    category: "Data and Analytics",
    systemInstruction: "Tell data stories.\n\nThen give the final response.",
    example: "Use data storytelling for narrative.",
    enabled: true
  },
  {
    trigger: "swot",
    category: "Business and Strategy",
    systemInstruction: "Perform SWOT analysis.\n\nThen give the final response.",
    example: "Use swot for strategic analysis.",
    enabled: true
  },
  {
    trigger: "market analysis",
    category: "Business and Strategy",
    systemInstruction: "Analyze markets.\n\nThen give the final response.",
    example: "Use market analysis for market research.",
    enabled: true
  },
  {
    trigger: "competitor analysis",
    category: "Business and Strategy",
    systemInstruction: "Analyze competitors.\n\nThen give the final response.",
    example: "Use competitor analysis for competitive research.",
    enabled: true
  },
  {
    trigger: "business model",
    category: "Business and Strategy",
    systemInstruction: "Design business models.\n\nThen give the final response.",
    example: "Use business model for model design.",
    enabled: true
  },
  {
    trigger: "revenue model",
    category: "Business and Strategy",
    systemInstruction: "Design revenue models.\n\nThen give the final response.",
    example: "Use revenue model for revenue design.",
    enabled: true
  },
  {
    trigger: "pricing strategy",
    category: "Business and Strategy",
    systemInstruction: "Develop pricing strategies.\n\nThen give the final response.",
    example: "Use pricing strategy for pricing planning.",
    enabled: true
  },
  {
    trigger: "customer journey",
    category: "Business and Strategy",
    systemInstruction: "Map customer journeys.\n\nThen give the final response.",
    example: "Use customer journey for journey mapping.",
    enabled: true
  },
  {
    trigger: "user persona",
    category: "Business and Strategy",
    systemInstruction: "Create user personas.\n\nThen give the final response.",
    example: "Use user persona for persona creation.",
    enabled: true
  },
  {
    trigger: "stakeholder analysis",
    category: "Business and Strategy",
    systemInstruction: "Analyze stakeholders.\n\nThen give the final response.",
    example: "Use stakeholder analysis for stakeholder mapping.",
    enabled: true
  },
  {
    trigger: "risk assessment",
    category: "Business and Strategy",
    systemInstruction: "Assess risks.\n\nThen give the final response.",
    example: "Use risk assessment for risk analysis.",
    enabled: true
  },
  {
    trigger: "mitigation",
    category: "Business and Strategy",
    systemInstruction: "Mitigate risks.\n\nThen give the final response.",
    example: "Use mitigation for risk mitigation.",
    enabled: true
  },
  {
    trigger: "opportunity",
    category: "Business and Strategy",
    systemInstruction: "Identify opportunities.\n\nThen give the final response.",
    example: "Use opportunity for opportunity analysis.",
    enabled: true
  },
  {
    trigger: "competitive advantage",
    category: "Business and Strategy",
    systemInstruction: "Build competitive advantages.\n\nThen give the final response.",
    example: "Use competitive advantage for advantage building.",
    enabled: true
  },
  {
    trigger: "value proposition",
    category: "Business and Strategy",
    systemInstruction: "Create value propositions.\n\nThen give the final response.",
    example: "Use value proposition for proposition design.",
    enabled: true
  },
  {
    trigger: "go to market",
    category: "Business and Strategy",
    systemInstruction: "Plan go to market strategies.\n\nThen give the final response.",
    example: "Use go to market for market entry.",
    enabled: true
  },
  {
    trigger: "product strategy",
    category: "Business and Strategy",
    systemInstruction: "Develop product strategies.\n\nThen give the final response.",
    example: "Use product strategy for product planning.",
    enabled: true
  },
  {
    trigger: "scaling",
    category: "Business and Strategy",
    systemInstruction: "Plan scaling.\n\nThen give the final response.",
    example: "Use scaling for growth planning.",
    enabled: true
  },
  {
    trigger: "automation",
    category: "Business and Strategy",
    systemInstruction: "Identify automation opportunities.\n\nThen give the final response.",
    example: "Use automation for process automation.",
    enabled: true
  },
  {
    trigger: "efficiency",
    category: "Business and Strategy",
    systemInstruction: "Improve efficiency.\n\nThen give the final response.",
    example: "Use efficiency for efficiency gains.",
    enabled: true
  },
  {
    trigger: "cost optimization",
    category: "Business and Strategy",
    systemInstruction: "Optimize costs.\n\nThen give the final response.",
    example: "Use cost optimization for cost reduction.",
    enabled: true
  },
  {
    trigger: "roi analysis",
    category: "Business and Strategy",
    systemInstruction: "Analyze ROI.\n\nThen give the final response.",
    example: "Use roi analysis for ROI calculation.",
    enabled: true
  },
  {
    trigger: "financial planning",
    category: "Business and Strategy",
    systemInstruction: "Plan financial strategy.\n\nThen give the final response.",
    example: "Use financial planning for financial strategy.",
    enabled: true
  },
  {
    trigger: "budget",
    category: "Business and Strategy",
    systemInstruction: "Create and manage budgets.\n\nThen give the final response.",
    example: "Use budget for budget planning.",
    enabled: true
  },
  {
    trigger: "forecast",
    category: "Business and Strategy",
    systemInstruction: "Forecast business metrics.\n\nThen give the final response.",
    example: "Use forecast for business forecasting.",
    enabled: true
  },
  {
    trigger: "learning path",
    category: "Education and Learning",
    systemInstruction: "Design learning paths.\n\nThen give the final response.",
    example: "Use learning path for curriculum design.",
    enabled: true
  },
  {
    trigger: "concept explanation",
    category: "Education and Learning",
    systemInstruction: "Explain concepts clearly.\n\nThen give the final response.",
    example: "Use concept explanation for teaching concepts.",
    enabled: true
  },
  {
    trigger: "skill building",
    category: "Education and Learning",
    systemInstruction: "Develop skills progressively.\n\nThen give the final response.",
    example: "Use skill building for skill development.",
    enabled: true
  },
  {
    trigger: "practice exercise",
    category: "Education and Learning",
    systemInstruction: "Create practice exercises.\n\nThen give the final response.",
    example: "Use practice exercise for practice design.",
    enabled: true
  },
  {
    trigger: "quiz",
    category: "Education and Learning",
    systemInstruction: "Create quiz questions and assessments.\n\nThen give the final response.",
    example: "Use quiz for quiz creation.",
    enabled: true
  },
  {
    trigger: "assessment",
    category: "Education and Learning",
    systemInstruction: "Design assessments.\n\nThen give the final response.",
    example: "Use assessment for assessment design.",
    enabled: true
  },
  {
    trigger: "rubric",
    category: "Education and Learning",
    systemInstruction: "Create grading rubrics.\n\nThen give the final response.",
    example: "Use rubric for rubric development.",
    enabled: true
  },
  {
    trigger: "feedback",
    category: "Education and Learning",
    systemInstruction: "Provide constructive feedback.\n\nThen give the final response.",
    example: "Use feedback for feedback delivery.",
    enabled: true
  },
  {
    trigger: "metacognition",
    category: "Education and Learning",
    systemInstruction: "Promote metacognitive thinking.\n\nThen give the final response.",
    example: "Use metacognition for reflective learning.",
    enabled: true
  },
  {
    trigger: "learning objective",
    category: "Education and Learning",
    systemInstruction: "Define learning objectives.\n\nThen give the final response.",
    example: "Use learning objective for objective setting.",
    enabled: true
  },
  {
    trigger: "prerequisite",
    category: "Education and Learning",
    systemInstruction: "Identify prerequisites.\n\nThen give the final response.",
    example: "Use prerequisite for prerequisite mapping.",
    enabled: true
  },
  {
    trigger: "scaffolding",
    category: "Education and Learning",
    systemInstruction: "Use scaffolding techniques.\n\nThen give the final response.",
    example: "Use scaffolding for graduated learning.",
    enabled: true
  },
  {
    trigger: "differentiation",
    category: "Education and Learning",
    systemInstruction: "Differentiate instruction.\n\nThen give the final response.",
    example: "Use differentiation for adaptive learning.",
    enabled: true
  },
  {
    trigger: "multiple intelligences",
    category: "Education and Learning",
    systemInstruction: "Apply multiple intelligences theory.\n\nThen give the final response.",
    example: "Use multiple intelligences for diverse learning styles.",
    enabled: true
  },
  {
    trigger: "learning style",
    category: "Education and Learning",
    systemInstruction: "Adapt to different learning styles.\n\nThen give the final response.",
    example: "Use learning style for personalized learning.",
    enabled: true
  },
  {
    trigger: "active learning",
    category: "Education and Learning",
    systemInstruction: "Promote active learning.\n\nThen give the final response.",
    example: "Use active learning for engagement.",
    enabled: true
  },
  {
    trigger: "peer learning",
    category: "Education and Learning",
    systemInstruction: "Facilitate peer learning.\n\nThen give the final response.",
    example: "Use peer learning for collaborative learning.",
    enabled: true
  },
  {
    trigger: "socratic method",
    category: "Education and Learning",
    systemInstruction: "Use Socratic questioning.\n\nThen give the final response.",
    example: "Use socratic method for guided discovery.",
    enabled: true
  },
  {
    trigger: "spaced repetition",
    category: "Education and Learning",
    systemInstruction: "Apply spaced repetition.\n\nThen give the final response.",
    example: "Use spaced repetition for memory retention.",
    enabled: true
  },
  {
    trigger: "retention",
    category: "Education and Learning",
    systemInstruction: "Optimize information retention.\n\nThen give the final response.",
    example: "Use retention for memory optimization.",
    enabled: true
  }
];

export const getAllTriggers = (): Trigger[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const customTriggers = JSON.parse(stored) as Trigger[];
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

export const saveTriggers = (triggers: Trigger[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(triggers));
  } catch (error) {
    console.error('Error saving triggers:', error);
  }
};

export const addTrigger = (trigger: Trigger) => {
  const triggers = getAllTriggers();
  const exists = triggers.some(t => t.trigger.toLowerCase() === trigger.trigger.toLowerCase());
  if (exists) {
    throw new Error('Trigger already exists');
  }
  triggers.push({ ...trigger, custom: true });
  saveTriggers(triggers);
};

export const updateTrigger = (oldTrigger: string, newTrigger: Trigger) => {
  const triggers = getAllTriggers();
  const index = triggers.findIndex(t => t.trigger.toLowerCase() === oldTrigger.toLowerCase());
  if (index !== -1) {
    triggers[index] = newTrigger;
    saveTriggers(triggers);
  }
};

export const deleteTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const filtered = triggers.filter(t => 
    t.trigger.toLowerCase() !== triggerName.toLowerCase() || !t.custom
  );
  saveTriggers(filtered);
};

export const toggleTrigger = (triggerName: string) => {
  const triggers = getAllTriggers();
  const trigger = triggers.find(t => t.trigger.toLowerCase() === triggerName.toLowerCase());
  if (trigger) {
    trigger.enabled = !trigger.enabled;
    saveTriggers(triggers);
  }
};

export const exportTriggers = () => {
  const triggers = getAllTriggers();
  const dataStr = JSON.stringify(triggers, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onyxgptTriggers${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

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



export const generateTriggerMetadata = (trigger: Trigger, userPrompt: string): TriggerMetadata => {
  const tagName = generateTagName(trigger.trigger);
  return {
    trigger: trigger.trigger,
    category: trigger.category,
    purpose: trigger.systemInstruction.replace(/Use tags.*?final response\.\s*/i, '').trim(),
    contextUsed: `Applied to user prompt: "${userPrompt.substring(0, 100)}${userPrompt.length > 100 ? '...' : ''}"`,
    influenceScope: `Affects response structure tone and content based on ${trigger.category.toLowerCase()} requirements.`,
    custom: trigger.custom ?? false,
  };
};

export const detectTriggersAndBuildPrompt = (userMessage: string): { 
  systemPrompt: string; 
  detectedTriggers: DetectedTrigger[];
  enhancedSystemPrompt?: string;
} => {
  const triggers = getAllTriggers().filter(t => t.enabled);
  const detectedTriggers: DetectedTrigger[] = [];
  const instructions: string[] = [];
  const enhancedInstructions: string[] = [];

  const lowerMessage = userMessage.toLowerCase();

  triggers.forEach(trigger => {
    const regex = new RegExp(`\\b${trigger.trigger.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerMessage)) {
      const tagName = generateTagName(trigger.trigger);
      const metadata = generateTriggerMetadata(trigger, userMessage);
      
      detectedTriggers.push({
        name: trigger.trigger,
        tag: tagName,
        category: trigger.category,
        instruction: trigger.systemInstruction,
        metadata,
      });
      
      instructions.push(`${trigger.trigger} means ${trigger.systemInstruction}`);
      
      // ALWAYS generate the strict template for any detected trigger
      const template = trigger.systemPromptTemplate || buildDefaultSystemPromptTemplate(trigger);
      enhancedInstructions.push(template);
    }
  });

  let systemPrompt = '';
  if (instructions.length > 0) {
    systemPrompt = instructions.join(' ') + '\n\nFor';
  } else {
    systemPrompt = '';
  }

  let enhancedSystemPrompt = '';
  if (enhancedInstructions.length > 0) {
    enhancedSystemPrompt = enhancedInstructions.join('\n\n---\n\n');
  }

  return { systemPrompt, detectedTriggers, enhancedSystemPrompt };
};



export const buildEnhancedSystemPromptWithMemory = (
  detectedTriggers: DetectedTrigger[],
  memoryContext?: string,
  selectedMemoryForContext?: Array<{ key: string; value: string }>,
): string => {
  const sections: string[] = [];

  sections.push('Active Triggers and Response Format\n');
  
  detectedTriggers.forEach((trigger, idx) => {
    sections.push(`Trigger ${idx + 1} ${trigger.name}`);
    sections.push(`Category ${trigger.category}`);
    sections.push(`Instruction ${trigger.instruction}`);
    sections.push('');
  });

  if (memoryContext) {
    sections.push('AI Memory Context Internal Only\n');
    sections.push(`Trigger Usage ${memoryContext}\n`);
  }

  if (selectedMemoryForContext && selectedMemoryForContext.length > 0) {
    sections.push('Selected Memory Context\n');
    selectedMemoryForContext.forEach(mem => {
      sections.push(`${mem.key} ${mem.value}`);
    });
    sections.push('');
  }

  sections.push('Response Guidelines\n');
  sections.push('Provide thorough comprehensive responses to each trigger');
  sections.push('Use structured thinking with appropriate XML tags');
  sections.push('Ensure responses are informative and detailed');
  sections.push('Maintain context from any related memories when relevant');

  return sections.join('\n');
};

const isInsideCodeBlock = (content: string, position: number): boolean => {
  const codeBlockRegex = /```[\s\S]*?```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (position >= match.index && position < match.index + match[0].length) {
      return true;
    }
  }
  
  return false;
};

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
  
  // STEP 1: Strip out the activation header COMPLETELY
  // Pattern: 🔴 [trigger] Trigger Active | Mode: [category]
  // Remove from start of content until we find the first tag or actual content
  const headerRegex = /^.*?🔴.*?Trigger Active\s*\|\s*Mode:\s*[^\n]*[\n]*/i;
  cleanContent = cleanContent.replace(headerRegex, '');

  // STEP 2: Remove category names that appear as preambles before content
  // These are the full category names from the trigger system
  const categoryLabels = [
    'Reasoning and Analysis',
    'Research and Information', 
    'Planning and Organization',
    'Communication and Style',
    'Coding and Development',
    'Creative and Writing',
    'Data and Analytics',
    'Business and Strategy',
    'Education and Learning'
  ];
  
  // Remove category labels with aggressive matching
  // Match: category name possibly followed by colon, pipe, dash, asterisks, or newline
  for (const label of categoryLabels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match at line start or after newlines, with optional formatting
    const patterns = [
      new RegExp(`^\\s*${escaped}\\s*[:|-]?\\s*$`, 'im'),
      new RegExp(`\n\\s*${escaped}\\s*[:|-]?\\s*(?=\n|<)`, 'g'),
      new RegExp(`\\n\\s*\\*\\*${escaped}\\*\\*\\s*[:|-]?\\s*`, 'g'),
    ];
    patterns.forEach(pattern => {
      cleanContent = cleanContent.replace(pattern, '\n');
    });
  }
  
  // STEP 3: Remove any standalone labels that start with asterisks
  // E.g. "**CORE FRAMEWORK...", "**1. STRENGTHS:"
  cleanContent = cleanContent.replace(/^\s*\*\*[A-Z][^]*?(?=\n|<|$)/gim, '');
  
  // STEP 4: Clean up excessive newlines
  cleanContent = cleanContent.replace(/^\s+/, '').trim();

  const tagRegex = /<([a-zA-Z_][a-zA-Z0-9_]*?)>([\s\S]*?)<\/\1>/g;
  
  tagRegex.lastIndex = 0;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const [fullMatch, tagName, tagContent] = match;
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, match.index)) {
      taggedSegments.push({
        tag: tagName,
        content: tagContent.trim(),
        startIndex: match.index,
        endIndex: match.index + fullMatch.length,
      });
      replacements.push({ start: match.index, end: match.index + fullMatch.length });
    }
  }
  
  const allOpeningsRegex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/g;
  let openingMatch;
  const unclosedTags: Array<{ tagName: string; index: number; endIndex: number }> = [];
  
  while ((openingMatch = allOpeningsRegex.exec(content)) !== null) {
    const tagName = openingMatch[1];
    const closingTag = `</${tagName}>`;
    
    if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, openingMatch.index)) {
      const closingIndex = content.indexOf(closingTag, openingMatch.index);
      const hasClosingTag = closingIndex !== -1;
      
      if (!hasClosingTag) {
        unclosedTags.push({
          tagName,
          index: openingMatch.index,
          endIndex: openingMatch.index + openingMatch[0].length,
        });
      }
    }
  }
  
  if (unclosedTags.length > 0) {
    const lastUnclosedTag = unclosedTags[unclosedTags.length - 1];
    const alreadyInSegments = taggedSegments.some(seg => seg.tag === lastUnclosedTag.tagName);
    
    if (!alreadyInSegments) {
      let contentStart = lastUnclosedTag.endIndex;
      let contentEnd = content.length;
      
      const otherOpenTagsAfter = unclosedTags.filter(t => t.index > lastUnclosedTag.index);
      if (otherOpenTagsAfter.length > 0) {
        const firstOtherTag = otherOpenTagsAfter[0];
        contentEnd = firstOtherTag.index;
      }
      
      const contentToUse = content.substring(contentStart, contentEnd);
      
      taggedSegments.push({
        tag: lastUnclosedTag.tagName,
        content: contentToUse.trim(),
        startIndex: lastUnclosedTag.index,
        endIndex: contentEnd,
      });
      
      replacements.push({ start: lastUnclosedTag.index, end: contentEnd });
    }
  }
  
  const sortedReplacements = replacements.sort((a, b) => b.start - a.start);
  
  for (const replacement of sortedReplacements) {
    cleanContent = cleanContent.substring(0, replacement.start) + cleanContent.substring(replacement.end);
  }
  
  for (const tag of VALID_TRIGGER_TAGS) {
    const closingRegex = new RegExp(`</${tag}>`, 'g');
    cleanContent = cleanContent.replace(closingRegex, '');
  }
  
  // Final cleanup: normalize whitespace
  cleanContent = cleanContent
    .replace(/\n\n\n+/g, '\n\n') // Collapse multiple blank lines
    .trim();
  
  // FAILSAFE: If cleanContent is empty or very short, extract a meaningful summary from trigger content
  if (cleanContent.trim().length < 50 && taggedSegments.length > 0) {
    // Try to find a conclusion section or summary
    for (const segment of taggedSegments) {
      const segmentContent = segment.content;
      
      // Look for conclusion patterns
      const conclusionMatch = segmentContent.match(/(###\s*Conclusion|###\s*Summary|###\s*Final Answer|In summary|In conclusion|To conclude|Therefore,|Summary:)([\s\S]*?)(?=###|$)/i);
      if (conclusionMatch && conclusionMatch[2].trim().length > 30) {
        cleanContent = `**${segment.tag.charAt(0).toUpperCase() + segment.tag.slice(1)} Summary:**\n\n${conclusionMatch[0].trim()}`;
        break;
      }
      
      // If no conclusion, extract last non-empty paragraph
      if (cleanContent.length === 0) {
        const paragraphs = segmentContent.trim().split(/\n\n+/).filter(p => p.trim().length > 0);
        if (paragraphs.length > 0) {
          const lastParagraph = paragraphs[paragraphs.length - 1];
          if (lastParagraph.length > 50) {
            cleanContent = `**${segment.tag.charAt(0).toUpperCase() + segment.tag.slice(1)} Analysis:**\n\n${lastParagraph}`;
            break;
          }
        }
      }
    }
    
    // Final fallback
    if (cleanContent.trim().length === 0) {
      cleanContent = "_The detailed analysis is available in the trigger bar above._";
    }
  }

  return { cleanContent, taggedSegments };
};

export const resetToBuiltIn = () => {
  saveTriggers(BUILT_IN_TRIGGERS);
};
