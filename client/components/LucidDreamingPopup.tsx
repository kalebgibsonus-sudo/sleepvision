import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  Moon, 
  Eye, 
  Lightbulb, 
  CheckCircle, 
  PlayCircle, 
  Timer,
  BookOpen,
  Star,
  Zap,
  AlertTriangle,
  Clock
} from "lucide-react";

interface LucidDreamingPopupProps {
  onTryNow: () => void;
  onNeverShowAgain: () => void;
}

export function LucidDreamingPopup({ onTryNow, onNeverShowAgain }: LucidDreamingPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has previously seen this popup or chosen "never show again"
    const neverShow = localStorage.getItem('lucidDreamingNeverShow');
    const hasSeenPopup = localStorage.getItem('lucidDreamingPopupSeen');

    if (!neverShow && !hasSeenPopup) {
      // Show popup only once, after 3 seconds delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem('lucidDreamingPopupSeen', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTryNow = () => {
    setIsOpen(false);
    onTryNow();
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('lucidDreamingNeverShow', 'true');
    setIsOpen(false);
    onNeverShowAgain();
  };

  const techniques = [
    {
      name: "Reality Checks",
      description: "Perform regular reality checks throughout the day",
      steps: [
        "Look at your hands - count your fingers",
        "Check digital clocks twice (time changes in dreams)",
        "Read text, look away, then read again",
        "Ask yourself 'Am I dreaming?' seriously"
      ],
      successRate: "78% effectiveness when done 10+ times daily",
      icon: <Eye className="w-5 h-5" />
    },
    {
      name: "Wake-Back-to-Bed (WBTB)",
      description: "Interrupt sleep to increase lucid dreaming chances",
      steps: [
        "Sleep for 4-6 hours normally",
        "Wake up and stay awake for 15-30 minutes",
        "Think about lucid dreaming and set intentions",
        "Go back to sleep with strong lucid intent"
      ],
      successRate: "65% success rate when combined with reality checks",
      icon: <Clock className="w-5 h-5" />
    },
    {
      name: "Mnemonic Induction (MILD)",
      description: "Use memory techniques to trigger lucidity",
      steps: [
        "As you fall asleep, repeat 'Next time I'm dreaming, I'll remember I'm dreaming'",
        "Visualize yourself becoming lucid in a recent dream",
        "Imagine what you'll do when you become lucid",
        "Focus on this intention until you fall asleep"
      ],
      successRate: "72% success rate with consistent practice",
      icon: <Brain className="w-5 h-5" />
    }
  ];

  const benefits = [
    { text: "Enhanced creativity and problem-solving", percentage: 89 },
    { text: "Overcome nightmares and fears", percentage: 94 },
    { text: "Practice skills and rehearse performances", percentage: 76 },
    { text: "Explore consciousness and self-awareness", percentage: 92 },
    { text: "Experience impossible adventures safely", percentage: 100 }
  ];

  const expertVideos = [
    {
      title: "Reality Check Technique - How to Lucid Dream",
      url: "https://www.youtube.com/embed/L-pq7VjVXyk",
      description: "Step-by-step reality check methods that work"
    },
    {
      title: "WILD Technique - Wake Initiated Lucid Dreams",
      url: "https://www.youtube.com/embed/LyL8yuS5WzE",
      description: "Advanced consciousness transition method"
    },
    {
      title: "MILD Method - Memory Induced Lucid Dreams",
      url: "https://www.youtube.com/embed/WUrFpKKjlOM",
      description: "Intention setting for dream awareness"
    }
  ];

  const quickStart = [
    {
      title: "RIGHT NOW: Log Your Dream Journal",
      description: "Open notes app → Write 'Last night I dreamed...' → Set phone alarm labeled 'DREAM JOURNAL' for tomorrow 6am",
      time: "2 minutes",
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      title: "TECHNIQUE: Digital Clock Reality Check",
      description: "1. Look at any digital clock 2. Look away for 3 seconds 3. Look back - if time changed dramatically, you're dreaming 4. Set hourly phone reminders to practice this",
      time: "30 seconds each",
      icon: <Eye className="w-4 h-4" />
    },
    {
      title: "TONIGHT: MILD Practice Session",
      description: "As you fall asleep repeat: 'Next time I'm dreaming, I will remember I'm dreaming' while visualizing becoming lucid in your last dream",
      time: "5-10 minutes",
      icon: <Brain className="w-4 h-4" />
    },
    {
      title: "ADVANCED: WBTB Protocol",
      description: "1. Sleep 4-6 hours 2. Set alarm, wake up 3. Stay awake 15-30 mins thinking about lucid dreaming 4. Go back to sleep with strong intention",
      time: "20 minutes",
      icon: <Clock className="w-4 h-4" />
    }
  ];

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Moon className="w-8 h-8 text-blue-500" />
            Master Lucid Dreaming
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Advanced Sleep Technique
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Introduction */}
          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Unlock Your Dream World
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Lucid dreaming is the ability to become conscious and control your dreams while sleeping. 
                Research shows that <strong>23% of people experience lucid dreams naturally</strong>, 
                but with proper techniques, <strong>up to 77% can learn to lucid dream consistently</strong>. 
                This powerful skill can enhance creativity, overcome fears, and provide incredible experiences.
              </p>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Proven Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <Card key={index} className="border-yellow-200">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{benefit.text}</span>
                      <Badge variant="outline">{benefit.percentage}%</Badge>
                    </div>
                    <Progress value={benefit.percentage} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Expert Videos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-500" />
              Expert Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expertVideos.map((video, index) => (
                <Card key={index} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="aspect-video mb-3">
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="w-full h-full rounded-md border"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{video.title}</h4>
                    <p className="text-xs text-gray-600">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Techniques */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-500" />
              Proven Techniques
            </h3>
            <div className="space-y-4">
              {techniques.map((technique, index) => (
                <Card key={index} className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {technique.icon}
                      {technique.name}
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                        {technique.successRate}
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{technique.description}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {technique.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Start Guide */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-orange-500" />
              Quick Start Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickStart.map((step, index) => (
                <Card key={index} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 rounded-full">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                        <Badge variant="outline" className="text-xs">
                          {step.time}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Note */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-1">Important Notes</h4>
                  <p className="text-sm text-amber-700">
                    Lucid dreaming is generally safe for healthy individuals. Start gradually and maintain 
                    a regular sleep schedule. If you experience sleep disruption or confusion between 
                    dreams and reality, reduce practice frequency and consult a sleep specialist.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={handleTryNow}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Try Tonight - Start My Journey
            </Button>
            <Button 
              onClick={handleNeverShowAgain}
              variant="outline"
              className="px-6 py-3 rounded-lg"
            >
              Never Show Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
