'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getCardImageName } from '@/lib/cards';

interface Submission {
    id: number;
    email: string;
    name: string;
    language: string;
    question: string;
    timestamp: string;
    email_sent: boolean;
    paidUpgrade?: boolean;
    paidAmount?: number;
    paidCurrency?: string;
    paidAt?: string;
    fulfilled?: boolean;
    fulfilledAt?: string;
    cardIdsDrawn?: string;
}

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [paidOrders, setPaidOrders] = useState<Submission[]>([]);
    const [stats, setStats] = useState({ total: 0, byLanguage: {}, emailsSent: 0, paidOrders: 0, pendingFulfillment: 0 });
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'analytics' | 'fulfillment'>('analytics');
    const [selectedOrder, setSelectedOrder] = useState<Submission | null>(null);
    const [readingText, setReadingText] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            setPaidOrders(data.paidOrders || []);
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

    const handleFulfillOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder || !readingText.trim()) {
            alert('Please write a reading before fulfilling');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('submissionId', selectedOrder.id.toString());
            formData.append('readingText', readingText);
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            const response = await fetch('/api/admin/fulfill', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to fulfill order');
            }

            alert('Order fulfilled successfully! Email sent to customer.');
            setSelectedOrder(null);
            setReadingText('');
            setPhotoFile(null);
            loadData(); // Refresh data
        } catch (err: any) {
            setError(err.message);
            alert('Error: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
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
                    <h1 className="text-4xl font-serif text-purple-light">Abigail's Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'analytics'
                                ? 'bg-purple-gradient text-white'
                                : 'bg-purple-dark/20 text-purple-light hover:bg-purple-dark/40'
                        }`}
                    >
                        📊 Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('fulfillment')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                            activeTab === 'fulfillment'
                                ? 'bg-purple-gradient text-white'
                                : 'bg-purple-dark/20 text-purple-light hover:bg-purple-dark/40'
                        }`}
                    >
                        🔮 Oracle Queue
                        {stats.pendingFulfillment > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                {stats.pendingFulfillment}
                            </span>
                        )}
                    </button>
                </div>

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                            <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                <h3 className="text-purple-light text-sm mb-2">Total Submissions</h3>
                                <p className="text-4xl font-bold">{stats.total}</p>
                            </div>
                            <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                <h3 className="text-purple-light text-sm mb-2">Emails Sent</h3>
                                <p className="text-4xl font-bold">{stats.emailsSent}</p>
                            </div>
                            <div className="bg-green-900/20 border border-green-500/20 rounded-xl p-6">
                                <h3 className="text-green-400 text-sm mb-2">💰 Paid Orders</h3>
                                <p className="text-4xl font-bold text-green-400">{stats.paidOrders || 0}</p>
                            </div>
                            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-xl p-6">
                                <h3 className="text-yellow-400 text-sm mb-2">⏳ Pending</h3>
                                <p className="text-4xl font-bold text-yellow-400">{stats.pendingFulfillment || 0}</p>
                            </div>
                            <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                <h3 className="text-purple-light text-sm mb-2">English</h3>
                                <p className="text-4xl font-bold">{(stats.byLanguage as any).en || 0}</p>
                            </div>
                        </div>

                        {/* Submissions Table */}
                        <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-purple-light/20">
                                <h2 className="text-xl font-semibold text-purple-light">All Submissions</h2>
                            </div>
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
                                            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
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
                                                    {sub.fulfilled ? (
                                                        <span className="text-green-400">✓ Fulfilled</span>
                                                    ) : sub.paidUpgrade ? (
                                                        <span className="text-yellow-400">⏳ Awaiting Fulfillment</span>
                                                    ) : (sub as any).emailSent || sub.email_sent ? (
                                                        <span className="text-blue-400">📧 Teaser Sent</span>
                                                    ) : (
                                                        <span className="text-gray-400">⚠️ No Teaser</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Fulfillment Queue Tab */}
                {activeTab === 'fulfillment' && (
                    <div className="space-y-6">
                        {selectedOrder ? (
                            // Fulfillment Form
                            <div className="bg-purple-dark/20 border-2 border-purple-main/40 rounded-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-serif text-purple-light">
                                        36-Card Physical Deep-Dive — Order #{selectedOrder.id}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(null);
                                            setReadingText('');
                                            setPhotoFile(null);
                                        }}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                    >
                                        ← Back to Queue
                                    </button>
                                </div>

                                {/* HIGH-VISIBILITY HEADER: Customer Info + 3 Original Cards */}
                                <div className="bg-gradient-to-br from-yellow-900/20 to-purple-900/20 border-2 border-yellow-500/40 rounded-xl p-6 mb-6">
                                    <div className="grid grid-cols-3 gap-6 mb-4">
                                        <div>
                                            <p className="text-yellow-400 text-sm mb-1 font-semibold uppercase tracking-wide">Seeker:</p>
                                            <p className="text-2xl font-bold text-bone-white">{selectedOrder.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-yellow-400 text-sm mb-1 font-semibold uppercase tracking-wide">Language:</p>
                                            <p className="text-2xl font-bold text-bone-white uppercase">{selectedOrder.language}</p>
                                        </div>
                                        <div>
                                            <p className="text-yellow-400 text-sm mb-1 font-semibold uppercase tracking-wide">Paid:</p>
                                            <p className="text-2xl font-bold text-green-400">
                                                {selectedOrder.paidCurrency} {(selectedOrder.paidAmount || 0) / 100}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="text-yellow-400 text-sm mb-2 font-semibold uppercase tracking-wide">Question:</p>
                                        <p className="text-xl italic bg-purple-main/20 p-4 rounded-lg text-bone-white border border-purple-light/20">
                                            "{selectedOrder.question}"
                                        </p>
                                    </div>
                                    
                                    {/* 3 Original Cards - HIGH VISIBILITY */}
                                    {selectedOrder.cardIdsDrawn && (
                                        <div>
                                            <p className="text-yellow-400 text-sm mb-3 font-semibold uppercase tracking-wide">Original 3 Cards Drawn:</p>
                                            <div className="flex gap-4 justify-center">
                                                {JSON.parse(selectedOrder.cardIdsDrawn).map((cardId: number, index: number) => (
                                                    <div key={index} className="text-center">
                                                        <div className="w-32 h-48 relative rounded-lg overflow-hidden shadow-2xl mb-2 border-2 border-purple-light/30">
                                                            <Image
                                                                src={`/cards/${getCardImageName(cardId)}.jpg`}
                                                                alt={`Card ${cardId}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-sm text-purple-light font-semibold">Card {index + 1}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Info */}
                                <div className="bg-charcoal/50 rounded-xl p-6 mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-purple-light text-sm mb-1">Email:</p>
                                            <p className="text-base">{selectedOrder.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-purple-light text-sm mb-1">Order Date:</p>
                                            <p className="text-base">{selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleFulfillOrder} className="space-y-6">
                                    <div>
                                        <label className="block text-purple-light text-sm font-semibold mb-2">
                                            Your 36-Card Physical Deep-Dive Reading:
                                        </label>
                                        <textarea
                                            value={readingText}
                                            onChange={(e) => setReadingText(e.target.value)}
                                            rows={15}
                                            required
                                            placeholder="Write your personalized reading for this customer..."
                                            className="w-full px-4 py-3 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white placeholder-purple-light/40 focus:outline-none focus:border-purple-main resize-none"
                                        />
                                        <p className="text-sm text-purple-light/60 mt-2">
                                            {readingText.length} characters
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-purple-light text-sm font-semibold mb-2">
                                            Photo of Physical Spread (Optional):
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                                            className="w-full px-4 py-3 bg-charcoal/50 border-2 border-purple-light/20 rounded-xl text-bone-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-main file:text-white hover:file:bg-purple-light/80"
                                        />
                                        {photoFile && (
                                            <p className="text-sm text-green-400 mt-2">
                                                ✓ {photoFile.name} ({(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                        )}
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
                                            <p className="text-red-400">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !readingText.trim()}
                                        className="w-full px-8 py-4 bg-purple-gradient text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? '⏳ Sending 36-Card Reading...' : '✨ Complete & Send 36-Card Deep-Dive'}
                                    </button>
                                </form>
                            </div>
                        ) : (
                            // Orders Queue
                            <>
                                <div className="bg-purple-dark/20 border border-purple-light/20 rounded-xl p-6">
                                    <h2 className="text-2xl font-serif text-purple-light mb-4">
                                        🔮 Active Orders Awaiting Fulfillment
                                    </h2>
                                    {paidOrders.length === 0 ? (
                                        <p className="text-center text-purple-light/60 py-8">
                                            No pending orders. All caught up! ✨
                                        </p>
                                    ) : (
                                        <div className="space-y-4">
                                            {paidOrders.map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="bg-charcoal/50 border-2 border-yellow-500/30 rounded-xl p-6 hover:border-yellow-500/60 transition-all"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className="text-2xl font-bold text-yellow-400">
                                                                    Order #{order.id}
                                                                </span>
                                                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                                                                    💰 {order.paidCurrency} {(order.paidAmount || 0) / 100}
                                                                </span>
                                                                <span className="px-3 py-1 bg-purple-500/20 text-purple-light rounded-full text-sm uppercase">
                                                                    {order.language}
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                                <div>
                                                                    <p className="text-purple-light/60 text-sm">Customer:</p>
                                                                    <p className="text-lg font-semibold">{order.name}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-purple-light/60 text-sm">Email:</p>
                                                                    <p className="text-sm">{order.email}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p className="text-purple-light/60 text-sm mb-1">Question:</p>
                                                                <p className="italic bg-purple-main/10 p-3 rounded-lg">
                                                                    "{order.question}"
                                                                </p>
                                                            </div>
                                                            {order.paidAt && (
                                                                <p className="text-sm text-purple-light/60 mt-3">
                                                                    Paid: {new Date(order.paidAt).toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => setSelectedOrder(order)}
                                                            className="ml-4 px-6 py-3 bg-purple-gradient text-white rounded-xl font-bold hover:shadow-xl transition-all whitespace-nowrap"
                                                        >
                                                            Fulfill Order →
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
