
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, Volume2, Flashlight } from 'lucide-react';

interface DetectionControlsProps {
  isDetecting: boolean;
  isModelLoading: boolean;
  audioEnabled: boolean;
  stream: MediaStream | null;
  flashEnabled?: boolean;
  flashSupported?: boolean;
  onToggleDetection: () => void;
  onToggleAudio: () => void;
  onStopCamera: () => void;
  onToggleFlash?: () => void;
}

const DetectionControls: React.FC<DetectionControlsProps> = ({
  isDetecting,
  isModelLoading,
  audioEnabled,
  stream,
  flashEnabled = false,
  flashSupported = false,
  onToggleDetection,
  onToggleAudio,
  onStopCamera,
  onToggleFlash
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={onToggleDetection}
        variant={isDetecting ? "destructive" : "default"}
        className="flex items-center gap-2"
        disabled={isModelLoading}
      >
        {isDetecting ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
        {isDetecting ? 'Stop Detection' : 'Start Detection'}
      </Button>

      <Button
        onClick={onToggleAudio}
        variant={audioEnabled ? "default" : "outline"}
        className="flex items-center gap-2"
      >
        <Volume2 className="h-4 w-4" />
        Audio: {audioEnabled ? 'ON' : 'OFF'}
      </Button>

      {stream && flashSupported && onToggleFlash && (
        <Button
          onClick={onToggleFlash}
          variant={flashEnabled ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Flashlight className="h-4 w-4" />
          Flash: {flashEnabled ? 'ON' : 'OFF'}
        </Button>
      )}

      {stream && (
        <Button onClick={onStopCamera} variant="outline">
          Stop Camera
        </Button>
      )}
    </div>
  );
};

export default DetectionControls;
