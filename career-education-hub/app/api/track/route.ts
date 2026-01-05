/**
 * API endpoint for tracking clicks
 * POST /api/track
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackClick } from '@/lib/tracking';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tool, source, userAgent, ip } = body;

        if (!tool) {
            return NextResponse.json(
                { error: 'Tool parameter required' },
                { status: 400 }
            );
        }

        await trackClick(
            tool,
            source,
            userAgent || request.headers.get('user-agent') || undefined,
            ip || request.headers.get('x-forwarded-for')?.split(',')[0] || undefined
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Tracking error:', error);
        return NextResponse.json(
            { error: 'Tracking failed' },
            { status: 500 }
        );
    }
}

