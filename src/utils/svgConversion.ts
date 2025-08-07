/**
 * SVG conversion utilities using potrace for bitmap-to-vector conversion
 * Handles SVG optimization, path extraction, and integration with existing SVG processing
 */

// import { potrace, init } from 'esm-potrace-wasm';

export interface PotraceOptions {
  turdsize: number;
  turnpolicy: number;
  alphamax: number;
  opticurve: number;
  opttolerance: number;
  pathonly: boolean;
  extractcolors: boolean;
  posterizelevel: number;
  posterizationalgorithm: number;
}

export interface ConversionProgress {
  stage: 'initializing' | 'tracing' | 'optimizing' | 'complete' | 'error';
  progress: number;
  message: string;
}

export interface ConversionResult {
  svgContent: string;
  paths: number;
  colors: string[];
  originalSize: { width: number; height: number };
  optimizedSize: { width: number; height: number };
  compressionRatio?: number;
}

// Default potrace options optimized for logos and clean graphics
const DEFAULT_POTRACE_OPTIONS: PotraceOptions = {
  turdsize: 2,          // Suppress speckles of up to this many pixels
  turnpolicy: 4,        // How to resolve ambiguities in path decomposition (4 = majority)
  alphamax: 1,          // Corner threshold parameter
  opticurve: 1,         // Use curve optimization
  opttolerance: 0.2,    // Curve optimization tolerance
  pathonly: false,      // Output only paths (no SVG wrapper)
  extractcolors: true,  // Extract colors from image
  posterizelevel: 2,    // Posterization level [1, 255]
  posterizationalgorithm: 0, // 0: simple, 1: interpolation
};

// Global initialization flag to avoid multiple initializations
// let isInitialized = false;

/**
 * Initialize potrace-wasm module
 */
// export async function initializePotrace(): Promise<void> {
//   if (!isInitialized) {
//     try {
//       await init();
//       isInitialized = true;
//     } catch (error) {
//       console.error('Failed to initialize potrace:', error);
//       throw new Error('Failed to initialize potrace module');
//     }
//   }
// }

/**
 * Optimizes SVG content by removing unnecessary attributes and simplifying paths
 */
export function optimizeSVGContent(svgContent: string): string {
  // Remove XML declaration and DOCTYPE if present
  let optimized = svgContent
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/g, '')
    .trim();

  // Remove unnecessary attributes
  optimized = optimized
    .replace(/\s+id="[^"]*"/g, '') // Remove id attributes
    .replace(/\s+xmlns:xlink="[^"]*"/g, '') // Remove unused namespaces
    .replace(/\s+xml:space="preserve"/g, '') // Remove xml:space
    .replace(/\s+style=""/g, '') // Remove empty style attributes
    .replace(/\s+transform=""/g, '') // Remove empty transform attributes
    .replace(/\s+class=""/g, ''); // Remove empty class attributes

  // Simplify path data by removing excessive precision
  optimized = optimized.replace(/d="([^"]*)"/g, (match, pathData) => {
    // Round numbers to 2 decimal places to reduce file size
    const simplified = pathData.replace(/(\d+\.\d{3,})/g, (num: string) => {
      return parseFloat(num).toFixed(2);
    });
    return `d="${simplified}"`;
  });

  // Remove redundant spaces and normalize whitespace
  optimized = optimized
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();

  return optimized;
}

/**
 * Extracts viewBox and dimensions from SVG content
 */
export function extractSVGDimensions(svgContent: string): { width: number; height: number; viewBox?: string } {
  const svgMatch = svgContent.match(/<svg[^>]*>/);
  if (!svgMatch) {
    return { width: 100, height: 100 };
  }

  const svgTag = svgMatch[0];
  
  // Extract width and height
  const widthMatch = svgTag.match(/width="([^"]+)"/);
  const heightMatch = svgTag.match(/height="([^"]+)"/);
  const viewBoxMatch = svgTag.match(/viewBox="([^"]+)"/);

  let width = 100;
  let height = 100;

  if (widthMatch && heightMatch) {
    width = parseFloat(widthMatch[1]);
    height = parseFloat(heightMatch[1]);
  } else if (viewBoxMatch) {
    const viewBox = viewBoxMatch[1].split(/\s+/);
    width = parseFloat(viewBox[2]) - parseFloat(viewBox[0]);
    height = parseFloat(viewBox[3]) - parseFloat(viewBox[1]);
  }

  return {
    width,
    height,
    viewBox: viewBoxMatch?.[1]
  };
}

/**
 * Counts the number of paths in an SVG
 */
export function countSVGPaths(svgContent: string): number {
  const pathMatches = svgContent.match(/<path[^>]*>/g);
  return pathMatches ? pathMatches.length : 0;
}

/**
 * Extracts colors used in the SVG
 */
export function extractSVGColors(svgContent: string): string[] {
  const colors = new Set<string>();
  
  // Match fill colors
  const fillMatches = svgContent.matchAll(/fill="([^"]+)"/g);
  for (const match of fillMatches) {
    const color = match[1].toLowerCase();
    if (color !== 'none' && color !== 'transparent') {
      colors.add(color);
    }
  }
  
  // Match stroke colors
  const strokeMatches = svgContent.matchAll(/stroke="([^"]+)"/g);
  for (const match of strokeMatches) {
    const color = match[1].toLowerCase();
    if (color !== 'none' && color !== 'transparent') {
      colors.add(color);
    }
  }

  return Array.from(colors);
}

/**
 * Normalizes SVG to have consistent dimensions and viewBox
 */
export function normalizeSVG(svgContent: string, targetSize: number = 200): string {
  const { width: originalWidth, height: originalHeight, viewBox } = extractSVGDimensions(svgContent);
  
  // Calculate scale factor to fit target size
  const maxDimension = Math.max(originalWidth, originalHeight);
  const scaleFactor = targetSize / maxDimension;
  const newWidth = originalWidth * scaleFactor;
  const newHeight = originalHeight * scaleFactor;

  // Create new viewBox if none exists, or scale existing one
  let newViewBox: string;
  if (viewBox) {
    const viewBoxValues = viewBox.split(/\s+/).map(Number);
    newViewBox = `${viewBoxValues[0]} ${viewBoxValues[1]} ${newWidth} ${newHeight}`;
  } else {
    newViewBox = `0 0 ${newWidth} ${newHeight}`;
  }

  // Replace SVG tag with normalized dimensions
  const normalizedSvg = svgContent.replace(
    /<svg[^>]*>/,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${newWidth}" height="${newHeight}" viewBox="${newViewBox}">`
  );

  return normalizedSvg;
}

/**
 * Applies color replacements to SVG content
 */
export function applySVGColorReplacements(svgContent: string, colorMap: Map<string, string>): string {
  let result = svgContent;
  
  colorMap.forEach((newColor, oldColor) => {
    // Replace fill colors
    result = result.replace(
      new RegExp(`fill="${oldColor}"`, 'gi'),
      `fill="${newColor}"`
    );
    
    // Replace stroke colors
    result = result.replace(
      new RegExp(`stroke="${oldColor}"`, 'gi'),
      `stroke="${newColor}"`
    );
  });

  return result;
}

const loadPotraceScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.Potrace) {
      resolve();
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src="/potrace.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = '/potrace.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load potrace.js'));
    document.head.appendChild(script);
  });
};

const PotraceToSvg = async (dataUrl: string): Promise<string> => {
  await loadPotraceScript();
  
  return new Promise<string>((resolve, reject) => {
    try {
      window.Potrace.loadImageFromUrl(dataUrl);
      window.Potrace.process(() => {
        try {
          const svg = window.Potrace.getSVG(1);
          resolve(svg);
        } catch (error) {
          reject(new Error(`Failed to generate SVG: ${error}`));
        }
      });
    } catch (error) {
      reject(new Error(`Failed to process image: ${error}`));
    }
  });
};
/**
 * Converts bitmap image to SVG using potrace
 */
export async function convertImageToSVG(
  imageSource: ImageBitmapSource,
  options: Partial<PotraceOptions> = {},
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConversionResult> {
  const opts = { ...DEFAULT_POTRACE_OPTIONS, ...options };

  try {
    // Stage 1: Initialize potrace
    onProgress?.({ stage: 'initializing', progress: 10, message: 'Initializing potrace...' });
    // await initializePotrace();

    // Stage 2: Trace bitmap to SVG
    onProgress?.({ stage: 'tracing', progress: 30, message: 'Tracing image to vector paths...' });
    
    // const rawSvg = await potrace(imageSource, opts);


    const rawSvg = await PotraceToSvg((imageSource as HTMLCanvasElement).toDataURL());
    console.log('rawSvg', rawSvg)

    onProgress?.({ stage: 'tracing', progress: 60, message: 'Vector tracing complete' });

    // Stage 3: Optimize SVG
    onProgress?.({ stage: 'optimizing', progress: 70, message: 'Optimizing SVG...' });
    
    // Get original dimensions
    const originalDimensions = extractSVGDimensions(rawSvg);
    
    // Normalize and optimize the SVG
    let optimizedSvg = rawSvg
    optimizedSvg = optimizeSVGContent(optimizedSvg);
    
    // Get final dimensions
    const optimizedDimensions = extractSVGDimensions(optimizedSvg);
    
    // Extract metadata
    const pathCount = countSVGPaths(optimizedSvg);
    const colors = extractSVGColors(optimizedSvg);
    
    // Calculate compression ratio
    const originalSize = new Blob([rawSvg]).size;
    const optimizedSize = new Blob([optimizedSvg]).size;
    const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;

    onProgress?.({ stage: 'optimizing', progress: 90, message: 'Applying final optimizations...' });

    // Apply color simplification if needed
    if (colors.length > 5) {
      // Simplify colors by mapping similar colors together
      const colorMap = new Map<string, string>();
      // For now, we'll keep all colors, but this could be enhanced
      optimizedSvg = applySVGColorReplacements(optimizedSvg, colorMap);
    }

    onProgress?.({ stage: 'complete', progress: 100, message: 'Conversion complete!' });

    return {
      svgContent: optimizedSvg,
      paths: pathCount,
      colors,
      originalSize: originalDimensions,
      optimizedSize: optimizedDimensions,
      compressionRatio: compressionRatio > 0 ? compressionRatio : undefined,
    };

  } catch (error) {
    onProgress?.({ stage: 'error', progress: 0, message: 'Conversion failed' });
    console.error('SVG conversion error:', error);
    throw new Error(`SVG conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Converts processed canvas to SVG
 */
export async function canvasToSVG(
  canvas: HTMLCanvasElement,
  options: Partial<PotraceOptions> = {},
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConversionResult> {
  return convertImageToSVG(canvas, options, onProgress);
}

/**
 * Creates a preview of the SVG conversion process
 */
export function createSVGPreview(svgContent: string, previewSize: number = 200): string {
  const { width, height } = extractSVGDimensions(svgContent);
  const aspectRatio = width / height;
  
  let previewWidth = previewSize;
  let previewHeight = previewSize;
  
  if (aspectRatio > 1) {
    previewHeight = previewSize / aspectRatio;
  } else {
    previewWidth = previewSize * aspectRatio;
  }

  // Create a preview SVG with the specified dimensions
  const previewSvg = svgContent.replace(
    /<svg[^>]*>/,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${previewWidth}" height="${previewHeight}" viewBox="0 0 ${width} ${height}">`
  );

  return previewSvg;
}

/**
 * Validates SVG content
 */
export function validateSVG(svgContent: string): { valid: boolean; error?: string; warnings?: string[] } {
  const warnings: string[] = [];
  
  try {
    // Check if it's a valid XML structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    
    if (parserError) {
      return { valid: false, error: 'Invalid SVG XML structure' };
    }

    // Check for SVG root element
    const svgElement = doc.querySelector('svg');
    if (!svgElement) {
      return { valid: false, error: 'No SVG root element found' };
    }

    // Check for at least one path or shape element
    const shapes = svgElement.querySelectorAll('path, circle, rect, ellipse, line, polyline, polygon');
    if (shapes.length === 0) {
      warnings.push('No drawable shapes found in SVG');
    }

    // Check for extremely large dimensions
    const { width, height } = extractSVGDimensions(svgContent);
    if (width > 2000 || height > 2000) {
      warnings.push('SVG dimensions are very large, consider optimizing');
    }

    // Check for excessive number of paths
    const pathCount = countSVGPaths(svgContent);
    if (pathCount > 100) {
      warnings.push('SVG contains many paths, this may impact 3D performance');
    }

    return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };

  } catch (error) {
    return { valid: false, error: 'Failed to parse SVG content' };
  }
}

/**
 * Estimates 3D complexity based on SVG structure
 */
export function estimateComplexity(svgContent: string): {
  level: 'low' | 'medium' | 'high' | 'extreme';
  pathCount: number;
  estimatedVertices: number;
  recommendations: string[];
} {
  const pathCount = countSVGPaths(svgContent);
  const { width, height } = extractSVGDimensions(svgContent);
  
  // Estimate vertices based on paths and complexity
  const estimatedVertices = pathCount * 50; // Rough estimate
  const recommendations: string[] = [];
  
  let level: 'low' | 'medium' | 'high' | 'extreme' = 'low';
  
  if (pathCount <= 5) {
    level = 'low';
    recommendations.push('Optimal for 3D rendering');
  } else if (pathCount <= 20) {
    level = 'medium';
    recommendations.push('Good performance expected');
  } else if (pathCount <= 50) {
    level = 'high';
    recommendations.push('May cause performance issues on slower devices');
    recommendations.push('Consider simplifying the design');
  } else {
    level = 'extreme';
    recommendations.push('Very complex - will likely cause performance issues');
    recommendations.push('Strongly recommend simplifying the design');
    recommendations.push('Consider using a simpler version for 3D rendering');
  }

  if (width > 1000 || height > 1000) {
    recommendations.push('Large dimensions detected - consider resizing');
  }

  return {
    level,
    pathCount,
    estimatedVertices,
    recommendations
  };
}
