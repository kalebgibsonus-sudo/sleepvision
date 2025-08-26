import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  feature?: 'dashboard' | 'sleep' | 'morning' | 'discounts';
  fallbackMessage?: string;
  showUpgradeOptions?: boolean;
}

const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({
  children,
  feature = 'dashboard',
  fallbackMessage,
  showUpgradeOptions = true
}) => {
  const { user, hasAccess, isLoading } = useAuth();
  const navigate = useNavigate();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show sign-in prompt for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Lock className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check feature access
  if (!hasAccess(feature)) {
    const getFeatureInfo = () => {
      switch (feature) {
        case 'dashboard':
          return {
            title: 'Premium Dashboard Access',
            description: 'Access to the full SleepVision dashboard requires an active subscription.',
            requiredTier: 'Any subscription plan'
          };
        case 'morning':
          return {
            title: 'Morning Routine Features',
            description: 'Morning routine optimization is available for Full Transformation and Elite Performance plans.',
            requiredTier: 'Full Transformation ($9.99/mo) or Elite Performance ($13.99/mo)'
          };
        case 'discounts':
          return {
            title: 'Exclusive Discounts',
            description: 'Product discounts and exclusive offers are available for Elite Performance members.',
            requiredTier: 'Elite Performance ($13.99/mo)'
          };
        default:
          return {
            title: 'Premium Feature',
            description: 'This feature requires an active subscription.',
            requiredTier: 'Active subscription'
          };
      }
    };

    const featureInfo = getFeatureInfo();

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
              <Crown className="h-8 w-8 text-purple-600" />
            </div>
            <CardTitle className="text-2xl">{featureInfo.title}</CardTitle>
            <CardDescription className="text-lg">
              {fallbackMessage || featureInfo.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Required Access Level</h3>
              </div>
              <p className="text-gray-700">{featureInfo.requiredTier}</p>
            </div>

            {user.subscriptionStatus && user.subscriptionStatus !== 'active' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Subscription Issue</h4>
                <p className="text-sm text-yellow-700">
                  Your subscription status is "{user.subscriptionStatus}". Please update your payment method to restore access.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {showUpgradeOptions && (
                <Button
                  onClick={() => navigate('/subscription')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  {user.subscriptionTier ? 'Manage Subscription' : 'Choose a Plan'}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Go to Home
              </Button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Questions? Contact support at support@sleepvision.com
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User has access - render children
  return <>{children}</>;
};

export default SubscriptionGuard;
