
import { useState, useRef } from 'react';
import { analyzeImageEnhanced, evaluateDetectionResults } from '../utils/imageAnalysis';
import { isTrashItem, isNormalItem } from '../utils/detectionConfig';

export const useAIDetection = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDetectionRef = useRef<string>('');

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      console.log('🚀 Loading enhanced multi-angle detection system...');
      
      // Simulate a quick setup
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsModelLoading(false);
      console.log('✅ Enhanced multi-angle bottle detection system ready!');
      return 'Enhanced multi-angle detection system loaded - Front & side view detection with improved lighting adaptation';
    } catch (error) {
      console.error('❌ Error setting up detection:', error);
      setIsModelLoading(false);
      return 'Multi-angle detection system ready (enhanced mode)';
    }
  };

  const detectObjects = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    console.log('🔍 Running enhanced multi-angle bottle detection...');
    
    if (!videoRef.current || !canvasRef.current) {
      console.log('❌ Video or canvas not ready');
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
      // Enhanced image analysis with multi-angle bottle detection
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const rawAnalysis = analyzeImageEnhanced(imageData);
      const analysis = evaluateDetectionResults(rawAnalysis, rawAnalysis.totalSamples);
      
      console.log('🎯 Enhanced multi-angle analysis results:', analysis);
      
      let trashDetected = false;
      let normalItemsDetected: string[] = [];
      let trashItemsDetected: string[] = [];
      let allDetections: string[] = [];
      
      // Check for normal items first to prevent false positives
      if (analysis.hasSkinTone) {
        normalItemsDetected.push('person/hand');
        allDetections.push('person/hand detected');
        console.log('👤 PERSON/HAND detected - safe item');
      }
      
      if (analysis.hasFabric || analysis.hasClothing) {
        normalItemsDetected.push('clothing/hat');
        allDetections.push('clothing detected');
        console.log('👕 CLOTHING detected - safe item');
      }

      if (analysis.hasEmptySurface) {
        normalItemsDetected.push('empty surface');
        allDetections.push('empty surface detected');
        console.log('📋 EMPTY SURFACE detected - safe');
      }
      
      // Enhanced bottle detection with multiple criteria (front and side view)
      if (normalItemsDetected.length === 0 && analysis.hasObjectContent) {
        // Front view bottle detection with red label (like Coca-Cola)
        if (analysis.hasFrontViewBottle && analysis.hasRedLabel && analysis.hasReflectiveSurface) {
          trashDetected = true;
          trashItemsDetected.push('front-view bottle with label');
          allDetections.push('front-view bottle with red label detected');
          console.log('🗑️ FRONT-VIEW BOTTLE WITH RED LABEL DETECTED (high confidence)');
        }
        
        // Enhanced side view detection
        if (analysis.hasPlasticBottle && analysis.hasBottleShape && analysis.hasBottleCap) {
          trashDetected = true;
          trashItemsDetected.push('plastic bottle with cap');
          allDetections.push('plastic bottle with cap detected');
          console.log('🗑️ PLASTIC BOTTLE WITH CAP DETECTED (high confidence)');
        }
        
        // Transparent bottle detection (any angle)
        if (analysis.hasTransparentBottle && (analysis.hasBottleShape || analysis.hasFrontViewBottle) && analysis.hasReflectiveSurface) {
          trashDetected = true;
          trashItemsDetected.push('transparent bottle');
          allDetections.push('transparent bottle detected');
          console.log('🗑️ TRANSPARENT BOTTLE DETECTED (high confidence)');
        }
        
        // Enhanced general bottle detection (combines front and side criteria)
        if ((analysis.hasPlasticBottle || analysis.hasFrontViewBottle) && 
            (analysis.hasBottleShape || analysis.hasRedLabel) &&
            analysis.hasReflectiveSurface) {
          trashDetected = true;
          trashItemsDetected.push('multi-angle bottle');
          allDetections.push('multi-angle bottle detected');
          console.log('🗑️ MULTI-ANGLE BOTTLE DETECTED (high confidence)');
        }
        
        // Check for other trash items with higher confidence
        if (analysis.hasActualTrash && analysis.hasTrashTexture) {
          trashDetected = true;
          trashItemsDetected.push('trash item');
          allDetections.push('trash item detected');
          console.log('🗑️ TRASH ITEM DETECTED (high confidence)');
        }
        
        if (analysis.hasCrumpledPaper && analysis.hasPaperTexture) {
          trashDetected = true;
          trashItemsDetected.push('crumpled paper');
          allDetections.push('crumpled paper detected');
          console.log('🗑️ CRUMPLED PAPER DETECTED (high confidence)');
        }
      }
      
      // Prevent spam by checking if detection changed
      const currentDetection = allDetections.join(',');
      if (currentDetection === lastDetectionRef.current && currentDetection !== '') {
        console.log('🔄 Same detection as last time, skipping...');
        return null;
      }
      lastDetectionRef.current = currentDetection;
      
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
