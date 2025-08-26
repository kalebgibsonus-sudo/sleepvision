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
  Sun,
  Cloud,
  CloudRain,
  Snow,
  Zap,
  Heart,
  Trophy,
  Target,
  Quote,
  TrendingUp,
  Calendar,
  Clock,
  Sparkles,
  Star,
  Gift,
  CheckCircle,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: React.ReactNode;
}

interface MotivationalQuote {
  text: string;
  author: string;
}

interface TodayHighlight {
  time: string;
  activity: string;
  icon: React.ReactNode;
  completed: boolean;
}

export function MorningDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 72,
    condition: "Sunny",
    description: "Perfect morning weather",
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
  });
  const [quote, setQuote] = useState<MotivationalQuote>({
    text: "Every morning is a new opportunity to become the person you want to be.",
    author: "Luna",
  });
  const [sleepScore, setSleepScore] = useState(85);
  const [streakCount, setStreakCount] = useState(7);

  // Today's routine highlights
  const [todayHighlights, setTodayHighlights] = useState<TodayHighlight[]>([
    {
      time: "6:30 AM",
      activity: "Morning sunlight exposure",
      icon: <Sun className="h-4 w-4 text-yellow-500" />,
      completed: false,
    },
    {
      time: "7:00 AM",
      activity: "Hydrate & stretch",
      icon: <Zap className="h-4 w-4 text-blue-500" />,
      completed: false,
    },
    {
      time: "7:30 AM",
      activity: "Mindful breakfast",
      icon: <Heart className="h-4 w-4 text-red-500" />,
      completed: false,
    },
    {
      time: "8:00 AM",
      activity: "Review daily goals",
      icon: <Target className="h-4 w-4 text-green-500" />,
      completed: false,
    },
  ]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Load user data
  useEffect(() => {
    // Simulate loading data from localStorage or API
    const savedScore = localStorage.getItem("lastSleepScore");
    const savedStreak = localStorage.getItem("sleepStreak");

    if (savedScore) {
      setSleepScore(parseInt(savedScore));
    }
    if (savedStreak) {
      const streakData = JSON.parse(savedStreak);
      setStreakCount(streakData.current || 0);
    }

    // Simulate weather API call
    fetchWeather();

    // Get daily quote
    getDailyQuote();
  }, []);

  const fetchWeather = async () => {
    // Simulate weather API - in real app would use actual weather service
    const conditions = [
      {
        condition: "Sunny",
        description: "Perfect morning weather",
        icon: <Sun className="h-6 w-6 text-yellow-500" />,
        temp: 72,
      },
      {
        condition: "Partly Cloudy",
        description: "Mild and pleasant",
        icon: <Cloud className="h-6 w-6 text-gray-500" />,
        temp: 68,
      },
      {
        condition: "Rainy",
        description: "Cozy indoor vibes",
        icon: <CloudRain className="h-6 w-6 text-blue-500" />,
        temp: 65,
      },
    ];

    const randomCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    setWeather({
      temperature: randomCondition.temp,
      condition: randomCondition.condition,
      description: randomCondition.description,
      icon: randomCondition.icon,
    });
  };

  const getDailyQuote = () => {
    const quotes = [
      {
        text: "Every sunrise is an invitation to brighten someone's day.",
        author: "Luna",
      },
      {
        text: "Your energy tomorrow depends on your choices today.",
        author: "Luna",
      },
      {
        text: "Sleep is the golden chain that ties health and our bodies together.",
        author: "Thomas Dekker",
      },
      {
        text: "The way you start your morning sets the tone for the entire day.",
        author: "Luna",
      },
      {
        text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.",
        author: "Ralph Marston",
      },
    ];

    const today = new Date().getDate();
    const selectedQuote = quotes[today % quotes.length];
    setQuote(selectedQuote);
  };

  const completeActivity = (index: number) => {
    const updated = [...todayHighlights];
    updated[index].completed = true;
    setTodayHighlights(updated);

    // Save to localStorage
    localStorage.setItem("todayHighlights", JSON.stringify(updated));
  };

  const getSleepScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getSleepScoreMessage = (score: number) => {
    if (score >= 80)
      return "Excellent sleep! You're energized and ready to conquer the day! 🌟";
    if (score >= 60)
      return "Good sleep! A few tweaks could make it even better. 😊";
    return "Your sleep needs attention. Let's work together to improve it tonight. 💙";
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return "Good early morning";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const completedCount = todayHighlights.filter((h) => h.completed).length;
  const progressPercentage = (completedCount / todayHighlights.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header with greeting and time */}
      <Card className="bg-gradient-to-r from-orange-400/10 via-yellow-400/10 to-amber-400/10 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-sleep-night mb-2">
                {getGreeting()}! ☀️
              </h1>
              <p className="text-lg text-sleep-night/70">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-2xl font-semibold text-sleep-primary">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {weather.icon}
                <span className="text-xl font-semibold">
                  {weather.temperature}°F
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {weather.condition}
              </p>
              <p className="text-xs text-muted-foreground">
                {weather.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Quote from Luna */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-full">
              <Quote className="h-6 w-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sleep-night mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Luna's Daily Inspiration
              </h3>
              <blockquote className="text-lg italic text-sleep-night/80 mb-2">
                "{quote.text}"
              </blockquote>
              <cite className="text-sm text-muted-foreground">
                — {quote.author}
              </cite>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sleep Score & Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sleep Score & Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div
                className={`text-4xl font-black mb-2 ${getSleepScoreColor(sleepScore)}`}
              >
                {sleepScore}
              </div>
              <div className="text-sm text-muted-foreground">Sleep Score</div>
              <Progress value={sleepScore} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                <Trophy className="h-6 w-6 inline mr-1" />
                {streakCount}
              </div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
            <div className="text-center">
              <Badge
                variant={sleepScore >= 80 ? "default" : "secondary"}
                className="text-sm"
              >
                {sleepScore >= 80
                  ? "🌟 Excellent"
                  : sleepScore >= 60
                    ? "😊 Good"
                    : "🔄 Improving"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 p-4 bg-sleep-accent/10 rounded-lg">
            <p className="text-sm text-sleep-night/80">
              💡 <strong>Luna says:</strong> {getSleepScoreMessage(sleepScore)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Routine Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Routine Highlights
          </CardTitle>
          <CardDescription>
            Complete your morning activities to build healthy habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{todayHighlights.length} completed
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          <div className="space-y-3">
            {todayHighlights.map((highlight, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                  highlight.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-muted/30 border-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{highlight.icon}</div>
                  <div>
                    <div className="font-medium text-sleep-night">
                      {highlight.activity}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {highlight.time}
                    </div>
                  </div>
                </div>
                {highlight.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Button
                    size="sm"
                    onClick={() => completeActivity(index)}
                    className="btn-gradient text-white"
                  >
                    Complete
                  </Button>
                )}
              </div>
            ))}
          </div>

          {completedCount === todayHighlights.length && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-full">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-700">
                    🎉 Morning Routine Complete!
                  </h4>
                  <p className="text-sm text-green-600">
                    Fantastic work! You've earned 50 SleepVision points and a
                    streak bonus!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Heart className="h-6 w-6 mb-2 text-red-500" />
              <span className="font-medium">Log Sleep</span>
              <span className="text-xs text-muted-foreground">
                Track last night
              </span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Zap className="h-6 w-6 mb-2 text-blue-500" />
              <span className="font-medium">Quick Meditation</span>
              <span className="text-xs text-muted-foreground">5 min focus</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col">
              <Target className="h-6 w-6 mb-2 text-green-500" />
              <span className="font-medium">Set Today's Goals</span>
              <span className="text-xs text-muted-foreground">
                Plan your day
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
