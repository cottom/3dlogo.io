import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Logo Effects Gallery - Inspiration & Examples | 3DLogo.io',
  description: 'Browse our gallery of stunning 3D logo effects. Chrome effects, cool 3D text, and creative design inspiration.',
  keywords: '3d effect pictures, chrome logo 3d, cool 3d text, 3d logo gallery',
}

export default function ThreeDEffectsGalleryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D Effects Gallery</h1>
      <p className="text-lg text-gray-600 mb-8">
        Explore stunning 3D effects and get inspired for your next design
      </p>
      {/* Gallery grid will go here */}
    </main>
  )
}