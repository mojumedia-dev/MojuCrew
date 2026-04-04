import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export const PLANS = {
  solo: {
    name: 'Solo',
    description: '1 AI bot of your choice',
    price: 79,
    bots: 1,
    priceId: process.env.STRIPE_PRICE_SOLO!,
  },
  pro: {
    name: 'Pro',
    description: '5 AI bots of your choice',
    price: 299,
    bots: 5,
    priceId: process.env.STRIPE_PRICE_PRO!,
  },
  enterprise: {
    name: 'Enterprise',
    description: 'All 11 AI bots',
    price: 599,
    bots: 11,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
  },
  agency: {
    name: 'Agency',
    description: 'All 11 bots + white-label',
    price: 999,
    bots: 11,
    priceId: process.env.STRIPE_PRICE_AGENCY!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
