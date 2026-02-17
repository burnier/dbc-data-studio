'use client';

import { useState } from 'react';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
    learningPathName: string;
}

export default function WaitlistModal({ isOpen, onClose, learningPathName }: WaitlistModalProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    source: `waitlist_${learningPathName.toLowerCase().replace(/\s+/g, '_')}`,
                }),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you! We\'ll send you the direct enrollment link and the Data Engineering Career Roadmap PDF as soon as it\'s ready.');
                setEmail('');
                // Auto-close after 3 seconds on success
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setMessage('');
                }, 3000);
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Get Early Access
                </h3>
                <p className="text-gray-600 mb-6">
                    The 2026 technical review for <strong>{learningPathName}</strong> is being finalized.
                    Leave your email to receive the direct enrollment link and our{' '}
                    <strong>Data Engineering Career Roadmap</strong> (PDF) as soon as it's ready.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={status === 'loading' || status === 'success'}
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {status === 'loading'
                            ? 'Submitting...'
                            : status === 'success'
                                ? 'Success!'
                                : 'Get Notified'}
                    </button>
                </form>

                {message && (
                    <div
                        className={`mt-4 p-3 rounded-lg ${status === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

