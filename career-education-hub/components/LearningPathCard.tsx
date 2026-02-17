'use client';

import { useState } from 'react';
import Link from 'next/link';
import WaitlistModal from './WaitlistModal';

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

interface LearningPathCardProps {
    path: LearningPathData;
}

export default function LearningPathCard({ path }: LearningPathCardProps) {
    const [showWaitlist, setShowWaitlist] = useState(false);

    const handleExploreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowWaitlist(true);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
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

                {/* CTA Button - Shows waitlist modal */}
                <button
                    onClick={handleExploreClick}
                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors"
                >
                    Explore {path.name} →
                </button>
            </div>

            <WaitlistModal
                isOpen={showWaitlist}
                onClose={() => setShowWaitlist(false)}
                learningPathName={path.name}
            />
        </>
    );
}

