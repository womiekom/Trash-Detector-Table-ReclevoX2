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
      
      if (!result) {
        return; // Skip if no change in detection
      }

      const { trashDetected, trashItemsDetected, normalItemsDetected, allDetections } = result;
      
      // Update all detections for debugging
      setAllDetections(allDetections || []);
      
      if (trashDetected && trashItemsDetected.length > 0) {
        setDetectionStatus(`🗑️ TRASH DETECTED: ${trashItemsDetected.join(', ')}`);
        playTrashAlert();
        console.log('🚨 PLAYING TRASH ALERT SOUND!');
      } else if (normalItemsDetected.length > 0) {
        setDetectionStatus(`✅ Safe items detected: ${normalItemsDetected.join(', ')}`);
        console.log('✅ Normal items found, no alert needed');
      } else if (allDetections && allDetections.length > 0) {
        setDetectionStatus(`🔍 Objects detected: ${allDetections.slice(0, 3).join(', ')}${allDetections.length > 3 ? '...' : ''}`);
        console.log('🔍 Objects detected but not classified');
      } else {
        setDetectionStatus('🔍 Scanning... Point camera at objects');
        console.log('👀 Actively scanning for objects...');
      }
    } catch (error) {
      console.error('Detection error:', error);
      setDetectionStatus('❌ Detection error - check console for details');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isDetecting && stream) {
      // Much faster detection with lightweight system
      intervalId = setInterval(detectTrash, 1000); // Check every 1 second
      
      // Run initial detection
      setTimeout(detectTrash, 500);
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
    setDetectionStatus(isDetecting ? 'Detection paused' : 'Detection starting... Point camera at objects');
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
          Trash Detector (Lightweight)
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
            <p className="text-sm font-medium text-blue-800">Debug - Detection Results:</p>
            <div className="text-xs text-blue-600 mt-1 max-h-20 overflow-y-auto">
              {allDetections.map((detection, index) => (
                <div key={index}>{detection}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrashDetector;
