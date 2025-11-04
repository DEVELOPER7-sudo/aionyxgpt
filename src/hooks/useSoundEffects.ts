import { useCallback } from 'react';

// Sound effects using Web Audio API
const createBeep = (frequency: number, duration: number, volume: number = 0.3) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const useSoundEffects = () => {
  const playButtonClick = useCallback(() => {
    try {
      createBeep(800, 0.05, 0.2);
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, []);

  const playMessageSent = useCallback(() => {
    try {
      createBeep(600, 0.1, 0.3);
      setTimeout(() => createBeep(800, 0.1, 0.3), 100);
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, []);

  const playMessageComplete = useCallback(() => {
    try {
      createBeep(700, 0.08, 0.25);
      setTimeout(() => createBeep(900, 0.08, 0.25), 80);
      setTimeout(() => createBeep(1100, 0.12, 0.25), 160);
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, []);

  const playError = useCallback(() => {
    try {
      createBeep(300, 0.15, 0.3);
      setTimeout(() => createBeep(250, 0.2, 0.3), 150);
    } catch (error) {
      console.log('Sound effect failed:', error);
    }
  }, []);

  return {
    playButtonClick,
    playMessageSent,
    playMessageComplete,
    playError,
  };
};
