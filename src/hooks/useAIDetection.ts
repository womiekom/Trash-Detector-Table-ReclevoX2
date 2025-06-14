
import { useState, useRef } from 'react';
import { isTrashItem, isNormalItem } from '../utils/detectionConfig';

export const useAIDetection = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastDetectionRef = useRef<string>('');

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      console.log('🚀 Loading lightweight detection system...');
      
      // Simulate a quick setup
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsModelLoading(false);
      console.log('✅ Lightweight detection system ready!');
      return 'Lightweight detection system loaded - Ready to detect objects';
    } catch (error) {
      console.error('❌ Error setting up detection:', error);
      setIsModelLoading(false);
      return 'Detection system ready (basic mode)';
    }
  };

  const detectObjects = async (videoRef: React.RefObject<HTMLVideoElement>) => {
    console.log('🔍 Running lightweight detection...');
    
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
      // Improved image analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const analysis = analyzeImage(imageData);
      
      console.log('🎯 Image analysis results:', analysis);
      
      let trashDetected = false;
      let normalItemsDetected: string[] = [];
      let trashItemsDetected: string[] = [];
      let allDetections: string[] = [];
      
      // First, check for normal items (this takes priority)
      if (analysis.hasSkinTone) {
        normalItemsDetected.push('person/hand');
        allDetections.push('person/hand detected');
        console.log('👤 PERSON/HAND detected via skin tone');
      }
      
      if (analysis.hasFabric || analysis.hasClothing) {
        normalItemsDetected.push('clothing/hat');
        allDetections.push('clothing detected');
        console.log('👕 CLOTHING/HAT detected via texture analysis');
      }
      
      // Only check for trash if we don't have strong normal item indicators
      const hasStrongNormalIndicators = analysis.hasSkinTone || analysis.hasFabric || analysis.hasClothing;
      
      if (!hasStrongNormalIndicators) {
        // More restrictive trash detection
        if (analysis.hasActualTrash) {
          trashDetected = true;
          trashItemsDetected.push('trash item');
          allDetections.push('actual trash detected');
          console.log('🗑️ ACTUAL TRASH DETECTED');
        }
        
        if (analysis.hasPlasticBottle) {
          trashDetected = true;
          trashItemsDetected.push('plastic bottle');
          allDetections.push('plastic bottle detected');
          console.log('🗑️ PLASTIC BOTTLE DETECTED');
        }
        
        if (analysis.hasCrumpledPaper) {
          trashDetected = true;
          trashItemsDetected.push('crumpled paper');
          allDetections.push('crumpled paper detected');
          console.log('🗑️ CRUMPLED PAPER DETECTED');
        }
      } else {
        console.log('✅ Normal items detected, skipping trash detection to avoid false positives');
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

// More accurate image analysis function
const analyzeImage = (imageData: ImageData) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  let brightPlasticPixels = 0;
  let crumpledTexture = 0;
  let skinPixels = 0;
  let fabricPixels = 0;
  let clothingPixels = 0;
  let actualTrashPixels = 0;
  let plasticBottlePixels = 0;
  
  // More sophisticated analysis - sample every 20th pixel for better performance
  for (let i = 0; i < data.length; i += 80) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect skin tones (human presence - strong normal indicator)
    if (r > 120 && r < 255 && g > 80 && g < 220 && b > 60 && b < 180 &&
        r > g && g > b && (r - b) > 15) {
      skinPixels++;
    }
    
    // Detect fabric/clothing textures (strong normal indicator)
    if (r > 30 && r < 180 && g > 30 && g < 180 && b > 30 && b < 180 &&
        Math.abs(r - g) < 40 && Math.abs(g - b) < 40 && Math.abs(r - b) < 40) {
      fabricPixels++;
    }
    
    // Detect clothing patterns (hats, shirts, etc.)
    if ((r > 80 && r < 200 && g > 80 && g < 200 && b > 80 && b < 200) ||
        (r > 200 && g > 200 && b > 200)) { // White clothing like caps
      clothingPixels++;
    }
    
    // Only detect trash with very specific characteristics
    // Bright colored plastic (very saturated colors)
    if ((r > 180 && g < 80 && b < 80) || // Bright red plastic
        (r < 80 && g < 80 && b > 180) || // Bright blue plastic
        (r > 180 && g > 180 && b < 80)) { // Bright yellow plastic
      brightPlasticPixels++;
    }
    
    // Detect crumpled paper texture (more varied colors, rougher texture)
    if (r > 180 && g > 180 && b > 180 && 
        Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20) {
      // Check surrounding pixels for texture variation
      if (i > 160 && i < data.length - 160) {
        const prevR = data[i - 80];
        const nextR = data[i + 80];
        if (Math.abs(r - prevR) > 10 || Math.abs(r - nextR) > 10) {
          crumpledTexture++;
        }
      }
    }
    
    // Detect transparent/reflective plastic bottles
    if ((r > 230 && g > 230 && b > 230) || // Very bright reflections
        (r < 40 && g < 40 && b < 40)) { // Dark transparent areas
      plasticBottlePixels++;
    }
    
    // Detect actual trash colors (browns, grays, dirty colors)
    if ((r > 60 && r < 120 && g > 40 && g < 100 && b > 20 && b < 80) || // Brown trash
        (r > 40 && r < 100 && g > 40 && g < 100 && b > 40 && b < 100)) { // Gray trash
      actualTrashPixels++;
    }
  }
  
  const totalSamples = data.length / 80;
  
  return {
    hasSkinTone: skinPixels / totalSamples > 0.02, // 2% threshold for skin
    hasFabric: fabricPixels / totalSamples > 0.15, // 15% threshold for fabric
    hasClothing: clothingPixels / totalSamples > 0.20, // 20% threshold for clothing
    hasActualTrash: actualTrashPixels / totalSamples > 0.08, // 8% threshold for actual trash
    hasPlasticBottle: plasticBottlePixels / totalSamples > 0.25, // 25% threshold for bottles
    hasCrumpledPaper: crumpledTexture / totalSamples > 0.05, // 5% threshold for crumpled paper
    hasBrightPlastic: brightPlasticPixels / totalSamples > 0.03 // 3% threshold for bright plastic
  };
};
