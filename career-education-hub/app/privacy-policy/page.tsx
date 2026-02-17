import Link from 'next/link';

export const metadata = {
    title: 'Privacy Policy - DBC Data Studio',
    description: 'Privacy Policy for DBC Data Studio - AI Career & Education Hub',
};

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-6">
                    <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                        DBC Data Studio
                    </Link>
                    <p className="text-gray-600 mt-1">AI Career & Education Hub</p>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-4">
                            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                            <p className="text-gray-700 mb-4">
                                DBC Data Studio ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website dbcdatastudio.com (the "Site").
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Information You Provide</h3>
                            <p className="text-gray-700 mb-4">
                                We may collect information that you voluntarily provide to us, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Email address (when you subscribe to our newsletter or join a waitlist)</li>
                                <li>Name (if provided)</li>
                                <li>Any other information you choose to provide</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
                            <p className="text-gray-700 mb-4">
                                When you visit our Site, we may automatically collect certain information, including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Pages you visit and time spent on pages</li>
                                <li>Referring website addresses</li>
                                <li>Device information</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Send you updates about learning paths and career resources</li>
                                <li>Provide you with direct enrollment links and educational content</li>
                                <li>Improve our website and user experience</li>
                                <li>Analyze website usage and trends</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclosure of Your Information</h2>
                            <p className="text-gray-700 mb-4">
                                We may share your information in the following situations:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf</li>
                                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid requests by public authorities</li>
                                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                            <p className="text-gray-700 mb-4">
                                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
                            <p className="text-gray-700 mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Access your personal information</li>
                                <li>Request correction of inaccurate information</li>
                                <li>Request deletion of your information</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                            <p className="text-gray-700 mb-4">
                                To exercise these rights, please contact us using the information provided below.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 mb-4">
                                We may use cookies and similar tracking technologies to track activity on our Site and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
                            <p className="text-gray-700 mb-4">
                                Our Site may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
                            <p className="text-gray-700 mb-4">
                                Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Privacy Policy</h2>
                            <p className="text-gray-700 mb-4">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="text-gray-700">
                                <strong>Email:</strong> daniel@dbcdatastudio.com<br />
                                <strong>Website:</strong> dbcdatastudio.com
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} DBC Data Studio. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

