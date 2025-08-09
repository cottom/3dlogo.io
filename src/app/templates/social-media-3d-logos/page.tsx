import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Social Media 3D Logos - Templates & Guidelines | 3DLogo.io',
  description: 'Professional 3D logo templates for social media platforms. Brand-compliant designs for YouTube, Instagram, Facebook, and more.',
  keywords: 'social media 3d logos, youtube 3d logo, instagram 3d logo, facebook 3d logo',
}

export default function SocialMedia3DLogosPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Social Media 3D Logos</h1>
      <p className="text-lg text-gray-600 mb-8">
        Professional 3D logo templates for all major social media platforms
      </p>
      {/* Template gallery will go here */}
    </main>
  )
}