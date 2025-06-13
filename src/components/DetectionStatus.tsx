
import React from 'react';

interface DetectionStatusProps {
  detectionStatus: string;
  audioEnabled: boolean;
}

const DetectionStatus: React.FC<DetectionStatusProps> = ({ detectionStatus, audioEnabled }) => {
  return (
    <div className="p-3 bg-muted rounded-lg">
      <p className="text-sm font-medium">Status: {detectionStatus}</p>
      {audioEnabled && (
        <p className="text-xs text-muted-foreground mt-1">
          🔊 Audio alerts enabled - Will beep only when actual trash is detected
        </p>
      )}
    </div>
  );
};

export default DetectionStatus;
