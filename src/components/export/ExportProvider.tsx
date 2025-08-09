'use client';

import React, { createContext, useContext, useRef, useCallback, useState } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LogoExporter, ExportOptions, ExportResult, ExportProgress, downloadFile } from '@/utils/exporters';
import { useBackgroundColor } from '@/store/editorStore';

export interface ExportState {
  isExporting: boolean;
  progress: number;
  stage: string;
  error: string | null;
  lastExport: ExportResult | null;
}

interface ExportContextType {
  exportState: ExportState;
  resetExportState: () => void;
  exportLogo: (options: ExportOptions, autoDownload?: boolean) => Promise<ExportResult>;
  captureScreenshot: (resolution?: [number, number], transparent?: boolean, format?: 'png' | 'jpg', quality?: number) => Promise<ExportResult>;
  exportFor3DPrinting: () => Promise<ExportResult>;
  exportForWeb: (format?: 'gltf' | 'glb') => Promise<ExportResult>;
  exportHighResImage: (resolution?: [number, number], transparent?: boolean) => Promise<ExportResult>;
}

const ExportContext = createContext<ExportContextType | null>(null);

export function ExportProvider({ children }: { children: React.ReactNode }) {
  const { gl: renderer, scene, camera } = useThree();
  const backgroundColor = useBackgroundColor();
  const [exportState, setExportState] = useState<ExportState>({
    isExporting: false,
    progress: 0,
    stage: '',
    error: null,
    lastExport: null,
  });

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

  const exportLogo = useCallback(async (
    options: ExportOptions,
    autoDownload: boolean = true
  ): Promise<ExportResult> => {
    try {
      // Reset state
      setExportState(prev => ({
        ...prev,
        isExporting: true,
        progress: 0,
        stage: 'Initializing export...',
        error: null,
      }));

      // Find the logo mesh in the scene
      const logoMesh = scene.getObjectByName('LogoMesh') as THREE.Mesh;
      if (!logoMesh) {
        throw new Error('No logo mesh found in scene. Please upload a logo first.');
      }

      // Validate mesh has geometry
      if (!logoMesh.geometry || !logoMesh.geometry.attributes.position) {
        throw new Error('Logo mesh does not have valid geometry for export.');
      }

      const exporter = new LogoExporter(
        renderer as THREE.WebGLRenderer, 
        scene, 
        camera as THREE.PerspectiveCamera
      );

      let result: ExportResult;

      switch (options.format) {
        case 'gltf':
        case 'glb':
          result = await exporter.exportGLTF(logoMesh, options, handleProgress);
          break;
        
        case 'stl':
          result = await exporter.exportSTL(logoMesh, options, handleProgress);
          break;
        
        case 'obj':
          result = await exporter.exportOBJ(logoMesh, options, handleProgress);
          break;
        
        case 'png':
        case 'jpg':
          // Add background color to options for image export
          const imageOptions = { ...options, backgroundColor };
          result = await exporter.exportImage(imageOptions, handleProgress);
          break;
        
        case 'mp4':
          // Add background color to options for video export
          const videoOptions = { ...options, backgroundColor };
          result = await exporter.exportVideo(logoMesh, 5, 30, videoOptions, handleProgress);
          break;
        
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }

      // Update state with successful result
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 100,
        stage: 'Export completed successfully!',
        lastExport: result,
      }));

      // Auto-download if requested
      if (autoDownload) {
        await downloadFile(result);
      }

      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown export error';
      
      setExportState(prev => ({
        ...prev,
        isExporting: false,
        progress: 0,
        stage: '',
        error: errorMessage,
      }));

      throw error;
    }
  }, [renderer, scene, camera, handleProgress, backgroundColor]);

  const captureScreenshot = useCallback(async (
    resolution: [number, number] = [1024, 1024],
    transparent: boolean = false,
    format: 'png' | 'jpg' = 'png',
    quality: number = 0.92
  ): Promise<ExportResult> => {
    const options: ExportOptions = {
      format,
      resolution,
      transparent,
      quality,
    };

    return await exportLogo(options, false);
  }, [exportLogo]);

  const exportFor3DPrinting = useCallback(async (): Promise<ExportResult> => {
    const options: ExportOptions = {
      format: 'stl',
    };

    return await exportLogo(options, true);
  }, [exportLogo]);

  const exportForWeb = useCallback(async (
    format: 'gltf' | 'glb' = 'glb'
  ): Promise<ExportResult> => {
    const options: ExportOptions = {
      format,
      binary: format === 'glb',
    };

    return await exportLogo(options, true);
  }, [exportLogo]);

  const exportHighResImage = useCallback(async (
    resolution: [number, number] = [2048, 2048],
    transparent: boolean = true
  ): Promise<ExportResult> => {
    const options: ExportOptions = {
      format: 'png',
      resolution,
      transparent,
      quality: 1.0,
    };

    return await exportLogo(options, true);
  }, [exportLogo]);

  const contextValue = {
    exportState,
    resetExportState,
    exportLogo,
    captureScreenshot,
    exportFor3DPrinting,
    exportForWeb,
    exportHighResImage,
  };

  return (
    <ExportContext.Provider value={contextValue}>
      {children}
    </ExportContext.Provider>
  );
}

export function useExport() {
  const context = useContext(ExportContext);
  if (!context) {
    // Return a default implementation that shows an error
    return {
      exportState: {
        isExporting: false,
        progress: 0,
        stage: '',
        error: 'Export functionality requires the component to be inside a Three.js Canvas context.',
        lastExport: null,
      },
      resetExportState: () => {},
      exportLogo: async () => {
        throw new Error('Export functionality requires the component to be inside a Three.js Canvas context.');
      },
      captureScreenshot: async () => {
        throw new Error('Export functionality requires the component to be inside a Three.js Canvas context.');
      },
      exportFor3DPrinting: async () => {
        throw new Error('Export functionality requires the component to be inside a Three.js Canvas context.');
      },
      exportForWeb: async () => {
        throw new Error('Export functionality requires the component to be inside a Three.js Canvas context.');
      },
      exportHighResImage: async () => {
        throw new Error('Export functionality requires the component to be inside a Three.js Canvas context.');
      },
    };
  }
  return context;
}