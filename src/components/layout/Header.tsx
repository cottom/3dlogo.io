'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">3D</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                3DLogo.io
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/editor"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/editor'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Editor
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {pathname !== '/editor' && (
              <Link
                href="/editor"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Creating
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}