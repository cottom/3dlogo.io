'use client';

import { useState } from 'react';
import EditorLayout from '@/components/layout/EditorLayout';
import Scene from '@/components/canvas/Scene';
import ImageUpload from '@/components/upload/ImageUpload';
import MaterialPickerSimple from '@/components/materials/MaterialPickerSimple';
import ExportModal from '@/components/export/ExportModal';
import BackgroundColorPicker from '@/components/controls/BackgroundColorPicker';
import { useEditorActions, useBevelParams, useAnimation, useUploadState } from '@/store/editorStore';
import { ConversionResult } from '@/utils/svgConversion';

function LeftPanel() {
  const { updateBevelParams, setUploadResult, setUploadError } = useEditorActions();
  const bevelParams = useBevelParams();
  const uploadState = useUploadState();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateBevelParams({ extrusionDepth: value });
  };

  const handleUploadComplete = (result: ConversionResult) => {
    console.log('handleUploadComplete', result)
    setUploadResult({
      fileName: uploadState.lastUploadResult?.fileName || 'uploaded-image',
      fileSize: uploadState.lastUploadResult?.fileSize || 0,
      pathCount: result.paths,
      colors: result.colors || [],
      compressionRatio: result.compressionRatio,
    });
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
  };

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Upload Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Upload Logo</h3>
          <ImageUpload
            onUploadComplete={handleUploadComplete}
            onError={handleUploadError}
          />
          
          {/* Upload Results */}
          {uploadState.lastUploadResult && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="text-sm space-y-1">
                <div className="font-medium text-green-800 dark:text-green-200">
                  ✓ Upload Complete
                </div>
                <div className="text-green-700 dark:text-green-300 space-y-0.5">
                  <p>Paths: {uploadState.lastUploadResult.pathCount}</p>
                  <p>Colors: {(() => {
                    try {
                      const result = uploadState.lastUploadResult;
                      if (result && result.colors && Array.isArray(result.colors)) {
                        return result.colors.length;
                      }
                      return 0;
                    } catch {
                      return 0;
                    }
                  })()}</p>
                  {uploadState.lastUploadResult.compressionRatio && (
                    <p>Optimized: {uploadState.lastUploadResult.compressionRatio.toFixed(1)}%</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Upload Error */}
          {uploadState.uploadError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="text-sm text-red-800 dark:text-red-200">
                <div className="font-medium">Upload Failed</div>
                <p className="mt-1">{uploadState.uploadError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Thickness Control */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Thickness</h3>
          <div className="space-y-2">
            <input
              type="range"
              min="5"
              max="100"
              value={bevelParams.extrusionDepth}
              onChange={handleThicknessChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Logo thickness"
            />
            <div className="text-sm text-gray-500 dark:text-gray-400 text-right">{bevelParams.extrusionDepth}</div>
          </div>
        </div>

        {/* Export Button */}
        <div className="space-y-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>↓</span>
            <span>Export</span>
          </button>
        </div>
      </div>
      
      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
}

function CenterCanvas() {
  return (
    <div className="w-full h-full relative">
      <Scene className="absolute inset-0" />
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-black/20 px-2 py-1 rounded">
        3DLOGO.IO
      </div>
    </div>
  );
}

function RightPanel() {
  const { updateAnimation } = useEditorActions();
  const animation = useAnimation();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleAnimationChange = (type: 'none' | 'rotate' | 'bounce' | 'float' | 'pulse') => {
    updateAnimation({ 
      type, 
      enabled: type !== 'none',
      speed: 1 
    });
  };

  return (
    <>
      <div className="p-4 space-y-6">
        {/* Material Picker */}
        <MaterialPickerSimple />

        {/* Background Color Picker */}
        <BackgroundColorPicker />

        {/* Animation Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Animation</h3>
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Pro</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {(['none', 'rotate', 'bounce', 'float', 'pulse'] as const).map((animType) => (
              <button
                key={animType}
                type="button"
                onClick={() => handleAnimationChange(animType)}
                className={`p-3 rounded-lg text-center cursor-pointer transition-colors ${
                  animation.type === animType 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className={`text-xs ${
                  animation.type === animType 
                    ? 'text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {animType.charAt(0).toUpperCase() + animType.slice(1)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-white">Export</h3>
          <div className="space-y-2">
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-lg"
            >
              <span>↓</span>
              <span>Export Your Logo</span>
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              GLTF • STL • PNG • JPG
            </div>
          </div>
        </div>
      </div>
      
      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </>
  );
}

export default function EditorPage() {
  return (
    <EditorLayout
      leftPanel={<LeftPanel />}
      centerCanvas={<CenterCanvas />}
      rightPanel={<RightPanel />}
    />
  );
}