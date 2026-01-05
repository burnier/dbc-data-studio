/**
 * Affiliate redirect engine
 * Routes: /go/coursera, /go/dataquest, /go/pluralsight
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackClick } from '@/lib/tracking';

// Affiliate link mappings (Impact.com)
const AFFILIATE_LINKS: Record<string, string> = {
    coursera: process.env.COURSERA_AFFILIATE_LINK || 'https://coursera.org',
    dataquest: process.env.DATAQUEST_AFFILIATE_LINK || 'https://dataquest.io',
    pluralsight: process.env.PLURALSIGHT_AFFILIATE_LINK || 'https://pluralsight.com',
};

export async function GET(
    request: NextRequest,
    { params }: { params: { tool: string } }
) {
    const tool = params.tool.toLowerCase();

    // Get referral source from query params or referer header
    const referralSource =
        request.nextUrl.searchParams.get('ref') ||
        request.headers.get('referer') ||
        'direct';

    // Get user agent and IP for tracking
    const userAgent = request.headers.get('user-agent') || undefined;
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        undefined;

    // Track the click
    try {
        await trackClick(tool, referralSource, userAgent, ip);
    } catch (error) {
        console.error('Tracking error:', error);
        // Continue even if tracking fails
    }

    // Get affiliate link
    const affiliateLink = AFFILIATE_LINKS[tool];

    if (!affiliateLink) {
        return NextResponse.json(
            { error: 'Learning path not found' },
            { status: 404 }
        );
    }

    // Redirect to affiliate link
    return NextResponse.redirect(affiliateLink, { status: 302 });
}

