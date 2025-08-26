import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Sparkles,
  Clock,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  X,
  Star,
  Trophy,
  Moon,
  Sun,
} from "lucide-react";

interface PremiumUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineType: "sleep" | "morning";
  onCreatorBypass?: () => void;
}

export function PremiumUnlockModal({
  isOpen,
  onClose,
  routineType,
  onCreatorBypass,
}: PremiumUnlockModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: "sleep-focused",
      name: "Sleep Focused",
      price: "$5.99",
      period: "/month",
      description: "Perfect for sleep optimization",
      stripeUrl: "https://buy.stripe.com/28E9AU7OS1424Clb9e38404",
      features: [
        "Personalized sleep routine only",
        "AI sleep coach Luna for bedtime",
        "Sleep tracking & insights",
        "Bedtime reminders & alerts",
        "Sleep progress analytics",
      ],
      badge: "Most Popular",
      badgeColor: "bg-blue-500",
      bgGradient: "from-blue-500 to-cyan-500",
      icon: <Moon className="w-6 h-6" />,
    },
    {
      id: "full-transformation",
      name: "Full Transformation",
      price: "$9.99",
      period: "/month",
      description: "Complete sleep & morning optimization",
      stripeUrl: "https://buy.stripe.com/00w9AU1qu5kid8R0uA38403",
      features: [
        "Everything in Sleep Focused",
        "AI morning routine builder",
        "Wake-up optimization & energy tracking",
        "Combined sleep + morning habit tracking",
        "Breathing techniques for both routines",
        "Community access",
        "Standard customer support",
      ],
      badge: "Best Value",
      badgeColor: "bg-purple-500",
      bgGradient: "from-purple-500 to-pink-500",
      icon: <Crown className="w-6 h-6" />,
    },
    {
      id: "elite-performance",
      name: "Elite Performance",
      price: "$13.99",
      period: "/month",
      description: "Sleep + Morning + Product Discounts",
      stripeUrl: "https://buy.stripe.com/3cIaEY5GK2866Ktdhm38402",
      features: [
        "Everything in Full Transformation",
        "Exclusive discounts on SleepVision products",
        "Priority customer support",
        "Advanced sleep analytics",
        "Custom challenges & goals",
        "Expert consultations",
        "Early access to new features",
      ],
      badge: "Premium",
      badgeColor: "bg-yellow-500",
      bgGradient: "from-yellow-400 to-orange-500",
      icon: <Trophy className="w-6 h-6" />,
    },
  ];

  const handlePlanSelect = (plan: (typeof plans)[0]) => {
    setSelectedPlan(plan.id);
    // Add a small delay to show selection, then redirect
    setTimeout(() => {
      window.open(plan.stripeUrl, "_blank");
    }, 300);
  };

  const routineIcon =
    routineType === "sleep" ? (
      <Moon className="w-8 h-8" />
    ) : (
      <Sun className="w-8 h-8" />
    );
  const routineColor =
    routineType === "sleep" ? "text-purple-400" : "text-orange-400";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Premium Unlock - {routineType === "sleep" ? "Sleep" : "Morning"}{" "}
            Routine Payment Options
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="text-center space-y-6 p-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-3">
              <div className={`p-3 bg-white/10 rounded-full ${routineColor}`}>
                {routineIcon}
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              How Much Is Your{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Sleep
              </span>{" "}
              Worth?
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              🎉 Your assessment is complete and your personalized {routineType}{" "}
              schedule has been generated! Choose a plan below to unlock your
              custom routine and transform your life with science-backed sleep
              optimization.
            </p>

            {/* Value Proposition */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-white font-semibold">AI-Powered</div>
                <div className="text-white/70 text-sm">
                  Personalized for you
                </div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Save Hours</div>
                <div className="text-white/70 text-sm">Fall asleep faster</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-semibold">More Energy</div>
                <div className="text-white/70 text-sm">Wake up refreshed</div>
              </div>
              <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-semibold">Health Benefits</div>
                <div className="text-white/70 text-sm">Long-term wellness</div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative bg-white/5 backdrop-blur-lg border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                  selectedPlan === plan.id ? "ring-2 ring-purple-400" : ""
                } ${plan.id === "full-transformation" ? "lg:scale-110 border-purple-400/50" : ""}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.badge && (
                  <Badge
                    className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${plan.badgeColor} text-white px-4 py-1 text-sm font-semibold`}
                  >
                    {plan.badge}
                  </Badge>
                )}

                <CardContent className="p-6 text-center">
                  <div
                    className={`p-3 bg-gradient-to-r ${plan.bgGradient} rounded-full inline-block mb-4 text-white`}
                  >
                    {plan.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-white/70 mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {plan.price}
                    </span>
                    <span className="text-white/70">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-white/80 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full bg-gradient-to-r ${plan.bgGradient} hover:opacity-90 text-white font-bold py-3 text-lg transition-all duration-300 ${
                      selectedPlan === plan.id ? "animate-pulse" : ""
                    }`}
                    size="lg"
                  >
                    {selectedPlan === plan.id
                      ? "Processing..."
                      : "Start Your Transformation"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-400/30">
            <h3 className="text-2xl font-bold text-white mb-3">
              💰 What's the cost of poor sleep?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-red-400">$2,280</div>
                <div className="text-white/70 text-sm">
                  Lost productivity per year
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">25%</div>
                <div className="text-white/70 text-sm">Higher illness risk</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">3-5 years</div>
                <div className="text-white/70 text-sm">Reduced lifespan</div>
              </div>
            </div>
            <p className="text-white mt-4 font-semibold">
              🎯 Invest in your sleep. Invest in your life.
            </p>
          </div>

          {/* Creator Bypass Button */}
          {onCreatorBypass && (
            <div className="mt-8 text-center">
              <Button
                onClick={onCreatorBypass}
                variant="outline"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-none font-bold px-8 py-3"
              >
                <Crown className="w-5 h-5 mr-2" />
                Creator Bypass - Skip Payment
              </Button>
              <p className="text-white/60 text-xs mt-2">
                For creators and development testing
              </p>
            </div>
          )}

          {/* Security and Guarantee */}
          <div className="flex items-center justify-center gap-8 mt-8 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Secure payment by Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
