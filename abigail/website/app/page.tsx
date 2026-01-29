'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardDraw from '../components/CardDraw';
import LeadMagnetForm from '../components/LeadMagnetForm';
import ReadingResult from '../components/ReadingResult';
import PremiumConversion from '../components/PremiumConversion';
import { generateReading } from '../lib/generateReading';

type Step = 'form' | 'cards' | 'shuffling' | 'reading';

export default function Home() {
  const { t } = useTranslation();
  const [step, setStep] = useState<Step>('form');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [readingSummary, setReadingSummary] = useState<string>('');
  const [formData, setFormData] = useState<any>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setCurrentLanguage(data.language || 'en');
    setStep('cards');
  };

  const handleCardsSelected = (cardIds: number[]) => {
    setSelectedCards(cardIds);
    
    if (cardIds.length === 3) {
      // Start shuffling animation
      setStep('shuffling');
      
      // Simulate shuffling delay, then generate reading
      setTimeout(() => {
        const reading = generateReading(cardIds, currentLanguage);
        setReadingSummary(reading);
        setStep('reading');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-6xl md:text-7xl font-serif mb-4 text-bone-white">
          {t('hero.title')}
        </h1>
        <h2 className="text-2xl md:text-3xl font-sans mb-6 text-bone-white/80">
          {t('hero.subtitle')}
        </h2>
        <p className="text-lg md:text-xl text-bone-white/60 max-w-2xl mx-auto">
          {t('hero.tagline')}
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        {step === 'form' && (
          <div className="py-12">
            <LeadMagnetForm 
              onSubmit={handleFormSubmit}
              isSubmitting={false}
            />
          </div>
        )}

        {step === 'cards' && (
          <div>
            <CardDraw
              onCardsSelected={handleCardsSelected}
              selectedCards={selectedCards}
              isShuffling={false}
            />
          </div>
        )}

        {step === 'shuffling' && (
          <div>
            <CardDraw
              onCardsSelected={handleCardsSelected}
              selectedCards={selectedCards}
              isShuffling={true}
            />
          </div>
        )}

        {step === 'reading' && (
          <div>
            <ReadingResult
              selectedCards={selectedCards}
              readingSummary={readingSummary}
              language={currentLanguage}
            />
            <PremiumConversion />
          </div>
        )}
      </div>
    </div>
  );
}
