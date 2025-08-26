import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  Moon,
  Sun,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";

interface RoutineLoadingScreenProps {
  onComplete: () => void;
  routineType: "sleep" | "morning";
}

export function RoutineLoadingScreen({
  onComplete,
  routineType,
}: RoutineLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const sleepMessages = [
    "🧠 Analyzing your sleep assessment...",
    "🌙 Generating your personalized sleep schedule...",
    "⭐ Optimizing your bedtime routine...",
    "🎯 Calibrating sleep and wake times...",
    "✨ Adding science-based recommendations...",
    "🔥 Finalizing your sleep transformation plan...",
  ];

  const morningMessages = [
    "☀️ Designing your perfect morning...",
    "⚡ Optimizing your energy levels...",
    "🎯 Personalizing your wake-up routine...",
    "🧠 Calibrating for peak performance...",
    "✨ Adding motivational elements...",
    "🚀 Preparing your daily launchpad...",
  ];

  const messages = routineType === "sleep" ? sleepMessages : morningMessages;
  const icon =
    routineType === "sleep" ? (
      <Moon className="w-8 h-8 text-purple-400" />
    ) : (
      <Sun className="w-8 h-8 text-orange-400" />
    );
  const bgGradient =
    routineType === "sleep"
      ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      : "bg-gradient-to-br from-orange-600 via-pink-600 to-purple-600";

  useEffect(() => {
    const duration = 12000; // 12 seconds
    const interval = 100; // Update every 100ms
    const increment = 100 / (duration / interval);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500); // Small delay after reaching 100%
          return 100;
        }
        return newProgress;
      });
    }, interval);

    // Update messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete, messages.length]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${bgGradient}`}
    >
      <Card className="w-full max-w-2xl bg-black/40 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardContent className="p-8 lg:p-12 text-center">
          {/* Main Icon and Animation */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 animate-ping bg-white/20 rounded-full"></div>
              <div className="relative p-6 bg-white/10 rounded-full border border-white/30">
                {icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            🤖 Building Your {routineType === "sleep" ? "Sleep" : "Morning"}{" "}
            Routine
          </h1>

          {/* Dynamic Message */}
          <div className="mb-8 h-8 flex items-center justify-center">
            <p className="text-xl text-white/90 animate-pulse">
              {messages[currentMessage]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <Progress value={progress} className="h-4 bg-white/20" />
            <div className="flex justify-between items-center mt-3">
              <span className="text-white/70 text-sm">Progress</span>
              <span className="text-white font-bold text-lg">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* AI Process Steps */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <div
              className={`p-3 rounded-lg border ${progress >= 15 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <Brain className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Analysis</div>
              {progress >= 15 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${progress >= 35 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <Target className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Optimization</div>
              {progress >= 35 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${progress >= 55 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Personalization</div>
              {progress >= 55 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${progress >= 75 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <Zap className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Calibration</div>
              {progress >= 75 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${progress >= 90 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <CheckCircle className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Quality Check</div>
              {progress >= 90 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>

            <div
              className={`p-3 rounded-lg border ${progress >= 100 ? "bg-green-500/20 border-green-400/50 text-green-300" : "bg-white/5 border-white/20 text-white/50"}`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs">Finalization</div>
              {progress >= 100 && (
                <CheckCircle className="w-3 h-3 mx-auto mt-1" />
              )}
            </div>
          </div>

          {/* Bottom message */}
          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="text-white/80 text-sm">
              ✨ Our AI is crafting a routine specifically for your lifestyle
              and goals
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
