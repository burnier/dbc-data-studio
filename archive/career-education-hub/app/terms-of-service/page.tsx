import Link from 'next/link';

export const metadata = {
    title: 'Terms of Service - DBC Data Studio',
    description: 'Terms of Service for DBC Data Studio - AI Career & Education Hub',
};

export default function TermsOfService() {
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-600 mb-4">
                            <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
                            <p className="text-gray-700 mb-4">
                                By accessing or using dbcdatastudio.com (the "Site"), operated by DBC Data Studio ("we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
                            <p className="text-gray-700 mb-4">
                                Permission is granted to temporarily access the materials on DBC Data Studio's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>Modify or copy the materials</li>
                                <li>Use the materials for any commercial purpose or for any public display</li>
                                <li>Attempt to reverse engineer any software contained on the Site</li>
                                <li>Remove any copyright or other proprietary notations from the materials</li>
                                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Affiliate Disclosure</h2>
                            <p className="text-gray-700 mb-4">
                                DBC Data Studio is a professional review site. We may receive compensation from the companies whose products we review (e.g., DataCamp, Udemy, Coursera, DataQuest, Pluralsight). This compensation impacts the location and order in which products appear but does not influence our technical evaluations.
                            </p>
                            <p className="text-gray-700 mb-4">
                                When you click on links to third-party websites or make purchases through our affiliate links, we may receive a commission. This does not affect the price you pay and helps support our site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer</h2>
                            <p className="text-gray-700 mb-4">
                                The materials on DBC Data Studio's website are provided on an 'as is' basis. DBC Data Studio makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                            <p className="text-gray-700 mb-4">
                                Further, DBC Data Studio does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitations</h2>
                            <p className="text-gray-700 mb-4">
                                In no event shall DBC Data Studio or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on DBC Data Studio's website, even if DBC Data Studio or a DBC Data Studio authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Accuracy of Materials</h2>
                            <p className="text-gray-700 mb-4">
                                The materials appearing on DBC Data Studio's website could include technical, typographical, or photographic errors. DBC Data Studio does not warrant that any of the materials on its website are accurate, complete, or current. DBC Data Studio may make changes to the materials contained on its website at any time without notice.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Links</h2>
                            <p className="text-gray-700 mb-4">
                                DBC Data Studio has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by DBC Data Studio of the site. Use of any such linked website is at the user's own risk.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Modifications</h2>
                            <p className="text-gray-700 mb-4">
                                DBC Data Studio may revise these Terms of Service at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Content</h2>
                            <p className="text-gray-700 mb-4">
                                If you submit any content to our Site (including comments, feedback, or other submissions), you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, and distribute such content.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Prohibited Uses</h2>
                            <p className="text-gray-700 mb-4">You may not use our Site:</p>
                            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                                <li>In any way that violates any applicable law or regulation</li>
                                <li>To transmit any malicious code or viruses</li>
                                <li>To attempt to gain unauthorized access to any portion of the Site</li>
                                <li>To interfere with or disrupt the Site or servers connected to the Site</li>
                                <li>For any fraudulent or harmful purpose</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
                            <p className="text-gray-700 mb-4">
                                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
                            <p className="text-gray-700 mb-4">
                                If you have any questions about these Terms of Service, please contact us at:
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

