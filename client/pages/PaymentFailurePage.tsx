import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Mail } from 'lucide-react';

const PaymentFailurePage: React.FC = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/subscription');
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    window.open('mailto:support@sleepvision.com?subject=Payment Issue&body=Hi, I encountered an issue with my payment. Please help me resolve this.', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Failed
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-red-600">
              We couldn't process your payment
            </h2>
            
            <p className="text-gray-700">
              Don't worry - this happens sometimes. Your payment was not charged, and you can try again with a different payment method or card.
            </p>

            <div className="bg-white rounded-lg p-6 border border-red-200">
              <h3 className="font-semibold text-gray-900 mb-3">Common reasons for payment failure:</h3>
              <div className="text-left space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Insufficient funds in your account</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Card expired or details entered incorrectly</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Bank declined the transaction for security reasons</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>International transactions restricted by your bank</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">💡 What to try next:</h4>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Try a different credit or debit card</li>
                <li>• Contact your bank to ensure international payments are enabled</li>
                <li>• Double-check your card details and billing address</li>
                <li>• Use PayPal if your card continues to decline</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetryPayment}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Payment Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              
              <Button
                variant="outline"
                onClick={handleContactSupport}
                className="w-full"
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Need immediate help?</strong> Contact our support team at support@sleepvision.com
              <br />
              We're here to help you get started with your sleep optimization journey!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentFailurePage;
