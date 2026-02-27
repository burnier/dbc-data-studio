import LanguagePage from '@/components/LanguagePage';

export const metadata = {
  title: 'Abigail | O Oráculo Húngaro — Tiragens Autênticas de Cartas Ciganas',
  description: 'Receba uma tiragem gratuita de 3 cartas de Abigail, praticante certificada de cartas ciganas húngaras. Sabedoria ancestral, orientação moderna.',
  openGraph: {
    title: 'Abigail | O Oráculo Húngaro',
    description: 'Tiragem gratuita de 3 cartas ciganas húngaras por Abigail. Desbloqueie seu ritual completo de 36 cartas.',
    locale: 'pt_BR',
  },
};

export default function PortuguesePage() {
  return <LanguagePage language="pt" />;
}
