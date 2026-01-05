/**
 * Click tracking system
 * Logs affiliate link clicks to clicks.json or database
 */

import { writeFile, readFile, mkdir } from 'fs/promises';
import { join } from 'path';

export interface ClickRecord {
    timestamp: string;
    targetTool: string;
    referralSource?: string;
    userAgent?: string;
    ip?: string;
}

const DATA_DIR = join(process.cwd(), 'data');
const CLICKS_FILE = join(DATA_DIR, 'clicks.json');

/**
 * Initialize data directory if it doesn't exist
 */
async function ensureDataDir() {
    try {
        await mkdir(DATA_DIR, { recursive: true });
    } catch (error) {
        // Directory already exists
    }
}

/**
 * Load existing clicks from file
 */
async function loadClicks(): Promise<ClickRecord[]> {
    try {
        await ensureDataDir();
        const data = await readFile(CLICKS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // File doesn't exist yet, return empty array
        return [];
    }
}

/**
 * Save clicks to file
 */
async function saveClicks(clicks: ClickRecord[]) {
    await ensureDataDir();
    await writeFile(CLICKS_FILE, JSON.stringify(clicks, null, 2), 'utf-8');
}

/**
 * Track a click
 */
export async function trackClick(
    targetTool: string,
    referralSource?: string,
    userAgent?: string,
    ip?: string
): Promise<void> {
    const clicks = await loadClicks();

    const newClick: ClickRecord = {
        timestamp: new Date().toISOString(),
        targetTool,
        referralSource: referralSource || 'direct',
        userAgent,
        ip,
    };

    clicks.push(newClick);
    await saveClicks(clicks);
}

/**
 * Get click statistics
 */
export async function getClickStats(): Promise<{
    total: number;
    byTool: Record<string, number>;
    bySource: Record<string, number>;
}> {
    const clicks = await loadClicks();

    const byTool: Record<string, number> = {};
    const bySource: Record<string, number> = {};

    clicks.forEach((click) => {
        byTool[click.targetTool] = (byTool[click.targetTool] || 0) + 1;
        bySource[click.referralSource || 'direct'] =
            (bySource[click.referralSource || 'direct'] || 0) + 1;
    });

    return {
        total: clicks.length,
        byTool,
        bySource,
    };
}

