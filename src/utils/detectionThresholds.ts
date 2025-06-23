
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
  frontViewBottle: number;
  redLabel: number;
  bottleCap: number;
  reflectiveSurface: number;
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
  objectContent: 0.15,
  frontViewBottle: 0.08,
  redLabel: 0.03,
  bottleCap: 0.02,
  reflectiveSurface: 0.05
};

export const evaluateDetectionResults = (
  analysis: any,
  totalSamples: number
): ImageAnalysisResult => {
  return {
    hasPlasticBottle: analysis.plasticBottlePixels / totalSamples > DETECTION_THRESHOLDS.plasticBottle,
    hasTransparentBottle: analysis.transparentBottlePixels / totalSamples > DETECTION_THRESHOLDS.transparentBottle,
    hasBottleShape: analysis.bottleShapePixels / totalSamples > DETECTION_THRESHOLDS.bottleShape,
    hasFrontViewBottle: analysis.frontViewBottlePixels / totalSamples > DETECTION_THRESHOLDS.frontViewBottle,
    hasRedLabel: analysis.redLabelPixels / totalSamples > DETECTION_THRESHOLDS.redLabel,
    hasBottleCap: analysis.bottleCapPixels / totalSamples > DETECTION_THRESHOLDS.bottleCap,
    hasReflectiveSurface: analysis.reflectiveSurfacePixels / totalSamples > DETECTION_THRESHOLDS.reflectiveSurface,
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
