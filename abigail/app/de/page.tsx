import LanguagePage from '@/components/LanguagePage';

export const metadata = {
  title: 'Abigail | Das Ungarische Orakel — Authentische Zigeunerkarten-Lesungen',
  description: 'Erhalten Sie eine kostenlose 3-Karten-Legung von Abigail, einer zertifizierten ungarischen Zigeunerkarten-Praktikerin. Altes Wissen, moderne Einsicht.',
  openGraph: {
    title: 'Abigail | Das Ungarische Orakel',
    description: 'Kostenlose 3-Karten-Legung von Abigail. Entdecken Sie Ihr vollständiges 36-Karten-Ritual.',
    locale: 'de_DE',
  },
};

export default function GermanPage() {
  return <LanguagePage language="de" />;
}
