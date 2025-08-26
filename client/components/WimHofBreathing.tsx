import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Thermometer,
  Shield,
  Brain,
  ArrowLeft,
  Timer,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface WimHofBreathingProps {
  onBack?: () => void;
}

type WimHofPhase = "breathing" | "retention" | "recovery" | "complete";

export function WimHofBreathing({ onBack }: WimHofBreathingProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<WimHofPhase>("breathing");
  const [currentRound, setCurrentRound] = useState(1);
  const [currentBreath, setCurrentBreath] = useState(0);
  const [retentionTime, setRetentionTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "exhale">(
    "inhale",
  );
  const [roundResults, setRoundResults] = useState<number[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalRounds = 3;
  const breathsPerRound = 30;
  const breathingRhythm = 4000; // 4 seconds per breath phase (4 seconds in, 4 seconds out)

  const playBreathingSound = (type: "inhale" | "exhale" | "gong") => {
    if (!soundEnabled) return;

    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === "gong") {
      // Special sound for transitions
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        110,
        audioContext.currentTime + 1,
      );
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.2,
        audioContext.currentTime + 0.1,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 1,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } else {
      const frequency = type === "inhale" ? 330 : 220;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.15,
        audioContext.currentTime + 0.1,
      );
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.4);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);
    }
  };

  const startWimHofSession = () => {
    setIsActive(true);
    setCurrentPhase("breathing");
    setCurrentRound(1);
    setCurrentBreath(0);
    setRetentionTime(0);
    setRoundResults([]);
    setShowInstructions(false);
    startBreathingPhase();
  };

  const startBreathingPhase = () => {
    setCurrentPhase("breathing");
    setCurrentBreath(0);
    setBreathingPhase("inhale");

    intervalRef.current = setInterval(() => {
      setCurrentBreath((prev) => {
        const newBreath = prev + 1;

        if (newBreath <= breathsPerRound) {
          // Alternate between inhale and exhale
          setBreathingPhase(newBreath % 2 === 1 ? "inhale" : "exhale");
          playBreathingSound(newBreath % 2 === 1 ? "inhale" : "exhale");

          if (newBreath === breathsPerRound) {
            // Finished breathing, start retention
            setTimeout(() => {
              clearInterval(intervalRef.current!);
              startRetentionPhase();
            }, breathingRhythm);
          }
        }

        return newBreath;
      });
    }, breathingRhythm);
  };

  const startRetentionPhase = () => {
    setCurrentPhase("retention");
    setRetentionTime(0);
    playBreathingSound("gong");

    intervalRef.current = setInterval(() => {
      setRetentionTime((prev) => prev + 1);
    }, 1000);
  };

  const endRetentionPhase = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Record retention time
    setRoundResults((prev) => [...prev, retentionTime]);

    if (currentRound < totalRounds) {
      // Start recovery phase
      setCurrentPhase("recovery");
      setTimeout(() => {
        setCurrentRound((prev) => prev + 1);
        startBreathingPhase();
      }, 3000);
    } else {
      // Session complete
      setCurrentPhase("complete");
      setIsActive(false);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setCurrentPhase("breathing");
    setCurrentRound(1);
    setCurrentBreath(0);
    setRetentionTime(0);
    setShowInstructions(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case "breathing":
        return breathingPhase === "inhale" ? "Breathe All The Way In (4 sec)" : "Let It All Go (4 sec)";
      case "retention":
        return "Hold Your Breath";
      case "recovery":
        return "Take a Deep Breath & Relax";
      case "complete":
        return "Session Complete!";
      default:
        return "";
    }
  };

  const getPhaseDescription = () => {
    switch (currentPhase) {
      case "breathing":
        return "Breathe all the way in for 4 seconds, then completely let go for 4 seconds. This rhythm prepares your nervous system for deeper, more restful sleep.";
      case "retention":
        return "Hold your breath for as long as comfortable. Don't force it.";
      case "recovery":
        return "Take a moment to feel the effects. Notice any sensations.";
      case "complete":
        return "Well done! You've completed the full Wim Hof breathing session. Your body is now primed for better sleep quality tonight.";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-orange-900 mb-2 flex items-center gap-3">
            <Zap className="h-8 w-8 lg:h-10 lg:w-10 text-orange-600" />
            Wim Hof Breathing Method
          </h1>
          <p className="text-orange-600 text-lg">
            Master this powerful breathing technique for better sleep - controlled breathing activates your body's natural relaxation response for deeper rest
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

      {/* Instructions Card */}
      {showInstructions && (
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="h-6 w-6" />
              Important Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Safety First:
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Always practice in a safe environment</li>
                    <li>• Never do this while driving or in water</li>
                    <li>• Stop if you feel dizzy or uncomfortable</li>
                    <li>• Consult a doctor if you have health conditions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">
                    What to Expect:
                  </h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Tingling sensations are normal</li>
                    <li>• You may feel light-headed briefly</li>
                    <li>• Each round builds energy and focus</li>
                    <li>• Benefits increase with practice</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">
                  The Process for Better Sleep:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="bg-orange-100 p-3 rounded-full inline-block mb-2">
                      <Heart className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="font-medium">30 Deep Breaths</p>
                    <p className="text-gray-600">4 seconds in, 4 seconds out - this rhythm calms your nervous system for sleep</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 p-3 rounded-full inline-block mb-2">
                      <Timer className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="font-medium">Breath Retention</p>
                    <p className="text-gray-600">Hold as long as comfortable</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 p-3 rounded-full inline-block mb-2">
                      <RotateCcw className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="font-medium">Repeat 3 Rounds</p>
                    <p className="text-gray-600">Prepares body for deep, restorative sleep</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Breathing Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breathing Visualizer */}
        <Card className="p-6">
          <div className="text-center space-y-6">
            {/* Breathing Circle */}
            <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 ${
                  isActive &&
                  currentPhase === "breathing" &&
                  breathingPhase === "inhale"
                    ? "scale-110 opacity-30"
                    : isActive &&
                        currentPhase === "breathing" &&
                        breathingPhase === "exhale"
                      ? "scale-90 opacity-20"
                      : currentPhase === "retention"
                        ? "scale-105 opacity-40 animate-pulse"
                        : "scale-100 opacity-25"
                }`}
              />
              <div className="relative z-10 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {getPhaseInstruction()}
                </div>
                {isActive && currentPhase === "breathing" && (
                  <div className="text-xl text-gray-600">
                    {currentBreath} / {breathsPerRound}
                  </div>
                )}
                {currentPhase === "retention" && (
                  <div className="text-2xl text-orange-600 font-bold">
                    {formatTime(retentionTime)}
                  </div>
                )}
              </div>
            </div>

            {/* Phase Description */}
            <p className="text-gray-600 text-center">{getPhaseDescription()}</p>

            {/* Controls */}
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                {!isActive ? (
                  <Button
                    onClick={startWimHofSession}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Wim Hof Session
                  </Button>
                ) : (
                  <>
                    {currentPhase === "retention" && (
                      <Button
                        onClick={endRetentionPhase}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        End Retention
                      </Button>
                    )}
                    <Button onClick={stopSession} variant="outline">
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Session
                    </Button>
                  </>
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

              {/* Round Progress */}
              {isActive && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Round {currentRound} of {totalRounds}
                    </span>
                    <span>Phase: {currentPhase}</span>
                  </div>

                  {currentPhase === "breathing" && (
                    <Progress
                      value={(currentBreath / breathsPerRound) * 100}
                      className="h-3"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Session Info & Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              Session Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Round Results */}
            {roundResults.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Retention Times:</h4>
                <div className="space-y-2">
                  {roundResults.map((time, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-orange-50 rounded"
                    >
                      <span>Round {index + 1}</span>
                      <Badge variant="outline">{formatTime(time)}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div>
              <h4 className="font-semibold mb-3">Expected Benefits:</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span>Enhanced Focus</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Increased Energy</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Stronger Immunity</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  <span>Better Cold Tolerance</span>
                </div>
              </div>
            </div>

            {/* Session Complete */}
            {currentPhase === "complete" && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Session Complete!
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  Excellent work! You've completed a full Wim Hof breathing
                  session. Take a moment to notice how you feel.
                </p>
                {roundResults.length > 0 && (
                  <div className="text-sm text-green-700">
                    <p>
                      Average retention time:{" "}
                      {formatTime(
                        Math.round(
                          roundResults.reduce((a, b) => a + b, 0) /
                            roundResults.length,
                        ),
                      )}
                    </p>
                    <p>
                      Best retention time:{" "}
                      {formatTime(Math.max(...roundResults))}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Pro Tips for Better Sleep:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Practice 1-2 hours before bedtime for optimal sleep benefits</li>
                <li>• Focus on the 4-second rhythm: breathe all the way in for 4 seconds, then completely let go for 4 seconds</li>
                <li>• This breathing pattern activates your parasympathetic nervous system for deeper sleep</li>
                <li>• Don't force the retention - listen to your body</li>
                <li>• Regular practice improves sleep quality and helps you fall asleep faster</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
