/**
 * API route for downloading commercetools schema JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateCommercetoolsSchema, generateImportJson } from '@/lib/commercetools-schema';
import { AttributeMapping } from '@/lib/vertex-ai-schema-generator';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            productTypeName,
            productTypeKey,
            productTypeDescription,
            selectedAttributes,
            sampleData,
        } = body;

        if (!productTypeName || !productTypeKey || !selectedAttributes) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate commercetools schema
        const schema = generateCommercetoolsSchema(
            productTypeName,
            productTypeKey,
            productTypeDescription,
            selectedAttributes as AttributeMapping[]
        );

        // Generate import JSON if sample data is provided
        let importJson = null;
        if (sampleData && Array.isArray(sampleData) && sampleData.length > 0) {
            importJson = generateImportJson(schema, sampleData);
        }

        // Log download (telemetry)
        if (process.env.ENABLE_TELEMETRY === 'true') {
            console.log('[TELEMETRY] Schema download:', {
                timestamp: new Date().toISOString(),
                productTypeKey,
                attributeCount: selectedAttributes.length,
            });
        }

        return NextResponse.json({
            success: true,
            schema,
            importJson,
        });
    } catch (error) {
        console.error('Error generating schema:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            },
            { status: 500 }
        );
    }
}

