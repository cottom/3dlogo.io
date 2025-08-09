import type * as THREE from 'three';
import { MaterialManager } from '@/lib/materials';

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
  
  // Standard material properties
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
  
  // Gradient properties
  /** Gradient colors for gradient materials */
  gradientColors?: string[];
  
  /** Direction of gradient */
  gradientDirection?: 'horizontal' | 'vertical' | 'radial' | 'diagonal';
  
  // Advanced properties
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
  
  // Visual representation for UI
  /** CSS gradient for the swatch preview */
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
 * Valid ranges for material properties according to Three.js documentation
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
  {
    id: 'chrome-clean-optimised',
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
  {
    id: 'chrome-corrugated',
    name: 'Corrugated Steel',
    category: 'chrome',
    type: 'physical',
    color: '#cccccc',
    metalness: 1.0,
    roughness: 0.15,
    clearcoat: 0.5,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.2,
    previewGradient: 'linear-gradient(135deg, #d0d0d0 0%, #cccccc 50%, #a0a0a0 100%)'
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
  {
    id: 'gold-clean-optimised',
    name: 'Gold Clean',
    category: 'gold',
    type: 'physical',
    color: '#a8906d',
    metalness: 1.0,
    roughness: 0.15,
    emissive: '#a8906d',
    emissiveIntensity: 0.02,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #d4b896 0%, #a8906d 50%, #8a7456 100%)'
  },
  {
    id: 'gold-damaged',
    name: 'Damaged Gold',
    category: 'gold',
    type: 'physical',
    color: '#cccccc',
    metalness: 1.0,
    roughness: 0.35,
    emissive: '#a8906d',
    emissiveIntensity: 0.01,
    clearcoat: 0.4,
    clearcoatRoughness: 0.5,
    envMapIntensity: 1.0,
    previewGradient: 'linear-gradient(135deg, #e0d0b0 0%, #cccccc 50%, #a09080 100%)'
  },

  // ===== COSMIC GRADIENT =====
  // Note: gradient1-6 from JSON use texture-based gradients (baseColorTexture and metallicRoughnessTexture)
  // These are simplified versions using solid colors with gradient preview for UI
  {
    id: 'gradient-sunset',
    name: 'Sunset Blaze',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#ff006e',
    gradientColors: ['#ff006e', '#fb5607', '#ffbe0b'],
    gradientDirection: 'diagonal',
    metalness: 0.8,
    roughness: 0.3,
    emissiveIntensity: 0.15,
    envMapIntensity: 1.5,
    previewGradient: 'linear-gradient(135deg, #ff006e 0%, #fb5607 50%, #ffbe0b 100%)'
  },
  {
    id: 'gradient-ocean',
    name: 'Ocean Depths',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#8338ec',
    gradientColors: ['#8338ec', '#3a86ff', '#00bbf9'],
    gradientDirection: 'diagonal',
    metalness: 0.7,
    roughness: 0.25,
    emissiveIntensity: 0.1,
    envMapIntensity: 1.8,
    previewGradient: 'linear-gradient(135deg, #8338ec 0%, #3a86ff 50%, #00bbf9 100%)'
  },
  {
    id: 'gradient-forest',
    name: 'Forest Aurora',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#06d6a0',
    gradientColors: ['#06d6a0', '#ffd166', '#ef476f'],
    gradientDirection: 'horizontal',
    metalness: 0.6,
    roughness: 0.4,
    emissiveIntensity: 0.08,
    envMapIntensity: 1.3,
    previewGradient: 'linear-gradient(90deg, #06d6a0 0%, #ffd166 50%, #ef476f 100%)'
  },
  {
    id: 'gradient-arctic',
    name: 'Arctic Sky',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#89f7fe',
    gradientColors: ['#89f7fe', '#66a6ff', '#3a86ff'],
    gradientDirection: 'vertical',
    metalness: 0.9,
    roughness: 0.15,
    emissiveIntensity: 0.12,
    envMapIntensity: 2.0,
    previewGradient: 'linear-gradient(180deg, #89f7fe 0%, #66a6ff 50%, #3a86ff 100%)'
  },
  {
    id: 'gradient-blossom',
    name: 'Cherry Blossom',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#ff9a9e',
    gradientColors: ['#ff9a9e', '#fad0c4', '#fbc2eb'],
    gradientDirection: 'radial',
    metalness: 0.5,
    roughness: 0.35,
    emissiveIntensity: 0.18,
    envMapIntensity: 1.4,
    previewGradient: 'radial-gradient(circle, #ff9a9e 0%, #fad0c4 50%, #fbc2eb 100%)'
  },
  {
    id: 'gradient-crystal',
    name: 'Crystal Ice',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#a1c4fd',
    gradientColors: ['#a1c4fd', '#c2e9fb', '#e0f4ff'],
    gradientDirection: 'diagonal',
    metalness: 0.95,
    roughness: 0.1,
    emissiveIntensity: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    envMapIntensity: 2.2,
    previewGradient: 'linear-gradient(45deg, #a1c4fd 0%, #c2e9fb 50%, #e0f4ff 100%)'
  },
  {
    id: 'gradient-neon',
    name: 'Neon Dreams',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#ff00ff',
    gradientColors: ['#ff00ff', '#00ffff', '#ffff00'],
    gradientDirection: 'horizontal',
    metalness: 1.0,
    roughness: 0.2,
    emissiveIntensity: 0.25,
    envMapIntensity: 2.5,
    previewGradient: 'linear-gradient(90deg, #ff00ff 0%, #00ffff 50%, #ffff00 100%)'
  },
  {
    id: 'gradient-lava',
    name: 'Molten Lava',
    category: 'gradient',
    type: 'gradient',
    isPro: true,
    color: '#ff4500',
    gradientColors: ['#ff4500', '#ff8c00', '#ffd700'],
    gradientDirection: 'vertical',
    metalness: 0.85,
    roughness: 0.45,
    emissiveIntensity: 0.3,
    envMapIntensity: 1.6,
    previewGradient: 'linear-gradient(180deg, #ff4500 0%, #ff8c00 50%, #ffd700 100%)'
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