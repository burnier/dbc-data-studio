'use client';

import { useTranslation } from 'react-i18next';

export default function PremiumConversion() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto py-12 border-t border-bone-white/20 mt-12">
      <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-500/30 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-serif mb-4">{t('premium.title')}</h3>
        <p className="text-lg mb-6 opacity-90">{t('premium.description')}</p>
        <a
          href="#"
          className="inline-block px-8 py-4 bg-amber-900/40 hover:bg-amber-800/50 border border-amber-500/50 rounded-lg font-medium transition-all"
        >
          {t('premium.cta')}
        </a>
      </div>
    </div>
  );
}

