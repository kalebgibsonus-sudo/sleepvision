import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  User,
  Bed,
  Coffee,
  Smartphone,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface SleepQuestionnaireData {
  age: string;
  sleepGoal: string;
  currentBedtime: string;
  currentWakeTime: string;
  desiredBedtime: string;
  desiredWakeTime: string;
  sleepQuality: string;
  sleepIssues: string[];
  lifestyle: string;
  workSchedule: string;
  caffeine: string;
  screenTime: string;
  environment: string;
  stressLevel: string;
  exerciseHabits: string;
  additionalInfo: string;
}

interface SleepQuestionnaireProps {
  onComplete: (data: SleepQuestionnaireData) => void;
}

export function SleepQuestionnaire({ onComplete }: SleepQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SleepQuestionnaireData>({
    age: "",
    sleepGoal: "",
    currentBedtime: "",
    currentWakeTime: "",
    desiredBedtime: "",
    desiredWakeTime: "",
    sleepQuality: "",
    sleepIssues: [],
    lifestyle: "",
    workSchedule: "",
    caffeine: "",
    screenTime: "",
    environment: "",
    stressLevel: "",
    exerciseHabits: "",
    additionalInfo: "",
  });

  const totalSteps = 8;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Remove all scroll management - let the page behave naturally

  const updateFormData = (
    field: keyof SleepQuestionnaireData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate sleep duration between two times
  const calculateSleepDuration = (
    bedtime: string,
    wakeTime: string,
  ): number => {
    if (!bedtime || !wakeTime) return 0;

    const [bedHour, bedMin] = bedtime.split(":").map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(":").map(Number);

    // Convert to minutes since midnight
    let bedMinutes = bedHour * 60 + bedMin;
    let wakeMinutes = wakeHour * 60 + wakeMin;

    // If wake time is earlier than bedtime, it means next day
    if (wakeMinutes <= bedMinutes) {
      wakeMinutes += 24 * 60; // Add 24 hours
    }

    const durationMinutes = wakeMinutes - bedMinutes;
    return durationMinutes / 60; // Convert to hours
  };

  // Memoize sleep duration validation to prevent excessive re-calculations
  const sleepDurationValidation = useMemo(() => {
    const duration = calculateSleepDuration(
      formData.desiredBedtime,
      formData.desiredWakeTime,
    );

    if (!formData.desiredBedtime || !formData.desiredWakeTime) {
      return { isValid: true, message: "", duration: 0 };
    }

    const isValid = duration >= 7 && duration <= 8;
    let message = "";

    if (duration < 7) {
      message = `⚠️ Current schedule gives only ${duration.toFixed(1)} hours of sleep. We recommend 7-8 hours for optimal health.`;
    } else if (duration > 8) {
      message = `⚠️ Current schedule gives ${duration.toFixed(1)} hours of sleep. Consider adjusting for 7-8 hours.`;
    } else {
      message = `✅ Perfect! Your schedule allows for ${duration.toFixed(1)} hours of sleep.`;
    }

    return { isValid, message, duration };
  }, [formData.desiredBedtime, formData.desiredWakeTime]);

  const handleSleepIssuesChange = (issue: string, checked: boolean) => {
    const currentIssues = formData.sleepIssues;
    if (checked) {
      updateFormData("sleepIssues", [...currentIssues, issue]);
    } else {
      updateFormData(
        "sleepIssues",
        currentIssues.filter((i) => i !== issue),
      );
    }
  };

  const nextStep = () => {
    console.log(
      "NextStep called, currentStep:",
      currentStep,
      "canProceed:",
      canProceed,
    );
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    console.log("PrevStep called, currentStep:", currentStep);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const questions = [
    {
      title: "Tell us about yourself",
      icon: <User className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label
              htmlFor="age"
              className="text-lg font-semibold mb-4 block text-gray-900"
            >
              Age range?
            </Label>
            <RadioGroup
              value={formData.age}
              onValueChange={(value) => updateFormData("age", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="18-25" id="age1" />
                <label htmlFor="age1" className="text-gray-800 font-medium">
                  18-25
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="26-35" id="age2" />
                <label htmlFor="age2" className="text-gray-800 font-medium">
                  26-35
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="36-45" id="age3" />
                <label htmlFor="age3" className="text-gray-800 font-medium">
                  36-45
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="46-55" id="age4" />
                <label htmlFor="age4" className="text-gray-800 font-medium">
                  46-55
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="56+" id="age5" />
                <label htmlFor="age5" className="text-gray-800 font-medium">
                  56+
                </label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Sleep goal per night?
            </Label>
            <RadioGroup
              value={formData.sleepGoal}
              onValueChange={(value) => updateFormData("sleepGoal", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="6-7" id="goal1" />
                <label htmlFor="goal1" className="text-gray-800 font-medium">
                  6-7 hours
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="7-8" id="goal2" />
                <label htmlFor="goal2" className="text-gray-800 font-medium">
                  7-8 hours
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="8-9" id="goal3" />
                <label htmlFor="goal3" className="text-gray-800 font-medium">
                  8-9 hours
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="9+" id="goal4" />
                <label htmlFor="goal4" className="text-gray-800 font-medium">
                  9+ hours
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Current Sleep Schedule",
      icon: <Clock className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label
              htmlFor="bedtime"
              className="text-lg font-semibold mb-4 block text-gray-900"
            >
              Current bedtime?
            </Label>
            <Input
              id="bedtime"
              type="time"
              value={formData.currentBedtime}
              onChange={(e) => updateFormData("currentBedtime", e.target.value)}
              className="text-xl p-4 text-gray-900 bg-white border-gray-300"
            />
          </div>

          <div>
            <Label
              htmlFor="waketime"
              className="text-lg font-semibold mb-4 block text-gray-900"
            >
              Current wake time?
            </Label>
            <Input
              id="waketime"
              type="time"
              value={formData.currentWakeTime}
              onChange={(e) =>
                updateFormData("currentWakeTime", e.target.value)
              }
              className="text-xl p-4 text-gray-900 bg-white border-gray-300"
            />
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4">
              🎯 Your Goal Schedule
            </h3>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="desired-bedtime"
                  className="text-lg font-semibold mb-2 block text-gray-900"
                >
                  Goal bedtime? 🌙
                </Label>
                <Input
                  id="desired-bedtime"
                  type="time"
                  value={formData.desiredBedtime}
                  onChange={(e) =>
                    updateFormData("desiredBedtime", e.target.value)
                  }
                  className="text-xl p-4 text-gray-900 bg-white border-gray-300"
                />
              </div>

              <div>
                <Label
                  htmlFor="desired-waketime"
                  className="text-lg font-semibold mb-2 block text-gray-900"
                >
                  Goal wake time? ☀️
                </Label>
                <Input
                  id="desired-waketime"
                  type="time"
                  value={formData.desiredWakeTime}
                  onChange={(e) =>
                    updateFormData("desiredWakeTime", e.target.value)
                  }
                  className="text-xl p-4 text-gray-900 bg-white border-gray-300"
                />
              </div>
            </div>

            {/* Sleep Duration Validation */}
            {formData.desiredBedtime && formData.desiredWakeTime && (
              <div
                className={`p-4 rounded-lg border-2 mt-4 ${
                  sleepDurationValidation.isValid
                    ? "bg-green-50 border-green-300"
                    : "bg-orange-50 border-orange-300"
                }`}
              >
                <p
                  className={`font-medium ${
                    sleepDurationValidation.isValid
                      ? "text-green-800"
                      : "text-orange-800"
                  }`}
                >
                  {sleepDurationValidation.message}
                </p>
                {!sleepDurationValidation.isValid && (
                  <p className="text-orange-700 text-sm mt-2">
                    💤 Adjust your bedtime or wake time to get 7-8 hours of
                    sleep for better health and energy.
                  </p>
                )}
              </div>
            )}

            <p className="text-blue-700 text-sm mt-3">
              💡 We'll create your schedule based on your goal times, not your
              current times
            </p>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Sleep quality rating?
            </Label>
            <RadioGroup
              value={formData.sleepQuality}
              onValueChange={(value) => updateFormData("sleepQuality", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="excellent" id="quality1" />
                <label htmlFor="quality1" className="text-gray-800 font-medium">
                  😴 Excellent - I wake up refreshed
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="good" id="quality2" />
                <label htmlFor="quality2" className="text-gray-800 font-medium">
                  😊 Good - Generally well-rested
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="fair" id="quality3" />
                <label htmlFor="quality3" className="text-gray-800 font-medium">
                  😐 Fair - Some good nights, some bad
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="poor" id="quality4" />
                <label htmlFor="quality4" className="text-gray-800 font-medium">
                  😫 Poor - Often tired and groggy
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Sleep Challenges",
      icon: <Bed className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <Label className="text-lg font-semibold mb-6 block text-gray-900">
            Sleep issues? (Select all)
          </Label>
          <div className="space-y-4">
            {[
              "Difficulty falling asleep",
              "Waking up frequently during the night",
              "Waking up too early",
              "Feeling tired despite adequate sleep",
              "Restless leg syndrome",
              "Snoring or sleep apnea",
              "Nightmares or vivid dreams",
              "Racing thoughts at bedtime",
              "None of the above",
            ].map((issue) => (
              <div key={issue} className="flex items-center space-x-3">
                <Checkbox
                  id={issue}
                  checked={formData.sleepIssues.includes(issue)}
                  onCheckedChange={(checked) =>
                    handleSleepIssuesChange(issue, checked as boolean)
                  }
                />
                <label htmlFor={issue} className="text-gray-800 font-medium">
                  {issue}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Lifestyle & Work",
      icon: <Coffee className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Lifestyle?
            </Label>
            <RadioGroup
              value={formData.lifestyle}
              onValueChange={(value) => updateFormData("lifestyle", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="very-active" id="lifestyle1" />
                <label
                  htmlFor="lifestyle1"
                  className="text-gray-800 font-medium"
                >
                  Very active - Regular exercise, busy schedule
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="moderately-active" id="lifestyle2" />
                <label
                  htmlFor="lifestyle2"
                  className="text-gray-800 font-medium"
                >
                  Moderately active - Some exercise, balanced routine
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="sedentary" id="lifestyle3" />
                <label
                  htmlFor="lifestyle3"
                  className="text-gray-800 font-medium"
                >
                  Sedentary - Mostly desk work, limited exercise
                </label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Work schedule?
            </Label>
            <RadioGroup
              value={formData.workSchedule}
              onValueChange={(value) => updateFormData("workSchedule", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="9-5" id="work1" />
                <label htmlFor="work1" className="text-gray-800 font-medium">
                  Regular 9-5 schedule
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="shift" id="work2" />
                <label htmlFor="work2" className="text-gray-800 font-medium">
                  Shift work or irregular hours
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="flexible" id="work3" />
                <label htmlFor="work3" className="text-gray-800 font-medium">
                  Flexible/remote work
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="student" id="work4" />
                <label htmlFor="work4" className="text-gray-800 font-medium">
                  Student
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="retired" id="work5" />
                <label htmlFor="work5" className="text-gray-800 font-medium">
                  Retired or no set schedule
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Daily Habits",
      icon: <Coffee className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Daily caffeine?
            </Label>
            <RadioGroup
              value={formData.caffeine}
              onValueChange={(value) => updateFormData("caffeine", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="none" id="caffeine1" />
                <label
                  htmlFor="caffeine1"
                  className="text-gray-800 font-medium"
                >
                  None
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1-2-cups" id="caffeine2" />
                <label
                  htmlFor="caffeine2"
                  className="text-gray-800 font-medium"
                >
                  1-2 cups of coffee/tea
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="3-4-cups" id="caffeine3" />
                <label
                  htmlFor="caffeine3"
                  className="text-gray-800 font-medium"
                >
                  3-4 cups of coffee/tea
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="high" id="caffeine4" />
                <label
                  htmlFor="caffeine4"
                  className="text-gray-800 font-medium"
                >
                  High consumption (5+ cups or energy drinks)
                </label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Screen cutoff time?
            </Label>
            <RadioGroup
              value={formData.screenTime}
              onValueChange={(value) => updateFormData("screenTime", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="2+hours" id="screen1" />
                <label htmlFor="screen1" className="text-gray-800 font-medium">
                  2+ hours before bed
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="1hour" id="screen2" />
                <label htmlFor="screen2" className="text-gray-800 font-medium">
                  About 1 hour before bed
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="30min" id="screen3" />
                <label htmlFor="screen3" className="text-gray-800 font-medium">
                  30 minutes before bed
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="right-before" id="screen4" />
                <label htmlFor="screen4" className="text-gray-800 font-medium">
                  Right before sleep or in bed
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Sleep Environment",
      icon: <Bed className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Sleep environment?
            </Label>
            <RadioGroup
              value={formData.environment}
              onValueChange={(value) => updateFormData("environment", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="optimal" id="env1" />
                <label htmlFor="env1" className="text-gray-800 font-medium">
                  Dark, quiet, and cool
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="mostly-good" id="env2" />
                <label htmlFor="env2" className="text-gray-800 font-medium">
                  Mostly good with minor issues
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="some-issues" id="env3" />
                <label htmlFor="env3" className="text-gray-800 font-medium">
                  Some light/noise disturbances
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="poor" id="env4" />
                <label htmlFor="env4" className="text-gray-800 font-medium">
                  Bright, noisy, or uncomfortable temperature
                </label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Stress level?
            </Label>
            <RadioGroup
              value={formData.stressLevel}
              onValueChange={(value) => updateFormData("stressLevel", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="low" id="stress1" />
                <label htmlFor="stress1" className="text-gray-800 font-medium">
                  Low - Generally relaxed and calm
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="moderate" id="stress2" />
                <label htmlFor="stress2" className="text-gray-800 font-medium">
                  Moderate - Some daily stress but manageable
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="high" id="stress3" />
                <label htmlFor="stress3" className="text-gray-800 font-medium">
                  High - Often stressed or anxious
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="very-high" id="stress4" />
                <label htmlFor="stress4" className="text-gray-800 font-medium">
                  Very high - Chronic stress affecting daily life
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Exercise & Physical Activity",
      icon: <User className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label className="text-lg font-semibold mb-4 block text-gray-900">
              Exercise timing?
            </Label>
            <RadioGroup
              value={formData.exerciseHabits}
              onValueChange={(value) => updateFormData("exerciseHabits", value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="morning" id="exercise1" />
                <label
                  htmlFor="exercise1"
                  className="text-gray-800 font-medium"
                >
                  Morning (before 10 AM)
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="afternoon" id="exercise2" />
                <label
                  htmlFor="exercise2"
                  className="text-gray-800 font-medium"
                >
                  Afternoon (10 AM - 4 PM)
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="evening" id="exercise3" />
                <label
                  htmlFor="exercise3"
                  className="text-gray-800 font-medium"
                >
                  Evening (4 PM - 8 PM)
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="late-evening" id="exercise4" />
                <label
                  htmlFor="exercise4"
                  className="text-gray-800 font-medium"
                >
                  Late evening (after 8 PM)
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="rarely" id="exercise5" />
                <label
                  htmlFor="exercise5"
                  className="text-gray-800 font-medium"
                >
                  I rarely exercise
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      ),
    },
    {
      title: "Additional Information",
      icon: <Smartphone className="h-6 w-6" />,
      content: (
        <div className="space-y-8">
          <div>
            <Label
              htmlFor="additional"
              className="text-lg font-semibold mb-4 block text-gray-900"
            >
              Additional sleep factors?
            </Label>
            <Textarea
              id="additional"
              placeholder="Optional: Share any additional information that might help us create your personalized sleep plan..."
              value={formData.additionalInfo}
              onChange={(e) => updateFormData("additionalInfo", e.target.value)}
              className="min-h-[120px] text-gray-900 bg-white border-gray-300 placeholder-gray-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <p className="text-blue-800 font-medium">
              🔒 Your information is secure and will only be used to create your
              personalized sleep schedule.
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentQuestion = questions[currentStep];

  // Check what's needed for each step
  const step0Valid = formData.age && formData.sleepGoal;
  const step1Valid =
    formData.currentBedtime &&
    formData.currentWakeTime &&
    formData.desiredBedtime &&
    formData.desiredWakeTime &&
    formData.sleepQuality &&
    sleepDurationValidation.isValid;

  const canProceed =
    currentStep === questions.length - 1 ||
    (currentStep === 0 && step0Valid) ||
    (currentStep === 1 && step1Valid) ||
    (currentStep === 2 && formData.sleepIssues.length > 0) ||
    (currentStep === 3 && formData.lifestyle && formData.workSchedule) ||
    (currentStep === 4 && formData.caffeine && formData.screenTime) ||
    (currentStep === 5 && formData.environment && formData.stressLevel) ||
    (currentStep === 6 && formData.exerciseHabits) ||
    currentStep === 7;

  return (
    <Card
      ref={containerRef}
      key="sleep-questionnaire"
      className="w-full max-w-4xl mx-auto bg-white shadow-2xl border border-gray-200"
    >
      <CardHeader className="text-center bg-gradient-to-b from-blue-50 to-white border-b border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full border border-blue-200">
            <div className="text-blue-600">{currentQuestion.icon}</div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Sleep Assessment
          </CardTitle>
        </div>
        <CardDescription className="text-lg text-gray-700">
          Step {currentStep + 1} of {totalSteps}: {currentQuestion.title}
        </CardDescription>
        <div className="mt-6">
          <Progress value={progress} className="h-3 bg-gray-200" />
        </div>
      </CardHeader>

      <CardContent className="p-8 bg-white">
        <div key={`step-${currentStep}`} className="animate-fade-in-up">
          {currentQuestion.content}
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          <span className="text-sm text-gray-500 font-medium">
            {currentStep + 1} / {totalSteps}
          </span>

          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 font-semibold disabled:opacity-50"
            title={
              currentStep === 1 &&
              !sleepDurationValidation.isValid &&
              formData.desiredBedtime &&
              formData.desiredWakeTime
                ? "Please adjust your sleep schedule to 7-8 hours before continuing"
                : ""
            }
          >
            {currentStep === totalSteps - 1 ? "Generate My Schedule" : "Next"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
