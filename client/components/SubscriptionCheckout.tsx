import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, subscriptionPlans, SubscriptionPlanId } from '@/lib/stripe';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, CreditCard } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface CheckoutFormProps {
  selectedPlan: typeof subscriptionPlans[number];
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ selectedPlan, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.name,
          email: user.email,
        },
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Call Firebase function to create subscription
      const functions = getFunctions();
      const createSubscription = httpsCallable(functions, 'createSubscription');

      const result = await createSubscription({
        paymentMethodId: paymentMethod.id,
        priceId: selectedPlan.priceId,
        userId: user.id,
        userEmail: user.email,
        planId: selectedPlan.id,
      });

      const data = result.data as any;

      if (data.clientSecret) {
        // Confirm the payment
        const { error: confirmError } = await stripe.confirmCardPayment(data.clientSecret);

        if (confirmError) {
          throw new Error(confirmError.message);
        }
      }

      // Success
      onSuccess();
      
    } catch (error: any) {
      console.error('Payment error:', error);
      onError(error.message || 'An error occurred during payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        backgroundColor: '#ffffff',
        '::placeholder': {
          color: '#a78bfa', // Lavender placeholder
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg border border-purple-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-900">Payment Details</span>
        </div>
        <div className="bg-white p-3 border border-purple-100 rounded-md">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Subscribe for $${selectedPlan.price}/month`
        )}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Cancel anytime. No hidden fees. Secure payment with Stripe.
      </p>
    </form>
  );
};

const SubscriptionCheckout: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<typeof subscriptionPlans[number]>(subscriptionPlans[1]); // Default to middle plan
  const [showCheckout, setShowCheckout] = useState(false);

  // Handle pre-selected plan from navigation state
  useEffect(() => {
    const navigationState = location.state as { selectedPlan?: string } | null;
    if (navigationState?.selectedPlan) {
      const preSelectedPlan = subscriptionPlans.find(plan => plan.id === navigationState.selectedPlan);
      if (preSelectedPlan) {
        setSelectedPlan(preSelectedPlan);
        setShowCheckout(true); // Skip plan selection and go directly to checkout
      }
    }
  }, [location.state]);

  const handleSuccess = () => {
    toast.success('Subscription created successfully!');
    navigate('/payment-success');
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  const handlePlanSelect = (plan: typeof subscriptionPlans[number]) => {
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Please sign in to subscribe</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Sleep Optimization Plan
          </h1>
          <p className="text-xl text-gray-600">
            Unlock your perfect sleep schedule with AI-powered optimization
          </p>
        </div>

        {!showCheckout ? (
          // Plan Selection
          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                  plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // Checkout Form
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowCheckout(false)}
                  className="absolute left-4 top-4"
                >
                  ← Back to Plans
                </Button>
                <CardTitle className="text-2xl font-bold">
                  Subscribe to {selectedPlan.name}
                </CardTitle>
                <CardDescription>
                  ${selectedPlan.price}/month • {selectedPlan.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    selectedPlan={selectedPlan}
                    onSuccess={handleSuccess}
                    onError={handleError}
                  />
                </Elements>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
