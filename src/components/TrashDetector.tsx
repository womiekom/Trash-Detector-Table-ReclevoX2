
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Zap } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useAIDetection } from '../hooks/useAIDetection';
import { createAudioAlert } from '../utils/audioUtils';
import { requestNotificationPermission, showTrashNotification } from '../utils/notificationUtils';
import CameraView from './CameraView';
import DetectionControls from './DetectionControls';
import DetectionStatus from './DetectionStatus';

const TrashDetector: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<string>('Not detecting');
  const [allDetections, setAllDetections] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const { videoRef, stream, flashEnabled, flashSupported, startCamera, stopCamera, toggleFlash } = useCamera();
  const { isModelLoading, canvasRef, loadModel, detectObjects } = useAIDetection();

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const playTrashAlert = () => {
    createAudioAlert(true, audioContextRef);
  };

  const triggerTrashAlert = (trashItems: string[]) => {
    // Play audio alert
    playTrashAlert();
    
    // Show browser notification
    showTrashNotification();

    console.log('🚨 TRASH ALERT TRIGGERED!', trashItems);
  };

  const handleToggleFlash = async () => {
    const result = await toggleFlash();
    if (result) {
      setDetectionStatus(result);
    }
  };

  const detectTrash = async () => {
    try {
      const result = await detectObjects(videoRef);
      
      if (!result) {
        return;
      }

      const { trashDetected, trashItemsDetected, normalItemsDetected, allDetections } = result;
      
      setAllDetections(allDetections || []);
      
      if (trashDetected && trashItemsDetected.length > 0) {
        setDetectionStatus(`🗑️ TRASH DETECTED: ${trashItemsDetected.join(', ')}`);
        triggerTrashAlert(trashItemsDetected);
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
      intervalId = setInterval(detectTrash, 1000);
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

  const handleStopCamera = () => {
    const status = stopCamera();
    setIsDetecting(false);
    setDetectionStatus(status);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/90 border-cyan-500/30 shadow-2xl shadow-cyan-500/20 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-black to-gray-900 border-b border-cyan-500/20">
        <CardTitle className="flex items-center gap-3 text-cyan-400">
          <div className="relative">
            <Camera className="h-6 w-6 text-cyan-400" />
            <Zap className="h-3 w-3 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-bold">
            Trash Detector Table (TDT) X2 Kelompok 1
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 bg-gradient-to-b from-gray-900/50 to-black/90 p-6">
        <CameraView videoRef={videoRef} canvasRef={canvasRef} />
        
        <DetectionControls
          isDetecting={isDetecting}
          isModelLoading={isModelLoading}
          stream={stream}
          flashEnabled={flashEnabled}
          flashSupported={flashSupported}
          onToggleDetection={toggleDetection}
          onStopCamera={handleStopCamera}
          onToggleFlash={handleToggleFlash}
        />

        <DetectionStatus
          detectionStatus={detectionStatus}
          audioEnabled={true}
        />

        {allDetections.length > 0 && (
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/20 rounded-lg backdrop-blur-sm">
            <p className="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Debug - Detection Results:
            </p>
            <div className="text-xs text-cyan-400/80 mt-2 max-h-20 overflow-y-auto font-mono">
              {allDetections.map((detection, index) => (
                <div key={index} className="hover:text-cyan-300 transition-colors">
                  {detection}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrashDetector;
