import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instagram 3D Logo Templates - Profile & Story Designs | 3DLogo.io',
  description: 'Design eye-catching 3D Instagram logos. Templates optimized for profile pictures and story highlights.',
  keywords: 'instagram 3d logo, instagram logo 3d design, instagram profile logo 3d',
}

export default function Instagram3DLogoPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Instagram 3D Logo Templates</h1>
      <p className="text-lg text-gray-600 mb-8">
        Eye-catching 3D logos for Instagram profiles and stories
      </p>
      {/* Instagram logo templates will go here */}
    </main>
  )
}