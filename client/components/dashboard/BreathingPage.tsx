import { useState } from "react";
import { BreathingMethods } from "../BreathingMethods";
import { WimHofBreathing } from "../WimHofBreathing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wind,
  Zap,
  Moon,
  Heart,
  Target,
  ArrowLeft,
  Home,
  Play,
  Clock,
  Star,
  Sparkles,
  PlayCircle,
  BookOpen,
  Brain,
  Lightbulb,
  Timer,
  CheckCircle,
} from "lucide-react";

interface BreathingPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

type BreathingView = "overview" | "all-methods" | "wim-hof";

export function BreathingPage({ onNavigate, onGoHome }: BreathingPageProps) {
  const [currentView, setCurrentView] = useState<BreathingView>("overview");
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null);
  const [isGuidanceModalOpen, setIsGuidanceModalOpen] = useState(false);

  const featuredTechniques = [
    {
      id: "wim-hof",
      name: "Wim Hof Method",
      description:
        "The ultimate breathing technique for energy, immunity, and mental strength. Master this legendary method!",
      icon: <Zap className="h-6 w-6" />,
      effectiveness: 98,
      difficulty: "Advanced",
      duration: "15 min",
      bestFor: "Energy & Power",
    },
    {
      id: "4-7-8",
      name: "4-7-8 Sleep Breathing",
      description: "The most effective technique for falling asleep quickly",
      icon: <Moon className="h-6 w-6" />,
      effectiveness: 95,
      difficulty: "Beginner",
      duration: "5 min",
      bestFor: "Sleep",
    },
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "Navy SEAL technique for focus and stress management",
      icon: <Target className="h-6 w-6" />,
      effectiveness: 85,
      difficulty: "Beginner",
      duration: "10 min",
      bestFor: "Focus",
    },
  ];

  const getTechniqueGuidance = (techniqueId: string) => {
    const guidanceData = {
      "4-7-8": {
        videos: [
          {
            id: "YRPh_GaiL8s",
            title: "4-7-8 Breathing Technique - Complete Guide",
          },
          {
            id: "gz4G31LGyog",
            title: "Scientific Benefits of 4-7-8 Breathing",
          },
          { id: "n6pMbRiSBPs", title: "4-7-8 Breathing for Instant Sleep" },
        ],
        stepByStep: [
          "Sit or lie comfortably with your back straight",
          "Place tongue against the roof of your mouth behind front teeth",
          "Exhale completely through your mouth making a whoosh sound",
          "Close mouth and inhale through nose for 4 counts",
          "Hold your breath for 7 counts",
          "Exhale through mouth for 8 counts with whoosh sound",
          "Repeat cycle 3-4 times, twice daily",
        ],
        benefits: [
          "Activates parasympathetic nervous system",
          "Reduces anxiety and stress hormones",
          "Lowers heart rate and blood pressure",
          "Increases oxygen efficiency",
          "Improves sleep quality naturally",
          "Enhances focus and mental clarity",
        ],
        tips: [
          "Practice on empty stomach for best results",
          "Never hold breath if feeling lightheaded",
          "Start with 4 cycles, increase gradually",
          "Use this technique when feeling stressed",
          "Perfect for pre-sleep routine",
          "Consistent practice yields better results",
        ],
        science:
          "The 4-7-8 technique was developed by Dr. Andrew Weil based on ancient pranayama practices. It works by increasing oxygen efficiency, slowing heart rate, and activating the body's relaxation response through controlled breathing ratios.",
        warnings: [
          "Stop if you feel dizzy or uncomfortable",
          "Not recommended during pregnancy without doctor approval",
          "Avoid if you have severe respiratory conditions",
          "Start slowly - don't rush the counts",
        ],
      },
      box: {
        videos: [
          { id: "tEmt1Znux58", title: "Box Breathing - Navy SEAL Technique" },
          { id: "FJJazKtH_9I", title: "4-4-4-4 Breathing for Stress Relief" },
          { id: "SA5VmTOUa6Y", title: "Box Breathing for Peak Performance" },
        ],
        stepByStep: [
          "Sit upright in a comfortable position",
          "Exhale completely through your mouth",
          "Inhale through nose for 4 counts",
          "Hold breath for 4 counts",
          "Exhale through mouth for 4 counts",
          "Hold empty lungs for 4 counts",
          "Repeat for 5-10 cycles",
        ],
        benefits: [
          "Improves focus and concentration",
          "Reduces stress and anxiety",
          "Enhances emotional regulation",
          "Increases mental resilience",
          "Boosts cognitive performance",
          "Strengthens nervous system control",
        ],
        tips: [
          "Used by Navy SEALs for stress management",
          "Perfect before important meetings or events",
          "Can be done anywhere, anytime",
          "Increase count gradually (4-5-6 seconds)",
          "Focus on smooth, even breathing",
          "Practice daily for maximum benefits",
        ],
        science:
          "Box breathing activates the vagus nerve and balances the autonomic nervous system. Research shows it can reduce cortisol levels by up to 25% and improve heart rate variability.",
        warnings: [
          "Don't force the breath - keep it comfortable",
          "Stop if you feel lightheaded",
          "Adjust counts if 4 seconds feels too long",
          "Not recommended during asthma attacks",
        ],
      },
      "wim-hof": {
        videos: [
          { id: "tybOi4hjZFQ", title: "Wim Hof Method - Complete Tutorial" },
          { id: "OpTG02x6w5o", title: "Science Behind Wim Hof Breathing" },
          { id: "A9zS94x2nd8", title: "Wim Hof Breathing - 11 Minute Session" },
        ],
        stepByStep: [
          "Sit or lie down comfortably",
          "Take 30 deep, powerful breaths: breathe all the way in for 4 seconds, then completely let go for 4 seconds",
          "Focus on the rhythm: 4 seconds in through nose, 4 seconds out through mouth",
          "On final exhale, hold breath with empty lungs",
          "Hold until you feel strong urge to breathe",
          "Take one deep breath and hold for 15 seconds",
          "Repeat for 3 rounds total",
          "Practice 1-2 hours before bedtime for optimal sleep benefits",
          "Always practice safely and never underwater",
        ],
        benefits: [
          "Prepares body for deeper, more restorative sleep when practiced before bed",
          "Activates parasympathetic nervous system for natural relaxation",
          "Increases energy and alertness during the day",
          "Strengthens immune system",
          "Improves stress tolerance",
          "Enhances athletic performance",
          "Increases cold tolerance",
          "Boosts mental resilience and willpower",
        ],
        tips: [
          "Focus on the 4-second rhythm: breathe all the way in for 4 seconds, then completely let go for 4 seconds",
          "Practice 1-2 hours before bedtime to maximize sleep benefits",
          "Always practice sitting or lying down",
          "Never practice while driving or in water",
          "Start with shorter sessions",
          "Expect tingling sensations - this is normal",
          "Practice on empty stomach",
          "Stay hydrated before and after",
        ],
        science:
          "The Wim Hof Method temporarily alkalizes blood pH and activates the sympathetic nervous system. Studies show it can influence immune response and increase adrenaline production voluntarily.",
        warnings: [
          "NEVER practice in water or while driving",
          "Can cause temporary dizziness",
          "Not for pregnant women",
          "Stop if you feel unwell",
          "Consult doctor if you have heart conditions",
          "Supervision recommended for beginners",
        ],
      },
    };

    return (
      guidanceData[techniqueId as keyof typeof guidanceData] || {
        videos: [{ id: "aXflBZXAucQ", title: "Breathing Techniques Overview" }],
        stepByStep: ["Select a technique above for detailed guidance"],
        benefits: ["Improved relaxation", "Better sleep", "Reduced stress"],
        tips: ["Practice regularly", "Start slowly", "Listen to your body"],
        science:
          "Controlled breathing techniques help regulate the nervous system.",
        warnings: [
          "Stop if you feel uncomfortable",
          "Consult a doctor if you have health concerns",
        ],
      }
    );
  };

  const handleTechniqueGuidance = (technique: any) => {
    setSelectedTechnique(technique);
    setIsGuidanceModalOpen(true);
  };

  const quickStats = [
    {
      label: "Users Helped to Sleep",
      value: "10K+",
      icon: <Moon className="h-5 w-5" />,
    },
    {
      label: "Average Sleep Time",
      value: "8 min",
      icon: <Clock className="h-5 w-5" />,
    },
    { label: "Success Rate", value: "94%", icon: <Star className="h-5 w-5" /> },
    {
      label: "Daily Users",
      value: "2.5K",
      icon: <Heart className="h-5 w-5" />,
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-blue-700 mb-2 flex items-center gap-3">
            <Wind className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
            Master Breathing Techniques
          </h1>
          <p className="text-blue-600 text-lg">
            Transform your sleep and well-being with legendary breathing methods - practice these techniques before bed to activate your body's natural relaxation response
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("dashboard")}
            variant="outline"
            className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex items-center gap-2 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
        </div>
      </div>

      {/* WIM HOF METHOD HERO SECTION */}
      <Card className="bg-gradient-to-r from-orange-100 via-yellow-50 to-red-100 border-2 border-orange-300 shadow-xl">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-orange-800 mb-2">
                  WIM HOF METHOD
                </h2>
                <p className="text-xl text-orange-700">
                  The Legendary Iceman's Power Breathing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  98%
                </div>
                <div className="text-sm text-orange-700">
                  Effectiveness Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  15min
                </div>
                <div className="text-sm text-orange-700">Power Session</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  10K+
                </div>
                <div className="text-sm text-orange-700">Lives Transformed</div>
              </div>
            </div>

            <p className="text-lg text-orange-800 mb-6 max-w-2xl mx-auto">
              Master the same breathing technique that allows Wim Hof to
              withstand freezing temperatures, boost immunity, and achieve
              superhuman feats. Practice this method 1-2 hours before bed to activate your body's natural relaxation response and experience deeper, more restorative sleep along with explosive energy and unbreakable mental strength.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setCurrentView("wim-hof")}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 text-xl font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <Zap className="w-6 h-6 mr-3" />
                START WIM HOF SESSION
              </Button>
              <Button
                onClick={() => {
                  const wimHofTechnique = featuredTechniques.find(
                    (t) => t.id === "wim-hof",
                  );
                  if (wimHofTechnique) handleTechniqueGuidance(wimHofTechnique);
                }}
                variant="outline"
                className="border-2 border-orange-500 text-orange-700 hover:bg-orange-50 px-6 py-4 text-lg font-semibold"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Complete Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-blue-50 border border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="p-2 bg-blue-200 rounded-full text-blue-600">
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {stat.value}
              </div>
              <div className="text-sm text-blue-600">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Why Breathing Works */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Sparkles className="h-6 w-6" />
            The Science Behind Breathing for Sleep
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-block mb-3">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Activates Parasympathetic System
              </h4>
              <p className="text-sm text-blue-700">
                Controlled breathing signals your body to enter "rest and
                digest" mode, preparing you for sleep.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-block mb-3">
                <Moon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Reduces Cortisol Levels
              </h4>
              <p className="text-sm text-blue-700">
                Deep breathing lowers stress hormones like cortisol, which
                naturally rise in the evening and can prevent sleep.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 p-4 rounded-full inline-block mb-3">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">
                Quiets Racing Thoughts
              </h4>
              <p className="text-sm text-blue-700">
                Focused breathing gives your mind a single point of
                concentration, interrupting anxious thought patterns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Techniques */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-800">
            Featured Techniques
          </h2>
          <Button
            onClick={() => setCurrentView("all-methods")}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            View All Methods
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {featuredTechniques.map((technique, index) => (
            <Card
              key={technique.id}
              className={`hover:shadow-lg transition-all cursor-pointer group ${
                technique.id === "wim-hof"
                  ? "bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 shadow-lg scale-105"
                  : "bg-white border border-blue-200"
              }`}
              onClick={() => {
                if (technique.id === "wim-hof") {
                  setCurrentView("wim-hof");
                } else {
                  setCurrentView("all-methods");
                }
              }}
            >
              <CardHeader>
                <div
                  className={`p-3 rounded-full inline-block mb-3 group-hover:scale-110 transition-transform ${
                    technique.id === "wim-hof"
                      ? "bg-gradient-to-r from-orange-500 to-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  <div className="text-white">{technique.icon}</div>
                </div>
                <CardTitle
                  className={`text-lg ${
                    technique.id === "wim-hof"
                      ? "text-orange-800"
                      : "text-blue-800"
                  }`}
                >
                  {technique.name}
                  {technique.id === "wim-hof" && (
                    <Badge className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      LEGENDARY
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-sm mb-4 ${
                    technique.id === "wim-hof"
                      ? "text-orange-700 font-medium"
                      : "text-blue-600"
                  }`}
                >
                  {technique.description}
                </p>

                {/* Guidance Button */}
                <div className="mb-4">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTechniqueGuidance(technique);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mb-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Complete Guidance
                  </Button>
                </div>

                {/* Effectiveness Bar */}
                <div className="mb-4">
                  <div
                    className={`flex justify-between text-xs mb-1 ${
                      technique.id === "wim-hof"
                        ? "text-orange-700"
                        : "text-blue-600"
                    }`}
                  >
                    <span>Effectiveness</span>
                    <span>{technique.effectiveness}%</span>
                  </div>
                  <div
                    className={`w-full rounded-full h-2 ${
                      technique.id === "wim-hof"
                        ? "bg-orange-200"
                        : "bg-blue-200"
                    }`}
                  >
                    <div
                      className={`h-2 rounded-full ${
                        technique.id === "wim-hof"
                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${technique.effectiveness}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={
                      technique.id === "wim-hof"
                        ? "border-orange-300 text-orange-700"
                        : "border-blue-300 text-blue-700"
                    }
                  >
                    {technique.difficulty}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      technique.id === "wim-hof"
                        ? "border-orange-300 text-orange-700"
                        : "border-blue-300 text-blue-700"
                    }
                  >
                    {technique.duration}
                  </Badge>
                  <Badge
                    className={
                      technique.id === "wim-hof"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {technique.bestFor}
                  </Badge>
                </div>

                <Button
                  className={`w-full text-white ${
                    technique.id === "wim-hof"
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  variant="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {technique.id === "wim-hof"
                    ? "Master This Power"
                    : "Try This Method"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">
            Quick Start: Tonight's Sleep Breathing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-blue-200 p-3 rounded-full inline-block mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p className="text-sm font-medium text-blue-800">
                Get Comfortable
              </p>
              <p className="text-xs text-blue-600">
                Lie in bed, close your eyes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 p-3 rounded-full inline-block mb-2">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <p className="text-sm font-medium text-blue-800">Start 4-7-8</p>
              <p className="text-xs text-blue-600">
                Inhale 4, hold 7, exhale 8
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 p-3 rounded-full inline-block mb-2">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <p className="text-sm font-medium text-blue-800">
                Repeat 4 Cycles
              </p>
              <p className="text-xs text-blue-600">
                Most people fall asleep by cycle 3
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-200 p-3 rounded-full inline-block mb-2">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <p className="text-sm font-medium text-blue-800">Drift Off</p>
              <p className="text-xs text-blue-600">Let sleep come naturally</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button
              onClick={() => setCurrentView("all-methods")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Guided 4-7-8 Breathing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render appropriate view
  const renderContent = () => {
    switch (currentView) {
      case "all-methods":
        return <BreathingMethods onBack={() => setCurrentView("overview")} />;
      case "wim-hof":
        return <WimHofBreathing onBack={() => setCurrentView("overview")} />;
      default:
        return renderOverview();
    }
  };

  return (
    <>
      {renderContent()}

      {/* Comprehensive Guidance Modal */}
      <Dialog open={isGuidanceModalOpen} onOpenChange={setIsGuidanceModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedTechnique && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl text-blue-700">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <div className="text-white">{selectedTechnique.icon}</div>
                  </div>
                  {selectedTechnique.name} - Complete Master Guide
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedTechnique.difficulty}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-8">
                {/* Quick Overview */}
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-xl text-blue-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    Quick Overview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {selectedTechnique.effectiveness}%
                      </div>
                      <div className="text-sm text-blue-600">Effectiveness</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {selectedTechnique.duration}
                      </div>
                      <div className="text-sm text-blue-600">Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-700">
                        {selectedTechnique.bestFor}
                      </div>
                      <div className="text-sm text-blue-600">Best For</div>
                    </div>
                  </div>
                </div>

                {/* Video Guides */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <PlayCircle className="h-6 w-6 text-blue-600" />
                    Expert Video Guides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {getTechniqueGuidance(selectedTechnique.id).videos.map(
                      (video, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg border border-blue-200 overflow-hidden shadow-sm"
                        >
                          <div className="aspect-video">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-gray-800 text-sm">
                              {video.title}
                            </h4>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                    <Timer className="h-6 w-6 text-blue-600" />
                    Step-by-Step Instructions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getTechniqueGuidance(selectedTechnique.id).stepByStep.map(
                      (step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <p className="text-blue-800 font-medium">{step}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Science & Benefits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                      <Brain className="h-6 w-6 text-blue-600" />
                      Scientific Benefits
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                      <p className="text-blue-800 text-sm leading-relaxed">
                        {getTechniqueGuidance(selectedTechnique.id).science}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {getTechniqueGuidance(selectedTechnique.id).benefits.map(
                        (benefit, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-blue-800 text-sm font-medium">
                              {benefit}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 text-blue-600" />
                      Pro Tips & Warnings
                    </h3>
                    <div className="space-y-3 mb-4">
                      {getTechniqueGuidance(selectedTechnique.id).tips.map(
                        (tip, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                            <span className="text-blue-800 text-sm font-medium">
                              {tip}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        ⚠️ Important Safety Notes
                      </h4>
                      <div className="space-y-1">
                        {getTechniqueGuidance(
                          selectedTechnique.id,
                        ).warnings.map((warning, index) => (
                          <div key={index} className="text-gray-700 text-sm">
                            • {warning}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      setIsGuidanceModalOpen(false);
                      if (selectedTechnique.id === "wim-hof") {
                        setCurrentView("wim-hof");
                      } else {
                        setCurrentView("all-methods");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice Session
                  </Button>
                  <Button
                    onClick={() => setIsGuidanceModalOpen(false)}
                    variant="outline"
                    className="px-8 py-2 border-gray-300 text-gray-700"
                  >
                    Close Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
