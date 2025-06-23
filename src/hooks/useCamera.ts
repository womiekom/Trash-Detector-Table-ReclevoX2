
import { useState, useRef } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [flashSupported, setFlashSupported] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        
        // Check if flash is supported
        const videoTrack = mediaStream.getVideoTracks()[0];
        const capabilities = videoTrack.getCapabilities();
        setFlashSupported(!!(capabilities as any).torch);
        console.log('Flash supported:', !!(capabilities as any).torch);
      }
      return 'Camera started - Point camera at objects to detect trash vs normal items';
    } catch (error) {
      console.error('Error accessing camera:', error);
      return 'Camera access denied';
    }
  };

  const toggleFlash = async () => {
    if (!stream || !flashSupported) return;
    
    try {
      const videoTrack = stream.getVideoTracks()[0];
      const newFlashState = !flashEnabled;
      
      await videoTrack.applyConstraints({
        advanced: [{ torch: newFlashState } as any]
      });
      
      setFlashEnabled(newFlashState);
      console.log('Flash toggled:', newFlashState);
      return `Flash ${newFlashState ? 'ON' : 'OFF'}`;
    } catch (error) {
      console.error('Error toggling flash:', error);
      return 'Flash control not available';
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setFlashEnabled(false);
      setFlashSupported(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    return 'Camera stopped';
  };

  return {
    videoRef,
    stream,
    flashEnabled,
    flashSupported,
    startCamera,
    stopCamera,
    toggleFlash
  };
};
