import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { submissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendPremiumReadingEmail } from '@/lib/email';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const submissionId = parseInt(formData.get('submissionId') as string);
    const readingText = formData.get('readingText') as string;
    const photoFile = formData.get('photo') as File | null;

    if (!submissionId || !readingText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the submission
    const [submission] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId));

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    if (!submission.paidUpgrade) {
      return NextResponse.json(
        { error: 'This order has not been paid' },
        { status: 400 }
      );
    }

    if (submission.fulfilled) {
      return NextResponse.json(
        { error: 'This order has already been fulfilled' },
        { status: 400 }
      );
    }

    let photoPath: string | null = null;
    let photoBuffer: Buffer | null = null;

    // Handle photo upload
    if (photoFile) {
      const bytes = await photoFile.arrayBuffer();
      photoBuffer = Buffer.from(bytes);

      // On Vercel, filesystem is read-only except /tmp
      // Store in /tmp for immediate use in email
      const uploadsDir = '/tmp';
      
      // Save file with unique name
      const fileName = `spread-${submissionId}-${Date.now()}.${photoFile.name.split('.').pop()}`;
      const filePath = join(uploadsDir, fileName);
      await writeFile(filePath, photoBuffer);
      photoPath = filePath; // Store the /tmp path

      console.log(`✅ Photo saved to temp: ${photoPath}`);
      console.log(`⚠️  Note: Photo is in /tmp and will be deleted after function execution`);
      console.log(`💡 For production, use Vercel Blob or cloud storage`);
    }

    // Update database
    await db
      .update(submissions)
      .set({
        fulfilled: true,
        fulfilledAt: new Date(),
        abigailReading: readingText,
        photoPath: photoPath,
      })
      .where(eq(submissions.id, submissionId));

    // Send premium email
    const emailSent = await sendPremiumReadingEmail({
      toEmail: submission.email,
      toName: submission.name,
      readingText: readingText,
      photoPath: photoPath,
      language: submission.language,
    });

    if (!emailSent) {
      console.warn('⚠️  Premium email failed to send, but order marked as fulfilled');
    }

    return NextResponse.json({
      success: true,
      message: 'Order fulfilled successfully',
      emailSent,
    });
  } catch (error) {
    console.error('❌ Error fulfilling order:', error);
    
    // Log detailed error info
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to fulfill order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

