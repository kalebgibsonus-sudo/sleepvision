import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Sun,
  Coffee,
  Dumbbell,
  Brain,
  Clock,
  Target,
  ArrowRight,
  ChevronLeft,
  Sunrise,
} from "lucide-react";

export interface MorningQuestionnaireData {
  // Basic Info
  currentWakeUpTime: string;
  desiredWakeUpTime: string;
  morningGoal: string;
  availableTime: string;

  // Energy & Motivation
  morningEnergyLevel: string;
  motivationStyle: string;
  morningMood: string;

  // Activities & Preferences
  currentMorningActivities: string[];
  exercisePreference: string;
  caffeineHabits: string;

  // Work & Lifestyle
  workStartTime: string;
  morningCommute: string;
  weekendDifference: string;

  // Goals & Challenges
  morningChallenges: string[];
  productivityGoals: string[];
  wellnessGoals: string[];

  // Environment
  morningEnvironment: string;
  seasonalPreferences: string;

  additionalInfo: string;
}

interface MorningQuestionnaireProps {
  onComplete: (data: MorningQuestionnaireData) => void;
}

export function MorningQuestionnaire({
  onComplete,
}: MorningQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const scrollPositionRef = useRef<number>(0);
  const isStepChangingRef = useRef<boolean>(false);
  const [formData, setFormData] = useState<MorningQuestionnaireData>({
    currentWakeUpTime: "",
    desiredWakeUpTime: "",
    morningGoal: "",
    availableTime: "",
    morningEnergyLevel: "",
    motivationStyle: "",
    morningMood: "",
    currentMorningActivities: [],
    exercisePreference: "",
    caffeineHabits: "",
    workStartTime: "",
    morningCommute: "",
    weekendDifference: "",
    morningChallenges: [],
    productivityGoals: [],
    wellnessGoals: [],
    morningEnvironment: "",
    seasonalPreferences: "",
    additionalInfo: "",
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Monitor scroll position continuously
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionRef.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Restore scroll position only after step changes
  useEffect(() => {
    if (isStepChangingRef.current) {
      const timeoutId = setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
        isStepChangingRef.current = false;
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep]);

  const updateFormData = (
    field: keyof MorningQuestionnaireData,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (
    field: keyof MorningQuestionnaireData,
    value: string,
    checked: boolean,
  ) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      updateFormData(field, [...currentArray, value]);
    } else {
      updateFormData(
        field,
        currentArray.filter((item) => item !== value),
      );
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      // Capture current scroll position before step change
      isStepChangingRef.current = true;
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // Capture current scroll position before step change
      isStepChangingRef.current = true;
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return (
          formData.currentWakeUpTime &&
          formData.desiredWakeUpTime &&
          formData.morningGoal &&
          formData.availableTime
        );
      case 1:
        return (
          formData.morningEnergyLevel &&
          formData.motivationStyle &&
          formData.morningMood
        );
      case 2:
        return formData.exercisePreference && formData.caffeineHabits;
      case 3:
        return formData.workStartTime && formData.morningCommute;
      case 4:
        return (
          formData.morningChallenges.length > 0 ||
          formData.productivityGoals.length > 0
        );
      case 5:
        return formData.morningEnvironment;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sunrise className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Morning Basics
              </h2>
              <p className="text-gray-600">
                Let's start with your current morning routine
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="currentWakeUpTime"
                  className="text-base font-semibold text-gray-900"
                >
                  Current wake time? ⏰
                </Label>
                <Input
                  id="currentWakeUpTime"
                  type="time"
                  value={formData.currentWakeUpTime}
                  onChange={(e) =>
                    updateFormData("currentWakeUpTime", e.target.value)
                  }
                  className="mt-2 text-gray-900 bg-white border-gray-300"
                />
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <Label
                  htmlFor="desiredWakeUpTime"
                  className="text-base font-semibold text-orange-900"
                >
                  Goal wake time? 🎯
                </Label>
                <Input
                  id="desiredWakeUpTime"
                  type="time"
                  value={formData.desiredWakeUpTime}
                  onChange={(e) =>
                    updateFormData("desiredWakeUpTime", e.target.value)
                  }
                  className="mt-2 text-gray-900 bg-white border-gray-300"
                />
                <p className="text-orange-700 text-sm mt-2">
                  💡 We'll build your routine around your goal wake time
                </p>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Main morning goal? 🎯
                </Label>
                <RadioGroup
                  value={formData.morningGoal}
                  onValueChange={(value) =>
                    updateFormData("morningGoal", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="energy" id="energy" />
                    <Label htmlFor="energy" className="text-gray-800">
                      Boost energy and motivation
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="productivity" id="productivity" />
                    <Label htmlFor="productivity" className="text-gray-800">
                      Maximize productivity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="wellness" id="wellness" />
                    <Label htmlFor="wellness" className="text-gray-800">
                      Focus on health and wellness
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="peace" id="peace" />
                    <Label htmlFor="peace" className="text-gray-800">
                      Create a peaceful, mindful start
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="efficiency" id="efficiency" />
                    <Label htmlFor="efficiency" className="text-gray-800">
                      Get ready quickly and efficiently
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Available routine time? ⏱️
                </Label>
                <RadioGroup
                  value={formData.availableTime}
                  onValueChange={(value) =>
                    updateFormData("availableTime", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="15-30min" id="time1" />
                    <Label htmlFor="time1" className="text-gray-800">
                      15-30 minutes (Quick routine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="30-60min" id="time2" />
                    <Label htmlFor="time2" className="text-gray-800">
                      30-60 minutes (Balanced routine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="60-90min" id="time3" />
                    <Label htmlFor="time3" className="text-gray-800">
                      60-90 minutes (Comprehensive routine)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="90min+" id="time4" />
                    <Label htmlFor="time4" className="text-gray-800">
                      90+ minutes (Luxurious routine)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Energy & Motivation
              </h2>
              <p className="text-gray-600">
                Tell us about your morning energy patterns
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  How do you feel waking up? 🌅
                </Label>
                <RadioGroup
                  value={formData.morningEnergyLevel}
                  onValueChange={(value) =>
                    updateFormData("morningEnergyLevel", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="high" id="energy-high" />
                    <Label htmlFor="energy-high" className="text-gray-800">
                      Energetic and ready to go
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="medium" id="energy-medium" />
                    <Label htmlFor="energy-medium" className="text-gray-800">
                      Moderately alert, need some warm-up
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="low" id="energy-low" />
                    <Label htmlFor="energy-low" className="text-gray-800">
                      Groggy and need time to wake up
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="variable" id="energy-variable" />
                    <Label htmlFor="energy-variable" className="text-gray-800">
                      It varies day to day
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Morning motivation? 💪
                </Label>
                <RadioGroup
                  value={formData.motivationStyle}
                  onValueChange={(value) =>
                    updateFormData("motivationStyle", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="achievement" id="mot-achievement" />
                    <Label htmlFor="mot-achievement" className="text-gray-800">
                      Completing tasks and goals
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="routine" id="mot-routine" />
                    <Label htmlFor="mot-routine" className="text-gray-800">
                      Following a consistent routine
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="inspiration" id="mot-inspiration" />
                    <Label htmlFor="mot-inspiration" className="text-gray-800">
                      Inspiring content (podcasts, quotes, etc.)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="connection" id="mot-connection" />
                    <Label htmlFor="mot-connection" className="text-gray-800">
                      Connecting with others
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="learning" id="mot-learning" />
                    <Label htmlFor="mot-learning" className="text-gray-800">
                      Learning something new
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Ideal morning mood? 😊
                </Label>
                <RadioGroup
                  value={formData.morningMood}
                  onValueChange={(value) =>
                    updateFormData("morningMood", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="energetic" id="mood-energetic" />
                    <Label htmlFor="mood-energetic" className="text-gray-800">
                      Energetic and dynamic
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="calm" id="mood-calm" />
                    <Label htmlFor="mood-calm" className="text-gray-800">
                      Calm and centered
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="focused" id="mood-focused" />
                    <Label htmlFor="mood-focused" className="text-gray-800">
                      Focused and determined
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="joyful" id="mood-joyful" />
                    <Label htmlFor="mood-joyful" className="text-gray-800">
                      Joyful and optimistic
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Activities & Habits
              </h2>
              <p className="text-gray-600">
                Let's understand your preferences and current habits
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Current morning activities? (Select all) ✅
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Check phone/emails",
                    "Shower",
                    "Exercise/stretch",
                    "Meditate",
                    "Read news",
                    "Make bed",
                    "Prepare breakfast",
                    "Listen to music/podcasts",
                    "Journal/plan day",
                    "Skincare routine",
                    "Watch TV",
                    "Walk outside",
                  ].map((activity) => (
                    <div key={activity} className="flex items-center space-x-2">
                      <Checkbox
                        id={activity}
                        checked={formData.currentMorningActivities.includes(
                          activity,
                        )}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "currentMorningActivities",
                            activity,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={activity}
                        className="text-sm text-gray-800"
                      >
                        {activity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Morning exercise preference? 🏃‍♂️
                </Label>
                <RadioGroup
                  value={formData.exercisePreference}
                  onValueChange={(value) =>
                    updateFormData("exercisePreference", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="high-intensity" id="ex-high" />
                    <Label htmlFor="ex-high" className="text-gray-800">
                      High-intensity workout (HIIT, running)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="moderate" id="ex-moderate" />
                    <Label htmlFor="ex-moderate" className="text-gray-800">
                      Moderate exercise (yoga, walking)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="gentle" id="ex-gentle" />
                    <Label htmlFor="ex-gentle" className="text-gray-800">
                      Gentle movement (stretching, breathing)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="none" id="ex-none" />
                    <Label htmlFor="ex-none" className="text-gray-800">
                      Prefer no morning exercise
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Morning caffeine? ☕
                </Label>
                <RadioGroup
                  value={formData.caffeineHabits}
                  onValueChange={(value) =>
                    updateFormData("caffeineHabits", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="immediate" id="caff-immediate" />
                    <Label htmlFor="caff-immediate" className="text-gray-800">
                      Need coffee/tea immediately upon waking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="after-activity" id="caff-after" />
                    <Label htmlFor="caff-after" className="text-gray-800">
                      Prefer caffeine after some morning activity
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="minimal" id="caff-minimal" />
                    <Label htmlFor="caff-minimal" className="text-gray-800">
                      Light caffeine or decaf
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="none" id="caff-none" />
                    <Label htmlFor="caff-none" className="text-gray-800">
                      No caffeine
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Work & Schedule
              </h2>
              <p className="text-gray-600">
                Help us understand your work schedule and constraints
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label
                  htmlFor="workStartTime"
                  className="text-base font-semibold text-gray-900"
                >
                  Work/school start time? 💼
                </Label>
                <Input
                  id="workStartTime"
                  type="time"
                  value={formData.workStartTime}
                  onChange={(e) =>
                    updateFormData("workStartTime", e.target.value)
                  }
                  className="mt-2 text-gray-900 bg-white border-gray-300"
                />
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Commute/prep time? 🚗
                </Label>
                <RadioGroup
                  value={formData.morningCommute}
                  onValueChange={(value) =>
                    updateFormData("morningCommute", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="none" id="commute-none" />
                    <Label htmlFor="commute-none" className="text-gray-800">
                      Work from home (no commute)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="15min" id="commute-15" />
                    <Label htmlFor="commute-15" className="text-gray-800">
                      15 minutes or less
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="15-30min" id="commute-30" />
                    <Label htmlFor="commute-30" className="text-gray-800">
                      15-30 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="30-60min" id="commute-60" />
                    <Label htmlFor="commute-60" className="text-gray-800">
                      30-60 minutes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="60min+" id="commute-long" />
                    <Label htmlFor="commute-long" className="text-gray-800">
                      Over 60 minutes
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Weekend vs weekday difference? 📅
                </Label>
                <RadioGroup
                  value={formData.weekendDifference}
                  onValueChange={(value) =>
                    updateFormData("weekendDifference", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="same" id="weekend-same" />
                    <Label htmlFor="weekend-same" className="text-gray-800">
                      Keep the same routine 7 days a week
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="slightly-different"
                      id="weekend-slight"
                    />
                    <Label htmlFor="weekend-slight" className="text-gray-800">
                      Slightly longer/more relaxed on weekends
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="very-different"
                      id="weekend-different"
                    />
                    <Label
                      htmlFor="weekend-different"
                      className="text-gray-800"
                    >
                      Completely different weekend routine
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="sleep-in" id="weekend-sleep" />
                    <Label htmlFor="weekend-sleep" className="text-gray-800">
                      Sleep in and start later on weekends
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Goals & Challenges
              </h2>
              <p className="text-gray-600">
                What do you want to achieve and overcome?
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Morning challenges? (Select all) 😅
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Hitting snooze too many times",
                    "Feeling rushed or stressed",
                    "Low energy or motivation",
                    "Forgetting important tasks",
                    "Poor time management",
                    "Difficulty waking up",
                    "Procrastination with getting ready",
                    "Skipping breakfast",
                    "Getting distracted by phone/social media",
                    "Inconsistent routine",
                  ].map((challenge) => (
                    <div
                      key={challenge}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={challenge}
                        checked={formData.morningChallenges.includes(challenge)}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "morningChallenges",
                            challenge,
                            checked as boolean,
                          )
                        }
                      />
                      <Label
                        htmlFor={challenge}
                        className="text-sm text-gray-800"
                      >
                        {challenge}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Productivity goals? (Select all) 🎯
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Be more organized and prepared",
                    "Increase focus and mental clarity",
                    "Better time management",
                    "Consistent daily planning",
                    "Improved work performance",
                    "More creative thinking",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.productivityGoals.includes(goal)}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "productivityGoals",
                            goal,
                            checked as boolean,
                          )
                        }
                      />
                      <Label htmlFor={goal} className="text-sm text-gray-800">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Wellness goals? (Select all) 🌱
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Better physical fitness",
                    "Improved mental health",
                    "Stress reduction",
                    "Mindfulness and presence",
                    "Better hydration habits",
                    "Healthier eating in the morning",
                  ].map((goal) => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={goal}
                        checked={formData.wellnessGoals.includes(goal)}
                        onCheckedChange={(checked) =>
                          handleArrayUpdate(
                            "wellnessGoals",
                            goal,
                            checked as boolean,
                          )
                        }
                      />
                      <Label htmlFor={goal} className="text-sm text-gray-800">
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Final Touches
              </h2>
              <p className="text-gray-600">
                A few more details to perfect your routine
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Ideal morning environment? 🏠
                </Label>
                <RadioGroup
                  value={formData.morningEnvironment}
                  onValueChange={(value) =>
                    updateFormData("morningEnvironment", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="quiet-peaceful" id="env-quiet" />
                    <Label htmlFor="env-quiet" className="text-gray-800">
                      Quiet and peaceful
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="energetic-music" id="env-music" />
                    <Label htmlFor="env-music" className="text-gray-800">
                      Energetic with music/podcasts
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="natural-light" id="env-light" />
                    <Label htmlFor="env-light" className="text-gray-800">
                      Bright with natural light
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="social" id="env-social" />
                    <Label htmlFor="env-social" className="text-gray-800">
                      Social with family/roommates
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Seasonal routine changes? 🌸❄️
                </Label>
                <RadioGroup
                  value={formData.seasonalPreferences}
                  onValueChange={(value) =>
                    updateFormData("seasonalPreferences", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="consistent" id="season-consistent" />
                    <Label
                      htmlFor="season-consistent"
                      className="text-gray-800"
                    >
                      Keep the same routine year-round
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="light-variations"
                      id="season-light"
                    />
                    <Label htmlFor="season-light" className="text-gray-800">
                      Light variations based on season
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      value="significant-changes"
                      id="season-changes"
                    />
                    <Label htmlFor="season-changes" className="text-gray-800">
                      Significant seasonal changes
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label
                  htmlFor="additional"
                  className="text-base font-semibold text-gray-900 mb-2 block"
                >
                  Additional info? 💭
                </Label>
                <Textarea
                  id="additional"
                  placeholder="Anything else you'd like us to know about your morning routine preferences, constraints, or goals..."
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    updateFormData("additionalInfo", e.target.value)
                  }
                  className="min-h-[120px] text-gray-900 bg-white border-gray-300 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-2xl border border-gray-200">
      <CardHeader className="text-center bg-gradient-to-b from-orange-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 rounded-full border border-orange-200">
            <Sunrise className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Morning Routine Assessment
          </CardTitle>
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 text-lg">
            Step {currentStep + 1} of {totalSteps}
          </p>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>

      <CardContent className="p-8 bg-white">
        {renderStep()}

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={prevStep}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {currentStep === totalSteps - 1
              ? "Create My Morning Routine"
              : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
