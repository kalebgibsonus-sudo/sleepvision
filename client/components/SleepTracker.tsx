import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Moon,
  Sun,
  TrendingUp,
  Flame,
  Trophy,
  Star,
  Zap,
  Heart,
  Clock,
  Target,
} from "lucide-react";

interface SleepEntry {
  date: string;
  bedtime: string;
  wakeTime: string;
  sleepQuality: number;
  mood: string;
  energyLevel: number;
  notes?: string;
}

interface StreakData {
  current: number;
  longest: number;
  weeklyGoal: number;
  completed: number;
}

export function SleepTracker() {
  const [currentEntry, setCurrentEntry] = useState<Partial<SleepEntry>>({
    date: new Date().toISOString().split("T")[0],
    sleepQuality: 7,
    energyLevel: 7,
  });
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [streak, setStreak] = useState<StreakData>({
    current: 0,
    longest: 0,
    weeklyGoal: 7,
    completed: 0,
  });
  const [viewMode, setViewMode] = useState<"log" | "trends">("log");

  useEffect(() => {
    // Load saved data from localStorage
    const savedEntries = localStorage.getItem("sleepEntries");
    const savedStreak = localStorage.getItem("sleepStreak");

    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak));
    }
  }, []);

  const calculateSleepDuration = () => {
    if (!currentEntry.bedtime || !currentEntry.wakeTime) return 0;

    const bedtime = new Date(`2024-01-01 ${currentEntry.bedtime}`);
    let wakeTime = new Date(`2024-01-01 ${currentEntry.wakeTime}`);

    if (wakeTime <= bedtime) {
      wakeTime = new Date(`2024-01-02 ${currentEntry.wakeTime}`);
    }

    return (
      Math.round(
        ((wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60)) * 10,
      ) / 10
    );
  };

  const saveSleepEntry = () => {
    if (!currentEntry.bedtime || !currentEntry.wakeTime || !currentEntry.mood) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEntry: SleepEntry = {
      ...currentEntry,
      date: currentEntry.date || new Date().toISOString().split("T")[0],
      sleepQuality: currentEntry.sleepQuality || 7,
      energyLevel: currentEntry.energyLevel || 7,
    } as SleepEntry;

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem("sleepEntries", JSON.stringify(updatedEntries));

    // Update streak
    const newStreak = {
      ...streak,
      current: streak.current + 1,
      longest: Math.max(streak.longest, streak.current + 1),
      completed: streak.completed + 1,
    };
    setStreak(newStreak);
    localStorage.setItem("sleepStreak", JSON.stringify(newStreak));

    // Reset form
    setCurrentEntry({
      date: new Date().toISOString().split("T")[0],
      sleepQuality: 7,
      energyLevel: 7,
    });

    toast({
      title: "Sleep Logged! 🌙",
      description: `Great job! You're on a ${newStreak.current} day streak!`,
    });
  };

  const getStreakColor = (current: number) => {
    if (current >= 30) return "text-purple-500";
    if (current >= 14) return "text-blue-500";
    if (current >= 7) return "text-green-500";
    if (current >= 3) return "text-yellow-500";
    return "text-gray-500";
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-500";
    if (quality >= 6) return "text-yellow-500";
    return "text-red-500";
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "excellent":
        return "😴";
      case "good":
        return "😊";
      case "fair":
        return "😐";
      case "poor":
        return "😫";
      case "terrible":
        return "🤢";
      default:
        return "😐";
    }
  };

  const recentEntries = entries.slice(-7).reverse();
  const averageQuality =
    entries.length > 0
      ? Math.round(
          (entries.reduce((sum, entry) => sum + entry.sleepQuality, 0) /
            entries.length) *
            10,
        ) / 10
      : 0;

  return (
    <div className="space-y-6">
      {/* Streak Display */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div
                className={`text-4xl font-black mb-2 ${getStreakColor(streak.current)}`}
              >
                <Flame className="h-8 w-8 inline mr-2" />
                {streak.current}
              </div>
              <div className="text-sm text-muted-foreground">
                Current Streak
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                <Trophy className="h-6 w-6 inline mr-2" />
                {streak.longest}
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">
                <Target className="h-6 w-6 inline mr-2" />
                {averageQuality}
              </div>
              <div className="text-sm text-muted-foreground">Avg Quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                <Star className="h-6 w-6 inline mr-2" />
                {entries.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Logs</div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Weekly Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.min(streak.completed % 7, streak.weeklyGoal)}/
                {streak.weeklyGoal}
              </span>
            </div>
            <Progress
              value={
                (Math.min(streak.completed % 7, streak.weeklyGoal) /
                  streak.weeklyGoal) *
                100
              }
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === "log" ? "default" : "outline"}
          onClick={() => setViewMode("log")}
          className="flex-1"
        >
          <Moon className="h-4 w-4 mr-2" />
          Log Sleep
        </Button>
        <Button
          variant={viewMode === "trends" ? "default" : "outline"}
          onClick={() => setViewMode("trends")}
          className="flex-1"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          View Trends
        </Button>
      </div>

      {viewMode === "log" ? (
        /* Sleep Logging Form */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Log Your Sleep
            </CardTitle>
            <CardDescription>
              Track your sleep to build healthy patterns and earn streak rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={currentEntry.date}
                onChange={(e) =>
                  setCurrentEntry({ ...currentEntry, date: e.target.value })
                }
                className="mt-1"
              />
            </div>

            {/* Sleep Times */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="bedtime"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Bedtime
                </Label>
                <Input
                  id="bedtime"
                  type="time"
                  value={currentEntry.bedtime || ""}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      bedtime: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label
                  htmlFor="wakeTime"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Wake Time
                </Label>
                <Input
                  id="wakeTime"
                  type="time"
                  value={currentEntry.wakeTime || ""}
                  onChange={(e) =>
                    setCurrentEntry({
                      ...currentEntry,
                      wakeTime: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            {/* Sleep Duration Display */}
            {currentEntry.bedtime && currentEntry.wakeTime && (
              <div className="p-4 bg-sleep-accent/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-sleep-primary" />
                  <span className="font-medium">Sleep Duration: </span>
                  <span className="text-lg font-bold text-sleep-primary">
                    {calculateSleepDuration()}h
                  </span>
                </div>
              </div>
            )}

            {/* Sleep Quality */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Sleep Quality (1-10)
              </Label>
              <div className="px-4">
                <Slider
                  value={[currentEntry.sleepQuality || 7]}
                  onValueChange={(value) =>
                    setCurrentEntry({ ...currentEntry, sleepQuality: value[0] })
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Poor</span>
                  <span
                    className={`font-bold ${getQualityColor(currentEntry.sleepQuality || 7)}`}
                  >
                    {currentEntry.sleepQuality || 7}/10
                  </span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>

            {/* Morning Mood */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                How did you feel when you woke up?
              </Label>
              <RadioGroup
                value={currentEntry.mood}
                onValueChange={(value) =>
                  setCurrentEntry({ ...currentEntry, mood: value })
                }
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="mood1" />
                    <label htmlFor="mood1" className="text-sm">
                      😴 Refreshed
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="mood2" />
                    <label htmlFor="mood2" className="text-sm">
                      😊 Good
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="mood3" />
                    <label htmlFor="mood3" className="text-sm">
                      😐 Okay
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="mood4" />
                    <label htmlFor="mood4" className="text-sm">
                      😫 Groggy
                    </label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Energy Level */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Morning Energy Level (1-10)
              </Label>
              <div className="px-4">
                <Slider
                  value={[currentEntry.energyLevel || 7]}
                  onValueChange={(value) =>
                    setCurrentEntry({ ...currentEntry, energyLevel: value[0] })
                  }
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Exhausted</span>
                  <span className="font-bold text-primary">
                    {currentEntry.energyLevel || 7}/10
                  </span>
                  <span>Energized</span>
                </div>
              </div>
            </div>

            <Button
              onClick={saveSleepEntry}
              className="w-full btn-gradient text-white font-semibold"
            >
              <Heart className="h-4 w-4 mr-2" />
              Log Sleep & Build Streak
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Trends View */
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sleep Trends
            </CardTitle>
            <CardDescription>
              Your sleep patterns over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length === 0 ? (
              <div className="text-center py-8">
                <Moon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No sleep data yet. Start logging to see trends!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div
                    key={entry.date}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <Separator orientation="vertical" className="h-12" />
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            Quality
                          </div>
                          <div
                            className={`text-lg font-bold ${getQualityColor(entry.sleepQuality)}`}
                          >
                            {entry.sleepQuality}/10
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            Mood
                          </div>
                          <div className="text-lg">
                            {getMoodEmoji(entry.mood)}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-muted-foreground">
                            Energy
                          </div>
                          <div className="text-sm font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {entry.energyLevel}/10
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {entry.bedtime} - {entry.wakeTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {(() => {
                          const bedtime = new Date(
                            `2024-01-01 ${entry.bedtime}`,
                          );
                          let wakeTime = new Date(
                            `2024-01-01 ${entry.wakeTime}`,
                          );
                          if (wakeTime <= bedtime) {
                            wakeTime = new Date(`2024-01-02 ${entry.wakeTime}`);
                          }
                          return (
                            Math.round(
                              ((wakeTime.getTime() - bedtime.getTime()) /
                                (1000 * 60 * 60)) *
                                10,
                            ) / 10
                          );
                        })()}
                        h sleep
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
