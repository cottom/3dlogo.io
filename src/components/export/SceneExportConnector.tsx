'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useGlobalExport } from './GlobalExportProvider';

export function SceneExportConnector() {
  const { scene, camera, gl: renderer } = useThree();
  const { setSceneData } = useGlobalExport();

  useEffect(() => {
    // Connect the Three.js context to the global export provider
    setSceneData(scene, camera, renderer);
    
    // Clean up on unmount
    return () => {
      setSceneData(null, null, null);
    };
  }, [scene, camera, renderer, setSceneData]);

  return null;
}