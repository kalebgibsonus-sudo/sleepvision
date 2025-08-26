import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, RefreshCw, AlertTriangle } from "lucide-react";

export default function DebugUserInfo() {
  const { user, refreshUserData, hasAccess } = useAuth();
  const [showDebug, setShowDebug] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshUserData = async () => {
    setIsRefreshing(true);
    try {
      await refreshUserData();
      console.log("🔄 User data refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!user) {
    return (
      <Card className="bg-red-500/10 border-red-400/30">
        <CardContent className="p-4">
          <div className="text-red-200 text-sm">No user found - Please sign in</div>
        </CardContent>
      </Card>
    );
  }

  const accessChecks = [
    { feature: 'dashboard', label: 'Dashboard Access' },
    { feature: 'sleep', label: 'Sleep Features' },
    { feature: 'morning', label: 'Morning Features' },
    { feature: 'discounts', label: 'Product Discounts' }
  ] as const;

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm">Account Debug Info</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRefreshUserData}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="bg-blue-500/20 border-blue-400 text-blue-200 hover:bg-blue-500/30"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowDebug(!showDebug)}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              {showDebug ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Basic Info - Always Visible */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-white/70">Email:</span>
            <span className="text-white font-mono text-xs">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Subscription:</span>
            <Badge className={
              user.subscriptionTier === 'free' ? 'bg-gray-500' :
              user.subscriptionTier === 'sleep-focused' ? 'bg-blue-500' :
              user.subscriptionTier === 'full-transformation' ? 'bg-purple-500' :
              'bg-yellow-500'
            }>
              {user.subscriptionTier}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Status:</span>
            <Badge className={
              user.subscriptionStatus === 'active' ? 'bg-green-500' :
              user.subscriptionStatus === 'canceled' ? 'bg-red-500' :
              user.subscriptionStatus === 'past_due' ? 'bg-yellow-500' :
              'bg-gray-500'
            }>
              {user.subscriptionStatus || 'unknown'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/70">Active:</span>
            <Badge className={user.isActive ? 'bg-green-500' : 'bg-red-500'}>
              {user.isActive ? '✅ Yes' : '❌ No'}
            </Badge>
          </div>
          
          {/* Show access issues prominently */}
          {user.subscriptionTier !== 'free' && !hasAccess('dashboard') && (
            <div className="flex items-start gap-2 p-2 bg-red-500/20 border border-red-400/30 rounded">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-red-200 text-xs">
                <div className="font-semibold">Access Issue Detected!</div>
                <div>You have a paid subscription but dashboard access is denied.</div>
              </div>
            </div>
          )}
        </div>

        {/* Detailed Debug Info - Collapsible */}
        {showDebug && (
          <div className="mt-4 pt-4 border-t border-white/20 space-y-3 text-xs">
            {/* Access Permissions */}
            <div>
              <div className="text-white/90 font-semibold mb-2">Feature Access:</div>
              <div className="grid grid-cols-2 gap-2">
                {accessChecks.map(({ feature, label }) => (
                  <div key={feature} className="flex justify-between items-center">
                    <span className="text-white/70">{label}:</span>
                    <Badge 
                      variant="outline" 
                      className={
                        hasAccess(feature as any)
                          ? 'bg-green-500/20 border-green-400 text-green-200'
                          : 'bg-red-500/20 border-red-400 text-red-200'
                      }
                    >
                      {hasAccess(feature as any) ? '✅' : '❌'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* User Object Details */}
            <div>
              <div className="text-white/90 font-semibold mb-2">User Data:</div>
              <div className="bg-black/30 p-2 rounded font-mono text-xs space-y-1">
                <div>ID: {user.id}</div>
                <div>Name: {user.name}</div>
                <div>Created: {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleString() : 'Unknown'}</div>
                <div>Last Login: {user.lastLogin ? new Date(user.lastLogin.seconds * 1000).toLocaleString() : 'Unknown'}</div>
              </div>
            </div>

            {/* Admin Check */}
            <div>
              <div className="text-white/90 font-semibold mb-2">Special Status:</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/70">Admin Bypass:</span>
                  <Badge className={
                    user.email === "kalebgibson.us@gmail.com" 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-gray-500'
                  }>
                    {user.email === "kalebgibson.us@gmail.com" ? '👑 ADMIN' : 'Normal User'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Troubleshooting Suggestions */}
            <div>
              <div className="text-white/90 font-semibold mb-2">Troubleshooting:</div>
              <div className="text-white/70 space-y-1">
                {user.subscriptionTier === 'free' && (
                  <div>• You're on the free tier - upgrade to access premium features</div>
                )}
                {user.subscriptionTier !== 'free' && user.subscriptionStatus !== 'active' && (
                  <div>• Subscription exists but status is "{user.subscriptionStatus}" - check payment method</div>
                )}
                {user.subscriptionTier !== 'free' && !user.isActive && (
                  <div>• Subscription tier exists but marked inactive - webhook may not have processed</div>
                )}
                {user.subscriptionTier !== 'free' && !hasAccess('dashboard') && (
                  <div>• Access denied despite subscription - try the manual fix button or contact support</div>
                )}
                <div>• Try refreshing user data (click refresh button above)</div>
                <div>• If you just paid, wait 1-2 minutes for Stripe webhook processing</div>
                {user.stripeCustomerId && (
                  <div>• Stripe Customer ID: {user.stripeCustomerId}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
