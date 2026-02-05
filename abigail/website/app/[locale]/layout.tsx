'use client';

import I18nProvider from '../../components/I18nProvider';
import { ReadingProvider } from '../../contexts/ReadingContext';
import Header from '../../components/Header';
import { use } from 'react';

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <I18nProvider>
      <ReadingProvider>
        <Header locale={locale} />
        <main className="flex-1 pt-16 md:pt-20">
          {children}
        </main>
      </ReadingProvider>
    </I18nProvider>
  );
}

