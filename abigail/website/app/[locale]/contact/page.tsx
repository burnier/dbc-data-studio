'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslation();

    const getLocalizedPath = (path: string) => `/${locale}${path}`;

    return (
        <div className="min-h-screen bg-charcoal py-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="mb-8">
                    <Link
                        href={getLocalizedPath('/')}
                        className="text-bone-white/70 hover:text-bone-white transition-colors text-sm md:text-base inline-block mb-4"
                    >
                        ← {t('nav.home')}
                    </Link>
                    <h1 className="text-5xl font-serif text-bone-white mb-4">{t('nav.contact')}</h1>
                </div>

                <div className="bg-gray-900/50 border border-bone-white/20 rounded-lg p-8 space-y-6">
                    <p className="text-lg text-bone-white/90">
                        For personal readings, questions, or inquiries, please reach out to Abigail.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-2xl font-serif mb-2 text-bone-white">Email</h2>
                            <p className="text-bone-white/70">contact@abigailoracles.com</p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-serif mb-2 text-bone-white">Personal Readings</h2>
                            <p className="text-bone-white/70 mb-4">
                                Request a full deck spread with hand-written analysis and photo of your physical card spread.
                            </p>
                            <Link
                                href={getLocalizedPath('/shop')}
                                className="inline-block px-6 py-3 bg-purple-dark hover:bg-purple-dark/80 border border-white/30 rounded-lg text-bone-white transition-all"
                            >
                                Request Full Reading
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


