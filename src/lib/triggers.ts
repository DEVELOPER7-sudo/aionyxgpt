
import { storage } from './storage';

export interface Trigger {
  trigger: string;
  category: 'Reasoning & Analysis' | 'Research & Information' | 'Planning & Organization' | 'Communication & Style' | 'Custom';
  system_instruction: string;
  example: string;
  enabled: boolean;
  tag: string;
  metadata_support: boolean;
  context_expansion: boolean; // New field
}

// Load custom triggers from storage or use an empty array
const customTriggers: Trigger[] = storage.getCustomTriggers();

export const defaultTriggers: Trigger[] = [
  // Reasoning & Analysis
  { trigger: 'analyze', category: 'Reasoning & Analysis', system_instruction: 'Break down the user query into its fundamental components and examine each part systematically. Identify underlying assumptions, logical structures, and key relationships. Your output should be a detailed, structured analysis.', example: 'Use "analyze" to deconstruct a complex problem.', enabled: true, tag: '<analyze></analyze>', metadata_support: true, context_expansion: true },
  { trigger: 'compare', category: 'Reasoning & Analysis', system_instruction: 'Identify key similarities and differences between two or more subjects. Create a structured comparison that highlights the most important distinctions and shared characteristics.', example: 'Use "compare" to evaluate two opposing viewpoints.', enabled: true, tag: '<compare></compare>', metadata_support: true, context_expansion: true },
  { trigger: 'critique', category: 'Reasoning & Analysis', system_instruction: 'Provide a balanced and constructive evaluation of a subject, identifying both its strengths and weaknesses. Your critique should be supported by evidence and logical reasoning.', example: 'Use "critique" to review a piece of work.', enabled: true, tag: '<critique></critique>', metadata_support: true, context_expansion: true },
  { trigger: 'deduce', category: 'Reasoning & Analysis', system_instruction: 'Draw logical conclusions from the provided information. Clearly state the premises and show how they lead to the final deduction. Avoid making assumptions beyond the given context.', example: 'Use "deduce" to find a logical conclusion.', enabled: true, tag: '<deduce></deduce>', metadata_support: true, context_expansion: false },
  { trigger: 'evaluate', category: 'Reasoning & Analysis', system_instruction: 'Assess the value, quality, or significance of a subject based on a set of criteria. Your evaluation should be objective and well-reasoned.', example: 'Use "evaluate" to judge the effectiveness of a solution.', enabled: true, tag: '<evaluate></evaluate>', metadata_support: true, context_expansion: true },
  { trigger: 'explain', category: 'Reasoning & Analysis', system_instruction: 'Clarify a topic in simple, easy-to-understand terms. Use analogies and examples to make complex ideas accessible to a broad audience.', example: 'Use "explain" to simplify a technical concept.', enabled: true, tag: '<explain></explain>', metadata_support: true, context_expansion: true },
  { trigger: 'justify', category: 'Reasoning & Analysis', system_instruction: 'Defend a claim or decision with rational arguments and factual support. Anticipate counterarguments and address them proactively.', example: 'Use "justify" to provide supporting reasoning.', enabled: true, tag: '<justify></justify>', metadata_support: true, context_expansion: true },
  { trigger: 'hypothesize', category: 'Reasoning & Analysis', system_instruction: 'Formulate a plausible explanation or prediction based on limited evidence. Clearly state your hypothesis and the reasoning behind it.', example: 'Use "hypothesize" for theory building.', enabled: true, tag: '<hypothesize></hypothesize>', metadata_support: true, context_expansion: true },
  { trigger: 'examine', category: 'Reasoning & Analysis', system_instruction: 'Inspect a subject in detail, paying close attention to its components, structure, and nuances. Your examination should be thorough and systematic.', example: 'Use "examine" for detailed inspection.', enabled: true, tag: '<examine></examine>', metadata_support: true, context_expansion: true },
  { trigger: 'interpret', category: 'Reasoning & Analysis', system_instruction: 'Explain the meaning or significance of data, a text, or an event. Provide context and clarify any ambiguities.', example: 'Use "interpret" to decode complex information.', enabled: true, tag: '<interpret></interpret>', metadata_support: true, context_expansion: true },
  { trigger: 'verify', category: 'Reasoning & Analysis', system_instruction: 'Check the accuracy and consistency of statements or data. Cross-reference information and identify any discrepancies.', example: 'Use "verify" to confirm facts.', enabled: true, tag: '<verify></verify>', metadata_support: true, context_expansion: false },
  { trigger: 'reflect', category: 'Reasoning & Analysis', system_instruction: 'Offer thoughtful insights and consider the broader implications of a topic. Go beyond surface-level analysis to explore deeper meanings and connections.', example: 'Use "reflect" for deeper understanding.', enabled: true, tag: '<reflect></reflect>', metadata_support: true, context_expansion: true },
  { trigger: 'fact_check', category: 'Reasoning & Analysis', system_instruction: 'Verify the factual accuracy of a statement using reliable sources. Clearly state the claim and provide a verdict with supporting evidence.', example: 'Use "fact_check" on a questionable statement.', enabled: true, tag: '<fact_check></fact_check>', metadata_support: true, context_expansion: false },
  { trigger: 'validate', category: 'Reasoning & Analysis', system_instruction: 'Confirm the truth or reliability of a claim using established facts and principles. Your validation should be rigorous and objective.', example: 'Use "validate" to check credibility.', enabled: true, tag: '<validate></validate>', metadata_support: true, context_expansion: false },
  { trigger: 'assess', category: 'Reasoning & Analysis', system_instruction: 'Determine the overall soundness, performance, or impact of a subject against a set of standards or goals. Your assessment should be comprehensive and balanced.', example: 'Use "assess" for a comprehensive evaluation.', enabled: true, tag: '<assess></assess>', metadata_support: true, context_expansion: true },
  { trigger: 'troubleshoot', category: 'Reasoning & Analysis', system_instruction: 'Identify the root cause of a problem, diagnose its components, and propose concrete steps for resolution. Your approach should be logical and systematic.', example: 'Use "troubleshoot" to solve an issue.', enabled: true, tag: '<troubleshoot></troubleshoot>', metadata_support: true, context_expansion: true },

  // Research & Information
  { trigger: 'research', category: 'Research & Information', system_instruction: 'Gather information from credible sources to answer a specific question. Synthesize the findings and present them in a clear and organized manner.', example: 'Use "research" to find information on a topic.', enabled: true, tag: '<research></research>', metadata_support: true, context_expansion: false },
  { trigger: 'summarize', category: 'Research & Information', system_instruction: 'Condense a text or topic to its most important points. The summary should be concise, accurate, and easy to understand.', example: 'Use "summarize" to get the key points of a long article.', enabled: true, tag: '<summarize></summarize>', metadata_support: true, context_expansion: true },
  { trigger: 'quote', category: 'Research & Information', system_instruction: 'Provide a relevant and verbatim quotation from a source. Ensure the quote is accurately attributed and placed in a meaningful context.', example: 'Use "quote" to cite an expert.', enabled: true, tag: '<quote></quote>', metadata_support: true, context_expansion: false },
  { trigger: 'deep_research', category: 'Research & Information', system_instruction: 'Conduct an in-depth, multi-source investigation using reliable data. Synthesize complex information and summarize the findings concisely, providing citations where appropriate.', example: 'Use "deep_research" for comprehensive investigation.', enabled: true, tag: '<deep_research></deep_research>', metadata_support: true, context_expansion: false },

  // Planning & Organization
  { trigger: 'plan', category: 'Planning & Organization', system_instruction: 'Create a step-by-step plan to achieve a specific goal. The plan should be realistic, actionable, and include measurable milestones.', example: 'Use "plan" to create a project timeline.', enabled: true, tag: '<plan></plan>', metadata_support: true, context_expansion: true },
  { trigger: 'organize', category: 'Planning & Organization', system_instruction: 'Structure information in a logical and coherent way. Use headings, lists, and tables to improve clarity and readability.', example: 'Use "organize" to structure a report.', enabled: true, tag: '<organize></organize>', metadata_support: true, context_expansion: true },
  { trigger: 'outline', category: 'Planning & Organization', system_instruction: 'Create a hierarchical outline for a document or project. The outline should clearly show the main topics and sub-topics.', example: 'Use "outline" to structure a presentation.', enabled: true, tag: '<outline></outline>', metadata_support: true, context_expansion: true },
  { trigger: 'brainstorm', category: 'Planning & Organization', system_instruction: 'Generate a wide range of ideas on a given topic. Encourage creativity and suspend judgment during the brainstorming process.', example: 'Use "brainstorm" to generate ideas for a new product.', enabled: true, tag: '<brainstorm></brainstorm>', metadata_support: true, context_expansion: false },

  // Communication & Style
  { trigger: 'rewrite', category: 'Communication & Style', system_instruction: 'Revise a piece of text to improve its clarity, tone, or style. The rewritten version should be more effective and engaging for the target audience.', example: 'Use "rewrite" to improve a paragraph.', enabled: true, tag: '<rewrite></rewrite>', metadata_support: true, context_expansion: true },
  { trigger: 'format', category: 'Communication & Style', system_instruction: 'Structure the output in a specific format (e.g., as a list, table, or JSON). Adhere strictly to the requested format.', example: 'Use "format as a list" for structured output.', enabled: true, tag: '<format></format>', metadata_support: true, context_expansion: false },
  { trigger: 'roleplay', category: 'Communication & Style', system_instruction: 'Adopt a specific persona or role and respond from that perspective. Maintain the character\'s voice, tone, and knowledge base throughout the interaction.', example: 'Use "roleplay as a pirate" for a themed response.', enabled: true, tag: '<roleplay></roleplay>', metadata_support: true, context_expansion: true },
  { trigger: 'code', category: 'Communication & Style', system_instruction: 'Generate a code snippet in a specified programming language. The code should be well-commented, efficient, and follow best practices.', example: 'Use "code in Python" to get a script.', enabled: true, tag: '<code_in_python></code_in_python>', metadata_support: true, context_expansion: true }
];

export const allTriggers = [...defaultTriggers, ...customTriggers];

export const getTrigger = (triggerWord: string): Trigger | undefined => {
  return allTriggers.find(t => t.trigger.toLowerCase() === triggerWord.toLowerCase());
};

export const detectTriggersAndBuildPrompt = (userInput: string): { systemPrompt: string; detectedTriggers: Trigger[] } => {
  let systemPrompt = "You are OnyxGPT, a powerful AI assistant. Your responses must be helpful, accurate, and well-formatted. ";
  const detectedTriggers: Trigger[] = [];
  
  // Detect triggers by word and in brackets
  const words = userInput.toLowerCase().match(/\b(\w+)\b/g) || [];
  const bracketTriggers = userInput.match(/\[(.*?)\]/g) || [];

  const combinedTriggers = [...words, ...bracketTriggers.map(t => t.slice(1, -1))];

  for (const trigger of allTriggers) {
    if (trigger.enabled && combinedTriggers.includes(trigger.trigger.toLowerCase())) {
      if (!detectedTriggers.some(t => t.trigger === trigger.trigger)) {
          detectedTriggers.push(trigger);
      }
    }
  }

  if (detectedTriggers.length > 0) {
    const triggerInstructions = detectedTriggers
      .map(t => `For the trigger '${t.trigger}', you must follow this instruction: "${t.system_instruction}".`)
      .join(' ');
    
    const tagInstructions = `When a trigger is active, you MUST wrap any content influenced by it in its corresponding tag (e.g., ${detectedTriggers.map(t => t.tag).join(', ')}). The tag name must be the trigger keyword. Tags can be nested but must be properly closed.`;

    const contextInstructions = detectedTriggers.some(t => t.context_expansion) ? `For triggers with context expansion, you may use the entire conversation history to inform your response. ` : ``;

    const metadataInstructions = `After your complete response, you MUST provide a single, valid, minified JSON array of objects, one for each trigger used. Each object must contain: {"trigger": "trigger_name", "category": "Category Name", "purpose": "System instruction for the trigger.", "context_used": "A brief explanation of why and how you used this trigger in this specific context.", "influence_scope": "A brief description of what aspects of the response this trigger influenced."}. This JSON block must be the absolute final part of your output, with no text after it.`;

    systemPrompt += triggerInstructions + " " + tagInstructions + " " + contextInstructions + " " + metadataInstructions;
  }
  
  // Add a final instruction for the overall user prompt
  systemPrompt += ` Now, address the following user request:`;

  return { systemPrompt, detectedTriggers };
};
