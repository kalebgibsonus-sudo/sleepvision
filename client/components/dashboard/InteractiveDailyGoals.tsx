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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Circle,
  Target,
  Star,
  Award,
  Plus,
  Edit,
  Trash2,
  Clock,
  Calendar,
  Flame,
  Zap,
  Trophy,
  Gift,
  Sparkles,
  Heart,
  Brain,
  Coffee,
  Moon,
  Sun,
  Dumbbell,
  Book,
  Music,
  Camera,
  Utensils,
  Phone,
  Mail,
  Home,
  Car,
  Plane,
  Gamepad2,
  Tv,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Briefcase,
  Users,
  MessageSquare,
  Share2,
  Bookmark,
  FileText,
  Settings,
  Search,
  Filter,
  RotateCcw,
  Shuffle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Gauge,
  Timer,
  Stopwatch,
  AlarmClock,
  Bell,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  Square,
  SkipForward,
  Repeat,
  FastForward,
  Rewind,
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  category:
    | "health"
    | "wellness"
    | "productivity"
    | "personal"
    | "learning"
    | "social";
  priority: "low" | "medium" | "high" | "urgent";
  completed: boolean;
  progress: number;
  maxProgress: number;
  estimatedTime: number; // in minutes
  deadline?: Date;
  streak: number;
  reward: {
    xp: number;
    coins: number;
    badge?: string;
  };
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
  icon: string;
}

interface DailyStats {
  completedGoals: number;
  totalGoals: number;
  xpEarned: number;
  coinsEarned: number;
  streakCount: number;
  perfectDays: number;
  currentStreak: number;
  longestStreak: number;
}

interface Celebration {
  id: string;
  type:
    | "goal_completed"
    | "streak_milestone"
    | "perfect_day"
    | "level_up"
    | "badge_earned";
  message: string;
  emoji: string;
  rewards: {
    xp?: number;
    coins?: number;
    badge?: string;
  };
  timestamp: Date;
}

export function InteractiveDailyGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete Morning Routine",
      description: "Meditation, exercise, and healthy breakfast",
      category: "wellness",
      priority: "high",
      completed: true,
      progress: 3,
      maxProgress: 3,
      estimatedTime: 45,
      streak: 7,
      reward: { xp: 50, coins: 25, badge: "Morning Warrior" },
      createdAt: new Date(),
      completedAt: new Date(),
      tags: ["routine", "health"],
      icon: "🌅",
    },
    {
      id: "2",
      title: "Drink 8 Glasses of Water",
      description: "Stay hydrated throughout the day",
      category: "health",
      priority: "medium",
      completed: false,
      progress: 5,
      maxProgress: 8,
      estimatedTime: 5,
      streak: 3,
      reward: { xp: 25, coins: 15 },
      createdAt: new Date(),
      tags: ["health", "hydration"],
      icon: "💧",
    },
    {
      id: "3",
      title: "Read for 30 Minutes",
      description: 'Continue reading "Atomic Habits"',
      category: "learning",
      priority: "medium",
      completed: false,
      progress: 0,
      maxProgress: 30,
      estimatedTime: 30,
      deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
      streak: 0,
      reward: { xp: 40, coins: 20, badge: "Bookworm" },
      createdAt: new Date(),
      tags: ["learning", "books"],
      icon: "📚",
    },
  ]);

  const [dailyStats, setDailyStats] = useState<DailyStats>({
    completedGoals: 1,
    totalGoals: 3,
    xpEarned: 50,
    coinsEarned: 25,
    streakCount: 7,
    perfectDays: 12,
    currentStreak: 7,
    longestStreak: 15,
  });

  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "wellness" as Goal["category"],
    priority: "medium" as Goal["priority"],
    estimatedTime: 30,
    maxProgress: 1,
    icon: "🎯",
  });
  const [filter, setFilter] = useState<
    "all" | "completed" | "pending" | "overdue"
  >("all");
  const [sortBy, setSortBy] = useState<
    "priority" | "deadline" | "category" | "streak"
  >("priority");
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [isInFocusMode, setIsInFocusMode] = useState(false);
  const [focusTimer, setFocusTimer] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const motivationalQuotes = [
    "Progress, not perfection! 🌟",
    "Every small step counts! 👣",
    "You're building unstoppable momentum! 🚀",
    "Consistency is your superpower! ⚡",
    "Today's actions shape tomorrow's results! 🎯",
    "You've got this! Keep pushing forward! 💪",
    "Small wins lead to big victories! 🏆",
    "Your dedication is inspiring! ✨",
  ];

  // Update motivational quote
  useEffect(() => {
    const updateQuote = () => {
      const randomQuote =
        motivationalQuotes[
          Math.floor(Math.random() * motivationalQuotes.length)
        ];
      setMotivationalQuote(randomQuote);
    };

    updateQuote();
    const interval = setInterval(updateQuote, 30000); // Change every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Focus mode timer
  useEffect(() => {
    if (isInFocusMode) {
      const interval = setInterval(() => {
        setFocusTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isInFocusMode]);

  const handleGoalToggle = (goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const wasCompleted = goal.completed;
          const newCompleted = !wasCompleted;

          if (newCompleted && !wasCompleted) {
            // Goal completed - trigger celebration
            triggerCelebration("goal_completed", goal);

            // Update stats
            setDailyStats((prevStats) => ({
              ...prevStats,
              completedGoals: prevStats.completedGoals + 1,
              xpEarned: prevStats.xpEarned + goal.reward.xp,
              coinsEarned: prevStats.coinsEarned + goal.reward.coins,
            }));

            return {
              ...goal,
              completed: true,
              progress: goal.maxProgress,
              completedAt: new Date(),
              streak: goal.streak + 1,
            };
          } else if (!newCompleted && wasCompleted) {
            // Goal uncompleted
            setDailyStats((prevStats) => ({
              ...prevStats,
              completedGoals: Math.max(0, prevStats.completedGoals - 1),
              xpEarned: Math.max(0, prevStats.xpEarned - goal.reward.xp),
              coinsEarned: Math.max(
                0,
                prevStats.coinsEarned - goal.reward.coins,
              ),
            }));

            return {
              ...goal,
              completed: false,
              progress: Math.max(0, goal.progress - 1),
              completedAt: undefined,
            };
          }
        }
        return goal;
      }),
    );
  };

  const handleProgressUpdate = (goalId: string, newProgress: number) => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id === goalId) {
          const updatedGoal = {
            ...goal,
            progress: Math.min(newProgress, goal.maxProgress),
          };

          // Auto-complete if progress reaches max
          if (
            updatedGoal.progress === updatedGoal.maxProgress &&
            !updatedGoal.completed
          ) {
            updatedGoal.completed = true;
            updatedGoal.completedAt = new Date();
            triggerCelebration("goal_completed", updatedGoal);
          }

          return updatedGoal;
        }
        return goal;
      }),
    );
  };

  const triggerCelebration = (type: Celebration["type"], goal?: Goal) => {
    let celebration: Celebration;

    switch (type) {
      case "goal_completed":
        celebration = {
          id: Date.now().toString(),
          type,
          message: `🎉 Amazing! You completed "${goal?.title}"!`,
          emoji: "🎉",
          rewards: goal?.reward || {},
          timestamp: new Date(),
        };
        break;
      case "streak_milestone":
        celebration = {
          id: Date.now().toString(),
          type,
          message: `��� Incredible! ${dailyStats.currentStreak} day streak!`,
          emoji: "🔥",
          rewards: { xp: 100, coins: 50 },
          timestamp: new Date(),
        };
        break;
      case "perfect_day":
        celebration = {
          id: Date.now().toString(),
          type,
          message: `⭐ Perfect day! All goals completed!`,
          emoji: "⭐",
          rewards: { xp: 200, coins: 100, badge: "Perfect Day" },
          timestamp: new Date(),
        };
        break;
      default:
        return;
    }

    setCelebrations((prev) => [celebration, ...prev.slice(0, 4)]);

    // Remove celebration after 5 seconds
    setTimeout(() => {
      setCelebrations((prev) => prev.filter((c) => c.id !== celebration.id));
    }, 5000);
  };

  const addNewGoal = () => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      priority: newGoal.priority,
      completed: false,
      progress: 0,
      maxProgress: newGoal.maxProgress,
      estimatedTime: newGoal.estimatedTime,
      streak: 0,
      reward: {
        xp: newGoal.estimatedTime * 2,
        coins: newGoal.estimatedTime,
        badge: newGoal.priority === "high" ? "High Achiever" : undefined,
      },
      createdAt: new Date(),
      tags: [],
      icon: newGoal.icon,
    };

    setGoals((prev) => [...prev, goal]);
    setDailyStats((prev) => ({ ...prev, totalGoals: prev.totalGoals + 1 }));
    setShowNewGoalDialog(false);
    setNewGoal({
      title: "",
      description: "",
      category: "wellness",
      priority: "medium",
      estimatedTime: 30,
      maxProgress: 1,
      icon: "🎯",
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
    setDailyStats((prev) => ({
      ...prev,
      totalGoals: Math.max(0, prev.totalGoals - 1),
    }));
  };

  const startFocusMode = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsInFocusMode(true);
    setFocusTimer(0);
  };

  const stopFocusMode = () => {
    setIsInFocusMode(false);
    setFocusTimer(0);
    setSelectedGoal(null);
  };

  const getFilteredGoals = () => {
    let filtered = goals;

    switch (filter) {
      case "completed":
        filtered = goals.filter((goal) => goal.completed);
        break;
      case "pending":
        filtered = goals.filter((goal) => !goal.completed);
        break;
      case "overdue":
        filtered = goals.filter(
          (goal) =>
            !goal.completed && goal.deadline && goal.deadline < new Date(),
        );
        break;
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "deadline":
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.getTime() - b.deadline.getTime();
        case "category":
          return a.category.localeCompare(b.category);
        case "streak":
          return b.streak - a.streak;
        default:
          return 0;
      }
    });
  };

  const getPriorityColor = (priority: Goal["priority"]) => {
    switch (priority) {
      case "urgent":
        return "border-red-500 bg-red-50";
      case "high":
        return "border-orange-500 bg-orange-50";
      case "medium":
        return "border-yellow-500 bg-yellow-50";
      case "low":
        return "border-green-500 bg-green-50";
    }
  };

  const getCategoryIcon = (category: Goal["category"]) => {
    switch (category) {
      case "health":
        return <Heart className="h-4 w-4" />;
      case "wellness":
        return <Star className="h-4 w-4" />;
      case "productivity":
        return <Target className="h-4 w-4" />;
      case "personal":
        return <Users className="h-4 w-4" />;
      case "learning":
        return <Book className="h-4 w-4" />;
      case "social":
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const completionPercentage =
    (dailyStats.completedGoals / dailyStats.totalGoals) * 100;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Celebrations Overlay */}
      {celebrations.map((celebration) => (
        <div
          key={celebration.id}
          className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-2xl animate-bounce max-w-sm"
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">{celebration.emoji}</div>
            <div>
              <div className="font-bold">{celebration.message}</div>
              {celebration.rewards.xp && (
                <div className="text-sm opacity-90">
                  +{celebration.rewards.xp} XP, +{celebration.rewards.coins}{" "}
                  coins
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Focus Mode Overlay */}
      {isInFocusMode && selectedGoal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center">
          <Card className="bg-white p-8 text-center max-w-md mx-4">
            <div className="text-4xl mb-4">{selectedGoal.icon}</div>
            <h3 className="text-2xl font-bold mb-2">{selectedGoal.title}</h3>
            <div className="text-6xl font-mono text-blue-600 mb-6">
              {formatTime(focusTimer)}
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={stopFocusMode} variant="outline">
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
              <Button
                onClick={() => handleGoalToggle(selectedGoal.id)}
                className="bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Header Stats */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-blue-700">
                Daily Goals Dashboard
              </CardTitle>
              <p className="text-blue-600 mt-1">{motivationalQuote}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-600 text-white">
                Level {Math.floor(dailyStats.xpEarned / 100) + 1}
              </Badge>
              <Dialog
                open={showNewGoalDialog}
                onOpenChange={setShowNewGoalDialog}
              >
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Goal
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Goal title"
                      value={newGoal.title}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    <Textarea
                      placeholder="Description"
                      value={newGoal.description}
                      onChange={(e) =>
                        setNewGoal((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <select
                        value={newGoal.category}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            category: e.target.value as Goal["category"],
                          }))
                        }
                        className="p-2 border rounded"
                      >
                        <option value="wellness">Wellness</option>
                        <option value="health">Health</option>
                        <option value="productivity">Productivity</option>
                        <option value="personal">Personal</option>
                        <option value="learning">Learning</option>
                        <option value="social">Social</option>
                      </select>
                      <select
                        value={newGoal.priority}
                        onChange={(e) =>
                          setNewGoal((prev) => ({
                            ...prev,
                            priority: e.target.value as Goal["priority"],
                          }))
                        }
                        className="p-2 border rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <Button onClick={addNewGoal} className="w-full">
                      Create Goal
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">
                {dailyStats.completedGoals}/{dailyStats.totalGoals}
              </div>
              <div className="text-sm text-blue-600">Goals</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {dailyStats.xpEarned}
              </div>
              <div className="text-sm text-yellow-500">XP Earned</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {dailyStats.coinsEarned}
              </div>
              <div className="text-sm text-green-500">Coins</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {dailyStats.currentStreak}
              </div>
              <div className="text-sm text-orange-500">Day Streak</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {dailyStats.perfectDays}
              </div>
              <div className="text-sm text-purple-500">Perfect Days</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Daily Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Filters and Controls */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={filter === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("overdue")}
              >
                Overdue
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="priority">Priority</option>
                <option value="deadline">Deadline</option>
                <option value="category">Category</option>
                <option value="streak">Streak</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredGoals().map((goal) => (
          <Card
            key={goal.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              goal.completed
                ? "bg-green-50 border-green-300"
                : getPriorityColor(goal.priority)
            } ${goal.completed ? "opacity-75" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGoalToggle(goal.id)}
                    className={`p-1 ${goal.completed ? "text-green-600" : "text-gray-400"}`}
                  >
                    {goal.completed ? (
                      <CheckCircle className="h-6 w-6 animate-bounce" />
                    ) : (
                      <Circle className="h-6 w-6 hover:text-blue-500" />
                    )}
                  </Button>
                  <div>
                    <h3
                      className={`font-bold ${goal.completed ? "line-through text-gray-600" : ""}`}
                    >
                      {goal.icon} {goal.title}
                    </h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {getCategoryIcon(goal.category)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 opacity-50 hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              {goal.maxProgress > 1 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {goal.progress}/{goal.maxProgress}
                    </span>
                  </div>
                  <Progress
                    value={(goal.progress / goal.maxProgress) * 100}
                    className="h-2"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleProgressUpdate(goal.id, goal.progress - 1)
                      }
                      disabled={goal.progress <= 0}
                    >
                      -
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleProgressUpdate(goal.id, goal.progress + 1)
                      }
                      disabled={goal.progress >= goal.maxProgress}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )}

              {/* Meta Info */}
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{goal.estimatedTime}m</span>
                </div>
                {goal.streak > 0 && (
                  <div className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span>{goal.streak} day streak</span>
                  </div>
                )}
              </div>

              {/* Rewards */}
              <div className="bg-white/80 rounded p-2 text-xs">
                <div className="flex justify-between">
                  <span>Rewards:</span>
                  <span>
                    +{goal.reward.xp} XP, +{goal.reward.coins} coins
                  </span>
                </div>
                {goal.reward.badge && (
                  <div className="text-purple-600 font-medium mt-1">
                    🏆 {goal.reward.badge}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startFocusMode(goal)}
                  className="flex-1"
                  disabled={goal.completed}
                >
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Focus
                </Button>
                {goal.completed && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-300"
                  >
                    <Gift className="h-4 w-4 mr-1" />
                    Claim
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Goal Prompt */}
      {goals.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="p-12 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              No goals yet!
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first goal to start your productive day.
            </p>
            <Button
              onClick={() => setShowNewGoalDialog(true)}
              className="bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
