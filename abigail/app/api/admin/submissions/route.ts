import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const allSubmissions = await db.select().from(submissions).orderBy(desc(submissions.timestamp));

    const paidOrders = allSubmissions.filter(s => s.paidUpgrade && !s.fulfilled);

    const stats = {
      total: allSubmissions.length,
      emailsSent: allSubmissions.filter(s => s.emailSent).length,
      paidOrders: allSubmissions.filter(s => s.paidUpgrade).length,
      pendingFulfillment: paidOrders.length,
      byLanguage: allSubmissions.reduce((acc: Record<string, number>, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {}),
    };

    return NextResponse.json({ submissions: allSubmissions, paidOrders, stats });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}
