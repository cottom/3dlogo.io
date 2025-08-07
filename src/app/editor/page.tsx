"use client";

import { useState } from "react";
import EditorLayout from "@/components/layout/EditorLayout";
import Scene from "@/components/canvas/Scene";
import ImageUpload from "@/components/upload/ImageUpload";
import MaterialPickerSimple from "@/components/materials/MaterialPickerSimple";
import ExportModal from "@/components/export/ExportModal";
import BackgroundColorPicker from "@/components/controls/BackgroundColorPicker";
import EnvironmentControls from "@/components/controls/EnvironmentControls";
import EditorSeoPage from "@/components/seo/EditorSeoPage"
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { useInitialLoad } from "@/hooks/useInitialLoad";
import {
  useEditorActions,
  useBevelParams,
  useAnimation,
  useUploadState,
} from "@/store/editorStore";
import { ConversionResult } from "@/utils/svgConversion";

function LeftPanel() {
  const { setUploadResult, setUploadError } = useEditorActions();
  const uploadState = useUploadState();

  const handleUploadComplete = (result: ConversionResult) => {
    console.log("handleUploadComplete", result);
    setUploadResult({
      fileName: uploadState.lastUploadResult?.fileName || "uploaded-image",
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
    <div className="p-3 space-y-3">
      {/* Upload Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Upload"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Logo
        </h3>
        <ImageUpload
          onUploadComplete={handleUploadComplete}
          onError={handleUploadError}
        />

        {/* Upload Results */}
        {uploadState.lastUploadResult && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-2">
            <div className="text-xs space-y-0.5">
              <div className="font-medium text-green-800 dark:text-green-200">
                ✓ Upload Complete
              </div>
              <div className="text-green-700 dark:text-green-300 text-[10px] space-y-0">
                <p>Paths: {uploadState.lastUploadResult.pathCount}</p>
                <p>
                  Colors:{" "}
                  {(() => {
                    try {
                      const result = uploadState.lastUploadResult;
                      if (
                        result &&
                        result.colors &&
                        Array.isArray(result.colors)
                      ) {
                        return result.colors.length;
                      }
                      return 0;
                    } catch {
                      return 0;
                    }
                  })()}
                </p>
                {uploadState.lastUploadResult.compressionRatio && (
                  <p>
                    Optimized:{" "}
                    {uploadState.lastUploadResult.compressionRatio.toFixed(1)}%
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadState.uploadError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-2">
            <div className="text-xs text-red-800 dark:text-red-200">
              <div className="font-medium">Upload Failed</div>
              <p className="text-[10px] mt-0.5">{uploadState.uploadError}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CenterCanvas() {
  const { isLoading, loadingProgress, loadingMessage } = useInitialLoad();

  return (
    <div className="w-full h-full relative">
      <Scene className="absolute inset-0" />
      {isLoading && (
        <LoadingOverlay progress={loadingProgress} message={loadingMessage} />
      )}
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400 bg-black/20 px-2 py-1 rounded">
        3DLOGO.IO
      </div>
    </div>
  );
}

function RightPanel() {
  const { updateAnimation, updateBevelParams } = useEditorActions();
  const animation = useAnimation();
  const bevelParams = useBevelParams();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleAnimationChange = (
    type: "none" | "rotate" | "bounce" | "float" | "pulse"
  ) => {
    updateAnimation({
      type,
      enabled: type !== "none",
      speed: 1,
    });
  };

  const handleThicknessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    updateBevelParams({ extrusionDepth: value });
  };

  return (
    <>
      <div className="p-2 space-y-2.5">
        {/* Material Picker */}
        <MaterialPickerSimple />

        {/* Thickness Control */}
        <div className="space-y-1">
          <h3 className="text-xs font-medium text-gray-900 dark:text-white flex items-center gap-1">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Thickness"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Thickness
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded p-1.5 space-y-1">
            <input
              type="range"
              min="5"
              max="100"
              value={bevelParams.extrusionDepth}
              onChange={handleThicknessChange}
              className="w-full h-1.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full appearance-none cursor-pointer"
              aria-label="Logo thickness"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-600 dark:text-gray-400">
                Depth
              </span>
              <span className="text-[10px] font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-600 px-1.5 py-0.5 rounded shadow-sm">
                {bevelParams.extrusionDepth}mm
              </span>
            </div>
          </div>
        </div>

        {/* Background Color Picker */}
        <BackgroundColorPicker />

        {/* Environment Controls */}
        <EnvironmentControls />

        {/* Animation Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              <svg
                className="w-3 h-3 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Animation"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Animation
            </h3>
            <span className="bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded font-medium">
              Pro
            </span>
          </div>

          <div className="flex gap-1">
            {(["none", "rotate", "bounce", "float", "pulse"] as const).map(
              (animType) => (
                <button
                  key={animType}
                  type="button"
                  onClick={() => handleAnimationChange(animType)}
                  className={`flex-1 py-1 rounded text-center cursor-pointer transition-all duration-200 ${
                    animation.type === animType
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  <div
                    className={`text-[10px] ${
                      animation.type === animType
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {animType === "none"
                      ? "Off"
                      : animType.charAt(0).toUpperCase() + animType.slice(1, 4)}
                  </div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
            <svg
              className="w-3 h-3 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Export"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export
          </h3>
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="w-full px-2 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded text-[11px] transition-all duration-200 flex items-center justify-center gap-1 font-medium shadow-md hover:shadow-lg"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Download"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            <span>Export Logo</span>
          </button>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center">
            GLTF • STL • PNG • JPG
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
    <>
      <EditorLayout
        leftPanel={<LeftPanel />}
        centerCanvas={<CenterCanvas />}
        rightPanel={<RightPanel />}
      />
      <EditorSeoPage />
    </>
  );
}
