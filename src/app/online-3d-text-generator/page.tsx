import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Online 3D Text Generator - Create 3D Text Free | 3DLogo.io',
  description: 'Generate stunning 3D text online for free. Instant results with custom fonts, colors, and effects.',
  keywords: '3d text generator online, online 3d text maker, free 3d text generator, 3d text online',
}

export default function Online3DTextGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Online 3D Text Generator</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create amazing 3D text effects online - free and instant
      </p>
      {/* Landing page content and CTA will go here */}
    </main>
  )
}