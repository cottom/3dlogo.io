'use client';

import Script from 'next/script';
import { ReactNode, useState, useEffect } from 'react';

interface EditorLayoutProps {
  leftPanel: ReactNode;
  centerCanvas: ReactNode;
  rightPanel: ReactNode;
}

export default function EditorLayout({ leftPanel, centerCanvas, rightPanel }: EditorLayoutProps) {
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'tools' | 'properties' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
        setActivePanel(null);
      } else {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobilePanel = (panel: 'tools' | 'properties') => {
    if (isMobile) {
      if (activePanel === panel) {
        setActivePanel(null);
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      } else {
        setActivePanel(panel);
        setLeftPanelOpen(panel === 'tools');
        setRightPanelOpen(panel === 'properties');
      }
    }
  };

  return (
    <div className="h-screen relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <Script src='/potrace.js' strategy="afterInteractive"  />
      
      {/* Center Canvas - 3D Viewport (Full Screen) */}
      <div className="absolute inset-0 flex flex-col">
        <div className={`flex-1 bg-gradient-to-br relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          {centerCanvas}
        </div>
        
        {/* Bottom Controls - Mobile Responsive */}
        <div className={`${isMobile ? 'h-20' : 'h-14'} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-700/50 shadow-lg relative z-10`}>
          {isMobile ? (
            // Mobile Bottom Bar
            <div className="h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center gap-2 px-4">
                <button
                  type="button"
                  onClick={() => toggleMobilePanel('tools')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs transition-all ${
                    activePanel === 'tools' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload
                </button>
                
                <button
                  type="button"
                  onClick={() => toggleMobilePanel('properties')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium text-xs transition-all ${
                    activePanel === 'properties' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Properties
                </button>
              </div>
              <div className="text-[10px] text-center text-gray-500 dark:text-gray-400 pb-1">
                Tap • Drag • Pinch to zoom
              </div>
            </div>
          ) : (
            // Desktop Bottom Bar
            <div className="h-full flex items-center justify-between px-6">
              <div className="flex items-center space-x-4">
                <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                  Drag to rotate • Scroll to zoom
                </div>
              </div>
              <div className="flex items-center space-x-3">
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Left Floating Panel - Tools and Upload */}
      <div className={`absolute ${isMobile ? 'inset-x-0 bottom-20 top-0' : 'left-0 top-0 bottom-14'} transition-transform duration-300 z-20 ${leftPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex">
          <div className={`${isMobile ? 'w-full' : 'w-72'} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm ${isMobile ? '' : 'border-r'} border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-2xl`}>
            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">Tools</h2>
              <button
                type="button"
                onClick={() => isMobile ? toggleMobilePanel('tools') : setLeftPanelOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Close left panel"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {leftPanel}
            </div>
          </div>
          {/* Left Panel Toggle Button - Desktop Only */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              className={`absolute top-4 -right-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-r-lg px-2 py-4 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${leftPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              aria-label="Open left panel"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right Floating Panel - Properties and Materials */}
      <div className={`absolute ${isMobile ? 'inset-x-0 bottom-20 top-0' : 'right-0 top-0 bottom-14'} transition-transform duration-300 z-20 ${rightPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex">
          {/* Right Panel Toggle Button - Desktop Only */}
          {!isMobile && (
            <button
              type="button"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              className={`absolute top-4 -left-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-l-lg px-2 py-4 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 ${rightPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              aria-label="Open right panel"
            >
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className={`${isMobile ? 'w-full' : 'w-64'} bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm ${isMobile ? '' : 'border-l'} border-gray-200/50 dark:border-gray-700/50 flex flex-col shadow-2xl`}>
            <div className="px-3 py-2 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">Properties</h2>
              <button
                type="button"
                onClick={() => isMobile ? toggleMobilePanel('properties') : setRightPanelOpen(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                aria-label="Close right panel"
              >
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .05) 25%, rgba(0, 0, 0, .05) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .05) 75%, rgba(0, 0, 0, .05) 76%, transparent 77%, transparent);
          background-size: 50px 50px;
        }
      `}</style>
    </div>
  );
}