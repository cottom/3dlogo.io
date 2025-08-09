import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Facebook 3D Logo Templates - Page & Group Branding | 3DLogo.io',
  description: 'Professional 3D Facebook logos for pages and groups. Templates following Meta brand guidelines.',
  keywords: 'facebook 3d logo, facebook page logo 3d, facebook logo design 3d',
}

export default function Facebook3DLogoPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Facebook 3D Logo Templates</h1>
      <p className="text-lg text-gray-600 mb-8">
        Professional 3D logos for Facebook pages and groups
      </p>
      {/* Facebook logo templates will go here */}
    </main>
  )
}