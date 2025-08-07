import * as THREE from 'three';

export class MaterialCache {
  private cache: Map<string, THREE.Material>;
  private maxSize: number;
  private accessOrder: string[];

  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.accessOrder = [];
  }

  get(key: string): THREE.Material | undefined {
    const material = this.cache.get(key);
    if (material) {
      // Update access order (LRU)
      this.updateAccessOrder(key);
    }
    return material;
  }

  set(key: string, material: THREE.Material): void {
    // Check if we need to evict
    if (!this.cache.has(key) && this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, material);
    this.updateAccessOrder(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    const material = this.cache.get(key);
    if (material) {
      material.dispose();
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return true;
    }
    return false;
  }

  clear(): void {
    // Dispose all materials
    this.cache.forEach(material => {
      material.dispose();
    });
    this.cache.clear();
    this.accessOrder = [];
  }

  size(): number {
    return this.cache.size;
  }

  disposeAll(): void {
    this.cache.forEach((material) => {
      // Dispose textures if they exist
      if ('map' in material && material.map) {
        (material.map as THREE.Texture).dispose();
      }
      if ('normalMap' in material && material.normalMap) {
        (material.normalMap as THREE.Texture).dispose();
      }
      if ('alphaMap' in material && material.alphaMap) {
        (material.alphaMap as THREE.Texture).dispose();
      }
      if ('bumpMap' in material && material.bumpMap) {
        (material.bumpMap as THREE.Texture).dispose();
      }
      if ('displacementMap' in material && material.displacementMap) {
        (material.displacementMap as THREE.Texture).dispose();
      }
      if ('envMap' in material && material.envMap) {
        (material.envMap as THREE.Texture).dispose();
      }
      
      material.dispose();
    });
    this.clear();
  }

  private updateAccessOrder(key: string): void {
    // Remove from current position
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    // Add to end (most recently used)
    this.accessOrder.push(key);
  }

  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const lruKey = this.accessOrder[0];
      this.delete(lruKey);
    }
  }

  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0 // Could implement hit rate tracking if needed
    };
  }
}