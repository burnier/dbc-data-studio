'use client';

import { AttributeMapping } from '@/lib/vertex-ai-schema-generator';
import { generateCommercetoolsSchema } from '@/lib/commercetools-schema';
import { generateApiPlaygroundPayload } from '@/lib/api-playground-format';
import { useState } from 'react';

interface SchemaPreviewProps {
    productTypeName: string;
    productTypeKey: string;
    productTypeDescription?: string;
    selectedAttributes: AttributeMapping[];
    sampleData?: Record<string, any>[];
}

export default function SchemaPreview({
    productTypeName,
    productTypeKey,
    productTypeDescription,
    selectedAttributes,
    sampleData,
}: SchemaPreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch('/api/download-schema', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productTypeName,
                    productTypeKey,
                    selectedAttributes,
                    sampleData,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate schema');
            }

            const data = await response.json();
            const schema = generateCommercetoolsSchema(
                productTypeName,
                productTypeKey,
                productTypeDescription,
                selectedAttributes
            );

            // Generate API Playground-ready format
            const apiPlaygroundPayload = generateApiPlaygroundPayload(schema);

            // Create and download JSON file (API Playground ready)
            const blob = new Blob([apiPlaygroundPayload], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${productTypeKey}-product-type.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading schema:', error);
            alert('Failed to download schema. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Schema Preview</h3>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading || selectedAttributes.filter(a => a.bucket !== 'standard').length === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isDownloading ? 'Generating...' : 'Download ProductTypeDraft JSON'}
                </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="space-y-2 text-sm">
                    <div>
                        <span className="font-medium text-gray-700">Product Type Name:</span>{' '}
                        <span className="text-gray-900">{productTypeName}</span>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Product Type Key:</span>{' '}
                        <code className="text-primary-600">{productTypeKey}</code>
                    </div>
                    <div>
                        <span className="font-medium text-gray-700">Attributes:</span>{' '}
                        <span className="text-gray-900">{selectedAttributes.length}</span>
                    </div>
                </div>
            </div>

            {selectedAttributes.filter(a => a.bucket !== 'standard').length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-64 overflow-y-auto">
                    <div className="mb-2 text-xs text-gray-600">
                        <span className="font-medium">API Playground Ready:</span> This schema can be directly used in commercetools API Playground
                    </div>
                    <pre className="text-xs text-gray-700">
                        {generateApiPlaygroundPayload(
                            generateCommercetoolsSchema(
                                productTypeName,
                                productTypeKey,
                                productTypeDescription,
                                selectedAttributes
                            )
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
}

