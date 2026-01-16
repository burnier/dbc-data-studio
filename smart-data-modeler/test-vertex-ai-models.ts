/**
 * Test script to find which Gemini models are available in Vertex AI
 * 
 * Run with:
 *   npx tsx test-vertex-ai-models.ts
 *   OR
 *   npm run test-models
 * 
 * Make sure your .env.local file has:
 *   GOOGLE_CLOUD_PROJECT=dbc-data-studio
 *   GOOGLE_CLOUD_LOCATION=us-central1
 *   GOOGLE_GENAI_USE_VERTEXAI=true
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (since we're not in Next.js context)
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
    console.warn('⚠️  Could not load .env.local, using process.env');
}

const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'dbc-data-studio';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// List of model names to test
const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-002',
    'gemini-1.5-pro',
    'gemini-1.5-pro-002',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.5-pro',
    'gemini-pro',
    'gemini-pro-vision',
];

async function testModel(modelName: string): Promise<{ success: boolean; error?: string; endpoint?: string }> {
    try {
        // Set environment variables for Vertex AI
        process.env.GOOGLE_CLOUD_PROJECT = projectId;
        process.env.GOOGLE_CLOUD_LOCATION = location;
        process.env.GOOGLE_GENAI_USE_VERTEXAI = 'true';

        // Initialize SDK with empty API key (uses ADC)
        const genAI = new GoogleGenerativeAI('');

        // Try different path formats
        // Format 1: Full Vertex AI path
        const modelPath1 = `projects/${projectId}/locations/${location}/publishers/google/models/${modelName}`;
        // Format 2: Short name (SDK might expand it)
        const modelPath2 = modelName;

        // Log what we're trying
        console.log(`   [DEBUG] Trying full path: ${modelPath1}`);

        // Try full path first
        let model = genAI.getGenerativeModel({
            model: modelPath1,
        });

        // Try a simple test prompt
        const testPrompt = 'Say "Hello" in one word.';
        let result;
        let response: string;

        try {
            result = await model.generateContent(testPrompt);
            response = result.response.text();
        } catch (error: any) {
            // If full path fails, try short name
            if (error?.message?.includes('404')) {
                console.log(`   [DEBUG] Full path failed, trying short name: ${modelPath2}`);
                model = genAI.getGenerativeModel({
                    model: modelPath2,
                });
                result = await model.generateContent(testPrompt);
                response = result.response.text();
            } else {
                throw error;
            }
        }

        if (response && response.trim().length > 0) {
            return { success: true };
        } else {
            return { success: false, error: 'Empty response' };
        }
    } catch (error: any) {
        const errorMessage = error?.message || String(error);
        const errorString = String(error);

        // Extract endpoint from error if available
        const endpointMatch = errorString.match(/https:\/\/[^\s]+/);
        const endpoint = endpointMatch ? endpointMatch[0] : undefined;

        // Check for specific error types
        if (errorMessage.includes('404') || errorMessage.includes('not found')) {
            return { success: false, error: 'Model not found (404)', endpoint };
        }
        if (errorMessage.includes('403') || errorMessage.includes('permission') || errorMessage.includes('unregistered')) {
            return { success: false, error: 'Permission denied (403)', endpoint };
        }
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
            return { success: false, error: 'Quota exceeded (429)', endpoint };
        }

        return { success: false, error: errorMessage.substring(0, 150), endpoint };
    }
}

async function main() {
    console.log('🔍 Testing Gemini Models in Vertex AI\n');
    console.log(`Project: ${projectId}`);
    console.log(`Location: ${location}\n`);
    console.log('Testing models...\n');

    const results: Array<{ model: string; success: boolean; error?: string }> = [];

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing ${modelName}... `);
        const result = await testModel(modelName);
        results.push({ model: modelName, ...result });

        if (result.success) {
            console.log('✅ WORKING');
        } else {
            console.log(`❌ FAILED: ${result.error}`);
            if (result.endpoint) {
                console.log(`   Endpoint: ${result.endpoint}`);
            }
        }

        // Small delay between tests
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

