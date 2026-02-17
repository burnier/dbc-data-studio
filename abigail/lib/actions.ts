/**
 * Server Actions for the Ritual funnel.
 * Handles form submission, card selection, and email sending.
 */
"use server";

import { db } from "./db";
import { submissions } from "./db/schema";
import { sendReadingEmail } from "./email";
import { CARDS, getCards, getCardImageName, type Card } from "./cards";
import { generateApprenticeReading } from "./ai";
import { randomInt } from "crypto";
import { eq, and, gte, desc } from "drizzle-orm";
import { ritualFormSchema, cardSelectionSchema } from "./validation";
import { headers } from "next/headers";
import { RATE_LIMITS, CARDS as CARD_CONSTANTS } from "./constants";

// Simple in-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW = RATE_LIMITS.timeWindowHours * 60 * 60 * 1000;
const MAX_SUBMISSIONS_PER_HOUR = RATE_LIMITS.maxSubmissionsPerEmail;

function getRateLimitKey(email: string): string {
  return `rate_limit_${email.toLowerCase()}`;
}

function checkRateLimit(email: string): boolean {
  const key = getRateLimitKey(email);
  const now = Date.now();
  const limit = rateLimitMap.get(key);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (limit.count >= MAX_SUBMISSIONS_PER_HOUR) {
    return false;
  }

  limit.count++;
  return true;
}

export interface SubmitRitualResult {
  submissionId: number;
  cardIds: number[];
  message: string;
}

export interface SelectCardsResult {
  previewText: string;
  readingText: string;
  emailSent: boolean;
  cardNames: string[];
}

/**
 * Step 1: Submit ritual form
 * Randomly selects 3 cards and creates submission record.
 */
export async function submitRitual(
  name: string,
  email: string,
  question: string,
  language: string
): Promise<SubmitRitualResult> {
  // Validate input
  const validation = ritualFormSchema.safeParse({ name, email, question, language });
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  const { name: validName, email: validEmail, question: validQuestion, language: validLanguage } = validation.data;

  // Check rate limit
  if (!checkRateLimit(validEmail)) {
    throw new Error("Too many submissions. Please try again later.");
  }

  // Randomly select 3 unique cards
  const allCardIds = Array.from({ length: CARD_CONSTANTS.totalCards }, (_, i) => i);
  const selectedIds: number[] = [];
  while (selectedIds.length < CARD_CONSTANTS.cardsPerReading) {
    const randomId = randomInt(0, CARD_CONSTANTS.totalCards);
    if (!selectedIds.includes(randomId)) {
      selectedIds.push(randomId);
    }
  }

  // Create submission record
  const [submission] = await db
    .insert(submissions)
    .values({
      email: validEmail,
      name: validName,
      question: validQuestion,
      cardIdsDrawn: JSON.stringify(selectedIds),
      language: validLanguage,
      trialCompleted: false,
      paidUpgrade: false,
    })
    .returning();

  const messages = {
    en: "The cards are ready. Click to reveal your destiny.",
    de: "Die Karten sind bereit. Klicken Sie, um Ihr Schicksal zu enthüllen.",
    pt: "As cartas estão prontas. Clique para revelar seu destino.",
    hu: "A kártyák készen állnak. Kattintson, hogy felfedje a sorsát.",
  };

  return {
    submissionId: submission.id,
    cardIds: selectedIds,
    message: messages[language as keyof typeof messages] || messages.en,
  };
}

/**
 * Step 2: User selects cards
 * Generates preview and full reading, sends email.
 */
export async function selectCards(
  submissionId: number,
  selectedCardIds: number[]
): Promise<SelectCardsResult> {
  // Validate input
  const validation = cardSelectionSchema.safeParse({ submissionId, selectedCardIds });
  if (!validation.success) {
    throw new Error(validation.error.errors[0].message);
  }

  // Get submission
  const submission = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1).then(r => r[0]);

  if (!submission) {
    throw new Error("Submission not found");
  }

  // Verify card IDs match
  const storedCardIds = JSON.parse(submission.cardIdsDrawn) as number[];
  if (
    new Set(selectedCardIds).size !== 3 ||
    !selectedCardIds.every((id) => storedCardIds.includes(id))
  ) {
    throw new Error("Invalid card selection");
  }

  // Get cards
  const cards = getCards(selectedCardIds);
  const language = submission.language as "en" | "de" | "pt" | "hu";

  // Generate AI reading from the Apprentice
  const aiReading = await generateApprenticeReading(
    submission.name,
    submission.question,
    cards,
    language
  );

  // Format reading text with AI interpretation
  const readingText = `${aiReading.interpretation}\n\n---\n\n${aiReading.cliffhangerPS}`;
  const previewText = aiReading.interpretation.substring(0, 200) + '...';

  // Get card names for email
  const cardNames = cards.map((card) => card.name[language]);
  const thirdCardName = cards[2]?.name[language]; // For personalized P.S.

  // Send email
  const emailSent = await sendReadingEmail({
    toEmail: submission.email,
    toName: submission.name,
    readingText,
    cardNames,
    cardIds: selectedCardIds,
    language,
    thirdCardName,
    submissionId: submission.id,
  });

  // Update submission
  await db
    .update(submissions)
    .set({
      previewText,
      readingText,
      trialCompleted: true,
      emailSent,
      emailSentAt: emailSent ? new Date() : null,
    })
    .where(eq(submissions.id, submissionId));

  return {
    previewText,
    readingText,
    emailSent,
    cardNames,
  };
}

/**
 * Generate reading text from cards.
 */
function generateReading(
  cards: Card[],
  language: "en" | "de" | "pt" | "hu",
  question: string
): { previewText: string; readingText: string } {
  if (cards.length !== 3) {
    throw new Error("Exactly 3 cards required");
  }

  const templates = {
    en: {
      start: "The cards have spoken. The first card",
      connector: "reveals that",
      middle: "However, the second card",
      warns: "warns of",
      end: "Finally, the third card",
      reveals: "reveals that",
      conclusion:
        "These three cards together form a powerful message for your journey ahead.",
    },
    de: {
      start: "Die Karten haben gesprochen. Die erste Karte",
      connector: "zeigt, dass",
      middle: "Die zweite Karte",
      warns: "warnt vor",
      end: "Schließlich zeigt die dritte Karte",
      reveals: "dass",
      conclusion:
        "Diese drei Karten bilden zusammen eine kraftvolle Botschaft für deine Reise voraus.",
    },
    pt: {
      start: "As cartas falaram. A primeira carta",
      connector: "revela que",
      middle: "No entanto, a segunda carta",
      warns: "adverte sobre",
      end: "Finalmente, a terceira carta",
      reveals: "revela que",
      conclusion:
        "Essas três cartas juntas formam uma mensagem poderosa para sua jornada à frente.",
    },
    hu: {
      start: "A kártyák megszólaltak. Az első kártya",
      connector: "azt mutatja, hogy",
      middle: "A második kártya azonban",
      warns: "figyelmeztet",
      end: "Végül a harmadik kártya",
      reveals: "azt mutatja, hogy",
      conclusion:
        "Ez a három kártya együtt erős üzenetet alkot az előtted álló útra.",
    },
  };

  const t = templates[language];
  const [card1, card2, card3] = cards;
  const meaning1 = card1.shortMeaning[language];
  const meaning2 = card2.shortMeaning[language];
  const meaning3 = card3.shortMeaning[language];

  // Full reading
  const readingText = `${t.start} ${t.connector} ${meaning1}. ${t.middle} ${t.warns} ${meaning2}. ${t.end} ${t.reveals} ${meaning3}. ${t.conclusion}`;

  // Preview (1-2 sentences)
  const previewText = `${t.start} ${t.connector} ${meaning1}. ${t.middle} ${t.warns} ${meaning2}.`;

  return { previewText, readingText };
}

/**
 * Get scarcity counter for conversion optimization.
 */
export async function getScarcity(): Promise<{
  availableToday: number;
  totalLimit: number;
}> {
  const totalLimit = 5; // Daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Count paid upgrades today
  const paidToday = await db
    .select()
    .from(submissions)
    .where(
      and(
        eq(submissions.paidUpgrade, true),
        gte(submissions.timestamp, today)
      )
    );

  const availableToday = Math.max(0, totalLimit - paidToday.length);

  return {
    availableToday,
    totalLimit,
  };
}

