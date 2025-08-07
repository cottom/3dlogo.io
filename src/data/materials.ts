import type * as THREE from 'three';
import { MaterialManager } from '@/lib/materials';

export interface MaterialPreset {
  id: string;
  name: string;
  category: 'chrome' | 'gold' | 'gradient' | 'glass' | 'wood' | 'stone';
  isPro?: boolean;
  type: 'standard' | 'physical' | 'gradient';
  
  // Standard material properties
  color?: string;
  metalness?: number;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  
  // Gradient properties
  gradientColors?: string[];
  gradientDirection?: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  
  // Advanced properties
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
  normalScale?: number;
  
  // Visual representation for UI
  previewGradient: string; // CSS gradient for the swatch
}

export const MATERIAL_CATEGORIES = {
  chrome: 'Forged Chrome',
  gold: 'Solar Gold',
  gradient: 'Cosmic Gradient',
  glass: 'Crystal Glass',
  wood: 'Natural Wood',
  stone: 'Stone & Marble'
} as const;

export const MATERIAL_PRESETS: MaterialPreset[] = [
  // ===== FORGED CHROME =====
  {
    id: 'chrome-silver',
    name: 'Silver Chrome',
    category: 'chrome',
    type: 'physical',
    color: '#e8e8e8',
    metalness: 1.0,
    roughness: 0.1,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #c8c8c8 100%)'
  },
  {
    id: 'chrome-polished',
    name: 'Polished Chrome',
    category: 'chrome',
    type: 'physical',
    color: '#d0d0d0',
    metalness: 1.0,
    roughness: 0.05,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #f0f0f0 0%, #d5d5d5 50%, #b8b8b8 100%)'
  },
  {
    id: 'chrome-dark',
    name: 'Dark Chrome',
    category: 'chrome',
    type: 'physical',
    color: '#a0a0a0',
    metalness: 1.0,
    roughness: 0.2,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.0,
    previewGradient: 'linear-gradient(135deg, #c0c0c0 0%, #a5a5a5 50%, #888888 100%)'
  },
  {
    id: 'chrome-brushed',
    name: 'Brushed Steel',
    category: 'chrome',
    type: 'physical',
    color: '#b8b8b8',
    metalness: 1.0,
    roughness: 0.4,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.8,
    envMapIntensity: 0.8,
    previewGradient: 'linear-gradient(135deg, #d0d0d0 0%, #b8b8b8 50%, #999999 100%)'
  },
  {
    id: 'chrome-titanium',
    name: 'Titanium',
    category: 'chrome',
    type: 'physical',
    color: '#c5c5c5',
    metalness: 1.0,
    roughness: 0.3,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.1,
    previewGradient: 'linear-gradient(135deg, #e0e0e0 0%, #c5c5c5 50%, #a8a8a8 100%)'
  },
  {
    id: 'chrome-gunmetal',
    name: 'Gunmetal',
    category: 'chrome',
    type: 'physical',
    color: '#808080',
    metalness: 1.0,
    roughness: 0.35,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.9,
    previewGradient: 'linear-gradient(135deg, #969696 0%, #808080 50%, #6a6a6a 100%)'
  },
  {
    id: 'chrome-blue',
    name: 'Blue Steel',
    category: 'chrome',
    type: 'physical',
    color: '#b0c4de',
    metalness: 1.0,
    roughness: 0.25,
    emissive: '#000033',
    emissiveIntensity: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #c8d8ec 0%, #b0c4de 50%, #9ab0d0 100%)'
  },

  // ===== SOLAR GOLD =====
  {
    id: 'gold-pure',
    name: 'Pure Gold',
    category: 'gold',
    type: 'physical',
    color: '#ffd700',
    metalness: 1.0,
    roughness: 0.1,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.3,
    previewGradient: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 50%, #e6c200 100%)'
  },
  {
    id: 'gold-rose',
    name: 'Rose Gold',
    category: 'gold',
    type: 'physical',
    color: '#e8b4b8',
    metalness: 1.0,
    roughness: 0.15,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #f2c2c6 0%, #e8b4b8 50%, #d4969a 100%)'
  },
  {
    id: 'gold-bronze',
    name: 'Antique Bronze',
    category: 'gold',
    type: 'physical',
    color: '#cd7f32',
    metalness: 1.0,
    roughness: 0.3,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.0,
    previewGradient: 'linear-gradient(135deg, #e69c4a 0%, #cd7f32 50%, #b56728 100%)'
  },
  {
    id: 'gold-copper',
    name: 'Polished Copper',
    category: 'gold',
    type: 'physical',
    color: '#b87333',
    metalness: 1.0,
    roughness: 0.08,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.4,
    previewGradient: 'linear-gradient(135deg, #d4894a 0%, #b87333 50%, #9c5d1d 100%)'
  },
  {
    id: 'gold-brass',
    name: 'Brass',
    category: 'gold',
    type: 'physical',
    color: '#e1c158',
    metalness: 1.0,
    roughness: 0.2,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.1,
    previewGradient: 'linear-gradient(135deg, #f0d070 0%, #e1c158 50%, #d2b240 100%)'
  },
  {
    id: 'gold-platinum',
    name: 'Platinum',
    category: 'gold',
    type: 'physical',
    color: '#e5e5e5',
    metalness: 1.0,
    roughness: 0.12,
    emissive: '#ffffff',
    emissiveIntensity: 0.02,
    clearcoat: 0.95,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.4,
    previewGradient: 'linear-gradient(135deg, #f2f2f2 0%, #e5e5e5 50%, #d8d8d8 100%)'
  },

  // ===== COSMIC GRADIENT =====
  {
    id: 'gradient-sunset',
    name: 'Cosmic Sunset',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#ff006e', '#fb5607', '#ffbe0b'],
    gradientDirection: 'diagonal',
    metalness: 0.3,
    roughness: 0.4,
    emissiveIntensity: 0.1,
    previewGradient: 'linear-gradient(135deg, #ff006e 0%, #fb5607 50%, #ffbe0b 100%)'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Depths',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#0077be', '#00a8cc', '#7209b7'],
    gradientDirection: 'vertical',
    metalness: 0.2,
    roughness: 0.3,
    emissiveIntensity: 0.15,
    previewGradient: 'linear-gradient(180deg, #0077be 0%, #00a8cc 50%, #7209b7 100%)'
  },
  {
    id: 'gradient-forest',
    name: 'Forest Dream',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#2d5016', '#61a3ba', '#d4af37'],
    gradientDirection: 'radial',
    metalness: 0.1,
    roughness: 0.5,
    emissiveIntensity: 0.1,
    previewGradient: 'radial-gradient(circle, #2d5016 0%, #61a3ba 50%, #d4af37 100%)'
  },
  {
    id: 'gradient-fire',
    name: 'Phoenix Fire',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#ff4500', '#ff6347', '#ffd700'],
    gradientDirection: 'diagonal',
    metalness: 0.4,
    roughness: 0.2,
    emissiveIntensity: 0.2,
    previewGradient: 'linear-gradient(135deg, #ff4500 0%, #ff6347 50%, #ffd700 100%)'
  },
  {
    id: 'gradient-space',
    name: 'Deep Space',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#000428', '#004e92', '#009ffd'],
    gradientDirection: 'vertical',
    metalness: 0.6,
    roughness: 0.1,
    emissiveIntensity: 0.3,
    previewGradient: 'linear-gradient(180deg, #000428 0%, #004e92 50%, #009ffd 100%)'
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora Borealis',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#00c9ff', '#92fe9d', '#ff006e'],
    gradientDirection: 'horizontal',
    metalness: 0.2,
    roughness: 0.3,
    emissiveIntensity: 0.25,
    previewGradient: 'linear-gradient(90deg, #00c9ff 0%, #92fe9d 50%, #ff006e 100%)'
  },
  {
    id: 'gradient-neon',
    name: 'Neon Dreams',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#ff00ff', '#00ffff', '#ffff00'],
    gradientDirection: 'diagonal',
    metalness: 0.5,
    roughness: 0.15,
    emissiveIntensity: 0.35,
    previewGradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)'
  },
  {
    id: 'gradient-royal',
    name: 'Royal Purple',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#4b0082', '#8a2be2', '#dda0dd'],
    gradientDirection: 'vertical',
    metalness: 0.35,
    roughness: 0.25,
    emissiveIntensity: 0.15,
    previewGradient: 'linear-gradient(180deg, #4b0082 0%, #8a2be2 50%, #dda0dd 100%)'
  },
  {
    id: 'gradient-tropical',
    name: 'Tropical Paradise',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#ff1493', '#ff69b4', '#ffb6c1'],
    gradientDirection: 'radial',
    metalness: 0.25,
    roughness: 0.35,
    emissiveIntensity: 0.2,
    previewGradient: 'radial-gradient(circle, #ff1493 0%, #ff69b4 50%, #ffb6c1 100%)'
  },

  // ===== GLASS MATERIALS =====
  {
    id: 'glass-clear',
    name: 'Clear Glass',
    category: 'glass',
    type: 'physical',
    isPro: true,
    color: '#ffffff',
    metalness: 0.0,
    roughness: 0.0,
    emissive: '#ffffff',
    emissiveIntensity: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.0,
    previewGradient: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 50%, rgba(220,220,220,0.9) 100%)'
  },
  {
    id: 'glass-frosted',
    name: 'Frosted Glass',
    category: 'glass',
    type: 'physical',
    isPro: true,
    color: '#f0f0f0',
    metalness: 0.0,
    roughness: 0.6,
    emissive: '#ffffff',
    emissiveIntensity: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.4,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(240,240,240,0.6) 50%, rgba(220,220,220,0.7) 100%)'
  },
  {
    id: 'glass-tinted-blue',
    name: 'Blue Tinted Glass',
    category: 'glass',
    type: 'physical',
    isPro: true,
    color: '#e6f2ff',
    metalness: 0.0,
    roughness: 0.02,
    emissive: '#0080ff',
    emissiveIntensity: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.2,
    previewGradient: 'linear-gradient(135deg, rgba(230,242,255,0.9) 0%, rgba(200,230,255,0.8) 50%, rgba(170,210,255,0.9) 100%)'
  },
  {
    id: 'glass-emerald',
    name: 'Emerald Glass',
    category: 'glass',
    type: 'physical',
    isPro: true,
    color: '#d4f5e6',
    metalness: 0.0,
    roughness: 0.03,
    emissive: '#00ff80',
    emissiveIntensity: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 2.0,
    previewGradient: 'linear-gradient(135deg, rgba(212,245,230,0.9) 0%, rgba(180,235,210,0.8) 50%, rgba(150,225,190,0.9) 100%)'
  },
  {
    id: 'glass-amber',
    name: 'Amber Glass',
    category: 'glass',
    type: 'physical',
    isPro: true,
    color: '#fff0d4',
    metalness: 0.0,
    roughness: 0.04,
    emissive: '#ffaa00',
    emissiveIntensity: 0.05,
    clearcoat: 0.95,
    clearcoatRoughness: 0.03,
    envMapIntensity: 1.8,
    previewGradient: 'linear-gradient(135deg, rgba(255,240,212,0.9) 0%, rgba(255,225,180,0.8) 50%, rgba(255,210,150,0.9) 100%)'
  },

  // ===== WOOD MATERIALS =====
  {
    id: 'wood-oak',
    name: 'Natural Oak',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#daa520',
    metalness: 0.0,
    roughness: 0.8,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.3,
    previewGradient: 'linear-gradient(135deg, #e6b84d 0%, #daa520 50%, #cc9900 100%)'
  },
  {
    id: 'wood-ebony',
    name: 'Dark Ebony',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#2c1810',
    metalness: 0.0,
    roughness: 0.7,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.4,
    previewGradient: 'linear-gradient(135deg, #3d251a 0%, #2c1810 50%, #1a0f0a 100%)'
  },
  {
    id: 'wood-walnut',
    name: 'Walnut',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#8b6f47',
    metalness: 0.0,
    roughness: 0.75,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.35,
    previewGradient: 'linear-gradient(135deg, #a68a5b 0%, #8b6f47 50%, #705c3c 100%)'
  },
  {
    id: 'wood-cherry',
    name: 'Cherry Wood',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#a52a2a',
    metalness: 0.0,
    roughness: 0.65,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.4,
    previewGradient: 'linear-gradient(135deg, #c04343 0%, #a52a2a 50%, #8a1818 100%)'
  },
  {
    id: 'wood-bamboo',
    name: 'Bamboo',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#e5d4a1',
    metalness: 0.0,
    roughness: 0.6,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.3,
    previewGradient: 'linear-gradient(135deg, #f0e0b8 0%, #e5d4a1 50%, #d8c690 100%)'
  },
  {
    id: 'wood-mahogany',
    name: 'Mahogany',
    category: 'wood',
    type: 'standard',
    isPro: true,
    color: '#c04000',
    metalness: 0.0,
    roughness: 0.55,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.45,
    previewGradient: 'linear-gradient(135deg, #d85020 0%, #c04000 50%, #a83800 100%)'
  },

  // ===== STONE MATERIALS =====
  {
    id: 'stone-marble',
    name: 'White Marble',
    category: 'stone',
    type: 'standard',
    isPro: true,
    color: '#f8f8ff',
    metalness: 0.0,
    roughness: 0.2,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.8,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f8f8ff 50%, #e6e6fa 100%)'
  },
  {
    id: 'stone-granite',
    name: 'Black Granite',
    category: 'stone',
    type: 'standard',
    isPro: true,
    color: '#2f2f2f',
    metalness: 0.1,
    roughness: 0.4,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.6,
    previewGradient: 'linear-gradient(135deg, #404040 0%, #2f2f2f 50%, #1f1f1f 100%)'
  },
  {
    id: 'stone-obsidian',
    name: 'Obsidian',
    category: 'stone',
    type: 'physical',
    isPro: true,
    color: '#0a0a0a',
    metalness: 0.2,
    roughness: 0.05,
    emissive: '#000000',
    emissiveIntensity: 0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 50%, #000000 100%)'
  },
  {
    id: 'stone-sandstone',
    name: 'Sandstone',
    category: 'stone',
    type: 'standard',
    isPro: true,
    color: '#e8c4a0',
    metalness: 0.0,
    roughness: 0.9,
    emissive: '#000000',
    emissiveIntensity: 0,
    envMapIntensity: 0.3,
    previewGradient: 'linear-gradient(135deg, #f4d7bc 0%, #e8c4a0 50%, #ddb184 100%)'
  }
];

// Helper function to get materials by category
export const getMaterialsByCategory = (category: keyof typeof MATERIAL_CATEGORIES) => {
  if (!MATERIAL_PRESETS) {
    console.error('MATERIAL_PRESETS is undefined');
    return [];
  }
  return MATERIAL_PRESETS.filter(material => material.category === category);
};

// Helper function to get material by ID
export const getMaterialById = (id: string) => {
  if (!MATERIAL_PRESETS) {
    console.error('MATERIAL_PRESETS is undefined');
    return undefined;
  }
  return MATERIAL_PRESETS.find(material => material.id === id);
};

// Helper function to create Three.js material from preset using the new system
export const createThreeMaterial = (preset: MaterialPreset): THREE.Material => {
  const manager = MaterialManager.getInstance();
  return manager.createMaterial(preset);
};