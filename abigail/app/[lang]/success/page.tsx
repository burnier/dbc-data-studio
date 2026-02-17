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
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-4 relative overflow-hidden">
      {/* Blurred Background Cards */}
      <div className="absolute inset-0 opacity-10">
        <Image
          src="/cards/card-01-house.jpg"
          alt=""
          fill
          className="object-cover blur-2xl"
        />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Mystical Icon */}
        <div className="text-7xl mb-6">🌙</div>

        {/* Success Message - Dark & Mystical */}
        <div className="bg-gradient-to-br from-purple-dark/50 to-black/70 backdrop-blur-xl border-2 border-purple-main/40 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-5xl font-serif text-purple-light mb-6">
            The Energy is Set
          </h1>
          
          <div className="bg-charcoal/70 rounded-xl p-8 mb-6 border border-purple-light/20">
            <p className="text-bone-white text-lg md:text-xl leading-relaxed">
              Abigail is now at her wooden table, laying out the <span className="text-yellow-400 font-semibold">36-card Hungarian Grand Tableau</span> specifically for your energy.
            </p>
            <p className="text-bone-white/80 text-base mt-4">
              Check your inbox within <strong className="text-purple-light">24 hours</strong> for your photo and analysis.
            </p>
          </div>

          <div className="border-t border-purple-main/30 pt-6">
            <p className="text-bone-white/60 text-sm italic">
              🕯️ Your reading is being prepared in spiritual silence 🕯️
            </p>
          </div>

          {sessionId && (
            <p className="text-bone-white/40 text-xs mt-4">
              Order ID: {sessionId}
            </p>
          )}
        </div>

        {/* Return Home */}
        <a
          href="/"
          className="inline-block mt-8 text-purple-light hover:text-purple-main transition-colors text-sm"
        >
          ← Return to Home
        </a>
      </div>
    </div>
  );
}

