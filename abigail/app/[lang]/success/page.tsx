'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay for dramatic effect
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-main mx-auto mb-4"></div>
          <p className="text-purple-light text-lg">Processing your request...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/logo.png"
            alt="Abigail"
            fill
            className="object-cover rounded-full"
          />
        </div>

        {/* Success Message */}
        <div className="bg-gradient-to-br from-purple-dark/30 to-purple-main/20 backdrop-blur-md border-2 border-purple-main/40 rounded-2xl p-8 md:p-12">
          <h1 className="text-3xl md:text-5xl font-serif text-purple-light mb-4">
            ✨ Payment Successful ✨
          </h1>
          <p className="text-bone-white text-lg md:text-xl mb-6">
            Thank you for requesting Abigail's premium reading.
          </p>
          
          <div className="bg-charcoal/50 rounded-xl p-6 mb-6">
            <h2 className="text-2xl font-serif text-purple-light mb-3">
              What Happens Next?
            </h2>
            <div className="text-bone-white/90 text-left space-y-3">
              <p>🔮 <strong>Within 24 hours</strong>, Abigail will perform your physical card spread using her authentic Hungarian Gypsy deck.</p>
              <p>📸 You will receive a <strong>personalized photo</strong> of your actual card layout.</p>
              <p>📧 A comprehensive reading will be sent to your email with deep insights and guidance.</p>
            </div>
          </div>

          <div className="border-t border-purple-main/30 pt-6">
            <p className="text-bone-white/70 text-sm">
              Your reading request has been added to Abigail's sacred queue.
              <br />
              Please check your email for confirmation and updates.
            </p>
          </div>

          {sessionId && (
            <p className="text-bone-white/50 text-xs mt-4">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        {/* Return Home */}
        <a
          href="/"
          className="inline-block mt-8 text-purple-light hover:text-purple-main transition-colors"
        >
          ← Return to Home
        </a>
      </div>
    </div>
  );
}

