import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://3dlogo.io';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/editor-test/',
          '/test-minimal/',
          '/editor-debug/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}