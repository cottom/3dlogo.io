import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Text Generator - Free 3D Font Maker Online | 3DLogo.io',
  description: 'Create stunning 3D text with our free generator. Custom fonts, material presets, and animation options. Generate 3D text instantly.',
  keywords: '3d font generator, 3d text maker, 3d font maker, generate 3d text, 3d text generator online',
}

export default function ThreeDTextGeneratorPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D Text Generator</h1>
      <p className="text-lg text-gray-600 mb-8">
        Create stunning 3D text with custom fonts and materials
      </p>
      {/* Tool implementation will go here */}
    </main>
  )
}