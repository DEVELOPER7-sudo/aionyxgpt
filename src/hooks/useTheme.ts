import { useEffect } from 'react';
import { AppSettings } from '@/types/chat';

export const useTheme = (settings: AppSettings) => {
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.themeColor) {
      root.style.setProperty('--primary', settings.themeColor);
      root.style.setProperty('--ring', settings.themeColor);
      root.style.setProperty('--sidebar-primary', settings.themeColor);
      root.style.setProperty('--sidebar-ring', settings.themeColor);
      
      // Update glow effects
      const [h, s, l] = settings.themeColor.split(' ');
      root.style.setProperty('--glow-blue', `0 0 20px hsl(${h} ${s} ${l} / 0.5)`);
      root.style.setProperty('--glow-blue-strong', `0 0 30px hsl(${h} ${s} ${l} / 0.8)`);
    }
    
    if (settings.accentColor) {
      root.style.setProperty('--accent', settings.accentColor);
    }
    
    if (settings.backgroundColor) {
      root.style.setProperty('--background', settings.backgroundColor);
    }
  }, [settings.themeColor, settings.accentColor, settings.backgroundColor]);
};
