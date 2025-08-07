import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { MaterialManager } from '@/lib/materials';
import { MaterialPreset } from '@/data/materials';

export function useMaterialManager() {
  const managerRef = useRef<MaterialManager>(MaterialManager.getInstance());

  useEffect(() => {
    const manager = managerRef.current;
    return () => {
      // Cleanup on unmount
      manager.clearCache();
    };
  }, []);

  const createMaterial = (preset: MaterialPreset): THREE.Material => {
    return managerRef.current.createMaterial(preset);
  };

  const createCustomMaterial = (params: Partial<THREE.MeshStandardMaterialParameters>): THREE.Material => {
    return managerRef.current.createCustomMaterial(params);
  };

  const setEnvironmentMap = (envMap: THREE.Texture): void => {
    managerRef.current.setEnvironmentMap(envMap);
  };

  const updateMaterial = (material: THREE.Material, updates: Partial<THREE.MeshStandardMaterialParameters>): void => {
    managerRef.current.updateMaterial(material, updates);
  };

  const releaseMaterial = (material: THREE.Material): void => {
    managerRef.current.releaseMaterial(material);
  };

  const clearCache = (): void => {
    managerRef.current.clearCache();
  };

  return {
    createMaterial,
    createCustomMaterial,
    setEnvironmentMap,
    updateMaterial,
    releaseMaterial,
    clearCache,
    manager: managerRef.current,
  };
}