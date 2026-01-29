'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CardDrawProps {
  onCardsSelected: (cardIds: number[]) => void;
  selectedCards: number[];
  isShuffling?: boolean;
}

const TOTAL_CARDS = 36;

export default function CardDraw({ onCardsSelected, selectedCards, isShuffling = false }: CardDrawProps) {
  const { t } = useTranslation();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const handleCardClick = (index: number) => {
    if (selectedCards.length >= 3 || selectedCards.includes(index)) {
      return;
    }

    const newSelected = [...selectedCards, index];
    onCardsSelected(newSelected);
    setFlippedCards(new Set([...flippedCards, index]));
  };

  const isCardFlipped = (index: number) => flippedCards.has(index) || selectedCards.includes(index);

  return (
    <div className="w-full py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif mb-2">{t('cardDraw.title')}</h2>
        <p className="text-lg opacity-80">{t('cardDraw.subtitle')}</p>
        {isShuffling && (
          <p className="text-lg mt-4 shuffling">{t('cardDraw.shuffling')}</p>
        )}
      </div>

      <div className="grid grid-cols-6 md:grid-cols-9 gap-3 max-w-4xl mx-auto">
        {Array.from({ length: TOTAL_CARDS }).map((_, index) => {
          const isFlipped = isCardFlipped(index);
          const isSelected = selectedCards.includes(index);

          return (
            <div
              key={index}
              onClick={() => !isShuffling && handleCardClick(index)}
              className={`
                relative aspect-[2/3] cursor-pointer transition-all duration-300
                ${isShuffling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
                ${isSelected ? 'ring-2 ring-bone-white' : ''}
              `}
            >
              <div className={`
                card-flip w-full h-full
                ${isFlipped ? 'flipped' : ''}
              `}>
                {/* Card Back */}
                <div className="card-face absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 border border-bone-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-bone-white/40 text-xs">?</div>
                </div>

                {/* Card Front */}
                <div className="card-face card-back absolute inset-0 bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-500/30 rounded-lg flex items-center justify-center">
                  <div className="text-bone-white text-xs font-medium">
                    {index + 1}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedCards.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-sm opacity-70">
            {selectedCards.length} / 3 {t('reading.cards')}
          </p>
        </div>
      )}
    </div>
  );
}

