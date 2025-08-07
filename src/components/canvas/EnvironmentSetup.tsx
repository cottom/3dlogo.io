'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useEnvironment } from '@react-three/drei';
import { MaterialManager } from '@/lib/materials';
import * as THREE from 'three';

interface EnvironmentSetupProps {
  preset?: string;
  background?: boolean;
}

export function EnvironmentSetup({ preset = 'studio', background = false }: EnvironmentSetupProps) {
  const { scene, gl } = useThree();
  const envMap = useEnvironment({ preset: preset as any });

  useEffect(() => {
    if (envMap) {
      const manager = MaterialManager.getInstance();
      
      // Configure environment map
      if (envMap instanceof THREE.Texture) {
        envMap.mapping = THREE.EquirectangularReflectionMapping;
        manager.setEnvironmentMap(envMap);
      }

      // Set as scene environment
      scene.environment = envMap as THREE.Texture;
      
      // Optionally set as background
      if (background) {
        scene.background = envMap as THREE.Texture;
      }

      // Configure renderer for better PBR
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.0;
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }

    return () => {
      // Cleanup
      scene.environment = null;
      if (background) {
        scene.background = null;
      }
    };
  }, [envMap, scene, gl, background]);

  return null;
}