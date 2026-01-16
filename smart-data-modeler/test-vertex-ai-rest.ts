/**
 * Test script using Vertex AI REST API directly (bypassing SDK)
 * This tests which models are actually available in Vertex AI
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local
try {
    const envPath = resolve(__dirname, '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    envFile.split('\n').forEach(line => {
        const match = line.match(/^([^#=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
} catch (error) {
    console.warn('⚠️  Could not load .env.local');
}

const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'dbc-data-studio';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-002',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
];

async function testModelViaREST(modelName: string): Promise<{ success: boolean; error?: string; status?: number }> {
    try {
        // Get access token
        const token = execSync('gcloud auth print-access-token', { encoding: 'utf-8' }).trim();

        // Vertex AI REST API endpoint
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelName}:predict`;

        // Alternative: Try generateContent endpoint
        const urlGenerate = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelName}:generateContent`;

        const payload = JSON.stringify({
            contents: [{
                role: 'user',
                parts: [{ text: 'Say "Hello" in one word.' }]
            }]
        });

        // Try generateContent endpoint first
        try {
            const response = await fetch(urlGenerate, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: payload,
            });

            const status = response.status;
            const text = await response.text();

            if (status === 200) {
                return { success: true, status };
            } else if (status === 404) {
                return { success: false, error: 'Model not found (404)', status };
            } else if (status === 403) {
                return { success: false, error: 'Permission denied (403)', status };
            } else {
                return { success: false, error: `HTTP ${status}: ${text.substring(0, 100)}`, status };
            }
        } catch (fetchError: any) {
            return { success: false, error: fetchError.message };
        }
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

async function main() {
    console.log('🔍 Testing Gemini Models via Vertex AI REST API\n');
    console.log(`Project: ${projectId}`);
    console.log(`Location: ${location}\n`);
    console.log('Testing models...\n');

    const results: Array<{ model: string; success: boolean; error?: string; status?: number }> = [];

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing ${modelName}... `);
        const result = await testModelViaREST(modelName);
        results.push({ model: modelName, ...result });

        if (result.success) {
            console.log(`✅ WORKING (HTTP ${result.status})`);
        } else {
            console.log(`❌ FAILED: ${result.error}`);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY\n');

    const working = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (working.length > 0) {
        console.log('✅ WORKING MODELS:');
        working.forEach(r => {
            console.log(`   - ${r.model}`);
        });
        console.log(`\n💡 Recommended: Use "${working[0].model}" in your webapp\n`);
    } else {
        console.log('❌ No working models found!\n');
        console.log('💡 This might mean:');
        console.log('   1. Models need to be enabled in your GCP project');
        console.log('   2. Billing needs to be enabled');
        console.log('   3. The region might not support these models');
        console.log('   4. IAM permissions might be insufficient\n');
    }

    if (failed.length > 0) {
        console.log('❌ FAILED MODELS:');
        failed.forEach(r => {
            console.log(`   - ${r.model}: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(60));
}

main().catch(console.error);

