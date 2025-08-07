'use client';

import { useEnvironment, useEditorActions } from '@/store/editorStore';

const ENVIRONMENT_PRESETS = [
  { id: 'studio', name: 'Studio', icon: '🏢' },
  { id: 'sunset', name: 'Sunset', icon: '🌅' },
  { id: 'dawn', name: 'Dawn', icon: '🌄' },
  { id: 'night', name: 'Night', icon: '🌃' },
  { id: 'warehouse', name: 'Warehouse', icon: '🏭' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'apartment', name: 'Apartment', icon: '🏠' },
  { id: 'city', name: 'City', icon: '🌆' },
  { id: 'park', name: 'Park', icon: '🌳' },
  { id: 'lobby', name: 'Lobby', icon: '🏨' },
] as const;

export default function EnvironmentControls() {
  const environment = useEnvironment();
  const { updateEnvironment } = useEditorActions();

  const handlePresetChange = (preset: typeof ENVIRONMENT_PRESETS[number]['id']) => {
    updateEnvironment({ preset });
  };

  const handleBackgroundToggle = () => {
    updateEnvironment({ background: !environment.background });
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const intensity = parseFloat(e.target.value);
    updateEnvironment({ intensity });
  };

  const handleBlurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const blur = parseFloat(e.target.value);
    updateEnvironment({ blur });
  };

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-gray-900 dark:text-white">Environment</h3>
      
      {/* Preset Selection */}
      <div className="grid grid-cols-4 gap-0.5">
        {ENVIRONMENT_PRESETS.slice(0, 8).map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetChange(preset.id)}
            className={`p-0.5 rounded text-center transition-colors ${
              environment.preset === preset.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title={preset.name}
          >
            <div className="text-xs">{preset.icon}</div>
            <div className="text-[8px]">{preset.name.slice(0, 5)}</div>
          </button>
        ))}
      </div>

      {/* Background Toggle & Intensity in one row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <label className="text-[10px] text-gray-600 dark:text-gray-400">BG</label>
          <button
            onClick={handleBackgroundToggle}
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
              environment.background ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                environment.background ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        
        <div className="flex-1 flex items-center gap-1">
          <label className="text-[10px] text-gray-600 dark:text-gray-400">Int</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={environment.intensity}
            onChange={handleIntensityChange}
            className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded appearance-none cursor-pointer"
          />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 w-4">{environment.intensity.toFixed(1)}</span>
        </div>
      </div>

      {/* Blur Slider (only when background is enabled) */}
      {environment.background && (
        <div className="flex items-center gap-1">
          <label className="text-[10px] text-gray-600 dark:text-gray-400">Blur</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={environment.blur}
            onChange={handleBlurChange}
            className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded appearance-none cursor-pointer"
          />
          <span className="text-[10px] text-gray-500 dark:text-gray-400 w-4">{environment.blur.toFixed(1)}</span>
        </div>
      )}
    </div>
  );
}