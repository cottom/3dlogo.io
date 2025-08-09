import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free 3D Logo Maker - Create Stunning Logos Online | 3DLogo.io',
  description: 'Create professional 3D logos for free with our online logo maker. No design skills required. Instant results.',
  keywords: '3d logo maker free, free 3d logo generator, online 3d logo maker, 3d logo creator free',
}

export default function Free3DLogoMakerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Free 3D Logo Maker</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create professional 3D logos instantly - 100% free
      </p>
      {/* Landing page content and CTA will go here */}
    </main>
  )
}