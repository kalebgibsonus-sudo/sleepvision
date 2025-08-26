import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Snowflake,
  Zap,
  Thermometer,
  Wind,
  Eye,
  Droplets,
  Gauge,
  MapPin,
  Clock,
  Calendar,
  Star,
  Flame,
  Target,
  TrendingUp,
  Heart,
  Brain,
  Sparkles,
  Award,
  RefreshCw,
  Volume2,
  Bell,
  Settings,
  ChevronRight,
  Activity,
  BatteryCharging,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  location: string;
  icon: string;
  feels_like: number;
  uv_index: number;
}

interface UserMetrics {
  healthScore: number;
  energyLevel: number;
  stressLevel: number;
  focusLevel: number;
  motivationLevel: number;
}

interface TimeData {
  current: Date;
  timeZone: string;
  greeting: string;
  dayProgress: number;
  sleepIn: string;
  wakeIn: string;
}

export function EnhancedDashboardOverview() {
  const { user } = useAuth();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [timeData, setTimeData] = useState<TimeData>({
    current: new Date(),
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    greeting: "",
    dayProgress: 0,
    sleepIn: "",
    wakeIn: "",
  });
  const [userMetrics, setUserMetrics] = useState<UserMetrics>({
    healthScore: 85,
    energyLevel: 78,
    stressLevel: 32,
    focusLevel: 91,
    motivationLevel: 88,
  });
  const [isAnimating, setIsAnimating] = useState(true);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Great job on your 7-day streak! 🔥",
      type: "success",
      time: "2m ago",
    },
    {
      id: 2,
      message: "Time for evening wind-down routine",
      type: "reminder",
      time: "5m ago",
    },
    {
      id: 3,
      message: "Sarah Chen liked your community post",
      type: "social",
      time: "12m ago",
    },
  ]);
  const [systemStats, setSystemStats] = useState({
    performance: 96,
    connectivity: 100,
    dataSync: 100,
    batteryLevel: 84,
  });

  // Real-time clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();

      let greeting = "";
      if (hour < 6) greeting = "🌙 Deep Sleep Mode";
      else if (hour < 12) greeting = "🌅 Good Morning";
      else if (hour < 17) greeting = "☀️ Good Afternoon";
      else if (hour < 21) greeting = "🌆 Good Evening";
      else greeting = "🌙 Wind Down Time";

      const dayProgress = ((hour * 60 + now.getMinutes()) / (24 * 60)) * 100;

      // Calculate sleep/wake times
      const sleepTime = new Date();
      sleepTime.setHours(22, 30, 0);
      if (sleepTime < now) sleepTime.setDate(sleepTime.getDate() + 1);

      const wakeTime = new Date();
      wakeTime.setHours(6, 30, 0);
      if (wakeTime < now) wakeTime.setDate(wakeTime.getDate() + 1);

      setTimeData({
        current: now,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        greeting,
        dayProgress,
        sleepIn: formatTimeUntil(sleepTime),
        wakeIn: formatTimeUntil(wakeTime),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulated weather API call
  useEffect(() => {
    const fetchWeather = async () => {
      // Simulate API call with realistic data
      setTimeout(() => {
        setWeather({
          temperature: 22,
          condition: "Clear",
          humidity: 65,
          windSpeed: 8,
          visibility: 16,
          pressure: 1013,
          location: "San Francisco, CA",
          icon: "clear-day",
          feels_like: 24,
          uv_index: 6,
        });
      }, 1000);
    };

    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 300000); // Update every 5 minutes
    return () => clearInterval(weatherInterval);
  }, []);

  // Real-time metrics simulation
  useEffect(() => {
    const updateMetrics = () => {
      setUserMetrics((prev) => ({
        healthScore: Math.max(
          60,
          Math.min(100, prev.healthScore + (Math.random() - 0.5) * 2),
        ),
        energyLevel: Math.max(
          40,
          Math.min(100, prev.energyLevel + (Math.random() - 0.5) * 3),
        ),
        stressLevel: Math.max(
          10,
          Math.min(80, prev.stressLevel + (Math.random() - 0.5) * 2),
        ),
        focusLevel: Math.max(
          50,
          Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 1.5),
        ),
        motivationLevel: Math.max(
          60,
          Math.min(100, prev.motivationLevel + (Math.random() - 0.5) * 2),
        ),
      }));

      setSystemStats((prev) => ({
        performance: Math.max(
          90,
          Math.min(100, prev.performance + (Math.random() - 0.5) * 1),
        ),
        connectivity: Math.random() > 0.95 ? 85 : 100,
        dataSync: Math.random() > 0.98 ? 75 : 100,
        batteryLevel: Math.max(10, prev.batteryLevel - 0.1),
      }));
    };

    const metricsInterval = setInterval(updateMetrics, 2000);
    return () => clearInterval(metricsInterval);
  }, []);

  const formatTimeUntil = (targetTime: Date) => {
    const now = new Date();
    const diff = targetTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />;
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case "snow":
        return <Snowflake className="h-6 w-6 text-blue-300" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getMetricColor = (value: number, reverse = false) => {
    if (reverse) {
      if (value < 30) return "text-green-600";
      if (value < 60) return "text-yellow-600";
      return "text-red-600";
    }
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (value: number, reverse = false) => {
    if (reverse) {
      if (value < 30) return "bg-green-500";
      if (value < 60) return "bg-yellow-500";
      return "bg-red-500";
    }
    if (value >= 80) return "bg-green-500";
    if (value >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Enhanced Header with Real-time Data */}
      <Card
        className={`border-2 border-blue-200 shadow-xl ${isAnimating ? "animate-pulse" : ""} transition-all duration-1000 bg-gradient-to-r from-white via-blue-50 to-indigo-50`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {timeData.greeting}, {user?.name}!
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">
                    {timeData.current.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {timeData.current.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{timeData.timeZone}</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">
                  System {systemStats.performance}%
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 rounded-lg px-3 py-2">
                <BatteryCharging className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  {Math.round(systemStats.batteryLevel)}%
                </span>
              </div>
              <Button variant="outline" size="sm" className="border-blue-300">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Day Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-gray-700">Day Progress</span>
              <span className="text-blue-600">
                {Math.round(timeData.dayProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 transition-all duration-1000 rounded-full"
                style={{ width: `${timeData.dayProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>🌅 6:30 AM</span>
              <span>☀️ Now</span>
              <span>🌙 10:30 PM</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
              <Moon className="h-5 w-5 text-purple-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700">Sleep In</div>
              <div className="text-lg font-bold text-purple-600">
                {timeData.sleepIn}
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
              <Sun className="h-5 w-5 text-orange-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700">Wake In</div>
              <div className="text-lg font-bold text-orange-600">
                {timeData.wakeIn}
              </div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
              <Flame className="h-5 w-5 text-red-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700">Streak</div>
              <div className="text-lg font-bold text-red-600">15 days</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 text-center hover:shadow-md transition-shadow">
              <Star className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <div className="text-sm font-medium text-gray-700">Level</div>
              <div className="text-lg font-bold text-yellow-600">8</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weather Integration Card */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            {weather ? (
              getWeatherIcon(weather.condition)
            ) : (
              <RefreshCw className="h-6 w-6 animate-spin" />
            )}
            Weather & Environment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weather ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Temperature</span>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="font-bold text-lg">
                      {weather.temperature}°C
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Feels Like</span>
                  <span className="font-semibold">{weather.feels_like}°C</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Humidity</span>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="font-semibold">{weather.humidity}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pressure</span>
                  <span className="font-semibold">{weather.pressure} hPa</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wind Speed</span>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">
                      {weather.windSpeed} km/h
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Visibility</span>
                  <span className="font-semibold">{weather.visibility} km</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">UV Index</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-purple-500" />
                    <span className="font-semibold">{weather.uv_index}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Location</span>
                  <span className="font-semibold text-xs">
                    {weather.location}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-600">Loading weather data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Metrics Dashboard */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Heart className="h-6 w-6 text-red-500" />
            Real-time Health Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(userMetrics).map(([key, value]) => {
              const isStress = key === "stressLevel";
              const icons = {
                healthScore: <Heart className="h-5 w-5" />,
                energyLevel: <Zap className="h-5 w-5" />,
                stressLevel: <Gauge className="h-5 w-5" />,
                focusLevel: <Brain className="h-5 w-5" />,
                motivationLevel: <Target className="h-5 w-5" />,
              };

              return (
                <div
                  key={key}
                  className="space-y-3 bg-white/80 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getMetricColor(value, isStress)}>
                        {icons[key as keyof typeof icons]}
                      </div>
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-bold ${getMetricColor(value, isStress)}`}
                    >
                      {Math.round(value)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(value, isStress)}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    {isStress ? "Lower is better" : "Target: 80%+"}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Live Notifications Feed */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Bell className="h-6 w-6 text-yellow-500" />
              Live Updates
            </CardTitle>
            <Badge
              variant="outline"
              className="border-purple-300 text-purple-600"
            >
              {notifications.length} new
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-3 bg-white/80 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 animate-pulse" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.time}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    notification.type === "success"
                      ? "border-green-300 text-green-600"
                      : notification.type === "reminder"
                        ? "border-yellow-300 text-yellow-600"
                        : "border-blue-300 text-blue-600"
                  }
                >
                  {notification.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
