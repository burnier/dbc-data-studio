'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t } = useTranslation();

    const getLocalizedPath = (path: string) => `/${locale}${path}`;

    return (
        <div className="min-h-screen bg-charcoal py-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-8">
                    <Link
                        href={getLocalizedPath('/')}
                        className="text-bone-white/70 hover:text-bone-white transition-colors text-sm md:text-base inline-block mb-4"
                    >
                        ← {t('nav.home')}
                    </Link>
                    <h1 className="text-5xl font-serif text-bone-white mb-4">{t('nav.shop')}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Deck Reading */}
                    <div className="bg-gray-900/50 border border-bone-white/20 rounded-lg p-8">
                        <h2 className="text-3xl font-serif mb-4 text-bone-white">Full Deck Reading</h2>
                        <p className="text-bone-white/70 mb-6">
                            A complete 36-card spread with professional, hand-written analysis and a high-quality photo of your unique physical card spread.
                        </p>
                        <div className="mb-6">
                            <span className="text-4xl font-serif text-bone-white">€19.90</span>
                        </div>
                        <ul className="space-y-2 mb-6 text-bone-white/80">
                            <li>• Full deck spread (36 cards)</li>
                            <li>• Hand-written analysis by Abigail</li>
                            <li>• High-quality photo of your spread</li>
                            <li>• 24/7 spiritual clarity and support</li>
                        </ul>
                        <button className="w-full px-6 py-3 bg-purple-dark hover:bg-purple-dark/80 border border-white/30 rounded-lg text-bone-white transition-all">
                            Request Full Reading
                        </button>
                    </div>

                    {/* Premium Package */}
                    <div className="bg-gray-900/50 border border-purple-dark rounded-lg p-8">
                        <div className="mb-4">
                            <span className="px-3 py-1 bg-purple-dark/30 text-purple-dark text-sm rounded-full">Popular</span>
                        </div>
                        <h2 className="text-3xl font-serif mb-4 text-bone-white">Premium Package</h2>
                        <p className="text-bone-white/70 mb-6">
                            Everything in the Full Deck Reading, plus a follow-up consultation and ongoing support.
                        </p>
                        <div className="mb-6">
                            <span className="text-4xl font-serif text-bone-white">€39.90</span>
                        </div>
                        <ul className="space-y-2 mb-6 text-bone-white/80">
                            <li>• Everything in Full Deck Reading</li>
                            <li>• Follow-up consultation</li>
                            <li>• Priority support</li>
                            <li>• Additional insights and guidance</li>
                        </ul>
                        <button className="w-full px-6 py-3 bg-purple-dark hover:bg-purple-dark/80 border border-white/30 rounded-lg text-bone-white transition-all">
                            Request Premium Package
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



