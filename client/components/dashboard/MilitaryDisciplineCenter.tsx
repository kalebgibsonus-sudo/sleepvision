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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  Star,
  Target,
  Sword,
  Crown,
  Medal,
  Award,
  Flag,
  Zap,
  Flame,
  CrosshairIcon as Crosshair,
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Gauge,
  Brain,
  Heart,
  Eye,
  Lock,
  Unlock,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Square,
  RotateCcw,
  Timer,
  Stopwatch,
  Mountain,
  Trophy,
  Siren,
  Radio,
  MapPin,
  Compass,
  Navigation,
} from "lucide-react";

interface MilitaryRank {
  id: string;
  name: string;
  insignia: string;
  level: number;
  requirements: {
    streakDays: number;
    tasksCompleted: number;
    consistency: number;
  };
  privileges: string[];
  nextRank?: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "special" | "emergency";
  difficulty: "recruit" | "veteran" | "elite" | "legendary";
  progress: number;
  maxProgress: number;
  reward: {
    xp: number;
    medals: number;
    unlocks?: string[];
  };
  timeRemaining?: number;
  status: "active" | "completed" | "failed" | "locked";
}

interface DisciplineMetrics {
  consistency: number;
  punctuality: number;
  persistence: number;
  focus: number;
  commitment: number;
  resilience: number;
}

interface CombatLog {
  id: string;
  timestamp: Date;
  action: string;
  result: "victory" | "defeat" | "tactical-withdrawal";
  xpGained: number;
  details: string;
}

export function MilitaryDisciplineCenter() {
  const { user } = useAuth();
  const [currentRank, setCurrentRank] = useState<MilitaryRank>({
    id: "corporal",
    name: "Corporal",
    insignia: "⚔️",
    level: 4,
    requirements: { streakDays: 30, tasksCompleted: 150, consistency: 80 },
    privileges: ["Mission selection", "Squad leadership", "Advanced tools"],
    nextRank: "sergeant",
  });

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "daily-sleep",
      title: "Operation Night Watch",
      description:
        "Maintain 8-hour sleep schedule for optimal combat readiness",
      type: "daily",
      difficulty: "veteran",
      progress: 7,
      maxProgress: 8,
      reward: { xp: 50, medals: 2 },
      timeRemaining: 6.5,
      status: "active",
    },
    {
      id: "breathing-drill",
      title: "Tactical Breathing Exercise",
      description: "Complete 3 breathing sessions for mental fortification",
      type: "daily",
      difficulty: "recruit",
      progress: 2,
      maxProgress: 3,
      reward: { xp: 30, medals: 1 },
      timeRemaining: 8.2,
      status: "active",
    },
    {
      id: "weekly-consistency",
      title: "Week-Long Campaign",
      description: "Maintain discipline for 7 consecutive days",
      type: "weekly",
      difficulty: "elite",
      progress: 5,
      maxProgress: 7,
      reward: { xp: 200, medals: 10, unlocks: ["Elite Status"] },
      timeRemaining: 48,
      status: "active",
    },
  ]);

  const [disciplineMetrics, setDisciplineMetrics] = useState<DisciplineMetrics>(
    {
      consistency: 85,
      punctuality: 92,
      persistence: 78,
      focus: 89,
      commitment: 81,
      resilience: 76,
    },
  );

  const [combatLog, setCombatLog] = useState<CombatLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 3600000),
      action: "Completed Morning Routine",
      result: "victory",
      xpGained: 25,
      details: "Perfect execution under pressure",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 7200000),
      action: "Skipped Evening Meditation",
      result: "defeat",
      xpGained: -10,
      details: "Failed to maintain discipline",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 10800000),
      action: "Emergency Sleep Recovery",
      result: "tactical-withdrawal",
      xpGained: 5,
      details: "Strategic retreat for better positioning",
    },
  ]);

  const [alertLevel, setAlertLevel] = useState<
    "green" | "yellow" | "orange" | "red"
  >("green");
  const [isInMission, setIsInMission] = useState(false);
  const [missionTimer, setMissionTimer] = useState(0);

  const militaryRanks: MilitaryRank[] = [
    {
      id: "recruit",
      name: "Recruit",
      insignia: "🎖️",
      level: 1,
      requirements: { streakDays: 3, tasksCompleted: 10, consistency: 50 },
      privileges: ["Basic tracking"],
      nextRank: "private",
    },
    {
      id: "private",
      name: "Private",
      insignia: "🥉",
      level: 2,
      requirements: { streakDays: 7, tasksCompleted: 30, consistency: 60 },
      privileges: ["Daily missions"],
      nextRank: "specialist",
    },
    {
      id: "specialist",
      name: "Specialist",
      insignia: "🥈",
      level: 3,
      requirements: { streakDays: 14, tasksCompleted: 75, consistency: 70 },
      privileges: ["Weekly missions"],
      nextRank: "corporal",
    },
    {
      id: "corporal",
      name: "Corporal",
      insignia: "⚔️",
      level: 4,
      requirements: { streakDays: 30, tasksCompleted: 150, consistency: 80 },
      privileges: ["Mission selection"],
      nextRank: "sergeant",
    },
    {
      id: "sergeant",
      name: "Sergeant",
      insignia: "🏅",
      level: 5,
      requirements: { streakDays: 60, tasksCompleted: 300, consistency: 85 },
      privileges: ["Squad leadership"],
      nextRank: "lieutenant",
    },
    {
      id: "lieutenant",
      name: "Lieutenant",
      insignia: "🎗️",
      level: 6,
      requirements: { streakDays: 100, tasksCompleted: 500, consistency: 90 },
      privileges: ["Special operations"],
      nextRank: "captain",
    },
    {
      id: "captain",
      name: "Captain",
      insignia: "🏆",
      level: 7,
      requirements: { streakDays: 180, tasksCompleted: 1000, consistency: 95 },
      privileges: ["Command center"],
      nextRank: "major",
    },
    {
      id: "major",
      name: "Major",
      insignia: "👑",
      level: 8,
      requirements: { streakDays: 365, tasksCompleted: 2000, consistency: 98 },
      privileges: ["Elite status"],
      nextRank: "colonel",
    },
  ];

  // Mission timer
  useEffect(() => {
    if (isInMission) {
      const interval = setInterval(() => {
        setMissionTimer((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isInMission]);

  // Real-time metrics updates
  useEffect(() => {
    const updateMetrics = () => {
      setDisciplineMetrics((prev) => ({
        consistency: Math.max(
          50,
          Math.min(100, prev.consistency + (Math.random() - 0.5) * 2),
        ),
        punctuality: Math.max(
          60,
          Math.min(100, prev.punctuality + (Math.random() - 0.5) * 1.5),
        ),
        persistence: Math.max(
          40,
          Math.min(100, prev.persistence + (Math.random() - 0.5) * 3),
        ),
        focus: Math.max(
          50,
          Math.min(100, prev.focus + (Math.random() - 0.5) * 2.5),
        ),
        commitment: Math.max(
          60,
          Math.min(100, prev.commitment + (Math.random() - 0.5) * 1),
        ),
        resilience: Math.max(
          40,
          Math.min(100, prev.resilience + (Math.random() - 0.5) * 2),
        ),
      }));
    };

    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Alert level determination
  useEffect(() => {
    const avgMetrics =
      Object.values(disciplineMetrics).reduce((sum, val) => sum + val, 0) /
      Object.values(disciplineMetrics).length;
    if (avgMetrics >= 90) setAlertLevel("green");
    else if (avgMetrics >= 75) setAlertLevel("yellow");
    else if (avgMetrics >= 60) setAlertLevel("orange");
    else setAlertLevel("red");
  }, [disciplineMetrics]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "recruit":
        return "text-green-600 bg-green-100";
      case "veteran":
        return "text-blue-600 bg-blue-100";
      case "elite":
        return "text-purple-600 bg-purple-100";
      case "legendary":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getAlertColor = () => {
    switch (alertLevel) {
      case "green":
        return "border-green-500 bg-green-50";
      case "yellow":
        return "border-yellow-500 bg-yellow-50";
      case "orange":
        return "border-orange-500 bg-orange-50";
      case "red":
        return "border-red-500 bg-red-50";
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startMission = (missionId: string) => {
    setIsInMission(true);
    setMissionTimer(0);
    // Update mission status
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === missionId
          ? { ...mission, status: "active" as const }
          : mission,
      ),
    );
  };

  const completeMission = (missionId: string) => {
    setIsInMission(false);
    // Add to combat log
    const newLogEntry: CombatLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      action: `Completed Mission: ${missions.find((m) => m.id === missionId)?.title}`,
      result: "victory",
      xpGained: missions.find((m) => m.id === missionId)?.reward.xp || 0,
      details: `Mission completed in ${formatTime(missionTimer)}`,
    };
    setCombatLog((prev) => [newLogEntry, ...prev]);

    // Update mission status
    setMissions((prev) =>
      prev.map((mission) =>
        mission.id === missionId
          ? {
              ...mission,
              status: "completed" as const,
              progress: mission.maxProgress,
            }
          : mission,
      ),
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 min-h-screen text-white">
      {/* Command Header */}
      <Card
        className={`border-2 shadow-2xl ${getAlertColor()} bg-black/80 backdrop-blur-sm`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentRank.insignia}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {currentRank.name} {user?.name}
                </h1>
                <p className="text-gray-300">
                  Level {currentRank.level} - Discipline Command Center
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`${alertLevel === "green" ? "bg-green-600" : alertLevel === "yellow" ? "bg-yellow-600" : alertLevel === "orange" ? "bg-orange-600" : "bg-red-600"} text-white animate-pulse`}
              >
                DEFCON{" "}
                {alertLevel === "green"
                  ? "5"
                  : alertLevel === "yellow"
                    ? "4"
                    : alertLevel === "orange"
                      ? "3"
                      : "2"}
              </Badge>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Radio className="h-4 w-4 mr-2" />
                Command
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/60 rounded-lg p-3 text-center border border-gray-700">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <div className="text-xl font-bold">15</div>
              <div className="text-xs text-gray-400">Day Streak</div>
            </div>
            <div className="bg-black/60 rounded-lg p-3 text-center border border-gray-700">
              <Target className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl font-bold">8/10</div>
              <div className="text-xs text-gray-400">Missions</div>
            </div>
            <div className="bg-black/60 rounded-lg p-3 text-center border border-gray-700">
              <Medal className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xl font-bold">247</div>
              <div className="text-xs text-gray-400">Medals</div>
            </div>
            <div className="bg-black/60 rounded-lg p-3 text-center border border-gray-700">
              <Crown className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-xl font-bold">2,840</div>
              <div className="text-xs text-gray-400">XP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Missions */}
        <Card className="bg-black/80 border-gray-700 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crosshair className="h-6 w-6 text-red-500" />
              Active Operations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missions
                .filter((m) => m.status === "active")
                .map((mission) => (
                  <Card
                    key={mission.id}
                    className="bg-gray-900/80 border-gray-600"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white">
                            {mission.title}
                          </h3>
                          <Badge
                            className={getDifficultyColor(mission.difficulty)}
                          >
                            {mission.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">
                          {mission.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progress</span>
                            <span className="text-white font-medium">
                              {mission.progress}/{mission.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (mission.progress / mission.maxProgress) * 100
                            }
                            className="h-2 bg-gray-700"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Timer className="h-4 w-4" />
                            {mission.timeRemaining &&
                              `${mission.timeRemaining}h remaining`}
                          </div>
                          <div className="flex gap-2">
                            {!isInMission ? (
                              <Button
                                size="sm"
                                onClick={() => startMission(mission.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Deploy
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => completeMission(mission.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {isInMission && (
              <Card className="mt-4 bg-red-900/20 border-red-600">
                <CardContent className="p-4 text-center">
                  <Siren className="h-8 w-8 text-red-500 mx-auto mb-2 animate-pulse" />
                  <div className="text-2xl font-mono text-red-400">
                    {formatTime(missionTimer)}
                  </div>
                  <div className="text-sm text-red-300">
                    MISSION IN PROGRESS
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* Discipline Metrics */}
        <Card className="bg-black/80 border-gray-700 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-6 w-6 text-blue-500" />
              Combat Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(disciplineMetrics).map(([metric, value]) => {
                const icons = {
                  consistency: <Activity className="h-5 w-5 text-green-500" />,
                  punctuality: <Clock className="h-5 w-5 text-blue-500" />,
                  persistence: <Mountain className="h-5 w-5 text-purple-500" />,
                  focus: <Eye className="h-5 w-5 text-yellow-500" />,
                  commitment: <Heart className="h-5 w-5 text-red-500" />,
                  resilience: <Shield className="h-5 w-5 text-gray-500" />,
                };

                const getStatusColor = (val: number) => {
                  if (val >= 90) return "text-green-400";
                  if (val >= 75) return "text-yellow-400";
                  if (val >= 60) return "text-orange-400";
                  return "text-red-400";
                };

                return (
                  <div key={metric} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {icons[metric as keyof typeof icons]}
                        <span className="capitalize text-sm font-medium">
                          {metric}
                        </span>
                      </div>
                      <span className={`font-bold ${getStatusColor(value)}`}>
                        {Math.round(value)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          value >= 90
                            ? "bg-green-500"
                            : value >= 75
                              ? "bg-yellow-500"
                              : value >= 60
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Combat Log */}
      <Card className="bg-black/80 border-gray-700 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-6 w-6 text-yellow-500" />
            Combat Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {combatLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-3 bg-gray-900/60 rounded-lg border border-gray-700"
              >
                <div className="text-2xl">
                  {entry.result === "victory"
                    ? "🏆"
                    : entry.result === "defeat"
                      ? "💀"
                      : "⚠️"}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{entry.action}</div>
                  <div className="text-sm text-gray-400">{entry.details}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-bold ${entry.xpGained >= 0 ? "text-green-400" : "text-red-400"}`}
                  >
                    {entry.xpGained >= 0 ? "+" : ""}
                    {entry.xpGained} XP
                  </div>
                  <div className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rank Progression */}
      <Card className="bg-black/80 border-gray-700 text-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-6 w-6 text-purple-500" />
            Rank Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {militaryRanks.slice(0, 8).map((rank) => (
              <Card
                key={rank.id}
                className={`${rank.id === currentRank.id ? "bg-blue-900/40 border-blue-500" : "bg-gray-900/40 border-gray-600"} transition-all hover:shadow-lg`}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{rank.insignia}</div>
                  <h3 className="font-bold text-white">{rank.name}</h3>
                  <p className="text-xs text-gray-400 mb-3">
                    Level {rank.level}
                  </p>

                  {rank.id === currentRank.id && (
                    <Badge className="bg-blue-600 text-white mb-2">
                      CURRENT
                    </Badge>
                  )}

                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Streak: {rank.requirements.streakDays}d</div>
                    <div>Tasks: {rank.requirements.tasksCompleted}</div>
                    <div>Consistency: {rank.requirements.consistency}%</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
