import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  Crown,
  Sparkles,
  Moon,
  Sun,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface SubscriptionRequiredProps {
  onSelectPlan: (planId: string) => void;
  onBack: () => void;
}

export function SubscriptionRequired({ onSelectPlan, onBack }: SubscriptionRequiredProps) {
  const plans = [
    {
      id: 'sleep-focused',
      name: 'Sleep Focused',
      price: '$5.99',
      period: '/month',
      description: 'Perfect for sleep optimization',
      stripeUrl: 'https://buy.stripe.com/28E9AU7OS1424Clb9e38404',
      features: [
        'Personalized sleep routine only',
        'AI sleep coach Luna for bedtime',
        'Sleep tracking & insights',
        'Bedtime reminders & alerts',
        'Sleep progress analytics'
      ],
      badge: 'Most Popular',
      badgeColor: 'bg-blue-500',
      bgGradient: 'from-blue-500 to-cyan-500',
      icon: <Moon className="w-6 h-6" />
    },
    {
      id: 'full-transformation',
      name: 'Full Transformation',
      price: '$9.99',
      period: '/month',
      description: 'Complete sleep & morning optimization',
      stripeUrl: 'https://buy.stripe.com/00w9AU1qu5kid8R0uA38403',
      features: [
        'Everything in Sleep Focused',
        'AI morning routine builder',
        'Wake-up optimization & energy tracking',
        'Combined sleep + morning habit tracking',
        'Breathing techniques for both routines',
        'Community access',
        'Standard customer support'
      ],
      badge: 'Best Value',
      badgeColor: 'bg-purple-500',
      bgGradient: 'from-purple-500 to-pink-500',
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: 'elite-performance',
      name: 'Elite Performance',
      price: '$13.99',
      period: '/month',
      description: 'Sleep + Morning + Product Discounts',
      stripeUrl: 'https://buy.stripe.com/3cIaEY5GK2866Ktdhm38402',
      features: [
        'Everything in Full Transformation',
        'Exclusive discounts on SleepVision products',
        'Priority customer support',
        'Advanced sleep analytics',
        'Custom challenges & goals',
        'Expert consultations',
        'Early access to new features'
      ],
      badge: 'Premium',
      badgeColor: 'bg-yellow-500',
      bgGradient: 'from-yellow-400 to-orange-500',
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const handlePlanSelect = (plan: typeof plans[0]) => {
    // Redirect to Stripe checkout
    window.open(plan.stripeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-4 bg-red-500/20 rounded-full border border-red-500/30">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-white">Subscription Required</h1>
              <p className="text-white/70">Choose a plan to access SleepVision</p>
            </div>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-red-200 text-lg font-medium">
              🔒 Access to SleepVision requires an active subscription. 
              Please choose a plan below to continue your sleep optimization journey.
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative bg-white/5 backdrop-blur-lg border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                plan.id === 'full-transformation' ? 'lg:scale-110 border-purple-400/50' : ''
              }`}
              onClick={() => handlePlanSelect(plan)}
            >
              {plan.badge && (
                <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-4 py-1 text-sm font-semibold`}>
                  {plan.badge}
                </Badge>
              )}
              
              <CardContent className="p-6 text-center">
                <div className={`p-3 bg-gradient-to-r ${plan.bgGradient} rounded-full inline-block mb-4 text-white`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/70">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${plan.bgGradient} hover:opacity-90 text-white font-bold py-3 text-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  size="lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="text-center space-y-4">
          <p className="text-white/60">
            💳 Secure payment processing by Stripe • 30-day money-back guarantee • Cancel anytime
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-white/30 text-white/70 hover:text-white hover:border-white/50 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            <div className="text-white/50 text-sm">
              Already subscribed? Contact support if you're not seeing access.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
