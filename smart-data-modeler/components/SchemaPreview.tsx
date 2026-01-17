'use client';

import { AttributeMapping } from '@/lib/vertex-ai-schema-generator';
import { generateCommercetoolsSchema } from '@/lib/commercetools-schema';
import { generateApiPlaygroundPayload } from '@/lib/api-playground-format';
import { useState, useEffect } from 'react';

interface SchemaPreviewProps {
    productTypeName: string;
    productTypeKey: string;
    productTypeDescription?: string;
    selectedAttributes: AttributeMapping[];
    sampleData?: Record<string, any>[];
    allAttributes?: AttributeMapping[];
}

export default function SchemaPreview({
    productTypeName,
    productTypeKey,
    productTypeDescription,
    selectedAttributes,
    sampleData,
    allAttributes = [],
}: SchemaPreviewProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    // Calculate dry run summary
    const productAttributes = selectedAttributes.filter((attr) => attr.bucket !== 'standard');
    const technicalMetadataIgnored = allAttributes.filter(
        (attr) => attr.bucket === 'technical-metadata' && !selectedAttributes.includes(attr)
    ).length;
    const productTypeCount = 1; // Single product type for now

    useEffect(() => {
        // Track schema preview view
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'schema_preview_viewed', {
                product_type_key: productTypeKey,
                attribute_count: productAttributes.length,
            });
        }
    }, [productTypeKey, productAttributes.length]);

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
                selectedAttributes,
                productTypeDescription,
                sampleData
            );

            // Generate API Playground-ready format
            const apiPlaygroundPayload = generateApiPlaygroundPayload(schema);

            // Track schema download (primary conversion metric)
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'schema_downloaded', {
                    product_type_key: productTypeKey,
                    attribute_count: productAttributes.length,
                    technical_metadata_ignored: technicalMetadataIgnored,
                });
            }

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
                    disabled={isDownloading || productAttributes.length === 0}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isDownloading ? 'Generating...' : 'Download ProductTypeDraft JSON'}
                </button>
            </div>

            {/* Schema Dry Run Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-1">Schema Dry Run Summary</h4>
                        <p className="text-sm text-blue-800">
                            This will create <strong>{productTypeCount} Product Type{productTypeCount !== 1 ? 's' : ''}</strong> and <strong>{productAttributes.length} Attribute{productAttributes.length !== 1 ? 's' : ''}</strong>.
                            {technicalMetadataIgnored > 0 && (
                                <> We ignored <strong>{technicalMetadataIgnored} metadata field{technicalMetadataIgnored !== 1 ? 's' : ''}</strong> for you to keep the schema lean.</>
                            )}
                        </p>
                    </div>
                </div>
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
                        <span className="text-gray-900">{productAttributes.length}</span>
                    </div>
                </div>
            </div>

            {productAttributes.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-64 overflow-y-auto">
                    <div className="mb-2 text-xs text-gray-600">
                        <span className="font-medium">API Playground Ready:</span> This schema can be directly used in commercetools API Playground
                    </div>
                    <pre className="text-xs text-gray-700">
                        {generateApiPlaygroundPayload(
                            generateCommercetoolsSchema(
                                productTypeName,
                                productTypeKey,
                                selectedAttributes,
                                productTypeDescription,
                                sampleData
                            )
                        )}
                    </pre>
                </div>
            )}
        </div>
    );
}

