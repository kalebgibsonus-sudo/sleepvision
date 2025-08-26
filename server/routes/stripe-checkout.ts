import { Request, Response } from "express";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-04-10',
});

export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { priceId, customerEmail, successUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!priceId) {
      return res.status(400).json({ 
        error: 'Price ID is required' 
      });
    }

    if (!successUrl || !cancelUrl) {
      return res.status(400).json({ 
        error: 'Success URL and Cancel URL are required' 
      });
    }

    console.log('Creating Stripe checkout session:', {
      priceId,
      customerEmail,
      successUrl,
      cancelUrl
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      customer_email: customerEmail || undefined,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      automatic_tax: {
        enabled: true,
      },
      metadata: {
        customerEmail: customerEmail || '',
        priceId,
      },
    });

    console.log('✅ Stripe checkout session created:', session.id);

    res.json({
      sessionId: session.id,
      sessionUrl: session.url,
    });

  } catch (error: any) {
    console.error('❌ Error creating checkout session:', error);
    
    // Return user-friendly error messages
    if (error.type === 'StripeCardError') {
      res.status(400).json({ 
        error: 'Your card was declined. Please try a different payment method.' 
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      res.status(400).json({ 
        error: 'Invalid payment request. Please check your information and try again.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Payment system temporarily unavailable. Please try again later.' 
      });
    }
  }
}
