import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Moon,
  Sun,
  Coffee,
  Smartphone,
  Book,
  Bed,
  Crown,
  Zap,
  Shield,
  TrendingUp,
  Check,
  Star,
  Lock,
  Play,
  MousePointer,
  BarChart3,
} from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  category: "evening" | "night" | "morning";
  icon: React.ReactNode;
}

interface SchedulePreviewProps {
  schedule: ScheduleItem[];
  isGenerating: boolean;
  onGoToDashboard?: () => void;
}

export function SchedulePreview({
  schedule,
  isGenerating,
  onGoToDashboard,
}: SchedulePreviewProps) {
  const [showSubscription, setShowSubscription] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [detailedRoutine, setDetailedRoutine] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "evening":
        return "bg-orange-500/20 text-orange-700";
      case "night":
        return "bg-blue-500/20 text-blue-700";
      case "morning":
        return "bg-yellow-500/20 text-yellow-700";
      default:
        return "bg-gray-500/20 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "evening":
        return "Evening Routine";
      case "night":
        return "Sleep Preparation";
      case "morning":
        return "Morning Routine";
      default:
        return "Activity";
    }
  };

  const getDetailedRoutine = async (item: ScheduleItem) => {
    setSelectedItem(item);
    setIsLoadingDetails(true);

    // Simulate AI generation with detailed content
    await new Promise(resolve => setTimeout(resolve, 1500));

    const routines: any = {
      "Hydrate and stretch": {
        title: "Morning Hydration & Stretching Routine",
        duration: "10-15 minutes",
        steps: [
          "1. Drink 16-20oz of room temperature water immediately upon waking",
          "2. Gentle neck rolls (5 each direction)",
          "3. Shoulder blade squeezes (10 reps)",
          "4. Cat-cow stretch (10 reps)",
          "5. Standing forward fold (hold 30 seconds)",
          "6. Hip circles (5 each direction)",
          "7. Calf raises (15 reps)"
        ],
        tips: "Start slowly and listen to your body. Never force a stretch.",
        benefits: "Improves circulation, reduces stiffness, and energizes your body for the day."
      },
      "Meditation or breathing": {
        title: "Breathing & Meditation Practice",
        duration: "10 minutes",
        steps: [
          "1. Find a comfortable seated position",
          "2. Close your eyes and take 3 deep breaths",
          "3. Begin with basic 4-7-8 breathing (4 seconds in, 7 hold, 8 out)",
          "4. Continue for 5-10 cycles",
          "5. Optional: Try Wim Hof breathing method (see video below)",
          "6. End with 2 minutes of silent meditation"
        ],
        video: "wim-hof-breathing",
        tips: "If you feel dizzy, slow down the breathing pace. Consistency is more important than intensity.",
        benefits: "Reduces stress, improves focus, and activates the parasympathetic nervous system."
      },
      "Relaxing activity": {
        title: "Evening Wind-Down Activities",
        duration: "30 minutes",
        steps: [
          "1. Choose from: reading, gentle yoga, journaling, or soft music",
          "2. Dim the lights to 30% or use candles",
          "3. If reading: choose fiction or poetry, avoid work-related content",
          "4. If yoga: focus on gentle poses like child's pose, legs up the wall",
          "5. If journaling: write 3 things you're grateful for",
          "6. End with 5 minutes of deep breathing"
        ],
        tips: "Keep activities low-stimulation and avoid anything that might cause excitement or stress.",
        benefits: "Signals to your brain that it's time to wind down and prepare for sleep."
      },
      "Digital sunset": {
        title: "Digital Detox & Blue Light Elimination",
        duration: "Ongoing until bedtime",
        steps: [
          "1. Turn off all screens: TV, phone, tablet, computer",
          "2. Use blue light blocking glasses if you must use devices",
          "3. Switch to warm lighting (2700K or lower)",
          "4. Put phone in another room or use airplane mode",
          "5. If needed, use an analog alarm clock instead of phone",
          "6. Replace screen time with reading, gentle music, or conversation"
        ],
        tips: "Blue light disrupts melatonin production. The earlier you stop, the better your sleep quality.",
        benefits: "Improves melatonin production, reduces brain stimulation, and enhances sleep quality."
      }
    };

    const defaultRoutine = {
      title: `Detailed Guide: ${item.activity}`,
      duration: "5-15 minutes",
      steps: [
        `1. Prepare your space for ${item.activity.toLowerCase()}`,
        "2. Take 3 deep breaths to center yourself",
        "3. Follow the activity mindfully and at your own pace",
        "4. Pay attention to how your body feels during the activity",
        "5. Conclude with a moment of gratitude"
      ],
      tips: "Listen to your body and adjust the activity to your comfort level.",
      benefits: "Supports your overall sleep routine and well-being."
    };

    const routine = routines[item.activity] || defaultRoutine;
    setDetailedRoutine(routine);
    setIsLoadingDetails(false);
  };

  const getBreathingVideo = (videoType: string) => {
    const videos: any = {
      "wim-hof-breathing": {
        title: "Wim Hof Breathing Method",
        embedId: "tybOi4hjZFQ", // Wim Hof official breathing tutorial
        description: "Follow along with this guided Wim Hof breathing session. Start with 3 rounds."
      },
      "4-7-8-breathing": {
        title: "4-7-8 Breathing Technique",
        embedId: "YRPh_GaiL8s", // 4-7-8 breathing tutorial
        description: "Perfect for relaxation and falling asleep. Practice 4 cycles to start."
      },
      "box-breathing": {
        title: "Box Breathing for Calm",
        embedId: "FjHGZj2IjBk", // Box breathing tutorial
        description: "Used by Navy SEALs for stress management and focus."
      }
    };

    return videos[videoType] || videos["4-7-8-breathing"];
  };

  return (
    <>
      <div className="relative">
                <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border border-gray-200">
          <CardHeader className="text-center bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-full border border-blue-200">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Your Personalized Sleep Schedule
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-gray-700">
              Luna has crafted your perfect sleep routine based on your
              responses
            </CardDescription>
          </CardHeader>

                    <CardContent className="p-8 bg-white">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-sleep-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-sleep-night">
                  Luna is analyzing your responses and creating your
                  personalized schedule...
                </p>
              </div>
                        ) : (
              <>
                {/* Success Notice */}
                <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Check className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Your Personalized Schedule is Ready!
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Luna has analyzed your responses and created your complete sleep routine. Enjoy full access!
                  </p>
                </div>

                {/* Schedule List Format */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Your Daily Sleep Schedule
                  </h3>

                  {/* Timeline List */}
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-blue-200"></div>

                    <div className="space-y-4">
                      {schedule
                        .sort((a, b) => {
                          // Sort by time for proper chronological order
                          const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
                          const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
                          // Handle PM/AM times properly
                          if (a.time.includes('PM') && b.time.includes('AM')) return -1;
                          if (a.time.includes('AM') && b.time.includes('PM')) return 1;
                          return timeA - timeB;
                        })
                        .map((item, index) => (
                        <div
                          key={index}
                          onClick={() => getDetailedRoutine(item)}
                          className="relative flex items-start gap-6 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                        >
                          {/* Timeline dot */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all">
                              <div className="text-white">
                                {item.icon}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-blue-600">
                                  {item.time}
                                </span>
                                <Badge className={getCategoryColor(item.category)}>
                                  {getCategoryLabel(item.category)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-blue-600 opacity-70 group-hover:opacity-100 transition-opacity">
                                <MousePointer className="h-4 w-4" />
                                <span className="text-sm font-medium">Click for details</span>
                              </div>
                            </div>

                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {item.activity}
                            </h4>

                            <p className="text-gray-700 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Summary */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="text-lg font-semibold text-blue-900 mb-2">
                      📋 Schedule Summary
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-orange-600 font-semibold">Evening Activities</div>
                        <div className="text-gray-700">
                          {schedule.filter(item => item.category === 'evening').length} activities
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold">Sleep Prep</div>
                        <div className="text-gray-700">
                          {schedule.filter(item => item.category === 'night').length} activities
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-600 font-semibold">Morning Routine</div>
                        <div className="text-gray-700">
                          {schedule.filter(item => item.category === 'morning').length} activities
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Dialog */}
      <Dialog open={showSubscription} onOpenChange={setShowSubscription}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-sleep-primary to-sleep-secondary rounded-full">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold">
                Unlock SleepVision Pro
              </DialogTitle>
            </div>
            <DialogDescription className="text-lg">
              Get your complete personalized sleep schedule and ongoing AI
              coaching
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Pricing */}
            <div className="text-center p-6 bg-gradient-to-br from-sleep-primary/5 to-sleep-secondary/5 rounded-xl">
              <div className="text-4xl font-black text-sleep-primary mb-2">
                $5.99
              </div>
              <div className="text-sleep-night/70">per month</div>
              <div className="mt-4">
                <Badge className="bg-green-500 text-white">
                  7-Day Free Trial
                </Badge>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-sleep-night flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Premium Features
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Complete personalized schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Detailed activity instructions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Unlimited Luna AI coaching
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Weekly schedule adjustments
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sleep-night flex items-center gap-2">
                  <Zap className="h-5 w-5 text-sleep-primary" />
                  Advanced Tools
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Sleep tracking integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Progress analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Custom reminders & alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Priority support
                  </li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 btn-gradient text-white font-bold py-3 text-lg"
                onClick={() => {
                  // Handle subscription logic here
                  setShowSubscription(false);
                  // TODO: Integrate with real Stripe payment processing
                }}
              >
                <Crown className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSubscription(false)}
                className="flex-1 py-3"
              >
                Maybe Later
              </Button>
            </div>

            <div className="text-center text-xs text-muted-foreground">
              Cancel anytime. No commitments. 🔒 Secure payment processing.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Routine Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-full">
                    {selectedItem.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-left">
                      {selectedItem.time} - {selectedItem.activity}
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      AI-Generated detailed routine and instructions
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              {isLoadingDetails ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg text-gray-700">
                    Luna is creating your detailed routine...
                  </p>
                </div>
              ) : detailedRoutine && (
                <div className="space-y-6">
                  {/* Routine Header */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">
                      {detailedRoutine.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-blue-700">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Duration: {detailedRoutine.duration}
                      </span>
                    </div>
                  </div>

                  {/* Step-by-Step Instructions */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Step-by-Step Instructions
                    </h4>
                    <div className="space-y-3">
                      {detailedRoutine.steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-800 flex-1">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Video Section */}
                  {detailedRoutine.video && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Play className="h-5 w-5 text-red-600" />
                        Guided Video Tutorial
                      </h4>
                      <div className="bg-gray-900 rounded-lg overflow-hidden">
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getBreathingVideo(detailedRoutine.video).embedId}?rel=0`}
                            title={getBreathingVideo(detailedRoutine.video).title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 bg-gray-800 text-white">
                          <h5 className="font-semibold mb-1">
                            {getBreathingVideo(detailedRoutine.video).title}
                          </h5>
                          <p className="text-gray-300 text-sm">
                            {getBreathingVideo(detailedRoutine.video).description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tips & Benefits */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3">
                        💡 Pro Tips
                      </h4>
                      <p className="text-yellow-700">{detailedRoutine.tips}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="text-lg font-semibold text-green-800 mb-3">
                        ✨ Benefits
                      </h4>
                      <p className="text-green-700">{detailedRoutine.benefits}</p>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="text-center pt-4">
                    <Button
                      onClick={() => setSelectedItem(null)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                    >
                      Got it! Back to Schedule
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
