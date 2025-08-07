'use client';

import React, { useState } from 'react';
import { useEditorActions, useSelectedMaterialId } from '@/store/editorStore';
import { MATERIAL_PRESETS, MATERIAL_CATEGORIES } from '@/data/materials';

export default function MaterialPickerSimple() {
  const { setSelectedMaterialId } = useEditorActions();
  const selectedMaterialId = useSelectedMaterialId();
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof MATERIAL_CATEGORIES>('chrome');
  const [expandedView, setExpandedView] = useState(false);
  
  const handleMaterialSelect = (id: string) => {
    setSelectedMaterialId(id);
  };

  const categories = Object.keys(MATERIAL_CATEGORIES) as Array<keyof typeof MATERIAL_CATEGORIES>;
  const materialsInCategory = MATERIAL_PRESETS.filter(m => m.category === selectedCategory);

  if (expandedView) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 dark:text-white">Material</h3>
          <button
            onClick={() => setExpandedView(false)}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Collapse
          </button>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                selectedCategory === cat 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {MATERIAL_CATEGORIES[cat]}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-4 gap-2">
          {materialsInCategory.map(material => (
            <button
              key={material.id}
              onClick={() => handleMaterialSelect(material.id)}
              className={`relative p-2 rounded-lg border-2 transition-all ${
                selectedMaterialId === material.id 
                  ? 'border-blue-500 ring-2 ring-blue-300' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
              title={material.name}
            >
              <div 
                className="w-full h-12 rounded-md mb-1"
                style={{ background: material.previewGradient }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 block truncate">
                {material.name}
              </span>
              {material.isPro && (
                <span className="absolute top-1 right-1 text-xs bg-blue-600 text-white px-1 rounded">
                  Pro
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Compact view - shows category buttons
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-white">Material</h3>
        <button
          onClick={() => setExpandedView(true)}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleMaterialSelect('chrome-silver')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #c8c8c8 100%)' }}
        >
          Chrome
        </button>
        
        <button
          onClick={() => handleMaterialSelect('gold-pure')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 50%, #e6c200 100%)' }}
        >
          Gold
        </button>
        
        <button
          onClick={() => handleMaterialSelect('gradient-sunset')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #ff006e 0%, #fb5607 50%, #ffbe0b 100%)' }}
        >
          Gradient
        </button>
        
        <button
          onClick={() => handleMaterialSelect('glass-clear')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-gray-700 font-medium"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 50%, rgba(220,220,220,0.9) 100%)' }}
        >
          Glass
        </button>
        
        <button
          onClick={() => handleMaterialSelect('wood-oak')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-white font-medium"
          style={{ background: 'linear-gradient(135deg, #e6b84d 0%, #daa520 50%, #cc9900 100%)' }}
        >
          Wood
        </button>
        
        <button
          onClick={() => handleMaterialSelect('stone-marble')}
          className="p-3 rounded-lg border border-gray-300 hover:border-blue-500 text-gray-700 font-medium"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f8ff 50%, #e6e6fa 100%)' }}
        >
          Stone
        </button>
      </div>
    </div>
  );
}