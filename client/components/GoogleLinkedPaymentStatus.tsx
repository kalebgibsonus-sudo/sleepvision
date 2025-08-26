import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  paymentService,
  UserSubscriptionStatus,
  PaymentRecord,
} from "@/lib/paymentService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreditCard,
  Calendar,
  DollarSign,
  User,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

interface GoogleLinkedPaymentStatusProps {
  showHistory?: boolean;
  compact?: boolean;
}

export const GoogleLinkedPaymentStatus: React.FC<
  GoogleLinkedPaymentStatusProps
> = ({ showHistory = false, compact = false }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] =
    useState<UserSubscriptionStatus | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPaymentData();
    }
  }, [user]);

  const loadPaymentData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load subscription status
      const subscriptionData = await paymentService.getUserSubscription(
        user.id,
      );
      setSubscription(subscriptionData);

      // Load payment history if requested
      if (showHistory) {
        const history = await paymentService.getUserPaymentHistory(user.id, 10);
        setPaymentHistory(history);
      }
    } catch (err) {
      console.error("Error loading payment data:", err);
      setError("Failed to load payment information");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!subscription) return null;

    if (!subscription.isActive) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          Inactive
        </Badge>
      );
    }

    switch (subscription.currentTier) {
      case "elite-performance":
        return (
          <Badge className="bg-purple-600 text-white">Elite Performance</Badge>
        );
      case "full-transformation":
        return (
          <Badge className="bg-blue-600 text-white">Full Transformation</Badge>
        );
      case "sleep-focused":
        return <Badge className="bg-green-600 text-white">Sleep Focused</Badge>;
      default:
        return <Badge variant="outline">Free Plan</Badge>;
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "succeeded":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm text-gray-600">
              Loading payment information...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-red-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
            <Button size="sm" variant="outline" onClick={loadPaymentData}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <User className="w-5 h-5 text-blue-600" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-blue-800">
              Google Account Linked
            </span>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-blue-600">{user.email}</p>
        </div>
        <Shield className="w-4 h-4 text-blue-600" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">
              Google Account & Payment Memory
            </CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Your payment history and subscription are securely linked to your
          Google account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Google Account Info */}
        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                {user.email}
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Account verified and payment memory linked
            </p>
          </div>
        </div>

        {/* Subscription Details */}
        {subscription && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-medium">
                  ${(subscription.totalPaid / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Payments:</span>
                <span className="font-medium">{subscription.paymentCount}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium">
                  {subscription.subscriptionStartDate &&
                  subscription.subscriptionStartDate.toDate
                    ? format(
                        subscription.subscriptionStartDate.toDate(),
                        "MMM dd, yyyy",
                      )
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Billing:</span>
                <span className="font-medium capitalize">
                  {subscription.billingPeriod}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Features enabled by subscription */}
        {subscription?.features && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-3">
              Active Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(subscription.features).map(
                ([feature, enabled]) => (
                  <div key={feature} className="flex items-center space-x-2">
                    {enabled ? (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    ) : (
                      <XCircle className="w-3 h-3 text-gray-400" />
                    )}
                    <span
                      className={`text-xs ${enabled ? "text-green-800" : "text-gray-500"}`}
                    >
                      {feature
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        {/* Payment History */}
        {showHistory && paymentHistory.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-800">
              Recent Payments
            </h4>
            <div className="space-y-2">
              {paymentHistory.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getPaymentStatusIcon(payment.status)}
                    <div>
                      <div className="text-sm font-medium">
                        ${(payment.amount / 100).toFixed(2)} -{" "}
                        {payment.subscriptionTier}
                      </div>
                      <div className="text-xs text-gray-600">
                        {payment.createdAt && payment.createdAt.toDate
                          ? format(payment.createdAt.toDate(), "MMM dd, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      payment.status === "succeeded" ? "default" : "outline"
                    }
                    className={
                      payment.status === "succeeded"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security notice */}
        <div className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            <strong>Secure & Private:</strong> Your payment information is
            encrypted and linked to your Google account. This ensures your
            subscription and data persist across devices and sessions.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoogleLinkedPaymentStatus;
