/**
 * API route for analyzing uploaded files and generating schema proposals
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseFile } from '@/lib/file-parser';
import { generateSchemaProposal } from '@/lib/vertex-ai-schema-generator';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for Gemini API calls

export async function POST(request: NextRequest) {
    try {
        // Support both file upload and JSON data
        const contentType = request.headers.get('content-type') || '';

        let headers: string[];
        let sampleRows: Record<string, any>[];

        if (contentType.includes('multipart/form-data')) {
            // File upload
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return NextResponse.json(
                    { error: 'No file provided' },
                    { status: 400 }
                );
            }

            const parsedData = await parseFile(file);
            headers = parsedData.headers;
            sampleRows = parsedData.sampleRows;
        } else {
            // JSON data (from client-side parsing)
            const body = await request.json();
            headers = body.headers;
            sampleRows = body.sampleRows;

            if (!headers || !sampleRows) {
                return NextResponse.json(
                    { error: 'Missing headers or sampleRows in request body' },
                    { status: 400 }
                );
            }
        }

        // Get configuration - support both AI Studio and Vertex AI
        const useVertexAI = process.env.GOOGLE_GENAI_USE_VERTEXAI === 'true';

        let projectId: string;
        let location: string;

        if (useVertexAI) {
            // Vertex AI mode - uses Application Default Credentials
            projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT_ID || '';
            location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

            if (!projectId) {
                return NextResponse.json(
                    { error: 'Google Cloud Project ID not configured. Set GOOGLE_CLOUD_PROJECT=dbc-data-studio for Vertex AI mode.' },
                    { status: 500 }
                );
            }

            // For Vertex AI, we don't need an API key - it uses Application Default Credentials
            // Make sure the user has run: gcloud auth application-default login
        } else {
            // AI Studio mode - requires API key
            projectId = process.env.GOOGLE_CLOUD_PROJECT || 'ai-studio';
            location = 'us-central1';

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: 'GEMINI_API_KEY not configured. Get your API key from https://makersuite.google.com/app/apikey' },
                    { status: 500 }
                );
            }
        }

        // Generate schema proposal using Gemini 2.0 Pro
        const proposal = await generateSchemaProposal(
            headers,
            sampleRows,
            projectId,
            location
        );

        // Log usage (simple telemetry)
        if (process.env.ENABLE_TELEMETRY === 'true') {
            console.log('[TELEMETRY] Schema generation:', {
                timestamp: new Date().toISOString(),
                rowCount: sampleRows.length,
                attributeCount: proposal.attributes.length,
            });
        }

        return NextResponse.json({
            success: true,
            proposal,
            dataSummary: {
                totalRows: sampleRows.length,
                headers,
                sampleRows,
            },
        });
    } catch (error) {
        console.error('Error analyzing file:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}

