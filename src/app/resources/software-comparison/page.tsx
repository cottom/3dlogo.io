import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Software Comparison - Tools, Workflows & Integration | 3DLogo.io',
  description: 'Compare 3D design software and tools. Find the best solution for your logo design workflow.',
  keywords: '3d software comparison, 3d design tools, 3d logo software, best 3d software',
}

export default function SoftwareComparisonPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D Software Comparison</h1>
      <p className="text-lg text-gray-600 mb-8">
        Compare tools and find the best 3D software for your needs
      </p>
      {/* Software comparison content will go here */}
    </main>
  )
}