/**
 * AI Service - Multi-provider support (Gemini Free / Anthropic Paid)
 * Generates personalized "Apprentice" readings for card draws
 */

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Card } from './cards';
import { AI_CONFIG, type Language } from './constants';

// Initialize providers based on environment
const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const gemini = process.env.GOOGLE_AI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    : null;

// Choose provider: 'gemini' (free) or 'anthropic' (paid)
const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini') as 'gemini' | 'anthropic';

interface ApprenticeReading {
    interpretation: string;  // 3 paragraphs of card interpretation
    cliffhangerPS: string;   // The hook for the upsell
    cardFocus: string;       // Which card the P.S. focuses on
}

const LANGUAGE_INSTRUCTIONS = {
    en: 'CRITICAL: You MUST respond ENTIRELY in English with a professional, mystical tone. Do NOT use any other language.',
    de: 'KRITISCH: Sie MÜSSEN VOLLSTÄNDIG auf Deutsch antworten, in einem professionellen, mystischen Ton. Verwenden Sie KEINE andere Sprache.',
    pt: 'CRÍTICO: Você DEVE responder INTEIRAMENTE em português com um tom místico e profissional. NÃO use nenhum outro idioma.',
    hu: 'KRITIKUS: TELJES EGÉSZÉBEN magyarul kell válaszolnia, misztikus és professzionális hangnemben. NE használjon más nyelvet.',
};

/**
 * Generate the Apprentice's reading using AI
 */
export async function generateApprenticeReading(
    userName: string,
    question: string,
    cards: Card[],
    language: Language
): Promise<ApprenticeReading> {

    // Try AI providers in order of preference
    if (AI_PROVIDER === 'anthropic' && anthropic) {
        return generateWithAnthropic(userName, question, cards, language);
    }

    if (AI_PROVIDER === 'gemini' && gemini) {
        return generateWithGemini(userName, question, cards, language);
    }

    // Fallback if no AI configured
    console.warn('No AI provider configured, using fallback templates');
    return generateFallbackReading(userName, question, cards, language);
}

/**
 * Generate with Anthropic Claude (Paid)
 */
async function generateWithAnthropic(
    userName: string,
    question: string,
    cards: Card[],
    language: Language
): Promise<ApprenticeReading> {

    try {
        const systemPrompt = buildSystemPrompt(userName, question, cards, language);

        const message = await anthropic!.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: AI_CONFIG.maxOutputTokens,
            temperature: AI_CONFIG.temperature,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Write the reading for ${userName.split(' ')[0]}.

Stay within the 150-180 word limit.
End naturally and completely — do not truncate or cut off mid-sentence.

Provide COMPLETE interpretations for all 3 cards.
Then add the "Master's Observation" revealing the Shadow Connection that requires Abigail's physical 36-card ritual.`
                }
            ]
        });

        const content = message.content[0];
        if (content.type !== 'text') {
            throw new Error('Unexpected response type from Claude');
        }

        return parseAIResponse(content.text, cards[0].name[language], language);

    } catch (error) {
        console.error('Anthropic reading generation failed:', error);
        return generateFallbackReading(userName, question, cards, language);
    }
}

/**
 * Generate with Google Gemini (Free)
 */
async function generateWithGemini(
    userName: string,
    question: string,
    cards: Card[],
    language: Language
): Promise<ApprenticeReading> {

    try {
        // Try different models in order of preference (free tier compatible)
        const modelsToTry = [
            'gemini-3-flash-preview',   // Latest preview model (Python SDK works)
            'gemini-2.0-flash-exp',     // Gemini 2.0 experimental
            'gemini-1.5-flash-8b',      // Smaller, faster, free tier
            'gemini-1.5-flash',         // Standard free tier model
            'gemini-pro',               // Older free tier model
        ];

        let lastError: any = null;

        for (const modelName of modelsToTry) {
            try {
                const model = gemini!.getGenerativeModel({
                    model: modelName,
                    generationConfig: {
                        temperature: AI_CONFIG.temperature,
                        maxOutputTokens: AI_CONFIG.maxOutputTokens,
                    }
                });

                const systemPrompt = buildSystemPrompt(userName, question, cards, language);
                const userPrompt = `Write the reading for ${userName.split(' ')[0]}.

Stay within the 150-180 word limit.
End naturally and completely — do not truncate or cut off mid-sentence.

Provide COMPLETE interpretations for all 3 cards.
Then add the "Master's Observation" revealing the Shadow Connection that requires Abigail's physical 36-card ritual.`;

                const result = await model.generateContent(`${systemPrompt}\n\n${userPrompt}`);
                const response = result.response;
                const text = response.text();

                console.log(`✅ Gemini reading generated successfully with ${modelName}`);
                return parseAIResponse(text, cards[0].name[language], language);

            } catch (modelError: any) {
                lastError = modelError;
                const errMsg = modelError.message?.substring(0, 100) || 'Unknown error';
                console.log(`⚠️  Model ${modelName} failed: ${errMsg}`);
                continue;
            }
        }

        // All models failed, throw to use fallback
        throw lastError || new Error('All Gemini models failed');

    } catch (error) {
        console.error('Gemini reading generation failed, using fallback:', error);
        return generateFallbackReading(userName, question, cards, language);
    }
}

/**
 * Build the System Prompt for AI
 */
function buildSystemPrompt(
    userName: string,
    question: string,
    cards: Card[],
    language: Language
): string {
    const languageInstruction = LANGUAGE_INSTRUCTIONS[language];
    
    // Extract first name only for greeting
    const firstName = userName.split(' ')[0];

    return `You are the Apprentice of Abigail, The Hungarian Oracle. Write a teaser reading for ${firstName} about: "${question}"

Language: ${languageInstruction}

Cards drawn:
1. ${cards[0].name[language]} - ${cards[0].shortMeaning[language]}
2. ${cards[1].name[language]} - ${cards[1].shortMeaning[language]}
3. ${cards[2].name[language]} - ${cards[2].shortMeaning[language]}

Write a reading with this structure:

**Greeting** (1 sentence)
- Use ONLY the first name: "Greetings, ${firstName}," (NOT the full name)

**Card 1** (2-3 sentences)
- Provide a complete, empathetic interpretation of this card's meaning

**Card 2** (2-3 sentences)
- Provide a complete, empathetic interpretation of this card's meaning

**Card 3** (2-3 sentences)
- Provide a complete, empathetic interpretation of this card's meaning

**Master's Observation** (2-3 sentences - THE HOOK)
- State that while each individual card is clear, the way these 3 specific cards are interacting creates a complex energy signature (a "Hidden Link" or "Shadow Path")
- Explain that you (the Apprentice) cannot decipher this deeper pattern with digital cards alone
- State: "There is a deeper pattern forming here that requires Abigail's physical 36-card ritual to safely uncover. Abigail has sensed a specific shadow regarding [the user's question/context] that only the Grand Tableau can reveal."

**P.S.** (1-2 sentences creating urgency)
- Emphasize that Abigail is ready to perform the physical ritual now

CRITICAL RULES:
1. Stay within the 150-180 word limit.
2. End naturally and completely — do not truncate or cut off mid-sentence.
3. All 3 cards must have COMPLETE interpretations. No cutoffs.
4. The "gap" is not in the cards themselves, but in the PATTERN they form together.
5. Write in ${language} language only.
6. Use ONLY the first name in the greeting.`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response: string, defaultCard: string, language: Language): ApprenticeReading {
    // Remove markdown formatting (**, __, etc.)
    let cleaned = response
        .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold**
        .replace(/__([^_]+)__/g, '$1')      // Remove __underline__
        .replace(/\*([^*]+)\*/g, '$1')      // Remove *italic*
        .replace(/^#{1,6}\s+/gm, '')        // Remove markdown headers
        .trim();

    // Split by P.S. marker
    const parts = cleaned.split(/P\.S\./i);

    const interpretation = parts[0].trim();

    // Language-specific fallbacks
    const fallbackPS = {
        en: `I sense there is more hidden beneath the surface. Abigail's full reading would reveal the complete picture.`,
        de: `Ich spüre, dass mehr unter der Oberfläche verborgen liegt. Abigails vollständige Lesung würde das ganze Bild enthüllen.`,
        pt: `Sinto que há mais escondido sob a superfície. A leitura completa de Abigail revelaria o quadro completo.`,
        hu: `Érzem, hogy több rejtőzik a felszín alatt. Abigail teljes olvasata feltárná a teljes képet.`,
    };

    const cliffhangerPS = parts[1] ? parts[1].trim() : fallbackPS[language];

    return {
        interpretation,
        cliffhangerPS,
        cardFocus: defaultCard
    };
}

/**
 * Fallback reading if AI is unavailable
 */
function generateFallbackReading(
    userName: string,
    question: string,
    cards: Card[],
    language: Language
): ApprenticeReading {

    const templates = {
        en: {
            intro: `Dear ${userName}, I am the Apprentice of Abigail, The Hungarian Oracle. I have drawn three cards in response to your question about ${question.substring(0, 50)}...`,
            interpretation: cards.map((card, i) =>
                `Card ${i + 1}: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `While these preliminary cards offer a glimpse, Abigail is currently consulting her physical deck in the Hungarian tradition. Only her premium reading—which includes a physical card spread, a personalized photo of your actual spread, and deep comprehensive analysis—can reveal the deeper currents and hidden influences at play in your situation.`,
            ps: `P.S. I noticed ${cards[0].name[language]} in your reading. This card holds secrets that only reveal themselves when Abigail performs the complete ritual with her physical deck.`
        },
        de: {
            intro: `Liebe/r ${userName}, ich bin der Lehrling von Abigail, dem Ungarischen Orakel. Ich habe drei Karten als Antwort auf Ihre Frage gezogen...`,
            interpretation: cards.map((card, i) =>
                `Karte ${i + 1}: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Während diese vorläufigen Karten einen Einblick bieten, konsultiert Abigail derzeit ihr physisches Deck in der ungarischen Tradition. Nur ihre Premium-Lesung – die eine physische Kartenlegung, ein personalisiertes Foto Ihrer tatsächlichen Legung und eine tiefgehende umfassende Analyse umfasst – kann die tieferen Strömungen und verborgenen Einflüsse in Ihrer Situation offenbaren.`,
            ps: `P.S. Ich bemerkte ${cards[0].name[language]} in Ihrer Lesung. Diese Karte birgt Geheimnisse, die sich nur offenbaren, wenn Abigail das vollständige Ritual mit ihrem physischen Deck durchführt.`
        },
        pt: {
            intro: `Caro/a ${userName}, sou o Aprendiz de Abigail, A Oráculo Húngara. Tirei três cartas em resposta à sua pergunta...`,
            interpretation: cards.map((card, i) =>
                `Carta ${i + 1}: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Embora essas cartas preliminares ofereçam um vislumbre, Abigail está atualmente consultando seu baralho físico na tradição húngara. Somente sua leitura premium—que inclui uma disposição física das cartas, uma foto personalizada da sua disposição real e análise profunda e abrangente—pode revelar as correntes mais profundas e influências ocultas em sua situação.`,
            ps: `P.S. Notei ${cards[0].name[language]} em sua leitura. Esta carta guarda segredos que só se revelam quando Abigail realiza o ritual completo com seu baralho físico.`
        },
        hu: {
            intro: `Kedves ${userName}, én vagyok Abigail, A Magyar Jósnő tanítványa. Három kártyát húztam válaszként a kérdésére...`,
            interpretation: cards.map((card, i) =>
                `${i + 1}. kártya: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Bár ezek az előzetes kártyák betekintést nyújtanak, Abigail jelenleg a fizikai pakliját konzultálja a magyar hagyomány szerint. Csak a prémium olvasata – amely magában foglal egy fizikai kártyavetést, egy személyre szabott fotót a tényleges vetésről és mélyreható átfogó elemzést – tárhatja fel a helyzetében rejlő mélyebb áramlatokat és rejtett befolyásokat.`,
            ps: `P.S. Észrevettem a ${cards[0].name[language]} kártyát az olvasatában. Ez a kártya olyan titkokat rejt, amelyek csak akkor tárulnak fel, amikor Abigail elvégzi a teljes rituálét fizikai paklijával.`
        }
    };

    const template = templates[language];

    return {
        interpretation: `${template.intro}\n\n${template.interpretation}\n\n${template.hook}`,
        cliffhangerPS: template.ps,
        cardFocus: cards[0].name[language]
    };
}

