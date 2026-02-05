'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Image from 'next/image';

export default function AbigailPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslation();

    const getLocalizedPath = (path: string) => `/${locale}${path}`;

    return (
        <div className="min-h-screen bg-charcoal relative overflow-hidden">
            {/* Navigation */}
            <nav className="relative z-10 container mx-auto px-4 py-6 flex justify-between">
                <Link
                    href={getLocalizedPath('/')}
                    className="text-bone-white/70 hover:text-bone-white transition-colors text-sm md:text-base"
                >
                    ← {t('nav.home')}
                </Link>
            </nav>

            <div className="relative z-10 container mx-auto px-4 py-16">
                {/* Split-screen layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left: Portrait */}
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 border border-bone-white/20 rounded-lg overflow-hidden">
                            <Image
                                src="/abigail_logo.png"
                                alt="Abigail"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    {/* Right: Bio Text */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-5xl md:text-6xl font-serif mb-6 text-bone-white">
                            {t('hero.title')}
                        </h1>
                        <div className="space-y-4 text-lg leading-relaxed text-bone-white/90">
                            <p>Abigail is a skilled reader of the ancient Gypsy cards, bringing decades of experience and spiritual insight to each reading.</p>
                            <p>With deep knowledge of the traditional meanings and modern interpretations, she provides guidance that connects the past with the present.</p>
                            <p>Her readings combine intuition, tradition, and personal connection to help you find clarity on your path forward.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

