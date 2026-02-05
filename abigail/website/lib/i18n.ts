import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from '../locales/en.json';
import deTranslations from '../locales/de.json';
import ptTranslations from '../locales/pt.json';
import huTranslations from '../locales/hu.json';

// Initialize i18n with resources
if (!i18n.isInitialized) {
  i18n
    .use(typeof window !== 'undefined' ? LanguageDetector : initReactI18next) // Use LanguageDetector only on client
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: enTranslations },
        de: { translation: deTranslations },
        pt: { translation: ptTranslations },
        hu: { translation: huTranslations },
      },
      lng: 'en', // Default, will be overridden by route or detection
      fallbackLng: 'en',
      returnNull: false,
      returnEmptyString: false,
      returnObjects: false,
      detection: typeof window !== 'undefined' ? {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      } : undefined, // Only use detection on client
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;

