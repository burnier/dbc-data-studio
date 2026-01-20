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
    const [accuracyFeedback, setAccuracyFeedback] = useState<'up' | 'down' | null>(null);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

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

    const handleAccuracyFeedback = (feedback: 'up' | 'down') => {
        if (feedbackSubmitted) return;

        setAccuracyFeedback(feedback);
        setFeedbackSubmitted(true);

        // Track feedback event
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'schema_accuracy_feedback', {
                feedback: feedback,
                product_type_key: productTypeKey,
                attribute_count: productAttributes.length,
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Schema Preview</h3>
                <div className="flex items-center gap-3">
                    {/* Accuracy Check */}
                    {!feedbackSubmitted ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="text-xs">Accuracy Check:</span>
                            <button
                                onClick={() => handleAccuracyFeedback('up')}
                                className="p-1.5 hover:bg-green-50 rounded transition-colors"
                                title="Schema looks accurate"
                            >
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.834a1 1 0 001.707.707l3.546-3.547a1 1 0 00.293-.707V8.932a1 1 0 00-.293-.707L7.707 4.678A1 1 0 006 5.385v4.948zM16 10.5a1.5 1.5 0 10-3 0v6a1.5 1.5 0 003 0v-6z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleAccuracyFeedback('down')}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                title="Schema needs improvement"
                            >
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 9.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 9.333v5.834a1 1 0 001.707.707l3.546-3.547a1 1 0 00.293-.707V8.932a1 1 0 00-.293-.707L7.707 4.678A1 1 0 006 5.385v4.948zM16 9.5a1.5 1.5 0 10-3 0v6a1.5 1.5 0 003 0v-6z" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">
                            {accuracyFeedback === 'up' ? (
                                <span className="text-green-600">✓ Thank you for your feedback!</span>
                            ) : (
                                <span className="text-red-600">✓ Thank you for your feedback!</span>
                            )}
                        </div>
                    )}
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading || productAttributes.length === 0}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDownloading ? 'Generating...' : 'Download ProductTypeDraft JSON'}
                    </button>
                </div>
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
                        <div className="mt-2 pt-2 border-t border-blue-200">
                            <p className="text-xs text-blue-700 italic">
                                Schema generated following commercetools Foundry modeling standards.
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                <span className="font-semibold">80% Similarity Rule:</span> Products within a Product Type share ~80% of attributes, preventing attribute bloat. Based on commercetools Foundry guidelines.
                            </p>
                        </div>
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

