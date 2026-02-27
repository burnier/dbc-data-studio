import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DBC Data Studio',
  description: 'Independent digital products by DBC Data Studio.',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
