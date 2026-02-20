import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { PRICING, type Language } from '@/lib/constants';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

// Price mapping by language (configured via environment variables)
// See STRIPE_SETUP_GUIDE.md for setup instructions
const PRICE_IDS: Record<Language, string> = {
  en: process.env.STRIPE_PRICE_USD || 'price_placeholder_usd',
  de: process.env.STRIPE_PRICE_EUR || 'price_placeholder_eur',
  pt: process.env.STRIPE_PRICE_BRL || 'price_placeholder_brl',
  hu: process.env.STRIPE_PRICE_HUF || 'price_placeholder_huf',
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

    // Use email from parameter or fall back to submission email
    const customerEmail = email || submission[0].email;

    // Get price ID for language
    const priceId = PRICE_IDS[language as Language] || PRICE_IDS.en;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail,
      metadata: {
        submissionId: submissionId.toString(),
        language,
        email: customerEmail,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${language}?canceled=true`,
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

