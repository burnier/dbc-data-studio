import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Data Modeler - commercetools Schema Generator',
  description: 'Transform your raw product data into commercetools-ready schemas with AI-powered mapping. Free utility for Solution Architects and Developers.',
  keywords: 'commercetools, schema generator, product data, data transformation, commercetools import',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

