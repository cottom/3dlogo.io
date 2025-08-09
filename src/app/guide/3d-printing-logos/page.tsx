import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D Printing Your Logo Guide - Preparation & Services | 3DLogo.io',
  description: 'Complete guide to 3D printing logos. File preparation, format requirements, and recommended printing services.',
  keywords: '3d printing logo, 3d printing company logo, logo to stl, 3d print logo guide',
}

export default function ThreeDPrintingLogosGuidePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">3D Printing Your Logo Guide</h1>
      <p className="text-lg text-gray-600 mb-8">
        Everything you need to know about preparing and printing your 3D logo
      </p>
      {/* Guide content will go here */}
    </main>
  )
}