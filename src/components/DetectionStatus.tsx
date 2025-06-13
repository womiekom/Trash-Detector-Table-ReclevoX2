
import React from 'react';

interface DetectionStatusProps {
  detectionStatus: string;
  audioEnabled: boolean;
}

const DetectionStatus: React.FC<DetectionStatusProps> = ({ detectionStatus, audioEnabled }) => {
  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted rounded-lg">
        <p className="text-sm font-medium">Status: {detectionStatus}</p>
        {audioEnabled && (
          <p className="text-xs text-muted-foreground mt-1">
            🔊 Audio alerts enabled - Will beep only when actual trash is detected
          </p>
        )}
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Position camera to the right side of the wooden table</p>
        <p>• AI distinguishes between trash and normal items (hats, clothes, bags)</p>
        <p>• Only alerts for actual trash items, not personal belongings</p>
        <p>• Make sure your device volume is turned up for audio alerts</p>
      </div>
    </div>
  );
};

export default DetectionStatus;
