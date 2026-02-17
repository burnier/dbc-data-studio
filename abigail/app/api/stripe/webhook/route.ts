import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-01-28.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const submissionId = parseInt(session.metadata?.submissionId || '0');
      const language = session.metadata?.language || 'en';
      const email = session.metadata?.email || session.customer_email;

      if (!submissionId) {
        console.error('Missing submissionId in webhook metadata');
        return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
      }

      // Update submission with payment info
      await db.update(submissions)
        .set({
          paidUpgrade: true,
          stripeSessionId: session.id,
          stripePriceId: session.line_items?.data[0]?.price?.id || null,
          paidAmount: session.amount_total || 0,
          paidCurrency: session.currency?.toUpperCase() || 'USD',
          paidAt: new Date(),
        })
        .where(eq(submissions.id, submissionId));

      console.log(`✅ Payment successful for submission ${submissionId} - ${email}`);

      // TODO: Send confirmation email to user
      // TODO: Notify Abigail in admin dashboard (could use webhook or polling)

    } catch (error) {
      console.error('Error updating submission after payment:', error);
      return NextResponse.json(
        { error: 'Failed to update submission' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

