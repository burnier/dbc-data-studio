import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculadora de Lucro Shopee e Mercado Livre 2026 | Taxas Atualizadas Março 2026',
  description: 'Calculadora gratuita de lucro para vendedores brasileiros. Calcule taxas Shopee 2026 (20%), Mercado Livre Clássico/Premium e Pix. Simulador de lucro marketplace com taxas atualizadas de Março 2026. Ideal para MEI e Simples Nacional.',
  icons: {
    icon: '/dbc-calculadora.jpg',
    shortcut: '/dbc-calculadora.jpg',
    apple: '/dbc-calculadora.jpg',
  },
  keywords: [
    'calculadora de lucro shopee 2026',
    'taxas mercado livre 2026',
    'simulador de lucro marketplace',
    'calculadora de taxas pix cnpj',
    'calculadora shopee',
    'calculadora mercado livre',
    'taxa shopee março 2026',
    'comissão mercado livre 2026',
    'lucro líquido marketplace',
    'calculadora mei',
    'simples nacional marketplace',
    'vendedor online brasil',
    'e-commerce taxas brasil',
    'calculadora frete grátis shopee',
    'mercado livre premium taxas'
  ],
  authors: [{ name: 'DBC Data Studio' }],
  creator: 'DBC Data Studio',
  publisher: 'DBC Data Studio',
  openGraph: {
    title: 'Calculadora de Lucro Shopee e Mercado Livre 2026 - Atualizada Março 2026',
    description: 'Calcule seu lucro real em vendas online com taxas atualizadas de Março 2026. Shopee, Mercado Livre e Pix.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Calculadora de Lucro DBC',
    images: [
      {
        url: '/dbc-calculadora.jpg',
        width: 1200,
        height: 1200,
        alt: 'Calculadora de Lucro DBC - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Lucro Shopee e Mercado Livre 2026',
    description: 'Calcule seu lucro real com taxas atualizadas de Março 2026',
  },
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
  verification: {
    google: 'seu-codigo-google-search-console',
  },
  alternates: {
    canonical: 'https://calculadora.dbcdatastudio.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Calculadora de Lucro Shopee e Mercado Livre 2026',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Windows, macOS, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
    },
    description: 'Calculadora gratuita de lucro para vendedores brasileiros de marketplaces. Calcula taxas do Shopee, Mercado Livre e Pix com as regras atualizadas de 2026.',
    screenshot: 'https://calculadora.dbcdatastudio.com/og-image.png',
    featureList: [
      'Cálculo de taxas Shopee 2026',
      'Taxas Mercado Livre Clássico e Premium',
      'Simulação de vendas por Pix',
      'Cálculo de impostos MEI e Simples Nacional',
      'Ponto de equilíbrio',
      'Margem de lucro',
      'Exportar para WhatsApp'
    ],
    inLanguage: 'pt-BR',
    author: {
      '@type': 'Organization',
      name: 'DBC Data Studio',
      url: 'https://dbcdatastudio.com',
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9Z0V6P2G49"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9Z0V6P2G49');
          `}
        </Script>

        {/* Structured Data for SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

