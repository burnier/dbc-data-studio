/**
 * AI Service - Multi-provider support (Gemini Free / Anthropic Paid)
 * Generates personalized "Apprentice" readings for card draws
 */

import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Card } from './cards';

// Initialize providers based on environment
const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

const gemini = process.env.GOOGLE_AI_API_KEY
    ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    : null;

// Choose provider: 'gemini' (free) or 'anthropic' (paid)
const AI_PROVIDER = (process.env.AI_PROVIDER || 'gemini') as 'gemini' | 'anthropic';

type Language = 'en' | 'de' | 'pt' | 'hu';

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
            max_tokens: 1024,
            temperature: 0.7,
            system: systemPrompt,
            messages: [
                {
                    role: 'user',
                    content: `Generate a 3-paragraph interpretation of these cards for ${userName}, followed by a personalized P.S. that creates intrigue about one specific card's deeper meaning that only Abigail can uncover.`
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
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                });

                const systemPrompt = buildSystemPrompt(userName, question, cards, language);
                const userPrompt = `Generate a 3-paragraph interpretation of these cards for ${userName}, followed by a personalized P.S. that creates intrigue about one specific card's deeper meaning that only Abigail can uncover.`;

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

    return `You are the Apprentice of Abigail, The Hungarian Oracle - a certified practitioner of the Hungarian Gypsy Card Institute (Cigánykártya Magyarország). Your tone is empathetic, mystical, professional, and encouraging. You are writing a 3-card preliminary reading for a seeker named ${userName} who asked: "${question}".

⚠️ LANGUAGE REQUIREMENT - READ THIS FIRST:
${languageInstruction}
YOU MUST write your ENTIRE response in the specified language. Every single word, sentence, and paragraph must be in this language. DO NOT mix languages. DO NOT switch to English mid-response.

The 3 cards drawn are:
1. ${cards[0].name[language]} - ${cards[0].shortMeaning[language]}
2. ${cards[1].name[language]} - ${cards[1].shortMeaning[language]}
3. ${cards[2].name[language]} - ${cards[2].shortMeaning[language]}

RULES:
- Use the traditional meanings of the cards provided above
- Do not be overly 'dark' or 'scary', but do not ignore warnings in the cards
- Write exactly 3 paragraphs of interpretation
- Be specific to ${userName}'s question: "${question}"
- Do not use generic horoscope language - be insightful and personal
- REMEMBER: Write EVERYTHING in the specified language above

THE CONVERSION HOOK:
After the 3 paragraphs, explain that while this preliminary digital reading offers a glimpse, only a physical 12-card spread performed by Abigail using her physical deck in the Hungarian tradition can provide the absolute clarity required for deep life questions. Mention that Abigail is currently consulting her physical deck. Use phrases like "the shadows between the cards" or "the hidden currents" that only Abigail can see with her manual spread.

THE P.S.:
Create a personalized P.S. that highlights ONE specific card from their draw as a 'mystery' or 'concern' that Abigail needs to uncover with her physical deck. Choose the most pivotal, complex, or concerning card. Format it as:

P.S. [Your 2-sentence cliffhanger about a specific card]

Example tone: "I see the light in your cards, ${userName}, but only Abigail has the sight to look into the shadows between them."

FINAL REMINDER: Your entire response must be in the specified language. Check your response before submitting to ensure no English words appear if the language is not English.`;
}

/**
 * Parse AI response into structured format
 */
function parseAIResponse(response: string, defaultCard: string, language: Language): ApprenticeReading {
    // Split by P.S. marker
    const parts = response.split(/P\.S\./i);

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
            hook: `While these preliminary cards offer a glimpse, Abigail is currently consulting her physical deck in the Hungarian tradition. Only her full 12-card spread can reveal the deeper currents and hidden influences at play in your situation.`,
            ps: `P.S. I noticed ${cards[0].name[language]} in your reading. This card carries the dust and wisdom of Eastern Europe, and often holds secrets that only reveal themselves when Abigail performs the complete ritual in her studio.`
        },
        de: {
            intro: `Liebe/r ${userName}, ich bin der Lehrling von Abigail, dem Ungarischen Orakel. Ich habe drei Karten als Antwort auf Ihre Frage gezogen...`,
            interpretation: cards.map((card, i) =>
                `Karte ${i + 1}: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Während diese vorläufigen Karten einen Einblick bieten, konsultiert Abigail derzeit ihr physisches Deck in der ungarischen Tradition. Nur ihre vollständige 12-Karten-Lesung kann die tieferen Strömungen und verborgenen Einflüsse in Ihrer Situation offenbaren.`,
            ps: `P.S. Ich bemerkte ${cards[0].name[language]} in Ihrer Lesung. Diese Karte trägt den Staub und die Weisheit Osteuropas und birgt oft Geheimnisse, die sich nur offenbaren, wenn Abigail das vollständige Ritual in ihrem Studio durchführt.`
        },
        pt: {
            intro: `Caro/a ${userName}, sou o Aprendiz de Abigail, A Oráculo Húngara. Tirei três cartas em resposta à sua pergunta...`,
            interpretation: cards.map((card, i) =>
                `Carta ${i + 1}: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Embora essas cartas preliminares ofereçam um vislumbre, Abigail está atualmente consultando seu baralho físico na tradição húngara. Somente sua leitura completa de 12 cartas pode revelar as correntes mais profundas e influências ocultas em sua situação.`,
            ps: `P.S. Notei ${cards[0].name[language]} em sua leitura. Esta carta carrega o pó e a sabedoria do Leste Europeu, e frequentemente guarda segredos que só se revelam quando Abigail realiza o ritual completo em seu estúdio.`
        },
        hu: {
            intro: `Kedves ${userName}, én vagyok Abigail, A Magyar Jósnő tanítványa. Három kártyát húztam válaszként a kérdésére...`,
            interpretation: cards.map((card, i) =>
                `${i + 1}. kártya: ${card.name[language]} - ${card.shortMeaning[language]}`
            ).join('\n\n'),
            hook: `Bár ezek az előzetes kártyák betekintést nyújtanak, Abigail jelenleg a fizikai pakliját konzultálja a magyar hagyomány szerint. Csak a teljes 12 kártyás olvasata tárhatja fel a helyzetében rejlő mélyebb áramlatokat és rejtett befolyásokat.`,
            ps: `P.S. Észrevettem a ${cards[0].name[language]} kártyát az olvasatában. Ez a kártya Kelet-Európa porát és bölcsességét hordozza, és gyakran olyan titkokat rejt, amelyek csak akkor tárulnak fel, amikor Abigail elvégzi a teljes rituálét a műtermében.`
        }
    };

    const template = templates[language];

    return {
        interpretation: `${template.intro}\n\n${template.interpretation}\n\n${template.hook}`,
        cliffhangerPS: template.ps,
        cardFocus: cards[0].name[language]
    };
}

