import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import StripeCheckout from "@/components/StripeCheckout";

interface SubscriptionPageProps {
  routineType?: 'sleep' | 'morning';
  onBack?: () => void;
  onSuccess?: () => void;
  showBackButton?: boolean;
}

export default function SubscriptionPage({
  routineType = 'sleep',
  onBack,
  onSuccess,
  showBackButton = true
}: SubscriptionPageProps) {
  const { user } = useAuth();


  const routineIcon = routineType === 'sleep' ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />;
  const routineColor = routineType === 'sleep' ? 'text-purple-400' : 'text-orange-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header with optional back button */}
      {showBackButton && onBack && (
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6 max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-3">
              <div className={`p-3 bg-white/10 rounded-full ${routineType === 'sleep' ? 'text-purple-400' : 'text-orange-400'}`}>
                {routineType === 'sleep' ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sleep</span> Plan
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Unlock your personalized {routineType} optimization with our AI-powered platform. Choose the plan that fits your goals and transform your life with science-backed sleep optimization.
            </p>
          </div>

          {/* Stripe Checkout Component */}
          <StripeCheckout />

        </div>
      </div>
    </div>
  );
}
