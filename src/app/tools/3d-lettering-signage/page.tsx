import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Lettering Sign Maker - Business Signage Creator | 3DLogo.io',
  description: 'Design professional 3D lettering and signage for your business. Templates and material selection included.',
  keywords: '3d lettering signage, 3d letter signs, 3d sign maker',
}

export default function ThreeDLetteringSignagePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D Lettering & Signage Maker</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create professional 3D lettering and signs for your business
      </p>
      {/* Tool implementation will go here */}
    </main>
  )
}