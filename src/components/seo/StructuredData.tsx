import Script from 'next/script';

interface StructuredDataProps {
  type?: 'WebApplication' | 'Organization' | 'FAQPage' | 'HowTo' | 'BreadcrumbList';
  customData?: any;
}

const StructuredData: React.FC<StructuredDataProps> = ({ type = 'WebApplication', customData }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'WebApplication':
        return {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "3DLogo.io",
          "url": "https://3dlogo.io",
          "description": "Professional 3D logo creator with real-time preview and premium materials",
          "applicationCategory": "DesignApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": [
            "3D Logo Creation",
            "Real-time Preview",
            "Premium Materials",
            "High-Resolution Export",
            "Animation Support",
            "No Design Skills Required"
          ],
          "screenshot": [
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800&h=600&fit=crop&auto=format"
          ],
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1250",
            "bestRating": "5",
            "worstRating": "1"
          }
        };
        
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "3DLogo.io",
          "url": "https://3dlogo.io",
          "logo": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop&auto=format",
          "sameAs": [
            "https://twitter.com/3DLogoIO",
            "https://facebook.com/3DLogoIO",
            "https://instagram.com/3DLogoIO"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "support@3dlogo.io",
            "availableLanguage": ["English"]
          }
        };
        
      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Is 3DLogo.io free to use?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, 3DLogo.io is completely free to use. You can create, customize, and export 3D logos without any charges."
              }
            },
            {
              "@type": "Question",
              "name": "What export formats are available?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "You can export your 3D logos as PNG images, animated GIFs, MP4 videos, and GLB 3D models."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need design skills to use 3DLogo.io?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No design skills are required. Our intuitive interface and real-time preview make it easy for anyone to create professional 3D logos."
              }
            },
            {
              "@type": "Question",
              "name": "Can I use the logos commercially?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, all logos created with 3DLogo.io can be used for commercial purposes without any restrictions."
              }
            }
          ]
        };
        
      case 'HowTo':
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Create a 3D Logo",
          "description": "Step-by-step guide to create professional 3D logos using 3DLogo.io",
          "image": "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=800&h=450&fit=crop&auto=format",
          "totalTime": "PT5M",
          "estimatedCost": {
            "@type": "MonetaryAmount",
            "currency": "USD",
            "value": "0"
          },
          "supply": [],
          "tool": [
            {
              "@type": "HowToTool",
              "name": "3DLogo.io Editor"
            }
          ],
          "step": [
            {
              "@type": "HowToStep",
              "name": "Upload or Create Logo",
              "text": "Upload your existing logo image or start with text to create a new one",
              "image": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop&auto=format"
            },
            {
              "@type": "HowToStep",
              "name": "Choose Material",
              "text": "Select from premium materials like chrome, gold, or cosmic gradients",
              "image": "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=300&fit=crop&auto=format"
            },
            {
              "@type": "HowToStep",
              "name": "Customize Settings",
              "text": "Adjust extrusion depth, lighting, and background colors",
              "image": "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=300&fit=crop&auto=format"
            },
            {
              "@type": "HowToStep",
              "name": "Export Your Logo",
              "text": "Download your 3D logo in high resolution or as an animation",
              "image": "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop&auto=format"
            }
          ]
        };
        
      case 'BreadcrumbList':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://3dlogo.io"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Editor",
              "item": "https://3dlogo.io/editor"
            }
          ]
        };
        
      default:
        return customData || {};
    }
  };

  const structuredData = getStructuredData();

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
      strategy="afterInteractive"
    />
  );
};

export default StructuredData;