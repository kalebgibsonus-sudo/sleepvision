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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Coffee,
  Smartphone,
  Book,
  Droplets,
  Dumbbell,
  Sun,
  Moon,
  Calendar,
  TrendingUp,
  CheckCircle,
  Target,
  Award,
  Flame,
  Star,
} from "lucide-react";

interface Habit {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "sleep" | "morning" | "evening" | "health";
  targetDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  points: number;
  color: string;
}

interface DailyProgress {
  date: string;
  completedHabits: string[];
  totalHabits: number;
}

export function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "no-caffeine-after-3pm",
      name: "No caffeine after 3 PM",
      description: "Avoid coffee, tea, and energy drinks after 3 PM",
      icon: <Coffee className="h-5 w-5" />,
      category: "sleep",
      targetDays: 30,
      completedDays: 12,
      currentStreak: 3,
      longestStreak: 7,
      completedToday: false,
      points: 20,
      color: "text-amber-600",
    },
    {
      id: "no-phone-in-bed",
      name: "No phone in bed",
      description: "Keep devices away from bedroom",
      icon: <Smartphone className="h-5 w-5" />,
      category: "sleep",
      targetDays: 30,
      completedDays: 8,
      currentStreak: 2,
      longestStreak: 5,
      completedToday: false,
      points: 25,
      color: "text-blue-600",
    },
    {
      id: "morning-journaling",
      name: "Morning journaling",
      description: "Write 3 gratitude items or daily intentions",
      icon: <Book className="h-5 w-5" />,
      category: "morning",
      targetDays: 30,
      completedDays: 15,
      currentStreak: 5,
      longestStreak: 8,
      completedToday: true,
      points: 30,
      color: "text-purple-600",
    },
    {
      id: "morning-hydration",
      name: "Morning hydration",
      description: "Drink a glass of water within 30 minutes of waking",
      icon: <Droplets className="h-5 w-5" />,
      category: "morning",
      targetDays: 30,
      completedDays: 20,
      currentStreak: 7,
      longestStreak: 12,
      completedToday: true,
      points: 15,
      color: "text-cyan-600",
    },
    {
      id: "morning-exercise",
      name: "Morning movement",
      description: "15 minutes of exercise or stretching",
      icon: <Dumbbell className="h-5 w-5" />,
      category: "morning",
      targetDays: 30,
      completedDays: 9,
      currentStreak: 2,
      longestStreak: 4,
      completedToday: false,
      points: 35,
      color: "text-green-600",
    },
    {
      id: "morning-sunlight",
      name: "Morning sunlight",
      description: "Get 10 minutes of natural light exposure",
      icon: <Sun className="h-5 w-5" />,
      category: "morning",
      targetDays: 30,
      completedDays: 18,
      currentStreak: 6,
      longestStreak: 9,
      completedToday: false,
      points: 20,
      color: "text-yellow-600",
    },
    {
      id: "evening-routine",
      name: "Consistent bedtime",
      description: "Go to bed within 30 minutes of target time",
      icon: <Moon className="h-5 w-5" />,
      category: "evening",
      targetDays: 30,
      completedDays: 11,
      currentStreak: 4,
      longestStreak: 6,
      completedToday: false,
      points: 40,
      color: "text-indigo-600",
    },
  ]);

  const [weeklyProgress, setWeeklyProgress] = useState<DailyProgress[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Load saved habits from localStorage
    const savedHabits = localStorage.getItem("userHabits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    // Generate weekly progress data
    generateWeeklyProgress();
  }, []);

  const generateWeeklyProgress = () => {
    const progress: DailyProgress[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // In production, this would fetch real user habit completion data
      const completedHabits: string[] = []; // Start with empty state for new users

      progress.push({
        date: date.toISOString().split("T")[0],
        completedHabits,
        totalHabits: habits.length,
      });
    }

    setWeeklyProgress(progress);
  };

  const toggleHabit = (habitId: string) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedToday;
        const newCompleted = !wasCompleted;

        return {
          ...habit,
          completedToday: newCompleted,
          completedDays: newCompleted
            ? habit.completedDays + 1
            : Math.max(0, habit.completedDays - 1),
          currentStreak: newCompleted
            ? habit.currentStreak + 1
            : wasCompleted
              ? 0
              : habit.currentStreak,
          longestStreak: newCompleted
            ? Math.max(habit.longestStreak, habit.currentStreak + 1)
            : habit.longestStreak,
        };
      }
      return habit;
    });

    setHabits(updatedHabits);
    localStorage.setItem("userHabits", JSON.stringify(updatedHabits));
  };

  const getFilteredHabits = () => {
    if (selectedCategory === "all") return habits;
    return habits.filter((habit) => habit.category === selectedCategory);
  };

  const getTotalProgress = () => {
    const completedToday = habits.filter((h) => h.completedToday).length;
    return (completedToday / habits.length) * 100;
  };

  const getTotalPoints = () => {
    return habits
      .filter((h) => h.completedToday)
      .reduce((sum, h) => sum + h.points, 0);
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 21) return { text: "🔥 Master", color: "bg-red-500" };
    if (streak >= 14) return { text: "⭐ Champion", color: "bg-yellow-500" };
    if (streak >= 7) return { text: "💪 Strong", color: "bg-green-500" };
    if (streak >= 3) return { text: "🌱 Growing", color: "bg-blue-500" };
    return { text: "🚀 Start", color: "bg-gray-500" };
  };

  const categories = [
    { id: "all", name: "All Habits", icon: <Target className="h-4 w-4" /> },
    { id: "sleep", name: "Sleep", icon: <Moon className="h-4 w-4" /> },
    { id: "morning", name: "Morning", icon: <Sun className="h-4 w-4" /> },
    { id: "evening", name: "Evening", icon: <Moon className="h-4 w-4" /> },
    { id: "health", name: "Health", icon: <Dumbbell className="h-4 w-4" /> },
  ];

  const completedToday = habits.filter((h) => h.completedToday).length;
  const totalHabits = habits.length;

  return (
    <div className="space-y-6">
      {/* Daily Progress Overview */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-black text-green-600 mb-2">
                {completedToday}
              </div>
              <div className="text-sm text-muted-foreground">
                Completed Today
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(getTotalProgress())}%
              </div>
              <div className="text-sm text-muted-foreground">
                Daily Progress
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                <Star className="h-6 w-6 inline mr-1" />
                {getTotalPoints()}
              </div>
              <div className="text-sm text-muted-foreground">Points Today</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                <Flame className="h-6 w-6 inline mr-1" />
                {Math.max(...habits.map((h) => h.currentStreak))}
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Daily Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedToday}/{totalHabits}
              </span>
            </div>
            <Progress value={getTotalProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            {category.name}
          </Button>
        ))}
      </div>

      {/* Habits List */}
      <div className="grid md:grid-cols-2 gap-4">
        {getFilteredHabits().map((habit) => {
          const badge = getStreakBadge(habit.currentStreak);
          return (
            <Card
              key={habit.id}
              className={`transition-all duration-200 ${
                habit.completedToday
                  ? "bg-green-50 border-green-200 shadow-md"
                  : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        habit.completedToday ? "bg-green-500/20" : "bg-muted/50"
                      }`}
                    >
                      <div className={habit.color}>{habit.icon}</div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sleep-night mb-1">
                        {habit.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {habit.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge className={badge.color + " text-white text-xs"}>
                          {badge.text}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {habit.currentStreak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Checkbox
                      checked={habit.completedToday}
                      onCheckedChange={() => toggleHabit(habit.id)}
                      className="h-6 w-6"
                    />
                    <span className="text-xs text-muted-foreground">
                      +{habit.points} pts
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {habit.completedDays}/{habit.targetDays} days
                    </span>
                  </div>
                  <Progress
                    value={(habit.completedDays / habit.targetDays) * 100}
                    className="h-2"
                  />
                </div>

                <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                  <span>Best: {habit.longestStreak} days</span>
                  <span>
                    {Math.round((habit.completedDays / habit.targetDays) * 100)}
                    % complete
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Progress
          </CardTitle>
          <CardDescription>
            Your habit completion over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 justify-center">
            {weeklyProgress.map((day, index) => {
              const completionRate =
                (day.completedHabits.length / day.totalHabits) * 100;
              const date = new Date(day.date);

              return (
                <div key={day.date} className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-sm ${
                      completionRate === 100
                        ? "bg-green-500 text-white border-green-600"
                        : completionRate >= 75
                          ? "bg-green-200 text-green-800 border-green-300"
                          : completionRate >= 50
                            ? "bg-yellow-200 text-yellow-800 border-yellow-300"
                            : completionRate >= 25
                              ? "bg-orange-200 text-orange-800 border-orange-300"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {day.completedHabits.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(completionRate)}%
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Habit Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: "Consistency Champion",
                description: "Complete all habits for 7 days straight",
                progress: 4,
                target: 7,
                icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
                unlocked: false,
              },
              {
                title: "Sleep Master",
                description: "Complete all sleep habits for 14 days",
                progress: 8,
                target: 14,
                icon: <Moon className="h-5 w-5 text-indigo-500" />,
                unlocked: false,
              },
              {
                title: "Morning Warrior",
                description: "Complete morning routine 21 days",
                progress: 15,
                target: 21,
                icon: <Sun className="h-5 w-5 text-yellow-500" />,
                unlocked: false,
              },
            ].map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  achievement.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-muted/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {achievement.icon}
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <Progress
                  value={(achievement.progress / achievement.target) * 100}
                  className="h-2 mb-2"
                />
                <div className="text-xs text-muted-foreground">
                  {achievement.progress}/{achievement.target} days
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Celebration */}
      {completedToday === totalHabits && (
        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h3 className="text-2xl font-bold text-green-700">
                Perfect Day! 🎉
              </h3>
            </div>
            <p className="text-green-600 mb-4">
              You've completed all your habits today! You're building incredible
              healthy patterns.
            </p>
            <Badge className="bg-green-500 text-white text-lg px-6 py-2">
              +{getTotalPoints()} Bonus Points Earned!
            </Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
