import * as THREE from 'three';
import { MaterialFactory } from './MaterialFactory';
import { MaterialPreset } from '@/data/materials';

export interface MaterialConfig {
  enableCache?: boolean;
  maxCacheSize?: number;
  enableAutoDispose?: boolean;
}

export class MaterialManager {
  private static instance: MaterialManager;
  private factory: MaterialFactory;
  private activeMaterials: Set<THREE.Material> = new Set();
  private materialReferences: Map<THREE.Material, number> = new Map();
  private config: MaterialConfig;

  private constructor(config: MaterialConfig = {}) {
    this.config = {
      enableCache: true,
      maxCacheSize: 100,
      enableAutoDispose: true,
      ...config
    };
    
    this.factory = MaterialFactory.getInstance({
      enableCache: this.config.enableCache,
      maxCacheSize: this.config.maxCacheSize
    });
  }

  static getInstance(config?: MaterialConfig): MaterialManager {
    if (!MaterialManager.instance) {
      MaterialManager.instance = new MaterialManager(config);
    }
    return MaterialManager.instance;
  }

  createMaterial(preset: MaterialPreset): THREE.Material {
    const material = this.factory.createFromPreset(preset);
    this.trackMaterial(material);
    return material;
  }

  createCustomMaterial(params: Partial<THREE.MeshStandardMaterialParameters>): THREE.Material {
    const material = this.factory.createCustomMaterial(params);
    this.trackMaterial(material);
    return material;
  }

  setEnvironmentMap(envMap: THREE.Texture): void {
    this.factory.setEnvironmentMap(envMap);
    
    // Update all active materials with the new environment map
    this.activeMaterials.forEach(material => {
      if ('envMap' in material) {
        (material as any).envMap = envMap;
        material.needsUpdate = true;
      }
    });
  }

  cloneMaterial(material: THREE.Material): THREE.Material {
    const cloned = material.clone();
    this.trackMaterial(cloned);
    return cloned;
  }

  private trackMaterial(material: THREE.Material): void {
    this.activeMaterials.add(material);
    const refCount = this.materialReferences.get(material) || 0;
    this.materialReferences.set(material, refCount + 1);
  }

  releaseMaterial(material: THREE.Material): void {
    const refCount = this.materialReferences.get(material);
    if (refCount !== undefined) {
      if (refCount > 1) {
        this.materialReferences.set(material, refCount - 1);
      } else {
        this.materialReferences.delete(material);
        this.activeMaterials.delete(material);
        
        if (this.config.enableAutoDispose) {
          this.disposeMaterial(material);
        }
      }
    }
  }

  private disposeMaterial(material: THREE.Material): void {
    // Dispose textures
    const textureProperties = [
      'map', 'normalMap', 'alphaMap', 'bumpMap', 
      'displacementMap', 'envMap', 'lightMap', 'aoMap',
      'emissiveMap', 'metalnessMap', 'roughnessMap'
    ];

    textureProperties.forEach(prop => {
      if (prop in material && (material as any)[prop]) {
        const texture = (material as any)[prop] as THREE.Texture;
        texture.dispose();
      }
    });

    material.dispose();
  }

  updateMaterial(material: THREE.Material, updates: Partial<THREE.MeshStandardMaterialParameters>): void {
    Object.entries(updates).forEach(([key, value]) => {
      if (key in material) {
        (material as any)[key] = value;
      }
    });
    material.needsUpdate = true;
  }

  disposeAll(): void {
    this.activeMaterials.forEach(material => {
      this.disposeMaterial(material);
    });
    this.activeMaterials.clear();
    this.materialReferences.clear();
    this.factory.disposeAll();
  }

  clearCache(): void {
    this.factory.clearCache();
  }

  getStats(): {
    activeMaterials: number;
    totalReferences: number;
    cacheStats: any;
  } {
    let totalRefs = 0;
    this.materialReferences.forEach(count => {
      totalRefs += count;
    });

    return {
      activeMaterials: this.activeMaterials.size,
      totalReferences: totalRefs,
      cacheStats: {} // Factory could provide cache stats
    };
  }
}