'use client';

import { AttributeMapping } from '@/lib/vertex-ai-schema-generator';
import { useState } from 'react';

interface VerificationStepProps {
    attributes: AttributeMapping[];
    onSelectionChange: (selectedAttributes: AttributeMapping[]) => void;
}

export default function VerificationStep({
    attributes,
    onSelectionChange,
}: VerificationStepProps) {
    // Separate attributes into buckets
    const standardFields = attributes.filter((attr) => attr.bucket === 'standard');
    const productInfo = attributes.filter((attr) => attr.bucket === 'product-info');
    const technicalMetadata = attributes.filter(
        (attr) => attr.bucket === 'technical-metadata'
    );

    // Track selected state - default: product-info ON, technical-metadata OFF
    const [selected, setSelected] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        // Standard fields are always selected (they're not attributes, just shown for info)
        standardFields.forEach((attr) => initial.add(attr.name));
        // Product info defaults to ON
        productInfo.forEach((attr) => initial.add(attr.name));
        // Technical metadata defaults to OFF
        return initial;
    });

    const toggleAttribute = (name: string) => {
        const newSelected = new Set(selected);
        if (newSelected.has(name)) {
            newSelected.delete(name);
        } else {
            newSelected.add(name);
        }
        setSelected(newSelected);

        const selectedAttributes = attributes.filter((attr) =>
            newSelected.has(attr.name)
        );
        onSelectionChange(selectedAttributes);
    };

    const toggleAll = (bucket: 'product-info' | 'technical-metadata') => {
        const bucketAttrs = attributes.filter((attr) => attr.bucket === bucket);
        const allSelected = bucketAttrs.every((attr) => selected.has(attr.name));

        const newSelected = new Set(selected);
        bucketAttrs.forEach((attr) => {
            if (allSelected) {
                newSelected.delete(attr.name);
            } else {
                newSelected.add(attr.name);
            }
        });
        setSelected(newSelected);

        const selectedAttributes = attributes.filter((attr) =>
            newSelected.has(attr.name)
        );
        onSelectionChange(selectedAttributes);
    };

    const getTypeBadgeColor = (type: string) => {
        const colors: Record<string, string> = {
            text: 'bg-blue-100 text-blue-800',
            number: 'bg-green-100 text-green-800',
            enum: 'bg-purple-100 text-purple-800',
            boolean: 'bg-yellow-100 text-yellow-800',
            date: 'bg-orange-100 text-orange-800',
            money: 'bg-emerald-100 text-emerald-800',
            reference: 'bg-pink-100 text-pink-800',
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const renderBucket = (
        title: string,
        description: string,
        bucketAttrs: AttributeMapping[],
        defaultOn: boolean,
        showToggleAll: boolean
    ) => {
        if (bucketAttrs.length === 0) return null;

        const allSelected = bucketAttrs.every((attr) => selected.has(attr.name));

        return (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    </div>
                    {showToggleAll && (
                        <button
                            onClick={() =>
                                toggleAll(
                                    bucketAttrs[0].bucket as 'product-info' | 'technical-metadata'
                                )
                            }
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            {allSelected ? 'Deselect All' : 'Select All'}
                        </button>
                    )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bucketAttrs.map((attr) => (
                        <label
                            key={attr.name}
                            className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${selected.has(attr.name)
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(attr.name)}
                                onChange={() => toggleAttribute(attr.name)}
                                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <div className="ml-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-900">{attr.label}</span>
                                    <span
                                        className={`px-2 py-0.5 text-xs font-medium rounded ${getTypeBadgeColor(
                                            attr.type
                                        )}`}
                                    >
                                        {attr.type}
                                    </span>
                                    {attr.required && (
                                        <span className="px-2 py-0.5 text-xs font-medium text-red-600 bg-red-50 rounded">
                                            Required
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                        {attr.name}
                                    </code>
                                    {attr.description && ` • ${attr.description}`}
                                </p>
                                {attr.type === 'enum' && attr.enumValues && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {attr.enumValues.slice(0, 5).map((value, idx) => (
                                            <span
                                                key={idx}
                                                className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                                            >
                                                {value}
                                            </span>
                                        ))}
                                        {attr.enumValues.length > 5 && (
                                            <span className="text-xs text-gray-500">
                                                +{attr.enumValues.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Review Schema Proposal
                </h2>
                <p className="text-gray-600">
                    Verify and customize the attribute mappings. Attributes are organized
                    into buckets for easier review.
                </p>
            </div>

            {/* Bucket 1: Standard Fields (Info Only) */}
            {standardFields.length > 0 && (
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <svg
                            className="w-5 h-5 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Standard Fields
                        </h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                        These fields (name, description, slug, sku) map directly to commercetools product entity properties.
                        They are built-in and don't need a ProductType definition. They will be handled automatically.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {standardFields.map((attr) => (
                            <span
                                key={attr.name}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded"
                            >
                                {attr.label}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Bucket 2: Product Info (Default ON) */}
            {renderBucket(
                'Product Info Attributes',
                'Customer-facing product attributes. These are enabled by default.',
                productInfo,
                true,
                productInfo.length > 5
            )}

            {/* Bucket 3: Technical Metadata (Default OFF) */}
            {renderBucket(
                'Technical Metadata',
                'Internal IDs, flags, and system references. Disabled by default to encourage leaner data models.',
                technicalMetadata,
                false,
                technicalMetadata.length > 5
            )}

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                        Selected Attributes:{' '}
                        <span className="font-semibold text-gray-900">
                            {Array.from(selected).filter((name) =>
                                attributes.find(
                                    (attr) =>
                                        attr.name === name && attr.bucket !== 'standard'
                                )
                            ).length}
                        </span>
                    </span>
                    <span className="text-gray-500">
                        Total Attributes: {attributes.filter((a) => a.bucket !== 'standard').length}
                    </span>
                </div>
            </div>
        </div>
    );
}

