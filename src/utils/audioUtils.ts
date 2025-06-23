
export const createAudioAlert = (audioEnabled: boolean, audioContextRef: React.MutableRefObject<AudioContext | null>) => {
  if (!audioEnabled) return;

  try {
    // Use text-to-speech for the alert
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Please throw the trash');
      utterance.rate = 1.2;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && 
        (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
      console.log('🔊 TRASH DETECTED - "Please throw the trash" spoken!');
      return;
    }
    
    // Fallback to beep if speech synthesis is not available
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    }

    const audioContext = audioContextRef.current;
    
    // Create a simple beep sound as fallback
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the alert sound (higher pitch, urgent tone)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.6);

    console.log('🔊 TRASH DETECTED - Fallback beep played (speech not available)!');
  } catch (error) {
    console.error('Error playing audio alert:', error);
    console.log('🗑️ PLEASE THROW THE TRASH!');
  }
};
