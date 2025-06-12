
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CameraOff, Volume2 } from 'lucide-react';

const TrashDetector: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [detectionStatus, setDetectionStatus] = useState<string>('Not detecting');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Create audio alert using Web Audio API
  const playTrashAlert = () => {
    if (!audioEnabled) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      
      // Create a simple beep sound
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

      console.log('🔊 TRASH DETECTED - Audio alert played!');
    } catch (error) {
      console.error('Error playing audio alert:', error);
      // Fallback to console alert if audio fails
      console.log('🗑️ PLEASE THROW THE TRASH!');
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setDetectionStatus('Camera started - Ready to detect');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setDetectionStatus('Camera access denied');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsDetecting(false);
    setDetectionStatus('Camera stopped');
  };

  const detectTrash = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Convert canvas to blob for analysis
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Simulate trash detection (replace with actual ML model)
        const detectionResult = Math.random() > 0.7; // 30% chance to detect "trash"
        
        if (detectionResult) {
          setDetectionStatus('🗑️ Trash detected under table!');
          playTrashAlert(); // Play sound instead of showing visual alert
        } else {
          setDetectionStatus('✅ No trash detected');
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Detection error:', error);
      setDetectionStatus('Detection error occurred');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isDetecting && stream) {
      intervalId = setInterval(detectTrash, 2000); // Check every 2 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDetecting, stream]);

  const toggleDetection = () => {
    if (!stream) {
      startCamera();
    }
    setIsDetecting(!isDetecting);
    setDetectionStatus(isDetecting ? 'Detection paused' : 'Detection active');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Trash Detection System (Audio Alerts)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 bg-gray-200 rounded-lg object-cover"
          />
          <canvas
            ref={canvasRef}
            className="hidden"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={toggleDetection}
            variant={isDetecting ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {isDetecting ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            {isDetecting ? 'Stop Detection' : 'Start Detection'}
          </Button>

          <Button
            onClick={toggleAudio}
            variant={audioEnabled ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Audio: {audioEnabled ? 'ON' : 'OFF'}
          </Button>

          {stream && (
            <Button onClick={stopCamera} variant="outline">
              Stop Camera
            </Button>
          )}
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Status: {detectionStatus}</p>
          {audioEnabled && (
            <p className="text-xs text-muted-foreground mt-1">
              🔊 Audio alerts enabled - You'll hear a beep when trash is detected
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Point camera toward area under tables</p>
          <p>• Audio alerts will play when trash is detected</p>
          <p>• Make sure your device volume is turned up</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrashDetector;
