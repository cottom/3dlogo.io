import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Convert 2D Images to 3D - Complete Guide | 3DLogo.io',
  description: 'Step-by-step tutorials on converting 2D images to 3D models. Best practices, tool comparisons, and expert tips.',
  keywords: 'how to turn an image into a 3d model, how to make a 3d image from a 2d image, 2d to 3d conversion guide',
}

export default function TwoDToThreeDConversionGuidePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">How to Convert 2D Images to 3D</h1>
      <p className="text-lg text-gray-600 mb-8">
        Master the art of converting 2D images into stunning 3D models
      </p>
      {/* Guide content will go here */}
    </main>
  )
}