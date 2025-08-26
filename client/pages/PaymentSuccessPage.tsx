import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Refresh user data to get updated subscription status
    const refreshData = async () => {
      try {
        await refreshUserData();
      } catch (error) {
        console.error('Error refreshing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    refreshData();
  }, [refreshUserData]);

  useEffect(() => {
    // Auto-redirect countdown
    if (!isLoading) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate('/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLoading, navigate]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
            <p className="text-gray-600">Processing your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-green-600">
              🎉 Your AI Sleep Schedule is Ready!
            </h2>
            
            <p className="text-lg text-gray-700">
              Welcome to SleepVision! Your subscription has been activated and you now have access to:
            </p>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <div className="grid md:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">✨ Immediate Access:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• AI-powered sleep optimization</li>
                    <li>• Personalized sleep schedule</li>
                    <li>• Sleep tracking & analytics</li>
                    <li>• Breathing exercises</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">📱 Your Dashboard:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Track your sleep progress</li>
                    <li>• Get daily recommendations</li>
                    <li>• Access exclusive content</li>
                    <li>• Manage your subscription</li>
                  </ul>
                </div>
              </div>
            </div>

            {user && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Subscription:</strong> {user.subscriptionTier?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  You can manage your subscription anytime from your dashboard
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-sm text-gray-500">
              Redirecting automatically in {countdown} seconds...
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              Questions or need help? Contact our support team at support@sleepvision.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
