'use client';

/**
 * AdSlot — Google AdSense placeholder
 *
 * This component reserves layout space for future Google Ads monetization.
 * When you're ready to enable ads:
 *
 *   1. Sign up at https://adsense.google.com and get your Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
 *   2. Add your AdSense script to app/layout.tsx:
 *        <Script
 *          async
 *          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
 *          crossOrigin="anonymous"
 *          strategy="lazyOnload"
 *        />
 *   3. Replace TODO_PUBLISHER_ID and TODO_AD_SLOT_ID below with real values.
 *   4. Remove the placeholder UI (the gray box below) and uncomment the <ins> block.
 *
 * Google Ads policies reminder:
 *   - Do NOT place ads in a way that encourages accidental clicks (e.g., next to buttons).
 *   - Do NOT use auto-click or any deceptive UI patterns.
 *   - Minimum content-to-ads ratio must be maintained.
 *   - See: https://support.google.com/adsense/answer/48182
 */

interface AdSlotProps {
  /**
   * Slot size variant. Controls the reserved height.
   * - 'banner'    → 90px  (leaderboard / horizontal banner)
   * - 'rectangle' → 250px (medium rectangle, best performing for content pages)
   * - 'responsive'→ auto  (Google picks best size — recommended for mobile)
   */
  variant?: 'banner' | 'rectangle' | 'responsive';
  /** Additional CSS classes for positioning/margin control */
  className?: string;
}

export default function AdSlot({ variant = 'responsive', className = '' }: AdSlotProps) {
  const heights: Record<string, string> = {
    banner   : 'h-[90px]',
    rectangle: 'h-[250px]',
    responsive: 'min-h-[90px]',
  };

  /* ── PLACEHOLDER (remove when AdSense is live) ── */
  if (process.env.NODE_ENV === 'development' || !process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID) {
    return (
      <div
        className={`w-full ${heights[variant]} bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs ${className}`}
        aria-hidden="true"
      >
        {/* Ad slot placeholder — hidden from screen readers */}
        Ad slot ({variant})
      </div>
    );
  }

  /* ── PRODUCTION AdSense block ── */
  /* Uncomment and configure when AdSense is approved:

  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID; // e.g. ca-pub-1234567890123456
  const adSlotId    = 'TODO_AD_SLOT_ID';                            // e.g. 1234567890

  return (
    <div className={`w-full ${heights[variant]} overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlotId}
        data-ad-format={variant === 'responsive' ? 'auto' : 'fixed'}
        data-full-width-responsive={variant === 'responsive' ? 'true' : 'false'}
      />
      <script
        dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}
      />
    </div>
  );
  */

  return null;
}
