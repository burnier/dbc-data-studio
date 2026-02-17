import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc, and, eq } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all submissions
    const allSubmissions = await db.select().from(submissions).orderBy(desc(submissions.timestamp));
    
    // Get paid orders awaiting fulfillment
    const paidOrders = allSubmissions.filter(s => s.paidUpgrade && !s.fulfilled);
    
    // Calculate stats
    const stats = {
      total: allSubmissions.length,
      emailsSent: allSubmissions.filter(s => s.emailSent).length,
      paidOrders: allSubmissions.filter(s => s.paidUpgrade).length,
      pendingFulfillment: paidOrders.length,
      byLanguage: allSubmissions.reduce((acc: any, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {}),
    };
    
    return NextResponse.json({
      submissions: allSubmissions,
      paidOrders: paidOrders,
      stats,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

