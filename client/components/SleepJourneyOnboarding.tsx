import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import {
  Moon,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  Heart,
  Timer,
  Target,
  BookOpen,
  Zap,
  Wind,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Play,
  Users,
  Lightbulb,
  Coffee,
  Smartphone,
  BedDouble,
  Sun,
  Volume2,
  Settings,
  X,
} from "lucide-react";

interface SleepJourneyOnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip?: () => void;
}

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  tips: string[];
  nextStepText: string;
  backgroundColor: string;
  iconColor: string;
}

const SleepJourneyOnboarding: React.FC<SleepJourneyOnboardingProps> = ({
  isVisible,
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible_internal, setIsVisible_internal] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsVisible_internal(true);
    }
  }, [isVisible]);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Sleep Journey!",
      subtitle: "Transform Your Nights, Transform Your Life",
      description:
        "You're about to discover powerful tools that will revolutionize your sleep quality and boost your daily energy levels.",
      icon: <Sparkles className="h-12 w-12" />,
      features: [
        "Science-backed breathing techniques",
        "Personalized sleep analytics",
        "AI-powered sleep coaching",
        "Progressive habit building",
      ],
      tips: [
        "Use our app consistently for best results",
        "Track your progress daily",
        "Be patient - real change takes time",
      ],
      nextStepText: "Start My Journey",
      backgroundColor: "from-purple-100 to-blue-100",
      iconColor: "text-purple-600",
    },
    {
      id: "breathing",
      title: "Master Powerful Breathing Techniques",
      subtitle: "The Foundation of Better Sleep",
      description:
        "Learn proven breathing methods like 4-7-8 and Wim Hof that can help you fall asleep faster and sleep deeper.",
      icon: <Wind className="h-12 w-12" />,
      features: [
        "4-7-8 Technique for instant relaxation",
        "Wim Hof Method for energy control",
        "Box Breathing for stress management",
        "Guided sessions with audio cues",
      ],
      tips: [
        "Practice breathing exercises before bed",
        "Start with 5-10 minutes daily",
        "Be consistent - even 2 minutes helps",
      ],
      nextStepText: "Learn Breathing",
      backgroundColor: "from-blue-100 to-teal-100",
      iconColor: "text-blue-600",
    },
    {
      id: "tracking",
      title: "Track Your Sleep Progress",
      subtitle: "Data-Driven Sleep Optimization",
      description:
        "Monitor your sleep quality, mood, and energy levels to identify patterns and optimize your routine.",
      icon: <TrendingUp className="h-12 w-12" />,
      features: [
        "Daily sleep quality ratings",
        "Mood and energy tracking",
        "Sleep trend analysis",
        "Personalized insights and recommendations",
      ],
      tips: [
        "Log your sleep quality every morning",
        "Note factors that affect your sleep",
        "Review weekly patterns for insights",
      ],
      nextStepText: "Start Tracking",
      backgroundColor: "from-green-100 to-emerald-100",
      iconColor: "text-green-600",
    },
    {
      id: "discipline",
      title: "Build Unbreakable Sleep Discipline",
      subtitle: "Create Lasting Habits That Stick",
      description:
        "Develop the discipline to maintain consistent sleep habits through our proven system of challenges and rewards.",
      icon: <Target className="h-12 w-12" />,
      features: [
        "Daily discipline challenges",
        "Streak tracking and rewards",
        "Community support system",
        "Achievement badges and levels",
      ],
      tips: [
        "Set realistic bedtime goals",
        "Create a calming evening routine",
        "Use our discipline tracker daily",
      ],
      nextStepText: "Build Discipline",
      backgroundColor: "from-orange-100 to-red-100",
      iconColor: "text-orange-600",
    },
    {
      id: "ai-coaching",
      title: "AI-Powered Sleep Coaching",
      subtitle: "Your Personal Sleep Assistant",
      description:
        "Get personalized recommendations and insights from Luna, our AI sleep coach who learns your patterns.",
      icon: <Brain className="h-12 w-12" />,
      features: [
        "Personalized sleep recommendations",
        "Daily check-ins with AI coach",
        "Adaptive coaching based on progress",
        "24/7 support and motivation",
      ],
      tips: [
        "Be honest in your daily check-ins",
        "Follow AI recommendations consistently",
        "Ask Luna questions about sleep",
      ],
      nextStepText: "Meet Luna",
      backgroundColor: "from-pink-100 to-purple-100",
      iconColor: "text-pink-600",
    },
    {
      id: "community",
      title: "Join Our Sleep Community",
      subtitle: "You're Not Alone in This Journey",
      description:
        "Connect with thousands of others on their sleep improvement journey. Share tips, celebrate wins, and stay motivated.",
      icon: <Users className="h-12 w-12" />,
      features: [
        "Community challenges and events",
        "Share progress and celebrate wins",
        "Learn from others' experiences",
        "Get support during tough times",
      ],
      tips: [
        "Share your progress with the community",
        "Participate in group challenges",
        "Support others on their journey",
      ],
      nextStepText: "Join Community",
      backgroundColor: "from-yellow-100 to-orange-100",
      iconColor: "text-yellow-600",
    },
    {
      id: "getting-started",
      title: "Ready to Transform Your Sleep?",
      subtitle: "Your Journey Starts Tonight",
      description:
        "You now have all the tools you need to dramatically improve your sleep. Let's start with your first breathing session!",
      icon: <Moon className="h-12 w-12" />,
      features: [
        "Start with tonight's bedtime routine",
        "Try your first 4-7-8 breathing session",
        "Set up your sleep tracking",
        "Complete your first discipline log",
      ],
      tips: [
        "Start small but be consistent",
        "Use the app every day for best results",
        "Be patient - transformation takes time",
      ],
      nextStepText: "Begin Tonight",
      backgroundColor: "from-indigo-100 to-purple-100",
      iconColor: "text-indigo-600",
    },
  ];

  const currentStepData = onboardingSteps[currentStep];
  const progressPercentage = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible_internal(false);
    onComplete();
  };

  const handleSkipOnboarding = () => {
    setIsVisible_internal(false);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  };

  if (!isVisible_internal) return null;

  return (
    <Dialog open={isVisible_internal} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0 border-0">
        <DialogTitle className="sr-only">
          Sleep Journey Onboarding - Step {currentStep + 1} of{" "}
          {onboardingSteps.length}: {currentStepData.title}
        </DialogTitle>
        <div
          className={`min-h-[600px] bg-gradient-to-br ${currentStepData.backgroundColor} relative`}
        >
          {/* Skip Button */}
          <Button
            onClick={handleSkipOnboarding}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
          >
            <X className="h-4 w-4 mr-1" />
            Skip
          </Button>

          {/* Progress Bar */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="bg-white/80">
                Step {currentStep + 1} of {onboardingSteps.length}
              </Badge>
              <div className="text-sm text-gray-600">
                {Math.round(progressPercentage)}% Complete
              </div>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-white/50" />
          </div>

          {/* Main Content */}
          <div className="p-8 pt-6">
            <div className="text-center mb-8">
              <div
                className={`p-4 bg-white/20 rounded-full inline-block mb-6 ${currentStepData.iconColor}`}
              >
                {currentStepData.icon}
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">
                {currentStepData.title}
              </h1>
              <p className="text-xl text-gray-700 mb-4">
                {currentStepData.subtitle}
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/70 border-white/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentStepData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 border-white/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Lightbulb className="h-5 w-5 text-blue-500" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentStepData.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Step-specific Content */}
            {currentStep === 0 && (
              <Card className="bg-white/70 border-white/50 mb-8">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    What You'll Achieve
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        7x
                      </div>
                      <div className="text-sm text-gray-700">Faster Sleep</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        94%
                      </div>
                      <div className="text-sm text-gray-700">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        30d
                      </div>
                      <div className="text-sm text-gray-700">To Transform</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card className="bg-white/70 border-white/50 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                    Tonight's Quick Start
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <BedDouble className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-blue-800">Get in Bed</p>
                      <p className="text-sm text-blue-600">
                        Comfortable position
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Wind className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-blue-800">Start 4-7-8</p>
                      <p className="text-sm text-blue-600">
                        4 breaths, 4 cycles
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Moon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-blue-800">Fall Asleep</p>
                      <p className="text-sm text-blue-600">
                        Usually by cycle 3
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === onboardingSteps.length - 1 && (
              <Card className="bg-white/70 border-white/50 mb-8">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Your First Night Action Plan
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="p-3 bg-indigo-100 rounded-full inline-block mb-2">
                        <Clock className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium">Set Bedtime</p>
                    </div>
                    <div className="text-center">
                      <div className="p-3 bg-indigo-100 rounded-full inline-block mb-2">
                        <Wind className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium">Practice 4-7-8</p>
                    </div>
                    <div className="text-center">
                      <div className="p-3 bg-indigo-100 rounded-full inline-block mb-2">
                        <Moon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium">Track Sleep</p>
                    </div>
                    <div className="text-center">
                      <div className="p-3 bg-indigo-100 rounded-full inline-block mb-2">
                        <Target className="h-6 w-6 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium">Log Discipline</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 0}
                className="bg-white/70 border-white/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentStep
                        ? "bg-gray-800"
                        : index < currentStep
                          ? "bg-gray-600"
                          : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-gray-800 hover:bg-gray-900 text-white"
              >
                {currentStep === onboardingSteps.length - 1 ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Your Journey
                  </>
                ) : (
                  <>
                    {currentStepData.nextStepText}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SleepJourneyOnboarding;
