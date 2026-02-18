import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculadora de Lucro Shopee e Mercado Livre 2026 | Calcule seu Lucro Real',
  description: 'Calculadora gratuita de lucro para vendedores do Shopee, Mercado Livre e Pix. Calcule taxas, comissões e seu lucro líquido real com as regras atualizadas de 2026. Ideal para MEI e Simples Nacional.',
  keywords: [
    'calculadora de lucro',
    'shopee',
    'mercado livre',
    'calculadora shopee',
    'calculadora mercado livre',
    'taxa shopee 2026',
    'taxa mercado livre 2026',
    'lucro marketplace',
    'MEI',
    'simples nacional',
    'vendedor online',
    'e-commerce brasil'
  ],
  authors: [{ name: 'DBC Data Studio' }],
  openGraph: {
    title: 'Calculadora de Lucro Shopee e Mercado Livre 2026',
    description: 'Calcule seu lucro real em vendas online com taxas atualizadas de 2026',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'seu-codigo-google-search-console',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

