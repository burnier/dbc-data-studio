/**
 * Application-wide constants
 * Single source of truth for pricing, configurations, and shared values
 */

export type Language = 'en' | 'de' | 'pt' | 'hu';

/**
 * Pricing Configuration
 * These must match the prices configured in Stripe Dashboard
 * See STRIPE_SETUP_GUIDE.md for setup instructions
 */
export const PRICING = {
    en: {
        amount: 29.00,
        currency: 'USD',
        formatted: '$29.00',
        stripeEnvVar: 'STRIPE_PRICE_USD',
    },
    de: {
        amount: 24.90,
        currency: 'EUR',
        formatted: '€24.90',
        stripeEnvVar: 'STRIPE_PRICE_EUR',
    },
    pt: {
        amount: 129.00,
        currency: 'BRL',
        formatted: 'R$ 129,00',
        stripeEnvVar: 'STRIPE_PRICE_BRL',
    },
    hu: {
        amount: 8900,
        currency: 'HUF',
        formatted: '8.900 Ft',
        stripeEnvVar: 'STRIPE_PRICE_HUF',
    },
} as const;

/**
 * Rate Limiting Configuration
 */
export const RATE_LIMITS = {
    maxSubmissionsPerEmail: 3,
    timeWindowHours: 1,
} as const;

/**
 * Card Configuration
 */
export const CARDS = {
    totalCards: 36,
    cardsPerReading: 3,
} as const;

/**
 * AI Configuration
 */
export const AI_CONFIG = {
    maxOutputTokens: 2048,
    temperature: 0.7,
    wordCountTarget: {
        min: 150,
        max: 180,
    },
} as const;

/**
 * Email Configuration
 */
export const EMAIL_CONFIG = {
    fromName: 'Abigail',
    fromDomain: 'abigail.dbcdatastudio.com',
} as const;

/**
 * Fulfillment SLA
 */
export const FULFILLMENT = {
    slaHours: 24,
} as const;

