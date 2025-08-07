/**
 * Image processing utilities for background removal and preprocessing
 * Handles white background detection, chroma keying, and image optimization
 */

export interface ProcessingOptions {
  backgroundColor: string;
  similarity: number;
  smoothness: number;
  threshold: number;
  contrastBoost: number;
}

export interface ProcessedImageResult {
  canvas: HTMLCanvasElement;
  imageData: ImageData;
  width: number;
  height: number;
  hasTransparency: boolean;
}

export interface ProcessingProgress {
  stage: 'loading' | 'analyzing' | 'processing' | 'optimizing' | 'complete' | 'error';
  progress: number;
  message: string;
}

const DEFAULT_OPTIONS: ProcessingOptions = {
  backgroundColor: '#ffffff', // White background by default
  similarity: 0.4,
  smoothness: 0.1,
  threshold: 128,
  contrastBoost: 1.2,
};

/**
 * Converts hex color to RGB values
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [255, 255, 255];
}

/**
 * Calculates color distance in RGB space
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rDiff = r1 - r2;
  const gDiff = g1 - g2;
  const bDiff = b1 - b2;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff) / Math.sqrt(3 * 255 * 255);
}

/**
 * Detects the most common background color from image edges
 */
export function detectBackgroundColor(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#ffffff';

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const colorMap = new Map<string, number>();

  // Sample pixels from the edges to detect background
  const samplePixels = (x: number, y: number) => {
    const index = (y * canvas.width + x) * 4;
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const alpha = data[index + 3];

    if (alpha > 200) { // Only consider opaque pixels
      const colorKey = `${r},${g},${b}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }
  };

  // Sample from all four edges
  for (let i = 0; i < canvas.width; i += 5) {
    samplePixels(i, 0); // Top edge
    samplePixels(i, canvas.height - 1); // Bottom edge
  }
  for (let i = 0; i < canvas.height; i += 5) {
    samplePixels(0, i); // Left edge
    samplePixels(canvas.width - 1, i); // Right edge
  }

  // Find the most common color
  let mostCommonColor = '#ffffff';
  let maxCount = 0;
  colorMap.forEach((count, color) => {
    if (count > maxCount) {
      maxCount = count;
      const [r, g, b] = color.split(',').map(Number);
      mostCommonColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
  });

  return mostCommonColor;
}

/**
 * Applies contrast and brightness adjustments to enhance edge detection
 */
export function enhanceContrast(imageData: ImageData, contrast: number = 1.2, brightness: number = 0): ImageData {
  const data = imageData.data;
  const enhancedData = new Uint8ClampedArray(data);

  for (let i = 0; i < enhancedData.length; i += 4) {
    // Apply contrast and brightness to RGB channels
    enhancedData[i] = Math.min(255, Math.max(0, (enhancedData[i] - 128) * contrast + 128 + brightness));
    enhancedData[i + 1] = Math.min(255, Math.max(0, (enhancedData[i + 1] - 128) * contrast + 128 + brightness));
    enhancedData[i + 2] = Math.min(255, Math.max(0, (enhancedData[i + 2] - 128) * contrast + 128 + brightness));
    // Alpha channel remains unchanged
  }

  return new ImageData(enhancedData, imageData.width, imageData.height);
}

/**
 * Removes background using chroma key technique
 */
export function removeBackground(
  imageData: ImageData,
  options: Partial<ProcessingOptions> = {}
): ImageData {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const [bgR, bgG, bgB] = hexToRgb(opts.backgroundColor);
  const data = imageData.data;
  const processedData = new Uint8ClampedArray(data);

  for (let i = 0; i < processedData.length; i += 4) {
    const r = processedData[i];
    const g = processedData[i + 1];
    const b = processedData[i + 2];
    
    // Calculate color distance from background color
    const distance = colorDistance(r, g, b, bgR, bgG, bgB);
    
    // Determine alpha based on color similarity
    if (distance < opts.similarity) {
      // Calculate smooth transition based on distance and smoothness
      const alpha = Math.max(0, Math.min(1, (distance - (opts.similarity - opts.smoothness)) / opts.smoothness));
      processedData[i + 3] = Math.round(alpha * 255);
    }
    // Keep original alpha for colors that don't match background
  }

  return new ImageData(processedData, imageData.width, imageData.height);
}

/**
 * Converts image to grayscale for better potrace results
 */
export function convertToGrayscale(imageData: ImageData, preserveAlpha: boolean = true): ImageData {
  const data = imageData.data;
  const grayscaleData = new Uint8ClampedArray(data);

  for (let i = 0; i < grayscaleData.length; i += 4) {
    const r = grayscaleData[i];
    const g = grayscaleData[i + 1];
    const b = grayscaleData[i + 2];
    
    // Use luminance formula for better grayscale conversion
    const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    
    grayscaleData[i] = gray;
    grayscaleData[i + 1] = gray;
    grayscaleData[i + 2] = gray;
    
    if (!preserveAlpha) {
      grayscaleData[i + 3] = 255;
    }
  }

  return new ImageData(grayscaleData, imageData.width, imageData.height);
}

/**
 * Applies threshold to create binary image
 */
export function applyThreshold(imageData: ImageData, threshold: number = 128): ImageData {
  const data = imageData.data;
  const binaryData = new Uint8ClampedArray(data);

  for (let i = 0; i < binaryData.length; i += 4) {
    const gray = binaryData[i]; // Assuming grayscale input
    const binary = gray > threshold ? 255 : 0;
    
    binaryData[i] = binary;
    binaryData[i + 1] = binary;
    binaryData[i + 2] = binary;
    // Keep original alpha
  }

  return new ImageData(binaryData, imageData.width, imageData.height);
}

/**
 * Loads image file and creates canvas
 */
export function loadImageToCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0);
      
      resolve(canvas);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // Create object URL and load image
    const imageUrl = URL.createObjectURL(file);
    img.src = imageUrl;
  });
}

/**
 * Optimizes image size for processing while maintaining aspect ratio
 */
export function optimizeImageSize(canvas: HTMLCanvasElement, maxDimension: number = 800): HTMLCanvasElement {
  const { width, height } = canvas;
  
  // Calculate new dimensions
  const aspectRatio = width / height;
  let newWidth = width;
  let newHeight = height;

  if (width > maxDimension || height > maxDimension) {
    if (aspectRatio > 1) {
      newWidth = maxDimension;
      newHeight = Math.round(maxDimension / aspectRatio);
    } else {
      newHeight = maxDimension;
      newWidth = Math.round(maxDimension * aspectRatio);
    }
  }

  // If no resize needed, return original canvas
  if (newWidth === width && newHeight === height) {
    return canvas;
  }

  // Create optimized canvas
  const optimizedCanvas = document.createElement('canvas');
  const ctx = optimizedCanvas.getContext('2d');
  
  if (!ctx) {
    return canvas; // Fallback to original
  }

  optimizedCanvas.width = newWidth;
  optimizedCanvas.height = newHeight;

  // Use high-quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, newWidth, newHeight);

  return optimizedCanvas;
}

export async function processImageForCanvas(file: File) {

  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      resolve(canvas)
      console.log('image loading')
    }
    img.src = URL.createObjectURL(file)
  })

}

/**
 * Main processing function that combines all image processing steps
 */

export async function processImageForVectorization(
  file: File,
  options: Partial<ProcessingOptions> = {},
  onProgress?: (progress: ProcessingProgress) => void
): Promise<ProcessedImageResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Stage 1: Loading
    onProgress?.({ stage: 'loading', progress: 10, message: 'Loading image...' });
    const originalCanvas = await loadImageToCanvas(file);
    
    // Stage 2: Analyzing
    onProgress?.({ stage: 'analyzing', progress: 20, message: 'Analyzing image...' });
    
    // Optimize image size for processing
    const optimizedCanvas = optimizeImageSize(originalCanvas, 800);
    const ctx = optimizedCanvas.getContext('2d')!;
    
    // Auto-detect background if not specified
    let backgroundColor = opts.backgroundColor;
    if (backgroundColor === 'auto') {
      backgroundColor = detectBackgroundColor(optimizedCanvas);
      onProgress?.({ stage: 'analyzing', progress: 30, message: 'Background color detected' });
    }

    // Stage 3: Processing
    onProgress?.({ stage: 'processing', progress: 40, message: 'Removing background...' });
    
    let imageData = ctx.getImageData(0, 0, optimizedCanvas.width, optimizedCanvas.height);
    
    // Apply contrast enhancement
    imageData = enhanceContrast(imageData, opts.contrastBoost);
    onProgress?.({ stage: 'processing', progress: 55, message: 'Enhancing contrast...' });
    
    // Remove background
    imageData = removeBackground(imageData, { ...opts, backgroundColor });
    onProgress?.({ stage: 'processing', progress: 70, message: 'Processing transparency...' });
    
    // Convert to grayscale for better potrace results
    imageData = convertToGrayscale(imageData, true);
    onProgress?.({ stage: 'processing', progress: 85, message: 'Converting to grayscale...' });
    
    // Apply threshold for binary conversion
    imageData = applyThreshold(imageData, opts.threshold);

    // Stage 4: Optimizing
    onProgress?.({ stage: 'optimizing', progress: 95, message: 'Finalizing...' });
    
    // Create final canvas
    const processedCanvas = document.createElement('canvas');
    const processedCtx = processedCanvas.getContext('2d')!;
    processedCanvas.width = optimizedCanvas.width;
    processedCanvas.height = optimizedCanvas.height;
    processedCtx.putImageData(imageData, 0, 0);

    // Check for transparency
    const hasTransparency = new Uint8Array(imageData.data.buffer).some((value, index) => 
      index % 4 === 3 && value < 255
    );

    onProgress?.({ stage: 'complete', progress: 100, message: 'Processing complete!' });

    return {
      canvas: processedCanvas,
      imageData,
      width: processedCanvas.width,
      height: processedCanvas.height,
      hasTransparency,
    };

  } catch (error) {
    onProgress?.({ stage: 'error', progress: 0, message: 'Processing failed' });
    throw error;
  }
}

/**
 * Validates if the uploaded file is a supported image format
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const supportedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (!supportedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload PNG, JPG, JPEG, or GIF images.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File too large. Please upload an image smaller than 10MB.',
    };
  }

  return { valid: true };
}