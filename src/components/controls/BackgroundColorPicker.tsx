'use client';

import { useBackgroundColor, useEditorActions } from '@/store/editorStore';

export default function BackgroundColorPicker() {
  const backgroundColor = useBackgroundColor();
  const { setBackgroundColor } = useEditorActions();

  const presetColors = [
    '#141414', // Dark
    '#2D3748', // Dark Gray
    '#4A5568', // Medium Gray
    '#CBD5E0', // Light Gray
    '#F7FAFC', // Off White
    '#FFFFFF', // White
    '#1A365D', // Navy
    '#2B6CB0', // Blue
    '#3182CE', // Light Blue
    '#805AD5', // Purple
    '#D53F8C', // Pink
    '#ED8936', // Orange
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-900 dark:text-white">Background</h3>
      
      {/* Color Input with Preview */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
            aria-label="Background color picker"
          />
        </div>
        
        {/* Hex Input */}
        <input
          type="text"
          value={backgroundColor}
          onChange={(e) => {
            const value = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
              setBackgroundColor(value);
            }
          }}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>

      {/* Preset Colors Grid */}
      <div className="grid grid-cols-6 gap-2">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => setBackgroundColor(color)}
            className={`w-full aspect-square rounded-lg border-2 transition-all ${
              backgroundColor === color
                ? 'border-blue-500 scale-110'
                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Set background to ${color}`}
          />
        ))}
      </div>

      {/* RGB Values Display */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        RGB: {parseInt(backgroundColor.slice(1, 3), 16)}, {parseInt(backgroundColor.slice(3, 5), 16)}, {parseInt(backgroundColor.slice(5, 7), 16)}
      </div>
    </div>
  );
}