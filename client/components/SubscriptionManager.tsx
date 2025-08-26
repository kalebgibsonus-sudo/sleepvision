import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Calendar, AlertCircle, ExternalLink, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { getFunctions, httpsCallable } from 'firebase/functions';

interface SubscriptionManagerProps {
  className?: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ className = '' }) => {
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const getSubscriptionInfo = () => {
    if (!user) return null;

    const tierInfo = {
      'sleep-focused': {
        name: 'Sleep-Focused',
        price: '$5.99/month',
        color: 'bg-blue-100 text-blue-800',
        description: 'Perfect sleep schedule optimization'
      },
      'full-transformation': {
        name: 'Full Transformation',
        price: '$9.99/month', 
        color: 'bg-purple-100 text-purple-800',
        description: 'Complete sleep & morning routine optimization'
      },
      'elite-performance': {
        name: 'Elite Performance',
        price: '$13.99/month',
        color: 'bg-gold-100 text-gold-800',
        description: 'Maximum optimization with exclusive benefits'
      }
    };

    return tierInfo[user.subscriptionTier as keyof typeof tierInfo] || null;
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error('Please sign in to manage your subscription');
      return;
    }

    setIsLoading(true);

    try {
      const functions = getFunctions();
      const createBillingPortalSession = httpsCallable(functions, 'createBillingPortalSession');
      
      const result = await createBillingPortalSession({
        customerId: user.stripeCustomerId,
        returnUrl: window.location.origin + '/dashboard'
      });

      const data = result.data as any;
      
      if (data.url) {
        // Open Stripe Billing Portal in same window
        window.location.href = data.url;
      } else {
        throw new Error('No billing portal URL received');
      }
    } catch (error: any) {
      console.error('Error opening billing portal:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionInfo = getSubscriptionInfo();
  const isActive = user?.isActive && user?.subscriptionStatus === 'active';

  if (!user) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Subscription Management
            </CardTitle>
            <CardDescription>
              Manage your SleepVision subscription and billing
            </CardDescription>
          </div>
          {user.subscriptionTier === 'elite-performance' && (
            <Crown className="h-6 w-6 text-yellow-500" />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Plan */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Current Plan</h3>
          
          {subscriptionInfo ? (
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-lg">{subscriptionInfo.name}</span>
                    <Badge className={subscriptionInfo.color}>
                      {subscriptionInfo.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{subscriptionInfo.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant={isActive ? 'default' : 'destructive'}>
                    {isActive ? 'Active' : (user.subscriptionStatus || 'Inactive')}
                  </Badge>
                </div>
              </div>

              {user.currentPeriodEnd && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Next billing: {new Date(user.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">No active subscription</span>
              </div>
              <p className="text-sm text-red-600 mt-1">
                Subscribe to access SleepVision features
              </p>
            </div>
          )}
        </div>

        {/* Subscription Status */}
        {user.subscriptionStatus && user.subscriptionStatus !== 'active' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-700">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Subscription Issue</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              Your subscription status is "{user.subscriptionStatus}". Please update your payment method to continue using SleepVision.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {subscriptionInfo ? (
            <Button
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Manage Subscription
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => window.location.href = '/subscription'}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Choose a Plan
            </Button>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Update payment method and billing details</p>
            <p>• View invoice history and download receipts</p>
            <p>• Change or cancel your subscription</p>
            <p>• All changes are processed securely through Stripe</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700">
            🔒 <strong>Secure:</strong> Your billing information is handled by Stripe, 
            our secure payment processor. We never store your payment details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
