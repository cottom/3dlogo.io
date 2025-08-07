import Head from 'next/head';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title = '3DLogo.io - Create Professional 3D Logos Online | Free Logo Maker',
  description = 'Create stunning 3D logos with our free online logo maker. Choose from premium materials like chrome, gold, and cosmic gradients. Real-time preview, professional export options, and no design skills required.',
  keywords = '3D logo maker, online logo creator, free logo design, 3D logo generator, professional logos, chrome logos, gold logos, animated logos, logo export, business branding',
  image = 'https://3dlogo.io/og-image.jpg',
  url = 'https://3dlogo.io',
  type = 'website',
  author = '3DLogo.io',
  twitterHandle = '@3DLogoIO',
  canonicalUrl,
  noindex = false,
  children
}) => {
  const fullTitle = title.includes('3DLogo.io') ? title : `${title} | 3DLogo.io`;
  
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta httpEquiv="content-language" content="en-US" />
      
      {/* Search Engine Control */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="3DLogo.io - Professional 3D Logo Creator" />
      <meta property="og:site_name" content="3DLogo.io" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content={twitterHandle} />
      <meta property="twitter:site" content={twitterHandle} />
      
      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="3DLogo.io" />
      <meta name="application-name" content="3DLogo.io" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {children}
    </Head>
  );
};

export default MetaTags;