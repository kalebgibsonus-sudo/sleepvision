import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "sleep" | "breathing" | "consistency" | "milestone" | "special";
  points: number;
  unlockedAt?: string;
  requirement: {
    type: "streak" | "total" | "quality" | "method" | "level" | "custom";
    value: number;
    description: string;
  };
  unlocks?: {
    type:
      | "breathing_method"
      | "sleep_technique"
      | "theme"
      | "badge"
      | "feature";
    itemId: string;
    itemName: string;
  }[];
}

export interface UnlockableItem {
  id: string;
  name: string;
  description: string;
  type: "breathing_method" | "sleep_technique" | "theme" | "badge" | "feature";
  category: string;
  requiredLevel?: number;
  requiredAchievement?: string;
  cost?: number; // in points
  icon: string;
  color: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  title: string;
  benefits: string[];
}

export interface RewardStats {
  totalPoints: number;
  unlockedAchievements: number;
  totalAchievements: number;
  unlockedItems: number;
  totalItems: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
}

export const useRewards = () => {
  const { user } = useAuth();
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    title: "Sleep Apprentice",
    benefits: [],
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockableItems, setUnlockableItems] = useState<UnlockableItem[]>([]);
  const [rewardStats, setRewardStats] = useState<RewardStats>({
    totalPoints: 0,
    unlockedAchievements: 0,
    totalAchievements: 0,
    unlockedItems: 0,
    totalItems: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
  });

  // Level titles and XP requirements
  const levelSystem = [
    {
      level: 1,
      title: "Sleep Apprentice",
      xpRequired: 0,
      benefits: ["Basic breathing methods", "Sleep tracking"],
    },
    {
      level: 2,
      title: "Rest Seeker",
      xpRequired: 100,
      benefits: ["4-7-8 breathing unlocked", "Progress insights"],
    },
    {
      level: 3,
      title: "Dream Walker",
      xpRequired: 250,
      benefits: ["Box breathing unlocked", "Custom reminders"],
    },
    {
      level: 4,
      title: "Sleep Warrior",
      xpRequired: 500,
      benefits: ["Wim Hof method unlocked", "Advanced analytics"],
    },
    {
      level: 5,
      title: "Rest Master",
      xpRequired: 1000,
      benefits: ["All breathing methods", "Luna Pro features"],
    },
    {
      level: 6,
      title: "Sleep Sage",
      xpRequired: 2000,
      benefits: ["Binaural beats", "Sleep stories"],
    },
    {
      level: 7,
      title: "Zen Master",
      xpRequired: 3500,
      benefits: ["Meditation sessions", "Chakra breathing"],
    },
    {
      level: 8,
      title: "Dream Architect",
      xpRequired: 5500,
      benefits: ["Lucid dreaming techniques", "REM optimization"],
    },
    {
      level: 9,
      title: "Sleep Shaman",
      xpRequired: 8000,
      benefits: ["Shamanic breathing", "Energy healing"],
    },
    {
      level: 10,
      title: "Transcendent Being",
      xpRequired: 12000,
      benefits: ["All methods unlocked", "Teaching mode"],
    },
  ];

  // Define all achievements
  const allAchievements: Achievement[] = [
    // Sleep Achievements
    {
      id: "first-sleep",
      title: "First Night",
      description: "Complete your first sleep tracking session",
      icon: "🌙",
      category: "sleep",
      points: 10,
      requirement: {
        type: "total",
        value: 1,
        description: "Track 1 night of sleep",
      },
      unlocks: [
        {
          type: "breathing_method",
          itemId: "coherent-breathing",
          itemName: "Coherent Breathing",
        },
      ],
    },
    {
      id: "week-warrior",
      title: "Week Warrior",
      description: "Track sleep for 7 consecutive days",
      icon: "📅",
      category: "consistency",
      points: 50,
      requirement: {
        type: "streak",
        value: 7,
        description: "7-day sleep tracking streak",
      },
      unlocks: [
        {
          type: "breathing_method",
          itemId: "triangle-breathing",
          itemName: "Triangle Breathing",
        },
      ],
    },
    {
      id: "month-master",
      title: "Month Master",
      description: "Track sleep for 30 consecutive days",
      icon: "🏆",
      category: "consistency",
      points: 200,
      requirement: {
        type: "streak",
        value: 30,
        description: "30-day sleep tracking streak",
      },
      unlocks: [
        {
          type: "breathing_method",
          itemId: "alternate-nostril",
          itemName: "Alternate Nostril Breathing",
        },
      ],
    },
    {
      id: "quality-sleeper",
      title: "Quality Sleeper",
      description: "Achieve average sleep quality of 8+ for a week",
      icon: "⭐",
      category: "sleep",
      points: 75,
      requirement: {
        type: "quality",
        value: 8,
        description: "Average 8+ sleep quality for 7 days",
      },
      unlocks: [
        {
          type: "sleep_technique",
          itemId: "progressive-relaxation",
          itemName: "Progressive Muscle Relaxation",
        },
      ],
    },

    // Breathing Achievements
    {
      id: "breath-beginner",
      title: "Breath Beginner",
      description: "Complete your first breathing session",
      icon: "🌬️",
      category: "breathing",
      points: 15,
      requirement: {
        type: "total",
        value: 1,
        description: "Complete 1 breathing session",
      },
    },
    {
      id: "breathing-enthusiast",
      title: "Breathing Enthusiast",
      description: "Complete 10 breathing sessions",
      icon: "💨",
      category: "breathing",
      points: 40,
      requirement: {
        type: "total",
        value: 10,
        description: "Complete 10 breathing sessions",
      },
      unlocks: [
        {
          type: "theme",
          itemId: "ocean-theme",
          itemName: "Ocean Tranquility Theme",
        },
      ],
    },
    {
      id: "wim-hof-warrior",
      title: "Wim Hof Warrior",
      description: "Complete a full Wim Hof breathing session",
      icon: "⚡",
      category: "breathing",
      points: 100,
      requirement: {
        type: "method",
        value: 1,
        description: "Complete Wim Hof method",
      },
      unlocks: [
        {
          type: "breathing_method",
          itemId: "tummo-breathing",
          itemName: "Tummo Breathing",
        },
      ],
    },

    // Milestone Achievements
    {
      id: "level-5",
      title: "Rest Master Achieved",
      description: "Reach level 5 in your sleep journey",
      icon: "👑",
      category: "milestone",
      points: 150,
      requirement: { type: "level", value: 5, description: "Reach level 5" },
      unlocks: [
        {
          type: "feature",
          itemId: "luna-pro",
          itemName: "Luna Pro AI Features",
        },
      ],
    },
    {
      id: "century-club",
      title: "Century Club",
      description: "Track 100 nights of sleep",
      icon: "💯",
      category: "milestone",
      points: 300,
      requirement: {
        type: "total",
        value: 100,
        description: "Track 100 nights",
      },
      unlocks: [
        {
          type: "sleep_technique",
          itemId: "lucid-dreaming",
          itemName: "Lucid Dreaming Guide",
        },
      ],
    },

    // Special Achievements
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Use morning breathing techniques 7 days in a row",
      icon: "🐦",
      category: "special",
      points: 60,
      requirement: {
        type: "streak",
        value: 7,
        description: "7-day morning breathing streak",
      },
    },
    {
      id: "night-owl",
      title: "Night Owl Transformer",
      description: "Improve bedtime by 30+ minutes consistently",
      icon: "🦉",
      category: "special",
      points: 80,
      requirement: {
        type: "custom",
        value: 30,
        description: "Improve bedtime by 30+ minutes",
      },
    },
  ];

  // Define unlockable items
  const allUnlockableItems: UnlockableItem[] = [
    // Advanced Breathing Methods
    {
      id: "tummo-breathing",
      name: "Tummo Breathing",
      description: "Tibetan inner fire breathing for energy and warmth",
      type: "breathing_method",
      category: "Advanced Breathing",
      requiredAchievement: "wim-hof-warrior",
      icon: "🔥",
      color: "from-red-500 to-orange-500",
      isUnlocked: false,
    },
    {
      id: "holotropic-breathing",
      name: "Holotropic Breathing",
      description: "Deep consciousness-altering breathing technique",
      type: "breathing_method",
      category: "Advanced Breathing",
      requiredLevel: 7,
      icon: "🌌",
      color: "from-purple-500 to-indigo-500",
      isUnlocked: false,
    },
    {
      id: "breath-of-fire",
      name: "Breath of Fire",
      description: "Kundalini breathing for energy and focus",
      type: "breathing_method",
      category: "Energy Breathing",
      requiredLevel: 6,
      icon: "🔥",
      color: "from-yellow-500 to-red-500",
      isUnlocked: false,
    },

    // Sleep Techniques
    {
      id: "progressive-relaxation",
      name: "Progressive Muscle Relaxation",
      description: "Systematic muscle relaxation for deep sleep",
      type: "sleep_technique",
      category: "Sleep Methods",
      requiredAchievement: "quality-sleeper",
      icon: "💆",
      color: "from-blue-500 to-purple-500",
      isUnlocked: false,
    },
    {
      id: "body-scan",
      name: "Body Scan Meditation",
      description: "Mindful body awareness for sleep preparation",
      type: "sleep_technique",
      category: "Meditation",
      requiredLevel: 4,
      icon: "🧘",
      color: "from-green-500 to-teal-500",
      isUnlocked: false,
    },
    {
      id: "binaural-beats",
      name: "Binaural Sleep Beats",
      description: "Brainwave entrainment for deeper sleep",
      type: "sleep_technique",
      category: "Audio Therapy",
      requiredLevel: 6,
      icon: "🎵",
      color: "from-indigo-500 to-purple-500",
      isUnlocked: false,
    },
    {
      id: "lucid-dreaming",
      name: "Lucid Dreaming Guide",
      description: "Techniques for conscious dreaming",
      type: "sleep_technique",
      category: "Dream Work",
      requiredAchievement: "century-club",
      icon: "✨",
      color: "from-purple-500 to-pink-500",
      isUnlocked: false,
    },

    // Themes and Cosmetics
    {
      id: "ocean-theme",
      name: "Ocean Tranquility",
      description: "Calming ocean sounds and visuals",
      type: "theme",
      category: "Themes",
      requiredAchievement: "breathing-enthusiast",
      icon: "🌊",
      color: "from-blue-400 to-cyan-400",
      isUnlocked: false,
    },
    {
      id: "forest-theme",
      name: "Forest Sanctuary",
      description: "Peaceful forest ambiance",
      type: "theme",
      category: "Themes",
      requiredLevel: 3,
      icon: "🌲",
      color: "from-green-400 to-emerald-400",
      isUnlocked: false,
    },
    {
      id: "space-theme",
      name: "Cosmic Meditation",
      description: "Journey through the cosmos",
      type: "theme",
      category: "Themes",
      requiredLevel: 8,
      icon: "🚀",
      color: "from-purple-400 to-indigo-400",
      isUnlocked: false,
    },

    // Features
    {
      id: "luna-pro",
      name: "Luna Pro AI",
      description: "Advanced AI insights and personalized coaching",
      type: "feature",
      category: "AI Features",
      requiredAchievement: "level-5",
      icon: "🤖",
      color: "from-purple-500 to-pink-500",
      isUnlocked: false,
    },
    {
      id: "sleep-stories",
      name: "Sleep Stories",
      description: "Narrated stories to guide you to sleep",
      type: "feature",
      category: "Audio Content",
      requiredLevel: 6,
      icon: "📚",
      color: "from-indigo-500 to-purple-500",
      isUnlocked: false,
    },
  ];

  // Load saved data
  useEffect(() => {
    if (!user) return;

    const savedLevel = localStorage.getItem(`userLevel-${user.id}`);
    const savedAchievements = localStorage.getItem(`achievements-${user.id}`);
    const savedItems = localStorage.getItem(`unlockedItems-${user.id}`);

    if (savedLevel) {
      setUserLevel(JSON.parse(savedLevel));
    }

    // Initialize achievements with unlock status
    const achievementsWithStatus = allAchievements.map((achievement) => {
      const saved = savedAchievements ? JSON.parse(savedAchievements) : [];
      const unlockedAchievement = saved.find(
        (a: any) => a.id === achievement.id,
      );
      return {
        ...achievement,
        unlockedAt: unlockedAchievement?.unlockedAt,
      };
    });
    setAchievements(achievementsWithStatus);

    // Initialize items with unlock status
    const itemsWithStatus = allUnlockableItems.map((item) => {
      const saved = savedItems ? JSON.parse(savedItems) : [];
      const unlockedItem = saved.find((i: any) => i.id === item.id);
      return {
        ...item,
        isUnlocked: !!unlockedItem,
        unlockedAt: unlockedItem?.unlockedAt,
      };
    });
    setUnlockableItems(itemsWithStatus);

    updateRewardStats();
  }, [user]);

  const updateRewardStats = () => {
    const unlockedAchievements = achievements.filter(
      (a) => a.unlockedAt,
    ).length;
    const unlockedItems = unlockableItems.filter((i) => i.isUnlocked).length;
    const totalPoints = achievements
      .filter((a) => a.unlockedAt)
      .reduce((sum, a) => sum + a.points, 0);

    setRewardStats({
      totalPoints,
      unlockedAchievements,
      totalAchievements: achievements.length,
      unlockedItems,
      totalItems: unlockableItems.length,
      currentStreak: getCurrentStreak(),
      longestStreak: getLongestStreak(),
      totalSessions: getTotalSessions(),
    });
  };

  const getCurrentStreak = (): number => {
    const entries = JSON.parse(localStorage.getItem("sleepEntries") || "[]");
    // Simplified streak calculation
    return Math.min(entries.length, 7); // Placeholder
  };

  const getLongestStreak = (): number => {
    // Placeholder implementation
    return getCurrentStreak();
  };

  const getTotalSessions = (): number => {
    const sleepEntries = JSON.parse(
      localStorage.getItem("sleepEntries") || "[]",
    );
    const breathingSessions = JSON.parse(
      localStorage.getItem("breathingSessions") || "[]",
    );
    return sleepEntries.length + breathingSessions.length;
  };

  const calculateLevel = (totalXP: number): UserLevel => {
    let currentLevel = levelSystem[0];

    for (let i = levelSystem.length - 1; i >= 0; i--) {
      if (totalXP >= levelSystem[i].xpRequired) {
        currentLevel = levelSystem[i];
        break;
      }
    }

    const nextLevel = levelSystem.find((l) => l.xpRequired > totalXP);
    const xpToNextLevel = nextLevel ? nextLevel.xpRequired - totalXP : 0;
    const currentXP = totalXP - currentLevel.xpRequired;

    return {
      level: currentLevel.level,
      currentXP,
      xpToNextLevel,
      totalXP,
      title: currentLevel.title,
      benefits: currentLevel.benefits,
    };
  };

  const addExperience = (xp: number, reason: string) => {
    if (!user) return;

    const newTotalXP = userLevel.totalXP + xp;
    const newLevel = calculateLevel(newTotalXP);

    setUserLevel(newLevel);
    localStorage.setItem(`userLevel-${user.id}`, JSON.stringify(newLevel));

    // Check for level-up achievements
    checkAchievements();

    return newLevel;
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user) return;

    const achievement = achievements.find((a) => a.id === achievementId);
    if (!achievement || achievement.unlockedAt) return;

    const unlockedAt = new Date().toISOString();
    const updatedAchievements = achievements.map((a) =>
      a.id === achievementId ? { ...a, unlockedAt } : a,
    );

    setAchievements(updatedAchievements);

    // Save to localStorage
    const unlockedAchievementsList = updatedAchievements
      .filter((a) => a.unlockedAt)
      .map((a) => ({ id: a.id, unlockedAt: a.unlockedAt }));
    localStorage.setItem(
      `achievements-${user.id}`,
      JSON.stringify(unlockedAchievementsList),
    );

    // Add XP for the achievement
    addExperience(achievement.points, `Achievement: ${achievement.title}`);

    // Unlock any items tied to this achievement
    if (achievement.unlocks) {
      achievement.unlocks.forEach((unlock) => {
        unlockItem(unlock.itemId);
      });
    }

    updateRewardStats();

    return achievement;
  };

  const unlockItem = (itemId: string) => {
    if (!user) return;

    const item = unlockableItems.find((i) => i.id === itemId);
    if (!item || item.isUnlocked) return;

    const unlockedAt = new Date().toISOString();
    const updatedItems = unlockableItems.map((i) =>
      i.id === itemId ? { ...i, isUnlocked: true, unlockedAt } : i,
    );

    setUnlockableItems(updatedItems);

    // Save to localStorage
    const unlockedItemsList = updatedItems
      .filter((i) => i.isUnlocked)
      .map((i) => ({ id: i.id, unlockedAt: i.unlockedAt }));
    localStorage.setItem(
      `unlockedItems-${user.id}`,
      JSON.stringify(unlockedItemsList),
    );

    updateRewardStats();

    return item;
  };

  const checkAchievements = () => {
    // This would contain logic to check various conditions and unlock achievements
    // For now, this is a simplified version
    const stats = rewardStats;

    // Check total sleep tracking
    if (stats.totalSessions >= 1) {
      unlockAchievement("first-sleep");
    }

    // Check streak achievements
    if (stats.currentStreak >= 7) {
      unlockAchievement("week-warrior");
    }

    if (stats.currentStreak >= 30) {
      unlockAchievement("month-master");
    }

    // Check level achievements
    if (userLevel.level >= 5) {
      unlockAchievement("level-5");
    }
  };

  const getUnlockedBreathingMethods = () => {
    return unlockableItems.filter(
      (item) => item.type === "breathing_method" && item.isUnlocked,
    );
  };

  const getUnlockedSleepTechniques = () => {
    return unlockableItems.filter(
      (item) => item.type === "sleep_technique" && item.isUnlocked,
    );
  };

  const canUnlockItem = (item: UnlockableItem): boolean => {
    if (item.isUnlocked) return false;

    if (item.requiredLevel && userLevel.level < item.requiredLevel) {
      return false;
    }

    if (item.requiredAchievement) {
      const achievement = achievements.find(
        (a) => a.id === item.requiredAchievement,
      );
      if (!achievement?.unlockedAt) return false;
    }

    return true;
  };

  return {
    userLevel,
    achievements,
    unlockableItems,
    rewardStats,
    addExperience,
    unlockAchievement,
    unlockItem,
    checkAchievements,
    getUnlockedBreathingMethods,
    getUnlockedSleepTechniques,
    canUnlockItem,
    updateRewardStats,
  };
};
