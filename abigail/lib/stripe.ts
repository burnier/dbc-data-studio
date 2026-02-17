/**
 * Stripe Client Utilities
 * Handles client-side Stripe checkout redirection
 */
import { PRICING, type Language } from './constants';

export interface CheckoutRequest {
  submissionId: number;
  language: Language;
  email: string;
}

/**
 * Create a Stripe Checkout Session and redirect user
 */
export async function redirectToCheckout(data: CheckoutRequest): Promise<void> {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout
    if (url) {
      window.location.href = url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
}

/**
 * Format price by language/currency
 */
export function formatPrice(language: Language): string {
  return PRICING[language].formatted;
}

