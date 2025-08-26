import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Crown, Loader2, Moon, Sun, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Stripe Product IDs - Your actual Stripe products
const STRIPE_PRICE_IDS = {
  SLEEP_FOCUSED: 'prod_ShOpHstB04WmkP',     // $5.99/month
  FULL_TRANSFORMATION: 'prod_ShOsb0B7Sw7bRm', // $9.99/month
  ELITE_PERFORMANCE: 'prod_ShOxiGR7WIhhN5',   // $13.99/month
};

interface SubscriptionTier {
  id: string;
  name: string;
  price: string;
  priceId: string;
  description: string;
  features: string[];
  badge?: string;
  badgeColor: string;
  bgGradient: string;
  icon: React.ReactNode;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'sleep-focused',
    name: 'Sleep Focused',
    price: '$5.99',
    priceId: STRIPE_PRICE_IDS.SLEEP_FOCUSED,
    description: 'Perfect for sleep optimization',
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
    priceId: STRIPE_PRICE_IDS.FULL_TRANSFORMATION,
    description: 'Complete sleep & morning optimization',
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
    priceId: STRIPE_PRICE_IDS.ELITE_PERFORMANCE,
    description: 'Sleep + Morning + Product Discounts',
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
    icon: <Trophy className="w-6 h-6" />
  }
];

export default function StripeCheckout() {
  const { user, hasAccess } = useAuth();
  const navigate = useNavigate();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      alert('Please sign in first to subscribe');
      return;
    }

    setLoadingTier(tier.id);

    try {
      // Track conversion event with Meta Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: tier.name,
          content_category: 'Sleep Subscription',
          value: parseFloat(tier.price.replace('$', '') || '0'),
          currency: 'USD'
        });
      }

      // Navigate to the proper checkout page with Stripe Elements and selected plan
      navigate('/subscription', { state: { selectedPlan: tier.id } });

    } catch (error: any) {
      console.error('Navigation to checkout failed:', error);
      alert(`Checkout navigation failed: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setLoadingTier(null);
    }
  };

  // Show current subscription status if user is subscribed
  const getCurrentSubscription = () => {
    if (!user) return null;

    const currentTier = subscriptionTiers.find(tier => tier.id === user.subscriptionTier);
    if (!currentTier) return null;

    return (
      <Card className="mb-8 bg-green-500/10 border-green-400/30">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-green-200">Active Subscription</h3>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-bold text-green-300">{currentTier.name}</div>
            <div className="text-green-400">{currentTier.price}/month</div>
            <div className="text-green-200 text-sm">
              ✅ {hasAccess('dashboard') ? 'Dashboard Access' : 'No Dashboard Access'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {getCurrentSubscription()}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
        {subscriptionTiers.map((tier) => (
          <Card 
            key={tier.id}
            className={`relative bg-white/5 backdrop-blur-lg border-white/20 hover:border-white/40 transition-all duration-300 ${
              tier.id === 'full-transformation' ? 'lg:scale-110 border-purple-400/50' : ''
            }`}
          >
            {tier.badge && (
              <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${tier.badgeColor} text-white px-4 py-1 text-sm font-semibold`}>
                {tier.badge}
              </Badge>
            )}
            
            <CardContent className="p-6 text-center">
              <div className={`p-3 bg-gradient-to-r ${tier.bgGradient} rounded-full inline-block mb-4 text-white`}>
                {tier.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-white/70 mb-4">{tier.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-white/70">/month</span>
              </div>
              
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button
                className={`w-full bg-gradient-to-r ${tier.bgGradient} hover:opacity-90 text-white font-bold py-3 text-lg transition-all duration-300`}
                size="lg"
                onClick={() => handleSubscribe(tier)}
                disabled={loadingTier === tier.id || !user}
              >
                {loadingTier === tier.id ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Checkout...
                  </div>
                ) : user ? (
                  'Subscribe with Stripe'
                ) : (
                  'Sign In to Subscribe'
                )}
              </Button>

              {user && (
                <p className="text-white/60 text-xs mt-2">
                  Secure payment powered by Stripe • Cancel anytime
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!user && (
        <div className="text-center mt-8">
          <p className="text-white/70">Please sign in to choose a subscription plan</p>
        </div>
      )}
    </div>
  );
}
