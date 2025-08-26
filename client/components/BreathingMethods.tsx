import { useState, useEffect, useRef } from "react";
import { useRewards } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Moon,
  Sun,
  Zap,
  Sparkles,
  Clock,
  Volume2,
  VolumeX,
  Timer,
  Target,
  ArrowLeft,
  Lock,
} from "lucide-react";

interface BreathingTechnique {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  duration: number; // in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  bestTime: "morning" | "evening" | "anytime";
  icon: React.ReactNode;
  color: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    pause?: number;
    cycles: number;
  };
  requiredLevel?: number;
}

interface BreathingMethodsProps {
  onBack?: () => void;
  defaultTechnique?: string;
}

export function BreathingMethods({
  onBack,
  defaultTechnique,
}: BreathingMethodsProps) {
  const {
    userLevel,
    getUnlockedBreathingMethods,
    addExperience,
    unlockAchievement,
  } = useRewards();
  const [selectedTechnique, setSelectedTechnique] =
    useState<BreathingTechnique | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<
    "inhale" | "hold" | "exhale" | "pause"
  >("inhale");
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const breathingTechniques: BreathingTechnique[] = [
    {
      id: "4-7-8",
      name: "4-7-8 Breathing",
      description:
        "A powerful technique for falling asleep quickly. Inhale for 4, hold for 7, exhale for 8.",
      benefits: [
        "Reduces anxiety",
        "Promotes sleep",
        "Lowers stress",
        "Calms nervous system",
      ],
      duration: 5,
      difficulty: "beginner",
      bestTime: "evening",
      icon: <Moon className="h-6 w-6" />,
      color: "from-blue-500 to-purple-500",
      pattern: { inhale: 4, hold: 7, exhale: 8, cycles: 4 },
    },
    {
      id: "box-breathing",
      name: "Box Breathing",
      description:
        "Equal timing for all phases. Used by Navy SEALs for focus and calm.",
      benefits: [
        "Improves focus",
        "Reduces stress",
        "Enhances performance",
        "Builds concentration",
      ],
      duration: 10,
      difficulty: "beginner",
      bestTime: "anytime",
      icon: <Target className="h-6 w-6" />,
      color: "from-green-500 to-teal-500",
      pattern: { inhale: 4, hold: 4, exhale: 4, pause: 4, cycles: 6 },
    },
    {
      id: "wim-hof",
      name: "Wim Hof Method",
      description:
        "30 deep breaths followed by retention. Increases energy and immune function.",
      benefits: [
        "Boosts energy",
        "Strengthens immunity",
        "Improves focus",
        "Increases resilience",
      ],
      duration: 15,
      difficulty: "advanced",
      bestTime: "morning",
      icon: <Zap className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      pattern: { inhale: 2, exhale: 1, cycles: 30 },
      requiredLevel: 4,
    },
    {
      id: "coherent-breathing",
      name: "Coherent Breathing",
      description:
        "5 seconds in, 5 seconds out. Perfect for heart rate variability.",
      benefits: [
        "Balances nervous system",
        "Improves HRV",
        "Reduces blood pressure",
        "Enhances wellbeing",
      ],
      duration: 10,
      difficulty: "beginner",
      bestTime: "anytime",
      icon: <Heart className="h-6 w-6" />,
      color: "from-pink-500 to-rose-500",
      pattern: { inhale: 5, exhale: 5, cycles: 10 },
    },
    {
      id: "triangle-breathing",
      name: "Triangle Breathing",
      description:
        "Three equal phases for balance and grounding. Simple yet effective.",
      benefits: [
        "Creates balance",
        "Grounds energy",
        "Calms mind",
        "Easy to remember",
      ],
      duration: 8,
      difficulty: "beginner",
      bestTime: "anytime",
      icon: <Sparkles className="h-6 w-6" />,
      color: "from-purple-500 to-indigo-500",
      pattern: { inhale: 4, hold: 4, exhale: 4, cycles: 8 },
    },
    {
      id: "alternate-nostril",
      name: "Alternate Nostril",
      description:
        "Pranayama technique for balancing left and right brain hemispheres.",
      benefits: [
        "Balances brain hemispheres",
        "Improves focus",
        "Reduces anxiety",
        "Enhances clarity",
      ],
      duration: 12,
      difficulty: "intermediate",
      bestTime: "morning",
      icon: <Wind className="h-6 w-6" />,
      color: "from-cyan-500 to-blue-500",
      pattern: { inhale: 4, exhale: 4, cycles: 12 },
      requiredLevel: 3,
    },
  ];

  useEffect(() => {
    if (defaultTechnique) {
      const technique = breathingTechniques.find(
        (t) => t.id === defaultTechnique,
      );
      if (technique) {
        setSelectedTechnique(technique);
      }
    }
  }, [defaultTechnique]);

  const playBreathingSound = (phase: string) => {
    if (!soundEnabled) return;

    // In a real app, you would have actual audio files
    // For now, we'll just use the Web Audio API to create simple tones
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different phases
    const frequencies: { [key: string]: number } = {
      inhale: 220,
      hold: 330,
      exhale: 165,
      pause: 110,
    };

    oscillator.frequency.setValueAtTime(
      frequencies[phase] || 220,
      audioContext.currentTime,
    );
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const startBreathing = () => {
    if (!selectedTechnique) return;

    setIsActive(true);
    setCurrentCycle(0);
    setCurrentPhase("inhale");
    runBreathingCycle();
  };

  const stopBreathing = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentCycle(0);
    setTimeRemaining(0);
    setTotalProgress(0);
    setPhaseProgress(0);
  };

  const runBreathingCycle = () => {
    if (!selectedTechnique) return;

    const pattern = selectedTechnique.pattern;
    let cycleCount = 0;
    let phase: "inhale" | "hold" | "exhale" | "pause" = "inhale";
    let phaseTime = 0;
    let totalTime = 0;

    const totalDuration = selectedTechnique.duration * 60; // Convert to seconds

    playBreathingSound(phase);

    intervalRef.current = setInterval(() => {
      phaseTime++;
      totalTime++;

      const currentPhaseDuration = pattern[phase] || 0;
      const phaseProgressPercent = (phaseTime / currentPhaseDuration) * 100;
      const totalProgressPercent = (totalTime / totalDuration) * 100;

      setPhaseProgress(Math.min(phaseProgressPercent, 100));
      setTotalProgress(Math.min(totalProgressPercent, 100));
      setTimeRemaining(totalDuration - totalTime);

      // Phase transition logic
      if (phaseTime >= currentPhaseDuration) {
        phaseTime = 0;

        if (phase === "inhale") {
          phase = pattern.hold ? "hold" : "exhale";
        } else if (phase === "hold") {
          phase = "exhale";
        } else if (phase === "exhale") {
          phase = pattern.pause ? "pause" : "inhale";
          if (!pattern.pause) {
            cycleCount++;
            setCurrentCycle(cycleCount);
          }
        } else if (phase === "pause") {
          phase = "inhale";
          cycleCount++;
          setCurrentCycle(cycleCount);
        }

        setCurrentPhase(phase);
        playBreathingSound(phase);

        // Special handling for Wim Hof method
        if (
          selectedTechnique.id === "wim-hof" &&
          cycleCount >= pattern.cycles
        ) {
          // Start retention phase
          phase = "hold";
          setCurrentPhase("hold");
          playBreathingSound("hold");
        }
      }

      // Check if session is complete
      if (totalTime >= totalDuration) {
        setIsActive(false);
        clearInterval(intervalRef.current!);
        setTotalProgress(100);

        // Award XP for completing session
        const xpReward = Math.floor(selectedTechnique.duration * 2); // 2 XP per minute
        addExperience(xpReward, `Completed ${selectedTechnique.name} session`);

        // Save session for achievement tracking
        const sessions = JSON.parse(
          localStorage.getItem("breathingSessions") || "[]",
        );
        sessions.push({
          technique: selectedTechnique.id,
          duration: selectedTechnique.duration,
          completedAt: new Date().toISOString(),
          xpEarned: xpReward,
        });
        localStorage.setItem("breathingSessions", JSON.stringify(sessions));

        // Check for breathing achievements
        if (sessions.length === 1) {
          unlockAchievement("breath-beginner");
        } else if (sessions.length === 10) {
          unlockAchievement("breathing-enthusiast");
        }

        if (selectedTechnique.id === "wim-hof") {
          unlockAchievement("wim-hof-warrior");
        }
      }
    }, 1000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBestTimeColor = (time: string) => {
    switch (time) {
      case "morning":
        return "bg-orange-100 text-orange-800";
      case "evening":
        return "bg-purple-100 text-purple-800";
      case "anytime":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return selectedTechnique?.id === "wim-hof" &&
          currentCycle >= selectedTechnique.pattern.cycles
          ? "Hold (Retention)"
          : "Hold";
      case "exhale":
        return "Breathe Out";
      case "pause":
        return "Pause";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-blue-900 mb-2 flex items-center gap-3">
            <Wind className="h-8 w-8 lg:h-10 lg:w-10 text-blue-600" />
            Breathing Methods
          </h1>
          <p className="text-blue-600 text-lg">
            Scientifically-proven breathing techniques to improve sleep, reduce
            stress, and enhance wellbeing
          </p>
        </div>
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="flex items-center gap-2 w-full lg:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      {!selectedTechnique ? (
        <>
          {/* Technique Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {breathingTechniques.map((technique) => {
              const isLocked =
                technique.requiredLevel &&
                userLevel.level < technique.requiredLevel;
              return (
                <Card
                  key={technique.id}
                  className={`relative transition-all ${
                    isLocked
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:shadow-lg cursor-pointer group"
                  }`}
                  onClick={() => !isLocked && setSelectedTechnique(technique)}
                >
                  <CardHeader>
                    {isLocked && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-gray-700 text-white p-1 rounded-full">
                          <Lock className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`p-3 bg-gradient-to-r ${technique.color} rounded-full inline-block mb-3 ${!isLocked ? "group-hover:scale-110" : ""} transition-transform`}
                    >
                      <div className="text-white">{technique.icon}</div>
                    </div>
                    <CardTitle className="text-lg">{technique.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      {technique.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        className={getDifficultyColor(technique.difficulty)}
                      >
                        {technique.difficulty}
                      </Badge>
                      <Badge className={getBestTimeColor(technique.bestTime)}>
                        {technique.bestTime}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="h-3 w-3" />
                        {technique.duration} min
                      </Badge>
                      {isLocked && (
                        <Badge className="bg-red-100 text-red-800">
                          Level {technique.requiredLevel} Required
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Benefits:
                      </p>
                      {technique.benefits.slice(0, 2).map((benefit, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          • {benefit}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Info Section */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Sparkles className="h-6 w-6" />
                Why Breathing Matters for Sleep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">
                    Activates Rest Mode
                  </h4>
                  <p className="text-sm text-gray-600">
                    Breathing exercises activate your parasympathetic nervous
                    system
                  </p>
                </div>
                <div className="text-center p-4">
                  <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">
                    Reduces Racing Thoughts
                  </h4>
                  <p className="text-sm text-gray-600">
                    Focused breathing calms mental chatter and anxiety
                  </p>
                </div>
                <div className="text-center p-4">
                  <Timer className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">
                    Works in Minutes
                  </h4>
                  <p className="text-sm text-gray-600">
                    Most techniques show effects within 2-5 minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Selected Technique View */
        <div className="space-y-6">
          {/* Back Button */}
          <Button
            onClick={() => setSelectedTechnique(null)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Techniques
          </Button>

          {/* Technique Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 bg-gradient-to-r ${selectedTechnique.color} rounded-full`}
                  >
                    <div className="text-white">{selectedTechnique.icon}</div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {selectedTechnique.name}
                    </CardTitle>
                    <p className="text-gray-600">
                      {selectedTechnique.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={getDifficultyColor(selectedTechnique.difficulty)}
                  >
                    {selectedTechnique.difficulty}
                  </Badge>
                  <Badge
                    className={getBestTimeColor(selectedTechnique.bestTime)}
                  >
                    {selectedTechnique.bestTime}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedTechnique.duration} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Breathing Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breathing Visualizer */}
            <Card className="p-6">
              <div className="text-center space-y-6">
                {/* Breathing Circle */}
                <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedTechnique.color} opacity-20 transition-all duration-1000 ${
                      isActive && currentPhase === "inhale"
                        ? "scale-110"
                        : isActive && currentPhase === "exhale"
                          ? "scale-90"
                          : "scale-100"
                    }`}
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      {isActive ? getPhaseInstruction() : "Ready"}
                    </div>
                    {isActive && (
                      <div className="text-lg text-gray-600">
                        Cycle {currentCycle + 1} of{" "}
                        {selectedTechnique.pattern.cycles}
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                  <div className="flex justify-center gap-4">
                    {!isActive ? (
                      <Button
                        onClick={startBreathing}
                        className={`bg-gradient-to-r ${selectedTechnique.color} text-white hover:opacity-90`}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    ) : (
                      <Button onClick={stopBreathing} variant="outline">
                        <Pause className="h-4 w-4 mr-2" />
                        Stop Session
                      </Button>
                    )}

                    <Button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      variant="outline"
                      size="sm"
                    >
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Progress */}
                  {isActive && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Phase Progress</span>
                        <span>{Math.round(phaseProgress)}%</span>
                      </div>
                      <Progress value={phaseProgress} className="h-2" />

                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Session Progress</span>
                        <span>
                          {Math.floor(timeRemaining / 60)}:
                          {(timeRemaining % 60).toString().padStart(2, "0")}{" "}
                          remaining
                        </span>
                      </div>
                      <Progress value={totalProgress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Technique Details */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {selectedTechnique.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Pattern:</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm">
                      Inhale: {selectedTechnique.pattern.inhale}s
                      {selectedTechnique.pattern.hold &&
                        ` • Hold: ${selectedTechnique.pattern.hold}s`}
                      {` • Exhale: ${selectedTechnique.pattern.exhale}s`}
                      {selectedTechnique.pattern.pause &&
                        ` • Pause: ${selectedTechnique.pattern.pause}s`}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Repeat for {selectedTechnique.pattern.cycles} cycles
                    </p>
                  </div>
                </div>

                {selectedTechnique.id === "wim-hof" && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Special Instructions:
                    </h4>
                    <p className="text-sm text-orange-700">
                      After 30 breathing cycles, take a deep breath and hold for
                      as long as comfortable. This is the retention phase that
                      provides the unique benefits of the Wim Hof method.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
