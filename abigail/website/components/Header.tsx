'use client';

import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useReading } from '../contexts/ReadingContext';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  locale?: string;
}

export default function Header({ locale }: HeaderProps) {
  const { hasCompletedReading } = useReading();
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname or use prop
  const currentLocale = locale || pathname.split('/')[1] || 'en';
  const locales = ['en', 'de', 'pt', 'hu'];

  // Helper to get path with locale
  const getLocalizedPath = (path: string) => {
    // Remove leading slash and locale if present
    const cleanPath = path.replace(/^\//, '').replace(/^(en|de|pt|hu)\//, '');
    return `/${currentLocale}${cleanPath ? `/${cleanPath}` : ''}`;
  };

  // Helper to switch locale while keeping current path
  const switchLocale = (newLocale: string) => {
    // Get current path without locale
    const pathWithoutLocale = pathname.replace(/^\/(en|de|pt|hu)/, '') || '/';
    router.push(`/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`);
  };

  const isActive = (path: string) => {
    const localizedPath = getLocalizedPath(path);
    return pathname === localizedPath || pathname.startsWith(localizedPath + '/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glassmorphism-nav backdrop-blur-md border-b border-purple-dark/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href={getLocalizedPath('/')} className="flex items-end space-x-2 group h-full">
              <img
                src="/logo_text.png"
                alt="Abigail Arts & Oracles"
                className="h-full w-auto max-h-full object-contain object-bottom group-hover:opacity-80 transition-opacity"
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href={getLocalizedPath('/')}
                className={`text-sm font-medium transition-colors ${isActive('/')
                  ? 'text-bone-white border-b-2 border-purple-dark'
                  : 'text-bone-white/70 hover:text-bone-white'
                  }`}
              >
                <span suppressHydrationWarning>{t('nav.home')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/abigail')}
                className={`text-sm font-medium transition-colors ${isActive('/abigail')
                  ? 'text-bone-white border-b-2 border-purple-dark'
                  : 'text-bone-white/70 hover:text-bone-white'
                  }`}
              >
                <span suppressHydrationWarning>{t('nav.reader')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/shop')}
                className={`text-sm font-medium transition-colors ${isActive('/shop')
                  ? 'text-bone-white border-b-2 border-purple-dark'
                  : 'text-bone-white/70 hover:text-bone-white'
                  }`}
              >
                <span suppressHydrationWarning>{t('nav.shop')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/contact')}
                className={`text-sm font-medium transition-colors ${isActive('/contact')
                  ? 'text-bone-white border-b-2 border-purple-dark'
                  : 'text-bone-white/70 hover:text-bone-white'
                  }`}
              >
                <span suppressHydrationWarning>{t('nav.contact')}</span>
              </Link>
              <Link
                href={getLocalizedPath('/cards')}
                className={`text-sm font-medium transition-colors ${isActive('/cards')
                  ? 'text-bone-white border-b-2 border-purple-dark'
                  : 'text-bone-white/70 hover:text-bone-white'
                  }`}
              >
                <span suppressHydrationWarning>{t('nav.cards')}</span>
              </Link>
            </div>

            {/* Language Switcher & CTA */}
            <div className="flex items-center space-x-4">
              {/* Language Dropdown */}
              <LanguageDropdown currentLocale={currentLocale} pathname={pathname} locales={locales} />

              {/* Personal Reading CTA - Only shows after reading */}
              {hasCompletedReading && (
                <Link
                  href={getLocalizedPath('/contact')}
                  className="hidden md:block px-4 py-2 bg-purple-dark hover:bg-purple-dark/80 border border-white/30 rounded-lg text-sm font-medium text-bone-white transition-all"
                >
                  {t('nav.getPersonalReading')}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href={getLocalizedPath('/')}
              className={`block text-sm font-medium py-2 ${isActive('/') ? 'text-bone-white' : 'text-bone-white/70'
                }`}
            >
              <span suppressHydrationWarning>{t('nav.home')}</span>
            </Link>
            <Link
              href={getLocalizedPath('/abigail')}
              className={`block text-sm font-medium py-2 ${isActive('/abigail') ? 'text-bone-white' : 'text-bone-white/70'
                }`}
            >
              <span suppressHydrationWarning>{t('nav.reader')}</span>
            </Link>
            <Link
              href={getLocalizedPath('/shop')}
              className={`block text-sm font-medium py-2 ${isActive('/shop') ? 'text-bone-white' : 'text-bone-white/70'
                }`}
            >
              <span suppressHydrationWarning>{t('nav.shop')}</span>
            </Link>
            <Link
              href={getLocalizedPath('/contact')}
              className={`block text-sm font-medium py-2 ${isActive('/contact') ? 'text-bone-white' : 'text-bone-white/70'
                }`}
            >
              <span suppressHydrationWarning>{t('nav.contact')}</span>
            </Link>
            <Link
              href={getLocalizedPath('/cards')}
              className={`block text-sm font-medium py-2 ${isActive('/cards') ? 'text-bone-white' : 'text-bone-white/70'
                }`}
            >
              <span suppressHydrationWarning>{t('nav.cards')}</span>
            </Link>
            {hasCompletedReading && (
              <Link
                href={getLocalizedPath('/contact')}
                className="block mt-4 px-4 py-2 bg-purple-dark hover:bg-purple-dark/80 border border-white/30 rounded-lg text-sm font-medium text-bone-white text-center"
              >
                <span suppressHydrationWarning>{t('nav.getPersonalReading')}</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

// Language Dropdown Component
function LanguageDropdown({ currentLocale, pathname, locales }: { currentLocale: string; pathname: string; locales: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languageNames: Record<string, string> = {
    en: 'English',
    de: 'Deutsch',
    pt: 'Português',
    hu: 'Magyar',
  };

  const languageFlags: Record<string, string> = {
    en: '🇺🇸',
    de: '🇩🇪',
    pt: '🇧🇷',
    hu: '🇭🇺',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageChange = (lang: string) => {
    // Don't do anything if it's the same language
    if (lang === currentLocale) {
      setIsOpen(false);
      return;
    }

    // Remove locale prefix from pathname
    let pathWithoutLocale = pathname.replace(/^\/(en|de|pt|hu)(\/|$)/, '') || '/';
    // Ensure path starts with / if it's not empty
    if (pathWithoutLocale && !pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    // Build new path with locale
    const newPath = `/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

    // Use window.location.href for full page refresh
    window.location.href = newPath;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-900/50 hover:bg-gray-900/70 border border-bone-white/20 rounded-lg text-sm font-medium text-bone-white transition-all"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="flex items-center space-x-2">
          <span>{languageFlags[currentLocale] || ''}</span>
          <span>{languageNames[currentLocale] || currentLocale.toUpperCase()}</span>
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-900 border border-bone-white/20 rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`
                w-full text-left flex items-center space-x-2 px-4 py-2 text-sm transition-colors
                ${currentLocale === lang
                  ? 'bg-purple-dark text-bone-white'
                  : 'text-bone-white/70 hover:bg-gray-800 hover:text-bone-white'
                }
              `}
            >
              <span>{languageFlags[lang] || ''}</span>
              <span>{languageNames[lang] || lang.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

