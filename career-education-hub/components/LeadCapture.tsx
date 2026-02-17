'use client';

import { useState } from 'react';

export default function LeadCapture() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

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
                    source: 'landing_page',
                }),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Thank you! We\'ll keep you updated on the best learning paths and career resources.');
                setEmail('');
            } else {
                throw new Error('Failed to submit');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Get Career Resources & Learning Path Updates
            </h3>
            <p className="text-gray-600 mb-6">
                Stay informed about new courses, certification programs, and career opportunities in data engineering and AI.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={status === 'loading'}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                >
                    {status === 'loading' ? 'Submitting...' : 'Subscribe'}
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
    );
}

