'use client';

interface LoadingOverlayProps {
  progress: number;
  message: string;
}

export default function LoadingOverlay({ progress, message }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-opacity duration-300">
      <div className="max-w-sm w-full px-8">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl animate-pulse shadow-2xl"></div>
              <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  3D
                </span>
              </div>
            </div>
          </div>

          {/* Loading message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3DLOGO.IO
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              {progress}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}