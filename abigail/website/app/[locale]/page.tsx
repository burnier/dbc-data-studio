'use client';

import { useState, useEffect, use } from 'react';
import { useTranslation } from 'react-i18next';
import LeadMagnetForm from '../../components/LeadMagnetForm';
import CardDraw from '../../components/CardDraw';
import ReadingResult from '../../components/ReadingResult';
import PremiumConversion from '../../components/PremiumConversion';
import { generateReading, GenerateReadingResponse } from '../../lib/api';
import { useReading } from '../../contexts/ReadingContext';

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { t, i18n } = useTranslation();
  const { setHasCompletedReading } = useReading();
  const [step, setStep] = useState<'form' | 'cards' | 'reading'>('form');
  const [formData, setFormData] = useState<{ name: string; email: string; question: string; language: string } | null>(null);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [readingData, setReadingData] = useState<GenerateReadingResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Ensure i18n language matches the route language
  useEffect(() => {
    if (locale && i18n.language !== locale && i18n.isInitialized) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  const handleFormSubmit = (data: { name: string; email: string; question: string; language: string }) => {
    setFormData(data);
    if (data.language && i18n.language !== data.language) {
      i18n.changeLanguage(data.language);
    }
    setStep('cards');
  };

  const handleCardsSelected = (cardIds: number[]) => {
    setSelectedCards(cardIds);
    if (cardIds.length === 3) {
      generateReadingForCards(cardIds);
    }
  };

  const generateReadingForCards = async (cardIds: number[]) => {
    if (!formData) return;

    setIsGenerating(true);
    setIsShuffling(true);

    try {
      const response = await generateReading({
        card_ids: cardIds,
        language: formData.language || locale || 'en',
        question: formData.question,
      });

      setReadingData(response);
      setStep('reading');
      setHasCompletedReading(true);
    } catch (error) {
      console.error('Error generating reading:', error);
      // Fallback: create a simple reading from card meanings
      const fallbackReading = `Based on your question "${formData.question}", the cards have been drawn. Please try again or contact support.`;
      setReadingData({
        reading_text: fallbackReading,
        cards: cardIds.map(id => ({ id, name_key: `card${id}`, meaning: '' })),
        language: formData.language || locale || 'en',
      });
      setStep('reading');
    } finally {
      setIsGenerating(false);
      setIsShuffling(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-serif mb-4">{t('hero.title')}</h1>
        <p className="text-2xl md:text-3xl mb-2">{t('hero.subtitle')}</p>
        <p className="text-lg opacity-80">{t('hero.tagline')}</p>
      </section>

      {/* Form Step */}
      {step === 'form' && (
        <section className="container mx-auto px-4 py-12">
          <LeadMagnetForm onSubmit={handleFormSubmit} />
        </section>
      )}

      {/* Card Selection Step */}
      {step === 'cards' && (
        <section className="container mx-auto px-4 py-12">
          <CardDraw
            onCardsSelected={handleCardsSelected}
            selectedCards={selectedCards}
            isShuffling={isShuffling}
          />
        </section>
      )}

      {/* Reading Result Step */}
      {step === 'reading' && readingData && (
        <section className="container mx-auto px-4 py-12">
          <ReadingResult
            selectedCards={selectedCards}
            readingSummary={readingData.reading_text}
            language={formData?.language || locale || 'en'}
          />
          <PremiumConversion />
        </section>
      )}
    </div>
  );
}

