import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSleepData } from "@/hooks/useSleepData";
import { useMemorySystem } from "@/hooks/useMemorySystem";
import { MemoryStatusIndicator } from "@/components/MemoryStatusIndicator";
import GoogleLinkedPaymentStatus from "@/components/GoogleLinkedPaymentStatus";
import SleepJourneyOnboarding from "@/components/SleepJourneyOnboarding";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AICheckIn } from "./AICheckIn";
import { GoalSetting } from "./GoalSetting";
import { SleepRoutinePage } from "./dashboard/SleepRoutinePage";
import { MorningRoutinePage } from "./dashboard/MorningRoutinePage";
import { SleepLogPage } from "./dashboard/SleepLogPage";
import { BreathingPage } from "./dashboard/BreathingPage";
import { RewardsPage } from "./dashboard/RewardsPage";
import { CommunityPage } from "./dashboard/CommunityPage";
import { LucidDreamingPopup } from "./LucidDreamingPopup";
import { LucidDreamTracker } from "./dashboard/LucidDreamTracker";
import { DisciplineBuilderPage } from "./dashboard/DisciplineBuilderPage";
import InteractiveDashboardOnboarding from "./dashboard/InteractiveDashboardOnboarding";
import { TooltipCoachMarks, DASHBOARD_TOOLTIPS } from "./dashboard/TooltipCoachMarks";
import ProgressiveOnboardingManager from "./dashboard/ProgressiveOnboardingManager";
import {
  Home,
  Moon,
  Sun,
  TrendingUp,
  Target,
  BookOpen,
  Settings,
  Flame,
  Star,
  CheckCircle,
  Calendar,
  MessageCircle,
  Sparkles,
  Award,
  Clock,
  BarChart3,
  Gift,
  Zap,
  User,
  Bell,
  Shield,
  Palette,
  Download,
  Upload,
  Trash2,
  LogOut,
  Mail,
  Phone,
  Globe,
  Volume2,
  VolumeX,
  Moon as MoonIcon,
  Sunrise,
  Brain,
  Database,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Menu,
  X,
  Wind,
  Users,
  PlayCircle,
} from "lucide-react";

type NavigationPage =
  | "dashboard"
  | "discipline-builder"
  | "sleep-routine"
  | "morning-routine"
  | "breathing-methods"
  | "community"
  | "progress-tracker"
  | "rewards"
  | "sleep-log"
  | "lucid-dreams"
  | "settings";

interface DashboardStats {
  currentStreak: number;
  totalPoints: number;
  weeklyGoalProgress: number;
  lastNightScore: number;
  sleepGoalAchieved: boolean;
  morningGoalAchieved: boolean;
}

interface NewMainDashboardProps {
  onGoHome?: () => void;
  initialPage?: string;
}

export function NewMainDashboard({
  onGoHome,
  initialPage = "dashboard",
}: NewMainDashboardProps) {
  const {
    user,
    signOut,
    hasAccess,
    shouldShowDashboardOnboarding,
    shouldShowCoachMarks,
    markDashboardOnboardingCompleted,
    markCoachMarksCompleted,
    resetOnboarding,
    getOnboardingProgress
  } = useAuth();

  // CRITICAL SECURITY CHECK: Prevent unauthorized dashboard access
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the dashboard.</p>
          <button
            onClick={onGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // STRICT ACCESS CONTROL: Only paying users (or admin) can access dashboard
  if (!hasAccess("dashboard")) {
    console.log("🚫 Dashboard access denied for user:", {
      email: user?.email,
      subscriptionTier: user?.subscriptionTier,
      hasAccess: hasAccess("dashboard")
    });

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">🚫 Subscription Required</h2>
          <p className="text-gray-600 mb-6">
            You need an active subscription to access the SleepVision dashboard.
          </p>
          <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-100 rounded">
            Current subscription: {user?.subscriptionTier || "none"}
            <br />
            Email: {user?.email}
          </div>
          <button
            onClick={onGoHome}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  const { schedules, entries, getSleepStats } = useSleepData();
  const { getStorageInfo, getSessionData, canPerformAction } =
    useMemorySystem();
  const [currentPage, setCurrentPage] = useState<NavigationPage>(
    initialPage as NavigationPage,
  );
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    currentStreak: 0,
    totalPoints: 0,
    weeklyGoalProgress: 0,
    lastNightScore: 0,
    sleepGoalAchieved: false,
    morningGoalAchieved: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<any>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [lucidDreamingActive, setLucidDreamingActive] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // New Onboarding State
  const [showDashboardOnboarding, setShowDashboardOnboarding] = useState(false);
  const [showCoachMarks, setShowCoachMarks] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingType, setOnboardingType] = useState<"interactive" | "tooltips" | "none">("none");
  const [showProgressiveOnboarding, setShowProgressiveOnboarding] = useState(false);
  const [discoveredFeatures, setDiscoveredFeatures] = useState<string[]>([]);

  // Settings state
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("sleepVisionSettings");
    return saved
      ? JSON.parse(saved)
      : {
          // Profile settings
          displayName: user?.name || "",
          email: user?.email || "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

          // Sleep preferences
          defaultBedtime: "22:00",
          defaultWakeTime: "07:00",
          sleepGoalHours: 8,

          // Notifications
          enableNotifications: true,
          bedtimeReminder: true,
          wakeUpReminder: true,
          checkInReminder: true,
          reminderTime: 30, // minutes before bedtime

          // AI Assistant (Luna)
          lunaPersonality: "encouraging", // encouraging, professional, friendly
          lunaFrequency: "daily", // daily, weekly, custom
          enableLunaInsights: true,

          // App preferences
          theme: "auto", // light, dark, auto
          units: "metric", // metric, imperial
          weekStartsOn: "monday", // monday, sunday

          // Privacy
          dataSharing: false,
          analytics: true,
          crashReports: true,

          // Audio
          enableSounds: true,
          soundVolume: 70,
        };
  });

  const stats = getSleepStats();

  useEffect(() => {
    calculateDashboardStats();
  }, [entries, schedules]);

  // Check if user should see onboarding
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenSleepOnboarding");
    if (user && !hasSeenOnboarding) {
      // Delay onboarding slightly so dashboard renders first
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1500);
    }
  }, [user]);

  // New Dashboard Onboarding Logic
  useEffect(() => {
    if (user && currentPage === "dashboard") {
      // Check if should show dashboard onboarding
      if (shouldShowDashboardOnboarding()) {
        // Delay to ensure dashboard is fully rendered
        setTimeout(() => {
          setOnboardingType("interactive");
          setShowDashboardOnboarding(true);
        }, 2000); // 2 second delay for dashboard to load
      }
      // Check if should show coach marks (after interactive onboarding)
      else if (shouldShowCoachMarks()) {
        setTimeout(() => {
          setOnboardingType("tooltips");
          setShowCoachMarks(true);
        }, 1000);
      }
    }
  }, [user, currentPage, shouldShowDashboardOnboarding, shouldShowCoachMarks]);

  // Admin onboarding reset functionality
  useEffect(() => {
    // Add keyboard shortcut for admin to reset onboarding (Ctrl+Shift+O)
    const handleKeyDown = (event: KeyboardEvent) => {
      if (user?.email === "kalebgibson.us@gmail.com" &&
          event.ctrlKey && event.shiftKey && event.key === 'O') {
        event.preventDefault();
        resetOnboarding();
        setOnboardingType("interactive");
        setShowDashboardOnboarding(true);
        console.log("🚀 Admin: Onboarding reset and restarted!");
      }
    };

    if (user?.email === "kalebgibson.us@gmail.com") {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [user, resetOnboarding]);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem("sleepVisionSettings", JSON.stringify(settings));
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const exportData = () => {
    const data = {
      settings,
      schedules,
      entries,
      checkInResponses: JSON.parse(
        localStorage.getItem("aiCheckInResponses") || "[]",
      ),
      goals: JSON.parse(localStorage.getItem("userGoals") || "[]"),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sleepvision-data-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all your data? This action cannot be undone.",
      )
    ) {
      localStorage.removeItem("aiCheckInResponses");
      localStorage.removeItem("userGoals");
      localStorage.removeItem("sleepVisionSettings");
      window.location.reload();
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasSeenSleepOnboarding", "true");
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("hasSeenSleepOnboarding", "true");
    setShowOnboarding(false);
  };

  // New Dashboard Onboarding Handlers
  const handleDashboardOnboardingComplete = () => {
    markDashboardOnboardingCompleted();
    setShowDashboardOnboarding(false);
    setOnboardingType("none");

    // After completing interactive onboarding, show coach marks
    setTimeout(() => {
      if (shouldShowCoachMarks()) {
        setOnboardingType("tooltips");
        setShowCoachMarks(true);
      }
    }, 1000);
  };

  const handleDashboardOnboardingSkip = () => {
    markDashboardOnboardingCompleted();
    setShowDashboardOnboarding(false);
    setOnboardingType("none");
  };

  const handleCoachMarksComplete = () => {
    markCoachMarksCompleted();
    setShowCoachMarks(false);
    setOnboardingType("none");
  };

  const handleCoachMarksSkip = () => {
    markCoachMarksCompleted();
    setShowCoachMarks(false);
    setOnboardingType("none");
  };

  // Calculate user stats for progressive onboarding
  const getUserStats = () => {
    const signupDate = user?.createdAt ? new Date(user.createdAt.seconds * 1000) : new Date();
    const daysSinceSignup = Math.floor((Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24));

    const checkInResponses = JSON.parse(localStorage.getItem("aiCheckInResponses") || "[]");

    // Get completed features from localStorage and user state
    const localFeatures = JSON.parse(localStorage.getItem("completedFeatures") || "[]");
    const userFeatures = user?.onboardingState?.completedOnboardingSteps || [];
    const allCompletedFeatures = [...new Set([...localFeatures, ...userFeatures])];

    return {
      daysSinceSignup: daysSinceSignup > 0 ? daysSinceSignup : 1, // Minimum 1 day
      currentStreak: dashboardStats.currentStreak,
      completedFeatures: allCompletedFeatures,
      checkInsCompleted: checkInResponses.length,
      averageSleepScore: stats.averageSleepQuality * 10, // Convert to 0-100 scale
    };
  };

  // Handle feature discovery from progressive onboarding
  const handleFeatureDiscovered = (featureId: string) => {
    setDiscoveredFeatures(prev => [...prev, featureId]);

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem("completedFeatures") || "[]");
    localStorage.setItem("completedFeatures", JSON.stringify([...existing, featureId]));

    // Mark in user onboarding state
    markOnboardingCompleted(featureId);
  };

  // Initialize progressive onboarding after basic onboarding is complete
  useEffect(() => {
    if (user && hasAccess("dashboard")) {
      const hasCompletedBasicOnboarding = localStorage.getItem("hasSeenDashboardOnboarding");

      if (hasCompletedBasicOnboarding && !showDashboardOnboarding && !showCoachMarks) {
        setShowProgressiveOnboarding(true);
      }
    }
  }, [user, showDashboardOnboarding, showCoachMarks, hasAccess]);

  const getScheduleItemContent = (activity: string) => {
    const activityLower = activity.toLowerCase();

    if (
      activityLower.includes("meditation") ||
      activityLower.includes("mindful")
    ) {
      return {
        videos: [
          { id: "inpok4MKVLM", title: "5-Minute Evening Meditation" },
          { id: "ZToicYcHIOU", title: "Mindfulness for Better Sleep" },
        ],
        tips: [
          "Find a quiet, comfortable space",
          "Focus on your breath and body sensations",
          "Let thoughts pass without judgment",
          "Start with just 5 minutes if you're new to meditation",
        ],
        description:
          "Meditation helps calm your mind and prepare your body for rest by reducing stress hormones and activating the relaxation response.",
      };
    } else if (
      activityLower.includes("breath") ||
      activityLower.includes("4-7-8")
    ) {
      return {
        videos: [
          { id: "YRPh_GaiL8s", title: "4-7-8 Breathing Technique" },
          { id: "gz4G31LGyog", title: "Box Breathing for Sleep" },
        ],
        tips: [
          "Sit or lie comfortably with your back straight",
          "Exhale completely through your mouth",
          "Inhale through nose for 4 counts",
          "Hold for 7 counts, exhale through mouth for 8 counts",
        ],
        description:
          "The 4-7-8 breathing technique activates your parasympathetic nervous system, naturally slowing your heart rate and promoting relaxation.",
      };
    } else if (
      activityLower.includes("shower") ||
      activityLower.includes("bath")
    ) {
      return {
        videos: [
          { id: "8BFcueoGGq8", title: "Perfect Evening Shower Routine" },
          { id: "E8D6_2UEAHY", title: "Relaxing Bath for Better Sleep" },
        ],
        tips: [
          "Keep water temperature warm, not hot (around 104°F)",
          "Shower 90 minutes before bedtime for optimal effect",
          "Use calming scents like lavender or chamomile",
          "Keep the bathroom lighting dim",
        ],
        description:
          "A warm shower or bath raises your body temperature. When you get out, your temperature drops rapidly, signaling to your brain that it's time to sleep.",
      };
    } else if (
      activityLower.includes("reading") ||
      activityLower.includes("book")
    ) {
      return {
        videos: [
          { id: "7fm6j8J1fts", title: "How Reading Improves Sleep" },
          { id: "WJkmwjI56tY", title: "Best Books for Bedtime" },
        ],
        tips: [
          "Choose physical books over e-readers to avoid blue light",
          "Read something calming, not exciting or work-related",
          "Use soft, warm lighting",
          "Read for 15-30 minutes",
        ],
        description:
          "Reading helps your mind transition from the day's activities to a more relaxed state, making it easier to fall asleep.",
      };
    } else if (
      activityLower.includes("stretch") ||
      activityLower.includes("yoga")
    ) {
      return {
        videos: [
          { id: "BiWDsfZ3I2w", title: "Gentle Bedtime Yoga" },
          { id: "v7AYKMP6rOE", title: "10-Minute Night Stretches" },
        ],
        tips: [
          "Focus on gentle, slow movements",
          "Hold each stretch for 30-60 seconds",
          "Breathe deeply during each pose",
          "Avoid intense or energizing poses",
        ],
        description:
          "Gentle stretching releases physical tension and helps your muscles relax, preparing your body for comfortable sleep.",
      };
    } else if (
      activityLower.includes("tea") ||
      activityLower.includes("drink")
    ) {
      return {
        videos: [
          { id: "KnAy_p8QSzs", title: "Best Herbal Teas for Sleep" },
          { id: "3yQFebRcznA", title: "Evening Tea Ritual" },
        ],
        tips: [
          "Choose caffeine-free herbal teas",
          "Chamomile, valerian, and passionflower are great options",
          "Drink 30-60 minutes before bed",
          "Create a calming ritual around tea preparation",
        ],
        description:
          "Herbal teas contain natural compounds that promote relaxation and can help regulate your sleep cycle.",
      };
    } else if (
      activityLower.includes("screen") ||
      activityLower.includes("digital") ||
      activityLower.includes("phone")
    ) {
      return {
        videos: [
          { id: "BqUk0OybtQs", title: "Digital Detox for Better Sleep" },
          { id: "NAYT3hrIUec", title: "Blue Light and Sleep" },
        ],
        tips: [
          "Turn off all screens 1-2 hours before bed",
          "Use night mode or blue light filters if necessary",
          "Charge devices outside your bedroom",
          "Replace screen time with calming activities",
        ],
        description:
          "Blue light from screens suppresses melatonin production, making it harder to fall asleep. A digital sunset improves sleep quality.",
      };
    } else if (
      activityLower.includes("environment") ||
      activityLower.includes("room")
    ) {
      return {
        videos: [
          { id: "3tKj0mwEQ-o", title: "Perfect Sleep Environment" },
          { id: "ej_W4fPL9J8", title: "Bedroom Setup for Better Sleep" },
        ],
        tips: [
          "Keep room temperature between 65-68°F (18-20°C)",
          "Use blackout curtains or eye mask",
          "Minimize noise with earplugs or white noise",
          "Ensure your mattress and pillows are comfortable",
        ],
        description:
          "Your sleep environment plays a crucial role in sleep quality. A cool, dark, and quiet room promotes deeper, more restorative sleep.",
      };
    }

    // Default content for unrecognized activities
    return {
      videos: [
        { id: "aXflBZXAucQ", title: "Sleep Hygiene Basics" },
        { id: "nm1TxQj9IsQ", title: "How to Fall Asleep Fast" },
      ],
      tips: [
        "Create a consistent bedtime routine",
        "Listen to your body's natural signals",
        "Be patient with yourself as you develop new habits",
        "Focus on progress, not perfection",
      ],
      description:
        "This activity is part of your personalized sleep routine designed to help you wind down and prepare for restful sleep.",
    };
  };

  const handleScheduleItemClick = (item: any) => {
    setSelectedScheduleItem(item);
    setIsScheduleModalOpen(true);
  };

  const calculateDashboardStats = () => {
    const checkInResponses = JSON.parse(
      localStorage.getItem("aiCheckInResponses") || "[]",
    );
    const goals = JSON.parse(localStorage.getItem("userGoals") || "[]");

    // Calculate streak from check-in responses
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      const dayResponse = checkInResponses.find((r: any) => r.date === dateStr);
      if (dayResponse && dayResponse.response === "yes") {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate total points (entries + quality + streak bonus)
    const totalPoints =
      entries.length * 10 +
      Math.floor(stats.averageSleepQuality * entries.length) +
      currentStreak * 5;

    // Calculate weekly goal progress
    const weeklyGoalProgress = Math.min(100, (entries.length / 7) * 100);

    // Last night score (simulated based on latest entry)
    const lastNightScore =
      entries.length > 0 ? entries[0].sleepQuality * 10 : 0;

    setDashboardStats({
      currentStreak,
      totalPoints,
      weeklyGoalProgress,
      lastNightScore,
      sleepGoalAchieved: stats.averageSleepQuality >= 7,
      morningGoalAchieved: currentStreak >= 3,
    });
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, color: "text-blue-500" },
    {
      id: "discipline-builder",
      label: "Discipline Builder",
      icon: Shield,
      color: "text-blue-500",
    },
    {
      id: "sleep-routine",
      label: "Sleep Routine",
      icon: Moon,
      color: "text-blue-500",
    },
    {
      id: "morning-routine",
      label: "Morning Routine",
      icon: Sun,
      color: "text-blue-500",
    },
    {
      id: "breathing-methods",
      label: "Breathing Methods",
      icon: Wind,
      color: "text-blue-500",
    },
    {
      id: "community",
      label: "Community",
      icon: Users,
      color: "text-blue-500",
    },
    {
      id: "progress-tracker",
      label: "Progress Tracker",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    { id: "rewards", label: "Rewards", icon: Gift, color: "text-blue-500" },
    {
      id: "sleep-log",
      label: "Sleep Log",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      id: "lucid-dreams",
      label: "Lucid Dreams",
      icon: Brain,
      color: "text-blue-500",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      color: "text-blue-400",
    },
  ];

  const getMotivationalQuote = () => {
    const quotes = [
      "Every small step towards better sleep is a victory! 🌟",
      "Consistency is the key to transforming your sleep habits! 💪",
      "You're building the foundation for incredible days ahead! 🚀",
      "Your dedication to better sleep is truly inspiring! ✨",
      "Rest well tonight, conquer tomorrow! 🌙➡️☀️",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const renderDashboardContent = () => {
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Welcome back, {user?.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-blue-500 text-lg mb-6">
            Your sleep optimization dashboard
          </p>
        </div>

        {/* Memory Status Indicator */}
        <div className="max-w-2xl mx-auto">
          <MemoryStatusIndicator
            showUpgradePrompt={!getStorageInfo().hasCloudAccess}
            compact={false}
          />
        </div>

        {/* Discipline Command Center */}
        <Card className="bg-blue-50 text-blue-900 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h2 className="text-2xl font-bold text-blue-700">
                    DISCIPLINE STATUS
                  </h2>
                  <p className="text-blue-600">
                    Your military-grade sleep structure
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setCurrentPage("discipline-builder")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                VIEW FULL COMMAND CENTER
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">7</div>
                <div className="text-sm text-blue-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">RECRUIT</div>
                <div className="text-sm text-blue-600">Current Level</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">8.5</div>
                <div className="text-sm text-blue-600">Sleep Score</div>
              </div>
              <div className="text-center p-4 bg-blue-100 rounded-lg border border-blue-200">
                <div className="text-3xl font-bold text-blue-700">2</div>
                <div className="text-sm text-blue-600">Active Goals</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Check-in */}
        <div data-testid="ai-checkin" data-feature="daily-checkin">
          <AICheckIn onResponse={() => calculateDashboardStats()} />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" data-feature="stats-overview" data-onboarding="stats-cards">
          {/* Sleep & Wake Goals */}
          <Card className="bg-blue-50 border border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Daily Goals</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Sleep Goal</span>
                  {dashboardStats.sleepGoalAchieved ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-300 rounded-full" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Morning Goal</span>
                  {dashboardStats.morningGoalAchieved ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-blue-300 rounded-full" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Last Night Performance */}
          <Card className="bg-blue-50 border border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Moon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Last Night</h3>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {dashboardStats.lastNightScore > 0
                    ? `${dashboardStats.lastNightScore}/100`
                    : "😴"}
                </div>
                <p className="text-sm text-blue-600">
                  {dashboardStats.lastNightScore > 80
                    ? "Excellent!"
                    : dashboardStats.lastNightScore > 60
                      ? "Good night"
                      : dashboardStats.lastNightScore > 0
                        ? "Room to improve"
                        : "Track tonight!"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Streak */}
          <Card className="bg-blue-50 border border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Streak</h3>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {dashboardStats.currentStreak}
                </div>
                <p className="text-sm text-blue-600">
                  {dashboardStats.currentStreak === 0
                    ? "Start today!"
                    : dashboardStats.currentStreak === 1
                      ? "Great start!"
                      : dashboardStats.currentStreak < 7
                        ? "Building momentum!"
                        : dashboardStats.currentStreak < 30
                          ? "Amazing streak!"
                          : "Legendary! 🏆"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Points */}
          <Card className="bg-blue-50 border border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-blue-700">Total Points</h3>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">
                  {dashboardStats.totalPoints}
                </div>
                <p className="text-sm text-blue-600">Keep earning!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="bg-blue-50 border border-blue-300 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <BarChart3 className="h-6 w-6" />
              Weekly Progress Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-700 font-medium">
                    Sleep Tracking Progress
                  </span>
                  <span className="text-blue-600">
                    {Math.round(dashboardStats.weeklyGoalProgress)}%
                  </span>
                </div>
                <Progress
                  value={dashboardStats.weeklyGoalProgress}
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {entries.length}
                  </p>
                  <p className="text-sm text-blue-600">Sleep entries</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {stats.averageSleepQuality.toFixed(1)}
                  </p>
                  <p className="text-sm text-blue-600">Avg quality</p>
                </div>

                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">
                    {Math.floor(dashboardStats.totalPoints / 100) + 1}
                  </p>
                  <p className="text-sm text-blue-600">Level</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Sleep Schedule Preview */}
        {(() => {
          const activeSchedule = schedules.find((s) => s.isActive);
          if (!activeSchedule) return null;

          return (
            <Card className="bg-gradient-to-r from-blue-300 to-blue-400 border border-blue-300 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Moon className="h-6 w-6" />
                  Your AI-Generated Sleep Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSchedule.schedule
                    .slice(0, 6)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        onClick={() => handleScheduleItemClick(item)}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-200 group"
                      >
                        <div className="p-2 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
                              {item.time}
                            </span>
                            <Badge
                              className={`text-xs ${
                                item.category === "evening"
                                  ? "bg-blue-200 text-blue-700"
                                  : item.category === "night"
                                    ? "bg-blue-300 text-blue-800"
                                    : item.category === "morning"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {item.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-600 font-medium truncate group-hover:text-blue-700 transition-colors">
                            {item.activity}
                          </p>
                          <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle className="h-3 w-3 text-blue-500" />
                            <span className="text-xs text-blue-500 font-medium">
                              Click for guidance
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-700" />
                    <span className="text-sm text-blue-800 font-medium">
                      AI-optimized for your lifestyle
                    </span>
                  </div>
                  <Button
                    onClick={() => setCurrentPage("sleep-routine")}
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-700 hover:bg-blue-500 hover:text-white"
                  >
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })()}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 shadow-md border border-blue-200"
            onClick={() => setCurrentPage("sleep-routine")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-200 rounded-full shadow-sm">
                  <Moon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 text-lg">
                    Adjust Sleep Routine
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    Fine-tune your bedtime schedule
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 shadow-md border border-blue-200"
            onClick={() => setCurrentPage("morning-routine")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-200 rounded-full shadow-sm">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 text-lg">
                    Talk to Luna
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    Get AI insights and support
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50 shadow-md border border-blue-200"
            onClick={() => setCurrentPage("community")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-200 rounded-full shadow-sm">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 text-lg">
                    Join Community
                  </h3>
                  <p className="text-blue-600 text-sm font-medium">
                    Connect with fellow sleep optimizers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Highlights */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Users className="h-6 w-6" />
              Community Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b332b877?w=40&h=40&fit=crop&crop=face"
                    alt="Sarah"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-700">
                      Sarah Chen hit a 45-day streak! 🔥
                    </p>
                    <p className="text-xs text-blue-600 truncate">
                      Using 4-7-8 breathing technique...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face"
                    alt="Priya"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-700">
                      Priya achieved first lucid dream! ✨
                    </p>
                    <p className="text-xs text-blue-600 truncate">
                      Progressive relaxation technique worked...
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">12,847</div>
                  <div className="text-sm text-blue-700">Active Members</div>
                </div>
                <Button
                  onClick={() => setCurrentPage("community")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Join the Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <p className="text-lg font-medium text-blue-700 mb-2">
              Daily Motivation
            </p>
            <p className="text-blue-600">{getMotivationalQuote()}</p>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboardContent();
      case "discipline-builder":
        return (
          <DisciplineBuilderPage
            onNavigate={setCurrentPage}
            onGoHome={onGoHome}
          />
        );
      case "sleep-routine":
        return (
          <SleepRoutinePage onNavigate={setCurrentPage} onGoHome={onGoHome} />
        );
      case "morning-routine":
        if (!hasAccess("morning")) {
          return (
            <div className="text-center p-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-blue-700 mb-2">
                  Upgrade Required
                </h3>
                <p className="text-blue-600 mb-4">
                  Morning routines are available with Full Transformation
                  ($9.99) or Elite Performance ($13.99) plans.
                </p>
                <Button
                  onClick={() => setCurrentPage("dashboard")}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>
          );
        }
        return (
          <MorningRoutinePage onNavigate={setCurrentPage} onGoHome={onGoHome} />
        );
      case "progress-tracker":
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
              <TrendingUp className="h-8 w-8" />
              Progress Tracker
            </h2>
            <GoalSetting onGoalUpdate={calculateDashboardStats} />
          </div>
        );
      case "breathing-methods":
        return (
          <BreathingPage onNavigate={setCurrentPage} onGoHome={onGoHome} />
        );
      case "community":
        return (
          <CommunityPage onNavigate={setCurrentPage} onGoHome={onGoHome} />
        );
      case "rewards":
        return <RewardsPage onNavigate={setCurrentPage} onGoHome={onGoHome} />;
      case "sleep-log":
        return <SleepLogPage onNavigate={setCurrentPage} onGoHome={onGoHome} />;
      case "lucid-dreams":
        return (
          <LucidDreamTracker onNavigate={setCurrentPage} onGoHome={onGoHome} />
        );
      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 flex items-center gap-3">
                <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
                Settings
              </h2>
              <Button
                onClick={saveSettings}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>

            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={settings.displayName}
                      onChange={(e) =>
                        updateSetting("displayName", e.target.value)
                      }
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => updateSetting("timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time
                      </SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Sleep Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Sleep Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="defaultBedtime">Default Bedtime</Label>
                    <Input
                      id="defaultBedtime"
                      type="time"
                      value={settings.defaultBedtime}
                      onChange={(e) =>
                        updateSetting("defaultBedtime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultWakeTime">Default Wake Time</Label>
                    <Input
                      id="defaultWakeTime"
                      type="time"
                      value={settings.defaultWakeTime}
                      onChange={(e) =>
                        updateSetting("defaultWakeTime", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleepGoalHours">Sleep Goal (hours)</Label>
                    <Select
                      value={settings.sleepGoalHours.toString()}
                      onValueChange={(value) =>
                        updateSetting("sleepGoalHours", parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="7">7 hours</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="9">9 hours</SelectItem>
                        <SelectItem value="10">10 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Notifications</p>
                    <p className="text-sm text-gray-600">
                      Receive reminder notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) =>
                      updateSetting("enableNotifications", checked)
                    }
                  />
                </div>

                {settings.enableNotifications && (
                  <div className="space-y-4 ml-4 border-l-2 border-blue-200 pl-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Bedtime Reminder</p>
                        <p className="text-sm text-gray-600">
                          Remind me when it's time for bed
                        </p>
                      </div>
                      <Switch
                        checked={settings.bedtimeReminder}
                        onCheckedChange={(checked) =>
                          updateSetting("bedtimeReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Wake Up Reminder</p>
                        <p className="text-sm text-gray-600">
                          Gentle wake up notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.wakeUpReminder}
                        onCheckedChange={(checked) =>
                          updateSetting("wakeUpReminder", checked)
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Daily Check-in Reminder</p>
                        <p className="text-sm text-gray-600">
                          AI check-in notifications
                        </p>
                      </div>
                      <Switch
                        checked={settings.checkInReminder}
                        onCheckedChange={(checked) =>
                          updateSetting("checkInReminder", checked)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="reminderTime">
                        Reminder Time (minutes before bedtime)
                      </Label>
                      <Select
                        value={settings.reminderTime.toString()}
                        onValueChange={(value) =>
                          updateSetting("reminderTime", parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Assistant (Luna) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Luna AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="lunaPersonality">Luna's Personality</Label>
                  <Select
                    value={settings.lunaPersonality}
                    onValueChange={(value) =>
                      updateSetting("lunaPersonality", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encouraging">
                        Encouraging & Motivational
                      </SelectItem>
                      <SelectItem value="professional">
                        Professional & Direct
                      </SelectItem>
                      <SelectItem value="friendly">
                        Friendly & Casual
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lunaFrequency">Check-in Frequency</Label>
                  <Select
                    value={settings.lunaFrequency}
                    onValueChange={(value) =>
                      updateSetting("lunaFrequency", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Luna Insights</p>
                    <p className="text-sm text-gray-600">
                      Receive AI-powered sleep insights
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableLunaInsights}
                    onCheckedChange={(checked) =>
                      updateSetting("enableLunaInsights", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* App Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  App Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => updateSetting("theme", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="units">Units</Label>
                    <Select
                      value={settings.units}
                      onValueChange={(value) => updateSetting("units", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric</SelectItem>
                        <SelectItem value="imperial">Imperial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="weekStartsOn">Week Starts On</Label>
                    <Select
                      value={settings.weekStartsOn}
                      onValueChange={(value) =>
                        updateSetting("weekStartsOn", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Sounds</p>
                    <p className="text-sm text-gray-600">
                      Play notification and interaction sounds
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableSounds}
                    onCheckedChange={(checked) =>
                      updateSetting("enableSounds", checked)
                    }
                  />
                </div>

                {settings.enableSounds && (
                  <div className="ml-4">
                    <Label htmlFor="soundVolume">
                      Sound Volume: {settings.soundVolume}%
                    </Label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.soundVolume}
                      onChange={(e) =>
                        updateSetting("soundVolume", parseInt(e.target.value))
                      }
                      className="w-full mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Privacy & Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Sharing</p>
                    <p className="text-sm text-gray-600">
                      Share anonymized data to improve SleepVision
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) =>
                      updateSetting("dataSharing", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics</p>
                    <p className="text-sm text-gray-600">
                      Help us improve the app with usage analytics
                    </p>
                  </div>
                  <Switch
                    checked={settings.analytics}
                    onCheckedChange={(checked) =>
                      updateSetting("analytics", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Crash Reports</p>
                    <p className="text-sm text-gray-600">
                      Automatically send crash reports
                    </p>
                  </div>
                  <Switch
                    checked={settings.crashReports}
                    onCheckedChange={(checked) =>
                      updateSetting("crashReports", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export My Data
                  </Button>

                  <Button
                    onClick={clearAllData}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                </div>

                <p className="text-sm text-gray-600">
                  Export includes all your sleep data, settings, and AI check-in
                  history. Clearing data will permanently remove all information
                  and cannot be undone.
                </p>
              </CardContent>
            </Card>

            {/* Google Account & Payment Memory */}
            <GoogleLinkedPaymentStatus showHistory={true} compact={false} />

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={async () => {
                    await signOut();
                    // Redirect to actual home page, not dashboard
                    window.location.href = window.location.origin;
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-lg border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900">SleepVision</h1>
              <p className="text-sm text-gray-600">
                Discipline-Building Sleep Coach
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>

          {/* Mobile User Info */}
          {user && (
            <div className="mt-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-xs">No Image</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {user.name}
                      </p>
                      <Badge className="bg-blue-600 text-white text-xs">
                        Level {Math.floor(dashboardStats.totalPoints / 100) + 1}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="bg-white w-64 h-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Navigation
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <nav className="p-4">
                <div className="space-y-2">
                  {navigationItems
                    .filter((item) => {
                      // Hide morning routine for users without access
                      if (
                        item.id === "morning-routine" &&
                        !hasAccess("morning")
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentPage(item.id as NavigationPage);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                            isActive
                              ? "bg-blue-50 border border-blue-200 text-blue-700"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${isActive ? "text-black" : item.color}`}
                          />
                          <span
                            className={`font-medium ${isActive ? "text-blue-800" : ""}`}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Desktop Left Navigation */}
        <div className="hidden lg:block w-64 bg-white shadow-lg border-r border-gray-200 min-h-screen">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">SleepVision</h1>
            <p className="text-sm text-gray-600">
              Discipline-Building Sleep Coach
            </p>
          </div>

          {/* User Info - Desktop */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <Badge className="bg-blue-600 text-white text-xs">
                        Level {Math.floor(dashboardStats.totalPoints / 100) + 1}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <nav className="p-4">
            <div className="space-y-2">
              {navigationItems
                .filter((item) => {
                  // Hide morning routine for users without access
                  if (item.id === "morning-routine" && !hasAccess("morning")) {
                    return false;
                  }
                  return true;
                })
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id as NavigationPage)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-50 border border-blue-200 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${isActive ? "text-black" : item.color}`}
                      />
                      <span
                        className={`font-medium ${isActive ? "text-blue-800" : ""}`}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {onGoHome && (
            <div className="mb-6">
              <Button
                onClick={onGoHome}
                variant="outline"
                className="flex items-center gap-2"
              >
                ← Back to Dashboard
              </Button>
            </div>
          )}

          {renderPageContent()}
        </div>
      </div>

      {/* Schedule Item Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedScheduleItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <Clock className="h-6 w-6 text-black" />
                  {selectedScheduleItem.time} - {selectedScheduleItem.activity}
                  <Badge
                    className={`ml-auto ${
                      selectedScheduleItem.category === "evening"
                        ? "bg-blue-200 text-blue-700"
                        : selectedScheduleItem.category === "night"
                          ? "bg-blue-300 text-blue-800"
                          : selectedScheduleItem.category === "morning"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {selectedScheduleItem.category}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Description */}
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <h3 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Why This Helps
                  </h3>
                  <p className="text-indigo-800 leading-relaxed">
                    {
                      getScheduleItemContent(selectedScheduleItem.activity)
                        .description
                    }
                  </p>
                  {selectedScheduleItem.description && (
                    <p className="text-indigo-700 mt-2 italic">
                      "{selectedScheduleItem.description}"
                    </p>
                  )}
                </div>

                {/* YouTube Videos */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-red-600" />
                    Guided Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getScheduleItemContent(
                      selectedScheduleItem.activity,
                    ).videos.map((video, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
                      >
                        <div className="aspect-video">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${video.id}?rel=0`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900">
                            {video.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-black" />
                    Helpful Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getScheduleItemContent(
                      selectedScheduleItem.activity,
                    ).tips.map((tip, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-black font-bold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-green-800 text-sm font-medium">
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2"
                  >
                    Got it! Close Guide
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lucid Dreaming Popup */}
      <LucidDreamingPopup
        onTryNow={() => {
          setLucidDreamingActive(true);
          setCurrentPage("lucid-dreams");
          console.log("User activated lucid dreaming journey");
        }}
        onNeverShowAgain={() => {
          console.log("User dismissed lucid dreaming feature");
        }}
      />

      {/* Sleep Journey Onboarding */}
      <SleepJourneyOnboarding
        isVisible={showOnboarding}
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />

      {/* Interactive Dashboard Onboarding with Luna */}
      <InteractiveDashboardOnboarding
        isVisible={showDashboardOnboarding}
        onComplete={handleDashboardOnboardingComplete}
        onSkip={handleDashboardOnboardingSkip}
        currentDashboardPage={currentPage}
      />

      {/* Tooltip Coach Marks */}
      <TooltipCoachMarks
        tooltips={DASHBOARD_TOOLTIPS}
        isActive={showCoachMarks}
        onComplete={handleCoachMarksComplete}
        onSkip={handleCoachMarksSkip}
        autoProgress={false}
        showSequentially={true}
      />

      {/* Progressive Onboarding Manager */}
      <ProgressiveOnboardingManager
        isActive={showProgressiveOnboarding}
        userStats={getUserStats()}
        onFeatureDiscovered={handleFeatureDiscovered}
      />
    </div>
  );
}
