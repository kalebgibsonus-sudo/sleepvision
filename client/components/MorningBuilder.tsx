import { useState } from "react";
import {
  MorningQuestionnaire,
  MorningQuestionnaireData,
} from "./MorningQuestionnaire";
import { MorningRoutinePreview } from "./MorningRoutinePreview";
import { useAuth } from "@/contexts/AuthContext";
import { saveMorningRoutine } from "@/lib/firebaseService";
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

interface MorningBuilderProps {
  onRoutineCreated?: () => void;
}

export function MorningBuilder({ onRoutineCreated }: MorningBuilderProps = {}) {
  const { user } = useAuth();
  const [step, setStep] = useState<"questionnaire" | "routine">(
    "questionnaire",
  );
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionnaireData, setQuestionnaireData] =
    useState<MorningQuestionnaireData | null>(null);

  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("hydration") || activityLower.includes("water"))
      return <Droplets className="h-5 w-5 text-blue-500" />;
    if (activityLower.includes("coffee") || activityLower.includes("caffeine"))
      return <Coffee className="h-5 w-5 text-orange-500" />;
    if (activityLower.includes("phone") || activityLower.includes("device"))
      return <Smartphone className="h-5 w-5 text-gray-500" />;
    if (
      activityLower.includes("read") ||
      activityLower.includes("news") ||
      activityLower.includes("book")
    )
      return <Book className="h-5 w-5 text-indigo-500" />;
    if (
      activityLower.includes("exercise") ||
      activityLower.includes("stretch") ||
      activityLower.includes("movement")
    )
      return <Dumbbell className="h-5 w-5 text-green-500" />;
    if (activityLower.includes("shower") || activityLower.includes("hygiene"))
      return <Bath className="h-5 w-5 text-blue-400" />;
    if (
      activityLower.includes("meditation") ||
      activityLower.includes("mindful")
    )
      return <Brain className="h-5 w-5 text-purple-500" />;
    if (activityLower.includes("music") || activityLower.includes("podcast"))
      return <Music className="h-5 w-5 text-pink-500" />;
    if (
      activityLower.includes("planning") ||
      activityLower.includes("organize")
    )
      return <Target className="h-5 w-5 text-purple-600" />;
    if (activityLower.includes("breathing") || activityLower.includes("breath"))
      return <Wind className="h-5 w-5 text-cyan-500" />;
    if (
      activityLower.includes("energy") ||
      activityLower.includes("activation")
    )
      return <Zap className="h-5 w-5 text-yellow-500" />;
    if (
      activityLower.includes("breakfast") ||
      activityLower.includes("nutrition")
    )
      return <Heart className="h-5 w-5 text-red-500" />;
    if (activityLower.includes("sunlight") || activityLower.includes("light"))
      return <Sun className="h-5 w-5 text-yellow-600" />;
    if (activityLower.includes("wake") || activityLower.includes("morning"))
      return <Sunrise className="h-5 w-5 text-orange-600" />;
    return <Clock className="h-5 w-5 text-gray-600" />;
  };

  const handleQuestionnaireComplete = async (
    data: MorningQuestionnaireData,
  ) => {
    setIsGenerating(true);
    setStep("routine");
    setQuestionnaireData(data);

    try {
      const response = await fetch("/api/morning-routine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.data.routine) {
        // Convert AI response to routine items with icons
        const routineItems: RoutineItem[] = result.data.routine.map(
          (item: any) => ({
            ...item,
            icon: getActivityIcon(item.activity),
          }),
        );
        setRoutine(routineItems);

        // Save routine to Firebase if user is logged in
        if (user && data) {
          try {
            await saveMorningRoutine({
              userId: user.id,
              title: `Morning Routine - ${new Date().toLocaleDateString()}`,
              routine: routineItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: data,
              isActive: true,
            });
            console.log("Morning routine saved to Firebase successfully");
            onRoutineCreated?.();
          } catch (error) {
            console.error("Error saving morning routine to Firebase:", error);
          }
        }
      } else {
        // Fallback routine if AI fails
        const fallbackRoutineItems = generateFallbackRoutine(data);
        setRoutine(fallbackRoutineItems);

        // Save fallback routine to Firebase if user is logged in
        if (user && data) {
          try {
            await saveMorningRoutine({
              userId: user.id,
              title: `Morning Routine - ${new Date().toLocaleDateString()}`,
              routine: fallbackRoutineItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: data,
              isActive: true,
            });
            console.log(
              "Fallback morning routine saved to Firebase successfully",
            );
            onRoutineCreated?.();
          } catch (error) {
            console.error(
              "Error saving fallback morning routine to Firebase:",
              error,
            );
          }
        }
      }
    } catch (error) {
      console.error("Error generating morning routine:", error);
      // Use fallback routine on error
      const errorRoutine = generateSimpleRoutine(data);
      setRoutine(errorRoutine);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackRoutine = (
    data: MorningQuestionnaireData,
  ): RoutineItem[] => {
    const wakeTime = data.wakeUpTime || "6:30";
    const [hours, minutes] = wakeTime.split(":").map(Number);

    const addMinutes = (time: string, minutesToAdd: number): string => {
      const [h, m] = time.split(":").map(Number);
      const totalMinutes = h * 60 + m + minutesToAdd;
      const newHours = Math.floor(totalMinutes / 60) % 24;
      const newMinutes = totalMinutes % 60;
      return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
    };

    const baseRoutine = [
      {
        time: wakeTime,
        activity: "Gentle awakening",
        description:
          "Wake up naturally and take a moment to set a positive intention for your day",
        category: "preparation" as const,
        icon: <Sunrise className="h-5 w-5 text-orange-600" />,
      },
      {
        time: addMinutes(wakeTime, 5),
        activity: "Morning hydration",
        description:
          "Drink 16-20oz of room temperature water to rehydrate your body after sleep",
        category: "wellness" as const,
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
      },
    ];

    // Add activities based on available time
    if (data.availableTime === "15-30min") {
      baseRoutine.push(
        {
          time: addMinutes(wakeTime, 10),
          activity: "Quick stretch",
          description:
            "Do 5-10 minutes of gentle stretching to activate your body",
          category: "wellness" as const,
          icon: <Dumbbell className="h-5 w-5 text-green-500" />,
        },
        {
          time: addMinutes(wakeTime, 20),
          activity: "Morning preparation",
          description:
            "Complete your essential morning hygiene and get ready for the day",
          category: "preparation" as const,
          icon: <Bath className="h-5 w-5 text-blue-400" />,
        },
      );
    } else if (data.availableTime === "30-60min") {
      baseRoutine.push(
        {
          time: addMinutes(wakeTime, 10),
          activity: "Dynamic morning stretch",
          description:
            "10-15 minutes of energizing movement to wake up your body",
          category: "wellness" as const,
          icon: <Dumbbell className="h-5 w-5 text-green-500" />,
        },
        {
          time: addMinutes(wakeTime, 25),
          activity: "Mindful morning meditation",
          description: "5-10 minutes of meditation or mindfulness practice",
          category: "wellness" as const,
          icon: <Brain className="h-5 w-5 text-purple-500" />,
        },
        {
          time: addMinutes(wakeTime, 35),
          activity: "Power planning session",
          description: "Plan your day and set your top 3 priorities",
          category: "productivity" as const,
          icon: <Target className="h-5 w-5 text-purple-600" />,
        },
        {
          time: addMinutes(wakeTime, 45),
          activity: "Morning preparation",
          description: "Complete your morning hygiene and get ready",
          category: "preparation" as const,
          icon: <Bath className="h-5 w-5 text-blue-400" />,
        },
      );
    } else {
      // 60+ minutes - comprehensive routine
      baseRoutine.push(
        {
          time: addMinutes(wakeTime, 10),
          activity: "Energizing breathwork",
          description:
            "5 minutes of breathing exercises to activate your nervous system",
          category: "energy" as const,
          icon: <Wind className="h-5 w-5 text-cyan-500" />,
        },
        {
          time: addMinutes(wakeTime, 15),
          activity: "Dynamic morning stretch",
          description: "15-20 minutes of comprehensive stretching and movement",
          category: "wellness" as const,
          icon: <Dumbbell className="h-5 w-5 text-green-500" />,
        },
        {
          time: addMinutes(wakeTime, 35),
          activity: "Mindful morning meditation",
          description: "10-15 minutes of meditation or mindfulness practice",
          category: "wellness" as const,
          icon: <Brain className="h-5 w-5 text-purple-500" />,
        },
        {
          time: addMinutes(wakeTime, 50),
          activity: "Power planning session",
          description: "15 minutes of day planning and intention setting",
          category: "productivity" as const,
          icon: <Target className="h-5 w-5 text-purple-600" />,
        },
        {
          time: addMinutes(wakeTime, 65),
          activity: "Strategic coffee timing",
          description:
            "Enjoy your first cup of coffee mindfully after optimal cortisol timing",
          category: "energy" as const,
          icon: <Coffee className="h-5 w-5 text-orange-500" />,
        },
        {
          time: addMinutes(wakeTime, 75),
          activity: "Energizing breakfast prep",
          description: "Prepare and enjoy a nutritious, balanced breakfast",
          category: "wellness" as const,
          icon: <Heart className="h-5 w-5 text-red-500" />,
        },
      );
    }

    return baseRoutine;
  };

  const generateSimpleRoutine = (
    data: MorningQuestionnaireData,
  ): RoutineItem[] => {
    const wakeTime = data.wakeUpTime || "7:00";
    return [
      {
        time: wakeTime,
        activity: "Wake up naturally",
        description: "Start your day with intention and positivity",
        category: "preparation" as const,
        icon: <Sunrise className="h-5 w-5 text-orange-600" />,
      },
      {
        time: "7:10",
        activity: "Morning hydration",
        description: "Drink water to rehydrate your body",
        category: "wellness" as const,
        icon: <Droplets className="h-5 w-5 text-blue-500" />,
      },
      {
        time: "7:20",
        activity: "Gentle movement",
        description: "Light stretching or movement to energize your body",
        category: "energy" as const,
        icon: <Activity className="h-5 w-5 text-green-500" />,
      },
      {
        time: "7:35",
        activity: "Morning preparation",
        description: "Get ready for your day with intention",
        category: "preparation" as const,
        icon: <Clock className="h-5 w-5 text-gray-600" />,
      },
    ];
  };

  if (step === "questionnaire") {
    return <MorningQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  return (
    <MorningRoutinePreview
      routine={routine}
      isGenerating={isGenerating}
      onGoToDashboard={onRoutineCreated}
    />
  );
}
