'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useEnvironment as useDreiEnvironment } from '@react-three/drei';
import { MaterialManager } from '@/lib/materials';
import { useEnvironment } from '@/store/editorStore';
import * as THREE from 'three';

export function EnvironmentSetup() {
  const { scene, gl } = useThree();
  const environment = useEnvironment();
  const envMap = useDreiEnvironment({ preset: environment.preset as any });

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
      if (environment.background) {
        scene.background = envMap as THREE.Texture;
        // Apply blur if specified
        if (environment.blur > 0 && envMap instanceof THREE.Texture) {
          scene.backgroundBlurriness = environment.blur;
        }
      } else {
        scene.background = null;
        scene.backgroundBlurriness = 0;
      }

      // Configure renderer for better PBR
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = environment.intensity;
      gl.outputColorSpace = THREE.SRGBColorSpace;
    }

    return () => {
      // Cleanup
      scene.environment = null;
      scene.background = null;
      scene.backgroundBlurriness = 0;
    };
  }, [envMap, scene, gl, environment.background, environment.intensity, environment.blur]);

  return null;
}