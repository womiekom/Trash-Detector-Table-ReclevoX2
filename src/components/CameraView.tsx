
import React from 'react';

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const CameraView: React.FC<CameraViewProps> = ({ videoRef, canvasRef }) => {
  return (
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
  );
};

export default CameraView;
