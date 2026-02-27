import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'DBC Data Studio - AI Career & Education Hub',
    description: 'Compare top learning paths for data engineering and AI careers. Coursera, DataQuest, and Pluralsight certifications compared.',
    keywords: 'data engineering, AI career, data science certification, Coursera, DataQuest, Pluralsight, MLOps, data engineering courses',
    openGraph: {
        title: 'DBC Data Studio - AI Career & Education Hub',
        description: 'Launch your data engineering & AI career with top certification programs',
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

