#!/usr/bin/env node
/**
 * Debug script to test Stripe webhook and database update
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
});

async function debugWebhook() {
  console.log('🔍 Debugging Stripe Webhook Issue\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  try {
    // 1. Retrieve the checkout session
    console.log('1️⃣ Fetching checkout session from Stripe...');
    const sessionId = 'cs_test_a19JjS006uMVuyq58w8OYMz9Ju76X8E7J3P2A05AC5N5HkwvJ4Nfomlclm';
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log(`   ✅ Session found: ${session.id}`);
    console.log(`   Status: ${session.status}`);
    console.log(`   Payment status: ${session.payment_status}`);
    console.log(`   Email: ${session.customer_email}`);
    console.log(`   Metadata:`, session.metadata);
    console.log('');

    // 2. Check database
    console.log('2️⃣ Checking database...');
    const { db } = require('./lib/db');
    const { submissions } = require('./lib/db/schema');
    const { eq } = require('drizzle-orm');
    
    const submissionId = parseInt(session.metadata?.submissionId || '0');
    console.log(`   Looking for submission ID: ${submissionId}`);
    
    const submission = await db.select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);
    
    if (submission.length === 0) {
      console.log(`   ❌ Submission #${submissionId} NOT FOUND in database`);
      console.log('   This is the problem! The submission ID in Stripe metadata doesn\'t exist.');
      return;
    }
    
    const sub = submission[0];
    console.log(`   ✅ Submission found:`);
    console.log(`      Name: ${sub.name}`);
    console.log(`      Email: ${sub.email}`);
    console.log(`      Language: ${sub.language}`);
    console.log(`      Paid: ${sub.paidUpgrade ? '💰 YES' : '📧 NO'}`);
    console.log('');

    // 3. Test webhook endpoint
    console.log('3️⃣ Checking webhook endpoint...');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    const ourWebhook = webhooks.data.find(w => w.url.includes('abigail.dbcdatastudio.com'));
    
    if (ourWebhook) {
      console.log(`   ✅ Webhook found: ${ourWebhook.url}`);
      console.log(`   Status: ${ourWebhook.status}`);
      console.log(`   Secret: ${ourWebhook.secret}`);
      console.log('');
      
      // Compare secrets
      if (process.env.STRIPE_WEBHOOK_SECRET === ourWebhook.secret) {
        console.log('   ✅ Local STRIPE_WEBHOOK_SECRET matches Stripe webhook');
      } else {
        console.log('   ❌ SECRET MISMATCH!');
        console.log(`      Stripe webhook secret: ${ourWebhook.secret}`);
        console.log(`      Your .env.local secret: ${process.env.STRIPE_WEBHOOK_SECRET}`);
        console.log('   → This might be the issue for Vercel if the secret is different there!');
      }
    } else {
      console.log('   ❌ Webhook not found');
    }
    console.log('');

    // 4. Manually update the database (if user confirms)
    console.log('4️⃣ Manual database update test...');
    console.log('   Would you like to manually update submission #12 to PAID? (Y/N)');
    console.log('   Run with --update flag to actually update:');
    console.log('   node debug-webhook.js --update');
    
    if (process.argv.includes('--update')) {
      console.log('\n   🔨 Updating database...');
      await db.update(submissions)
        .set({
          paidUpgrade: true,
          stripeSessionId: session.id,
          paidAmount: session.amount_total || 0,
          paidCurrency: session.currency?.toUpperCase() || 'USD',
          paidAt: new Date(),
        })
        .where(eq(submissions.id, submissionId));
      
      console.log('   ✅ Database updated! Check /admin page now.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.raw) {
      console.error('   Details:', error.raw);
    }
  }
}

debugWebhook();

