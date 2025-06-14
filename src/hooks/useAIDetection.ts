
import { useState, useRef } from 'react';
import { isTrashItem, isNormalItem } from '../utils/detectionConfig';

export const useAIDetection = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const detectorRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      
      // Import the transformers library dynamically
      const { pipeline } = await import('@huggingface/transformers');
      
      // Try DETR model which is better for general object detection
      detectorRef.current = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50',
        { device: 'webgpu' }
      );
      
      setIsModelLoading(false);
      return 'AI model loaded - Ready to detect objects';
    } catch (error) {
      console.error('Error loading model:', error);
      
      // Fallback to a different model
      try {
        detectorRef.current = await pipeline(
          'object-detection',
          'Xenova/yolos-tiny'
        );
        setIsModelLoading(false);
        return 'Fallback AI model loaded - Ready to detect objects';
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
        setIsModelLoading(false);
        return 'Failed to load AI model - using basic detection';
      }
    }
  };

  const detectObjects = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      if (detectorRef.current) {
        // Use lower threshold to catch more objects
        const results = await detectorRef.current(canvas, {
          threshold: 0.15 // Lower threshold to detect more objects
        });
        
        console.log('Raw detection results:', results);
        console.log('Number of detections:', results.length);
        
        let trashDetected = false;
        let normalItemsDetected: string[] = [];
        let trashItemsDetected: string[] = [];
        let allDetections: string[] = [];
        
        for (const result of results) {
          const label = result.label.toLowerCase();
          const score = result.score;
          
          console.log(`Detected: "${label}" with confidence: ${(score * 100).toFixed(1)}%`);
          allDetections.push(`${label} (${(score * 100).toFixed(1)}%)`);
          
          // Lower threshold for any detection (15% confidence)
          if (score > 0.15) {
            if (isNormalItem(label)) {
              normalItemsDetected.push(label);
              console.log(`✅ Normal item detected: ${label}`);
            } else if (isTrashItem(label)) {
              trashDetected = true;
              trashItemsDetected.push(label);
              console.log(`🗑️ TRASH DETECTED: ${label}`);
            } else {
              // For debugging, let's see what unclassified items are detected
              console.log(`❓ Unclassified item: ${label} - need to categorize`);
              allDetections.push(`UNCLASSIFIED: ${label}`);
            }
          }
        }
        
        // If we have any detections at all, show them
        if (allDetections.length > 0) {
          console.log('All detections this round:', allDetections.join(', '));
        } else {
          console.log('No objects detected in this frame');
        }
        
        return {
          trashDetected,
          trashItemsDetected,
          normalItemsDetected,
          allDetections
        };
      } else {
        // Fallback detection for testing when model fails
        console.log('No AI model available, using fallback detection');
        
        return {
          trashDetected: false,
          trashItemsDetected: [],
          normalItemsDetected: ['fallback detection'],
          allDetections: ['No AI model loaded']
        };
      }
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    }
  };

  return {
    isModelLoading,
    canvasRef,
    loadModel,
    detectObjects
  };
};
