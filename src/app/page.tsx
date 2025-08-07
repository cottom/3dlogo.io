import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Create Stunning{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3D Logos
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your ideas into professional 3D logos with our powerful online editor. 
              Choose from premium materials, add animations, and export in high quality.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/editor"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Creating
              </Link>
              <button className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-lg transition-colors">
                Watch Demo →
              </button>
            </div>
          </div>

          {/* 3D Preview Area */}
          <div className="mt-16 relative">
            <div className="mx-auto max-w-4xl">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-2xl min-h-[400px] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <span className="text-white font-bold text-2xl">3D</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Interactive 3D preview will appear here
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                    Upload your logo or start from scratch
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose 3DLogo.io?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Professional 3D logo creation made simple
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Materials
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from chrome, gold, cosmic gradients, and more professional materials
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 dark:text-green-400 font-bold">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your changes instantly with our high-performance 3D renderer
              </p>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-purple-600 dark:text-purple-400 font-bold">📤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Export Options
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download high-resolution images, animations, and 3D models
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
