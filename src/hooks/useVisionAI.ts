import { useState } from 'react';
import { createPuterAPILogger } from '@/lib/api-logger';

export const useVisionAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (
    imageUrl: string | string[],
    prompt: string = 'What do you see?',
    model: string = 'gpt-5-nano'
  ): Promise<string> => {
    // @ts-ignore - Puter is loaded via script tag
    const puter = (window as any)?.puter;
    if (!puter?.ai?.chat) {
      console.error('Puter AI not available - ensure Puter script is loaded');
      throw new Error('Puter AI service not available');
    }

    setIsAnalyzing(true);
    const logger = createPuterAPILogger();
    
    try {
      // Call Puter vision API - supports single image or multiple images array
      const result = await puter.ai.chat(prompt, imageUrl, { model });
      logger.logSuccess('puter.ai.chat (vision)', { prompt, imageUrl, model }, result);
      return typeof result === 'string' ? result : String(result);
    } catch (error: any) {
      logger.logError('puter.ai.chat (vision)', { prompt, imageUrl, model }, error);
      console.error('Vision AI error:', error);
      throw new Error(error?.message || 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeImage, isAnalyzing };
};
