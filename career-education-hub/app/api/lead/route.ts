/**
 * Lead capture API endpoint
 * POST /api/lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const LEADS_FILE = join(DATA_DIR, 'leads.json');

interface Lead {
    email: string;
    timestamp: string;
    source?: string;
}

async function ensureDataDir() {
    try {
        await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        // Directory already exists
    }
}

async function saveLead(lead: Lead) {
    await ensureDataDir();

    let leads: Lead[] = [];
    try {
        const data = await readFile(LEADS_FILE, 'utf-8');
        leads = JSON.parse(data);
    } catch (error) {
        // File doesn't exist yet
    }

    leads.push(lead);
    await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, source } = body;

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Valid email required' },
                { status: 400 }
            );
        }

        const lead: Lead = {
            email,
            timestamp: new Date().toISOString(),
            source: source || 'direct',
        };

        await saveLead(lead);

        // TODO: Integrate with mailing list API (Mailchimp, ConvertKit, etc.)
        // For now, just save to file

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Lead capture error:', error);
        return NextResponse.json(
            { error: 'Lead capture failed' },
            { status: 500 }
        );
    }
}

