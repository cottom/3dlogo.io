'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Upload, X, AlertCircle, CheckCircle, Image as ImageIcon, FileText } from 'lucide-react';
import { validateImageFile, processImageForVectorization, ProcessingProgress, processImageForCanvas } from '@/utils/imageProcessing';
import { canvasToSVG, ConversionProgress, ConversionResult, validateSVG, estimateComplexity } from '@/utils/svgConversion';
import { useEditorActions } from '@/store/editorStore';

export interface ImageUploadProps {
  onUploadStart?: () => void;
  onUploadComplete?: (result: ConversionResult) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface UploadState {
  isDragOver: boolean;
  isProcessing: boolean;
  progress: number;
  stage: string;
  error: string | null;
  uploadedFile: File | null;
  previewUrl: string | null;
  processingStep: 'upload' | 'image-processing' | 'svg-conversion' | 'complete';
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function ImageUpload({
  onUploadStart,
  onUploadComplete,
  onError,
  className = '',
  disabled = false
}: ImageUploadProps) {
  const { setSvgContent, setLoading, setLogoFile } = useEditorActions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [state, setState] = useState<UploadState>({
    isDragOver: false,
    isProcessing: false,
    progress: 0,
    stage: '',
    error: null,
    uploadedFile: null,
    previewUrl: null,
    processingStep: 'upload',
  });

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
      }
    };
  }, [state.previewUrl]);

  const updateProgress = useCallback((
    progress: number,
    stage: string,
    processingStep?: 'upload' | 'image-processing' | 'svg-conversion' | 'complete'
  ) => {
    console.log(stage, progress)
    setState(prev => ({
      ...prev,
      progress,
      stage,
      processingStep: processingStep || prev.processingStep
    }));
  }, []);

  const handleError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      error,
      progress: 0,
      stage: '',
    }));
    setLoading(false);
    onError?.(error);
  }, [onError, setLoading]);

  const resetState = useCallback(() => {
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }
    
    setState({
      isDragOver: false,
      isProcessing: false,
      progress: 0,
      stage: '',
      error: null,
      uploadedFile: null,
      previewUrl: null,
      processingStep: 'upload',
    });
    
    setLoading(false);
    setSvgContent(null);
    setLogoFile(null);
  }, [state.previewUrl, setLoading, setSvgContent, setLogoFile]);

  const processFile = useCallback(async (file: File) => {
    try {
      // Stage 1: Validate file
      updateProgress(5, 'Validating file...', 'upload');
      const validation = validateImageFile(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid file');
      }

      // Set initial state
      setState(prev => ({
        ...prev,
        uploadedFile: file,
        previewUrl: URL.createObjectURL(file),
        isProcessing: true,
        error: null,
      }));

      setLoading(true);
      setLogoFile(file);
      onUploadStart?.();

      // Stage 2: Process image
      updateProgress(10, 'Starting image processing...', 'image-processing');
      
      // const imageResult = await processImageForVectorization(
      //   file,
      //   {
      //     backgroundColor: 'auto', // Auto-detect background
      //     similarity: 0.4,
      //     smoothness: 0.1,
      //     threshold: 128,
      //     contrastBoost: 1.2,
      //   },
      //   (progress: ProcessingProgress) => {
      //     const overallProgress = 10 + (progress.progress * 0.4); // 10-50%
      //     updateProgress(overallProgress, progress.message, 'image-processing');
      //   }
      // );

      const imageResult = await processImageForCanvas(file);

      // Stage 3: Convert to SVG
      updateProgress(50, 'Starting SVG conversion...', 'svg-conversion');
      
      const svgResult = await canvasToSVG(
        imageResult,
        {
          turdsize: 2,
          turnpolicy: 4,
          alphamax: 1,
          opticurve: 1,
          opttolerance: 0.2,
          pathonly: false,
          extractcolors: true,
          posterizelevel: 2,
          posterizationalgorithm: 0,
        },
        (progress: ConversionProgress) => {
          const overallProgress = 50 + (progress.progress * 0.4); // 50-90%
          updateProgress(overallProgress, progress.message, 'svg-conversion');
        }
      );

      console.log('svgResult', svgResult)

      // Stage 4: Validate and finalize
      updateProgress(90, 'Validating SVG...', 'complete');
      
      const svgValidation = validateSVG(svgResult.svgContent);
      if (!svgValidation.valid) {
        throw new Error(svgValidation.error || 'Generated SVG is invalid');
      }

      // Check complexity
      const complexity = estimateComplexity(svgResult.svgContent);
      if (complexity.level === 'extreme') {
        console.warn('High complexity SVG detected:', complexity.recommendations);
      }

      updateProgress(95, 'Finalizing...', 'complete');

      // Update store with final SVG
      setSvgContent(svgResult.svgContent);
      
      updateProgress(100, 'Upload complete!', 'complete');

      setState(prev => ({
        ...prev,
        isProcessing: false,
        processingStep: 'complete',
      }));

      setLoading(false);
      onUploadComplete?.(svgResult);

    } catch (error) {
      console.error('Processing error:', error);
      handleError(error instanceof Error ? error.message : 'Processing failed');
    }
  }, [updateProgress, setLoading, setLogoFile, setSvgContent, onUploadStart, onUploadComplete, handleError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && !state.isProcessing) {
      setState(prev => ({ ...prev, isDragOver: true }));
    }
  }, [disabled, state.isProcessing]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragOver: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragOver: false }));

    if (disabled || state.isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [disabled, state.isProcessing, processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFile]);

  const handleClick = useCallback(() => {
    if (!disabled && !state.isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled, state.isProcessing]);

  const getStageIcon = () => {
    if (state.error) {
      return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
    
    if (state.processingStep === 'complete') {
      return <CheckCircle className="w-8 h-8 text-green-500" />;
    }

    if (state.isProcessing) {
      switch (state.processingStep) {
        case 'image-processing':
          return <ImageIcon className="w-8 h-8 text-blue-500 animate-pulse" />;
        case 'svg-conversion':
          return <FileText className="w-8 h-8 text-purple-500 animate-pulse" />;
        default:
          return <Upload className="w-8 h-8 text-blue-500 animate-pulse" />;
      }
    }

    return <Upload className="w-8 h-8 text-gray-400" />;
  };

  const getProgressColor = () => {
    if (state.error) return 'bg-red-500';
    if (state.processingStep === 'complete') return 'bg-green-500';
    
    switch (state.processingStep) {
      case 'image-processing':
        return 'bg-blue-500';
      case 'svg-conversion':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${state.isDragOver 
            ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }
          ${disabled || state.isProcessing 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || state.isProcessing}
        />

        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            {getStageIcon()}
          </div>

          {/* Content */}
          {state.isProcessing ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {state.stage}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {Math.round(state.progress)}% complete
                </p>
              </div>
            </div>
          ) : state.error ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Upload Failed
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                {state.error}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          ) : state.processingStep === 'complete' && state.uploadedFile ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Upload Complete!
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {state.uploadedFile.name} converted to 3D logo
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetState();
                }}
                className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="w-3 h-3 mr-1" />
                Upload New
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Drag and drop your image or
              </p>
              <button 
                type="button" 
                className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                disabled={disabled}
              >
                Upload Image
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Supports PNG, JPG, JPEG, GIF (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {state.previewUrl && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="relative w-16 h-16 rounded border overflow-hidden">
              <Image 
                src={state.previewUrl} 
                alt="Upload preview" 
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {state.uploadedFile?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {state.uploadedFile ? (state.uploadedFile.size / 1024 / 1024).toFixed(1) : 0} MB
              </p>
              {state.processingStep === 'complete' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  ✓ Converted to 3D logo
                </p>
              )}
            </div>
            <button
              onClick={resetState}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={state.isProcessing}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      {!state.uploadedFile && !state.isProcessing && (
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 <strong>Tips for best results:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-4">
            <li>Use images with clear, solid backgrounds</li>
            <li>High contrast between logo and background works best</li>
            <li>Simple designs convert better to 3D</li>
            <li>White or light backgrounds are automatically removed</li>
          </ul>
        </div>
      )}
    </div>
  );
}