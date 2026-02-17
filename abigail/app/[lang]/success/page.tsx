'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const translations = {
  en: {
    processing: "Processing your request...",
    title: "The Energy is Set",
    message: "Abigail is now at her wooden table, laying out the",
    tableauText: "36-card Hungarian Grand Tableau",
    message2: "specifically for your energy.",
    inbox: "Check your inbox within",
    hours: "24 hours",
    inboxText: "for your photo and analysis.",
    spiritual: "🕯️ Your reading is being prepared in spiritual silence 🕯️",
    orderId: "Order ID:",
    returnHome: "← Return to Home",
  },
  de: {
    processing: "Ihre Anfrage wird bearbeitet...",
    title: "Die Energie ist gesetzt",
    message: "Abigail sitzt jetzt an ihrem Holztisch und legt das",
    tableauText: "36-Karten Ungarische Grand Tableau",
    message2: "speziell für Ihre Energie aus.",
    inbox: "Überprüfen Sie Ihren Posteingang innerhalb von",
    hours: "24 Stunden",
    inboxText: "für Ihr Foto und Ihre Analyse.",
    spiritual: "🕯️ Ihre Lesung wird in spiritueller Stille vorbereitet 🕯️",
    orderId: "Bestell-ID:",
    returnHome: "← Zur Startseite",
  },
  pt: {
    processing: "Processando sua solicitação...",
    title: "A Energia Está Definida",
    message: "Abigail está agora em sua mesa de madeira, dispondo o",
    tableauText: "Grande Tableau Húngaro de 36 cartas",
    message2: "especificamente para sua energia.",
    inbox: "Verifique sua caixa de entrada em",
    hours: "24 horas",
    inboxText: "para sua foto e análise.",
    spiritual: "🕯️ Sua leitura está sendo preparada em silêncio espiritual 🕯️",
    orderId: "ID do Pedido:",
    returnHome: "← Voltar para o Início",
  },
  hu: {
    processing: "Kérése feldolgozása...",
    title: "Az Energia Beállt",
    message: "Abigail most a fa asztalánál ül, és kifejezetten az Ön energiája számára terít ki egy",
    tableauText: "36 kártyás Magyar Nagy Tableau-t",
    message2: ".",
    inbox: "Ellenőrizze postafiókját",
    hours: "24 órán",
    inboxText: "belül a fotóért és az elemzésért.",
    spiritual: "🕯️ Olvasata spirituális csendben készül 🕯️",
    orderId: "Rendelés azonosító:",
    returnHome: "← Vissza a Főoldalra",
  },
};

export default function SuccessPage() {
  const params = useParams();
  const lang = (params.lang as 'en' | 'de' | 'pt' | 'hu') || 'en';
  const t = translations[lang];
  
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay for dramatic effect
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-main mx-auto mb-4"></div>
          <p className="text-purple-light text-lg">{t.processing}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blurred Background Cards */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/cards/card-01-house.jpg"
          alt=""
          fill
          className="object-cover blur-2xl"
        />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Mystical Icon */}
        <div className="text-7xl mb-6">🌙</div>

        {/* Success Message - Dark & Mystical */}
        <div className="bg-gradient-to-br from-purple-dark/50 to-black/70 backdrop-blur-xl border-2 border-purple-main/40 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-serif text-purple-light mb-6">
            {t.title}
          </h1>
          
          <div className="bg-charcoal/70 rounded-xl p-8 mb-6 border border-purple-light/20">
            <p className="text-bone-white text-lg md:text-xl leading-relaxed">
              {t.message} <span className="text-yellow-400 font-semibold">{t.tableauText}</span> {t.message2}
            </p>
            <p className="text-bone-white/80 text-base mt-4">
              {t.inbox} <strong className="text-purple-light">{t.hours}</strong> {t.inboxText}
            </p>
          </div>

          <div className="border-t border-purple-main/30 pt-6">
            <p className="text-bone-white/60 text-sm italic">
              {t.spiritual}
            </p>
          </div>

          {sessionId && (
            <p className="text-bone-white/40 text-xs mt-4">
              {t.orderId} {sessionId}
            </p>
          )}
        </div>

        {/* Return Home */}
        <a
          href={`/${lang}`}
          className="inline-block mt-8 text-purple-light hover:text-purple-main transition-colors text-sm"
        >
          {t.returnHome}
        </a>
      </div>
    </div>
  );
}

