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
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-gray-900 dark:text-white">Background</h3>
      
      {/* Color Input with Preview */}
      <div className="flex items-center space-x-1">
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          aria-label="Background color picker"
        />
        
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
          className="flex-1 px-1 py-0.5 text-[10px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="#000000"
        />
      </div>

      {/* Preset Colors Grid */}
      <div className="grid grid-cols-6 gap-0.5">
        {presetColors.map((color) => (
          <button
            key={color}
            onClick={() => setBackgroundColor(color)}
            className={`w-full aspect-square rounded border transition-all ${
              backgroundColor === color
                ? 'border-blue-500 ring-1 ring-blue-300'
                : 'border-gray-300 dark:border-gray-600 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Set background to ${color}`}
          />
        ))}
      </div>
    </div>
  );
}