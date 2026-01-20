import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free AI commercetools Schema Generator | Legacy Data Migration Tool',
  description: 'Transform legacy product data into commercetools-ready schemas in 60 seconds. Free AI-powered migration tool for composable commerce. Automated product data modeling following commercetools Foundry standards.',
  keywords: 'commercetools migration tool, legacy data migration, composable commerce, product data modeling, commercetools schema generator, free commercetools tool, AI data transformation, commercetools Foundry, product type generator',
  openGraph: {
    title: 'Smart Data Modeler - Free commercetools Schema Generator',
    description: 'Transform your raw product data into commercetools-ready schemas with AI-powered mapping. Free utility for Solution Architects and Developers.',
    type: 'website',
    url: 'https://modeler.dbcdatastudio.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Smart Data Modeler",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Free AI-powered tool to transform legacy product data into commercetools-ready schemas. Automated product data modeling following commercetools Foundry standards.",
    "url": "https://modeler.dbcdatastudio.com",
    "featureList": [
      "AI-powered schema generation",
      "CSV, JSON, XLSX file support",
      "commercetools Foundry compliance",
      "80% similarity grouping",
      "Automatic enum detection",
      "Localized string support"
    ],
    "screenshot": "https://modeler.dbcdatastudio.com/og-image.png"
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

