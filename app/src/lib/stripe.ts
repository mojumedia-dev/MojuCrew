import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export const PLANS = {
  starter: {
    name: 'Starter',
    description: '1 AI bot of your choice',
    price: 79,
    bots: 1,
    priceId: process.env.STRIPE_PRICE_STARTER!,
  },
  growth: {
    name: 'Growth',
    description: '3 AI bots',
    price: 199,
    bots: 3,
    priceId: process.env.STRIPE_PRICE_GROWTH!,
  },
  full_crew: {
    name: 'Full Crew',
    description: 'All 5 AI bots',
    price: 349,
    bots: 5,
    priceId: process.env.STRIPE_PRICE_FULL_CREW!,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
