/**
 * AI Prompt Test Script
 * Tests the current Gemini prompt and shows word count + raw output
 *
 * Usage:
 *   node test-ai-prompt.mjs
 *   node test-ai-prompt.mjs --lang pt --name "Bolota" --question "Vou conseguir o emprego?"
 *   node test-ai-prompt.mjs --lang en --name "Daniel" --question "Will my business succeed?"
 *   node test-ai-prompt.mjs --lang de --name "Thomas" --question "Wie wird meine Karriere?"
 *   node test-ai-prompt.mjs --lang hu --name "Maria" --question "Mi lesz a kapcsolatommal?"
 *   node test-ai-prompt.mjs --model gemini-1.5-flash  (try a specific model)
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// --- Load .env.local ---
try {
  const envFile = readFileSync(join(__dirname, '.env.local'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    const val = trimmed.substring(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    process.env[key] = process.env[key] ?? val;
  }
  console.log('✅ Loaded .env.local\n');
} catch {
  console.log('⚠️  No .env.local found — using existing process.env\n');
}

// --- Parse CLI args ---
const args = process.argv.slice(2);
const getArg = (flag) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
};

const lang     = getArg('--lang')     || 'pt';
const userName = getArg('--name')     || 'Bolota';
const question = getArg('--question') || 'Vou conseguir o novo emprego?';
const modelArg = getArg('--model')    || null;

// --- Sample cards (pick any 3 by ID, 0-35) ---
// You can change these IDs to test different combinations
const SAMPLE_CARD_IDS = [11, 29, 21]; // Priest, Fidelity, Illness

const CARDS = {
  11: { en: "Priest",    de: "Geistlicher", pt: "Sacerdote", hu: "Pap",
        meaning: { en: "Spiritual guidance, wisdom, or an older man as a person card.",
                   de: "Spirituelle Führung, Weisheit, oder als Personenkarte ein älterer Mann.",
                   pt: "Orientação espiritual, sabedoria, ou como carta de pessoa, um homem mais velho.",
                   hu: "Spirituális vezetés, bölcsesség, vagy személykártyaként egy idősebb férfi." } },
  29: { en: "Fidelity",  de: "Treue",       pt: "Fidelidade", hu: "Hűség",
        meaning: { en: "Loyalty, faithfulness, and commitment in relationships.",
                   de: "Loyalität, Treue und Engagement in Beziehungen.",
                   pt: "Lealdade, fidelidade e comprometimento nos relacionamentos.",
                   hu: "Lojalitás, hűség és elkötelezettség a kapcsolatokban." } },
  21: { en: "Illness",   de: "Krankheit",   pt: "Doença",    hu: "Betegség",
        meaning: { en: "Health issues, physical or emotional challenges.",
                   de: "Gesundheitsprobleme, körperliche oder emotionale Herausforderungen.",
                   pt: "Problemas de saúde, desafios físicos ou emocionais.",
                   hu: "Egészségügyi problémák, fizikai vagy érzelmi kihívások." } },
};

const LANGUAGE_INSTRUCTIONS = {
  en: 'CRITICAL: You MUST respond ENTIRELY in English with a professional, mystical tone. Do NOT use any other language.',
  de: 'KRITISCH: Sie MÜSSEN VOLLSTÄNDIG auf Deutsch antworten, in einem professionellen, mystischen Ton. Verwenden Sie KEINE andere Sprache.',
  pt: 'CRÍTICO: Você DEVE responder INTEIRAMENTE em português com um tom místico e profissional. NÃO use nenhum outro idioma.',
  hu: 'KRITIKUS: TELJES EGÉSZÉBEN magyarul kell válaszolnia, misztikus és professzionális hangnemben. NE használjon más nyelvet.',
};

function buildPrompt(name, question, lang) {
  const firstName = name.split(' ')[0];
  const cards = SAMPLE_CARD_IDS.map(id => CARDS[id]);
  const langInstruction = LANGUAGE_INSTRUCTIONS[lang];

  const systemPrompt = `You are the Apprentice of Abigail, The Hungarian Oracle. Write a teaser reading for ${firstName} about: "${question}"

Language: ${langInstruction}

Cards drawn:
1. ${cards[0][lang]} - ${cards[0].meaning[lang]}
2. ${cards[1][lang]} - ${cards[1].meaning[lang]}
3. ${cards[2][lang]} - ${cards[2].meaning[lang]}

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
1. Stay within the 200-230 word limit.
2. End naturally and completely — do not truncate or cut off mid-sentence.
3. All 3 cards must have COMPLETE interpretations. No cutoffs.
4. The "gap" is not in the cards themselves, but in the PATTERN they form together.
5. Write in ${lang} language only.
6. Use ONLY the first name in the greeting.`;

  const userPrompt = `Write the reading for ${firstName}.

Stay within the 200-230 word limit.
End naturally and completely — do not truncate or cut off mid-sentence.

Provide COMPLETE interpretations for all 3 cards.
Then add the "Master's Observation" revealing the Shadow Connection that requires Abigail's physical 36-card ritual.`;

  return { systemPrompt, userPrompt };
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function printSeparator(label) {
  const line = '─'.repeat(60);
  console.log(`\n${line}`);
  if (label) console.log(`  ${label}`);
  console.log(line);
}

// --- Main ---
async function main() {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    console.error('❌ GOOGLE_AI_API_KEY not found in environment or .env.local');
    process.exit(1);
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);

  const { systemPrompt, userPrompt } = buildPrompt(userName, question, lang);
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  printSeparator('TEST CONFIGURATION');
  console.log(`  Language : ${lang.toUpperCase()}`);
  console.log(`  Name     : ${userName}`);
  console.log(`  Question : ${question}`);
  console.log(`  Cards    : ${SAMPLE_CARD_IDS.map(id => CARDS[id][lang]).join(', ')}`);

  printSeparator('SYSTEM PROMPT');
  console.log(systemPrompt);

  printSeparator('USER PROMPT');
  console.log(userPrompt);

  // Models to try
  // Models to try, with optional thinkingBudget override (0 = disable thinking)
  const modelsToTry = modelArg
    ? [{ name: modelArg, thinkingBudget: null }]
    : [
        { name: 'gemini-3-flash-preview',    thinkingBudget: 0    }, // disable thinking → full output
        { name: 'gemini-2.5-flash-preview',  thinkingBudget: 0    },
        { name: 'gemini-2.0-flash',          thinkingBudget: null },
        { name: 'gemini-2.0-flash-exp',      thinkingBudget: null },
        { name: 'gemini-1.5-flash',          thinkingBudget: null },
      ];

  for (const { name: modelName, thinkingBudget } of modelsToTry) {
    try {
      const label = thinkingBudget === 0 ? `${modelName} (thinking disabled)` : modelName;
      printSeparator(`TRYING MODEL: ${label}`);
      console.log('  ⏳ Generating...\n');

      const modelConfig = {
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      };

      // Disable thinking for models that support thinkingConfig
      if (thinkingBudget === 0) {
        modelConfig.generationConfig.thinkingConfig = { thinkingBudget: 0 };
      }

      const model = genAI.getGenerativeModel(modelConfig);

      const start = Date.now();
      const result = await model.generateContent(fullPrompt);
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const response = result.response;
      const text = response.text();

      // Inspect response metadata
      const candidate = response.candidates?.[0];
      const finishReason = candidate?.finishReason;
      const tokenCount = response.usageMetadata;
      console.log(`  Finish reason : ${finishReason}`);
      console.log(`  Usage         : input=${tokenCount?.promptTokenCount} output=${tokenCount?.candidatesTokenCount} total=${tokenCount?.totalTokenCount}`);

      printSeparator(`✅ RAW OUTPUT (${modelName}) — ${elapsed}s`);
      console.log(text);

      const wordCount = countWords(text);
      const lastChar = text.trim().slice(-1);
      const endsCleanly = ['.', '!', '?', '»', '»'].includes(lastChar);

      printSeparator('📊 ANALYSIS');
      console.log(`  Word count    : ${wordCount} words`);
      console.log(`  Target range  : 200-230 words`);
      console.log(`  Status        : ${wordCount < 200 ? '⚠️  TOO SHORT' : wordCount > 230 ? '⚠️  TOO LONG' : '✅ IN RANGE'}`);
      console.log(`  Ends cleanly  : ${endsCleanly ? '✅ Yes' : '⚠️  No (last char: "' + lastChar + '")'}`);
      console.log(`  Has P.S.      : ${text.toLowerCase().includes('p.s') ? '✅ Yes' : '❌ No'}`);

      // Check for truncation patterns
      const truncationPatterns = [' com\n', ' e\n', ' que\n', ' a\n', ' de\n', ' the\n', ' and\n', ' with\n'];
      const hasTruncation = truncationPatterns.some(p => text.includes(p.trim().replace('\n', '')));
      if (!endsCleanly) {
        console.log(`\n  ⚠️  POSSIBLE TRUNCATION DETECTED`);
      }

      console.log('\n');
      break; // Stop at first successful model

    } catch (err) {
      console.log(`  ❌ Failed: ${err.message?.substring(0, 100)}`);
    }
  }
}

main().catch(console.error);
