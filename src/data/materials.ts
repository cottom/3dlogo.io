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
    name: 'Mirror Chrome',
    category: 'chrome',
    type: 'physical',
    color: '#f5f5f5',
    metalness: 1.0,
    roughness: 0.02,
    emissive: '#ffffff',
    emissiveIntensity: 0.01,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.0,
    previewGradient: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #d8d8d8 100%)'
  },
  {
    id: 'chrome-polished',
    name: 'Liquid Metal',
    category: 'chrome',
    type: 'physical',
    color: '#e0e0e0',
    metalness: 1.0,
    roughness: 0.01,
    emissive: '#ffffff',
    emissiveIntensity: 0.02,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    envMapIntensity: 2.5,
    previewGradient: 'linear-gradient(135deg, #f8f8f8 0%, #e0e0e0 50%, #c0c0c0 100%)'
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
    name: '24K Gold',
    category: 'gold',
    type: 'physical',
    color: '#FFD700',
    metalness: 1.0,
    roughness: 0.05,
    emissive: '#FFD700',
    emissiveIntensity: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.8,
    previewGradient: 'linear-gradient(135deg, #FFF8DC 0%, #FFD700 50%, #DAA520 100%)'
  },
  {
    id: 'gold-rose',
    name: 'Rose Gold Luxe',
    category: 'gold',
    type: 'physical',
    color: '#F4C2C2',
    metalness: 1.0,
    roughness: 0.08,
    emissive: '#FF69B4',
    emissiveIntensity: 0.03,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.6,
    previewGradient: 'linear-gradient(135deg, #FFE4E1 0%, #F4C2C2 50%, #E8A49C 100%)'
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
    gradientColors: ['#FF61D8', '#FF8A3C', '#FFE53F'],
    gradientDirection: 'diagonal',
    metalness: 0.4,
    roughness: 0.2,
    emissiveIntensity: 0.25,
    previewGradient: 'linear-gradient(135deg, #FF61D8 0%, #FF8A3C 50%, #FFE53F 100%)'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Depths',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#0052CC', '#00B3E6', '#81E6FF'],
    gradientDirection: 'vertical',
    metalness: 0.3,
    roughness: 0.15,
    emissiveIntensity: 0.2,
    previewGradient: 'linear-gradient(180deg, #0052CC 0%, #00B3E6 50%, #81E6FF 100%)'
  },
  {
    id: 'gradient-forest',
    name: 'Mystic Forest',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#1A5F3F', '#2E8B57', '#98D982'],
    gradientDirection: 'radial',
    metalness: 0.25,
    roughness: 0.3,
    emissiveIntensity: 0.15,
    previewGradient: 'radial-gradient(circle, #1A5F3F 0%, #2E8B57 50%, #98D982 100%)'
  },
  {
    id: 'gradient-fire',
    name: 'Phoenix Flame',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#FF1744', '#FF6B35', '#FFCA28'],
    gradientDirection: 'diagonal',
    metalness: 0.5,
    roughness: 0.1,
    emissiveIntensity: 0.35,
    previewGradient: 'linear-gradient(135deg, #FF1744 0%, #FF6B35 50%, #FFCA28 100%)'
  },
  {
    id: 'gradient-space',
    name: 'Nebula Dreams',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#0D0221', '#4A1C7D', '#B535F6'],
    gradientDirection: 'vertical',
    metalness: 0.7,
    roughness: 0.05,
    emissiveIntensity: 0.4,
    previewGradient: 'linear-gradient(180deg, #0D0221 0%, #4A1C7D 50%, #B535F6 100%)'
  },
  {
    id: 'gradient-aurora',
    name: 'Aurora Borealis',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#00F5FF', '#7DF9FF', '#E0B0FF'],
    gradientDirection: 'horizontal',
    metalness: 0.35,
    roughness: 0.2,
    emissiveIntensity: 0.3,
    previewGradient: 'linear-gradient(90deg, #00F5FF 0%, #7DF9FF 50%, #E0B0FF 100%)'
  },
  {
    id: 'gradient-neon',
    name: 'Cyber Neon',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#FF10F0', '#00FFF0', '#BFFF00'],
    gradientDirection: 'diagonal',
    metalness: 0.6,
    roughness: 0.08,
    emissiveIntensity: 0.45,
    previewGradient: 'linear-gradient(135deg, #FF10F0 0%, #00FFF0 50%, #BFFF00 100%)'
  },
  {
    id: 'gradient-royal',
    name: 'Royal Amethyst',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#6B0F9F', '#9B59B6', '#E8B4F3'],
    gradientDirection: 'vertical',
    metalness: 0.45,
    roughness: 0.18,
    emissiveIntensity: 0.2,
    previewGradient: 'linear-gradient(180deg, #6B0F9F 0%, #9B59B6 50%, #E8B4F3 100%)'
  },
  {
    id: 'gradient-tropical',
    name: 'Tropical Sunset',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#FF0080', '#FF8C94', '#FFD3B6'],
    gradientDirection: 'radial',
    metalness: 0.35,
    roughness: 0.25,
    emissiveIntensity: 0.25,
    previewGradient: 'radial-gradient(circle, #FF0080 0%, #FF8C94 50%, #FFD3B6 100%)'
  },
  {
    id: 'gradient-holographic',
    name: 'Holographic',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#A8E6CF', '#FFD3B6', '#FFAAA5'],
    gradientDirection: 'diagonal',
    metalness: 0.8,
    roughness: 0.02,
    emissiveIntensity: 0.3,
    previewGradient: 'linear-gradient(135deg, #A8E6CF 0%, #FFD3B6 50%, #FFAAA5 100%)'
  },
  {
    id: 'gradient-vaporwave',
    name: 'Vaporwave',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#FF71CE', '#B967FF', '#05FFA1'],
    gradientDirection: 'horizontal',
    metalness: 0.55,
    roughness: 0.12,
    emissiveIntensity: 0.35,
    previewGradient: 'linear-gradient(90deg, #FF71CE 0%, #B967FF 50%, #05FFA1 100%)'
  },
  {
    id: 'gradient-ice',
    name: 'Arctic Ice',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    gradientColors: ['#B4E7FF', '#5CC9F5', '#4169E1'],
    gradientDirection: 'vertical',
    metalness: 0.65,
    roughness: 0.05,
    emissiveIntensity: 0.15,
    previewGradient: 'linear-gradient(180deg, #B4E7FF 0%, #5CC9F5 50%, #4169E1 100%)'
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