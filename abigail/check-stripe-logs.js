#!/usr/bin/env node
/**
 * Check Stripe webhook status and manually update database if needed
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

async function main() {
  console.log('🔍 Checking Stripe Webhook Status\n');

  // Import Stripe
  const Stripe = require('stripe');
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    // 1. Get the event details
    console.log('1️⃣ Fetching event from Stripe...');
    const eventId = 'evt_1T2xwe9L65xT5eefj7Ovrt1k';
    const event = await stripe.events.retrieve(eventId);
    
    console.log(`✅ Event: ${event.id}`);
    console.log(`   Type: ${event.type}`);
    console.log(`   Created: ${new Date(event.created * 1000).toLocaleString()}`);
    
    const session = event.data.object;
    console.log(`   Session ID: ${session.id}`);
    console.log(`   Customer: ${session.customer_email}`);
    console.log(`   Amount: ${session.amount_total / 100} ${session.currency.toUpperCase()}`);
    console.log(`   Payment Status: ${session.payment_status}`);
    console.log(`   Metadata:`, session.metadata);
    console.log('');

    const submissionId = parseInt(session.metadata?.submissionId || '0');
    
    if (!submissionId) {
      console.log('❌ No submissionId found in metadata!');
      console.log('   This would cause webhook to return 400: "Missing submissionId"');
      return;
    }

    // 2. Check database
    console.log(`2️⃣ Checking database for submission #${submissionId}...`);
    
    // Use require for TypeScript files in CommonJS context
    const { db } = require('./lib/db');
    const { submissions } = require('./lib/db/schema');
    const { eq } = require('drizzle-orm');
    
    const result = await db.select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);
    
    if (result.length === 0) {
      console.log(`❌ Submission #${submissionId} NOT FOUND!`);
      return;
    }
    
    const submission = result[0];
    console.log(`✅ Found submission:`);
    console.log(`   ID: ${submission.id}`);
    console.log(`   Name: ${submission.name}`);
    console.log(`   Email: ${submission.email}`);
    console.log(`   Language: ${submission.language}`);
    console.log(`   Question: ${submission.question}`);
    console.log(`   Paid: ${submission.paidUpgrade ? '💰 YES' : '📧 NO'}`);
    
    if (submission.paidUpgrade) {
      console.log(`   Paid At: ${submission.paidAt}`);
      console.log(`   Stripe Session: ${submission.stripeSessionId}`);
      console.log(`   Amount: ${submission.paidAmount / 100} ${submission.paidCurrency}`);
      console.log('\n✅ This submission is already marked as PAID.');
    } else {
      console.log('\n⚠️  Submission is NOT marked as PAID yet!');
      console.log('\nTo manually update, run:');
      console.log('   node check-stripe-logs.js --update');
      
      if (process.argv.includes('--update')) {
        console.log('\n🔨 Updating database...');
        await db.update(submissions)
          .set({
            paidUpgrade: true,
            stripeSessionId: session.id,
            paidAmount: session.amount_total || 0,
            paidCurrency: session.currency?.toUpperCase() || 'USD',
            paidAt: new Date(),
          })
          .where(eq(submissions.id, submissionId));
        
        console.log('✅ SUCCESS! Submission #12 is now marked as PAID.');
        console.log('   Check your /admin page - it should show 💰 PAID now!');
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

main();
