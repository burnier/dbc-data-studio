import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Abigail — The Hungarian Oracle',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-charcoal text-bone-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-main text-sm hover:underline">← Back</Link>
        <h1 className="font-serif text-3xl font-bold mt-6 mb-2">Privacy Policy</h1>
        <p className="text-sm text-bone-white/50 mb-10">Last updated: February 2025</p>

        <section className="space-y-8 text-bone-white/80 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">1. Who we are</h2>
            <p>
              This website is operated by <strong>DBC Data Studio</strong> on behalf of Abigail, The Hungarian Oracle.
              Contact: <a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a>
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">2. Data we collect</h2>
            <p>When you submit a reading request, we collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Your <strong>first and last name</strong></li>
              <li>Your <strong>email address</strong></li>
              <li>Your <strong>question or intention</strong> for the reading</li>
              <li>Your <strong>chosen language</strong> and the cards drawn</li>
              <li>Payment information (processed by Stripe — we never see your card details)</li>
            </ul>
            <p className="mt-3">We also collect anonymous usage data via Google Analytics and Vercel Analytics (page views, referrers, device type). These require your consent and can be declined.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">3. How we use your data</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>To deliver your card reading by email</li>
              <li>To process payment (via Stripe)</li>
              <li>To respond to questions or support requests</li>
              <li>To improve our service (anonymous analytics only)</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your data, share it with third parties for marketing, or use it for automated profiling.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">4. Legal basis (GDPR)</h2>
            <p>
              We process your data under <strong>Article 6(1)(b) GDPR</strong> (performance of a contract) for the reading service
              and <strong>Article 6(1)(a) GDPR</strong> (your consent) for analytics cookies.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">5. Data retention</h2>
            <p>
              Your submission data is retained for up to <strong>12 months</strong> after your reading is delivered, then deleted.
              You may request earlier deletion at any time.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">6. Your rights</h2>
            <p>Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Withdraw consent for analytics at any time</li>
              <li>Lodge a complaint with your local supervisory authority</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, email <a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">7. Third-party processors</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Stripe</strong> — payment processing (<a href="https://stripe.com/privacy" className="text-purple-main hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>)</li>
              <li><strong>Resend</strong> — email delivery (<a href="https://resend.com/privacy" className="text-purple-main hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>)</li>
              <li><strong>Vercel</strong> — hosting and analytics (<a href="https://vercel.com/legal/privacy-policy" className="text-purple-main hover:underline" target="_blank" rel="noopener noreferrer">privacy policy</a>)</li>
              <li><strong>Google Analytics</strong> — usage analytics (consent required)</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
