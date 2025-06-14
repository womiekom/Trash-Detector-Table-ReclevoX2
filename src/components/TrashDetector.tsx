

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useAIDetection } from '../hooks/useAIDetection';
import { createAudioAlert } from '../utils/audioUtils';
import CameraView from './CameraView';
import DetectionControls from './DetectionControls';
import DetectionStatus from './DetectionStatus';

const TrashDetector: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('Not detecting');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [allDetections, setAllDetections] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { videoRef, stream, startCamera, stopCamera } = useCamera();
  const { isModelLoading, canvasRef, loadModel, detectObjects } = useAIDetection();

  const playTrashAlert = () => {
    createAudioAlert(audioEnabled, audioContextRef);
  };

  const detectTrash = async () => {
    try {
      const result = await detectObjects(videoRef);
      
      if (!result) return;

      const { trashDetected, trashItemsDetected, normalItemsDetected, allDetections } = result;
      
      // Update all detections for debugging
      setAllDetections(allDetections || []);
      
      if (trashDetected) {
        setDetectionStatus(`🗑️ Trash detected: ${trashItemsDetected.join(', ')}`);
        playTrashAlert();
      } else if (normalItemsDetected.length > 0) {
        setDetectionStatus(`✅ Normal items detected: ${normalItemsDetected.join(', ')}`);
      } else if (allDetections && allDetections.length > 0) {
        setDetectionStatus(`🔍 Objects detected: ${allDetections.join(', ')}`);
      } else {
        setDetectionStatus('❌ No objects detected - try adjusting camera angle or lighting');
      }
    } catch (error) {
      console.error('Detection error:', error);
      setDetectionStatus('Detection error occurred');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isDetecting && stream) {
      intervalId = setInterval(detectTrash, 3000); // Check every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isDetecting, stream]);

  const toggleDetection = async () => {
    if (!stream) {
      const cameraStatus = await startCamera();
      setDetectionStatus(cameraStatus);
    }
    
    if (!isModelLoading) {
      const modelStatus = await loadModel();
      setDetectionStatus(modelStatus);
    }
    
    setIsDetecting(!isDetecting);
    setDetectionStatus(isDetecting ? 'Detection paused' : 'Detection active - monitoring for trash vs normal items');
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleStopCamera = () => {
    const status = stopCamera();
    setIsDetecting(false);
    setDetectionStatus(status);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-6 w-6" />
          Trash Detector Table
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <CameraView videoRef={videoRef} canvasRef={canvasRef} />
        
        <DetectionControls
          isDetecting={isDetecting}
          isModelLoading={isModelLoading}
          audioEnabled={audioEnabled}
          stream={stream}
          onToggleDetection={toggleDetection}
          onToggleAudio={toggleAudio}
          onStopCamera={handleStopCamera}
        />

        <DetectionStatus
          detectionStatus={detectionStatus}
          audioEnabled={audioEnabled}
        />

        {allDetections.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-800">Debug - All AI Detections:</p>
            <p className="text-xs text-blue-600 mt-1">{allDetections.join(', ')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrashDetector;
