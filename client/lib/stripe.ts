import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 
  'pk_live_51Rg90uKgz9QnYIntCfLFgTjHBCpcVvIEcUlrPcZN4QD7ASZG2d0s4l0l2S2xU8KFUDDRzlKDUIzJIePWeBNZXWWv00jMW6Rmos';

// Initialize Stripe
export const stripePromise = loadStripe(stripePublishableKey);

// Subscription plans configuration
export const subscriptionPlans = [
  {
    id: 'sleep-focused',
    name: 'Sleep-Focused',
    price: 5.99,
    priceId: 'prod_ShOpHstB04WmkP',
    description: 'Perfect sleep schedule optimization',
    features: [
      'AI-powered sleep schedule',
      'Sleep assessment & tracking',
      'Basic breathing exercises',
      'Sleep optimization tips'
    ],
    popular: false
  },
  {
    id: 'full-transformation',
    name: 'Full Transformation',
    price: 9.99,
    priceId: 'prod_ShOsb0B7Sw7bRm',
    description: 'Complete sleep & morning routine optimization',
    features: [
      'Everything in Sleep-Focused',
      'Morning routine optimization',
      'Advanced breathing methods',
      'Discipline building tools',
      'Priority support'
    ],
    popular: true
  },
  {
    id: 'elite-performance',
    name: 'Elite Performance',
    price: 13.99,
    priceId: 'prod_ShOxiGR7WIhhN5',
    description: 'Maximum optimization with exclusive benefits',
    features: [
      'Everything in Full Transformation',
      'Exclusive product discounts',
      'Advanced analytics',
      'Personal coaching calls',
      'Beta feature access'
    ],
    popular: false
  }
] as const;

export type SubscriptionPlanId = typeof subscriptionPlans[number]['id'];
