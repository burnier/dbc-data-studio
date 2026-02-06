'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Submission {
    id: number;
    email: string;
    name: string;
    language: string;
    question: string;
    timestamp: string;
    email_sent: boolean;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [stats, setStats] = useState({ total: 0, byLanguage: {}, emailsSent: 0 });
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_authenticated', 'true');
            loadData();
        } else {
            setError('Invalid password');
        }
    };

    const loadData = async () => {
        const response = await fetch('/api/admin/submissions');
        if (response.ok) {
            const data = await response.json();
            setSubmissions(data.submissions);
            setStats(data.stats);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem('admin_authenticated') === 'true') {
            setIsAuthenticated(true);
            loadData();
        }
    }, []);

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
                <div className="bg-purple-dark/20 backdrop-blur-md border-2 border-purple-main/40 rounded-2xl p-8 max-w-md w-full">
                    <h1 className="text-3xl font-serif text-purple-light mb-6 text-center">
                        Admin Dashboard
                    </h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="w-full px-4 py-3 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white placeholder-purple-light/40 focus:outline-none focus:border-purple-main"
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-purple-gradient text-white rounded-xl font-bold hover:shadow-xl transition-all"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal text-bone-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-serif text-purple-light">Analytics Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                        <h3 className="text-purple-light text-sm mb-2">Total Submissions</h3>
                        <p className="text-4xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                        <h3 className="text-purple-light text-sm mb-2">Emails Sent</h3>
                        <p className="text-4xl font-bold">{stats.emailsSent}</p>
                    </div>
                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                        <h3 className="text-purple-light text-sm mb-2">English</h3>
                        <p className="text-4xl font-bold">{(stats.byLanguage as any).en || 0}</p>
                    </div>
                    <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                        <h3 className="text-purple-light text-sm mb-2">Portuguese</h3>
                        <p className="text-4xl font-bold">{(stats.byLanguage as any).pt || 0}</p>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-purple-main/20">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Language</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Question</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Email Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => (
                                    <tr key={sub.id} className="border-t border-purple-light/10 hover:bg-purple-light/5">
                                        <td className="px-4 py-3 text-sm">{sub.id}</td>
                                        <td className="px-4 py-3 text-sm">{new Date(sub.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm">{sub.name}</td>
                                        <td className="px-4 py-3 text-sm">{sub.email}</td>
                                        <td className="px-4 py-3 text-sm uppercase">{sub.language}</td>
                                        <td className="px-4 py-3 text-sm max-w-xs truncate">{sub.question}</td>
                                        <td className="px-4 py-3 text-sm">
                                            {sub.emailSent ? (
                                                <span className="text-green-400">✓</span>
                                            ) : (
                                                <span className="text-red-400">✗</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

