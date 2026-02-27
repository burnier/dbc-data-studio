import LanguagePage from '@/components/LanguagePage';

export const metadata = {
  title: 'Abigail | A Magyar Jós — Hiteles Cigánykártya Olvasatok',
  description: 'Kapjon ingyenes 3 lapos kártyavetést Abigailtől, okleveles magyar cigánykártya-praktikustól. Ősi bölcsesség, modern útmutatás.',
  openGraph: {
    title: 'Abigail | A Magyar Jós',
    description: 'Ingyenes 3 lapos cigánykártya olvasat Abigailtől. Nyissa meg teljes 36 lapos rituáléját.',
    locale: 'hu_HU',
  },
};

export default function HungarianPage() {
  return <LanguagePage language="hu" />;
}
