import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BarChart3,
  Moon,
  Target,
  Users,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  Brain,
  Flame,
  Eye,
  MessageCircle,
  Wind,
  Shield,
  Clock,
  Award,
  Gift,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  lunaMessage: string;
  lunaPersonality: "excited" | "encouraging" | "informative" | "celebratory";
  targetElement?: string; // CSS selector for the element to highlight
  action?: "highlight" | "click" | "scroll" | "wait";
  duration?: number; // in milliseconds
  showArrow?: boolean;
  arrowDirection?: "top" | "bottom" | "left" | "right";
  showDemo?: boolean;
  demoType?: "breathing" | "stats" | "tracking";
}

interface InteractiveDashboardOnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  currentDashboardPage?: string;
}

export default function InteractiveDashboardOnboarding({
  isVisible,
  onComplete,
  onSkip,
  currentDashboardPage = "dashboard",
}: InteractiveDashboardOnboardingProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showLunaDialog, setShowLunaDialog] = useState(true);
  const [animationPhase, setAnimationPhase] = useState<"intro" | "content" | "action">("intro");
  const [demoProgress, setDemoProgress] = useState(0);

  // Define onboarding steps based on user's first-time experience
  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to Your Sleep Command Center!",
      description: "Hi there! I'm Luna, your AI sleep optimization assistant. I'm excited to show you around your personalized dashboard!",
      lunaMessage: `Welcome to SleepVision, ${user?.name?.split(" ")[0] || "friend"}! 🌟 I'm Luna, and I'll be your guide on this incredible sleep transformation journey. Think of this dashboard as your mission control center for optimizing every aspect of your sleep and energy!`,
      lunaPersonality: "excited",
      action: "wait",
      duration: 3000,
    },
    {
      id: "stats-overview",
      title: "Your Sleep Analytics Hub",
      description: "This is where you'll see your sleep performance metrics, streaks, and progress toward your goals.",
      lunaMessage: "These cards show your real-time sleep performance! 📊 Your streak counter, sleep scores, and goal progress - I'll help you interpret every metric and celebrate your wins together!",
      lunaPersonality: "informative",
      targetElement: ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4.gap-4",
      action: "highlight",
      showArrow: true,
      arrowDirection: "bottom",
      showDemo: true,
      demoType: "stats",
    },
    {
      id: "discipline-center",
      title: "Military-Grade Discipline Tracking",
      description: "Your discipline command center tracks your sleep habits with military precision and structure.",
      lunaMessage: "This is your discipline headquarters! 🛡️ Think of it as your sleep bootcamp - I'll help you build unbreakable sleep habits with military-level consistency and accountability!",
      lunaPersonality: "encouraging",
      targetElement: ".bg-blue-50.text-blue-900.border-blue-200",
      action: "highlight",
      showArrow: true,
      arrowDirection: "top",
    },
    {
      id: "ai-checkin",
      title: "Daily AI Check-ins with Luna",
      description: "Every day, we'll have a quick conversation about your sleep quality and energy levels.",
      lunaMessage: "This is where we chat every day! 💬 I'll ask about your sleep, energy, and mood. Based on your answers, I'll give you personalized tips and adjust your routine. Think of me as your personal sleep coach!",
      lunaPersonality: "encouraging",
      targetElement: "[data-testid='ai-checkin'], .bg-blue-50.border.border-blue-300:has(h3:contains('Daily Goals'))",
      action: "highlight",
      showArrow: true,
      arrowDirection: "left",
      showDemo: true,
      demoType: "tracking",
    },
    {
      id: "sleep-schedule",
      title: "Your AI-Generated Sleep Schedule",
      description: "I've created a personalized routine based on your assessment. Each activity is scientifically optimized for your sleep goals.",
      lunaMessage: "Here's your custom sleep routine! 🌙 Every activity is carefully chosen based on your lifestyle and sleep goals. Tap any item to get detailed guidance, videos, and tips on how to do it perfectly!",
      lunaPersonality: "informative",
      targetElement: ".bg-gradient-to-r.from-blue-300.to-blue-400",
      action: "highlight",
      showArrow: true,
      arrowDirection: "top",
    },
    {
      id: "quick-actions",
      title: "Quick Access to Key Features",
      description: "These shortcuts give you instant access to your most important sleep tools and routines.",
      lunaMessage: "These quick action cards are your shortcuts to everything important! 🚀 Adjust your routine, chat with me for insights, or connect with the community - everything is just one tap away!",
      lunaPersonality: "informative",
      targetElement: ".grid.grid-cols-1.md\\:grid-cols-3.gap-4:has(.hover\\:shadow-lg)",
      action: "highlight",
      showArrow: true,
      arrowDirection: "bottom",
    },
    {
      id: "navigation",
      title: "Explore All Your Sleep Tools",
      description: "Use the navigation menu to access breathing exercises, community features, progress tracking, and more.",
      lunaMessage: "The sidebar is your gateway to all features! 🧭 From breathing exercises to community support, lucid dreaming training to detailed analytics - everything you need is organized here for easy access!",
      lunaPersonality: "informative",
      targetElement: ".navigation-sidebar, nav, .flex.flex-col.gap-2",
      action: "highlight",
      showArrow: true,
      arrowDirection: "right",
    },
    {
      id: "breathing-demo",
      title: "Breathing Techniques Demo",
      description: "Let me show you how the 4-7-8 breathing technique works - breathing methods like this are scientifically proven to help you get better sleep before bed by activating your body's natural relaxation response.",
      lunaMessage: "Let's try a quick breathing exercise together! 🫁 This 4-7-8 technique is one of the most powerful methods for falling asleep quickly. Breathing exercises like this work by calming your nervous system and preparing your body for deep, restful sleep. Just follow the visual cues and breathe with me!",
      lunaPersonality: "encouraging",
      showDemo: true,
      demoType: "breathing",
      action: "wait",
      duration: 15000,
    },
    {
      id: "completion",
      title: "You're All Set to Transform Your Sleep!",
      description: "That's the complete tour! Remember, I'm always here to help guide you on your sleep optimization journey.",
      lunaMessage: "Congratulations! 🎉 You're now ready to transform your sleep with SleepVision! Remember, I'm here 24/7 to support you. Check in daily, follow your routines, and watch your sleep quality soar. Sweet dreams ahead!",
      lunaPersonality: "celebratory",
      action: "wait",
      duration: 2000,
    },
  ];

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  useEffect(() => {
    if (isVisible && currentStepData?.action === "wait" && currentStepData?.duration) {
      const timer = setTimeout(() => {
        if (currentStep < onboardingSteps.length - 1) {
          nextStep();
        }
      }, currentStepData.duration);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isVisible, currentStepData]);

  // Demo animations
  useEffect(() => {
    if (currentStepData?.showDemo && isPlaying) {
      let interval: NodeJS.Timeout;

      if (currentStepData.demoType === "breathing") {
        // Breathing demo animation
        interval = setInterval(() => {
          setDemoProgress((prev) => {
            if (prev >= 100) return 0;
            return prev + 2;
          });
        }, 100);
      } else if (currentStepData.demoType === "stats") {
        // Stats animation
        interval = setInterval(() => {
          setDemoProgress((prev) => {
            if (prev >= 100) return 0;
            return prev + 1;
          });
        }, 50);
      }

      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [currentStepData?.showDemo, currentStepData?.demoType, isPlaying]);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompletedSteps([...completedSteps, currentStepData.id]);
      setCurrentStep(currentStep + 1);
      setAnimationPhase("intro");
      setDemoProgress(0);
      setIsPlaying(false);
    } else {
      // Final step - complete onboarding
      handleComplete();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setAnimationPhase("intro");
      setDemoProgress(0);
      setIsPlaying(false);
    }
  };

  const handleComplete = () => {
    // Mark onboarding as completed
    localStorage.setItem("hasSeenDashboardOnboarding", "true");
    localStorage.setItem("onboardingCompletedAt", new Date().toISOString());
    
    // Track completion for analytics
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: 'Dashboard Onboarding',
        content_category: 'User Activation'
      });
    }

    onComplete();
  };

  const getLunaAvatar = () => {
    const personalities = {
      excited: "😊",
      encouraging: "💪",
      informative: "🤓",
      celebratory: "🎉",
    };
    return personalities[currentStepData?.lunaPersonality || "excited"];
  };

  const renderBreathingDemo = () => {
    if (currentStepData?.demoType !== "breathing") return null;

    const breathPhase = Math.floor(demoProgress / 25); // 0-3 phases
    const phaseNames = ["Inhale", "Hold", "Exhale", "Rest"];
    const phaseDurations = [4, 7, 8, 1]; // seconds
    const currentPhase = phaseNames[breathPhase];
    const currentDuration = phaseDurations[breathPhase];

    return (
      <div className="text-center py-8">
        <div className="relative mx-auto mb-6">
          <div
            className={`w-32 h-32 rounded-full border-4 transition-all duration-1000 ${
              breathPhase === 0
                ? "border-blue-500 bg-blue-100 scale-110"
                : breathPhase === 1
                ? "border-purple-500 bg-purple-100 scale-110"
                : breathPhase === 2
                ? "border-green-500 bg-green-100 scale-90"
                : "border-gray-400 bg-gray-100 scale-100"
            }`}
          >
            <div className="flex items-center justify-center h-full">
              <span className="text-3xl">{breathPhase === 0 ? "🫁" : breathPhase === 1 ? "⏸️" : breathPhase === 2 ? "🌬️" : "😌"}</span>
            </div>
          </div>
        </div>
        
        <div className="text-2xl font-bold text-blue-700 mb-2">{currentPhase}</div>
        <div className="text-gray-600">
          {breathPhase === 0 && "Breathe in through your nose for 4 seconds"}
          {breathPhase === 1 && "Hold your breath for 7 seconds"}
          {breathPhase === 2 && "Exhale through your mouth for 8 seconds"}
          {breathPhase === 3 && "Brief pause before next cycle"}
        </div>
        
        <div className="mt-4">
          <Progress value={(demoProgress % 25) * 4} className="w-64 mx-auto" />
        </div>
        
        <div className="mt-4 flex justify-center gap-2">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            size="sm"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={() => {
              setDemoProgress(0);
              setIsPlaying(false);
            }}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    );
  };

  const renderStatsDemo = () => {
    if (currentStepData?.demoType !== "stats") return null;

    const animatedStats = {
      streak: Math.floor((demoProgress / 100) * 15),
      score: Math.floor((demoProgress / 100) * 95),
      progress: Math.floor((demoProgress / 100) * 87),
    };

    return (
      <div className="grid grid-cols-3 gap-4 my-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg border">
          <div className="text-2xl font-bold text-blue-700">{animatedStats.streak}</div>
          <div className="text-sm text-blue-600">Day Streak</div>
          <Flame className="h-6 w-6 text-orange-500 mx-auto mt-2" />
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border">
          <div className="text-2xl font-bold text-green-700">{animatedStats.score}</div>
          <div className="text-sm text-green-600">Sleep Score</div>
          <Star className="h-6 w-6 text-yellow-500 mx-auto mt-2" />
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg border">
          <div className="text-2xl font-bold text-purple-700">{animatedStats.progress}%</div>
          <div className="text-sm text-purple-600">Goal Progress</div>
          <Target className="h-6 w-6 text-purple-500 mx-auto mt-2" />
        </div>
      </div>
    );
  };

  const renderTrackingDemo = () => {
    if (currentStepData?.demoType !== "tracking") return null;

    return (
      <div className="my-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🌙</span>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Luna's Daily Check-in</h4>
            <p className="text-sm text-gray-600">How did you sleep last night?</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            😴 Amazing! I feel completely refreshed
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            😊 Pretty good, some minor issues
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            😐 Okay, could be better
          </Button>
        </div>
        
        <div className="mt-3 p-2 bg-white rounded border text-xs text-gray-600">
          💡 Tip: Honest check-ins help me give you better personalized advice!
        </div>
      </div>
    );
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">{getLunaAvatar()}</span>
            </div>
            <div>
              <span className="text-xl font-bold">Luna's Interactive Tour</span>
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {onboardingSteps.length}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Main Content */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6" />
                {currentStepData?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Luna's Message */}
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">{getLunaAvatar()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-purple-700 mb-1">Luna says:</div>
                    <p className="text-gray-800 leading-relaxed">{currentStepData?.lunaMessage}</p>
                  </div>
                </div>
              </div>

              {/* Feature Description */}
              <div className="text-gray-700 leading-relaxed">
                {currentStepData?.description}
              </div>

              {/* Interactive Demos */}
              {currentStepData?.showDemo && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  {renderBreathingDemo()}
                  {renderStatsDemo()}
                  {renderTrackingDemo()}
                </div>
              )}

              {/* Target Element Indicator */}
              {currentStepData?.targetElement && (
                <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                  <Eye className="h-4 w-4" />
                  <span>Look for the highlighted area on your dashboard!</span>
                  {currentStepData?.showArrow && (
                    <ArrowDown className="h-4 w-4 animate-bounce ml-2" />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep
                    ? "bg-blue-500 scale-125"
                    : index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={previousStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={onSkip}
                variant="ghost"
                size="sm"
                className="text-gray-600"
              >
                Skip Tour
              </Button>
            </div>

            <div className="flex gap-2">
              {currentStep === onboardingSteps.length - 1 ? (
                <Button
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Tour
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Quick Feature Access */}
          {currentStep > 2 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Quick Access:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analytics
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                  <Wind className="h-3 w-3 mr-1" />
                  Breathing
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                  <Users className="h-3 w-3 mr-1" />
                  Community
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
                  <Moon className="h-3 w-3 mr-1" />
                  Sleep Log
                </Badge>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
