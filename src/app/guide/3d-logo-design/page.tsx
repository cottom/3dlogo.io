import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Complete Guide to 3D Logo Design - Tips, Tools & Techniques | 3DLogo.io',
  description: 'Learn how to create professional 3D logos with our comprehensive guide. Covers design principles, software tools, and step-by-step tutorials.',
  keywords: '3d logo design, logo 3d, 3d logo tutorial, how to make 3d logo',
}

export default function ThreeDLogoDesignGuidePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Complete Guide to 3D Logo Design</h1>
      <p className="text-lg text-gray-600 mb-8">
        Everything you need to know about creating professional 3D logos
      </p>
      {/* Guide content will go here */}
    </main>
  )
}