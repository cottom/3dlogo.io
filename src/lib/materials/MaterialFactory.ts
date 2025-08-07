import * as THREE from 'three';
import { MaterialPreset } from '@/data/materials';
import { MaterialBuilder } from './MaterialBuilder';
import { MaterialCache } from './MaterialCache';
import { GradientMaterialFactory } from './GradientMaterialFactory';

export interface MaterialFactoryOptions {
  enableCache?: boolean;
  maxCacheSize?: number;
  envMap?: THREE.Texture;
}

export class MaterialFactory {
  private static instance: MaterialFactory;
  private cache: MaterialCache;
  private envMap: THREE.Texture | null = null;
  private builder: MaterialBuilder;
  private gradientFactory: GradientMaterialFactory;

  private constructor(options: MaterialFactoryOptions = {}) {
    this.cache = new MaterialCache(options.maxCacheSize || 100);
    this.envMap = options.envMap || null;
    this.builder = new MaterialBuilder();
    this.gradientFactory = new GradientMaterialFactory();
  }

  static getInstance(options?: MaterialFactoryOptions): MaterialFactory {
    if (!MaterialFactory.instance) {
      MaterialFactory.instance = new MaterialFactory(options);
    }
    return MaterialFactory.instance;
  }

  setEnvironmentMap(envMap: THREE.Texture): void {
    this.envMap = envMap;
    this.cache.clear(); // Clear cache when environment changes
  }

  createFromPreset(preset: MaterialPreset, forceNew = false): THREE.Material {
    const cacheKey = this.generateCacheKey(preset);
    
    if (!forceNew) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached.clone(); // Return a clone to allow instance-specific modifications
      }
    }

    let material: THREE.Material;

    switch (preset.type) {
      case 'gradient':
        material = this.gradientFactory.create(preset);
        break;
      case 'physical':
        material = this.createPhysicalMaterial(preset);
        break;
      case 'standard':
      default:
        material = this.createStandardMaterial(preset);
        break;
    }

    // Apply environment map if available
    if (this.envMap && 'envMap' in material) {
      (material as any).envMap = this.envMap;
    }

    // Cache the material
    this.cache.set(cacheKey, material);
    
    return material.clone();
  }

  private createStandardMaterial(preset: MaterialPreset): THREE.MeshStandardMaterial {
    return this.builder
      .reset()
      .setType('standard')
      .setColor(preset.color || '#ffffff')
      .setMetalness(preset.metalness || 0)
      .setRoughness(preset.roughness || 0.5)
      .setEmissive(preset.emissive || '#000000')
      .setEmissiveIntensity(preset.emissiveIntensity || 0)
      .setSide(THREE.DoubleSide)
      .build() as THREE.MeshStandardMaterial;
  }

  private createPhysicalMaterial(preset: MaterialPreset): THREE.MeshPhysicalMaterial {
    const material = this.builder
      .reset()
      .setType('physical')
      .setColor(preset.color || '#ffffff')
      .setMetalness(preset.metalness || 0)
      .setRoughness(preset.roughness || 0.5)
      .setEmissive(preset.emissive || '#000000')
      .setEmissiveIntensity(preset.emissiveIntensity || 0)
      .setClearcoat(preset.clearcoat || 0)
      .setClearcoatRoughness(preset.clearcoatRoughness || 0)
      .setSide(THREE.DoubleSide)
      .build() as THREE.MeshPhysicalMaterial;

    if (preset.envMapIntensity !== undefined) {
      material.envMapIntensity = preset.envMapIntensity;
    }

    return material;
  }

  createCustomMaterial(params: Partial<THREE.MeshStandardMaterialParameters>): THREE.Material {
    return this.builder
      .reset()
      .setType('standard')
      .setParameters(params)
      .build();
  }

  private generateCacheKey(preset: MaterialPreset): string {
    return `${preset.id}_${preset.type}_${JSON.stringify(preset)}`;
  }

  clearCache(): void {
    this.cache.clear();
  }

  disposeAll(): void {
    this.cache.disposeAll();
    this.gradientFactory.dispose();
  }
}