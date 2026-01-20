'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import VerificationStep from '@/components/VerificationStep';
import SchemaPreview from '@/components/SchemaPreview';
import { ParsedData } from '@/lib/file-parser';
import { AttributeMapping } from '@/lib/vertex-ai-schema-generator';

type Step = 'upload' | 'analyzing' | 'select' | 'preview';

export default function Home() {
    const [step, setStep] = useState<Step>('upload');
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [proposal, setProposal] = useState<{
        productTypeName: string;
        productTypeKey: string;
        productTypeDescription?: string;
        standardFields?: string[];
        attributes: AttributeMapping[];
    } | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<AttributeMapping[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleFileParsed = async (data: ParsedData) => {
        setParsedData(data);
        setError(null);
        setStep('analyzing');
        setIsAnalyzing(true);

        try {
            // Send parsed data to API for Gemini analysis
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    headers: data.headers,
                    sampleRows: data.sampleRows,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze data');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to analyze file');
            }

            // Track attributes mapped
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'attributes_mapped', {
                    total_attributes: result.proposal.attributes.length,
                    product_info_count: result.proposal.attributes.filter((a: any) => a.bucket === 'product-info').length,
                    technical_metadata_count: result.proposal.attributes.filter((a: any) => a.bucket === 'technical-metadata').length,
                });
            }

            setProposal(result.proposal);
            setSelectedAttributes(result.proposal.attributes);
            setStep('select');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to analyze file';
            
            // Provide friendly error messages
            let friendlyMessage = errorMessage;
            if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
                friendlyMessage = 'The AI service is temporarily busy. Please try again in a few moments.';
            } else if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
                friendlyMessage = 'Connection issue detected. Please check your internet connection and try again.';
            } else if (errorMessage.includes('Vertex AI') || errorMessage.includes('authentication')) {
                friendlyMessage = 'Service configuration issue. Please try again later or contact support if the problem persists.';
            } else if (errorMessage.includes('analyze') || errorMessage.includes('AI')) {
                friendlyMessage = 'Unable to analyze your data. Please ensure your file contains valid product data with headers and at least a few rows.';
            }
            
            setError(friendlyMessage);
            setStep('upload');

            // If it's a rate limit error, show helpful message
            if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
                console.warn('Rate limit hit - user needs to wait or upgrade plan');
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSelectionChange = (attributes: AttributeMapping[]) => {
        setSelectedAttributes(attributes);
        // Don't auto-advance - user must click "Continue to Preview" button
    };

    const handleReset = () => {
        setStep('upload');
        setParsedData(null);
        setProposal(null);
        setSelectedAttributes([]);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Smart Data Modeler
                        </h1>
                        <p className="text-2xl font-semibold text-gray-800 max-w-3xl mx-auto mb-4">
                            From Legacy Data to commercetools in 60 Seconds
                        </p>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Transform your raw product data into commercetools-ready schemas with
                            AI-powered mapping. Free utility for Solution Architects and Developers.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>100% Free</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                </svg>
                                <span>CSV, JSON, XLSX</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>AI-Powered</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {step === 'upload' && (
                    <div className="max-w-3xl mx-auto">
                        <FileUpload onFileParsed={handleFileParsed} onError={setError} />
                    </div>
                )}

                {step === 'analyzing' && (
                    <div className="max-w-3xl mx-auto text-center py-16">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Analyzing your data...
                        </h2>
                        <p className="text-gray-600">
                            Our AI is examining your product data and generating a commercetools schema proposal.
                        </p>
                    </div>
                )}

                {step === 'select' && proposal && (
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                            <VerificationStep
                                attributes={proposal.attributes}
                                onSelectionChange={handleSelectionChange}
                            />
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setStep('preview')}
                                    disabled={selectedAttributes.filter(a => a.bucket !== 'standard').length === 0}
                                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    Continue to Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'preview' && proposal && (
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                            <SchemaPreview
                                productTypeName={proposal.productTypeName}
                                productTypeKey={proposal.productTypeKey}
                                productTypeDescription={proposal.productTypeDescription}
                                selectedAttributes={selectedAttributes}
                                sampleData={parsedData?.sampleRows}
                                allAttributes={proposal.attributes}
                            />
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleReset}
                                className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Start Over
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            A DBC Data Studio community project dedicated to accelerating composable commerce.
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                            Smart Data Modeler – Transform your product data into commercetools schemas in seconds.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

