'use client';

import Script from 'next/script';
import { ReactNode } from 'react';

interface EditorLayoutProps {
  leftPanel: ReactNode;
  centerCanvas: ReactNode;
  rightPanel: ReactNode;
}

export default function EditorLayout({ leftPanel, centerCanvas, rightPanel }: EditorLayoutProps) {
  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 pt-16">
      <Script src='/potrace.js' strategy="beforeInteractive"  />
      {/* Left Sidebar - Tools and Upload */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tools</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {leftPanel}
        </div>
      </div>

      {/* Center Canvas - 3D Viewport */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative">
          {centerCanvas}
        </div>
        
        {/* Bottom Controls */}
        <div className="h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Reset View
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Click and drag to rotate • Scroll to zoom
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Properties and Materials */}
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {rightPanel}
        </div>
      </div>
    </div>
  );
}