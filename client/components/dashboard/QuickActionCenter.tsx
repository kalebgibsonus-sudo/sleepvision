import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Play,
  Pause,
  Square,
  Timer,
  Clock,
  Moon,
  Sun,
  Coffee,
  Dumbbell,
  Brain,
  Heart,
  Star,
  Target,
  Calendar,
  Bell,
  Settings,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Phone,
  Mail,
  MessageCircle,
  Camera,
  Video,
  Music,
  Book,
  Lightbulb,
  Shield,
  Award,
  Trophy,
  Gift,
  Sparkles,
  Wind,
  Droplets,
  Thermometer,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Home,
  User,
  Users,
  MapPin,
  Navigation,
  Compass,
  Search,
  Filter,
  Sort,
  Archive,
  Trash2,
  Edit,
  Copy,
  Paste,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Link,
  Bookmark,
  Flag,
  Tag,
  Folder,
  FileText,
  Image,
  Smartphone,
  Laptop,
  Monitor,
  Headphones,
  Speaker,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Activity,
  BarChart3,
  Gamepad2,
  Keyboard,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category:
    | "wellness"
    | "productivity"
    | "health"
    | "social"
    | "utilities"
    | "entertainment";
  action: () => void;
  shortcut?: string;
  premium?: boolean;
  active?: boolean;
  countdown?: number;
  customizable?: boolean;
}

interface ActionCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  actions: QuickAction[];
}

interface SessionData {
  meditation: { active: boolean; duration: number; type: string };
  breathing: { active: boolean; duration: number; pattern: string };
  focus: { active: boolean; duration: number; task: string };
  break: { active: boolean; duration: number; type: string };
}

export function QuickActionCenter() {
  const { user, hasAccess } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("wellness");
  const [searchQuery, setSearchQuery] = useState("");
  const [sessions, setSessions] = useState<SessionData>({
    meditation: { active: false, duration: 0, type: "mindfulness" },
    breathing: { active: false, duration: 0, pattern: "4-7-8" },
    focus: { active: false, duration: 0, task: "" },
    break: { active: false, duration: 0, type: "rest" },
  });
  const [customActions, setCustomActions] = useState<QuickAction[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const [favoriteActions, setFavoriteActions] = useState<string[]>([
    "meditation",
    "breathing",
    "focus-timer",
    "sleep-log",
  ]);

  // Timer for active sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => ({
        meditation: prev.meditation.active
          ? { ...prev.meditation, duration: prev.meditation.duration + 1 }
          : prev.meditation,
        breathing: prev.breathing.active
          ? { ...prev.breathing, duration: prev.breathing.duration + 1 }
          : prev.breathing,
        focus: prev.focus.active
          ? { ...prev.focus, duration: prev.focus.duration + 1 }
          : prev.focus,
        break: prev.break.active
          ? { ...prev.break, duration: prev.break.duration + 1 }
          : prev.break,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const executeAction = (actionId: string, action: () => void) => {
    action();
    setRecentActions((prev) => [
      actionId,
      ...prev.filter((id) => id !== actionId).slice(0, 4),
    ]);
  };

  const toggleSession = (type: keyof SessionData) => {
    setSessions((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        active: !prev[type].active,
        duration: prev[type].active ? 0 : prev[type].duration,
      },
    }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const actionCategories: ActionCategory[] = [
    {
      id: "wellness",
      name: "Wellness",
      icon: <Heart className="h-5 w-5" />,
      color: "bg-green-500",
      actions: [
        {
          id: "meditation",
          title: "Start Meditation",
          description: "Begin a mindfulness session",
          icon: <Brain className="h-5 w-5" />,
          category: "wellness",
          action: () => toggleSession("meditation"),
          shortcut: "M",
          active: sessions.meditation.active,
          countdown: sessions.meditation.duration,
        },
        {
          id: "breathing",
          title: "Breathing Exercise",
          description: "4-7-8 breathing pattern",
          icon: <Wind className="h-5 w-5" />,
          category: "wellness",
          action: () => toggleSession("breathing"),
          shortcut: "B",
          active: sessions.breathing.active,
          countdown: sessions.breathing.duration,
        },
        {
          id: "mood-check",
          title: "Mood Check-in",
          description: "Log your current mood",
          icon: <Heart className="h-5 w-5" />,
          category: "wellness",
          action: () => alert("Opening mood tracker..."),
          shortcut: "O",
        },
        {
          id: "gratitude",
          title: "Gratitude Journal",
          description: "Write 3 things you're grateful for",
          icon: <Sparkles className="h-5 w-5" />,
          category: "wellness",
          action: () => alert("Opening gratitude journal..."),
          premium: true,
        },
        {
          id: "body-scan",
          title: "Body Scan",
          description: "Progressive relaxation exercise",
          icon: <User className="h-5 w-5" />,
          category: "wellness",
          action: () => alert("Starting body scan..."),
          premium: true,
        },
        {
          id: "nature-sounds",
          title: "Nature Sounds",
          description: "Play calming background sounds",
          icon: <Volume2 className="h-5 w-5" />,
          category: "wellness",
          action: () => alert("Playing nature sounds..."),
        },
      ],
    },
    {
      id: "productivity",
      name: "Productivity",
      icon: <Target className="h-5 w-5" />,
      color: "bg-blue-500",
      actions: [
        {
          id: "focus-timer",
          title: "Focus Timer",
          description: "Pomodoro technique session",
          icon: <Timer className="h-5 w-5" />,
          category: "productivity",
          action: () => toggleSession("focus"),
          shortcut: "F",
          active: sessions.focus.active,
          countdown: sessions.focus.duration,
        },
        {
          id: "quick-note",
          title: "Quick Note",
          description: "Capture a thought instantly",
          icon: <FileText className="h-5 w-5" />,
          category: "productivity",
          action: () => alert("Opening quick note..."),
          shortcut: "N",
        },
        {
          id: "goal-tracker",
          title: "Goal Check",
          description: "Update daily goals",
          icon: <Target className="h-5 w-5" />,
          category: "productivity",
          action: () => alert("Opening goal tracker..."),
          shortcut: "G",
        },
        {
          id: "time-blocking",
          title: "Time Blocking",
          description: "Schedule focused work blocks",
          icon: <Calendar className="h-5 w-5" />,
          category: "productivity",
          action: () => alert("Opening time blocking..."),
          premium: true,
        },
        {
          id: "distraction-block",
          title: "Block Distractions",
          description: "Enable focus mode on devices",
          icon: <Shield className="h-5 w-5" />,
          category: "productivity",
          action: () => alert("Blocking distractions..."),
          premium: true,
        },
        {
          id: "break-reminder",
          title: "Break Reminder",
          description: "Set periodic break alerts",
          icon: <Bell className="h-5 w-5" />,
          category: "productivity",
          action: () => alert("Setting break reminders..."),
        },
      ],
    },
    {
      id: "health",
      name: "Health",
      icon: <Activity className="h-5 w-5" />,
      color: "bg-red-500",
      actions: [
        {
          id: "water-reminder",
          title: "Drink Water",
          description: "Log water intake",
          icon: <Droplets className="h-5 w-5" />,
          category: "health",
          action: () => alert("Logging water intake..."),
          shortcut: "W",
        },
        {
          id: "posture-check",
          title: "Posture Check",
          description: "Reminder to adjust posture",
          icon: <User className="h-5 w-5" />,
          category: "health",
          action: () => alert("Posture check reminder..."),
          shortcut: "P",
        },
        {
          id: "eye-break",
          title: "Eye Exercise",
          description: "20-20-20 rule reminder",
          icon: <Eye className="h-5 w-5" />,
          category: "health",
          action: () => alert("Starting eye exercise..."),
          shortcut: "E",
        },
        {
          id: "stretch",
          title: "Quick Stretch",
          description: "Desk stretching routine",
          icon: <Dumbbell className="h-5 w-5" />,
          category: "health",
          action: () => alert("Starting stretch routine..."),
          premium: true,
        },
        {
          id: "sleep-log",
          title: "Sleep Entry",
          description: "Log last night's sleep",
          icon: <Moon className="h-5 w-5" />,
          category: "health",
          action: () => alert("Opening sleep log..."),
          shortcut: "S",
        },
        {
          id: "heart-rate",
          title: "Heart Rate Check",
          description: "Measure current heart rate",
          icon: <Heart className="h-5 w-5" />,
          category: "health",
          action: () => alert("Starting heart rate measurement..."),
          premium: true,
        },
      ],
    },
    {
      id: "social",
      name: "Social",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-500",
      actions: [
        {
          id: "share-progress",
          title: "Share Progress",
          description: "Share achievements with friends",
          icon: <Share2 className="h-5 w-5" />,
          category: "social",
          action: () => alert("Sharing progress..."),
          shortcut: "H",
        },
        {
          id: "community-post",
          title: "Community Post",
          description: "Share with SleepVision community",
          icon: <MessageCircle className="h-5 w-5" />,
          category: "social",
          action: () => alert("Opening community..."),
          premium: true,
        },
        {
          id: "find-buddy",
          title: "Find Sleep Buddy",
          description: "Connect with accountability partner",
          icon: <Users className="h-5 w-5" />,
          category: "social",
          action: () => alert("Finding sleep buddy..."),
          premium: true,
        },
        {
          id: "challenge-friend",
          title: "Challenge Friend",
          description: "Start a wellness challenge",
          icon: <Trophy className="h-5 w-5" />,
          category: "social",
          action: () => alert("Creating challenge..."),
          premium: true,
        },
      ],
    },
    {
      id: "utilities",
      name: "Utilities",
      icon: <Settings className="h-5 w-5" />,
      color: "bg-gray-500",
      actions: [
        {
          id: "backup-data",
          title: "Backup Data",
          description: "Export your wellness data",
          icon: <Download className="h-5 w-5" />,
          category: "utilities",
          action: () => alert("Backing up data..."),
          premium: true,
        },
        {
          id: "sync-devices",
          title: "Sync Devices",
          description: "Sync across all devices",
          icon: <RefreshCw className="h-5 w-5" />,
          category: "utilities",
          action: () => alert("Syncing devices..."),
          premium: true,
        },
        {
          id: "weekly-report",
          title: "Weekly Report",
          description: "Generate progress report",
          icon: <BarChart3 className="h-5 w-5" />,
          category: "utilities",
          action: () => alert("Generating report..."),
          shortcut: "R",
        },
        {
          id: "settings",
          title: "Quick Settings",
          description: "Adjust app preferences",
          icon: <Settings className="h-5 w-5" />,
          category: "utilities",
          action: () => alert("Opening settings..."),
          shortcut: ",",
        },
      ],
    },
    {
      id: "entertainment",
      name: "Entertainment",
      icon: <Music className="h-5 w-5" />,
      color: "bg-pink-500",
      actions: [
        {
          id: "sleep-stories",
          title: "Sleep Stories",
          description: "Relaxing bedtime stories",
          icon: <Book className="h-5 w-5" />,
          category: "entertainment",
          action: () => alert("Playing sleep story..."),
          premium: true,
        },
        {
          id: "binaural-beats",
          title: "Binaural Beats",
          description: "Focus-enhancing audio",
          icon: <Headphones className="h-5 w-5" />,
          category: "entertainment",
          action: () => alert("Playing binaural beats..."),
          premium: true,
        },
        {
          id: "guided-imagery",
          title: "Guided Imagery",
          description: "Visualization exercises",
          icon: <Eye className="h-5 w-5" />,
          category: "entertainment",
          action: () => alert("Starting guided imagery..."),
          premium: true,
        },
        {
          id: "wellness-games",
          title: "Wellness Games",
          description: "Fun mindfulness activities",
          icon: <Gamepad2 className="h-5 w-5" />,
          category: "entertainment",
          action: () => alert("Opening wellness games..."),
          premium: true,
        },
      ],
    },
  ];

  const getFilteredActions = () => {
    const category = actionCategories.find(
      (cat) => cat.id === selectedCategory,
    );
    if (!category) return [];

    return category.actions.filter(
      (action) =>
        action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const getFavoriteActions = () => {
    return actionCategories
      .flatMap((cat) => cat.actions)
      .filter((action) => favoriteActions.includes(action.id));
  };

  const getRecentActions = () => {
    return actionCategories
      .flatMap((cat) => cat.actions)
      .filter((action) => recentActions.includes(action.id));
  };

  const toggleFavorite = (actionId: string) => {
    setFavoriteActions((prev) =>
      prev.includes(actionId)
        ? prev.filter((id) => id !== actionId)
        : [...prev, actionId],
    );
  };

  const ActionButton = ({
    action,
    compact = false,
  }: {
    action: QuickAction;
    compact?: boolean;
  }) => (
    <Card
      className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
        action.active
          ? "border-2 border-blue-500 bg-blue-50"
          : "border border-gray-200"
      } ${action.premium && !hasAccess("sleep") ? "opacity-60" : ""}`}
      onClick={() => executeAction(action.id, action.action)}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${action.active ? "bg-blue-200" : "bg-gray-100"}`}
          >
            {action.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm truncate">{action.title}</h4>
              {action.premium && (
                <Badge
                  variant="outline"
                  className="text-xs border-yellow-300 text-yellow-600"
                >
                  Pro
                </Badge>
              )}
              {action.shortcut && (
                <Badge variant="outline" className="text-xs">
                  {action.shortcut}
                </Badge>
              )}
            </div>
            {!compact && (
              <p className="text-xs text-gray-600 mt-1">{action.description}</p>
            )}
            {action.active && action.countdown !== undefined && (
              <div className="text-sm font-mono text-blue-600 mt-1">
                {formatTime(action.countdown)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(action.id);
              }}
              className="p-1"
            >
              <Star
                className={`h-4 w-4 ${
                  favoriteActions.includes(action.id)
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                }`}
              />
            </Button>
            {action.active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.action();
                }}
                className="p-1"
              >
                <Square className="h-4 w-4 text-red-500" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <Card className="border-2 border-blue-200 shadow-lg bg-gradient-to-r from-white to-blue-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl text-blue-700">
                  Quick Action Center
                </CardTitle>
                <p className="text-blue-600">
                  One-click access to all your wellness tools
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog
                open={showCustomDialog}
                onOpenChange={setShowCustomDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-blue-300 text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Custom Action
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Custom Action</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Action title" />
                    <Textarea placeholder="Description" />
                    <Button className="w-full">Create Action</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                className="border-blue-300 text-blue-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-blue-300"
              />
            </div>
            <div className="flex gap-2">
              {Object.values(sessions).some((session) => session.active) && (
                <Badge className="bg-green-600 text-white animate-pulse">
                  {
                    Object.values(sessions).filter((session) => session.active)
                      .length
                  }{" "}
                  Active Session
                  {Object.values(sessions).filter((session) => session.active)
                    .length > 1
                    ? "s"
                    : ""}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Section */}
      {favoriteActions.length > 0 && (
        <Card className="border border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700">
              <Star className="h-5 w-5 fill-yellow-500" />
              Favorites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {getFavoriteActions().map((action) => (
                <ActionButton key={action.id} action={action} compact />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Actions */}
      {recentActions.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Clock className="h-5 w-5" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {getRecentActions().map((action) => (
                <ActionButton key={action.id} action={action} compact />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-2">
        {actionCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            {category.icon}
            <span>{category.name}</span>
            <Badge variant="outline" className="ml-1">
              {category.actions.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Actions Grid */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {actionCategories.find((cat) => cat.id === selectedCategory)?.icon}
            {
              actionCategories.find((cat) => cat.id === selectedCategory)?.name
            }{" "}
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFilteredActions().map((action) => (
              <ActionButton key={action.id} action={action} />
            ))}
          </div>

          {getFilteredActions().length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No actions found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or browse different categories
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {actionCategories
              .flatMap((cat) => cat.actions)
              .filter((action) => action.shortcut)
              .map((action) => (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm">{action.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {action.shortcut}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
