
import { useState, useRef } from 'react';
import { isTrashItem, isNormalItem } from '../utils/detectionConfig';

export const useAIDetection = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const detectorRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      console.log('🤖 Starting to load AI model...');
      
      // Import the transformers library dynamically
      const { pipeline } = await import('@huggingface/transformers');
      console.log('📦 Transformers library loaded');
      
      // Try DETR model which is better for general object detection
      console.log('🔄 Loading DETR model...');
      const detector = await pipeline(
        'object-detection',
        'Xenova/detr-resnet-50',
        { device: 'webgpu' }
      );
      
      detectorRef.current = detector;
      setIsModelLoading(false);
      console.log('✅ DETR model loaded successfully!');
      return 'AI model loaded - Ready to detect objects';
    } catch (error) {
      console.error('❌ Error loading DETR model:', error);
      
      // Fallback to a different model
      try {
        console.log('🔄 Trying fallback model (YOLO)...');
        const { pipeline } = await import('@huggingface/transformers');
        const detector = await pipeline(
          'object-detection',
          'Xenova/yolos-tiny'
        );
        detectorRef.current = detector;
        setIsModelLoading(false);
        console.log('✅ Fallback YOLO model loaded successfully!');
        return 'Fallback AI model loaded - Ready to detect objects';
      } catch (fallbackError) {
        console.error('❌ Fallback model also failed:', fallbackError);
        setIsModelLoading(false);
        return 'Failed to load AI model - using basic detection';
      }
    }
  };

  const detectObjects = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    console.log('🔍 Starting detection...');
    
    if (!videoRef.current || !canvasRef.current) {
      console.log('❌ Video or canvas not ready');
      return null;
    }

    if (!detectorRef.current) {
      console.log('❌ AI model not loaded yet');
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.log('❌ Canvas context not available');
      return null;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    console.log(`📸 Captured frame: ${canvas.width}x${canvas.height}`);

    try {
      console.log('🤖 Running AI detection...');
      // Use lower threshold to catch more objects
      const results = await detectorRef.current(canvas, {
        threshold: 0.1 // Even lower threshold to catch more objects
      });
      
      console.log('🎯 Raw detection results:', results);
      console.log(`📊 Number of detections: ${results.length}`);
      
      let trashDetected = false;
      let normalItemsDetected: string[] = [];
      let trashItemsDetected: string[] = [];
      let allDetections: string[] = [];
      
      for (const result of results) {
        const label = result.label.toLowerCase();
        const score = result.score;
        
        console.log(`🔎 Detected: "${label}" with confidence: ${(score * 100).toFixed(1)}%`);
        allDetections.push(`${label} (${(score * 100).toFixed(1)}%)`);
        
        // Lower threshold for any detection (10% confidence)
        if (score > 0.1) {
          if (isTrashItem(label)) {
            trashDetected = true;
            trashItemsDetected.push(label);
            console.log(`🗑️ TRASH ITEM DETECTED: ${label}`);
          } else if (isNormalItem(label)) {
            normalItemsDetected.push(label);
            console.log(`✅ Normal item detected: ${label}`);
          } else {
            // For debugging, let's see what unclassified items are detected
            console.log(`❓ Unclassified item: ${label} - need to categorize`);
            // Let's be more permissive with paper detection
            if (label.includes('paper') || label.includes('tissue') || label.includes('napkin')) {
              trashDetected = true;
              trashItemsDetected.push(label);
              console.log(`🗑️ PAPER TRASH DETECTED: ${label}`);
            }
          }
        }
      }
      
      // If we have any detections at all, show them
      if (allDetections.length > 0) {
        console.log('📋 All detections this round:', allDetections.join(', '));
      } else {
        console.log('👀 No objects detected in this frame');
      }
      
      return {
        trashDetected,
        trashItemsDetected,
        normalItemsDetected,
        allDetections
      };
    } catch (error) {
      console.error('💥 Detection error:', error);
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
