'use client';

import React, { useState } from 'react';
import { MATERIAL_CATEGORIES, MATERIAL_PRESETS, getMaterialsByCategory, type MaterialPreset } from '@/data/materials';
import { useEditorActions, useMaterial } from '@/store/editorStore';

interface MaterialPickerProps {
  className?: string;
}

interface MaterialSwatchProps {
  material: MaterialPreset;
  isSelected: boolean;
  onSelect: (material: MaterialPreset) => void;
}

function MaterialSwatch({ material, isSelected, onSelect }: MaterialSwatchProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onSelect(material)}
        className={`
          relative w-12 h-12 rounded-lg border-2 cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:scale-105'
          }
        `}
        style={{
          background: material.previewGradient,
          boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
        aria-label={`Select ${material.name} material`}
        title={material.name}
      >
        {/* Shine effect overlay for metallic materials */}
        {(material.category === 'chrome' || material.category === 'gold') && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
        )}
        
        {/* Glass overlay effect */}
        {material.category === 'glass' && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/50 via-transparent to-white/20 pointer-events-none" />
        )}

        {/* Pro badge */}
        {material.isPro && (
          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium shadow-sm">
            Pro
          </div>
        )}
      </button>
      
      {/* Material name tooltip - shown on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-10">
        {material.name}
      </div>
    </div>
  );
}

interface CategoryTabProps {
  category: keyof typeof MATERIAL_CATEGORIES;
  label: string;
  isActive: boolean;
  onSelect: (category: keyof typeof MATERIAL_CATEGORIES) => void;
  materialCount: number;
  proCount: number;
}

function CategoryTab({ category, label, isActive, onSelect, materialCount, proCount }: CategoryTabProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className={`
        relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }
      `}
    >
      <span>{label}</span>
      {proCount > 0 && (
        <span className={`
          ml-1 text-xs px-1 py-0.5 rounded-full
          ${isActive ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}
        `}>
          {proCount} Pro
        </span>
      )}
    </button>
  );
}

export default function MaterialPicker({ className }: MaterialPickerProps) {
  const [activeCategory, setActiveCategory] = useState<keyof typeof MATERIAL_CATEGORIES>('chrome');
  const { updateMaterial, setSelectedMaterialId } = useEditorActions();
  const currentMaterial = useMaterial();

  const handleMaterialSelect = (material: MaterialPreset) => {
    // Update the material in the store
    updateMaterial({
      type: material.type === 'gradient' ? 'standard' : material.type,
      color: material.color || '#ffffff',
      metalness: material.metalness || 0,
      roughness: material.roughness || 0.5,
      emissive: material.emissive || '#000000',
      emissiveIntensity: material.emissiveIntensity || 0,
    });

    // Store the selected material ID for gradient and advanced material handling
    setSelectedMaterialId(material.id);
  };

  const isSelected = (material: MaterialPreset) => {
    // For now, compare basic properties to determine if selected
    return (
      currentMaterial.color === (material.color || '#ffffff') &&
      Math.abs(currentMaterial.metalness - (material.metalness || 0)) < 0.01 &&
      Math.abs(currentMaterial.roughness - (material.roughness || 0.5)) < 0.01
    );
  };

  const getCategoryStats = (category: keyof typeof MATERIAL_CATEGORIES) => {
    const materials = getMaterialsByCategory(category);
    return {
      total: materials?.length || 0,
      pro: materials?.filter(m => m.isPro).length || 0
    };
  };

  const currentCategoryMaterials = getMaterialsByCategory(activeCategory) || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">Material</h3>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {currentCategoryMaterials?.length || 0} materials
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(MATERIAL_CATEGORIES) as Array<keyof typeof MATERIAL_CATEGORIES>).map(category => {
          const stats = getCategoryStats(category);
          return (
            <CategoryTab
              key={category}
              category={category}
              label={MATERIAL_CATEGORIES[category]}
              isActive={activeCategory === category}
              onSelect={setActiveCategory}
              materialCount={stats.total}
              proCount={stats.pro}
            />
          );
        })}
      </div>

      {/* Material Grid */}
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-3">
          {currentCategoryMaterials.map(material => (
            <div key={material.id} className="group">
              <MaterialSwatch
                material={material}
                isSelected={isSelected(material)}
                onSelect={handleMaterialSelect}
              />
            </div>
          ))}
        </div>

        {/* Category Description */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {activeCategory === 'chrome' && 'Professional metallic finishes with realistic reflections'}
          {activeCategory === 'gold' && 'Luxurious gold and bronze materials with warm tones'}
          {activeCategory === 'gradient' && 'Dynamic gradient materials with custom color blending'}
          {activeCategory === 'glass' && 'Transparent and translucent glass effects'}
          {activeCategory === 'wood' && 'Natural wood textures with organic feel'}
          {activeCategory === 'stone' && 'Elegant stone and marble materials'}
        </div>
      </div>

      {/* Pro Notice */}
      {(getMaterialsByCategory(activeCategory) || []).some(m => m.isPro) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded font-medium">Pro</div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Unlock premium materials with advanced rendering
            </div>
          </div>
        </div>
      )}
    </div>
  );
}