import { useState } from 'react';
import { toast } from 'sonner';

export const useVisionAI = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (imagePath: string, prompt: string = "What do you see in this image? Provide a detailed description."): Promise<string> => {
    setIsAnalyzing(true);
    try {
      // @ts-ignore - Puter is loaded via script tag
      const puter = window.puter;
      
      if (!puter?.ai?.chat) {
        throw new Error('Puter AI not available');
      }

      // Use vision-capable models (gpt-5-nano supports vision)
      const response = await puter.ai.chat(prompt, imagePath, {
        model: "gpt-5-nano",
      });

      let fullResponse = '';
      for await (const part of response) {
        fullResponse += part?.text || '';
      }

      return fullResponse;
    } catch (error: any) {
      console.error('Vision AI error:', error);
      toast.error('Failed to analyze image');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return { analyzeImage, isAnalyzing };
};
