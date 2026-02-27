import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendPaymentConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const submissionId = parseInt(session.metadata?.submissionId || '0');
      const language = (session.metadata?.language || 'en') as string;
      const email = session.metadata?.email || session.customer_email || '';

      if (!submissionId) {
        console.error('Missing submissionId in webhook metadata');
        return NextResponse.json({ error: 'Missing submissionId' }, { status: 400 });
      }

      // Idempotency: skip if already processed
      const [existing] = await db
        .select({ id: submissions.id, paidUpgrade: submissions.paidUpgrade })
        .from(submissions)
        .where(eq(submissions.id, submissionId));

      if (existing?.paidUpgrade) {
        console.log(`⚠️  Webhook already processed for submission ${submissionId}, skipping`);
        return NextResponse.json({ received: true });
      }

      // Expand line_items to get price ID
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      await db.update(submissions)
        .set({
          paidUpgrade: true,
          stripeSessionId: session.id,
          stripePriceId: expandedSession.line_items?.data[0]?.price?.id || null,
          paidAmount: session.amount_total || 0,
          paidCurrency: session.currency?.toUpperCase() || 'USD',
          paidAt: new Date(),
        })
        .where(eq(submissions.id, submissionId));

      console.log(`✅ Payment recorded for submission ${submissionId} (${email})`);

      // Fetch name for confirmation email
      const [submissionData] = await db
        .select({ name: submissions.name })
        .from(submissions)
        .where(eq(submissions.id, submissionId));

      const emailSent = await sendPaymentConfirmationEmail({
        toEmail: email,
        toName: submissionData?.name || '',
        language,
      });
      if (!emailSent) {
        console.warn(`⚠️  Confirmation email failed for ${email} — order is paid and recorded`);
      }

    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
