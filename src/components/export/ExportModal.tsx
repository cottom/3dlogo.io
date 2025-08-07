'use client';

import { useState, useEffect } from 'react';
import { X, Download, Image, Package, Printer, Globe, Film } from 'lucide-react';
import { useGlobalExport } from '@/components/export/GlobalExportProvider';
import { ExportOptions, formatFileSize, getRecommendedResolution } from '@/utils/exporters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'gltf' | 'glb' | 'stl' | 'obj' | 'png' | 'jpg' | 'mp4';
type ResolutionPreset = '512' | '1024' | '2048' | '4096';
type UsageType = 'web' | 'print' | '3d';

interface FormatOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'image' | '3d' | 'video';
  recommended?: UsageType[];
  fileExtension: string;
}

const formatOptions: FormatOption[] = [
  {
    id: 'glb',
    name: 'GLB (Binary)',
    description: 'Optimized 3D format, best for web and AR/VR',
    icon: <Package className="w-5 h-5" />,
    category: '3d',
    recommended: ['web'],
    fileExtension: 'glb'
  },
  {
    id: 'gltf',
    name: 'GLTF (Text)',
    description: 'Standard 3D format with separate textures',
    icon: <Package className="w-5 h-5" />,
    category: '3d',
    recommended: ['web'],
    fileExtension: 'gltf'
  },
  {
    id: 'stl',
    name: 'STL',
    description: 'Standard format for 3D printing',
    icon: <Printer className="w-5 h-5" />,
    category: '3d',
    recommended: ['3d'],
    fileExtension: 'stl'
  },
  {
    id: 'obj',
    name: 'OBJ',
    description: 'Universal 3D format with materials',
    icon: <Package className="w-5 h-5" />,
    category: '3d',
    recommended: ['3d'],
    fileExtension: 'obj'
  },
  {
    id: 'png',
    name: 'PNG',
    description: 'High-quality image with transparency',
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image className="w-5 h-5" aria-hidden="true" />,
    category: 'image',
    recommended: ['web', 'print'],
    fileExtension: 'png'
  },
  {
    id: 'jpg',
    name: 'JPEG',
    description: 'Compressed image format',
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image className="w-5 h-5" aria-hidden="true" />,
    category: 'image',
    recommended: ['web'],
    fileExtension: 'jpg'
  },
  {
    id: 'mp4',
    name: 'Video (WebM)',
    description: 'Animated video of rotating logo',
    icon: <Film className="w-5 h-5" />,
    category: 'video',
    recommended: ['web'],
    fileExtension: 'webm'
  }
];

const resolutionOptions = [
  { id: '512' as ResolutionPreset, label: '512×512', size: [512, 512] as [number, number], usage: 'Small thumbnails' },
  { id: '1024' as ResolutionPreset, label: '1024×1024', size: [1024, 1024] as [number, number], usage: 'Web use' },
  { id: '2048' as ResolutionPreset, label: '2048×2048', size: [2048, 2048] as [number, number], usage: 'High quality' },
  { id: '4096' as ResolutionPreset, label: '4096×4096', size: [4096, 4096] as [number, number], usage: 'Print quality' }
];

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('glb');
  const [resolution, setResolution] = useState<ResolutionPreset>('1024');
  const [quality, setQuality] = useState<number>(0.92);
  const [transparent, setTransparent] = useState<boolean>(true);
  const [estimatedSize, setEstimatedSize] = useState<string>('');

  const { exportState, exportLogo, resetExportState } = useGlobalExport();

  const selectedFormatOption = formatOptions.find(f => f.id === selectedFormat)!;
  const selectedResolution = resolutionOptions.find(r => r.id === resolution)!;

  // Calculate estimated file size
  useEffect(() => {
    let size = 0;
    
    switch (selectedFormat) {
      case 'glb':
        size = 500 * 1024; // ~500KB for typical logo
        break;
      case 'gltf':
        size = 800 * 1024; // ~800KB with separate files
        break;
      case 'stl':
        size = 1000 * 1024; // ~1MB for STL
        break;
      case 'obj':
        size = 600 * 1024; // ~600KB for OBJ
        break;
      case 'png':
        const pixels = selectedResolution.size[0] * selectedResolution.size[1];
        size = pixels * (transparent ? 4 : 3) * 0.3; // Rough PNG estimate
        break;
      case 'jpg':
        const jpgPixels = selectedResolution.size[0] * selectedResolution.size[1];
        size = jpgPixels * 3 * quality * 0.1; // Rough JPEG estimate
        break;
      case 'mp4':
        size = 3 * 1024 * 1024; // ~3MB for 5 second WebM video
        break;
    }
    
    setEstimatedSize(formatFileSize(size));
  }, [selectedFormat, resolution, quality, transparent, selectedResolution]);

  const handleExport = async () => {
    try {
      resetExportState();
      
      const options: ExportOptions = {
        format: selectedFormat,
        quality,
        transparent: transparent && selectedFormat === 'png',
        binary: selectedFormat === 'glb',
      };

      // Add resolution for image formats
      if (selectedFormatOption.category === 'image') {
        options.resolution = selectedResolution.size;
      }

      await exportLogo(options, true);
      
      // Close modal on successful export
      setTimeout(() => {
        onClose();
        resetExportState();
      }, 2000);
      
    } catch (error) {
      console.error('Export failed:', error);
      // Error state is handled by the hook
    }
  };

  const handleClose = () => {
    if (!exportState.isExporting) {
      resetExportState();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Export Logo
          </h2>
          <button
            onClick={handleClose}
            disabled={exportState.isExporting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Export Progress */}
          {exportState.isExporting && (
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {exportState.stage}
                </span>
                <span className="text-sm text-blue-600 dark:text-blue-300">
                  {exportState.progress}%
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportState.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Export Error */}
          {exportState.error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                Export Failed
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                {exportState.error}
              </div>
            </div>
          )}

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
              Choose Format
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formatOptions.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  disabled={exportState.isExporting}
                  className={`p-4 rounded-lg border text-left transition-colors disabled:opacity-50 ${
                    selectedFormat === format.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${
                      selectedFormat === format.id 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400'
                    }`}>
                      {format.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${
                          selectedFormat === format.id
                            ? 'text-blue-900 dark:text-blue-100'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {format.name}
                        </span>
                        {format.recommended?.includes('web') && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs px-2 py-0.5 rounded-full">
                            Web
                          </span>
                        )}
                        {format.recommended?.includes('3d') && (
                          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-xs px-2 py-0.5 rounded-full">
                            3D Print
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${
                        selectedFormat === format.id
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {format.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Image-specific options */}
          {selectedFormatOption.category === 'image' && (
            <div className="mb-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Image Settings
              </h3>
              
              {/* Resolution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {resolutionOptions.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setResolution(res.id)}
                      disabled={exportState.isExporting}
                      className={`p-3 rounded-lg border text-left transition-colors disabled:opacity-50 ${
                        resolution === res.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium ${
                        resolution === res.id
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {res.label}
                      </div>
                      <div className={`text-sm ${
                        resolution === res.id
                          ? 'text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {res.usage}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality (for JPEG) */}
              {selectedFormat === 'jpg' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    disabled={exportState.isExporting}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                  />
                </div>
              )}

              {/* Transparency (for PNG) */}
              {selectedFormat === 'png' && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="transparent"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    disabled={exportState.isExporting}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <label htmlFor="transparent" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transparent background
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Export Summary */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Export Summary
            </h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-medium">{selectedFormatOption.name}</span>
              </div>
              {selectedFormatOption.category === 'image' && (
                <div className="flex justify-between">
                  <span>Resolution:</span>
                  <span className="font-medium">{selectedResolution.label}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated size:</span>
                <span className="font-medium">{estimatedSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handleClose}
            disabled={exportState.isExporting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={exportState.isExporting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>
              {exportState.isExporting ? 'Exporting...' : 'Export'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}