import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRewards } from "@/hooks/useRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Gift,
  Star,
  Crown,
  Zap,
  Lock,
  Unlock,
  Trophy,
  Target,
  ArrowLeft,
  Home,
  TrendingUp,
  Heart,
  Brain,
  Wind,
  Moon,
  Sun,
  Sparkles,
  CheckCircle,
  Clock,
  Flame,
  Award,
} from "lucide-react";

interface RewardsPageProps {
  onNavigate: (page: string) => void;
  onGoHome?: () => void;
}

export function RewardsPage({ onNavigate, onGoHome }: RewardsPageProps) {
  const { user } = useAuth();
  const {
    userLevel,
    achievements,
    unlockableItems,
    rewardStats,
    unlockItem,
    canUnlockItem,
    getUnlockedBreathingMethods,
    getUnlockedSleepTechniques,
  } = useRewards();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false);

  const categories = [
    { id: "all", name: "All", icon: <Star className="h-4 w-4" /> },
    { id: "sleep", name: "Sleep", icon: <Moon className="h-4 w-4" /> },
    { id: "breathing", name: "Breathing", icon: <Wind className="h-4 w-4" /> },
    {
      id: "consistency",
      name: "Consistency",
      icon: <Target className="h-4 w-4" />,
    },
    {
      id: "milestone",
      name: "Milestones",
      icon: <Trophy className="h-4 w-4" />,
    },
    { id: "special", name: "Special", icon: <Sparkles className="h-4 w-4" /> },
  ];

  const itemCategories = [
    { id: "all", name: "All Items" },
    { id: "breathing_method", name: "Breathing Methods" },
    { id: "sleep_technique", name: "Sleep Techniques" },
    { id: "theme", name: "Themes" },
    { id: "feature", name: "Features" },
  ];

  const getProgressToNextLevel = () => {
    const total = userLevel.currentXP + userLevel.xpToNextLevel;
    const current = userLevel.currentXP;
    return total > 0 ? (current / total) * 100 : 0;
  };

  const filteredAchievements = achievements.filter((achievement) => {
    if (
      selectedCategory !== "all" &&
      achievement.category !== selectedCategory
    ) {
      return false;
    }
    if (showUnlockedOnly && !achievement.unlockedAt) {
      return false;
    }
    return true;
  });

  const getItemIcon = (item: any) => {
    switch (item.type) {
      case "breathing_method":
        return <Wind className="h-6 w-6" />;
      case "sleep_technique":
        return <Moon className="h-6 w-6" />;
      case "theme":
        return <Sparkles className="h-6 w-6" />;
      case "feature":
        return <Star className="h-6 w-6" />;
      default:
        return <Gift className="h-6 w-6" />;
    }
  };

  const useItem = (itemTitle: string) => {
    switch (itemTitle) {
      case "Advanced Breathing Techniques":
        alert("Advanced breathing techniques are now available in your Breathing Methods section!");
        break;
      case "Custom Sleep Themes":
        alert("Custom sleep themes have been applied to your app! Check your settings.");
        break;
      case "Luna Pro Features":
        alert("Luna Pro is now active! Enjoy enhanced AI capabilities and personalized insights.");
        break;
      case "Morning Routine Builder":
        alert("Morning Routine Builder is now accessible! Create your perfect morning flow.");
        break;
      case "Meditation Library":
        alert("Full meditation library unlocked! Explore guided meditations in your dashboard.");
        break;
      case "Sleep Sound Collection":
        alert("Premium sleep sounds are now available! Check your sleep environment settings.");
        break;
      default:
        alert(`Using ${itemTitle}! Enjoy your unlocked feature.`);
    }
  };

  const getUnlockRequirement = (item: any) => {
    if (item.requiredLevel) {
      return `Reach Level ${item.requiredLevel}`;
    }
    if (item.requiredAchievement) {
      const achievement = achievements.find(
        (a) => a.id === item.requiredAchievement,
      );
      return achievement
        ? `Unlock "${achievement.title}"`
        : "Complete requirement";
    }
    if (item.cost) {
      return `${item.cost} Points`;
    }
    return "Available";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-yellow-900 mb-2 flex items-center gap-3">
            <Gift className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-600" />
            Rewards & Achievements
          </h1>
          <p className="text-yellow-600 text-lg">
            Unlock new sleep methods, breathing techniques, and exclusive
            features
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => onNavigate("dashboard")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          {onGoHome && (
            <Button
              onClick={onGoHome}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          )}
        </div>
      </div>

      {/* Level Progress Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-yellow-50 border border-purple-200">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-yellow-500 rounded-full">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-900">
                  Level {userLevel.level}
                </h2>
                <p className="text-purple-700 text-lg font-semibold">
                  {userLevel.title}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">
                {rewardStats.totalPoints}
              </div>
              <div className="text-sm text-yellow-700">Total Points</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-purple-700 mb-2">
                <span>Progress to Level {userLevel.level + 1}</span>
                <span>
                  {userLevel.currentXP} /{" "}
                  {userLevel.currentXP + userLevel.xpToNextLevel} XP
                </span>
              </div>
              <Progress value={getProgressToNextLevel()} className="h-3" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-700">
                  {rewardStats.unlockedAchievements}
                </div>
                <div className="text-xs text-purple-600">Achievements</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <Unlock className="h-6 w-6 text-green-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-700">
                  {rewardStats.unlockedItems}
                </div>
                <div className="text-xs text-purple-600">Unlocked Items</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-700">
                  {rewardStats.currentStreak}
                </div>
                <div className="text-xs text-purple-600">Current Streak</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-purple-100">
                <Clock className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                <div className="text-lg font-bold text-purple-700">
                  {rewardStats.totalSessions}
                </div>
                <div className="text-xs text-purple-600">Total Sessions</div>
              </div>
            </div>

            {/* Current Level Benefits */}
            <div className="bg-white p-4 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-2">
                Current Level Benefits:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {userLevel.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-purple-700"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger value="unlockables" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Unlockable Items
          </TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          {/* Achievement Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="flex items-center gap-2"
                    >
                      {category.icon}
                      {category.name}
                    </Button>
                  ))}
                </div>
                <Button
                  variant={showUnlockedOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Unlocked Only
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <Card
                key={achievement.id}
                className={`transition-all ${
                  achievement.unlockedAt
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`text-4xl ${achievement.unlockedAt ? "" : "grayscale opacity-50"}`}
                      >
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle
                          className={`text-lg ${achievement.unlockedAt ? "text-green-800" : "text-gray-600"}`}
                        >
                          {achievement.title}
                        </CardTitle>
                        <Badge
                          className={
                            achievement.unlockedAt
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }
                        >
                          {achievement.category}
                        </Badge>
                      </div>
                    </div>
                    {achievement.unlockedAt && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-sm mb-3 ${achievement.unlockedAt ? "text-green-700" : "text-gray-600"}`}
                  >
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">
                        {achievement.points} XP
                      </span>
                    </div>
                    {achievement.unlockedAt && (
                      <Badge variant="outline" className="text-xs">
                        Unlocked{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  {!achievement.unlockedAt && (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-xs text-gray-600">
                      Requirement: {achievement.requirement.description}
                    </div>
                  )}

                  {achievement.unlocks && achievement.unlockedAt && (
                    <div className="mt-3 p-2 bg-green-100 rounded">
                      <p className="text-xs text-green-700 font-medium mb-1">
                        Unlocked:
                      </p>
                      {achievement.unlocks.map((unlock, index) => (
                        <p key={index} className="text-xs text-green-600">
                          • {unlock.itemName}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Unlockable Items Tab */}
        <TabsContent value="unlockables" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
              <CardContent className="p-4 text-center">
                <Wind className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {getUnlockedBreathingMethods().length}
                </div>
                <div className="text-sm text-blue-600">Breathing Methods</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
              <CardContent className="p-4 text-center">
                <Moon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-700">
                  {getUnlockedSleepTechniques().length}
                </div>
                <div className="text-sm text-purple-600">Sleep Techniques</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <CardContent className="p-4 text-center">
                <Sparkles className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {
                    unlockableItems.filter(
                      (i) => i.type === "theme" && i.isUnlocked,
                    ).length
                  }
                </div>
                <div className="text-sm text-green-600">Themes</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
              <CardContent className="p-4 text-center">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">
                  {
                    unlockableItems.filter(
                      (i) => i.type === "feature" && i.isUnlocked,
                    ).length
                  }
                </div>
                <div className="text-sm text-yellow-600">Features</div>
              </CardContent>
            </Card>
          </div>

          {/* Unlockable Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockableItems.map((item) => (
              <Card
                key={item.id}
                className={`transition-all ${
                  item.isUnlocked
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    : canUnlockItem(item)
                      ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg cursor-pointer"
                      : "bg-gray-50 border-gray-200"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 bg-gradient-to-r ${item.color} rounded-full ${item.isUnlocked ? "" : "grayscale opacity-60"}`}
                      >
                        <div className="text-white">{getItemIcon(item)}</div>
                      </div>
                      <div>
                        <CardTitle
                          className={`text-lg ${item.isUnlocked ? "text-green-800" : canUnlockItem(item) ? "text-blue-800" : "text-gray-600"}`}
                        >
                          {item.name}
                        </CardTitle>
                        <Badge
                          className={`${item.isUnlocked ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                        >
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    {item.isUnlocked ? (
                      <Unlock className="h-6 w-6 text-green-500" />
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p
                    className={`text-sm mb-4 ${item.isUnlocked ? "text-green-700" : "text-gray-600"}`}
                  >
                    {item.description}
                  </p>

                  {!item.isUnlocked && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-600">
                        <strong>Requirement:</strong>{" "}
                        {getUnlockRequirement(item)}
                      </div>
                      {canUnlockItem(item) && (
                        <Button
                          onClick={() => unlockItem(item.id)}
                          className="w-full"
                          size="sm"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Unlock Now
                        </Button>
                      )}
                    </div>
                  )}

                  {item.isUnlocked && (
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className="text-xs text-green-700"
                      >
                        Unlocked!
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => useItem(item.title)}
                      >
                        Use Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
