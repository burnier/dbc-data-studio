import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PRICING, type Language } from '@/lib/constants';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Stripe locale mapping
const STRIPE_LOCALE: Record<Language, Stripe.Checkout.SessionCreateParams.Locale> = {
  en: 'en',
  de: 'de',
  pt: 'pt-BR',
  hu: 'hu',
};

// Localized product content for the checkout page
const PRODUCT_CONTENT: Record<Language, { name: string; description: string }> = {
  en: {
    name: "Abigail's 36-Card Physical Reading",
    description: "Full Grand Tableau performed by hand by Abigail, the Hungarian Oracle. Includes a photo of your card spread and a deep personal analysis. Delivered within 24 hours.",
  },
  de: {
    name: "Abigails 36-Karten Physische Legung",
    description: "Vollständiges Grand Tableau, manuell von Abigail, der Ungarischen Orakelin, durchgeführt. Inklusive Foto Ihrer Kartenlegung und persönlicher Tiefenanalyse. Lieferung innerhalb von 24 Stunden.",
  },
  pt: {
    name: "Ritual de 36 Cartas de Abigail",
    description: "Grand Tableau completo realizado à mão por Abigail, o Oráculo Húngaro. Inclui foto da sua tiragem e análise pessoal aprofundada. Entregue em até 24 horas.",
  },
  hu: {
    name: "Abigail 36 Kártyás Fizikai Olvasata",
    description: "Teljes Grand Tableau, amelyet Abigail, a Magyar Jósnő kézzel végez. Tartalmaz egy fotót a kártyavetésről és személyes mélyreható elemzést. 24 órán belül kézbesítve.",
  },
};

// Amount in smallest currency unit (cents, centavos, fillér)
// HUF is a zero-decimal currency in Stripe
const STRIPE_AMOUNTS: Record<Language, { amount: number; currency: string }> = {
  en: { amount: 2900,   currency: 'usd' },
  de: { amount: 2490,   currency: 'eur' },
  pt: { amount: 12900,  currency: 'brl' },
  hu: { amount: 8900,   currency: 'huf' },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, language, email } = body;

    if (!submissionId || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: submissionId, language' },
        { status: 400 }
      );
    }

    // Verify submission exists and get email if not provided
    const submission = await db.select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);

    if (submission.length === 0) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Check if already paid
    if (submission[0].paidUpgrade) {
      return NextResponse.json(
        { error: 'This reading has already been purchased' },
        { status: 400 }
      );
    }

    const customerEmail = email || submission[0].email;
    const lang = (language as Language) in STRIPE_LOCALE ? (language as Language) : 'en';
    const product = PRODUCT_CONTENT[lang];
    const pricing = STRIPE_AMOUNTS[lang];

    // Create Stripe Checkout Session with localized content
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      locale: STRIPE_LOCALE[lang],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: pricing.currency,
            unit_amount: pricing.amount,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      customer_email: customerEmail,
      payment_intent_data: {
        receipt_email: customerEmail,
      },
      metadata: {
        submissionId: submissionId.toString(),
        language: lang,
        email: customerEmail,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${lang}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${lang}?canceled=true`,
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

