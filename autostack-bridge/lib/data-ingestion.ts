/**
 * Data ingestion script for tool features and pricing
 * Fetches/scrapes data for Gumloop, Make.com, and AdCreative.ai
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface ToolData {
    name: string;
    slug: string;
    description: string;
    features: string[];
    pricing: {
        plan: string;
        price: string;
        features: string[];
    }[];
    affiliateLink: string;
    website: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const TOOLS_FILE = join(DATA_DIR, 'tools.json');

/**
 * Initialize data directory
 */
async function ensureDataDir() {
    try {
        await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        // Directory already exists
    }
}

/**
 * Fetch tool data (placeholder - to be filled with actual data)
 * In production, this would scrape or use APIs
 */
async function fetchToolData(): Promise<ToolData[]> {
    // TODO: Replace with actual scraping/API calls
    // For now, using placeholder data structure

    return [
        {
            name: 'Gumloop',
            slug: 'gumloop',
            description: 'AI-powered email automation and lead generation platform',
            features: [
                'AI email generation',
                'Lead scoring',
                'Automated sequences',
                'CRM integration',
                'Analytics dashboard',
            ],
            pricing: [
                {
                    plan: 'Starter',
                    price: '$29/month',
                    features: ['Up to 1,000 contacts', 'Basic automation'],
                },
                {
                    plan: 'Pro',
                    price: '$99/month',
                    features: ['Up to 10,000 contacts', 'Advanced automation', 'AI features'],
                },
            ],
            affiliateLink: process.env.GUMLOOP_AFFILIATE_LINK || '#',
            website: 'https://gumloop.com',
        },
        {
            name: 'Make.com',
            slug: 'make',
            description: 'Visual automation platform for connecting apps and workflows',
            features: [
                'Visual workflow builder',
                '1,000+ app integrations',
                'Automated workflows',
                'Data transformation',
                'Webhooks and APIs',
            ],
            pricing: [
                {
                    plan: 'Free',
                    price: '$0/month',
                    features: ['1,000 operations/month', 'Basic scenarios'],
                },
                {
                    plan: 'Core',
                    price: '$9/month',
                    features: ['10,000 operations/month', 'Unlimited scenarios'],
                },
                {
                    plan: 'Pro',
                    price: '$29/month',
                    features: ['40,000 operations/month', 'Advanced features'],
                },
            ],
            affiliateLink: process.env.MAKE_AFFILIATE_LINK || '#',
            website: 'https://make.com',
        },
        {
            name: 'AdCreative.ai',
            slug: 'adcreative',
            description: 'AI-powered ad creative generation and optimization',
            features: [
                'AI ad generation',
                'Multiple formats',
                'Brand consistency',
                'A/B testing',
                'Performance analytics',
            ],
            pricing: [
                {
                    plan: 'Starter',
                    price: '$29/month',
                    features: ['50 credits/month', 'Basic templates'],
                },
                {
                    plan: 'Professional',
                    price: '$99/month',
                    features: ['500 credits/month', 'Advanced features', 'Priority support'],
                },
            ],
            affiliateLink: process.env.ADCREATIVE_AFFILIATE_LINK || '#',
            website: 'https://adcreative.ai',
        },
    ];
}

/**
 * Run data ingestion
 */
export async function ingestToolData(): Promise<void> {
    console.log('Starting data ingestion...');

    await ensureDataDir();
    const tools = await fetchToolData();

    await writeFile(TOOLS_FILE, JSON.stringify(tools, null, 2), 'utf-8');

    console.log(`✅ Ingested data for ${tools.length} tools`);
    console.log(`📁 Saved to: ${TOOLS_FILE}`);
}

// Run if called directly
if (require.main === module) {
    ingestToolData().catch(console.error);
}

