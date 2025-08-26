import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Trophy,
  Star,
  Award,
  Crown,
  Medal,
  Target,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  Gift,
  Heart,
  Brain,
  Shield,
  Sword,
  Gem,
  Rocket,
  Infinity,
  TrendingUp,
  BarChart3,
  CheckCircle,
  CircleDot,
  Circle,
  Plus,
  Minus,
  RefreshCw,
  Play,
  Pause,
  Square,
  Settings,
  Share2,
  Download,
  Upload,
  Bell,
  Volume2,
  VolumeX,
  Timer,
  Stopwatch,
  AlarmClock,
  Sun,
  Moon,
  Coffee,
  Dumbbell,
  Book,
  Music,
  Phone,
  Home,
  Users,
  MapPin,
  Compass,
  Navigation,
  Crosshair,
  Flag,
  Mountain,
  Building,
} from "lucide-react";

interface Streak {
  id: string;
  name: string;
  description: string;
  category:
    | "health"
    | "wellness"
    | "productivity"
    | "learning"
    | "social"
    | "personal";
  icon: string;
  currentCount: number;
  bestCount: number;
  totalCount: number;
  lastActivityDate: Date;
  isActive: boolean;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  pointsPerDay: number;
  bonusMultiplier: number;
  nextMilestone: number;
  milestones: Milestone[];
  freezeCount: number; // streak freeze tokens
  achievements: Achievement[];
}

interface Milestone {
  id: string;
  day: number;
  title: string;
  description: string;
  reward: {
    points: number;
    badge?: string;
    item?: string;
    freezeTokens?: number;
  };
  isUnlocked: boolean;
  unlockedAt?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt: Date;
  points: number;
}

interface StreakStats {
  totalPoints: number;
  longestStreak: number;
  activeStreaks: number;
  milestonesUnlocked: number;
  perfectWeeks: number;
  streakLevel: number;
  nextLevelPoints: number;
}

interface Celebration {
  id: string;
  type:
    | "milestone"
    | "achievement"
    | "level_up"
    | "perfect_week"
    | "streak_saved";
  title: string;
  description: string;
  rewards: string[];
  animation: "confetti" | "fireworks" | "sparkles" | "rainbow";
  timestamp: Date;
}

export function GamefiedStreakManager() {
  const { user } = useAuth();
  const [streaks, setStreaks] = useState<Streak[]>([
    {
      id: "1",
      name: "Morning Meditation",
      description: "Daily mindfulness practice",
      category: "wellness",
      icon: "🧘",
      currentCount: 15,
      bestCount: 23,
      totalCount: 45,
      lastActivityDate: new Date(),
      isActive: true,
      difficulty: "medium",
      pointsPerDay: 20,
      bonusMultiplier: 1.5,
      nextMilestone: 21,
      freezeCount: 2,
      milestones: [
        {
          id: "1",
          day: 7,
          title: "Week Warrior",
          description: "Complete 7 days",
          reward: { points: 100, badge: "Week Warrior" },
          isUnlocked: true,
        },
        {
          id: "2",
          day: 14,
          title: "Fortnight Fighter",
          description: "Complete 14 days",
          reward: { points: 200, freezeTokens: 1 },
          isUnlocked: true,
        },
        {
          id: "3",
          day: 21,
          title: "Triple Week Master",
          description: "Complete 21 days",
          reward: { points: 500, badge: "Meditation Master" },
          isUnlocked: false,
        },
        {
          id: "4",
          day: 30,
          title: "Month Conqueror",
          description: "Complete 30 days",
          reward: { points: 1000, item: "Premium Meditation Access" },
          isUnlocked: false,
        },
      ],
      achievements: [],
    },
    {
      id: "2",
      name: "Sleep Schedule",
      description: "Consistent 8-hour sleep",
      category: "health",
      icon: "😴",
      currentCount: 8,
      bestCount: 12,
      totalCount: 28,
      lastActivityDate: new Date(),
      isActive: true,
      difficulty: "hard",
      pointsPerDay: 30,
      bonusMultiplier: 2.0,
      nextMilestone: 14,
      freezeCount: 1,
      milestones: [
        {
          id: "1",
          day: 7,
          title: "Sleep Starter",
          description: "Consistent for a week",
          reward: { points: 150, badge: "Sleep Warrior" },
          isUnlocked: true,
        },
        {
          id: "2",
          day: 14,
          title: "Sleep Stabilizer",
          description: "Two weeks of consistency",
          reward: { points: 300, freezeTokens: 2 },
          isUnlocked: false,
        },
      ],
      achievements: [],
    },
    {
      id: "3",
      name: "Daily Reading",
      description: "Read for 30 minutes daily",
      category: "learning",
      icon: "📚",
      currentCount: 0,
      bestCount: 5,
      totalCount: 12,
      lastActivityDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isActive: false,
      difficulty: "easy",
      pointsPerDay: 15,
      bonusMultiplier: 1.2,
      nextMilestone: 7,
      freezeCount: 0,
      milestones: [
        {
          id: "1",
          day: 7,
          title: "Bookworm Beginner",
          description: "Read for a week",
          reward: { points: 100, badge: "Bookworm" },
          isUnlocked: false,
        },
      ],
      achievements: [],
    },
  ]);

  const [stats, setStats] = useState<StreakStats>({
    totalPoints: 2850,
    longestStreak: 23,
    activeStreaks: 2,
    milestonesUnlocked: 3,
    perfectWeeks: 2,
    streakLevel: 5,
    nextLevelPoints: 350,
  });

  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentCelebration, setCurrentCelebration] =
    useState<Celebration | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [selectedStreak, setSelectedStreak] = useState<Streak | null>(null);
  const [streakTimer, setStreakTimer] = useState<Record<string, number>>({});

  const motivationalMessages = [
    "🔥 You're on fire! Keep the momentum going!",
    "⚡ Consistency is your superpower!",
    "🌟 Every day counts towards greatness!",
    "🚀 Your dedication is out of this world!",
    "💎 Habits are the compound interest of self-improvement!",
    "🏆 Champions are built one day at a time!",
    "🎯 Small steps, big results!",
    "💪 Your future self will thank you!",
  ];

  // Update motivational messages
  useEffect(() => {
    const updateMessage = () => {
      const randomMessage =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];
      setMotivationalMessage(randomMessage);
    };

    updateMessage();
    const interval = setInterval(updateMessage, 20000);
    return () => clearInterval(interval);
  }, []);

  // Streak timers for next update countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeToMidnight = tomorrow.getTime() - now.getTime();

      setStreakTimer((prev) => ({
        ...prev,
        nextUpdate: Math.floor(timeToMidnight / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStreakAction = (
    streakId: string,
    action: "check_in" | "freeze" | "restart",
  ) => {
    setStreaks((prev) =>
      prev.map((streak) => {
        if (streak.id === streakId) {
          switch (action) {
            case "check_in":
              const newCount = streak.currentCount + 1;
              const updatedStreak = {
                ...streak,
                currentCount: newCount,
                bestCount: Math.max(streak.bestCount, newCount),
                totalCount: streak.totalCount + 1,
                lastActivityDate: new Date(),
                isActive: true,
              };

              // Check for milestone
              const nextMilestone = streak.milestones.find(
                (m) => m.day === newCount && !m.isUnlocked,
              );
              if (nextMilestone) {
                triggerMilestoneCelebration(streak, nextMilestone);
                nextMilestone.isUnlocked = true;
                nextMilestone.unlockedAt = new Date();
              }

              // Update stats
              setStats((prevStats) => ({
                ...prevStats,
                totalPoints:
                  prevStats.totalPoints +
                  streak.pointsPerDay * streak.bonusMultiplier,
              }));

              return updatedStreak;

            case "freeze":
              if (streak.freezeCount > 0) {
                return {
                  ...streak,
                  freezeCount: streak.freezeCount - 1,
                  lastActivityDate: new Date(),
                };
              }
              return streak;

            case "restart":
              return {
                ...streak,
                currentCount: 0,
                isActive: true,
                lastActivityDate: new Date(),
              };

            default:
              return streak;
          }
        }
        return streak;
      }),
    );
  };

  const triggerMilestoneCelebration = (
    streak: Streak,
    milestone: Milestone,
  ) => {
    const celebration: Celebration = {
      id: Date.now().toString(),
      type: "milestone",
      title: `🎉 ${milestone.title} Unlocked!`,
      description: `Amazing! You've reached ${milestone.day} days on your ${streak.name} streak!`,
      rewards: [
        `+${milestone.reward.points} points`,
        ...(milestone.reward.badge
          ? [`🏆 ${milestone.reward.badge} badge`]
          : []),
        ...(milestone.reward.freezeTokens
          ? [`❄️ ${milestone.reward.freezeTokens} freeze tokens`]
          : []),
      ],
      animation: "confetti",
      timestamp: new Date(),
    };

    setCelebrations((prev) => [celebration, ...prev.slice(0, 4)]);
    setCurrentCelebration(celebration);
    setShowCelebration(true);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowCelebration(false);
      setCurrentCelebration(null);
    }, 5000);
  };

  const getDifficultyColor = (difficulty: Streak["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-orange-600 bg-orange-100";
      case "extreme":
        return "text-red-600 bg-red-100";
    }
  };

  const getCategoryIcon = (category: Streak["category"]) => {
    switch (category) {
      case "health":
        return <Heart className="h-4 w-4" />;
      case "wellness":
        return <Star className="h-4 w-4" />;
      case "productivity":
        return <Target className="h-4 w-4" />;
      case "learning":
        return <Book className="h-4 w-4" />;
      case "social":
        return <Users className="h-4 w-4" />;
      case "personal":
        return <User className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStreakFlameIntensity = (count: number) => {
    if (count >= 30) return "🔥🔥🔥";
    if (count >= 14) return "🔥🔥";
    if (count >= 7) return "🔥";
    return "🌟";
  };

  const calculateProgress = (current: number, milestone: number) => {
    return (current / milestone) * 100;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Celebration Modal */}
      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="max-w-md bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 text-white border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              {currentCelebration?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🎉</div>
            <p className="text-lg">{currentCelebration?.description}</p>
            <div className="space-y-2">
              {currentCelebration?.rewards.map((reward, index) => (
                <div key={index} className="bg-white/20 rounded-lg p-2">
                  {reward}
                </div>
              ))}
            </div>
            <Button
              onClick={() => setShowCelebration(false)}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Awesome! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Header Stats */}
      <Card className="border-2 border-orange-200 shadow-xl bg-gradient-to-r from-white via-orange-50 to-yellow-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl text-orange-700 flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-500" />
                Streak Manager
              </CardTitle>
              <p className="text-orange-600 mt-2 text-lg">
                {motivationalMessage}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-orange-600">
                Level {stats.streakLevel}
              </div>
              <div className="text-sm text-orange-500">
                {stats.nextLevelPoints} pts to next level
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {stats.totalPoints}
              </div>
              <div className="text-sm text-yellow-500">Total Points</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {stats.longestStreak}
              </div>
              <div className="text-sm text-orange-500">Best Streak</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Zap className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {stats.activeStreaks}
              </div>
              <div className="text-sm text-blue-500">Active</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Star className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {stats.milestonesUnlocked}
              </div>
              <div className="text-sm text-purple-500">Milestones</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Crown className="h-6 w-6 text-indigo-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-indigo-600">
                {stats.perfectWeeks}
              </div>
              <div className="text-sm text-indigo-500">Perfect Weeks</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Timer className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-600 font-mono">
                {streakTimer.nextUpdate
                  ? formatTime(streakTimer.nextUpdate)
                  : "00:00:00"}
              </div>
              <div className="text-sm text-green-500">Next Reset</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Level Progress</span>
              <span>Level {stats.streakLevel}</span>
            </div>
            <Progress value={75} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Current XP: {stats.totalPoints}</span>
              <span>
                Next Level: {stats.totalPoints + stats.nextLevelPoints}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {streaks.map((streak) => (
          <Card
            key={streak.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              streak.isActive
                ? "border-2 border-green-300 bg-green-50"
                : "border-2 border-gray-300 bg-gray-50"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{streak.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg">{streak.name}</h3>
                    <p className="text-sm text-gray-600">
                      {streak.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    {streak.currentCount}{" "}
                    {getStreakFlameIntensity(streak.currentCount)}
                  </div>
                  <Badge className={getDifficultyColor(streak.difficulty)}>
                    {streak.difficulty}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress to Next Milestone */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>Next Milestone</span>
                  <span>
                    {streak.currentCount}/{streak.nextMilestone}
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    streak.currentCount,
                    streak.nextMilestone,
                  )}
                  className="h-2"
                />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/80 rounded p-2">
                  <div className="font-bold text-blue-600">
                    {streak.bestCount}
                  </div>
                  <div className="text-gray-600">Best</div>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <div className="font-bold text-green-600">
                    {streak.totalCount}
                  </div>
                  <div className="text-gray-600">Total</div>
                </div>
                <div className="bg-white/80 rounded p-2">
                  <div className="font-bold text-purple-600">
                    {streak.pointsPerDay}
                  </div>
                  <div className="text-gray-600">Points/Day</div>
                </div>
              </div>

              {/* Freeze Tokens */}
              {streak.freezeCount > 0 && (
                <div className="flex items-center gap-2 bg-blue-100 rounded-lg p-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {streak.freezeCount} Freeze Token
                    {streak.freezeCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Recent Milestones */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recent Milestones</h4>
                <div className="space-y-1">
                  {streak.milestones.slice(0, 2).map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center gap-2 p-2 rounded text-xs ${
                        milestone.isUnlocked
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {milestone.isUnlocked ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <Circle className="h-3 w-3 text-gray-400" />
                      )}
                      <span>{milestone.title}</span>
                      <span className="ml-auto">{milestone.day}d</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {streak.isActive ? (
                  <Button
                    onClick={() => handleStreakAction(streak.id, "check_in")}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={
                      new Date().toDateString() ===
                      streak.lastActivityDate.toDateString()
                    }
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {new Date().toDateString() ===
                    streak.lastActivityDate.toDateString()
                      ? "Done Today!"
                      : "Check In"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleStreakAction(streak.id, "restart")}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Restart
                  </Button>
                )}

                {streak.freezeCount > 0 && streak.isActive && (
                  <Button
                    onClick={() => handleStreakAction(streak.id, "freeze")}
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    <Shield className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Category and Last Activity */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  {getCategoryIcon(streak.category)}
                  <span className="capitalize">{streak.category}</span>
                </div>
                <span>
                  Last: {streak.lastActivityDate.toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Milestone Gallery */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Award className="h-6 w-6" />
            Milestone Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {streaks
              .flatMap((streak) =>
                streak.milestones.filter((m) => m.isUnlocked),
              )
              .map((milestone, index) => (
                <div
                  key={index}
                  className="text-center p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg border border-yellow-300"
                >
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-bold text-sm text-yellow-800">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-yellow-700">
                    {milestone.day} days
                  </p>
                  {milestone.unlockedAt && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {milestone.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}

            {/* Locked Milestones Preview */}
            {streaks
              .flatMap((streak) =>
                streak.milestones.filter((m) => !m.isUnlocked),
              )
              .slice(0, 3)
              .map((milestone, index) => (
                <div
                  key={`locked-${index}`}
                  className="text-center p-4 bg-gray-100 rounded-lg border border-gray-300 opacity-60"
                >
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-bold text-sm text-gray-600">
                    {milestone.title}
                  </h4>
                  <p className="text-xs text-gray-500">{milestone.day} days</p>
                  <p className="text-xs text-gray-400 mt-1">Locked</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Zap className="h-6 w-6" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 border-green-300 text-green-700"
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">New Streak</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 border-purple-300 text-purple-700"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 border-yellow-300 text-yellow-700"
            >
              <Share2 className="h-6 w-6" />
              <span className="text-sm">Share Progress</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 border-orange-300 text-orange-700"
            >
              <Settings className="h-6 w-6" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Celebrations */}
      {celebrations.length > 0 && (
        <Card className="border-2 border-pink-200 shadow-lg bg-gradient-to-r from-white to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-pink-700">
              <Sparkles className="h-6 w-6" />
              Recent Celebrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {celebrations.map((celebration) => (
                <div
                  key={celebration.id}
                  className="flex items-center gap-3 p-3 bg-pink-100 rounded-lg border border-pink-300"
                >
                  <div className="text-2xl">🎉</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-pink-800">
                      {celebration.title}
                    </h4>
                    <p className="text-sm text-pink-700">
                      {celebration.description}
                    </p>
                    <div className="flex gap-2 mt-1">
                      {celebration.rewards.map((reward, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-xs border-pink-300 text-pink-600"
                        >
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-pink-500">
                    {celebration.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
