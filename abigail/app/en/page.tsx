import LanguagePage from '@/components/LanguagePage';

export const metadata = {
  title: 'Abigail | The Hungarian Oracle — Authentic Gypsy Card Readings',
  description: 'Get a free 3-card reading from Abigail, a certified Hungarian Gypsy Card practitioner. Ancient wisdom, modern insight.',
  openGraph: {
    title: 'Abigail | The Hungarian Oracle',
    description: 'Free 3-card Gypsy Card reading by Abigail. Unlock your full 36-card ritual.',
    locale: 'en_US',
  },
};

export default function EnglishPage() {
  return <LanguagePage language="en" />;
}
