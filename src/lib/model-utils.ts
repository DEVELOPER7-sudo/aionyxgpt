// Utility functions for model management

/**
 * Beautify model names by parsing the ID and making it human-readable
 */
export function beautifyModelName(modelId: string): string {
  // Remove any prefix (openrouter: or togetherai:) if present
  const cleanId = modelId.replace(/^(openrouter|togetherai):/, '');
  
  // Split by / and -
  const parts = cleanId.split(/[/-]/);
  
  // Capitalize and join
  const beautified = parts
    .map(part => {
      // Handle special cases
      if (part === 'gpt') return 'GPT';
      if (part === 'ai') return 'AI';
      if (part === 'llama') return 'Llama';
      if (part === 'claude') return 'Claude';
      if (part === 'gemini') return 'Gemini';
      if (part === 'deepseek') return 'DeepSeek';
      if (part === 'mistral') return 'Mistral';
      if (part === 'qwen') return 'Qwen';
      if (part.match(/^\d/)) return part; // Keep numbers as-is
      if (part === 'it') return '';
      if (part === 'instruct') return '';
      if (part === 'free') return '(Free)';
      if (part === 'preview') return 'Preview';
      if (part === 'thinking') return 'Thinking';
      
      // Capitalize first letter
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .filter(Boolean)
    .join(' ');
  
  return beautified || modelId;
}

/**
 * Get custom models from localStorage
 */
export function getCustomModels(): string[] {
  try {
    const stored = localStorage.getItem('custom_models');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save custom models to localStorage
 */
export function saveCustomModels(models: string[]): void {
  localStorage.setItem('custom_models', JSON.stringify(models));
}

/**
 * Add a custom model - automatically adds prefix if not present
 */
export function addCustomModel(modelId: string, prefix: 'openrouter' | 'togetherai' = 'openrouter'): boolean {
  // Auto-add prefix if not present
  const hasPrefix = modelId.startsWith('openrouter:') || modelId.startsWith('togetherai:');
  const prefixedModelId = hasPrefix ? modelId : `${prefix}:${modelId}`;
  
  const customModels = getCustomModels();
  if (customModels.includes(prefixedModelId)) {
    return false; // Already exists
  }
  customModels.push(prefixedModelId);
  saveCustomModels(customModels);
  return true;
}

/**
 * Remove a custom model
 */
export function removeCustomModel(modelId: string): void {
  const customModels = getCustomModels();
  const filtered = customModels.filter(m => m !== modelId);
  saveCustomModels(filtered);
}

/**
 * Extract provider name from model ID
 */
export function getProviderFromModelId(modelId: string): string {
  if (modelId.startsWith('openrouter:')) {
    const parts = modelId.replace('openrouter:', '').split('/');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  if (modelId.startsWith('togetherai:')) {
    const parts = modelId.replace('togetherai:', '').split('/');
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  
  // Determine provider from model name
  if (modelId.includes('gpt') || modelId.includes('o1') || modelId.includes('o3') || modelId.includes('o4')) {
    return 'OpenAI';
  }
  if (modelId.includes('claude')) {
    return 'Anthropic';
  }
  if (modelId.includes('gemini') || modelId.includes('gemma')) {
    return 'Google';
  }
  if (modelId.includes('deepseek')) {
    return 'DeepSeek';
  }
  if (modelId.includes('grok')) {
    return 'xAI';
  }
  if (modelId.includes('llama')) {
    return 'Meta';
  }
  if (modelId.includes('mistral') || modelId.includes('mixtral')) {
    return 'Mistral';
  }
  if (modelId.includes('qwen')) {
    return 'Qwen';
  }
  
  return 'Puter';
}
