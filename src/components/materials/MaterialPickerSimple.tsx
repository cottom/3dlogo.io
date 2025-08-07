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
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-medium text-gray-900 dark:text-white">Material</h3>
          <button
            onClick={() => setExpandedView(false)}
            className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Collapse
          </button>
        </div>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-0.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
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
        <div className="grid grid-cols-5 gap-0.5">
          {materialsInCategory.map(material => (
            <button
              key={material.id}
              onClick={() => handleMaterialSelect(material.id)}
              className={`relative p-1 rounded border transition-all ${
                selectedMaterialId === material.id 
                  ? 'border-blue-500 ring-1 ring-blue-300' 
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
              }`}
              title={material.name}
            >
              <div 
                className="w-full h-6 rounded"
                style={{ background: material.previewGradient }}
              />
              <span className="text-[9px] text-gray-700 dark:text-gray-300 block truncate mt-0.5">
                {material.name}
              </span>
              {material.isPro && (
                <span className="absolute top-0 right-0 text-[8px] bg-blue-600 text-white px-0.5 rounded-bl">
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-gray-900 dark:text-white">Material</h3>
        <button
          onClick={() => setExpandedView(true)}
          className="text-[10px] text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-0.5">
        <button
          onClick={() => handleMaterialSelect('chrome-silver')}
          className="py-1 px-0.5 rounded text-white text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #c8c8c8 100%)' }}
        >
          Chrome
        </button>
        
        <button
          onClick={() => handleMaterialSelect('gold-pure')}
          className="py-1 px-0.5 rounded text-white text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, #ffed4e 0%, #ffd700 50%, #e6c200 100%)' }}
        >
          Gold
        </button>
        
        <button
          onClick={() => handleMaterialSelect('gradient-sunset')}
          className="py-1 px-0.5 rounded text-white text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, #ff006e 0%, #fb5607 50%, #ffbe0b 100%)' }}
        >
          Gradient
        </button>
        
        <button
          onClick={() => handleMaterialSelect('glass-clear')}
          className="py-1 px-0.5 rounded text-gray-700 text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 50%, rgba(220,220,220,0.9) 100%)' }}
        >
          Glass
        </button>
        
        <button
          onClick={() => handleMaterialSelect('wood-oak')}
          className="py-1 px-0.5 rounded text-white text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, #e6b84d 0%, #daa520 50%, #cc9900 100%)' }}
        >
          Wood
        </button>
        
        <button
          onClick={() => handleMaterialSelect('stone-marble')}
          className="py-1 px-0.5 rounded text-gray-700 text-[10px] font-medium border border-gray-300 hover:border-blue-500"
          style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f8ff 50%, #e6e6fa 100%)' }}
        >
          Stone
        </button>
      </div>
    </div>
  );
}