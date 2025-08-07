'use client';

import { useState } from 'react';
import EditorLayout from '@/components/layout/EditorLayout';
import Scene from '@/components/canvas/Scene';
import ImageUpload from '@/components/upload/ImageUpload';
import MaterialPickerSimple from '@/components/materials/MaterialPickerSimple';
import ExportModal from '@/components/export/ExportModal';
import { useEditorActions, useBevelParams, useAnimation, useUploadState } from '@/store/editorStore';
import { ConversionResult } from '@/utils/svgConversion';

export default function EditorDebugPage() {
  const [count, setCount] = useState(0);
  const { updateBevelParams } = useEditorActions();
  const bevelParams = useBevelParams();
  const uploadState = useUploadState();
  
  return (
    <EditorLayout
      leftPanel={
        <div className="p-4">
          <h3>Left Panel</h3>
          <p>Count: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Increment
          </button>
          {uploadState.lastUploadResult && (
            <div className="mt-4 p-2 bg-green-100 rounded">
              <p>Paths: {uploadState.lastUploadResult.pathCount}</p>
              <p>Colors: {uploadState.lastUploadResult.colors?.length || 0}</p>
            </div>
          )}
        </div>
      }
      centerCanvas={
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl">Canvas Area</h1>
        </div>
      }
      rightPanel={
        <div className="p-4">
          <h3>Right Panel</h3>
        </div>
      }
    />
  );
}