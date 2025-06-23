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
  hasFrontViewBottle: boolean;
  hasRedLabel: boolean;
  hasBottleCap: boolean;
  hasReflectiveSurface: boolean;
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
  frontViewBottlePixels: number;
  redLabelPixels: number;
  bottleCapPixels: number;
  reflectiveSurfacePixels: number;
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
  let frontViewBottlePixels = 0;
  let redLabelPixels = 0;
  let bottleCapPixels = 0;
  let reflectiveSurfacePixels = 0;
  
  // Enhanced analysis - sample every 40th pixel for better performance while maintaining accuracy
  for (let i = 0; i < data.length; i += 160) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Detect empty surfaces (tables, walls, etc.) - enhanced for different lighting
    if ((r > 160 && g > 160 && b > 160 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25) || // Light surfaces with varied lighting
        (r > 80 && r < 150 && g > 80 && g < 150 && b > 60 && b < 130 && Math.abs(r - g) < 20) || // Wood surfaces
        (r > 120 && r < 180 && g > 110 && g < 170 && b > 90 && b < 150)) { // Varied lighting conditions
      emptySurfacePixels++;
    }
    
    // Detect if there's actual object content (not just empty space) - improved for different lighting
    if ((r > 40 && g > 40 && b > 40 && 
        (Math.abs(r - g) > 8 || Math.abs(g - b) > 8 || Math.abs(r - b) > 8)) ||
        (r > 200 && g > 200 && b > 200)) { // Bright reflective surfaces
      objectContentPixels++;
    }
    
    // Enhanced RED LABEL detection for Coca-Cola bottles
    if ((r > 180 && r < 255 && g < 100 && b < 100 && (r - g) > 80 && (r - b) > 80) || // Strong red
        (r > 150 && r < 220 && g < 80 && b < 80 && (r - g) > 70) || // Medium red
        (r > 200 && g > 50 && g < 120 && b > 50 && b < 120 && (r - g) > 50)) { // Red with slight variations
      redLabelPixels++;
      console.log(`🔴 Red label detected at pixel: R=${r}, G=${g}, B=${b}`);
    }
    
    // Enhanced BOTTLE CAP detection (red caps, metal caps)
    if ((r > 160 && g < 80 && b < 80 && (r - g) > 80) || // Red caps
        (r > 120 && r < 180 && g > 120 && g < 180 && b > 120 && b < 180 && Math.abs(r-g) < 20) || // Metal caps
        (r > 200 && g > 200 && b > 200 && Math.abs(r-g) < 15)) { // Bright reflective caps
      bottleCapPixels++;
    }
    
    // Enhanced FRONT VIEW bottle detection
    if ((r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 15) || // Clear plastic front view
        (r > 150 && g > 150 && b > 200 && (b - r) > 20) || // Blue-tinted plastic
        (r > 140 && g > 170 && b > 140 && (g - r) > 15)) { // Green-tinted plastic
      frontViewBottlePixels++;
    }
    
    // Enhanced REFLECTIVE SURFACE detection (for light sources on bottles)
    if ((r > 220 && g > 220 && b > 220) || // Very bright reflections
        (r > 200 && g > 200 && b > 240) || // Blue-white reflections
        (r > 240 && g > 200 && b > 200)) { // Warm light reflections
      reflectiveSurfacePixels++;
    }
    
    // Enhanced plastic bottle detection (more restrictive now but includes front view)
    // Detect clear/transparent plastic bottles - require more specific conditions
    if ((r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 15) || // Very bright/reflective areas
        (r > 180 && g > 180 && b > 220 && (b - r) > 15) || // Blue tint (common in plastic)
        (r > 180 && g > 210 && b > 180 && (g - r) > 15)) { // Green tint
      transparentBottlePixels++;
    }
    
    // Detect colored plastic bottles (more restrictive)
    if ((r > 160 && g < 90 && b < 90 && (r - g) > 80) || // Strong red plastic
        (r < 90 && g < 90 && b > 160 && (b - r) > 80) || // Strong blue plastic
        (r > 160 && g > 160 && b < 90 && (r - b) > 80) || // Strong yellow plastic
        (r < 90 && g > 160 && b < 90 && (g - r) > 80)) {   // Strong green plastic
      plasticBottlePixels++;
    }
    
    // Detect bottle-like shapes and textures (enhanced for front view)
    if (r > 100 && g > 100 && b > 100 && 
        Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && Math.abs(r - b) < 30) {
      // Check for cylindrical patterns with stronger requirements (front and side view)
      if (i > 640 && i < data.length - 640) {
        const prev1R = data[i - 160];
        const prev2R = data[i - 320];
        const next1R = data[i + 160];
        const next2R = data[i + 320];
        
        // Vertical consistency (front view bottles)
        if (Math.abs(r - prev1R) < 15 && Math.abs(r - next1R) < 15) {
          bottleShapePixels++;
        }
        
        // Horizontal consistency (side view bottles)
        if (Math.abs(prev1R - prev2R) < 20 && Math.abs(next1R - next2R) < 20) {
          bottleShapePixels++;
        }
      }
    }
    
    // Keep existing skin tone detection
    if (r > 150 && r < 255 && g > 110 && g < 220 && b > 90 && b < 180 &&
        r > g && g > b && (r - b) > 25 && (r - g) > 10) {
      skinPixels++;
    }
    
    // Keep existing fabric/clothing detection
    if (r > 50 && r < 140 && g > 50 && g < 140 && b > 50 && b < 140 &&
        Math.abs(r - g) < 25 && Math.abs(g - b) < 25 && Math.abs(r - b) < 25) {
      fabricPixels++;
    }
    
    if ((r > 120 && r < 160 && g > 120 && g < 160 && b > 120 && b < 160) ||
        (r > 240 && g > 240 && b > 240)) {
      clothingPixels++;
    }
    
    // Keep existing trash detection
    if ((r > 80 && r < 120 && g > 60 && g < 100 && b > 40 && b < 80 && (r - b) > 20) || 
        (r > 60 && r < 100 && g > 60 && g < 100 && b > 60 && b < 100 && Math.abs(r - g) < 15)) {
      actualTrashPixels++;
      
      if (i > 320 && i < data.length - 320) {
        const prevR = data[i - 160];
        const nextR = data[i + 160];
        if (Math.abs(r - prevR) > 20 || Math.abs(r - nextR) > 20) {
          trashTexturePixels++;
        }
      }
    }
    
    // Keep existing crumpled paper detection
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
  
  console.log(`🔍 Enhanced Detection Results:
    - Red Label: ${redLabelPixels}/${totalSamples} (${(redLabelPixels/totalSamples*100).toFixed(1)}%)
    - Front View Bottle: ${frontViewBottlePixels}/${totalSamples} (${(frontViewBottlePixels/totalSamples*100).toFixed(1)}%)
    - Bottle Cap: ${bottleCapPixels}/${totalSamples} (${(bottleCapPixels/totalSamples*100).toFixed(1)}%)
    - Reflective Surface: ${reflectiveSurfacePixels}/${totalSamples} (${(reflectiveSurfacePixels/totalSamples*100).toFixed(1)}%)`);
  
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
    frontViewBottlePixels,
    redLabelPixels,
    bottleCapPixels,
    reflectiveSurfacePixels,
    totalSamples
  };
};

export const evaluateDetectionResults = (
  analysis: RawAnalysisResult,
  totalSamples: number
): ImageAnalysisResult => {
  // Enhanced thresholds with front view detection
  return {
    hasPlasticBottle: analysis.plasticBottlePixels / totalSamples > 0.05,
    hasTransparentBottle: analysis.transparentBottlePixels / totalSamples > 0.08, // Slightly reduced for front view
    hasBottleShape: analysis.bottleShapePixels / totalSamples > 0.06, // Slightly reduced for front view
    hasFrontViewBottle: analysis.frontViewBottlePixels / totalSamples > 0.08, // New front view detection
    hasRedLabel: analysis.redLabelPixels / totalSamples > 0.03, // New red label detection
    hasBottleCap: analysis.bottleCapPixels / totalSamples > 0.02, // New bottle cap detection
    hasReflectiveSurface: analysis.reflectiveSurfacePixels / totalSamples > 0.05, // New reflective surface detection
    hasSkinTone: analysis.skinPixels / totalSamples > 0.04,
    hasFabric: analysis.fabricPixels / totalSamples > 0.15,
    hasClothing: analysis.clothingPixels / totalSamples > 0.20,
    hasActualTrash: analysis.actualTrashPixels / totalSamples > 0.12,
    hasTrashTexture: analysis.trashTexturePixels / totalSamples > 0.05,
    hasCrumpledPaper: analysis.crumpledTexture / totalSamples > 0.08,
    hasPaperTexture: analysis.paperTexturePixels / totalSamples > 0.04,
    hasEmptySurface: analysis.emptySurfacePixels / totalSamples > 0.25, // Slightly reduced for varied lighting
    hasObjectContent: analysis.objectContentPixels / totalSamples > 0.12 // Slightly reduced for varied lighting
  };
};
