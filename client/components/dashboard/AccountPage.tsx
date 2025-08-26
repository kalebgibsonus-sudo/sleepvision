import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Mail, 
  Calendar,
  Crown,
  Home,
  LogOut,
  Shield,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import SubscriptionManager from '../SubscriptionManager';

interface AccountPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function AccountPage({ onNavigate, onGoHome }: AccountPageProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      if (onGoHome) {
        onGoHome();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-xl font-semibold mb-2">Account Settings</h3>
        <p className="text-gray-600">
          Sign in to manage your account and subscription
        </p>
      </div>
    );
  }

  const getSubscriptionBadge = () => {
    const tierColors = {
      'sleep-focused': 'bg-blue-100 text-blue-800',
      'full-transformation': 'bg-purple-100 text-purple-800',
      'elite-performance': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Badge className={tierColors[user.subscriptionTier as keyof typeof tierColors] || 'bg-gray-100 text-gray-800'}>
        {user.subscriptionTier?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Free'}
      </Badge>
    );
  };

  const memberSince = user.createdAt 
    ? new Date(user.createdAt.toDate()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : 'Recently';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚙️ Account Settings</h1>
          <p className="text-gray-600 text-lg">
            Manage your profile, subscription, and preferences
          </p>
        </div>
        <div className="flex gap-3">
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
          <Button
            onClick={() => onNavigate('overview')}
            variant="outline"
            className="flex items-center gap-2"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile & Account Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {user.subscriptionTier === 'elite-performance' && (
                    <Crown className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500" />
                  )}
                </div>
              </div>
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="flex justify-center mt-2">
                {getSubscriptionBadge()}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Member Since</span>
                  </div>
                  <span className="font-medium">{memberSince}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Email</span>
                  </div>
                  <span className="font-medium text-xs">{user.email}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Account Status</span>
                  </div>
                  <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open('mailto:support@sleepvision.com', '_blank')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Subscription Management */}
        <div className="lg:col-span-2">
          <SubscriptionManager />
        </div>
      </div>

      {/* Additional Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Customize your SleepVision experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Sleep Reminders</span>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Weekly Reports</span>
                </div>
                <Badge variant="outline">Enabled</Badge>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Manage Preferences
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Control your data and privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Your data is encrypted and secure</p>
              <p>• We never share your personal information</p>
              <p>• You can export or delete your data anytime</p>
            </div>

            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
