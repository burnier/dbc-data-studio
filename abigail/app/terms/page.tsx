import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Abigail — The Hungarian Oracle',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-charcoal text-bone-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-main text-sm hover:underline">← Back</Link>
        <h1 className="font-serif text-3xl font-bold mt-6 mb-2">Terms of Service</h1>
        <p className="text-sm text-bone-white/50 mb-10">Last updated: February 2025</p>

        <section className="space-y-8 text-bone-white/80 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">1. Service description</h2>
            <p>
              Abigail, The Hungarian Oracle provides card reading services for <strong>entertainment and spiritual guidance purposes only</strong>.
              Readings are not a substitute for professional advice — medical, legal, financial, or psychological.
              The service is provided by DBC Data Studio (<a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a>).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">2. Free reading (apprentice)</h2>
            <p>
              The initial 3-card reading provided free of charge is generated with AI assistance as a preview.
              It is intended as a glimpse of your cards' energy, not a comprehensive reading.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">3. Premium reading</h2>
            <p>
              The paid 36-card ritual reading is performed manually by Abigail. Delivery is within <strong>24 hours</strong> of confirmed payment.
              You will receive your reading and a photo of your physical card spread by email.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">4. Payment</h2>
            <p>
              Payments are processed securely by <strong>Stripe</strong>. By completing a purchase you agree to Stripe's terms.
              All prices are inclusive of applicable taxes where required.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">5. Refunds</h2>
            <p>
              Please refer to our <Link href="/refund" className="text-purple-main hover:underline">Refund Policy</Link> for full details.
              In summary: refunds may be granted within 24 hours of purchase if the reading has not yet been started.
              Once the reading is delivered, no refunds are issued as the service has been fully rendered.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">6. Disclaimer</h2>
            <p>
              Card readings are provided for spiritual and entertainment purposes. We make no guarantee of accuracy or outcomes.
              By using this service you accept that results are subjective and should not be relied upon for major life decisions.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">7. Intellectual property</h2>
            <p>
              All content on this website — including reading texts, imagery, and branding — is the property of DBC Data Studio and may not be reproduced without written permission.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">8. Governing law</h2>
            <p>
              These terms are governed by the laws of the European Union and the country of residence of the service provider.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">9. Contact</h2>
            <p>
              For questions about these terms, contact <a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
