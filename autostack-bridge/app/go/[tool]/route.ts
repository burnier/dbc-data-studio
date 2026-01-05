/**
 * Affiliate redirect engine
 * Routes: /go/gumloop, /go/make, /go/adcreative
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackClick } from '@/lib/tracking';

// Affiliate link mappings
const AFFILIATE_LINKS: Record<string, string> = {
    gumloop: process.env.GUMLOOP_AFFILIATE_LINK || 'https://gumloop.com',
    make: process.env.MAKE_AFFILIATE_LINK || 'https://make.com',
    adcreative: process.env.ADCREATIVE_AFFILIATE_LINK || 'https://adcreative.ai',
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
            { error: 'Tool not found' },
            { status: 404 }
        );
    }

    // Redirect to affiliate link
    return NextResponse.redirect(affiliateLink, { status: 302 });
}

