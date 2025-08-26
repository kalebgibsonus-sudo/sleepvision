import { useState } from "react";
import {
  SleepQuestionnaire,
  SleepQuestionnaireData,
} from "./SleepQuestionnaire";
import {
  MorningQuestionnaire,
  MorningQuestionnaireData,
} from "./MorningQuestionnaire";
import { SchedulePreview } from "./SchedulePreview";
import { MorningRoutinePreview } from "./MorningRoutinePreview";
import { useAuth } from "@/contexts/AuthContext";
import { saveSleepSchedule, saveMorningRoutine } from "@/lib/firebaseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  Moon,
  Sun,
  Coffee,
  Smartphone,
  Book,
  Bed,
  Dumbbell,
  Bath,
  Music,
  Target,
  Brain,
  Heart,
  Zap,
  Activity,
  Droplets,
  Wind,
  CheckCircle,
  ArrowRight,
  Sunrise,
} from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  category: "evening" | "night" | "morning";
  icon: React.ReactNode;
}

interface RoutineItem {
  time: string;
  activity: string;
  description: string;
  category: "preparation" | "wellness" | "productivity" | "energy";
  icon: React.ReactNode;
}

interface CombinedAssessmentFlowProps {
  startingAssessment: "sleep" | "morning";
  onComplete?: () => void;
}

type FlowStep =
  | "sleep-questionnaire"
  | "morning-questionnaire"
  | "assessment-complete"
  | "generating-schedules"
  | "schedules-ready";

export function CombinedAssessmentFlow({
  startingAssessment,
  onComplete,
}: CombinedAssessmentFlowProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<FlowStep>(
    startingAssessment === "sleep"
      ? "sleep-questionnaire"
      : "morning-questionnaire",
  );
  const [sleepData, setSleepData] = useState<SleepQuestionnaireData | null>(
    null,
  );
  const [morningData, setMorningData] =
    useState<MorningQuestionnaireData | null>(null);
  const [sleepSchedule, setSleepSchedule] = useState<ScheduleItem[]>([]);
  const [morningRoutine, setMorningRoutine] = useState<RoutineItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const getActivityIcon = (activity: string, type: "sleep" | "morning") => {
    const activityLower = activity.toLowerCase();
    if (type === "morning") {
      if (
        activityLower.includes("hydration") ||
        activityLower.includes("water")
      )
        return <Droplets className="h-5 w-5 text-blue-500" />;
      if (
        activityLower.includes("coffee") ||
        activityLower.includes("caffeine")
      )
        return <Coffee className="h-5 w-5 text-orange-500" />;
      if (
        activityLower.includes("exercise") ||
        activityLower.includes("stretch") ||
        activityLower.includes("movement")
      )
        return <Dumbbell className="h-5 w-5 text-green-500" />;
      if (
        activityLower.includes("meditation") ||
        activityLower.includes("mindful")
      )
        return <Brain className="h-5 w-5 text-purple-500" />;
      if (
        activityLower.includes("planning") ||
        activityLower.includes("organize")
      )
        return <Target className="h-5 w-5 text-purple-600" />;
      if (
        activityLower.includes("breathing") ||
        activityLower.includes("breath")
      )
        return <Wind className="h-5 w-5 text-cyan-500" />;
      if (activityLower.includes("sunlight") || activityLower.includes("light"))
        return <Sun className="h-5 w-5 text-yellow-600" />;
      if (activityLower.includes("wake") || activityLower.includes("morning"))
        return <Sunrise className="h-5 w-5 text-orange-600" />;
    } else {
      if (
        activityLower.includes("coffee") ||
        activityLower.includes("caffeine")
      )
        return <Coffee className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("screen") || activityLower.includes("phone"))
        return <Smartphone className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("read") || activityLower.includes("book"))
        return <Book className="h-5 w-5 text-sleep-primary" />;
      if (
        activityLower.includes("exercise") ||
        activityLower.includes("workout")
      )
        return <Dumbbell className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("bath") || activityLower.includes("shower"))
        return <Bath className="h-5 w-5 text-sleep-primary" />;
      if (
        activityLower.includes("music") ||
        activityLower.includes("meditation")
      )
        return <Music className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("wake") || activityLower.includes("morning"))
        return <Sun className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("bed") || activityLower.includes("sleep"))
        return <Bed className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("evening") || activityLower.includes("wind"))
        return <Moon className="h-5 w-5 text-sleep-primary" />;
    }
    return <Clock className="h-5 w-5 text-gray-600" />;
  };

  const handleSleepAssessmentComplete = (data: SleepQuestionnaireData) => {
    setSleepData(data);
    if (morningData) {
      // If we already have morning data, generate both schedules
      generateBothSchedules(data, morningData);
    } else {
      // Move to morning assessment
      setCurrentStep("morning-questionnaire");
    }
  };

  const handleMorningAssessmentComplete = (data: MorningQuestionnaireData) => {
    setMorningData(data);
    if (sleepData) {
      // If we already have sleep data, generate both schedules
      generateBothSchedules(sleepData, data);
    } else {
      // Move to sleep assessment
      setCurrentStep("sleep-questionnaire");
    }
  };

  const generateBothSchedules = async (
    sleep: SleepQuestionnaireData,
    morning: MorningQuestionnaireData,
  ) => {
    // Prevent multiple simultaneous calls
    if (isGenerating) {
      console.log("Already generating schedules, skipping...");
      return;
    }

    setCurrentStep("generating-schedules");
    setIsGenerating(true);

    try {
      // Generate sleep schedule
      const sleepResponse = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sleep),
      });

      if (!sleepResponse.ok) {
        throw new Error(`Sleep API error: ${sleepResponse.status}`);
      }

      const sleepResult = await sleepResponse.json();

      // Generate morning routine
      const morningResponse = await fetch("/api/morning-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(morning),
      });

      if (!morningResponse.ok) {
        throw new Error(`Morning API error: ${morningResponse.status}`);
      }

      const morningResult = await morningResponse.json();

      // Process sleep schedule
      let scheduleItems: ScheduleItem[] = [];
      if (sleepResult.success && sleepResult.data.schedule) {
        scheduleItems = sleepResult.data.schedule.map((item: any) => ({
          ...item,
          icon: getActivityIcon(item.activity, "sleep"),
        }));
      } else {
        scheduleItems = generateFallbackSleepSchedule(sleep);
      }
      setSleepSchedule(scheduleItems);

      // Process morning routine
      let routineItems: RoutineItem[] = [];
      if (morningResult.success && morningResult.data.routine) {
        routineItems = morningResult.data.routine.map((item: any) => ({
          ...item,
          icon: getActivityIcon(item.activity, "morning"),
        }));
      } else {
        routineItems = generateFallbackMorningRoutine(morning);
      }
      setMorningRoutine(routineItems);

      // Save to Firebase if user is logged in
      if (user) {
        try {
          await Promise.all([
            saveSleepSchedule({
              userId: user.id,
              title: `Complete Sleep Schedule - ${new Date().toLocaleDateString()}`,
              schedule: scheduleItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: sleep,
              isActive: true,
            }),
            saveMorningRoutine({
              userId: user.id,
              title: `Complete Morning Routine - ${new Date().toLocaleDateString()}`,
              routine: routineItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: morning,
              isActive: true,
            }),
          ]);
          console.log("Both schedules saved successfully");
        } catch (error) {
          console.error("Error saving schedules:", error);
        }
      }

      setCurrentStep("schedules-ready");
    } catch (error) {
      console.error("Error generating schedules:", error);

      // Check if it's a fetch/network error
      if (
        error instanceof TypeError &&
        error.message.includes("body stream already read")
      ) {
        console.warn("Fetch body stream error - using fallback schedules");
      } else if (
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        console.warn("Network fetch error - using fallback schedules");
      }

      // Use fallback schedules
      setSleepSchedule(generateFallbackSleepSchedule(sleep));
      setMorningRoutine(generateFallbackMorningRoutine(morning));
      setCurrentStep("schedules-ready");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackSleepSchedule = (
    data: SleepQuestionnaireData,
  ): ScheduleItem[] => {
    // Use desired times instead of current times
    const bedtime = data.desiredBedtime || data.currentBedtime || "22:00";
    const wakeTime = data.desiredWakeTime || data.currentWakeTime || "06:30";

    return [
      {
        time: "6:00 PM",
        activity: "Finish daily tasks",
        description:
          "Complete work and daily responsibilities to create mental separation",
        category: "evening",
        icon: <Clock className="h-5 w-5 text-sleep-primary" />,
      },
      {
        time: bedtime,
        activity: "Bedtime preparation",
        description:
          "Begin your personalized wind-down routine for optimal sleep",
        category: "night",
        icon: <Bed className="h-5 w-5 text-sleep-primary" />,
      },
      {
        time: wakeTime,
        activity: "Wake up naturally",
        description:
          "Wake up at your desired time feeling refreshed and energized",
        category: "morning",
        icon: <Sun className="h-5 w-5 text-sleep-primary" />,
      },
    ];
  };

  const generateFallbackMorningRoutine = (
    data: MorningQuestionnaireData,
  ): RoutineItem[] => {
    // Use desired wake time instead of current
    const wakeTime = data.desiredWakeUpTime || data.currentWakeUpTime || "6:30";

    return [
      {
        time: wakeTime,
        activity: "Gentle awakening",
        description:
          "Wake up naturally and set a positive intention for your day",
        category: "preparation",
        icon: <Sunrise className="h-5 w-5 text-orange-600" />,
      },
      {
        time: "7:00 AM",
        activity: "Morning hydration",
        description: "Drink water to rehydrate your body after sleep",
        category: "wellness",
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
      },
      {
        time: "7:15 AM",
        activity: "Energizing movement",
        description:
          "Light stretching or gentle exercise to activate your body",
        category: "energy",
        icon: <Activity className="h-5 w-5 text-green-500" />,
      },
    ];
  };

  const renderProgressStep = () => {
    const steps = [
      { key: "sleep", label: "Sleep Assessment", completed: !!sleepData },
      { key: "morning", label: "Morning Assessment", completed: !!morningData },
      {
        key: "schedules",
        label: "Your Schedules",
        completed: currentStep === "schedules-ready",
      },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step.completed
                  ? "bg-green-500 text-white"
                  : currentStep.includes(step.key.toLowerCase())
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                step.completed ? "text-green-600" : "text-gray-600"
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 text-gray-400 mx-4" />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (currentStep === "sleep-questionnaire") {
    return (
      <div className="space-y-6">
        {renderProgressStep()}
        <SleepQuestionnaire onComplete={handleSleepAssessmentComplete} />
      </div>
    );
  }

  if (currentStep === "morning-questionnaire") {
    return (
      <div className="space-y-6">
        {renderProgressStep()}
        <MorningQuestionnaire onComplete={handleMorningAssessmentComplete} />
      </div>
    );
  }

  if (currentStep === "generating-schedules") {
    return (
      <div className="max-w-2xl mx-auto">
        {renderProgressStep()}
        <Card className="text-center p-12">
          <CardContent>
            <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Creating Your Complete Daily Routine! 🎯
            </h2>
            <p className="text-gray-600 text-lg">
              Luna is combining your sleep and morning preferences to create
              your perfect daily schedule...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "schedules-ready") {
    return (
      <div className="space-y-8">
        {renderProgressStep()}

        {/* Success Message */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Your Complete Daily Routine is Ready! 🎉
            </h2>
            <p className="text-gray-700 text-lg">
              Luna has created both your sleep schedule and morning routine
              based on your desired times and preferences.
            </p>
          </CardContent>
        </Card>

        {/* Both Schedules */}
        <div className="space-y-12">
          {/* Sleep Schedule */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
              <Moon className="h-8 w-8 text-blue-600" />
              Your Sleep Schedule
            </h3>
            <SchedulePreview schedule={sleepSchedule} isGenerating={false} />
          </div>

          {/* Morning Routine */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-3">
              <Sunrise className="h-8 w-8 text-orange-600" />
              Your Morning Routine
            </h3>
            <MorningRoutinePreview
              routine={morningRoutine}
              isGenerating={false}
            />
          </div>
        </div>

        {onComplete && (
          <div className="text-center mt-12">
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl font-bold"
              size="lg"
            >
              Complete Setup 🚀
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
