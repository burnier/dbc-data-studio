import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'AutoStack - AI Business Automation Tools Compared',
    description: 'Compare the best AI business automation tools: Gumloop, Make.com, and AdCreative.ai. Find the perfect solution for your workflow.',
    keywords: 'AI automation, business automation, workflow automation, Gumloop, Make.com, AdCreative.ai',
    openGraph: {
        title: 'AutoStack - AI Business Automation Tools',
        description: 'Compare top AI business automation tools',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}

