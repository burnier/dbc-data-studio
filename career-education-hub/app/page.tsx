/**
 * Main bridge page - AI Career & Education Hub
 * Learning Path Comparison for Data Engineering & AI Careers
 * SEO-optimized, fast-loading, ad-ready
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import LeadCapture from '@/components/LeadCapture';

interface LearningPathData {
    name: string;
    slug: string;
    description: string;
    focus: string;
    features: string[];
    pricing: {
        plan: string;
        price: string;
        features: string[];
    }[];
    affiliateLink: string;
    website: string;
}

async function getLearningPathData(): Promise<LearningPathData[]> {
    try {
        const filePath = join(process.cwd(), 'data', 'learning-paths.json');
        const data = await readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Return empty array if file doesn't exist yet
        return [];
    }
}

export default async function Home() {
    const learningPaths = await getLearningPathData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">DBC Data Studio</h1>
                    <p className="text-gray-600 mt-1">AI Career & Education Hub</p>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Launch Your Data Engineering & AI Career in 2025
                    </h2>
                    <p className="text-xl text-gray-700 mb-8">
                        Compare top learning paths from Coursera, DataQuest, and Pluralsight.
                        Find the perfect certification program to advance your career.
                    </p>
                </div>
            </section>

            {/* Learning Paths Comparison */}
            <section className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {learningPaths.map((path) => (
                        <div
                            key={path.slug}
                            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{path.name}</h3>
                            <p className="text-sm font-semibold text-indigo-600 mb-4">{path.focus}</p>
                            <p className="text-gray-600 mb-6">{path.description}</p>

                            {/* Features */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                                <ul className="space-y-2">
                                    {path.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <svg
                                                className="w-5 h-5 text-green-500 mr-2 mt-0.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Pricing */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Pricing:</h4>
                                <div className="space-y-2">
                                    {path.pricing.map((plan, idx) => (
                                        <div key={idx} className="text-sm">
                                            <span className="font-medium">{plan.plan}:</span>{' '}
                                            <span className="text-gray-600">{plan.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Link
                                href={`/go/${path.slug}`}
                                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                            >
                                Explore {path.name} →
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Side-by-Side Comparison
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-4 font-semibold text-gray-900">
                                        Feature
                                    </th>
                                    {learningPaths.map((path) => (
                                        <th
                                            key={path.slug}
                                            className="text-center py-4 px-4 font-semibold text-gray-900"
                                        >
                                            {path.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-4 font-medium text-gray-700">Focus Area</td>
                                    {learningPaths.map((path) => (
                                        <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                            {path.focus}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-4 font-medium text-gray-700">Starting Price</td>
                                    {learningPaths.map((path) => (
                                        <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                            {path.pricing[0]?.price || 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-4 font-medium text-gray-700">Key Features</td>
                                    {learningPaths.map((path) => (
                                        <td key={path.slug} className="py-4 px-4 text-center text-gray-600">
                                            {path.features.length} features
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Lead Capture */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <LeadCapture />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400">
                        DBC Data Studio - Your path to a data engineering & AI career
                    </p>
                </div>
            </footer>
        </div>
    );
}

