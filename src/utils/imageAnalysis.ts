export interface ImageAnalysisResult {
  hasPlasticBottle: boolean;
  hasTransparentBottle: boolean;
  hasBottleShape: boolean;
  hasSkinTone: boolean;
  hasFabric: boolean;
  hasClothing: boolean;
  hasActualTrash: boolean;
  hasTrashTexture: boolean;
  hasCrumpledPaper: boolean;
  hasPaperTexture: boolean;
  hasEmptySurface: boolean;
  hasObjectContent: boolean;
}

interface RawAnalysisResult {
  plasticBottlePixels: number;
  transparentBottlePixels: number;
  bottleShapePixels: number;
  crumpledTexture: number;
  skinPixels: number;
  fabricPixels: number;
  clothingPixels: number;
  actualTrashPixels: number;
  trashTexturePixels: number;
  paperTexturePixels: number;
  emptySurfacePixels: number;
  objectContentPixels: number;
  totalSamples: number;
}

export const analyzeImageEnhanced = (imageData: ImageData): RawAnalysisResult => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  let plasticBottlePixels = 0;
  let transparentBottlePixels = 0;
  let bottleShapePixels = 0;
  let crumpledTexture = 0;
  let skinPixels = 0;
  let fabricPixels = 0;
  let clothingPixels = 0;
  let actualTrashPixels = 0;
  let trashTexturePixels = 0;
  let paperTexturePixels = 0;
  let emptySurfacePixels = 0;
  let objectContentPixels = 0;
  
  // Enhanced analysis - sample every 40th pixel for better performance while maintaining accuracy
  for (let i = 0; i < data.length; i += 160) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect empty surfaces (tables, walls, etc.)
    if ((r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) || // Light surfaces
        (r > 100 && r < 150 && g > 100 && g < 150 && b > 80 && b < 130 && Math.abs(r - g) < 15)) { // Wood surfaces
      emptySurfacePixels++;
    }
    
    // Detect if there's actual object content (not just empty space)
    if (r > 50 && g > 50 && b > 50 && 
        (Math.abs(r - g) > 10 || Math.abs(g - b) > 10 || Math.abs(r - b) > 10)) {
      objectContentPixels++;
    }
    
    // Enhanced plastic bottle detection (more restrictive now)
    // Detect clear/transparent plastic bottles - require more specific conditions
    if ((r > 220 && g > 220 && b > 220 && Math.abs(r - g) < 10) || // Very bright/reflective areas
        (r > 200 && g > 200 && b > 220 && (b - r) > 10) || // Blue tint (common in plastic)
        (r > 200 && g > 220 && b > 200 && (g - r) > 10)) { // Green tint
      transparentBottlePixels++;
    }
    
    // Detect colored plastic bottles (more restrictive)
    if ((r > 180 && g < 80 && b < 80 && (r - g) > 100) || // Strong red plastic
        (r < 80 && g < 80 && b > 180 && (b - r) > 100) || // Strong blue plastic
        (r > 180 && g > 180 && b < 80 && (r - b) > 100) || // Strong yellow plastic
        (r < 80 && g > 180 && b < 80 && (g - r) > 100)) {   // Strong green plastic
      plasticBottlePixels++;
    }
    
    // Detect bottle-like shapes and textures (more restrictive)
    if (r > 120 && g > 120 && b > 120 && 
        Math.abs(r - g) < 20 && Math.abs(g - b) < 20 && Math.abs(r - b) < 20) {
      // Check for cylindrical patterns with stronger requirements
      if (i > 640 && i < data.length - 640) {
        const prev1R = data[i - 160];
        const prev2R = data[i - 320];
        const next1R = data[i + 160];
        const next2R = data[i + 320];
        if (Math.abs(r - prev1R) < 10 && Math.abs(r - next1R) < 10 &&
            Math.abs(prev1R - prev2R) < 15 && Math.abs(next1R - next2R) < 15) {
          bottleShapePixels++;
        }
      }
    }
    
    // Detect skin tones (keep restrictive)
    if (r > 150 && r < 255 && g > 110 && g < 220 && b > 90 && b < 180 &&
        r > g && g > b && (r - b) > 25 && (r - g) > 10) {
      skinPixels++;
    }
    
    // Detect fabric/clothing textures (more restrictive)
    if (r > 50 && r < 140 && g > 50 && g < 140 && b > 50 && b < 140 &&
        Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25) {
      fabricPixels++;
    }
    
    // Detect clothing patterns (more restrictive)
    if ((r > 120 && r < 160 && g > 120 && g < 160 && b > 120 && b < 160) ||
        (r > 240 && g > 240 && b > 240)) {
      clothingPixels++;
    }
    
    // Detect actual trash colors (more restrictive)
    if ((r > 80 && r < 120 && g > 60 && g < 100 && b > 40 && b < 80 && (r - b) > 20) || // Brown trash
        (r > 60 && r < 100 && g > 60 && g < 100 && b > 60 && b < 100 && Math.abs(r - g) < 15)) { // Gray trash
      actualTrashPixels++;
      
      // Check for trash texture patterns
      if (i > 320 && i < data.length - 320) {
        const prevR = data[i - 160];
        const nextR = data[i + 160];
        if (Math.abs(r - prevR) > 20 || Math.abs(r - nextR) > 20) {
          trashTexturePixels++;
        }
      }
    }
    
    // Detect crumpled paper texture (more restrictive)
    if (r > 180 && g > 180 && b > 180 && 
        Math.abs(r - g) < 15 && Math.abs(g - b) < 15 && Math.abs(r - b) < 15) {
      if (i > 640 && i < data.length - 640) {
        const prev1R = data[i - 160];
        const prev2R = data[i - 320];
        const next1R = data[i + 160];
        const next2R = data[i + 320];
        if ((Math.abs(r - prev1R) > 25 || Math.abs(r - next1R) > 25) &&
            (Math.abs(prev1R - prev2R) > 20 || Math.abs(next1R - next2R) > 20)) {
          crumpledTexture++;
          paperTexturePixels++;
        }
      }
    }
  }
  
  const totalSamples = data.length / 160;
  
  return {
    plasticBottlePixels,
    transparentBottlePixels,
    bottleShapePixels,
    crumpledTexture,
    skinPixels,
    fabricPixels,
    clothingPixels,
    actualTrashPixels,
    trashTexturePixels,
    paperTexturePixels,
    emptySurfacePixels,
    objectContentPixels,
    totalSamples
  };
};

export const evaluateDetectionResults = (
  analysis: RawAnalysisResult,
  totalSamples: number
): ImageAnalysisResult => {
  // Much more restrictive thresholds to prevent false positives
  return {
    hasPlasticBottle: analysis.plasticBottlePixels / totalSamples > 0.05, // Increased threshold
    hasTransparentBottle: analysis.transparentBottlePixels / totalSamples > 0.12, // Increased threshold
    hasBottleShape: analysis.bottleShapePixels / totalSamples > 0.08, // Increased threshold
    hasSkinTone: analysis.skinPixels / totalSamples > 0.04, // Slightly higher threshold
    hasFabric: analysis.fabricPixels / totalSamples > 0.15, // Keep threshold
    hasClothing: analysis.clothingPixels / totalSamples > 0.20, // Keep threshold
    hasActualTrash: analysis.actualTrashPixels / totalSamples > 0.12, // Increased threshold
    hasTrashTexture: analysis.trashTexturePixels / totalSamples > 0.05, // New requirement
    hasCrumpledPaper: analysis.crumpledTexture / totalSamples > 0.08, // Increased threshold
    hasPaperTexture: analysis.paperTexturePixels / totalSamples > 0.04, // New requirement
    hasEmptySurface: analysis.emptySurfacePixels / totalSamples > 0.30, // Detect empty surfaces
    hasObjectContent: analysis.objectContentPixels / totalSamples > 0.15 // Ensure there's actual content
  };
};
