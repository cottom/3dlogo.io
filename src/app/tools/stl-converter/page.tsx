import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'STL File Converter - Text to STL Online | 3DLogo.io',
  description: 'Convert files to STL format for 3D printing. Support for multiple formats with optimization options.',
  keywords: 'stl converter, stl file converter, text to stl, logo to stl',
}

export default function STLConverterPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">STL File Converter</h1>
      <p className="text-lg text-gray-600 mb-8">
        Convert your designs to STL format for 3D printing
      </p>
      {/* Tool implementation will go here */}
    </main>
  )
}