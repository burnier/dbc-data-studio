import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Get all submissions
    const allSubmissions = await db.select().from(submissions).orderBy(desc(submissions.timestamp));
    
    // Calculate stats
    const stats = {
      total: allSubmissions.length,
      emailsSent: allSubmissions.filter(s => s.emailSent).length,
      byLanguage: allSubmissions.reduce((acc: any, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {}),
    };
    
    return NextResponse.json({
      submissions: allSubmissions,
      stats,
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

