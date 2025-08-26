import { Request, Response } from "express";
import Stripe from "stripe";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  try {
    // In production, these would come from environment variables
    // For now, we'll use a placeholder implementation
    initializeApp({
      // You'll need to add your Firebase Admin SDK credentials here
      // credential: cert({
      //   projectId: process.env.FIREBASE_PROJECT_ID,
      //   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      // }),
    });
  } catch (error) {
    console.warn("Firebase Admin initialization skipped:", error);
  }
}

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16',
});

const db = getFirestore();

// Mapping of Stripe price IDs to subscription tiers
const PRICE_TO_TIER: Record<string, string> = {
  // Replace these with your actual Stripe price IDs
  'price_sleep_focused': 'sleep-focused',
  'price_full_transformation': 'full-transformation', 
  'price_elite_performance': 'elite-performance',
};

// Mapping of Stripe checkout URLs to tiers (fallback)
const URL_TO_TIER: Record<string, string> = {
  'https://buy.stripe.com/28E9AU7OS1424Clb9e38404': 'sleep-focused',
  'https://buy.stripe.com/00w9AU1qu5kid8R0uA38403': 'full-transformation',
  'https://buy.stripe.com/3cIaEY5GK2866Ktdhm38402': 'elite-performance',
};

async function updateUserSubscription(email: string, subscriptionTier: string) {
  try {
    console.log(`🔄 Updating subscription for ${email} to ${subscriptionTier}`);

    // Query Firestore for user by email
    const usersRef = db.collection('users');
    const query = usersRef.where('email', '==', email);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.warn(`⚠️ No user found with email: ${email}`);
      // Create a new user record if none exists
      const newUserRef = db.collection('users').doc();
      await newUserRef.set({
        email,
        subscriptionTier,
        subscriptionStatus: 'active',
        isActive: true,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
      console.log(`✅ Created new user record for ${email}`);
      return;
    }

    // Update existing user's subscription
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionTier,
      subscriptionStatus: 'active',
      isActive: true,
      updatedAt: new Date(),
    });

    console.log(`✅ Successfully updated subscription for ${email} to ${subscriptionTier}`);
  } catch (error) {
    console.error(`❌ Error updating subscription for ${email}:`, error);
    throw error;
  }
}

async function updateUserSubscriptionStatus(email: string, status: 'cancelled' | 'inactive') {
  try {
    console.log(`🔄 Updating subscription status for ${email} to ${status}`);

    // Query Firestore for user by email
    const usersRef = db.collection('users');
    const query = usersRef.where('email', '==', email);
    const snapshot = await query.get();

    if (snapshot.empty) {
      console.warn(`⚠️ No user found with email: ${email}`);
      return;
    }

    // Update existing user's subscription status
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({
      subscriptionStatus: status,
      isActive: false,
      updatedAt: new Date(),
    });

    console.log(`✅ Successfully updated subscription status for ${email} to ${status}`);
  } catch (error) {
    console.error(`❌ Error updating subscription status for ${email}:`, error);
    throw error;
  }
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    if (!endpointSecret) {
      console.warn("⚠️ Stripe webhook secret not configured");
      // In development, skip signature verification
      event = req.body;
    } else {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  console.log(`📨 Received Stripe webhook: ${event.type}`);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Checkout session completed:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          mode: session.mode,
          paymentStatus: session.payment_status,
        });

        if (session.mode === 'subscription' && session.customer_email) {
          // Get the subscription details
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            const priceId = subscription.items.data[0]?.price.id;
            
            if (priceId && PRICE_TO_TIER[priceId]) {
              const tier = PRICE_TO_TIER[priceId];
              await updateUserSubscription(session.customer_email, tier);
            } else {
              console.warn(`⚠️ Unknown price ID: ${priceId}`);
            }
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('📋 Subscription event:', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
          status: subscription.status,
          priceId: subscription.items.data[0]?.price.id,
        });

        if (subscription.status === 'active') {
          // Get customer email
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          
          if (customer && !customer.deleted && customer.email) {
            const priceId = subscription.items.data[0]?.price.id;
            
            if (priceId && PRICE_TO_TIER[priceId]) {
              const tier = PRICE_TO_TIER[priceId];
              await updateUserSubscription(customer.email, tier);
            }
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🗑️ Subscription cancelled:', subscription.id);

        // Get customer email and revoke access (subscription cancelled)
        const customer = await stripe.customers.retrieve(subscription.customer as string);

        if (customer && !customer.deleted && customer.email) {
          // Update user with cancelled status - they'll need to resubscribe for access
          await updateUserSubscriptionStatus(customer.email, 'cancelled');
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💰 Payment succeeded:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          amountPaid: invoice.amount_paid,
        });
        // Additional logic for successful payments if needed
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('❌ Payment failed:', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          attemptCount: invoice.attempt_count,
        });
        // Additional logic for failed payments if needed
        break;
      }

      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Helper function to manually update subscription (for testing)
export async function manualSubscriptionUpdate(req: Request, res: Response) {
  try {
    const { email, tier } = req.body;
    
    if (!email || !tier) {
      return res.status(400).json({ error: 'Email and tier are required' });
    }

    await updateUserSubscription(email, tier);
    res.json({ success: true, message: `Updated ${email} to ${tier}` });
  } catch (error) {
    console.error('Error in manual subscription update:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
}
