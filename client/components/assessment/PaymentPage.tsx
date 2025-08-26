import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Clock, Sparkles, Users, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds

  const handleSubscribe = (tierName: string, tierId: string) => {
    console.log('🚀 Button clicked! tierName:', tierName, 'tierId:', tierId);
    console.log('👤 User:', user);

    if (!user) {
      console.log('❌ No user, redirecting to sign in');
      // If user is not signed in, navigate to home page to sign in first
      navigate('/', { state: { needsSignIn: true, intendedPlan: tierId } });
      return;
    }

    console.log('✅ Navigating to subscription with selected plan:', tierId);
    // Navigate to subscription checkout with the selected plan
    navigate('/subscription', { state: { selectedPlan: tierId } });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const subscriptionTiers = [
    {
      id: 'sleep-focused',
      name: 'Sleep Focused',
      price: '$5.99',
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
      icon: <Sparkles className="w-6 h-6" />
    },
    {
      id: 'full-transformation',
      name: 'Full Transformation', 
      price: '$9.99',
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
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-teal-50">
      {/* Timer Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-purple-100 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-teal-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SleepVision</h1>
                <p className="text-sm text-gray-600">Complete Your Sleep Transformation</p>
              </div>
            </div>
            
            <motion.div
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full"
              animate={{ 
                boxShadow: timeLeft <= 60 ? [
                  '0 0 0 0 rgba(239, 68, 68, 0.4)',
                  '0 0 0 8px rgba(239, 68, 68, 0)',
                  '0 0 0 0 rgba(239, 68, 68, 0.4)'
                ] : []
              }}
              transition={{
                duration: 1,
                repeat: timeLeft <= 60 ? Infinity : 0,
                repeatType: "loop"
              }}
            >
              <Clock className="w-4 h-4" />
              <span className="font-bold text-sm">
                We have your info for {formatTime(timeLeft)}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-600">Sleep Transformation</span> Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock your personalized sleep schedule and start sleeping better tonight
          </p>
        </motion.div>

        {/* Urgency Banner */}
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-2">⚡ Limited Time: Your Analysis is Ready!</h2>
          <p className="text-orange-100">
            Your personalized sleep schedule is waiting. Start your transformation before we lose your data!
          </p>
        </motion.div>

        {/* Subscription Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {subscriptionTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
            >
              <Card 
                className={`relative bg-white/80 backdrop-blur-lg border-2 hover:border-purple-300 transition-all duration-300 hover:shadow-xl ${
                  tier.id === 'full-transformation' ? 'lg:scale-105 border-purple-400/50 shadow-lg' : 'border-gray-200'
                }`}
              >
                {tier.badge && (
                  <Badge className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${tier.badgeColor} text-white px-4 py-1 text-sm font-semibold z-10`}>
                    {tier.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`p-3 bg-gradient-to-r ${tier.bgGradient} rounded-full inline-block mb-4 text-white mx-auto`}>
                    {tier.icon}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</CardTitle>
                  <p className="text-gray-600 mb-4">{tier.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-gray-700 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className={`w-full bg-gradient-to-r ${tier.bgGradient} hover:opacity-90 text-white font-bold py-3 text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                      size="lg"
                      onClick={() => handleSubscribe(tier.name, tier.id)}
                    >
                      Choose {tier.name}
                    </Button>
                  </motion.div>

                  <p className="text-gray-500 text-xs mt-3 text-center">
                    Secure payment • Cancel anytime • 30-day guarantee
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Trust Signals */}
        <motion.div
          className="bg-white/60 backdrop-blur-sm rounded-2xl border border-purple-200 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose SleepVision?</h3>
            <p className="text-gray-600">Join thousands who've transformed their sleep</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-teal-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">10M+ Users</h4>
              <p className="text-sm text-gray-600">Trusted by millions worldwide</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-teal-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-600">30-day risk-free trial</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-teal-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">4.9/5 Rating</h4>
              <p className="text-sm text-gray-600">Highest rated sleep app</p>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-purple-600 font-semibold">
            ⏰ Don't wait - start your sleep transformation tonight!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
