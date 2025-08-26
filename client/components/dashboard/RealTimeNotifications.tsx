import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Bell,
  BellOff,
  Settings,
  Volume2,
  VolumeX,
  Smartphone,
  Clock,
  Star,
  Check,
  X,
  Filter,
  Trash2,
  Moon,
  Sun,
  Calendar,
  Timer,
  AlertTriangle,
  TrendingUp,
  Users,
  Target,
  Heart,
  Zap,
  Coffee,
  MessageSquare,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Archive,
  Eye,
  EyeOff,
  Vibrate,
  ChevronDown,
  Activity,
} from "lucide-react";

interface Notification {
  id: string;
  type: "achievement" | "reminder" | "social" | "system" | "health" | "goal";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  hasAction: boolean;
  actionText?: string;
  category: string;
  icon: React.ReactNode;
}

interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  desktopEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  categories: {
    achievements: boolean;
    reminders: boolean;
    social: boolean;
    system: boolean;
    health: boolean;
    goals: boolean;
  };
  priorityThreshold: string;
  frequency: string;
  volume: number;
}

const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    desktopEnabled: true,
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "07:00",
    categories: {
      achievements: true,
      reminders: true,
      social: true,
      system: false,
      health: true,
      goals: true,
    },
    priorityThreshold: "medium",
    frequency: "instant",
    volume: 70,
  });

  const [filter, setFilter] = useState<string>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    todayReceived: 23,
    todayRead: 18,
    weeklyTrend: "+12%",
    mostActiveCategory: "achievements",
    avgResponseTime: "2.3 min",
    engagementRate: 78,
  });

  const notificationSoundsRef = useRef<HTMLAudioElement>(null);

  // Simulate real-time notifications
  useEffect(() => {
    if (!isRealTimeEnabled || !settings.enabled) return;

    const generateNotification = (): Notification => {
      const types: Array<Notification["type"]> = [
        "achievement",
        "reminder",
        "social",
        "system",
        "health",
        "goal",
      ];
      const priorities: Array<Notification["priority"]> = [
        "low",
        "medium",
        "high",
        "urgent",
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const priority =
        priorities[Math.floor(Math.random() * priorities.length)];

      const notificationTemplates = {
        achievement: {
          titles: [
            "Goal Milestone!",
            "Streak Achievement!",
            "New Badge Earned!",
            "Level Up!",
          ],
          messages: [
            "You completed 7 days of morning routine!",
            "Perfect week achieved!",
            "Discipline master badge unlocked!",
            "You reached level 15!",
          ],
          icon: <Star className="h-4 w-4 text-yellow-500" />,
        },
        reminder: {
          titles: [
            "Time for Check-in",
            "Breathing Exercise",
            "Hydration Reminder",
            "Break Time",
          ],
          messages: [
            "Your daily check-in is ready",
            "Take a 5-minute breathing break",
            "Remember to drink water",
            "Time for a stretch break",
          ],
          icon: <Clock className="h-4 w-4 text-blue-500" />,
        },
        social: {
          titles: [
            "Community Update",
            "Friend Activity",
            "Challenge Invite",
            "Support Message",
          ],
          messages: [
            "3 friends completed their goals today",
            "John started a new challenge",
            "Join the weekend warrior challenge",
            "Your mentor sent encouragement",
          ],
          icon: <Users className="h-4 w-4 text-green-500" />,
        },
        system: {
          titles: [
            "System Update",
            "Backup Complete",
            "Sync Status",
            "Security Alert",
          ],
          messages: [
            "App updated to v2.1.0",
            "Data backed up successfully",
            "All devices synced",
            "New login detected",
          ],
          icon: <Settings className="h-4 w-4 text-gray-500" />,
        },
        health: {
          titles: [
            "Health Insight",
            "Sleep Quality",
            "Activity Goal",
            "Wellness Tip",
          ],
          messages: [
            "Your sleep improved by 15%",
            "Sleep score: 8.5/10",
            "2,000 steps to daily goal",
            "Try meditation for better focus",
          ],
          icon: <Heart className="h-4 w-4 text-red-500" />,
        },
        goal: {
          titles: [
            "Goal Progress",
            "Deadline Approaching",
            "Target Achieved",
            "New Goal Suggestion",
          ],
          messages: [
            "75% progress on reading goal",
            "Weekly review due tomorrow",
            "Exercise target completed!",
            "Consider adding a creativity goal",
          ],
          icon: <Target className="h-4 w-4 text-purple-500" />,
        },
      };

      const template = notificationTemplates[type];
      const titleIndex = Math.floor(Math.random() * template.titles.length);
      const messageIndex = Math.floor(Math.random() * template.messages.length);

      return {
        id: `notif-${Date.now()}-${Math.random()}`,
        type,
        title: template.titles[titleIndex],
        message: template.messages[messageIndex],
        timestamp: new Date(),
        priority,
        isRead: false,
        hasAction: Math.random() > 0.6,
        actionText: Math.random() > 0.5 ? "View Details" : "Take Action",
        category: type,
        icon: template.icon,
      };
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 3 seconds
        const newNotification = generateNotification();

        // Check if category is enabled
        if (
          settings.categories[
            newNotification.type as keyof typeof settings.categories
          ]
        ) {
          setNotifications((prev) => [newNotification, ...prev].slice(0, 50)); // Keep only latest 50

          // Play sound if enabled
          if (settings.soundEnabled && notificationSoundsRef.current) {
            notificationSoundsRef.current.volume = settings.volume / 100;
            notificationSoundsRef.current.play().catch(() => {});
          }

          // Update analytics
          setAnalyticsData((prev) => ({
            ...prev,
            todayReceived: prev.todayReceived + 1,
          }));
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, settings]);

  // Initialize with some sample notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: "1",
        type: "achievement",
        title: "Week Streak Completed!",
        message:
          "You've maintained your morning routine for 7 consecutive days. Outstanding discipline!",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        priority: "high",
        isRead: false,
        hasAction: true,
        actionText: "Claim Reward",
        category: "achievements",
        icon: <Star className="h-4 w-4 text-yellow-500" />,
      },
      {
        id: "2",
        type: "reminder",
        title: "Evening Check-in Ready",
        message: "Time to reflect on your day and log your progress.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        priority: "medium",
        isRead: false,
        hasAction: true,
        actionText: "Start Check-in",
        category: "reminders",
        icon: <Clock className="h-4 w-4 text-blue-500" />,
      },
      {
        id: "3",
        type: "health",
        title: "Sleep Quality Improved",
        message:
          "Your sleep score increased to 8.2/10. Great progress on your rest goals!",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        priority: "medium",
        isRead: true,
        hasAction: false,
        category: "health",
        icon: <Heart className="h-4 w-4 text-red-500" />,
      },
    ];
    setNotifications(initialNotifications);
  }, []);

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.isRead;
    if (filter === "important")
      return notif.priority === "high" || notif.priority === "urgent";
    return notif.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif,
      ),
    );
    setAnalyticsData((prev) => ({
      ...prev,
      todayRead: prev.todayRead + 1,
    }));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-3 w-3" />;
      case "high":
        return <Zap className="h-3 w-3" />;
      case "medium":
        return <Activity className="h-3 w-3" />;
      case "low":
        return <Coffee className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Real-time Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread • {notifications.length} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className="text-xs"
            >
              {isRealTimeEnabled ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              {isRealTimeEnabled ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-4">
            {/* Filter and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="important">Important</option>
                  <option value="achievement">Achievements</option>
                  <option value="reminder">Reminders</option>
                  <option value="social">Social</option>
                  <option value="health">Health</option>
                  <option value="goal">Goals</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No notifications to show</p>
                  <p className="text-xs">New notifications will appear here</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                      !notification.isRead
                        ? "bg-blue-50 border-blue-200"
                        : "bg-background"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {notification.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">
                              {notification.title}
                            </h4>
                            <div
                              className={`w-1 h-1 rounded-full ${getPriorityColor(notification.priority)}`}
                            />
                            {notification.priority !== "low" && (
                              <div className="text-muted-foreground">
                                {getPriorityIcon(notification.priority)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {notification.type}
                          </Badge>

                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                            {notification.hasAction && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              {/* Main Settings */}
              <div className="space-y-3">
                <h3 className="font-medium">General Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Enable Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Receive all notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, enabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sound Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Play sound for new notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        soundEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Vibration</p>
                    <p className="text-xs text-muted-foreground">
                      Vibrate device for notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        vibrationEnabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Desktop Notifications</p>
                    <p className="text-xs text-muted-foreground">
                      Show browser notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.desktopEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        desktopEnabled: checked,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Volume Control */}
              {settings.soundEnabled && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Notification Volume</p>
                    <span className="text-xs text-muted-foreground">
                      {settings.volume}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[settings.volume]}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, volume: value[0] }))
                      }
                      max={100}
                      step={10}
                      className="flex-1"
                    />
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Quiet Hours</p>
                    <p className="text-xs text-muted-foreground">
                      Reduce notifications during specified hours
                    </p>
                  </div>
                  <Switch
                    checked={settings.quietHoursEnabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        quietHoursEnabled: checked,
                      }))
                    }
                  />
                </div>

                {settings.quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Start Time
                      </p>
                      <input
                        type="time"
                        value={settings.quietHoursStart}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            quietHoursStart: e.target.value,
                          }))
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">End Time</p>
                      <input
                        type="time"
                        value={settings.quietHoursEnd}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            quietHoursEnd: e.target.value,
                          }))
                        }
                        className="w-full text-sm border rounded px-2 py-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Category Settings */}
              <div className="space-y-3">
                <h3 className="font-medium">Notification Categories</h3>

                {Object.entries(settings.categories).map(
                  ([category, enabled]) => (
                    <div
                      key={category}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium capitalize">
                          {category}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category === "achievements" &&
                            "Goal completions, streaks, badges"}
                          {category === "reminders" &&
                            "Check-ins, breaks, scheduled events"}
                          {category === "social" &&
                            "Community updates, friend activities"}
                          {category === "system" &&
                            "App updates, sync status, technical alerts"}
                          {category === "health" &&
                            "Sleep insights, wellness tips"}
                          {category === "goals" &&
                            "Progress updates, deadline reminders"}
                        </p>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            categories: {
                              ...prev.categories,
                              [category]: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  ),
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Today Received
                    </p>
                    <p className="text-lg font-bold">
                      {analyticsData.todayReceived}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Today Read</p>
                    <p className="text-lg font-bold">
                      {analyticsData.todayRead}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Weekly Trend
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {analyticsData.weeklyTrend}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Avg Response
                    </p>
                    <p className="text-lg font-bold">
                      {analyticsData.avgResponseTime}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Most Active</p>
                    <p className="text-sm font-bold capitalize">
                      {analyticsData.mostActiveCategory}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                    <p className="text-lg font-bold">
                      {analyticsData.engagementRate}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Activity Timeline */}
            <Card className="p-4">
              <h3 className="font-medium mb-3">Recent Activity</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-muted-foreground">12:34</span>
                  <span>Achievement notification opened</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-muted-foreground">12:28</span>
                  <span>Reminder marked as complete</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-muted-foreground">12:15</span>
                  <span>Goal progress notification received</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-muted-foreground">12:02</span>
                  <span>Social update notification opened</span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Archive className="h-3 w-3 mr-1" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3 mr-1" />
                Configure Tracking
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Hidden audio element for notification sounds */}
        <audio
          ref={notificationSoundsRef}
          preload="auto"
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwuWUUBTOL0fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DwuWUUBTOL0fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DwuWUUBTOL0fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DwuWUUBTOL0fLNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DwuWUUBQ=="
        />
      </CardContent>
    </Card>
  );
};

export default RealTimeNotifications;
