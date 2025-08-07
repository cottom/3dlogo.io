'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';
import { LogoExporter, ExportOptions, ExportResult, ExportProgress, downloadFile } from '@/utils/exporters';

export interface ExportState {
  isExporting: boolean;
  progress: number;
  stage: string;
  error: string | null;
  lastExport: ExportResult | null;
}

interface GlobalExportContextType {
  exportState: ExportState;
  resetExportState: () => void;
  setSceneData: (scene: THREE.Scene | null, camera: THREE.Camera | null, renderer: THREE.WebGLRenderer | null) => void;
  exportLogo: (options: ExportOptions, autoDownload?: boolean) => Promise<ExportResult>;
  captureScreenshot: (resolution?: [number, number], transparent?: boolean, format?: 'png' | 'jpg', quality?: number) => Promise<ExportResult>;
  exportFor3DPrinting: () => Promise<ExportResult>;
  exportForWeb: (format?: 'gltf' | 'glb') => Promise<ExportResult>;
  exportHighResImage: (resolution?: [number, number], transparent?: boolean) => Promise<ExportResult>;
}

const GlobalExportContext = createContext<GlobalExportContextType | null>(null);

export function GlobalExportProvider({ children }: { children: React.ReactNode }) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    stage: '',
    error: null,
    lastExport: null,
  });

  const setSceneData = useCallback((scene: THREE.Scene | null, camera: THREE.Camera | null, renderer: THREE.WebGLRenderer | null) => {
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
  }, []);

  const resetExportState = useCallback(() => {
    setExportState({
      isExporting: false,
      progress: 0,
      stage: '',
      error: null,
      lastExport: null,
    });
  }, []);

  const handleProgress = useCallback((progress: ExportProgress) => {
    setExportState(prev => ({
      ...prev,
      progress: progress.progress,
      stage: progress.stage,
    }));
  }, []);

  const exportLogo = useCallback(async (options: ExportOptions, autoDownload = true): Promise<ExportResult> => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
      const error = 'Scene not initialized. Please wait for the 3D scene to load.';
      setExportState(prev => ({ ...prev, error, isExporting: false }));
      throw new Error(error);
    }

    setExportState(prev => ({ 
      ...prev, 
      isExporting: true, 
      error: null,
      progress: 0,
      stage: 'Preparing export...'
    }));

    try {
      const exporter = new LogoExporter(rendererRef.current, sceneRef.current, cameraRef.current as THREE.PerspectiveCamera);
      
      // Find the logo mesh in the scene
      let logoMesh: THREE.Mesh | null = null;
      sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.name === 'LogoMesh') {
          logoMesh = child;
        }
      });
      
      if (!logoMesh) {
        // If no specific logo mesh found, find any mesh
        sceneRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && !logoMesh) {
            logoMesh = child;
          }
        });
      }
      
      if (!logoMesh) {
        throw new Error('No 3D logo mesh found in the scene');
      }
      
      let result: ExportResult;
      
      // Call the appropriate export method based on format
      if (options.format === 'gltf' || options.format === 'glb') {
        result = await exporter.exportGLTF(logoMesh, options, handleProgress);
      } else if (options.format === 'stl') {
        result = await exporter.exportSTL(logoMesh, options, handleProgress);
      } else if (options.format === 'obj') {
        result = await exporter.exportOBJ(logoMesh, options, handleProgress);
      } else if (options.format === 'png' || options.format === 'jpg') {
        result = await exporter.exportImage(options, handleProgress);
      } else {
        throw new Error(`Unsupported export format: ${options.format}`);
      }
      
      setExportState(prev => ({ 
        ...prev, 
        isExporting: false,
        lastExport: result,
        progress: 100,
        stage: 'Export complete!'
      }));

      if (autoDownload && result.data instanceof Blob) {
        downloadFile(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed';
      setExportState(prev => ({ 
        ...prev, 
        isExporting: false,
        error: errorMessage,
        progress: 0,
        stage: ''
      }));
      throw error;
    }
  }, [handleProgress]);

  const captureScreenshot = useCallback(async (
    resolution: [number, number] = [1920, 1080],
    transparent = true,
    format: 'png' | 'jpg' = 'png',
    quality = 0.95
  ): Promise<ExportResult> => {
    return exportLogo({
      format,
      resolution,
      transparent,
      quality
    });
  }, [exportLogo]);

  const exportFor3DPrinting = useCallback(async (): Promise<ExportResult> => {
    return exportLogo({
      format: 'stl',
      binary: true
    });
  }, [exportLogo]);

  const exportForWeb = useCallback(async (format: 'gltf' | 'glb' = 'glb'): Promise<ExportResult> => {
    return exportLogo({
      format,
      binary: format === 'glb'
    });
  }, [exportLogo]);

  const exportHighResImage = useCallback(async (
    resolution: [number, number] = [4096, 4096],
    transparent = true
  ): Promise<ExportResult> => {
    return exportLogo({
      format: 'png',
      resolution,
      transparent,
      quality: 1
    });
  }, [exportLogo]);

  const value: GlobalExportContextType = {
    exportState,
    resetExportState,
    setSceneData,
    exportLogo,
    captureScreenshot,
    exportFor3DPrinting,
    exportForWeb,
    exportHighResImage,
  };

  return (
    <GlobalExportContext.Provider value={value}>
      {children}
    </GlobalExportContext.Provider>
  );
}

export function useGlobalExport() {
  const context = useContext(GlobalExportContext);
  if (!context) {
    throw new Error('useGlobalExport must be used within a GlobalExportProvider');
  }
  return context;
}