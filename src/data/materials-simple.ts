import * as THREE from 'three';

/**
 * Material preset configuration for Three.js materials
 * @see https://threejs.org/docs/#api/en/materials/MeshStandardMaterial
 * @see https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial
 */
export interface MaterialPreset {
  id: string;
  name: string;
  category: 'chrome' | 'gold' | 'gradient' | 'glass' | 'wood' | 'stone';
  isPro?: boolean;
  type: 'standard' | 'physical' | 'gradient';
  
  /** Base color in hex format (e.g., '#ffffff') */
  color?: string;
  
  /** How metallic the material is (0.0 = non-metal, 1.0 = metal) */
  metalness?: number;
  
  /** Surface roughness (0.0 = smooth/shiny, 1.0 = rough/matte) */
  roughness?: number;
  
  /** Emissive (glow) color in hex format */
  emissive?: string;
  
  /** Intensity of emissive light (typically 0.0 to 1.0) */
  emissiveIntensity?: number;
  
  /** Gradient colors for gradient materials */
  gradientColors?: string[];
  
  /** Direction of gradient */
  gradientDirection?: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  
  /** Clear coat layer intensity (0.0 to 1.0) - MeshPhysicalMaterial only */
  clearcoat?: number;
  
  /** Clear coat layer roughness (0.0 to 1.0) - MeshPhysicalMaterial only */
  clearcoatRoughness?: number;
  
  /** Environment map intensity multiplier (typically 0.0 to 3.0) */
  envMapIntensity?: number;
  
  /** Normal map scale as [x, y] values - stored as array for serialization */
  normalScale?: [number, number];
  
  /** Which sides of faces to render */
  side?: 'front' | 'back' | 'double';
  
  /** CSS gradient for UI preview */
  previewGradient: string;
}

export const MATERIAL_CATEGORIES = {
  chrome: 'Forged Chrome',
  gold: 'Solar Gold',
  gradient: 'Cosmic Gradient',
  glass: 'Crystal Glass',
  wood: 'Natural Wood',
  stone: 'Stone & Marble'
} as const;

/**
 * Valid ranges for material properties
 */
export const MATERIAL_PROPERTY_LIMITS = {
  metalness: { min: 0, max: 1 },
  roughness: { min: 0, max: 1 },
  clearcoat: { min: 0, max: 1 },
  clearcoatRoughness: { min: 0, max: 1 },
  emissiveIntensity: { min: 0, max: 2 },
  envMapIntensity: { min: 0, max: 3 },
  normalScale: { min: -1, max: 1 }
} as const;

// Simple test array with materials from JSON and existing definitions
export const MATERIAL_PRESETS: MaterialPreset[] = [
  // Chrome materials
  {
    id: 'chrome-silver',
    name: 'Silver Chrome',
    category: 'chrome',
    type: 'physical',
    color: '#e8e8e8',
    metalness: 1.0,
    roughness: 0.1,
    previewGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #c8c8c8 100%)'
  },
  {
    id: 'chrome-clean',
    name: 'Chrome Clean',
    category: 'chrome',
    type: 'physical',
    color: '#cccccc',
    metalness: 1.0,
    roughness: 0.15,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #e0e0e0 0%, #cccccc 50%, #b0b0b0 100%)'
  },
  // Gold materials
  {
    id: 'gold-classic',
    name: 'Classic Gold',
    category: 'gold',
    type: 'physical',
    color: '#ffd700',
    metalness: 1.0,
    roughness: 0.3,
    previewGradient: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)'
  },
  {
    id: 'gold-clean',
    name: 'Gold Clean',
    category: 'gold',
    type: 'physical',
    color: '#a8906d',
    metalness: 1.0,
    roughness: 0.15,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #d4b896 0%, #a8906d 50%, #8a7456 100%)'
  },
  // Gradient materials from GLTF JSON (texture-based, simplified here)
  {
    id: 'gradient1',
    name: 'Gradient 1',
    category: 'gradient',
    type: 'physical',
    color: '#cccccc',
    metalness: 1.0,
    roughness: 0.5,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #cccccc 50%, #808080 100%)'
  },
  {
    id: 'gradient2',
    name: 'Gradient 2',
    category: 'gradient',
    type: 'physical',
    color: '#cccccc',
    metalness: 1.0,
    roughness: 0.5,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #e0e0e0 0%, #b0b0b0 50%, #808080 100%)'
  }
];

export const getMaterialsByCategory = (category: keyof typeof MATERIAL_CATEGORIES) => {
  return MATERIAL_PRESETS.filter(material => material.category === category);
};

export const getMaterialById = (id: string) => {
  return MATERIAL_PRESETS.find(material => material.id === id);
};

/**
 * Creates a Three.js material from a preset configuration
 * Validates and clamps values to proper ranges
 */
export const createThreeMaterial = (preset: MaterialPreset): THREE.Material => {
  // Helper to clamp values within valid ranges
  const clamp = (value: number, min: number, max: number) => 
    Math.min(Math.max(value, min), max);
  
  const materialOptions: THREE.MeshStandardMaterialParameters | THREE.MeshPhysicalMaterialParameters = {
    color: new THREE.Color(preset.color || '#ffffff'),
    metalness: clamp(preset.metalness ?? 0, 0, 1),
    roughness: clamp(preset.roughness ?? 0.5, 0, 1),
    side: preset.side === 'front' ? THREE.FrontSide :
          preset.side === 'back' ? THREE.BackSide :
          THREE.DoubleSide,
  };
  
  // Add emissive properties if specified
  if (preset.emissive) {
    materialOptions.emissive = new THREE.Color(preset.emissive);
    materialOptions.emissiveIntensity = clamp(preset.emissiveIntensity ?? 0, 0, 2);
  }
  
  // For physical materials, add additional properties
  if (preset.type === 'physical') {
    const physicalMaterial = new THREE.MeshPhysicalMaterial(materialOptions);
    
    if (preset.clearcoat !== undefined) {
      physicalMaterial.clearcoat = clamp(preset.clearcoat, 0, 1);
    }
    if (preset.clearcoatRoughness !== undefined) {
      physicalMaterial.clearcoatRoughness = clamp(preset.clearcoatRoughness, 0, 1);
    }
    if (preset.envMapIntensity !== undefined) {
      physicalMaterial.envMapIntensity = clamp(preset.envMapIntensity, 0, 3);
    }
    if (preset.normalScale) {
      physicalMaterial.normalScale = new THREE.Vector2(
        clamp(preset.normalScale[0], -1, 1),
        clamp(preset.normalScale[1], -1, 1)
      );
    }
    
    return physicalMaterial;
  }
  
  // Default to MeshStandardMaterial
  const standardMaterial = new THREE.MeshStandardMaterial(materialOptions);
  
  if (preset.envMapIntensity !== undefined) {
    standardMaterial.envMapIntensity = clamp(preset.envMapIntensity, 0, 3);
  }
  if (preset.normalScale) {
    standardMaterial.normalScale = new THREE.Vector2(
      clamp(preset.normalScale[0], -1, 1),
      clamp(preset.normalScale[1], -1, 1)
    );
  }
  
  return standardMaterial;
};