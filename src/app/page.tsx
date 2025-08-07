import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Free 3D Logo Maker | Create Professional 3D Logos Online - 3DLogo.io',
  description: 'Create stunning 3D logos instantly with our free online logo maker. Choose from premium materials like chrome, gold, and cosmic gradients. Real-time preview, professional export options, and no design skills required. Start creating your 3D logo now!',
  keywords: '3D logo maker, online logo creator, free logo design, 3D logo generator, professional logos, chrome logos, gold logos, animated logos, logo export, business branding, logo design tool, 3D text maker, custom logos',
  authors: [{ name: '3DLogo.io' }],
  creator: '3DLogo.io',
  publisher: '3DLogo.io',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://3dlogo.io',
  },
  openGraph: {
    title: 'Free 3D Logo Maker | Create Professional 3D Logos Online',
    description: 'Transform your ideas into stunning 3D logos with premium materials, real-time preview, and professional export options. No design skills needed!',
    url: 'https://3dlogo.io',
    siteName: '3DLogo.io',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&auto=format',
        width: 1200,
        height: 630,
        alt: '3DLogo.io - Professional 3D Logo Creator',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free 3D Logo Maker | Create Professional 3D Logos Online',
    description: 'Transform your ideas into stunning 3D logos with premium materials and real-time preview. Start creating now!',
    site: '@3DLogoIO',
    creator: '@3DLogoIO',
    images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=630&fit=crop&auto=format'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: 'verification-code-here',
    yandex: 'verification-code-here',
  },
  category: 'technology',
};

export default function Home() {
  return (
    <>
      <StructuredData type="WebApplication" />
      <StructuredData type="Organization" />
      <StructuredData type="FAQPage" />
      <StructuredData type="HowTo" />
      <StructuredData type="BreadcrumbList" />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-blue-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <h1 id="hero-heading" className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Create Stunning{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                3D Logos
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Transform your ideas into professional 3D logos with our powerful online editor. 
              Choose from premium materials, add animations, and export in high quality.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/editor"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                aria-label="Start creating your 3D logo - Open free editor"
                title="Create 3D Logo - Free Online Editor"
              >
                Start Creating Free
              </Link>
              {/* <button 
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold text-lg transition-colors"
                aria-label="Watch demo video"
              >
                Watch Demo →
              </button> */}
            </div>
          </div>

          {/* 3D Preview Area */}
          <div className="mt-16 relative">
            <div className="mx-auto max-w-4xl">
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl min-h-[400px] overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Placeholder 3D effect image */}
                <Image
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=600&fit=crop&auto=format"
                  alt="Interactive 3D logo creator preview showing real-time editing capabilities"
                  fill
                  className="object-cover opacity-30"
                  priority
                />
                <div className="relative z-10 p-8 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                      <span className="text-white font-bold text-3xl">3D</span>
                    </div>
                    <p className="text-gray-900 dark:text-white text-xl font-semibold mb-2">
                      Interactive 3D Preview
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Upload your logo or start from scratch
                    </p>
                    <Link
                      href="/editor"
                      className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      title="Try the live 3D logo editor"
                    >
                      Try Live Editor →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Choose 3DLogo.io?
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Professional 3D logo creation made simple
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold">🎨</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Premium Materials
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose from chrome, gold, cosmic gradients, and more professional materials
              </p>
            </article>
            
            <article className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-green-600 dark:text-green-400 font-bold">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your changes instantly with our high-performance 3D renderer
              </p>
            </article>
            
            <article className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-purple-600 dark:text-purple-400 font-bold">📤</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Export Options
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Download high-resolution images, animations, and 3D models
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 id="how-it-works-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Create your professional 3D logo in just 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-16 h-16 mb-4">
                  <Image
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=100&h=100&fit=crop&auto=format"
                    alt="Step 1: Upload your logo or create from text"
                    fill
                    className="rounded-full object-cover opacity-20"
                    loading="lazy"
                  />
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Your Logo
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Start with your existing logo or create one from text
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Materials
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Select from premium materials and stunning effects
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Customize Design
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Adjust depth, lighting, colors, and animations
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg mb-4">
                  4
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Export & Download
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get your logo in high-res images, videos, or 3D models
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800" aria-labelledby="showcase-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="showcase-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Logo Showcase
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore stunning 3D logos created with our platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { material: 'Chrome', gradient: 'from-gray-300 to-gray-500', image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop&auto=format' },
              { material: 'Gold', gradient: 'from-yellow-400 to-yellow-600', image: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=400&fit=crop&auto=format' },
              { material: 'Cosmic', gradient: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=400&h=400&fit=crop&auto=format' },
              { material: 'Glass', gradient: 'from-blue-300 to-blue-500', image: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=400&fit=crop&auto=format' },
              { material: 'Neon', gradient: 'from-green-400 to-cyan-500', image: 'https://images.unsplash.com/photo-1621266876144-06cca6a58e15?w=400&h=400&fit=crop&auto=format' },
              { material: 'Holographic', gradient: 'from-pink-400 to-purple-600', image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop&auto=format' },
              { material: 'Metal', gradient: 'from-slate-400 to-slate-600', image: 'https://images.unsplash.com/photo-1606318801954-d46d46d3360a?w=400&h=400&fit=crop&auto=format' },
              { material: 'Rainbow', gradient: 'from-red-500 via-yellow-500 to-blue-500', image: 'https://images.unsplash.com/photo-1525909002-1b05e0c869d8?w=400&h=400&fit=crop&auto=format' },
            ].map((item) => (
              <div key={item.material} className="group cursor-pointer">
                <div className={`relative aspect-square rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden`}>
                  <Image
                    src={item.image}
                    alt={`${item.material} style 3D logo example showcasing premium material effects and professional design`}
                    fill
                    className="object-cover mix-blend-overlay opacity-50"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl drop-shadow-2xl">LOGO</span>
                  </div>
                </div>
                <p className="text-center mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.material} Style
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/editor"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              title="Create your own 3D logo with custom materials"
            >
              Create Your Own
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join thousands of satisfied creators worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex mb-4" role="img" aria-label="5 out of 5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-sarah-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;Amazing tool! Created a professional logo for my startup in minutes. The chrome effect looks incredible.&quot;
              </p>
              <div className="flex items-center">
                <Image
                  src="https://i.pravatar.cc/150?img=1"
                  alt="Sarah Chen - Tech Startup Founder testimonial"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Chen</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tech Startup Founder</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex mb-4" role="img" aria-label="5 out of 5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-mike-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;The best free 3D logo maker I&#39;ve found. Export quality is excellent and the animation options are fantastic!&quot;
              </p>
              <div className="flex items-center">
                <Image
                  src="https://i.pravatar.cc/150?img=3"
                  alt="Mike Rodriguez - Creative Director testimonial"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Creative Director</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex mb-4" role="img" aria-label="5 out of 5 stars rating">
                {[...Array(5)].map((_, i) => (
                  <svg key={`star-emma-${i}`} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;So easy to use! No design experience needed. Created multiple variations for my brand in no time.&quot;
              </p>
              <div className="flex items-center">
                <Image
                  src="https://i.pravatar.cc/150?img=5"
                  alt="Emma Thompson - E-commerce Owner testimonial"
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Emma Thompson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">E-commerce Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900" aria-labelledby="pricing-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="pricing-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to create professional 3D logos
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Free Forever</h3>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">$0</span>
                  <span className="text-white/80 ml-2">/month</span>
                </div>
              </div>
              
              <div className="p-8">
                <ul className="space-y-4">
                  {[
                    'Unlimited 3D logo creation',
                    'All premium materials and effects',
                    'Real-time 3D preview',
                    'High-resolution PNG export (up to 4K)',
                    'Animated GIF export',
                    'MP4 video export',
                    'GLB 3D model export',
                    'No watermarks',
                    'Commercial usage rights',
                    'No sign-up required',
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link
                    href="/editor"
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                    title="Start creating your free 3D logo now"
                  >
                    Start Creating Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900" aria-labelledby="faq-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: 'Is 3DLogo.io really free?',
                answer: 'Yes! 3DLogo.io is completely free to use. There are no hidden costs, subscriptions, or premium features. You can create unlimited logos with all materials and export them without watermarks.',
              },
              {
                question: 'What file formats can I export?',
                answer: 'You can export your 3D logos as PNG images (up to 4K resolution), animated GIFs, MP4 videos, and GLB 3D models for use in other 3D applications.',
              },
              {
                question: 'Can I use the logos commercially?',
                answer: 'Absolutely! All logos created with 3DLogo.io come with full commercial usage rights. Use them for your business, clients, or any commercial project without restrictions.',
              },
              {
                question: 'Do I need to sign up or create an account?',
                answer: 'No sign-up required! You can start creating 3D logos immediately without creating an account or providing any personal information.',
              },
              {
                question: 'What browsers are supported?',
                answer: '3DLogo.io works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.',
              },
              {
                question: 'Can I edit my logo after exporting?',
                answer: 'While exported files cannot be re-imported for editing, you can always recreate and modify your logo design as many times as you want using our editor.',
              },
            ].map((item) => (
              <div key={item.question} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2 className="text-2xl font-bold mb-6">Create Professional 3D Logos in Minutes</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              3DLogo.io is the ultimate free online 3D logo maker that empowers businesses, designers, and creators to craft stunning three-dimensional logos without any design experience. Our intuitive web-based platform transforms flat designs into eye-catching 3D masterpieces using advanced WebGL technology.
            </p>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Why Choose Our 3D Logo Creator?</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>100% Free:</strong> No hidden costs, subscriptions, or watermarks</li>
              <li><strong>Premium Materials:</strong> Access chrome, gold, glass, neon, and cosmic gradient effects</li>
              <li><strong>Real-time 3D Preview:</strong> See changes instantly as you customize</li>
              <li><strong>Professional Export:</strong> Download in PNG, GIF, MP4, or GLB formats</li>
              <li><strong>No Software Installation:</strong> Works directly in your browser</li>
              <li><strong>Commercial Use:</strong> Full rights to use your logos anywhere</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-8 mb-4">Perfect for Every Industry</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Whether you&#39;re launching a tech startup, running an e-commerce store, managing a creative agency, or building a gaming brand, our 3D logo maker delivers professional results that elevate your brand identity. Join thousands of satisfied users who&#39;ve transformed their business presence with stunning 3D logos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Your 3D Logo?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators using 3DLogo.io to design professional logos
          </p>
          <Link
            href="/editor"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors shadow-xl"
            aria-label="Start creating your free 3D logo now"
            title="Begin creating your professional 3D logo for free"
          >
            Start Creating - It&#39;s Free!
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}
