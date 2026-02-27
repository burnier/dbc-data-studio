'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CONSENT_KEY = 'cookie_consent';
const GA_ID = 'G-RW6NJ8HN6N';

const BANNER_TEXT: Record<string, { text: string; privacy: string; accept: string; decline: string }> = {
  de: {
    text: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und den Website-Verkehr zu analysieren (Google Analytics).',
    privacy: 'Datenschutzrichtlinie',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
  },
  pt: {
    text: 'Usamos cookies para melhorar sua experiência e analisar o tráfego do site (Google Analytics).',
    privacy: 'Política de Privacidade',
    accept: 'Aceitar',
    decline: 'Recusar',
  },
  hu: {
    text: 'Sütiket használunk a felhasználói élmény javítása és a webhelyforgalom elemzése érdekében (Google Analytics).',
    privacy: 'Adatvédelmi Irányelvek',
    accept: 'Elfogadom',
    decline: 'Elutasítom',
  },
  en: {
    text: 'We use cookies to improve your experience and analyse site traffic (Google Analytics).',
    privacy: 'Privacy Policy',
    accept: 'Accept',
    decline: 'Decline',
  },
};

export default function CookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Detect language from URL path (e.g. /de/... → 'de')
  const lang = (['en', 'de', 'pt', 'hu'].find(l => pathname?.startsWith(`/${l}`)) || 'en') as keyof typeof BANNER_TEXT;
  const t = BANNER_TEXT[lang];

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored as 'accepted' | 'declined');
    } else {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setConsent('declined');
    setVisible(false);
  };

  return (
    <>
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {visible && (
        <div role="dialog" aria-label="Cookie consent" className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
          <div className="max-w-2xl mx-auto bg-[#2a1a4e] border border-purple-main/30 rounded-xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-bone-white/80 text-sm flex-1 leading-relaxed">
              {t.text}{' '}
              <Link href={`/${lang}/privacy`} className="text-purple-main hover:underline">
                {t.privacy}
              </Link>.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={decline}
                className="text-sm text-bone-white/60 hover:text-bone-white border border-bone-white/20 rounded-lg px-4 py-2 transition-colors"
              >
                {t.decline}
              </button>
              <button
                onClick={accept}
                className="text-sm text-charcoal font-semibold bg-purple-main hover:bg-purple-dark rounded-lg px-4 py-2 transition-colors"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
