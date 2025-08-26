import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Moon,
  Sun,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Award,
  Target,
  Activity,
  Brain,
  Heart,
  Zap,
  Gauge,
  Timer,
  AlarmClock,
  Bed,
  Coffee,
  Thermometer,
  Wind,
  Volume2,
  Eye,
  Phone,
  Smartphone,
  Lightbulb,
  Home,
  CloudRain,
  Snowflake,
  CloudLightning,
  Sunrise,
  Sunset,
  Droplets,
  Flame,
  Snowflake as ColdIcon,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Share2,
  Filter,
  Search,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  Square,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface SleepData {
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number; // in hours
  quality: number; // 1-10 scale
  deepSleep: number; // percentage
  remSleep: number; // percentage
  lightSleep: number; // percentage
  awakenings: number;
  sleepLatency: number; // minutes to fall asleep
  efficiency: number; // percentage
  restfulness: number; // 1-10 scale
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
  factors: {
    caffeine: boolean;
    alcohol: boolean;
    exercise: boolean;
    stress: boolean;
    screen: boolean;
    room_temp: number;
    noise_level: number;
    lighting: number;
  };
  notes?: string;
}

interface SleepTrends {
  avgDuration: number;
  avgQuality: number;
  avgEfficiency: number;
  bestSleepDay: string;
  worstSleepDay: string;
  consistencyScore: number;
  improvementRate: number;
  weeklyTrend: "improving" | "declining" | "stable";
  recommendations: string[];
}

interface SleepGoals {
  targetDuration: number;
  targetBedtime: string;
  targetWakeTime: string;
  targetQuality: number;
  consistencyGoal: number;
}

export function SleepQualityAnalyzer() {
  const { user } = useAuth();
  const [sleepData, setSleepData] = useState<SleepData[]>([]);
  const [trends, setTrends] = useState<SleepTrends>({
    avgDuration: 7.2,
    avgQuality: 7.8,
    avgEfficiency: 86,
    bestSleepDay: "2024-01-15",
    worstSleepDay: "2024-01-10",
    consistencyScore: 82,
    improvementRate: 15,
    weeklyTrend: "improving",
    recommendations: [
      "Try to maintain consistent bedtime",
      "Reduce screen time 1 hour before bed",
      "Consider cooler room temperature",
      "Practice relaxation techniques",
    ],
  });
  const [goals, setGoals] = useState<SleepGoals>({
    targetDuration: 8,
    targetBedtime: "22:30",
    targetWakeTime: "06:30",
    targetQuality: 8,
    consistencyGoal: 90,
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month" | "quarter">(
    "week",
  );
  const [analysisMode, setAnalysisMode] = useState<
    "quality" | "duration" | "efficiency" | "patterns"
  >("quality");
  const [isRecording, setIsRecording] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    currentPhase: "awake",
    heartRate: 65,
    movement: 2,
    roomTemp: 21,
    soundLevel: 25,
  });

  // Generate sample sleep data
  useEffect(() => {
    const generateSampleData = () => {
      const data: SleepData[] = [];
      const now = new Date();

      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const baseQuality = 7 + Math.sin(i * 0.1) * 2; // Simulate natural variation
        const quality = Math.max(
          3,
          Math.min(10, baseQuality + (Math.random() - 0.5) * 2),
        );
        const duration = 6.5 + Math.random() * 2.5; // 6.5-9 hours
        const efficiency = 70 + Math.random() * 25; // 70-95%

        data.push({
          date: date.toISOString().split("T")[0],
          bedtime: `${22 + Math.floor(Math.random() * 2)}:${Math.floor(
            Math.random() * 60,
          )
            .toString()
            .padStart(2, "0")}`,
          wakeTime: `${6 + Math.floor(Math.random() * 2)}:${Math.floor(
            Math.random() * 60,
          )
            .toString()
            .padStart(2, "0")}`,
          duration: Math.round(duration * 10) / 10,
          quality: Math.round(quality * 10) / 10,
          deepSleep: Math.round((15 + Math.random() * 15) * 10) / 10,
          remSleep: Math.round((20 + Math.random() * 10) * 10) / 10,
          lightSleep: Math.round((50 + Math.random() * 20) * 10) / 10,
          awakenings: Math.floor(Math.random() * 5),
          sleepLatency: Math.floor(5 + Math.random() * 25),
          efficiency: Math.round(efficiency * 10) / 10,
          restfulness: Math.round((quality + (Math.random() - 0.5)) * 10) / 10,
          mood: Math.round((quality + (Math.random() - 0.5) * 2) * 10) / 10,
          energy: Math.round((quality + (Math.random() - 0.5) * 2) * 10) / 10,
          factors: {
            caffeine: Math.random() > 0.7,
            alcohol: Math.random() > 0.8,
            exercise: Math.random() > 0.5,
            stress: Math.random() > 0.6,
            screen: Math.random() > 0.4,
            room_temp: Math.round((18 + Math.random() * 8) * 10) / 10,
            noise_level: Math.round(Math.random() * 50 * 10) / 10,
            lighting: Math.round(Math.random() * 30 * 10) / 10,
          },
        });
      }

      setSleepData(data);
    };

    generateSampleData();
  }, []);

  // Real-time data simulation
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRealTimeData((prev) => ({
          currentPhase: ["deep", "rem", "light", "awake"][
            Math.floor(Math.random() * 4)
          ],
          heartRate: 60 + Math.floor(Math.random() * 20),
          movement: Math.floor(Math.random() * 10),
          roomTemp: 20 + Math.random() * 4,
          soundLevel: Math.floor(Math.random() * 60),
        }));
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isRecording]);

  const getRecentData = () => {
    const days = viewMode === "week" ? 7 : viewMode === "month" ? 30 : 90;
    return sleepData.slice(-days);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return "text-green-600";
    if (quality >= 6) return "text-yellow-600";
    if (quality >= 4) return "text-orange-600";
    return "text-red-600";
  };

  const getQualityBg = (quality: number) => {
    if (quality >= 8) return "bg-green-500";
    if (quality >= 6) return "bg-yellow-500";
    if (quality >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "deep":
        return "text-blue-600";
      case "rem":
        return "text-purple-600";
      case "light":
        return "text-cyan-600";
      case "awake":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const renderChart = () => {
    const data = getRecentData();

    switch (analysisMode) {
      case "quality":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sleep Quality Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quality Chart */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Daily Quality Scores</h4>
                <div className="space-y-2">
                  {data.slice(-7).map((entry, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-xs w-16">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                          className={`h-4 rounded-full transition-all duration-1000 ${getQualityBg(entry.quality)}`}
                          style={{ width: `${(entry.quality / 10) * 100}%` }}
                        />
                        <span className="absolute right-2 top-0 text-xs text-white font-medium">
                          {entry.quality}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sleep Phases */}
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Sleep Phase Distribution</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Deep Sleep</span>
                    <span className="font-medium text-blue-600">
                      {trends.avgQuality > 7 ? "22%" : "18%"}
                    </span>
                  </div>
                  <Progress
                    value={trends.avgQuality > 7 ? 22 : 18}
                    className="h-2"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">REM Sleep</span>
                    <span className="font-medium text-purple-600">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Light Sleep</span>
                    <span className="font-medium text-cyan-600">48%</span>
                  </div>
                  <Progress value={48} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Awake</span>
                    <span className="font-medium text-red-600">5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        );

      case "duration":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sleep Duration Analysis</h3>
            <div className="bg-white p-4 rounded-lg border">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {data.slice(-7).map((entry, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="bg-blue-100 rounded-lg p-2 h-20 flex flex-col justify-end relative">
                      <div
                        className="bg-blue-500 rounded transition-all duration-1000"
                        style={{
                          height: `${(entry.duration / 10) * 100}%`,
                          minHeight: "4px",
                        }}
                      />
                      <div className="text-xs font-medium mt-1">
                        {entry.duration}h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Goal: {goals.targetDuration}h</span>
                <span>Avg: {trends.avgDuration}h</span>
              </div>
            </div>
          </div>
        );

      case "efficiency":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sleep Efficiency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Weekly Efficiency</h4>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {trends.avgEfficiency}%
                  </div>
                  <Progress value={trends.avgEfficiency} className="mb-2" />
                  <p className="text-sm text-gray-600">
                    {trends.avgEfficiency >= 85
                      ? "Excellent"
                      : trends.avgEfficiency >= 75
                        ? "Good"
                        : "Needs Improvement"}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Sleep Latency</h4>
                <div className="space-y-2">
                  {data.slice(-5).map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </span>
                      <span
                        className={`font-medium ${entry.sleepLatency <= 15 ? "text-green-600" : entry.sleepLatency <= 30 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {entry.sleepLatency}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "patterns":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sleep Patterns & Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Environmental Factors</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Room Temperature</span>
                    </div>
                    <span className="font-medium">21°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">Noise Level</span>
                    </div>
                    <span className="font-medium">Low</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Light Exposure</span>
                    </div>
                    <span className="font-medium">Minimal</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-3">Lifestyle Factors</h4>
                <div className="space-y-2">
                  {[
                    {
                      factor: "Caffeine",
                      impact: "negative",
                      frequency: "40%",
                    },
                    {
                      factor: "Exercise",
                      impact: "positive",
                      frequency: "60%",
                    },
                    {
                      factor: "Screen Time",
                      impact: "negative",
                      frequency: "70%",
                    },
                    { factor: "Stress", impact: "negative", frequency: "30%" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{item.factor}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{item.frequency}</span>
                        <div
                          className={`w-3 h-3 rounded-full ${item.impact === "positive" ? "bg-green-500" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-r from-white to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="h-8 w-8 text-purple-600" />
              <div>
                <CardTitle className="text-2xl text-purple-700">
                  Sleep Quality Analyzer
                </CardTitle>
                <p className="text-purple-600">
                  Advanced sleep tracking and insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsRecording(!isRecording)}
                className={`${isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {isRecording ? (
                  <Square className="h-4 w-4 mr-2" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button
                variant="outline"
                className="border-purple-300 text-purple-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">
                {trends.avgQuality.toFixed(1)}
              </div>
              <div className="text-sm text-yellow-500">Avg Quality</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {trends.avgDuration.toFixed(1)}h
              </div>
              <div className="text-sm text-blue-500">Avg Duration</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {trends.avgEfficiency}%
              </div>
              <div className="text-sm text-green-500">Efficiency</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {trends.consistencyScore}%
              </div>
              <div className="text-sm text-purple-500">Consistency</div>
            </div>
            <div className="text-center p-3 bg-white/80 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                +{trends.improvementRate}%
              </div>
              <div className="text-sm text-orange-500">Improvement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring */}
      {isRecording && (
        <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Activity className="h-6 w-6" />
              Live Sleep Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/80 rounded-lg">
                <Brain
                  className={`h-6 w-6 mx-auto mb-2 ${getPhaseColor(realTimeData.currentPhase)}`}
                />
                <div className="text-lg font-bold capitalize">
                  {realTimeData.currentPhase}
                </div>
                <div className="text-sm text-gray-600">Sleep Phase</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-lg">
                <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {realTimeData.heartRate}
                </div>
                <div className="text-sm text-gray-600">Heart Rate</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-lg">
                <Thermometer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {realTimeData.roomTemp.toFixed(1)}°C
                </div>
                <div className="text-sm text-gray-600">Room Temp</div>
              </div>
              <div className="text-center p-3 bg-white/80 rounded-lg">
                <Volume2 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-lg font-bold">
                  {realTimeData.soundLevel}dB
                </div>
                <div className="text-sm text-gray-600">Sound Level</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Controls */}
      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
              <Button
                variant={viewMode === "quarter" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("quarter")}
              >
                Quarter
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant={analysisMode === "quality" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalysisMode("quality")}
              >
                Quality
              </Button>
              <Button
                variant={analysisMode === "duration" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalysisMode("duration")}
              >
                Duration
              </Button>
              <Button
                variant={analysisMode === "efficiency" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalysisMode("efficiency")}
              >
                Efficiency
              </Button>
              <Button
                variant={analysisMode === "patterns" ? "default" : "outline"}
                size="sm"
                onClick={() => setAnalysisMode("patterns")}
              >
                Patterns
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analysis */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">{renderChart()}</CardContent>
      </Card>

      {/* Goals and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Goals */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Target className="h-6 w-6" />
              Sleep Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Duration</label>
              <Slider
                value={[goals.targetDuration]}
                onValueChange={(value) =>
                  setGoals((prev) => ({ ...prev, targetDuration: value[0] }))
                }
                max={12}
                min={6}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6h</span>
                <span className="font-medium">{goals.targetDuration}h</span>
                <span>12h</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Quality</label>
              <Slider
                value={[goals.targetQuality]}
                onValueChange={(value) =>
                  setGoals((prev) => ({ ...prev, targetQuality: value[0] }))
                }
                max={10}
                min={1}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span className="font-medium">{goals.targetQuality}/10</span>
                <span>10</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Bedtime</label>
                <input
                  type="time"
                  value={goals.targetBedtime}
                  onChange={(e) =>
                    setGoals((prev) => ({
                      ...prev,
                      targetBedtime: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Wake Time</label>
                <input
                  type="time"
                  value={goals.targetWakeTime}
                  onChange={(e) =>
                    setGoals((prev) => ({
                      ...prev,
                      targetWakeTime: e.target.value,
                    }))
                  }
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="border-2 border-yellow-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Lightbulb className="h-6 w-6" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trends.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">{rec}</p>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700"
                      >
                        Try This
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Weekly Insight
                </h4>
                <p className="text-sm text-blue-700">
                  Your sleep quality is {trends.weeklyTrend}!
                  {trends.improvementRate > 0
                    ? ` You've improved by ${trends.improvementRate}% this week.`
                    : " Focus on consistency for better results."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Log Entry */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-6 w-6" />
            Log Sleep Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Sleep Quality</label>
                <Slider
                  defaultValue={[7]}
                  max={10}
                  min={1}
                  step={0.5}
                  className="w-full mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <Slider
                  defaultValue={[7.5]}
                  max={12}
                  min={4}
                  step={0.5}
                  className="w-full mt-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">Bedtime</label>
                  <input
                    type="time"
                    defaultValue="22:30"
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Wake Time</label>
                  <input
                    type="time"
                    defaultValue="06:30"
                    className="w-full mt-1 p-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">
                  Sleep Latency (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Factors
                </label>
                <div className="space-y-2">
                  {["Caffeine", "Exercise", "Stress", "Screen Time"].map(
                    (factor) => (
                      <label
                        key={factor}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input type="checkbox" className="rounded" />
                        {factor}
                      </label>
                    ),
                  )}
                </div>
              </div>
              <Button className="w-full">Save Entry</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
