'use client';

import { useTranslation } from 'react-i18next';
import { CARDS, Card } from '../constants/cardMeanings';

interface ReadingResultProps {
  selectedCards: number[];
  readingSummary: string;
  language: string;
}

export default function ReadingResult({ selectedCards, readingSummary, language }: ReadingResultProps) {
  const { t } = useTranslation();

  const getCardName = (cardId: number): string => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return `Card ${cardId + 1}`;
    return t(`cards.${card.nameKey}`);
  };

  const getCardMeaning = (cardId: number): string => {
    const card = CARDS.find(c => c.id === cardId);
    if (!card) return '';
    return card.shortMeaning[language as keyof Card['shortMeaning']] || card.shortMeaning.en;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <h2 className="text-4xl font-serif text-center mb-8">{t('reading.title')}</h2>

      {/* Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {selectedCards.map((cardId, index) => (
          <div
            key={cardId}
            className="bg-gray-900/50 border border-bone-white/20 rounded-lg p-6 text-center"
          >
            <div className="text-2xl font-serif mb-2">{getCardName(cardId)}</div>
            <div className="text-sm opacity-70 mb-4">
              {getCardMeaning(cardId)}
            </div>
            <div className="text-xs opacity-50">Position {index + 1}</div>
          </div>
        ))}
      </div>

      {/* Reading Summary */}
      <div className="bg-gray-900/30 border border-bone-white/20 rounded-lg p-8">
        <h3 className="text-2xl font-serif mb-4">{t('reading.summary')}</h3>
        <p className="text-lg leading-relaxed opacity-90 whitespace-pre-line">
          {readingSummary}
        </p>
      </div>
    </div>
  );
}

