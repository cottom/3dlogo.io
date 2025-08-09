import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image to 3D Model Converter - Photo to 3D Online | 3DLogo.io',
  description: 'Convert any image or photo to 3D model instantly. Support for PNG, JPG, and other formats with STL export and real-time preview.',
  keywords: '2d image to 3d model, photo to 3d model, picture to 3d model converter, png to 3d model',
}

export default function ImageTo3DModelPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Image to 3D Model Converter</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert photos and images into 3D models with support for multiple formats
      </p>
      {/* Tool implementation will go here */}
    </main>
  )
}