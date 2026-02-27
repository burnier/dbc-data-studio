'use client';

/**
 * Abigail Arts & Oracles - Conversion-Optimized Landing Page
 * Language-specific page with simplified card reveal flow
 */

import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { submitRitual, getScarcity, selectCards } from '@/lib/actions';
import { getCard, getCardImageName } from '@/lib/cards';
import { CountdownTimer } from '@/components/CountdownTimer';
import { redirectToCheckout, formatPrice } from '@/lib/stripe';

interface FormData {
    name: string;
    email: string;
    question: string;
}

type Step = 'form' | 'shuffling' | 'reveal' | 'upsell';

interface LandingPageProps {
    language: 'en' | 'de' | 'pt' | 'hu';
}

const translations = {
    en: {
        siteName: "Abigail | The Hungarian Oracle",
        tagline: "Authentic Hungarian Gypsy Card Wisdom",
        heroTitle: "Unlock Your Destiny",
        heroSubtitle: "Ancient Gypsy Card Reading by Abigail",
        heroCta: "Get Your Free Reading",
        scarcityTitle: "🔥 Only",
        scarcitySlots: "readings left today",
        scarcityUrgency: "Abigail personally reviews each reading",
        formTitle: "What Does Your Heart Seek?",
        formSubtitle: "Receive your personalized 3-card reading via email in minutes",
        namePlaceholder: "Your Name",
        emailPlaceholder: "Your Email Address",
        questionPlaceholder: "Describe what's on your heart — the more context you share, the deeper the reading. (e.g. love, a difficult decision, a path you're unsure about...)",
        questionHint: "💡 Tip: Open questions give richer readings. Instead of \"Will I get the job?\", try \"What energies surround my career path right now?\"",
        questionMinError: "Please share a little more — the cards need context to speak clearly (min 20 characters)",
        privacyNote: "🔒 Your information is 100% confidential",
        submitButton: "Reveal My Cards →",
        submitting: "Consulting the Cards...",
        shufflingTitle: "Abigail is Shuffling the Ancient Deck...",
        shufflingText: "The cards are aligning with your energy...",
        revealTitle: "Your 3 Cards Have Been Drawn!",
        revealSubtitle: "Check your email for the complete reading",
        revealText: "Abigail has drawn your 3 sacred cards and is preparing your personalized reading.",
        emailSent: "✉️ Reading sent to",
        emailNote: "Check your inbox (and spam folder) in the next few minutes",
        cardsMeaning: "Your Cards Speak Of:",
        shadowIntro: "Your initial reading is in your inbox. However, the way these three cards align together suggests a deeper pattern that a digital draw alone cannot fully reveal.",
        shadowText: "Abigail is in the studio now, ready to perform the 36-card Physical Ritual for you.",
        urgencyTitle: "⚠️ Abigail Has Sensed Deeper Patterns",
        urgencyText: "in how your cards connect. The surface meanings are just the beginning—",
        urgencyDescription: "Request her personal deep-dive to reveal the hidden connections and what they mean for your path forward.",
        urgencyTimer: "This energy window closes in:",
        urgencyButton: "Unlock the 36-Card Deep-Dive",
        aboutTitle: "A Lineage of Insight from the Heart of Hungary",
        aboutText1: "Abigail is a certified practitioner of the Hungarian Gypsy Card Institute (Cigánykártya Magyarország). She carries forward a lineage of wisdom that has guided seekers through Eastern Europe for centuries.",
        aboutText2: "Your free reading offers a first glimpse of your cards' energy. Abigail's full 36-card ritual is performed entirely by hand — no screens, no shortcuts — using the sacred spreads passed down through the Hungarian tradition.",
        aboutBadge: "✓ Certified by Hungarian Gypsy Card Institute",
        trustTitle: "Why Trust Abigail?",
        trustPoint1: "Authentic Hungarian Tradition",
        trustPoint2: "Institute Certified Expert",
        trustPoint3: "Premium Reading: 100% Physical",
        trustPoint3Desc: "Your full 36-card spread is performed by Abigail in person",
        upsellTitle: "Want Deeper Insights?",
        upsellSubtitle: "Upgrade to Abigail's Premium Hand-Drawn Reading",
        upsellFeature1: "🃏 Full 36-card spread (not just 3!)",
        upsellFeature2: "📸 Physical card spread photo from Abigail's studio",
        upsellFeature3: "📝 In-depth analysis (3x longer than free reading)",
        upsellFeature4: "⚡ Priority delivery within 24 hours",
        upsellPrice: "Only $29.00",
        upsellCta: "Unlock Full Reading →",
        upsellGuarantee: "100% Money-Back Guarantee",
        testimonialsTitle: "What Others Are Saying",
        testimonial1: '"Abigail\'s reading gave me the clarity I desperately needed. Worth every penny!"',
        testimonial1Author: "— Maria, Vienna",
        testimonial2: '"Eerily accurate. The cards knew things I hadn\'t told anyone."',
        testimonial2Author: "— Thomas, Berlin",
        testimonial3: '"Changed my perspective on a difficult decision. Highly recommend!"',
        testimonial3Author: "— Sofia, Budapest",
    },
    de: {
        siteName: "Abigail | Das Ungarische Orakel",
        tagline: "Authentische Weisheit der Ungarischen Zigeunerkarten",
        heroTitle: "Enthüllen Sie Ihr Schicksal",
        heroSubtitle: "Alte Zigeunerkarten-Lesung von Abigail",
        heroCta: "Kostenlose Lesung Erhalten",
        scarcityTitle: "🔥 Nur noch",
        scarcitySlots: "Lesungen heute verfügbar",
        scarcityUrgency: "Abigail prüft jede Lesung persönlich",
        formTitle: "Was Bewegt Ihr Herz?",
        formSubtitle: "Erhalten Sie Ihre personalisierte 3-Karten-Lesung per E-Mail in Minuten",
        namePlaceholder: "Ihr Name",
        emailPlaceholder: "Ihre E-Mail-Adresse",
        questionPlaceholder: "Beschreiben Sie, was Ihr Herz bewegt — je mehr Kontext Sie teilen, desto tiefer die Lesung. (z.B. Liebe, eine schwierige Entscheidung, ein Lebensweg...)",
        questionHint: "💡 Tipp: Offene Fragen ergeben reichhaltigere Deutungen. Statt \"Bekomme ich den Job?\" versuchen Sie: \"Welche Energien umgeben meinen Berufsweg gerade?\"",
        questionMinError: "Bitte teilen Sie etwas mehr mit — die Karten brauchen Kontext (mind. 20 Zeichen)",
        privacyNote: "🔒 Ihre Daten sind 100% vertraulich",
        submitButton: "Meine Karten Enthüllen →",
        submitting: "Karten werden konsultiert...",
        shufflingTitle: "Abigail Mischt das Uralte Deck...",
        shufflingText: "Die Karten richten sich nach Ihrer Energie aus...",
        revealTitle: "Ihre 3 Karten Wurden Gezogen!",
        revealSubtitle: "Überprüfen Sie Ihre E-Mail für die vollständige Lesung",
        revealText: "Abigail hat Ihre 3 heiligen Karten gezogen und bereitet Ihre personalisierte Lesung vor.",
        emailSent: "✉️ Lesung gesendet an",
        emailNote: "Überprüfen Sie Ihren Posteingang (und Spam-Ordner) in den nächsten Minuten",
        cardsMeaning: "Ihre Karten Sprechen Von:",
        shadowIntro: "Ihre erste Deutung ist in Ihrem Posteingang. Die Art, wie diese drei Karten zusammenwirken, deutet auf ein tieferes Muster hin, das ein digitales Ziehen allein nicht vollständig enthüllen kann.",
        shadowText: "Abigail steht jetzt im Studio bereit, um das 36-Karten Physische Ritual für Sie durchzuführen.",
        urgencyTitle: "⚠️ Abigail Hat Tiefere Muster Wahrgenommen",
        urgencyText: "in der Verbindung Ihrer Karten. Die Oberflächenbedeutungen sind nur der Anfang—",
        urgencyDescription: "Fordern Sie ihre persönliche Tiefenanalyse an, um die verborgenen Verbindungen und ihre Bedeutung für Ihren Weg zu enthüllen.",
        urgencyTimer: "Dieses Energiefenster schließt sich in:",
        urgencyButton: "36-Karten Tiefenanalyse Freischalten",
        aboutTitle: "Eine Linie der Weisheit aus dem Herzen Ungarns",
        aboutText1: "Abigail ist zertifizierte Praktikerin des Ungarischen Zigeunerkarten-Instituts (Cigánykártya Magyarország). Sie führt eine Linie der Weisheit fort, die seit Jahrhunderten Suchende in Osteuropa geleitet hat.",
        aboutText2: "Ihre kostenlose Lesung gibt einen ersten Einblick in die Energie Ihrer Karten. Abigails vollständiges 36-Karten-Ritual wird vollständig von Hand durchgeführt — ohne Bildschirme, ohne Abkürzungen — mit den heiligen Legesystemen der ungarischen Tradition.",
        aboutBadge: "✓ Zertifiziert vom Ungarischen Zigeunerkarten-Institut",
        trustTitle: "Warum Abigail Vertrauen?",
        trustPoint1: "Authentische Ungarische Tradition",
        trustPoint2: "Institut-Zertifizierte Expertin",
        trustPoint3: "Premium-Lesung: 100% Physisch",
        trustPoint3Desc: "Ihre vollständige 36-Karten-Legung wird von Abigail persönlich durchgeführt",
        upsellTitle: "Tiefere Einblicke Gewünscht?",
        upsellSubtitle: "Upgrade auf Abigails Premium-Handgezeichnete Lesung",
        upsellFeature1: "🃏 Vollständige 36-Karten-Legung (nicht nur 3!)",
        upsellFeature2: "📸 Foto der physischen Kartenlegung aus Abigails Studio",
        upsellFeature3: "📝 Tiefgehende Analyse (3x länger als kostenlose Lesung)",
        upsellFeature4: "⚡ Prioritätslieferung innerhalb von 24 Stunden",
        upsellPrice: "Nur €24,90",
        upsellCta: "Vollständige Lesung Freischalten →",
        upsellGuarantee: "100% Geld-zurück-Garantie",
        testimonialsTitle: "Was Andere Sagen",
        testimonial1: '"Abigails Lesung gab mir die Klarheit, die ich so dringend brauchte. Jeden Cent wert!"',
        testimonial1Author: "— Maria, Wien",
        testimonial2: '"Unheimlich genau. Die Karten wussten Dinge, die ich niemandem erzählt hatte."',
        testimonial2Author: "— Thomas, Berlin",
        testimonial3: '"Hat meine Sichtweise auf eine schwierige Entscheidung verändert. Sehr empfehlenswert!"',
        testimonial3Author: "— Sofia, Budapest",
    },
    pt: {
        siteName: "Abigail | O Oráculo Húngaro",
        tagline: "Sabedoria Autêntica das Cartas Ciganas Húngaras",
        heroTitle: "Desvende Seu Destino",
        heroSubtitle: "Leitura Ancestral de Cartas Ciganas por Abigail",
        heroCta: "Obter Minha Leitura Grátis",
        scarcityTitle: "🔥 Apenas",
        scarcitySlots: "leituras restantes hoje",
        scarcityUrgency: "Abigail revisa pessoalmente cada leitura",
        formTitle: "O Que Seu Coração Busca?",
        formSubtitle: "Receba sua leitura personalizada de 3 cartas por e-mail em minutos",
        namePlaceholder: "Seu Nome",
        emailPlaceholder: "Seu E-mail",
        questionPlaceholder: "Descreva o que pesa no seu coração — quanto mais contexto você compartilhar, mais profunda será a leitura. (ex: amor, uma decisão difícil, um caminho incerto...)",
        questionHint: "💡 Dica: Perguntas abertas geram leituras mais ricas. Em vez de \"Vou conseguir o emprego?\", tente: \"Que energias envolvem meu caminho profissional agora?\"",
        questionMinError: "Por favor, compartilhe um pouco mais — as cartas precisam de contexto para falar (mín. 20 caracteres)",
        privacyNote: "🔒 Suas informações são 100% confidenciais",
        submitButton: "Revelar Minhas Cartas →",
        submitting: "Consultando as Cartas...",
        shufflingTitle: "Abigail Está Embaralhando o Baralho Ancestral...",
        shufflingText: "As cartas estão se alinhando com sua energia...",
        revealTitle: "Suas 3 Cartas Foram Reveladas!",
        revealSubtitle: "Verifique seu e-mail para a leitura completa",
        revealText: "Abigail revelou suas 3 cartas sagradas e está preparando sua leitura personalizada.",
        emailSent: "✉️ Leitura enviada para",
        emailNote: "Verifique sua caixa de entrada (e a pasta de spam) nos próximos minutos",
        cardsMeaning: "Suas Cartas Revelam:",
        shadowIntro: "Sua leitura inicial está na sua caixa de entrada. Porém, a forma como essas três cartas se combinam sugere um padrão mais profundo que uma tiragem digital sozinha não consegue revelar completamente.",
        shadowText: "Abigail está no estúdio agora, pronta para realizar o Ritual Físico de 36 cartas para você.",
        urgencyTitle: "⚠️ Abigail Percebeu Padrões Mais Profundos",
        urgencyText: "na forma como suas cartas se conectam. Os significados superficiais são apenas o começo—",
        urgencyDescription: "Solicite sua análise profunda pessoal para revelar as conexões ocultas e o que elas significam para seu caminho.",
        urgencyTimer: "Esta janela de energia fecha em:",
        urgencyButton: "Desbloquear Análise Profunda de 36 Cartas",
        aboutTitle: "Uma Linhagem de Sabedoria do Coração da Hungria",
        aboutText1: "Abigail é praticante certificada do Instituto Húngaro de Cartas Ciganas (Cigánykártya Magyarország). Ela mantém uma linhagem de sabedoria que tem guiado buscadores pelo Leste Europeu por séculos.",
        aboutText2: "Sua leitura gratuita oferece um primeiro vislumbre da energia das suas cartas. O ritual completo de 36 cartas de Abigail é realizado inteiramente à mão — sem telas, sem atalhos — usando os jogos sagrados transmitidos pela tradição húngara.",
        aboutBadge: "✓ Certificada pelo Instituto Húngaro de Cartas Ciganas",
        trustTitle: "Por Que Confiar em Abigail?",
        trustPoint1: "Tradição Húngara Autêntica",
        trustPoint2: "Especialista Certificada por Instituto",
        trustPoint3: "Leitura Premium: 100% Física",
        trustPoint3Desc: "Sua tiragem completa de 36 cartas é realizada pessoalmente por Abigail",
        upsellTitle: "Quer Uma Visão Mais Profunda?",
        upsellSubtitle: "Faça o Upgrade para a Leitura Premium de Abigail",
        upsellFeature1: "🃏 Tiragem completa de 36 cartas (não apenas 3!)",
        upsellFeature2: "📸 Foto da tiragem física do estúdio de Abigail",
        upsellFeature3: "📝 Análise aprofundada (3x mais longa que a leitura gratuita)",
        upsellFeature4: "⚡ Entrega prioritária em até 24 horas",
        upsellPrice: "Apenas R$ 129,00",
        upsellCta: "Desbloquear Leitura Completa →",
        upsellGuarantee: "Garantia de Reembolso Total",
        testimonialsTitle: "O Que Dizem Nossos Clientes",
        testimonial1: '"A leitura de Abigail me deu a clareza que eu tanto precisava. Vale cada centavo!"',
        testimonial1Author: "— Maria, Viena",
        testimonial2: '"Surpreendentemente precisa. As cartas sabiam coisas que eu não havia contado a ninguém."',
        testimonial2Author: "— Thomas, Berlim",
        testimonial3: '"Mudou minha perspectiva sobre uma decisão difícil. Recomendo muito!"',
        testimonial3Author: "— Sofia, Budapeste",
    },
    hu: {
        siteName: "Abigail | A Magyar Jósnő",
        tagline: "Hiteles Magyar Cigánykártya Bölcsesség",
        heroTitle: "Tárja Fel Sorsát",
        heroSubtitle: "Ősi Cigánykártya Olvasás Abigailtől",
        heroCta: "Ingyenes Olvasat Kérése",
        scarcityTitle: "🔥 Csak",
        scarcitySlots: "olvasat maradt ma",
        scarcityUrgency: "Abigail személyesen áttekint minden olvasatot",
        formTitle: "Mit Keres A Szíve?",
        formSubtitle: "Kapja meg személyre szabott 3 kártyás olvasatát e-mailben perceken belül",
        namePlaceholder: "Az Ön Neve",
        emailPlaceholder: "Az Ön E-mail Címe",
        questionPlaceholder: "Írja le, mi nyomja a szívét — minél több összefüggést oszt meg, annál mélyebb az olvasat. (pl. szerelem, egy nehéz döntés, bizonytalan életút...)",
        questionHint: "💡 Tipp: A nyílt kérdések gazdagabb olvasatot adnak. A »Megkapom az állást?« helyett próbálja: »Milyen energiák veszik körül jelenleg az életutamat?«",
        questionMinError: "Kérem, osszon meg egy kicsit többet — a kártyáknak összefüggésre van szükségük (min. 20 karakter)",
        privacyNote: "🔒 Az Ön adatai 100%-ban bizalmasak",
        submitButton: "Kártyáim Felfedése →",
        submitting: "Kártyák Konzultálása...",
        shufflingTitle: "Abigail Keveri az Ősi Paklit...",
        shufflingText: "A kártyák az Ön energiájához igazodnak...",
        revealTitle: "3 Kártyája Kihúzásra Került!",
        revealSubtitle: "Ellenőrizze e-mailjét a teljes olvasatért",
        revealText: "Abigail kihúzta 3 szent kártyáját és készíti személyre szabott olvasatát.",
        emailSent: "✉️ Olvasat elküldve ide:",
        emailNote: "Ellenőrizze postafiókját (és spam mappáját) a következő percekben",
        cardsMeaning: "Kártyái Erről Szólnak:",
        shadowIntro: "Az első olvasata a postaládájában van. Azonban az a mód, ahogyan ez a három kártya együtt hat, egy mélyebb mintára utal, amelyet egy digitális húzás önmagában nem tud teljesen feltárni.",
        shadowText: "Abigail most a műteremben áll készen, hogy elvégezze az Ön számára a 36 kártyás Fizikai Rituálét.",
        urgencyTitle: "⚠️ Abigail Mélyebb Mintákat Észlelt",
        urgencyText: "abban, ahogyan kártyái kapcsolódnak egymáshoz. A felszíni jelentések csak a kezdet—",
        urgencyDescription: "Kérje személyes mélyreható elemzését, hogy feltárja a rejtett kapcsolatokat és azok jelentését az Ön útja számára.",
        urgencyTimer: "Ez az energiaablak bezárul:",
        urgencyButton: "36 Kártyás Mély Elemzés Feloldása",
        aboutTitle: "Bölcsesség Leszármazása Magyarország Szívéből",
        aboutText1: "Abigail a Magyar Cigánykártya Intézet (Cigánykártya Magyarország) okleveles gyakorlója. Olyan bölcsesség leszármazását viszi tovább, amely évszázadokon át vezette a keresőket Kelet-Európán keresztül.",
        aboutText2: "Az ingyenes olvasat megadja az első betekintést kártyáinak energiájába. Abigail teljes 36 kártyás rituáléja teljes egészében kézzel történik — képernyők és rövidítések nélkül — a magyar hagyomány által átadott szent vetési módszerekkel.",
        aboutBadge: "✓ Magyar Cigánykártya Intézet által hitelesítve",
        trustTitle: "Miért Bízzon Abigailben?",
        trustPoint1: "Autentikus Magyar Hagyomány",
        trustPoint2: "Intézeti Hitelesítésű Szakértő",
        trustPoint3: "Prémium Olvasat: 100% Fizikai",
        trustPoint3Desc: "Az Ön teljes 36 kártyás vetését Abigail személyesen végzi",
        upsellTitle: "Mélyebb Betekintést Szeretne?",
        upsellSubtitle: "Váltson Abigail Prémium Kézzel Végzett Olvasatára",
        upsellFeature1: "🃏 Teljes 36 kártyás vetés (nem csak 3!)",
        upsellFeature2: "📸 Fizikai kártyavetés fotó Abigail stúdiójából",
        upsellFeature3: "📝 Mélyreható elemzés (3x hosszabb, mint az ingyenes olvasat)",
        upsellFeature4: "⚡ Prioritásos kézbesítés 24 órán belül",
        upsellPrice: "Csak 8.900 Ft",
        upsellCta: "Teljes Olvasat Feloldása →",
        upsellGuarantee: "100%-os Visszafizetési Garancia",
        testimonialsTitle: "Mit Mondanak Mások",
        testimonial1: '"Abigail olvasata megadta nekem a világosságot, amire annyira szükségem volt. Megérte!"',
        testimonial1Author: "— Maria, Bécs",
        testimonial2: '"Megdöbbentően pontos. A kártyák olyan dolgokat tudtak, amiket senkinek sem mondtam el."',
        testimonial2Author: "— Thomas, Berlin",
        testimonial3: '"Új szemszögből láttam egy nehéz döntést. Nagyon ajánlom!"',
        testimonial3Author: "— Sofia, Budapest",
    },
};

export function LanguagePage({ language }: LandingPageProps) {
    const searchParams = useSearchParams();
    const upgradeSubmissionId = searchParams?.get('upgrade');
    
    const [step, setStep] = useState<Step>('form');
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const [submissionTimestamp, setSubmissionTimestamp] = useState<Date | null>(null);
    const [drawnCardIds, setDrawnCardIds] = useState<number[]>([]);
    const [userEmail, setUserEmail] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [scarcity, setScarcity] = useState<{ availableToday: number; totalLimit: number } | null>(null);
    const [shufflingProgress, setShufflingProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
    const t = translations[language];

    // Handle email upgrade link
    useEffect(() => {
        if (upgradeSubmissionId) {
            const id = parseInt(upgradeSubmissionId, 10);
            if (!isNaN(id)) {
                setIsLoading(true);
                redirectToCheckout({
                    submissionId: id,
                    language,
                    email: '',
                }).catch(() => setIsLoading(false));
            }
        }
    }, [upgradeSubmissionId, language]);

    // Fetch scarcity (for social proof)
    useEffect(() => {
        const fetchScarcity = async () => {
            try {
                const result = await getScarcity();
                setScarcity(result);
            } catch (error) {
                console.error('Failed to fetch scarcity:', error);
            }
        };

        fetchScarcity();
        const interval = setInterval(fetchScarcity, 60000);
        return () => clearInterval(interval);
    }, []);

    // Shuffling animation + AI generation (parallel)
    useEffect(() => {
        if (step === 'shuffling' && submissionId && drawnCardIds.length === 3) {
            // Start AI generation immediately (don't wait for animation)
            generateReading();

            // Run animation in parallel
            const duration = 4000;
            const interval = 50;
            const steps = duration / interval;
            let current = 0;

            const timer = setInterval(() => {
                current++;
                setShufflingProgress((current / steps) * 100);
                if (current >= steps) {
                    clearInterval(timer);
                }
            }, interval);

            return () => clearInterval(timer);
        }
    }, [step, submissionId, drawnCardIds]);

    const generateReading = async () => {
        if (!submissionId || drawnCardIds.length !== 3) return;

        setIsLoading(true);
        try {
            // This triggers the AI + email in lib/actions.ts
            await selectCards(submissionId, drawnCardIds);
            setStep('reveal');
        } catch (error) {
            console.error('Failed to generate reading:', error);
            setError('Failed to generate your reading. Please refresh and try again.');
            setStep('form');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-dismiss error
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const onSubmit = async (data: FormData) => {
        setError(null);
        setIsLoading(true);

        try {
            setUserName(data.name);
            setUserEmail(data.email);
            setSubmissionTimestamp(new Date()); // Capture submission time for countdown
            const result = await submitRitual(data.name, data.email, data.question, language);

            setSubmissionId(result.submissionId);
            setDrawnCardIds(result.cardIds);
            setStep('shuffling');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to submit. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-purple-dark/10 to-charcoal relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="fixed inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-main rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-dark rounded-full filter blur-3xl"></div>
            </div>

            {/* Error Toast */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
                    >
                        <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-lg shadow-lg border border-red-400">
                            <div className="flex items-center justify-between">
                                <p className="font-medium">{error}</p>
                                <button onClick={() => setError(null)} className="ml-4 text-white hover:text-red-100">✕</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center"
                    >
                        <div className="bg-purple-gradient p-8 rounded-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scarcity Banner (CONVERSION: Social Proof + Urgency) */}
            {scarcity && scarcity.availableToday > 0 && scarcity.availableToday <= 3 && step === 'form' && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-4"
                >
                    <p className="text-sm md:text-base text-purple-light">
                        {t.scarcityTitle} <span className="text-orange-400 font-bold text-lg">{scarcity.availableToday}</span> {t.scarcitySlots}
                    </p>
                </motion.div>
            )}

            <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
                <AnimatePresence mode="wait">
                    {/* STEP 1: Hero + Form (CONVERSION OPTIMIZED) */}
                    {step === 'form' && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-5xl mx-auto"
                        >
                            {/* Hero Section */}
                            <div className="text-center mb-16 md:mb-20">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-block mb-6"
                                >
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                                        <div className="absolute inset-0 bg-purple-gradient rounded-full animate-pulse"></div>
                                        <div className="relative w-full h-full bg-bone-white rounded-full overflow-hidden flex items-center justify-center">
                                            <Image
                                                src="/logo.png"
                                                alt={t.siteName}
                                                width={160}
                                                height={160}
                                                className="object-cover scale-110 translate-y-2"
                                                style={{ objectPosition: 'center 40%' }}
                                                priority
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Site Name - The Iconic Mononym */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-2"
                                >
                                    <h1 className="text-2xl md:text-3xl font-serif text-purple-light mb-1">
                                        {t.siteName}
                                    </h1>
                                    <p className="text-sm md:text-base text-purple-light/70 italic">
                                        {t.tagline}
                                    </p>
                                </motion.div>

                                <motion.h2
                                    className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 text-purple-light mt-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {t.heroTitle}
                                </motion.h2>
                                <motion.p
                                    className="text-xl md:text-2xl mb-6 text-purple-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    {t.heroSubtitle}
                                </motion.p>
                            </div>

                            {/* Form Card - ONLY element with heavy styling for focus */}
                            <div className="bg-gradient-to-br from-purple-dark/30 to-purple-main/20 backdrop-blur-md border-2 border-purple-main/40 rounded-2xl p-6 md:p-10 shadow-2xl mb-16 max-w-2xl mx-auto">
                                <h2 className="text-2xl md:text-4xl font-serif text-center mb-3 text-white">
                                    {t.formTitle}
                                </h2>
                                <p className="text-center mb-8 text-purple-light text-base md:text-lg">
                                    {t.formSubtitle}
                                </p>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div>
                                        <input
                                            {...register('name', {
                                                required: 'Name is required',
                                                minLength: { value: 2, message: 'Name must be at least 2 characters' }
                                            })}
                                            type="text"
                                            placeholder={t.namePlaceholder}
                                            className="w-full px-5 py-4 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white placeholder-purple-light/40 focus:outline-none focus:border-purple-main transition-all text-base"
                                        />
                                        {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <input
                                            {...register('email', {
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            type="email"
                                            placeholder={t.emailPlaceholder}
                                            className="w-full px-5 py-4 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white placeholder-purple-light/40 focus:outline-none focus:border-purple-main transition-all text-base"
                                        />
                                        {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <textarea
                                            {...register('question', {
                                                required: 'Question is required',
                                                minLength: { value: 20, message: t.questionMinError }
                                            })}
                                            placeholder={t.questionPlaceholder}
                                            rows={4}
                                            className="w-full px-5 py-4 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white placeholder-purple-light/40 focus:outline-none focus:border-purple-main resize-none transition-all text-base"
                                        />
                                        {errors.question && <p className="text-red-400 text-sm mt-2">{errors.question.message}</p>}
                                        <p className="text-purple-light/50 text-xs mt-2 leading-relaxed">{t.questionHint}</p>
                                    </div>

                                    <p className="text-sm text-purple-light/70 text-center">{t.privacyNote}</p>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full px-8 py-5 bg-purple-gradient text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? t.submitting : t.submitButton}
                                    </motion.button>
                                </form>
                            </div>

                            {/* About Abigail - Clean, no heavy container */}
                            <div className="max-w-4xl mx-auto">
                                <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-8 items-center">
                                    <div className="mx-auto">
                                        <div className="relative w-40 h-40">
                                            <div className="absolute inset-0 bg-purple-gradient rounded-full"></div>
                                            <div className="relative w-full h-full bg-bone-white rounded-full overflow-hidden flex items-center justify-center">
                                                <Image
                                                    src="/logo.png"
                                                    alt="Abigail"
                                                    width={180}
                                                    height={180}
                                                    className="object-cover scale-110 translate-y-2"
                                                    style={{ objectPosition: 'center 40%' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3 text-bone-white text-center md:text-left">
                                        <h3 className="text-2xl md:text-3xl font-serif text-purple-light">
                                            {t.aboutTitle}
                                        </h3>
                                        <p className="text-sm md:text-base leading-relaxed opacity-90">{t.aboutText1}</p>
                                        <p className="text-sm md:text-base leading-relaxed opacity-90">{t.aboutText2}</p>
                                        <div className="inline-block bg-purple-gradient px-4 py-2 rounded-lg">
                                            <p className="text-white font-semibold text-sm">{t.aboutBadge}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Section - Byron's Certification Signals */}
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                        <div className="text-4xl mb-3">🛡️</div>
                                        <h4 className="text-purple-light font-semibold mb-2">{t.trustPoint1}</h4>
                                        <p className="text-sm text-bone-white/70">Centuries of wisdom preserved</p>
                                    </div>
                                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                        <div className="text-4xl mb-3">🎓</div>
                                        <h4 className="text-purple-light font-semibold mb-2">{t.trustPoint2}</h4>
                                        <p className="text-sm text-bone-white/70">Certified by recognized institute</p>
                                    </div>
                                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                        <div className="text-4xl mb-3">✋</div>
                                        <h4 className="text-purple-light font-semibold mb-2">{t.trustPoint3}</h4>
                                        <p className="text-sm text-bone-white/70">{t.trustPoint3Desc}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Shuffling */}
                    {step === 'shuffling' && (
                        <motion.div
                            key="shuffling"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto text-center min-h-screen flex flex-col justify-center"
                        >
                            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-purple-light">
                                {isLoading ? "✨ The Apprentice is interpreting your cards..." : t.shufflingTitle}
                            </h2>
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-purple-gradient rounded-3xl flex items-center justify-center shadow-2xl"
                                >
                                    <div className="text-8xl md:text-9xl">🎴</div>
                                </motion.div>
                                <div className="mt-6 px-8 max-w-md mx-auto">
                                    <div className="h-3 bg-purple-dark/30 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-purple-gradient"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${shufflingProgress}%` }}
                                            transition={{ duration: 0.1 }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg md:text-xl text-purple-light">
                                {isLoading ? "Please wait while we consult the cards..." : t.shufflingText}
                            </p>
                        </motion.div>
                    )}

                    {/* STEP 3: Card Reveal (CONVERSION: Build Anticipation) */}
                    {step === 'reveal' && drawnCardIds.length === 3 && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-5xl mx-auto"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-5xl font-serif mb-4 text-purple-light">
                                    {t.revealTitle}
                                </h2>
                                <p className="text-purple-light text-lg md:text-xl mb-2">{t.revealSubtitle}</p>
                                <p className="text-bone-white/80 text-base max-w-2xl mx-auto">{t.revealText}</p>
                            </div>

                            {/* Email Confirmation */}
                            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-4 mb-10 text-center max-w-2xl mx-auto">
                                <p className="text-green-400 font-semibold text-lg">
                                    {t.emailSent} <span className="text-purple-light">{userEmail}</span>
                                </p>
                                <p className="text-bone-white/70 text-sm mt-2">{t.emailNote}</p>
                            </div>

                            {/* Cards Display - Clean without heavy container */}
                            <div className="mb-10">
                                <h3 className="text-2xl md:text-3xl font-serif text-center mb-8 text-purple-light">{t.cardsMeaning}</h3>
                                <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
                                    {drawnCardIds.map((cardId, index) => {
                                        const card = getCard(cardId);
                                        if (!card) return null;

                                        return (
                                            <motion.div
                                                key={cardId}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.2 }}
                                                className="border border-purple-light/20 rounded-xl p-4 hover:border-purple-main/60 hover:scale-105 transition-all"
                                            >
                                                <div className="relative aspect-[2/3] mb-4 rounded-lg overflow-hidden shadow-lg">
                                                    <Image
                                                        src={`/cards/${getCardImageName(cardId)}.jpg`}
                                                        alt={card.name[language]}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h4 className="font-semibold text-center capitalize text-purple-light text-xl mb-2">
                                                    {card.name[language]}
                                                </h4>
                                                <p className="text-sm text-bone-white/70 text-center">
                                                    {card.shortMeaning[language]}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* URGENCY SECTION: 24-Hour Window + Direct Stripe Button */}
                            {submissionId && submissionTimestamp && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 1 }}
                                    className="mb-10 max-w-3xl mx-auto"
                                >
                                    <div className="bg-gradient-to-br from-red-900/30 via-purple-dark/30 to-red-900/30 border-2 border-red-500/50 rounded-2xl p-6 md:p-8">
                                        {/* Warning Icon & Title */}
                                        <div className="text-center mb-6">
                                            <div className="text-5xl mb-3">🌑</div>
                                            <h3 className="text-xl md:text-2xl font-serif text-bone-white/90 mb-4 leading-relaxed">
                                                {t.shadowIntro}
                                            </h3>
                                            <p className="text-purple-light text-lg font-semibold">
                                                {t.shadowText}
                                            </p>
                                        </div>

                                        {/* 24-Hour Countdown Timer */}
                                        <div className="mb-6">
                                            <p className="text-center text-bone-white/70 text-sm mb-4 uppercase tracking-wide">
                                                {t.urgencyTimer}
                                            </p>
                                            <CountdownTimer
                                                targetDate={new Date(submissionTimestamp.getTime() + 24 * 60 * 60 * 1000)}
                                                language={language}
                                            />
                                        </div>

                                        {/* Direct Stripe Checkout Button */}
                                        <div className="text-center">
                                            <button
                                                onClick={async () => {
                                                    setIsLoading(true);
                                                    try {
                                                        await redirectToCheckout({
                                                            submissionId,
                                                            language,
                                                            email: userEmail,
                                                        });
                                                        // Keep isLoading true — page will navigate away
                                                    } catch (error) {
                                                        setError('Failed to start checkout. Please try again.');
                                                        setIsLoading(false);
                                                    }
                                                }}
                                                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                                            >
                                                💳 {t.urgencyButton} — {formatPrice(language)}
                                            </button>
                                            <p className="text-bone-white/60 text-sm mt-3">
                                                🔒 100% Secure & Private. Abigail works in spiritual silence.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 4: Upsell (CONVERSION: Premium Offer) */}
                    {step === 'upsell' && (
                        <motion.div
                            key="upsell"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-5xl mx-auto space-y-12"
                        >
                            {/* Premium Offer - Keep styled for emphasis */}
                            <div className="bg-gradient-to-br from-purple-dark/30 to-purple-main/20 backdrop-blur-md border-2 border-purple-main rounded-2xl p-6 md:p-10 shadow-2xl">
                                <div className="text-center mb-8">
                                    <div className="inline-block bg-yellow-500 text-charcoal px-4 py-1 rounded-full text-sm font-bold mb-4">
                                        ⭐ PREMIUM UPGRADE
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-serif mb-3 text-white">
                                        {t.upsellTitle}
                                    </h2>
                                    <p className="text-xl text-purple-light">{t.upsellSubtitle}</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {[t.upsellFeature1, t.upsellFeature2, t.upsellFeature3, t.upsellFeature4].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
                                        >
                                            <span className="text-2xl flex-shrink-0">✓</span>
                                            <p className="text-bone-white">{feature}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="text-center space-y-4">
                                    <p className="text-4xl font-bold text-white">{t.upsellPrice}</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-12 py-5 bg-gradient-to-r from-yellow-500 to-orange-500 text-charcoal rounded-xl text-xl font-bold hover:shadow-2xl transition-all"
                                    >
                                        {t.upsellCta}
                                    </motion.button>
                                    <p className="text-sm text-purple-light">{t.upsellGuarantee}</p>
                                </div>
                            </div>

                            {/* Testimonials - Clean, no container */}
                            <div className="max-w-4xl mx-auto">
                                <h3 className="text-2xl md:text-4xl font-serif text-center mb-10 text-purple-light">
                                    {t.testimonialsTitle}
                                </h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        { quote: t.testimonial1, author: t.testimonial1Author },
                                        { quote: t.testimonial2, author: t.testimonial2Author },
                                        { quote: t.testimonial3, author: t.testimonial3Author },
                                    ].map((testimonial, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.15 }}
                                            className="border border-purple-light/10 p-6 rounded-xl"
                                        >
                                            <p className="text-bone-white italic mb-4 text-sm md:text-base">{testimonial.quote}</p>
                                            <p className="text-purple-light text-sm font-semibold">{testimonial.author}</p>
                                            <div className="text-yellow-500 mt-2">⭐⭐⭐⭐⭐</div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer with legal links */}
            <footer className="mt-16 pb-8 text-center text-xs text-bone-white/30 space-x-4">
                <a href="/privacy" className="hover:text-bone-white/60 transition-colors">Privacy Policy</a>
                <span>·</span>
                <a href="/terms" className="hover:text-bone-white/60 transition-colors">Terms of Service</a>
                <span>·</span>
                <a href="/refund" className="hover:text-bone-white/60 transition-colors">Refund Policy</a>
            </footer>
        </div>
    );
}

// Wrapper component with Suspense boundary for useSearchParams
export default function LanguagePageWithSuspense(props: LandingPageProps) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-charcoal" />}>
            <LanguagePage {...props} />
        </Suspense>
    );
}

