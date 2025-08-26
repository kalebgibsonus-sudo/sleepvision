import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Flame,
  Target,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Brain,
  Star,
  Trophy,
  Timer,
  Plus,
  BarChart3,
  MessageCircle,
  Zap,
  Award,
  Shield,
  Clock,
  Snowflake,
  Phone,
  Sunrise,
  Moon,
  Dumbbell,
  Book,
} from "lucide-react";

interface DisciplineEntry {
  id: string;
  date: string;
  tasks: {
    wakeOnTime: boolean;
    morningRoutine: boolean;
    meditation: boolean;
    exercise: boolean;
    noSnooze: boolean;
    phoneFreeBedtime: boolean;
    bedOnTime: boolean;
  };
  customWin?: string;
  customFail?: string;
  moodRating: number;
  notes: string;
  score: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  tasks: string[];
  currentDay: number;
  isActive: boolean;
  completed: boolean;
  reward: string;
}

interface DisciplineBuilderPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function DisciplineBuilderPage({
  onNavigate,
  onGoHome,
}: DisciplineBuilderPageProps) {
  const [entries, setEntries] = useState<DisciplineEntry[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [lunaMessage, setLunaMessage] = useState("");
  const [showLunaChat, setShowLunaChat] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem("disciplineEntries");
    const savedChallenges = localStorage.getItem("disciplineChallenges");

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    if (savedChallenges) {
      setChallenges(JSON.parse(savedChallenges));
    } else {
      // Initialize with default challenges
      const defaultChallenges: Challenge[] = [
        {
          id: "7-day-cold-shower",
          title: "7-Day Cold Shower Challenge",
          description: "End every shower with 30 seconds of cold water",
          duration: 7,
          tasks: ["Cold shower finish"],
          currentDay: 0,
          isActive: false,
          completed: false,
          reward: "Ice Badge + 1 Free Week",
        },
        {
          id: "3-day-no-snooze",
          title: "3 Days No Snooze",
          description: "Wake up immediately when alarm goes off",
          duration: 3,
          tasks: ["No snooze button"],
          currentDay: 0,
          isActive: false,
          completed: false,
          reward: "Early Bird Badge",
        },
        {
          id: "morning-monk-mode",
          title: "Morning Monk Mode",
          description: "No phone for first hour after waking",
          duration: 7,
          tasks: ["Phone-free morning hour"],
          currentDay: 0,
          isActive: false,
          completed: false,
          reward: "Mindful Morning Badge",
        },
      ];
      setChallenges(defaultChallenges);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("disciplineEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("disciplineChallenges", JSON.stringify(challenges));
  }, [challenges]);

  // Calculate today's score
  const calculateTodayScore = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = entries.find((e) => e.date === today);

    if (!todayEntry) return 0;

    const tasks = todayEntry.tasks;
    const completedTasks = Object.values(tasks).filter(Boolean).length;
    const totalTasks = Object.keys(tasks).length;

    return Math.round((completedTasks / totalTasks) * 100);
  };

  // Calculate streaks
  const calculateStreaks = () => {
    const streaks = {
      wakeOnTime: 0,
      noSnooze: 0,
      morningRoutine: 0,
      meditation: 0,
      phoneFreeBedtime: 0,
    };

    const sortedEntries = entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    for (const [task, _] of Object.entries(streaks)) {
      for (const entry of sortedEntries) {
        if (entry.tasks[task as keyof typeof entry.tasks]) {
          streaks[task as keyof typeof streaks]++;
        } else {
          break;
        }
      }
    }

    return streaks;
  };

  // Calculate weekly discipline percentage
  const calculateWeeklyDiscipline = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weekEntries = entries.filter((e) => new Date(e.date) >= oneWeekAgo);
    if (weekEntries.length === 0) return 0;

    const totalScore = weekEntries.reduce((sum, entry) => sum + entry.score, 0);
    return Math.round(totalScore / weekEntries.length);
  };

  // Generate Luna AI feedback
  const generateLunaFeedback = () => {
    const todayScore = calculateTodayScore();
    const streaks = calculateStreaks();
    const weeklyDiscipline = calculateWeeklyDiscipline();

    let feedback = "";

    if (todayScore >= 90) {
      feedback =
        "Exceptional performance today! You're operating at peak discipline levels.";
    } else if (todayScore >= 75) {
      feedback = `Strong work today with ${todayScore}%. You're building serious momentum.`;
    } else if (todayScore >= 50) {
      feedback = `You scored ${todayScore}% today. Room for improvement - let's optimize tomorrow.`;
    } else {
      feedback = `Today was challenging (${todayScore}%). Tomorrow is a fresh opportunity to excel.`;
    }

    // Add streak encouragement
    const maxStreak = Math.max(...Object.values(streaks));
    if (maxStreak >= 7) {
      feedback += ` Your ${maxStreak}-day streak demonstrates exceptional consistency.`;
    } else if (maxStreak >= 3) {
      feedback += ` Continue building on your ${maxStreak}-day streak.`;
    }

    return feedback;
  };

  const addDisciplineEntry = (entryData: Partial<DisciplineEntry>) => {
    const tasks = entryData.tasks || {
      wakeOnTime: false,
      morningRoutine: false,
      meditation: false,
      exercise: false,
      noSnooze: false,
      phoneFreeBedtime: false,
      bedOnTime: false,
    };

    const completedTasks = Object.values(tasks).filter(Boolean).length;
    const score = Math.round(
      (completedTasks / Object.keys(tasks).length) * 100,
    );

    const newEntry: DisciplineEntry = {
      id: Date.now().toString(),
      date: entryData.date || new Date().toISOString().split("T")[0],
      tasks,
      customWin: entryData.customWin || "",
      customFail: entryData.customFail || "",
      moodRating: entryData.moodRating || 5,
      notes: entryData.notes || "",
      score,
    };

    setEntries([newEntry, ...entries.filter((e) => e.date !== newEntry.date)]);
    setShowEntryForm(false);
  };

  const startChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, isActive: true, currentDay: 1 } : c,
      ),
    );
  };

  const todayScore = calculateTodayScore();
  const streaks = calculateStreaks();
  const weeklyDiscipline = calculateWeeklyDiscipline();
  const lunaFeedback = generateLunaFeedback();

  // Badge system
  const badges = [
    {
      name: "Starter",
      requirement: 3,
      achieved: Math.max(...Object.values(streaks)) >= 3,
      icon: Star,
    },
    {
      name: "Consistent",
      requirement: 7,
      achieved: Math.max(...Object.values(streaks)) >= 7,
      icon: Award,
    },
    {
      name: "Elite",
      requirement: 30,
      achieved: Math.max(...Object.values(streaks)) >= 30,
      icon: Trophy,
    },
  ];

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center bg-blue-600 text-white p-8 rounded-lg">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-10 h-10" />
          <h1 className="text-4xl font-bold">DISCIPLINE CENTER</h1>
        </div>
        <p className="text-xl text-blue-100">Your Daily Excellence Hub</p>
      </div>

      {/* Log Today's Discipline - MAIN FEATURE AT TOP */}
      <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-blue-50 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-yellow-500 rounded-full">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-blue-800">
                LOG TODAY'S DISCIPLINE
              </h2>
            </div>
            <p className="text-lg text-blue-700 mb-6">
              Track your daily progress and build unstoppable momentum
            </p>

            <Button
              onClick={() => setShowEntryForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 font-bold text-xl rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6 mr-3" />
              LOG MY DISCIPLINE NOW
            </Button>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Quick & Easy</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                <span>Takes 2 Minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span>Build Streaks</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Score - Main Feature */}
      <Card className="border-2 border-blue-300 bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="text-7xl font-bold text-blue-600 mb-4">
              {todayScore}
            </div>
            <div className="text-2xl font-semibold text-gray-800 mb-6">
              TODAY'S DISCIPLINE SCORE
            </div>
            <Progress value={todayScore} className="w-full h-6" />
          </div>

          {/* Luna AI Feedback */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    Luna AI Analysis
                  </h3>
                  <p className="text-blue-700 leading-relaxed">
                    {lunaFeedback}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLunaChat(true)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Streak Zone */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-700">
            <Flame className="w-6 h-6" />
            Current Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(streaks).map(([task, count]) => (
              <div
                key={task}
                className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {count}
                </div>
                <div className="text-sm text-blue-700 font-medium capitalize">
                  {task.replace(/([A-Z])/g, " $1")}
                </div>
                <div className="mt-3">
                  {count > 0 && (
                    <div className="flex items-center justify-center">
                      <Flame className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-600 font-medium ml-1">
                        {count} days
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Badges */}
          <div className="mt-8">
            <h3 className="font-semibold text-blue-700 mb-4 text-lg">
              Achievement Badges
            </h3>
            <div className="flex gap-6 justify-center">
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg text-center border-2 ${
                      badge.achieved
                        ? "bg-blue-50 border-blue-400"
                        : "bg-gray-50 border-gray-300"
                    }`}
                  >
                    <IconComponent
                      className={`w-8 h-8 mx-auto mb-2 ${
                        badge.achieved ? "text-blue-600" : "text-gray-400"
                      }`}
                    />
                    <div className="text-sm font-medium text-gray-800">
                      {badge.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {badge.requirement} days
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-700">
            <BarChart3 className="w-6 h-6" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {weeklyDiscipline}%
            </div>
            <div className="text-gray-700 font-medium">Average This Week</div>
          </div>
          <Progress value={weeklyDiscipline} className="h-4 mb-4" />
          <div className="text-center text-blue-700 font-medium">
            {weeklyDiscipline >= 80 && "Outstanding weekly performance!"}
            {weeklyDiscipline >= 60 &&
              weeklyDiscipline < 80 &&
              "Strong progress this week"}
            {weeklyDiscipline < 60 && "Focus on consistency this week"}
          </div>
        </CardContent>
      </Card>

      {/* Mini Challenges */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-700">
            <Target className="w-6 h-6" />
            Active Challenges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className={`p-5 rounded-lg border-2 ${
                  challenge.isActive
                    ? "bg-blue-50 border-blue-400"
                    : challenge.completed
                      ? "bg-blue-25 border-blue-300"
                      : "bg-gray-50 border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {challenge.title}
                  </h3>
                  {challenge.isActive && (
                    <Badge className="bg-blue-500 text-white">
                      Day {challenge.currentDay}/{challenge.duration}
                    </Badge>
                  )}
                  {challenge.completed && (
                    <Badge className="bg-blue-600 text-white">Completed</Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{challenge.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">
                    Reward: {challenge.reward}
                  </span>
                  {!challenge.isActive && !challenge.completed && (
                    <Button
                      onClick={() => startChallenge(challenge.id)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Start Challenge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Discipline Log Form Modal */}
      {showEntryForm && (
        <Dialog open={showEntryForm} onOpenChange={setShowEntryForm}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-blue-700">
                Daily Discipline Log
              </DialogTitle>
            </DialogHeader>

            <DisciplineEntryForm
              onSubmit={addDisciplineEntry}
              onCancel={() => setShowEntryForm(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Luna Chat Modal */}
      {showLunaChat && (
        <Dialog open={showLunaChat} onOpenChange={setShowLunaChat}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-700">
                <Brain className="w-5 h-5" />
                Chat with Luna
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-800">{lunaFeedback}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-gray-700">Ask Luna something:</Label>
                <Textarea
                  placeholder="How can I improve my discipline? What should I focus on tomorrow?"
                  rows={3}
                  className="border-gray-300"
                />
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Send Message
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Discipline Entry Form Component
function DisciplineEntryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    tasks: {
      wakeOnTime: false,
      morningRoutine: false,
      meditation: false,
      exercise: false,
      noSnooze: false,
      phoneFreeBedtime: false,
      bedOnTime: false,
    },
    customWin: "",
    customFail: "",
    moodRating: 5,
    notes: "",
  });

  const taskLabels = {
    wakeOnTime: "Woke up on time",
    morningRoutine: "Completed morning routine",
    meditation: "Meditated",
    exercise: "Exercised",
    noSnooze: "No snooze button",
    phoneFreeBedtime: "Phone-free bedtime",
    bedOnTime: "Went to bed on time",
  };

  const handleTaskChange = (task: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="date" className="text-gray-700">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, date: e.target.value }))
          }
          className="border-gray-300"
        />
      </div>

      <div>
        <Label className="text-base font-semibold text-gray-800">
          Daily Tasks
        </Label>
        <div className="mt-4 space-y-3">
          {Object.entries(taskLabels).map(([task, label]) => (
            <div
              key={task}
              className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center gap-3">
                {formData.tasks[task as keyof typeof formData.tasks] ? (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="font-medium text-gray-800">{label}</span>
              </div>
              <Switch
                checked={formData.tasks[task as keyof typeof formData.tasks]}
                onCheckedChange={(checked) => handleTaskChange(task, checked)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customWin" className="text-gray-700">
            Custom Win Today
          </Label>
          <Input
            id="customWin"
            placeholder="e.g., Read for 30 minutes"
            value={formData.customWin}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customWin: e.target.value }))
            }
            className="border-gray-300"
          />
        </div>

        <div>
          <Label htmlFor="customFail" className="text-gray-700">
            Custom Fail Today
          </Label>
          <Input
            id="customFail"
            placeholder="e.g., Scrolled social media for 45 mins"
            value={formData.customFail}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, customFail: e.target.value }))
            }
            className="border-gray-300"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="moodRating" className="text-gray-700">
          Rate Your Day (1-5)
        </Label>
        <Select
          value={formData.moodRating.toString()}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, moodRating: parseInt(value) }))
          }
        >
          <SelectTrigger className="border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 - Needs Improvement</SelectItem>
            <SelectItem value="2">2 - Below Average</SelectItem>
            <SelectItem value="3">3 - Average</SelectItem>
            <SelectItem value="4">4 - Good</SelectItem>
            <SelectItem value="5">5 - Excellent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes" className="text-gray-700">
          Notes
        </Label>
        <Textarea
          id="notes"
          placeholder="How did today go? What will you improve tomorrow?"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          rows={3}
          className="border-gray-300"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-gray-300 text-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={() => onSubmit(formData)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Entry
        </Button>
      </div>
    </div>
  );
}
