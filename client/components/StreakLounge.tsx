import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Trophy,
  Gift,
  Star,
  Zap,
  Crown,
  Diamond,
  Heart,
  Target,
  Sparkles,
  Music,
  Palette,
  Volume2,
  Lock,
  Unlock,
} from "lucide-react";
import { useSleepData } from '@/hooks/useSleepData';

interface StreakData {
  current: number;
  longest: number;
  totalPoints: number;
  level: number;
}

interface DailyReward {
  type: "audio" | "quote" | "wallpaper" | "points" | "voice" | "badge";
  title: string;
  description: string;
  value: string | number;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: React.ReactNode;
  unlocked: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  points: number;
}

export function StreakLounge() {
  const { getSleepStats, entries } = useSleepData();
  const stats = getSleepStats();

  const [streak, setStreak] = useState<StreakData>({
    current: stats.streakDays,
    longest: Math.max(stats.streakDays, 0), // In a real app, this would be stored separately
    totalPoints: entries.length * 10 + Math.floor(stats.averageSleepQuality * entries.length),
    level: Math.floor((entries.length * 10 + Math.floor(stats.averageSleepQuality * entries.length)) / 100) + 1,
  });
  const [showChest, setShowChest] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [todayReward, setTodayReward] = useState<DailyReward | null>(null);
  const [canOpenChest, setCanOpenChest] = useState(true);
  const [currentTheme, setCurrentTheme] = useState("default");

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first-week",
      title: "7 Nights Strong",
      description: "Complete your first week of consistent sleep tracking",
      icon: <Flame className="h-6 w-6 text-orange-500" />,
      unlocked: streak.current >= 7,
      progress: Math.min(streak.current, 7),
      maxProgress: 7,
      points: 100,
    },
    {
      id: "sleep-master",
      title: "Sleep Master",
      description: "Maintain a 30-day sleep streak",
      icon: <Crown className="h-6 w-6 text-yellow-500" />,
      unlocked: streak.longest >= 30,
      progress: Math.min(streak.longest, 30),
      maxProgress: 30,
      points: 500,
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Complete 10 morning routines",
      icon: <Target className="h-6 w-6 text-blue-500" />,
      unlocked: false,
      progress: 7,
      maxProgress: 10,
      points: 200,
    },
    {
      id: "point-collector",
      title: "Point Collector",
      description: "Earn 1000 total points",
      icon: <Diamond className="h-6 w-6 text-purple-500" />,
      unlocked: streak.totalPoints >= 1000,
      progress: Math.min(streak.totalPoints, 1000),
      maxProgress: 1000,
      points: 300,
    },
  ]);

  const availableThemes = [
    { id: "default", name: "SleepVision Classic", unlocked: true },
    { id: "zen", name: "Minimal Zen", unlocked: streak.level >= 3 },
    { id: "retro", name: "Retro Wave", unlocked: streak.level >= 5 },
    { id: "sunrise", name: "Sunrise Gold", unlocked: streak.level >= 7 },
    { id: "aurora", name: "Aurora Dreams", unlocked: streak.level >= 10 },
  ];

  const possibleRewards: DailyReward[] = [
    {
      type: "audio",
      title: "Ocean Waves",
      description: "Calming ocean sounds for better sleep",
      value: "30min track",
      rarity: "common",
      icon: <Music className="h-5 w-5 text-blue-500" />,
      unlocked: false,
    },
    {
      type: "quote",
      title: "Luna's Wisdom",
      description: "Exclusive motivational quote from Luna",
      value: "Personal message",
      rarity: "rare",
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      unlocked: false,
    },
    {
      type: "wallpaper",
      title: "Dreamy Landscape",
      description: "Beautiful sleep-themed wallpaper",
      value: "HD wallpaper",
      rarity: "common",
      icon: <Palette className="h-5 w-5 text-green-500" />,
      unlocked: false,
    },
    {
      type: "points",
      title: "Bonus Points",
      description: "Extra SleepVision points",
      value: 100,
      rarity: "common",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      unlocked: false,
    },
    {
      type: "voice",
      title: "Luna Voice Pack",
      description: "New voice style for Luna",
      value: "Zen Master Luna",
      rarity: "epic",
      icon: <Volume2 className="h-5 w-5 text-indigo-500" />,
      unlocked: false,
    },
    {
      type: "badge",
      title: "Sleep Champion",
      description: "Exclusive profile badge",
      value: "Limited edition",
      rarity: "legendary",
      icon: <Trophy className="h-5 w-5 text-gold-500" />,
      unlocked: false,
    },
  ];

  useEffect(() => {
    // Load streak data
    const savedStreak = localStorage.getItem("streakData");
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak));
    }

    // Check if user can open chest today
    const lastChestOpen = localStorage.getItem("lastChestOpen");
    const today = new Date().toDateString();
    setCanOpenChest(lastChestOpen !== today);
  }, []);

  const openDailyChest = () => {
    if (!canOpenChest) return;

    // Select random reward based on rarity
    const rand = Math.random();
    let selectedReward;

    if (rand < 0.05) {
      // 5% legendary
      selectedReward = possibleRewards.find((r) => r.rarity === "legendary");
    } else if (rand < 0.15) {
      // 10% epic
      selectedReward = possibleRewards.find((r) => r.rarity === "epic");
    } else if (rand < 0.35) {
      // 20% rare
      selectedReward = possibleRewards.find((r) => r.rarity === "rare");
    } else {
      // 65% common
      selectedReward = possibleRewards.find((r) => r.rarity === "common");
    }

    if (!selectedReward) {
      selectedReward = possibleRewards[0]; // fallback
    }

    selectedReward.unlocked = true;
    setTodayReward(selectedReward);
    setShowChest(false);
    setShowReward(true);
    setCanOpenChest(false);

    // Save that chest was opened today
    localStorage.setItem("lastChestOpen", new Date().toDateString());

    // Award points
    if (selectedReward.type === "points") {
      const newStreak = {
        ...streak,
        totalPoints: streak.totalPoints + (selectedReward.value as number),
      };
      setStreak(newStreak);
      localStorage.setItem("streakData", JSON.stringify(newStreak));
    }
  };

  const getStreakMessage = (current: number) => {
    if (current >= 30) return "🔥 LEGENDARY STREAK! You're a sleep warrior! 🔥";
    if (current >= 14)
      return "⭐ Amazing streak! You're building incredible habits!";
    if (current >= 7) return "🌟 Great streak! You're on fire!";
    if (current >= 3) return "💪 Building momentum! Keep it up!";
    return "🚀 Start your streak journey today!";
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary":
        return "bg-gradient-to-r from-yellow-400 to-orange-500";
      case "epic":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "rare":
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  const getStreakColor = (current: number) => {
    if (current >= 30) return "text-purple-500";
    if (current >= 14) return "text-blue-500";
    if (current >= 7) return "text-green-500";
    if (current >= 3) return "text-yellow-500";
    return "text-gray-500";
  };

  const getLevelProgress = () => {
    const pointsForNextLevel = (streak.level + 1) * 100;
    const pointsInCurrentLevel = streak.totalPoints % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <Card className="bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-200 overflow-hidden">
        <CardContent className="p-8 relative">
          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-4 left-4 w-2 h-2 bg-orange-400/40 rounded-full animate-ping"></div>
            <div
              className="absolute top-8 right-8 w-1 h-1 bg-red-400/60 rounded-full animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-6 left-12 w-3 h-3 bg-pink-400/30 rounded-full animate-ping"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="mb-6">
              <div
                className={`text-8xl font-black mb-4 ${getStreakColor(streak.current)} drop-shadow-lg`}
              >
                <Flame className="h-16 w-16 inline mr-4" />
                {streak.current}
              </div>
              <h2 className="text-3xl font-bold text-sleep-night mb-2">
                Day Streak!
              </h2>
              <p className="text-lg text-sleep-night/70">
                {getStreakMessage(streak.current)}
              </p>
            </div>

            {/* Streak visualization */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(Math.min(streak.current, 14))].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-8 bg-gradient-to-t from-orange-500 to-yellow-500 rounded-sm shadow-sm animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
              {streak.current > 14 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 rounded-full">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-bold text-purple-700">
                    +{streak.current - 14}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {streak.longest}
            </div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Star className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {streak.totalPoints}
            </div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {streak.level}
            </div>
            <div className="text-sm text-muted-foreground">Current Level</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-6">
            <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">
              {achievements.filter((a) => a.unlocked).length}
            </div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Chest */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Daily Treasure Chest
          </CardTitle>
          <CardDescription>
            Open your daily chest to earn exclusive rewards!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            {canOpenChest ? (
              <div>
                <div className="mb-6">
                  <div className="relative inline-block">
                    <Gift className="h-24 w-24 text-yellow-600 animate-bounce" />
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                </div>
                <Button
                  onClick={() => setShowChest(true)}
                  className="btn-gradient text-white font-bold px-8 py-3 text-lg hover:scale-105 transition-transform"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Open Today's Chest
                </Button>
              </div>
            ) : (
              <div className="py-8">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Chest already opened today! Come back tomorrow for new
                  rewards.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Level {streak.level}</span>
            <span className="text-sm text-muted-foreground">
              {streak.totalPoints % 100}/100 XP
            </span>
          </div>
          <Progress value={getLevelProgress()} className="h-3 mb-4" />
          <p className="text-sm text-muted-foreground">
            {100 - (streak.totalPoints % 100)} more points to level{" "}
            {streak.level + 1}!
          </p>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border transition-all ${
                  achievement.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {achievement.unlocked ? (
                      achievement.icon
                    ) : (
                      <div className="opacity-50">{achievement.icon}</div>
                    )}
                    <div>
                      <h4
                        className={`font-semibold ${
                          achievement.unlocked ? "text-green-700" : ""
                        }`}
                      >
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="bg-green-500 text-white">
                      +{achievement.points}
                    </Badge>
                  )}
                </div>
                <Progress
                  value={(achievement.progress / achievement.maxProgress) * 100}
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {achievement.progress}/{achievement.maxProgress}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theme Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Unlocked Themes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {availableThemes.map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  theme.unlocked
                    ? currentTheme === theme.id
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary/50"
                    : "border-muted opacity-50 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (theme.unlocked) {
                    setCurrentTheme(theme.id);
                  }
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {theme.unlocked ? (
                    <Unlock className="h-4 w-4 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span
                    className={`font-medium ${
                      theme.unlocked ? "" : "text-muted-foreground"
                    }`}
                  >
                    {theme.name}
                  </span>
                </div>
                {!theme.unlocked && (
                  <p className="text-xs text-muted-foreground">
                    Unlock at level{" "}
                    {theme.id === "zen"
                      ? 3
                      : theme.id === "retro"
                        ? 5
                        : theme.id === "sunrise"
                          ? 7
                          : 10}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chest Opening Dialog */}
      <Dialog open={showChest} onOpenChange={setShowChest}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">Daily Treasure Chest</DialogTitle>
            <DialogDescription>
              Click the chest to reveal your reward!
            </DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={openDailyChest}
            >
              <Gift className="h-32 w-32 text-yellow-600 mx-auto animate-pulse" />
            </div>
            <p className="mt-4 text-muted-foreground">
              Tap to open and discover your reward!
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Reveal Dialog */}
      <Dialog open={showReward} onOpenChange={setShowReward}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Reward Unlocked!</DialogTitle>
          </DialogHeader>
          {todayReward && (
            <div className="py-6">
              <div
                className={`inline-block p-6 rounded-full ${getRarityColor(todayReward.rarity)} mb-4`}
              >
                {todayReward.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{todayReward.title}</h3>
              <p className="text-muted-foreground mb-4">
                {todayReward.description}
              </p>
              <Badge
                className={`text-white ${
                  todayReward.rarity === "legendary"
                    ? "bg-yellow-500"
                    : todayReward.rarity === "epic"
                      ? "bg-purple-500"
                      : todayReward.rarity === "rare"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                }`}
              >
                {todayReward.rarity.toUpperCase()}
              </Badge>
            </div>
          )}
          <Button onClick={() => setShowReward(false)} className="w-full">
            Awesome!
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
