'use client';

import { use } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { CARDS } from '../../../constants/cardMeanings';
import Link from 'next/link';

export default function CardsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = use(params);
    const { t, i18n } = useTranslation();
    const currentLanguage = locale || i18n.language || 'en';

    const getCardName = (card: typeof CARDS[0]): string => {
        if (!card || !card.nameKey) {
            return `Card ${card.id + 1}`;
        }
        const translationKey = `cards.${card.nameKey}`;
        const lang = locale || currentLanguage || 'en';

        try {
            const resources = i18n.getResourceBundle(lang, 'translation');
            if (resources && typeof resources === 'object') {
                const cardsObj = (resources as any).cards;
                if (cardsObj && typeof cardsObj === 'object' && card.nameKey in cardsObj) {
                    const translation = cardsObj[card.nameKey];
                    if (translation && typeof translation === 'string' && translation !== translationKey && !translation.startsWith('cards.')) {
                        return translation;
                    }
                }
            }
        } catch (e) {
            console.warn('Failed to get translation from resources for', card.nameKey, e);
        }
        let translated = t(translationKey);
        if (!translated || translated === translationKey || translated.startsWith('cards.')) {
            translated = card.nameKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
        }
        return translated;
    };

    const getCardImage = (cardId: number): string => {
        const card = CARDS.find(c => c.id === cardId);
        if (!card) return '/cards/beständigkeit.jpg';

        // Map card name keys to image filenames
        const imageMap: Record<string, string> = {
            'constancy': 'beständigkeit.jpg',
            'visit': 'besuch.jpg',
            'message': 'botschaft.jpg',
            'letter': 'brief.jpg',
            'thief': 'dieb.jpg',
            'jealousy': 'eifersucht.jpg',
            'someMoney': 'etwas geld.jpg',
            'falsehood': 'falschheit.jpg',
            'enemy': 'feind.jpg',
            'joy': 'fröhlichkeit.jpg',
            'thought': 'Gedanke.jpg',
            'priest': 'geistlicher.jpg',
            'money': 'geld.jpg',
            'beloved': 'geliebte.jpg',
            'gift': 'geschenk.jpg',
            'fortune': 'glück.jpg',
            'house': 'haus.jpg',
            'marriage': 'heirat.jpg',
            'hope': 'hoffnung.jpg',
            'child': 'kind.jpg',
            'illness': 'krankheit.jpg',
            'love': 'liebe.jpg',
            'officer': 'offizier.jpg',
            'journey': 'reise.jpg',
            'judge': 'richter.jpg',
            'longing': 'sehnsucht.jpg',
            'death': 'tod.jpg',
            'sadness': 'traurigkeit.jpg',
            'fidelity': 'treue.jpg',
            'misfortune': 'unglück.jpg',
            'unexpectedJoy': 'unverhoffte freude.jpg',
            'annoyance': 'verdruss.jpg',
            'loss': 'verlust.jpg',
            'widow': 'witwe.jpg',
            'widower': 'witwer.jpg',
        };

        return `/cards/${imageMap[card.nameKey] || 'beständigkeit.jpg'}`;
    };

    return (
        <div className="min-h-screen bg-charcoal py-20">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <Link
                        href={`/${locale}`}
                        className="text-bone-white/70 hover:text-bone-white transition-colors text-sm md:text-base inline-block mb-4"
                    >
                        ← {t('nav.home')}
                    </Link>
                    <h1 className="text-5xl font-serif text-bone-white mb-4">{t('nav.cards')}</h1>
                    <p className="text-lg text-bone-white/70">All 36 cards of the Gypsy Oracle deck</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {CARDS.map((card) => (
                        <div
                            key={card.id}
                            className="bg-gray-900/50 border border-bone-white/20 rounded-lg overflow-hidden hover:border-purple-dark transition-colors"
                        >
                            <div className="relative aspect-[2/3]">
                                <Image
                                    src={getCardImage(card.id)}
                                    alt={getCardName(card)}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                                />
                            </div>
                            <div className="p-4 text-center">
                                <h3 className="font-serif text-lg mb-2">{getCardName(card)}</h3>
                                <p className="text-sm text-bone-white/60">
                                    {card.shortMeaning[currentLanguage as keyof typeof card.shortMeaning] || card.shortMeaning.en}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


