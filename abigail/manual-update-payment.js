#!/usr/bin/env node
/**
 * Manually update submission #12 to PAID status
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
const { Pool } = require('@neondatabase/serverless');

async function updateSubmission() {
  console.log('🔨 Manually updating submission #12 to PAID status\n');

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Check current status
    console.log('1️⃣ Checking current status...');
    const checkResult = await pool.query(
      'SELECT id, name, email, language, question, "paidUpgrade", "paidAt", "stripeSessionId" FROM submissions WHERE id = $1',
      [12]
    );

    if (checkResult.rows.length === 0) {
      console.log('❌ Submission #12 not found!');
      return;
    }

    const sub = checkResult.rows[0];
    console.log(`✅ Found submission:`);
    console.log(`   ID: ${sub.id}`);
    console.log(`   Name: ${sub.name}`);
    console.log(`   Email: ${sub.email}`);
    console.log(`   Language: ${sub.language}`);
    console.log(`   Question: ${sub.question}`);
    console.log(`   Currently Paid: ${sub.paidUpgrade ? '💰 YES' : '📧 NO'}`);
    console.log('');

    if (sub.paidUpgrade) {
      console.log('ℹ️  This submission is already marked as PAID.');
      console.log(`   Paid at: ${sub.paidAt}`);
      console.log(`   Stripe session: ${sub.stripeSessionId}`);
      await pool.end();
      return;
    }

    // Update to PAID
    console.log('2️⃣ Updating to PAID status...');
    await pool.query(
      `UPDATE submissions 
       SET "paidUpgrade" = $1, 
           "stripeSessionId" = $2, 
           "paidAmount" = $3, 
           "paidCurrency" = $4, 
           "paidAt" = $5 
       WHERE id = $6`,
      [
        true,
        'cs_test_a19JjS006uMVuyq58w8OYMz9Ju76X8E7J3P2A05AC5N5HkwvJ4Nfomlclm',
        2900,
        'USD',
        new Date(),
        12
      ]
    );

    console.log('✅ SUCCESS! Submission #12 is now marked as PAID.');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to https://abigail.dbcdatastudio.com/admin');
    console.log('   2. You should now see "💰 PAID" for Dano Bolao');
    console.log('   3. Deploy the API version fix to prevent future webhook failures');

    await pool.end();

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    await pool.end();
  }
}

updateSubmission();

