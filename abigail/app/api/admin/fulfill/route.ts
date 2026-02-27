import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendPremiumReadingEmail } from '@/lib/email';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { requireAdmin } from '@/lib/admin-auth';

const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const submissionId = parseInt(formData.get('submissionId') as string);
    const readingText = formData.get('readingText') as string;
    const photoFile = formData.get('photo') as File | null;

    if (!submissionId || !readingText) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate photo if provided
    if (photoFile) {
      if (!ALLOWED_PHOTO_TYPES.includes(photoFile.type)) {
        return NextResponse.json(
          { error: 'Photo must be JPEG, PNG, or WebP' },
          { status: 400 }
        );
      }
      if (photoFile.size > MAX_PHOTO_SIZE_BYTES) {
        return NextResponse.json(
          { error: 'Photo must be under 10 MB' },
          { status: 400 }
        );
      }
    }

    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId));

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    if (!submission.paidUpgrade) {
      return NextResponse.json({ error: 'This order has not been paid' }, { status: 400 });
    }

    if (submission.fulfilled) {
      return NextResponse.json({ error: 'This order has already been fulfilled' }, { status: 400 });
    }

    let photoPath: string | null = null;
    let photoBuffer: Buffer | null = null;

    if (photoFile) {
      const bytes = await photoFile.arrayBuffer();
      photoBuffer = Buffer.from(bytes);
      const ext = photoFile.name.split('.').pop();
      const fileName = `spread-${submissionId}-${Date.now()}.${ext}`;
      const filePath = join('/tmp', fileName);
      await writeFile(filePath, photoBuffer);
      photoPath = filePath;
      console.log(`✅ Photo saved to temp: ${photoPath}`);
      console.log(`💡 For production persistence, migrate to Vercel Blob or S3`);
    }

    // Send email FIRST — only mark fulfilled if email succeeds
    const emailSent = await sendPremiumReadingEmail({
      toEmail: submission.email,
      toName: submission.name,
      readingText,
      photoPath,
      language: submission.language,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send premium email. Order NOT marked as fulfilled. Please retry.' },
        { status: 500 }
      );
    }

    // Only update DB after email succeeds
    await db
      .update(submissions)
      .set({
        fulfilled: true,
        fulfilledAt: new Date(),
        abigailReading: readingText,
        photoPath,
      })
      .where(eq(submissions.id, submissionId));

    console.log(`✅ Order ${submissionId} fulfilled and email sent to ${submission.email}`);

    return NextResponse.json({ success: true, message: 'Order fulfilled successfully', emailSent });
  } catch (error) {
    console.error('❌ Error fulfilling order:', error);
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    return NextResponse.json(
      { error: 'Failed to fulfill order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
