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
  Sunrise,
  Sun,
  Coffee,
  Smartphone,
  Book,
  Dumbbell,
  Bath,
  Music,
  Target,
  Check,
  Star,
  Play,
  MousePointer,
  BarChart3,
  Brain,
  Heart,
  Zap,
  Activity,
  Droplets,
  Wind,
} from "lucide-react";

interface RoutineItem {
  time: string;
  activity: string;
  description: string;
  category: "preparation" | "wellness" | "productivity" | "energy";
  icon: React.ReactNode;
}

interface MorningRoutinePreviewProps {
  routine: RoutineItem[];
  isGenerating: boolean;
  onGoToDashboard?: () => void;
}

export function MorningRoutinePreview({
  routine,
  isGenerating,
  onGoToDashboard,
}: MorningRoutinePreviewProps) {
  const [selectedItem, setSelectedItem] = useState<RoutineItem | null>(null);
  const [detailedRoutine, setDetailedRoutine] = useState<any>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "preparation":
        return "bg-blue-500/20 text-blue-700";
      case "wellness":
        return "bg-green-500/20 text-green-700";
      case "productivity":
        return "bg-purple-500/20 text-purple-700";
      case "energy":
        return "bg-orange-500/20 text-orange-700";
      default:
        return "bg-gray-500/20 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "preparation":
        return "Morning Prep";
      case "wellness":
        return "Wellness";
      case "productivity":
        return "Productivity";
      case "energy":
        return "Energy Boost";
      default:
        return "Activity";
    }
  };

  const getDetailedRoutine = async (item: RoutineItem) => {
    setSelectedItem(item);
    setIsLoadingDetails(true);

    // Simulate AI generation with detailed content
    await new Promise(resolve => setTimeout(resolve, 1500));

    const routines: any = {
      "Morning hydration": {
        title: "Strategic Morning Hydration",
        duration: "5-10 minutes",
        steps: [
          "1. Drink 16-20oz of room temperature water immediately upon waking",
          "2. Add a pinch of sea salt or lemon for enhanced absorption",
          "3. Wait 5-10 minutes before consuming caffeine",
          "4. Set a glass of water by your bed the night before",
          "5. Consider drinking water before even checking your phone"
        ],
        tips: "Your body loses water during sleep. Rehydrating first thing helps jumpstart your metabolism and brain function.",
        benefits: "Improves alertness, aids digestion, supports metabolism, and enhances cognitive function."
      },
      "Dynamic morning stretch": {
        title: "Energizing Morning Movement",
        duration: "10-15 minutes",
        steps: [
          "1. Gentle neck rolls (5 each direction)",
          "2. Shoulder blade squeezes (10 reps)",
          "3. Cat-cow stretch (10 reps)",
          "4. Standing forward fold (hold 30 seconds)",
          "5. Hip circles (5 each direction)",
          "6. Arm circles (10 forward, 10 backward)",
          "7. Light jumping jacks or marching in place (1 minute)"
        ],
        tips: "Start slowly and listen to your body. Movement helps circulate blood and activate your nervous system.",
        benefits: "Increases blood flow, reduces stiffness, boosts energy, and prepares your body for the day."
      },
      "Mindful morning meditation": {
        title: "Morning Mindfulness Practice",
        duration: "5-15 minutes",
        steps: [
          "1. Find a comfortable seated position",
          "2. Close your eyes and take 3 deep breaths",
          "3. Focus on your breath or use a guided meditation app",
          "4. If thoughts arise, gently return focus to your breath",
          "5. Set an intention for your day",
          "6. End with 3 deep breaths and slowly open your eyes"
        ],
        video: "morning-meditation",
        tips: "Consistency is more important than duration. Even 2-3 minutes can make a difference.",
        benefits: "Reduces stress, improves focus, enhances emotional regulation, and sets a positive tone for the day."
      },
      "Strategic coffee timing": {
        title: "Optimal Caffeine Consumption",
        duration: "5 minutes (plus timing)",
        steps: [
          "1. Wait 60-90 minutes after waking before your first cup",
          "2. Drink water first to avoid caffeine on an empty stomach",
          "3. Choose quality coffee or tea over instant options",
          "4. Consider adding healthy fats (MCT oil, grass-fed butter)",
          "5. Limit to 1-2 cups before noon",
          "6. Savor the ritual - don't rush your coffee time"
        ],
        tips: "Your cortisol is naturally highest in the morning. Waiting allows caffeine to be more effective.",
        benefits: "Better caffeine effectiveness, improved sleep later, reduced jitters, and sustained energy."
      },
      "Power planning session": {
        title: "Daily Planning & Intention Setting",
        duration: "10-15 minutes",
        steps: [
          "1. Review your calendar and commitments",
          "2. Write down your top 3 priorities for the day",
          "3. Time-block important tasks",
          "4. Identify potential challenges and solutions",
          "5. Set a positive intention or theme for the day",
          "6. Visualize your successful day completion"
        ],
        tips: "Keep a consistent planning format. Digital or paper - whatever works for you consistently.",
        benefits: "Increases productivity, reduces decision fatigue, improves focus, and creates intentional living."
      },
      "Energizing breakfast prep": {
        title: "Nutritious Breakfast Preparation",
        duration: "15-20 minutes",
        steps: [
          "1. Choose protein-rich options (eggs, Greek yogurt, nuts)",
          "2. Add healthy fats (avocado, nut butters, seeds)",
          "3. Include complex carbs (oats, whole grains, fruits)",
          "4. Prepare colorful foods for micronutrients",
          "5. Eat mindfully without distractions",
          "6. Stay hydrated throughout your meal"
        ],
        tips: "Meal prep on weekends can make mornings easier. Overnight oats and egg muffins are great options.",
        benefits: "Stable blood sugar, sustained energy, better focus, and proper nutrition foundation for the day."
      }
    };

    const defaultRoutine = {
      title: `Detailed Guide: ${item.activity}`,
      duration: "5-15 minutes",
      steps: [
        `1. Prepare your space for ${item.activity.toLowerCase()}`,
        "2. Set a clear intention for this activity",
        "3. Follow the activity mindfully and at your own pace",
        "4. Pay attention to how your body and mind feel",
        "5. Conclude with a moment of gratitude or reflection"
      ],
      tips: "Listen to your body and adjust the activity to your energy level and available time.",
      benefits: "Supports your overall morning routine and helps you start the day with purpose."
    };

    const routine = routines[item.activity] || defaultRoutine;
    setDetailedRoutine(routine);
    setIsLoadingDetails(false);
  };

  const getMorningVideo = (videoType: string) => {
    const videos: any = {
      "morning-meditation": {
        title: "10-Minute Morning Meditation",
        embedId: "inpok4MKVLM", // Morning meditation
        description: "A guided meditation to start your day with clarity and intention."
      },
      "morning-yoga": {
        title: "Energizing Morning Yoga Flow",
        embedId: "VaoV1PrYft4", // Morning yoga
        description: "A gentle yoga sequence to wake up your body and mind."
      },
      "morning-breathing": {
        title: "Morning Breathing Exercise",
        embedId: "tybOi4hjZFQ", // Breathing exercise
        description: "Energizing breathwork to activate your nervous system."
      }
    };

    return videos[videoType] || videos["morning-meditation"];
  };

  return (
    <>
      <div className="relative">
        <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border border-gray-200">
          <CardHeader className="text-center bg-gradient-to-b from-orange-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-full border border-orange-200">
                <Sunrise className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                Your Personalized Morning Routine
              </CardTitle>
            </div>
            <CardDescription className="text-lg text-gray-700">
              Luna has crafted your perfect morning routine based on your
              responses
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 bg-white">
            {isGenerating ? (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg text-gray-700">
                  Luna is analyzing your preferences and creating your
                  personalized morning routine...
                </p>
              </div>
            ) : (
              <>
                {/* Success Notice */}
                <div className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-orange-500/10 rounded-xl border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-3">
                    <Check className="h-6 w-6 text-green-500" />
                    <h3 className="text-xl font-bold text-gray-900">
                      Your Morning Routine is Ready!
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    Luna has analyzed your preferences and created your complete morning routine. Start tomorrow!
                  </p>
                </div>

                {/* Routine Timeline */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Your Personalized Morning Timeline
                  </h3>
                  
                  {/* Timeline List */}
                  <div className="relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-orange-200"></div>
                    
                    <div className="space-y-4">
                      {routine
                        .sort((a, b) => {
                          // Sort by time for proper chronological order
                          const timeA = new Date(`2000-01-01 ${a.time}`).getTime();
                          const timeB = new Date(`2000-01-01 ${b.time}`).getTime();
                          return timeA - timeB;
                        })
                        .map((item, index) => (
                        <div
                          key={index}
                          onClick={() => getDetailedRoutine(item)}
                          className="relative flex items-start gap-6 p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
                        >
                          {/* Timeline dot */}
                          <div className="relative z-10 flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 rounded-full flex items-center justify-center shadow-lg transition-all">
                              <div className="text-white">
                                {item.icon}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-bold text-orange-600">
                                  {item.time}
                                </span>
                                <Badge className={getCategoryColor(item.category)}>
                                  {getCategoryLabel(item.category)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-orange-600 opacity-70 group-hover:opacity-100 transition-opacity">
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

                  {/* Routine Summary */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                    <h4 className="text-lg font-semibold text-orange-900 mb-2">
                      📋 Routine Summary
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-blue-600 font-semibold">Preparation</div>
                        <div className="text-gray-700">
                          {routine.filter(item => item.category === 'preparation').length} activities
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-semibold">Wellness</div>
                        <div className="text-gray-700">
                          {routine.filter(item => item.category === 'wellness').length} activities
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-600 font-semibold">Productivity</div>
                        <div className="text-gray-700">
                          {routine.filter(item => item.category === 'productivity').length} activities
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-600 font-semibold">Energy</div>
                        <div className="text-gray-700">
                          {routine.filter(item => item.category === 'energy').length} activities
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Go to Dashboard Button */}
                {onGoToDashboard && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={onGoToDashboard}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
                      size="lg"
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Go to Your Dashboard
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Track your progress and manage your morning routine
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Routine Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 rounded-full">
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
                  <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg text-gray-700">
                    Luna is creating your detailed routine...
                  </p>
                </div>
              ) : detailedRoutine && (
                <div className="space-y-6">
                  {/* Routine Header */}
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-xl font-bold text-orange-900 mb-2">
                      {detailedRoutine.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-orange-700">
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
                          <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
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
                            src={`https://www.youtube.com/embed/${getMorningVideo(detailedRoutine.video).embedId}?rel=0`}
                            title={getMorningVideo(detailedRoutine.video).title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 bg-gray-800 text-white">
                          <h5 className="font-semibold mb-1">
                            {getMorningVideo(detailedRoutine.video).title}
                          </h5>
                          <p className="text-gray-300 text-sm">
                            {getMorningVideo(detailedRoutine.video).description}
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
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2"
                    >
                      Got it! Back to Routine
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
