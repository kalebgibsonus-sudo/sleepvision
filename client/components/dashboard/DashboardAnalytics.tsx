import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Target,
  Star,
  Activity,
  Users,
  Zap,
  Brain,
  Heart,
  Moon,
  Coffee,
  Award,
  Timer,
  Flame,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  Share2,
  Filter,
  RefreshCw,
  Eye,
  ThumbsUp,
  MessageSquare,
  Bookmark,
  Trophy,
  Crown,
  Sparkles,
  LineChart,
  PieChart,
  BarChart,
  MapPin,
  Globe,
  Smartphone,
} from "lucide-react";

interface AnalyticsData {
  daily: {
    date: string;
    goals: number;
    completed: number;
    streak: number;
    mood: number;
    sleep: number;
    energy: number;
  }[];
  weekly: {
    week: string;
    totalGoals: number;
    completionRate: number;
    averageMood: number;
    streakDays: number;
    totalSessions: number;
  }[];
  monthly: {
    month: string;
    goals: number;
    achievements: number;
    totalTime: number;
    productivity: number;
  }[];
}

interface Insights {
  id: string;
  type: "success" | "warning" | "info" | "achievement";
  title: string;
  description: string;
  recommendation: string;
  impact: "high" | "medium" | "low";
  category: string;
  actionable: boolean;
}

interface UserStats {
  totalGoals: number;
  completedGoals: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalTime: string;
  averageMood: number;
  sleepScore: number;
  productivity: number;
  rank: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  badges: number;
  achievements: number;
}

const DashboardAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">(
    "daily",
  );
  const [selectedMetric, setSelectedMetric] = useState<string>("overview");
  const [isLoading, setIsLoading] = useState(false);

  const [userStats, setUserStats] = useState<UserStats>({
    totalGoals: 156,
    completedGoals: 124,
    currentStreak: 12,
    longestStreak: 28,
    totalSessions: 89,
    totalTime: "43h 22m",
    averageMood: 8.2,
    sleepScore: 7.8,
    productivity: 87,
    rank: "Discipline Master",
    level: 15,
    xp: 2840,
    nextLevelXp: 3000,
    badges: 23,
    achievements: 47,
  });

  const [insights, setInsights] = useState<Insights[]>([
    {
      id: "1",
      type: "success",
      title: "Exceptional Consistency",
      description: "Your 12-day streak is above the 90th percentile of users.",
      recommendation: "Consider setting a new challenge to maintain momentum.",
      impact: "high",
      category: "streaks",
      actionable: true,
    },
    {
      id: "2",
      type: "warning",
      title: "Sleep Pattern Alert",
      description: "Your sleep quality has decreased by 15% this week.",
      recommendation: "Try establishing a consistent bedtime routine.",
      impact: "medium",
      category: "health",
      actionable: true,
    },
    {
      id: "3",
      type: "achievement",
      title: "Productivity Milestone",
      description: "You've reached 87% productivity - a personal best!",
      recommendation: "Share your success strategies with the community.",
      impact: "high",
      category: "productivity",
      actionable: true,
    },
    {
      id: "4",
      type: "info",
      title: "Peak Performance Window",
      description: "Your most productive hours are between 9-11 AM.",
      recommendation: "Schedule important tasks during this time.",
      impact: "medium",
      category: "optimization",
      actionable: false,
    },
  ]);

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    daily: [
      {
        date: "2024-01-15",
        goals: 5,
        completed: 4,
        streak: 12,
        mood: 8,
        sleep: 7.5,
        energy: 8,
      },
      {
        date: "2024-01-14",
        goals: 6,
        completed: 6,
        streak: 11,
        mood: 9,
        sleep: 8.2,
        energy: 9,
      },
      {
        date: "2024-01-13",
        goals: 4,
        completed: 3,
        streak: 10,
        mood: 7,
        sleep: 6.8,
        energy: 7,
      },
      {
        date: "2024-01-12",
        goals: 5,
        completed: 5,
        streak: 9,
        mood: 8.5,
        sleep: 8.0,
        energy: 8,
      },
      {
        date: "2024-01-11",
        goals: 7,
        completed: 6,
        streak: 8,
        mood: 8,
        sleep: 7.3,
        energy: 8,
      },
      {
        date: "2024-01-10",
        goals: 5,
        completed: 5,
        streak: 7,
        mood: 9,
        sleep: 8.5,
        energy: 9,
      },
      {
        date: "2024-01-09",
        goals: 6,
        completed: 4,
        streak: 6,
        mood: 7.5,
        sleep: 7.0,
        energy: 7,
      },
    ],
    weekly: [
      {
        week: "Week 3",
        totalGoals: 35,
        completionRate: 85,
        averageMood: 8.1,
        streakDays: 6,
        totalSessions: 12,
      },
      {
        week: "Week 2",
        totalGoals: 42,
        completionRate: 78,
        averageMood: 7.8,
        streakDays: 5,
        totalSessions: 14,
      },
      {
        week: "Week 1",
        totalGoals: 38,
        completionRate: 92,
        averageMood: 8.5,
        streakDays: 7,
        totalSessions: 15,
      },
      {
        week: "Last Week",
        totalGoals: 40,
        completionRate: 88,
        averageMood: 8.2,
        streakDays: 6,
        totalSessions: 13,
      },
    ],
    monthly: [
      {
        month: "January",
        goals: 156,
        achievements: 12,
        totalTime: 52,
        productivity: 87,
      },
      {
        month: "December",
        goals: 145,
        achievements: 10,
        totalTime: 48,
        productivity: 82,
      },
      {
        month: "November",
        goals: 132,
        achievements: 8,
        totalTime: 45,
        productivity: 79,
      },
      {
        month: "October",
        goals: 128,
        achievements: 9,
        totalTime: 43,
        productivity: 85,
      },
    ],
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update some metrics with small random changes
      setUserStats((prev) => ({
        ...prev,
        xp: prev.xp + Math.floor(Math.random() * 10),
        productivity: Math.max(
          0,
          Math.min(100, prev.productivity + (Math.random() - 0.5) * 2),
        ),
        averageMood: Math.max(
          0,
          Math.min(10, prev.averageMood + (Math.random() - 0.5) * 0.2),
        ),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const completionRate = Math.round(
    (userStats.completedGoals / userStats.totalGoals) * 100,
  );
  const levelProgress = Math.round(
    (userStats.xp / userStats.nextLevelXp) * 100,
  );

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate data refresh
    }, 1000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
        return <TrendingDown className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "achievement":
        return <Trophy className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricTrend = (current: number, previous: number) => {
    if (current > previous)
      return {
        direction: "up",
        color: "text-green-500",
        icon: <ArrowUp className="h-3 w-3" />,
      };
    if (current < previous)
      return {
        direction: "down",
        color: "text-red-500",
        icon: <ArrowDown className="h-3 w-3" />,
      };
    return {
      direction: "stable",
      color: "text-gray-500",
      icon: <Minus className="h-3 w-3" />,
    };
  };

  const StatCard = ({ title, value, subtitle, icon, trend }: any) => (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold">{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-xs ${trend.color}`}>
                {trend.icon}
                <span>{subtitle}</span>
              </div>
            )}
          </div>
          {!trend && subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </Card>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              Personal Analytics Dashboard
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Comprehensive insights into your discipline journey
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-3 w-3 mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Goals"
                value={userStats.totalGoals}
                subtitle={`${completionRate}% completed`}
                icon={<Target className="h-5 w-5" />}
                trend={getMetricTrend(userStats.totalGoals, 140)}
              />

              <StatCard
                title="Current Streak"
                value={`${userStats.currentStreak} days`}
                subtitle="Personal best!"
                icon={<Flame className="h-5 w-5" />}
                trend={getMetricTrend(userStats.currentStreak, 10)}
              />

              <StatCard
                title="Level & XP"
                value={`Level ${userStats.level}`}
                subtitle={`${userStats.xp}/${userStats.nextLevelXp} XP`}
                icon={<Crown className="h-5 w-5" />}
              />

              <StatCard
                title="Productivity"
                value={`${Math.round(userStats.productivity)}%`}
                subtitle="Above average"
                icon={<TrendingUp className="h-5 w-5" />}
                trend={getMetricTrend(userStats.productivity, 82)}
              />
            </div>

            {/* Progress Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Level Progress</h3>
                    <span className="text-xs text-muted-foreground">
                      {levelProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.nextLevelXp - userStats.xp} XP to Level{" "}
                    {userStats.level + 1}
                  </p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">Goal Completion</h3>
                    <span className="text-xs text-muted-foreground">
                      {completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userStats.completedGoals} of {userStats.totalGoals} goals
                    completed
                  </p>
                </div>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-3 text-center">
                <Badge className="mb-2 bg-yellow-500">
                  <Award className="h-3 w-3 mr-1" />
                  Rank
                </Badge>
                <p className="font-bold text-sm">{userStats.rank}</p>
              </Card>

              <Card className="p-3 text-center">
                <Badge className="mb-2 bg-blue-500">
                  <Timer className="h-3 w-3 mr-1" />
                  Time
                </Badge>
                <p className="font-bold text-sm">{userStats.totalTime}</p>
              </Card>

              <Card className="p-3 text-center">
                <Badge className="mb-2 bg-green-500">
                  <Heart className="h-3 w-3 mr-1" />
                  Mood
                </Badge>
                <p className="font-bold text-sm">
                  {userStats.averageMood.toFixed(1)}/10
                </p>
              </Card>

              <Card className="p-3 text-center">
                <Badge className="mb-2 bg-purple-500">
                  <Moon className="h-3 w-3 mr-1" />
                  Sleep
                </Badge>
                <p className="font-bold text-sm">
                  {userStats.sleepScore.toFixed(1)}/10
                </p>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card className="p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                Recent Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Streak Master</p>
                    <p className="text-xs text-muted-foreground">
                      Completed 10+ day streak
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Star className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm">Goal Crusher</p>
                    <p className="text-xs text-muted-foreground">
                      80%+ completion rate
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Zap className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Energy Booster</p>
                    <p className="text-xs text-muted-foreground">
                      High energy 7 days straight
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm">Mindfulness Expert</p>
                    <p className="text-xs text-muted-foreground">
                      100+ meditation sessions
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Timeframe Selection */}
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Performance Analysis</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={timeframe === "daily" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("daily")}
                >
                  Daily
                </Button>
                <Button
                  variant={timeframe === "weekly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("weekly")}
                >
                  Weekly
                </Button>
                <Button
                  variant={timeframe === "monthly" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Goal Completion Trend
                </h4>
                <div className="space-y-2">
                  {analyticsData.daily.slice(0, 5).map((day, index) => {
                    const completion = Math.round(
                      (day.completed / day.goals) * 100,
                    );
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-16">
                          {new Date(day.date).toLocaleDateString("en", {
                            weekday: "short",
                          })}
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${completion}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8">
                          {completion}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <LineChart className="h-4 w-4" />
                  Mood & Energy Levels
                </h4>
                <div className="space-y-3">
                  {analyticsData.daily.slice(0, 5).map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("en", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-red-500" />
                          <span className="text-xs">{day.mood}/10</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs">{day.energy}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  Category Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Health & Fitness</span>
                    <Badge>32%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personal Growth</span>
                    <Badge>28%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Productivity</span>
                    <Badge>25%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Relationships</span>
                    <Badge>15%</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Distribution
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Morning Routine</span>
                    <span className="text-xs text-muted-foreground">
                      2h 15m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exercise</span>
                    <span className="text-xs text-muted-foreground">
                      1h 30m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Meditation</span>
                    <span className="text-xs text-muted-foreground">45m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reading</span>
                    <span className="text-xs text-muted-foreground">
                      1h 12m
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">AI-Powered Insights</h3>
              <Badge className="bg-purple-500">
                <Brain className="h-3 w-3 mr-1" />
                AI Analysis
              </Badge>
            </div>

            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {insight.category}
                          </Badge>
                          <Badge
                            variant={
                              insight.impact === "high"
                                ? "destructive"
                                : insight.impact === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {insight.impact} impact
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">
                          💡 Recommendation:
                        </p>
                        <p className="text-sm text-blue-700">
                          {insight.recommendation}
                        </p>
                      </div>
                      {insight.actionable && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Take Action
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3 mr-1" />
                            Learn More
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* AI Insights Summary */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Weekly AI Summary</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  🎯 You're performing exceptionally well with an 87% goal
                  completion rate and 12-day streak.
                </p>
                <p className="text-sm">
                  🚀 Your productivity peaked on Tuesday mornings - consider
                  scheduling important tasks then.
                </p>
                <p className="text-sm">
                  💤 Sleep quality needs attention - maintaining consistent
                  bedtime could boost your energy by 15%.
                </p>
                <p className="text-sm">
                  ⭐ You're in the top 10% of users in your discipline category.
                  Keep up the amazing work!
                </p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Long-term Trends</h3>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select className="text-sm border rounded px-2 py-1">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
            </div>

            {/* Trend Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Positive Trends
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Goal Completion Rate</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Mood</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs">+0.8</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Streak Consistency</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs">+24%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Frequency</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowUp className="h-3 w-3" />
                      <span className="text-xs">+18%</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-yellow-500" />
                  Areas for Improvement
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Sleep Quality</span>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-xs">-0.4</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Evening Routine</span>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-xs">-8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekend Consistency</span>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Minus className="h-3 w-3" />
                      <span className="text-xs">0%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Social Goals</span>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <ArrowDown className="h-3 w-3" />
                      <span className="text-xs">-5%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Monthly Comparison */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Monthly Progress Comparison</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analyticsData.monthly.map((month, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {month.month}
                    </p>
                    <p className="font-bold text-lg">{month.goals}</p>
                    <p className="text-xs text-muted-foreground">goals</p>
                    <div className="mt-2 flex justify-center">
                      <Badge
                        variant={index === 0 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {month.productivity}% productive
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Seasonal Patterns */}
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Seasonal Patterns & Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Best Performance Days</h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tuesday</span>
                      <Badge className="bg-green-500">92% avg</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Wednesday</span>
                      <Badge className="bg-green-500">89% avg</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Thursday</span>
                      <Badge className="bg-blue-500">86% avg</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Peak Hours</h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>9:00 - 11:00 AM</span>
                      <Badge className="bg-purple-500">Peak</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>2:00 - 4:00 PM</span>
                      <Badge className="bg-blue-500">Good</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>7:00 - 9:00 PM</span>
                      <Badge className="bg-yellow-500">Moderate</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardAnalytics;
