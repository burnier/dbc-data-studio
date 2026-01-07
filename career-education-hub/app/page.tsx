/**
 * Main bridge page - AI Career & Education Hub
 * Learning Path Comparison for Data Engineering & AI Careers
 * SEO-optimized, fast-loading, ad-ready
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import Link from 'next/link';
import LeadCapture from '@/components/LeadCapture';
import LearningPathCard from '@/components/LearningPathCard';
import ComparisonTable from '@/components/ComparisonTable';

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
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">DBC Data Studio</h1>
                        <p className="text-gray-600 mt-1">AI Career & Education Hub</p>
                    </div>
                    <a
                        href="https://www.linkedin.com/in/danielburnier/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-indigo-600 transition-colors"
                        aria-label="Daniel Burnier's LinkedIn Profile"
                    >
                        <svg
                            className="w-8 h-8"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
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
                        <LearningPathCard key={path.slug} path={path} />
                    ))}
                </div>
            </section>

            {/* Comparison Table */}
            <section className="container mx-auto px-4 py-12">
                <ComparisonTable learningPaths={learningPaths} />
            </section>

            {/* Lead Capture */}
            <section className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <LeadCapture />
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Disclosure */}
                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                            DBC Data Studio is a professional review site. We may receive compensation from the companies whose products we review (e.g., DataCamp, Udemy). This compensation impacts the location and order in which products appear but does not influence our technical evaluations.
                        </p>

                        {/* Links and Social */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-800">
                            <div className="flex flex-wrap justify-center gap-6 text-sm">
                                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                                <Link href="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.linkedin.com/in/danielburnier/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label="Daniel Burnier's LinkedIn Profile"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                                <p className="text-gray-400 text-sm">
                                    DBC Data Studio - Your path to a data engineering & AI career
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

