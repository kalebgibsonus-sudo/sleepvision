import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredFeature?: 'sleep' | 'morning';
}

export function SubscriptionModal({ isOpen, onClose, requiredFeature }: SubscriptionModalProps) {
  const { user, updateSubscription } = useAuth();

  const plans = [
    {
      id: 'sleep',
      name: 'Sleep Schedule',
      price: '$5.99',
      period: '/month',
      description: 'Perfect for optimizing your sleep',
      features: [
        'AI Sleep Schedule Builder',
        'Sleep tracking & analytics',
        'Personalized recommendations',
        'Basic Luna AI coaching',
      ],
      icon: <Zap className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      stripeUrl: 'https://buy.stripe.com/28E9AU7OS1424Clb9e38404',
      tier: 'sleep-focused' as const,
    },
    {
      id: 'full',
      name: 'Sleep + Morning',
      price: '$9.99',
      period: '/month',
      description: 'Complete routine optimization',
      features: [
        'Everything in Sleep Schedule',
        'AI Morning Routine Builder',
        'Advanced habit tracking',
        'Full Luna AI coaching',
        'Custom reminders & alerts',
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      stripeUrl: 'https://buy.stripe.com/00w9AU1qu5kid8R0uA38403',
      tier: 'full-transformation' as const,
      popular: true,
    },
    {
      id: 'premium',
      name: 'All Features + Discounts',
      price: '$13.99',
      period: '/month',
      description: 'Sleep + Morning + Product Discounts',
      features: [
        'Everything in Sleep + Morning',
        'Exclusive discounts on SleepVision products',
        'Priority customer support',
        'Early access to new features',
        'Advanced analytics & insights',
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'from-yellow-400 to-orange-500',
      stripeUrl: 'https://buy.stripe.com/3cIaEY5GK2866Ktdhm38402',
      tier: 'elite-performance' as const,
    },
  ];

  const handlePlanSelect = (plan: typeof plans[0]) => {
    // Redirect to Stripe checkout
    window.open(plan.stripeUrl, '_blank');

    // Note: Subscription will be activated via Stripe webhooks in production
    // For now, close the modal - the user will be subscribed when payment completes
    onClose();
  };

  const getRecommendedPlan = () => {
    if (requiredFeature === 'morning') return 'full';
    if (requiredFeature === 'sleep') return 'sleep';
    return 'full';
  };

  const recommendedPlan = getRecommendedPlan();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your SleepVision Plan
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Unlock AI-powered sleep and morning routines tailored just for you
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-200 hover:scale-105 ${
                plan.id === recommendedPlan
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handlePlanSelect(plan)}
                className={`w-full font-semibold ${
                  plan.id === recommendedPlan
                    ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                    : ''
                }`}
                variant={plan.id === recommendedPlan ? 'default' : 'outline'}
              >
                {plan.id === recommendedPlan ? 'Get Started' : 'Choose Plan'}
              </Button>

              {user?.subscriptionTier === plan.tier && (
                <div className="mt-3 text-center">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Current Plan
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>🔒 Secure payment processing by Stripe</p>
          <p>Cancel anytime • No long-term commitments</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
