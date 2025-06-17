
import { ImageAnalysisResult } from './imageAnalysis';

export interface DetectionThresholds {
  plasticBottle: number;
  transparentBottle: number;
  bottleShape: number;
  skinTone: number;
  fabric: number;
  clothing: number;
  actualTrash: number;
  trashTexture: number;
  crumpledPaper: number;
  paperTexture: number;
  emptySurface: number;
  objectContent: number;
}

export const DETECTION_THRESHOLDS: DetectionThresholds = {
  plasticBottle: 0.05,
  transparentBottle: 0.12,
  bottleShape: 0.08,
  skinTone: 0.04,
  fabric: 0.15,
  clothing: 0.20,
  actualTrash: 0.12,
  trashTexture: 0.05,
  crumpledPaper: 0.08,
  paperTexture: 0.04,
  emptySurface: 0.30,
  objectContent: 0.15
};

export const evaluateDetectionResults = (
  analysis: any,
  totalSamples: number
): ImageAnalysisResult => {
  return {
    hasPlasticBottle: analysis.plasticBottlePixels / totalSamples > DETECTION_THRESHOLDS.plasticBottle,
    hasTransparentBottle: analysis.transparentBottlePixels / totalSamples > DETECTION_THRESHOLDS.transparentBottle,
    hasBottleShape: analysis.bottleShapePixels / totalSamples > DETECTION_THRESHOLDS.bottleShape,
    hasSkinTone: analysis.skinPixels / totalSamples > DETECTION_THRESHOLDS.skinTone,
    hasFabric: analysis.fabricPixels / totalSamples > DETECTION_THRESHOLDS.fabric,
    hasClothing: analysis.clothingPixels / totalSamples > DETECTION_THRESHOLDS.clothing,
    hasActualTrash: analysis.actualTrashPixels / totalSamples > DETECTION_THRESHOLDS.actualTrash,
    hasTrashTexture: analysis.trashTexturePixels / totalSamples > DETECTION_THRESHOLDS.trashTexture,
    hasCrumpledPaper: analysis.crumpledTexture / totalSamples > DETECTION_THRESHOLDS.crumpledPaper,
    hasPaperTexture: analysis.paperTexturePixels / totalSamples > DETECTION_THRESHOLDS.paperTexture,
    hasEmptySurface: analysis.emptySurfacePixels / totalSamples > DETECTION_THRESHOLDS.emptySurface,
    hasObjectContent: analysis.objectContentPixels / totalSamples > DETECTION_THRESHOLDS.objectContent
  };
};
