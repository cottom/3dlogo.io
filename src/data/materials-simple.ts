import * as THREE from 'three';

export interface MaterialPreset {
  id: string;
  name: string;
  category: 'chrome' | 'gold' | 'gradient' | 'glass' | 'wood' | 'stone';
  isPro?: boolean;
  type: 'standard' | 'physical' | 'gradient';
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  gradientColors?: string[];
  gradientDirection?: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
  normalScale?: number;
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

// Simple test array with just a few materials
export const MATERIAL_PRESETS: MaterialPreset[] = [
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
    id: 'gold-classic',
    name: 'Classic Gold',
    category: 'gold',
    type: 'physical',
    color: '#ffd700',
    metalness: 1.0,
    roughness: 0.3,
    previewGradient: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)'
  }
];

export const getMaterialsByCategory = (category: keyof typeof MATERIAL_CATEGORIES) => {
  return MATERIAL_PRESETS.filter(material => material.category === category);
};

export const getMaterialById = (id: string) => {
  return MATERIAL_PRESETS.find(material => material.id === id);
};

export const createThreeMaterial = (preset: MaterialPreset): THREE.Material => {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(preset.color || '#ffffff'),
    metalness: preset.metalness || 0,
    roughness: preset.roughness || 0.5,
    side: THREE.DoubleSide,
  });
};