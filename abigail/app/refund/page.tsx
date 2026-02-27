import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | Abigail — The Hungarian Oracle',
};

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-charcoal text-bone-white py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-purple-main text-sm hover:underline">← Back</Link>
        <h1 className="font-serif text-3xl font-bold mt-6 mb-2">Refund Policy</h1>
        <p className="text-sm text-bone-white/50 mb-10">Last updated: February 2025</p>

        <section className="space-y-8 text-bone-white/80 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">Our commitment</h2>
            <p>
              We want you to be fully satisfied with your reading. If something is wrong, please contact us and we will do our best to make it right.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">Refund window</h2>
            <p>
              You may request a full refund within <strong>24 hours of purchase</strong>, provided your reading has not yet been started.
              To request a refund, email <a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a> with your order details.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">After delivery</h2>
            <p>
              Because the premium reading is a <strong>personally performed, bespoke service</strong> — Abigail invests significant time preparing your physical 36-card spread —
              refunds are generally not available once the reading has been delivered.
            </p>
            <p className="mt-3">
              If you believe there was an error or you did not receive your reading, please contact us and we will investigate promptly.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">Non-delivery</h2>
            <p>
              If you do not receive your reading within <strong>48 hours</strong> of payment (excluding weekends and public holidays), you are entitled to a full refund.
              Please check your spam folder first, then contact us.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">How refunds are processed</h2>
            <p>
              Approved refunds are returned to your original payment method within <strong>5–10 business days</strong>, depending on your bank or card issuer.
              Refunds are processed via Stripe.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-bone-white mb-2">Contact us</h2>
            <p>
              <a href="mailto:contact@dbcdatastudio.com" className="text-purple-main hover:underline">contact@dbcdatastudio.com</a>
              <br />
              We aim to respond within 24 hours.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
