import { SubscriptionTier } from "@/contexts/AuthContext";
import {
  saveSleepSchedule,
  getUserSleepSchedules,
  saveSleepEntry,
  getUserSleepEntries,
  saveMorningRoutine,
  getUserMorningRoutines,
  SleepSchedule,
  SleepEntry,
  MorningRoutine,
  updateUserProfile,
} from "./firebaseService";
import { paymentService } from "./paymentService";

// Types for local storage data structure
interface LocalUserData {
  preferences: {
    theme?: string;
    notifications?: boolean;
    timezone?: string;
  };
  sleepData: {
    lastEntry?: Omit<SleepEntry, "id" | "userId" | "createdAt">;
    recentEntries: Array<Omit<SleepEntry, "id" | "userId" | "createdAt">>;
  };
  tempSchedule?: Omit<
    SleepSchedule,
    "id" | "userId" | "createdAt" | "updatedAt"
  >;
  sessionData: {
    completedAssessments: string[];
    currentStreak: number;
    lastActiveDate: string;
  };
}

class MemoryService {
  private static instance: MemoryService;
  private localStorageKey = "sleepvision_user_data";

  static getInstance(): MemoryService {
    if (!MemoryService.instance) {
      MemoryService.instance = new MemoryService();
    }
    return MemoryService.instance;
  }

  // Check if user has database access based on subscription
  private hasCloudAccess(subscriptionTier: SubscriptionTier): boolean {
    return [
      "sleep-focused",
      "full-transformation",
      "elite-performance",
    ].includes(subscriptionTier);
  }

  // Get storage limit based on subscription tier
  private getStorageLimit(subscriptionTier: SubscriptionTier): {
    sleepEntries: number;
    schedules: number;
    morningRoutines: number;
  } {
    switch (subscriptionTier) {
      case "sleep-focused":
        return { sleepEntries: 100, schedules: 5, morningRoutines: 0 };
      case "full-transformation":
        return { sleepEntries: 365, schedules: 10, morningRoutines: 5 };
      case "elite-performance":
        return { sleepEntries: -1, schedules: -1, morningRoutines: -1 }; // Unlimited
      default:
        return { sleepEntries: 3, schedules: 1, morningRoutines: 0 }; // Free user limits
    }
  }

  // Local Storage Management for Free Users
  private getLocalData(): LocalUserData {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn("Error reading local storage:", error);
    }

    // Default structure
    return {
      preferences: {},
      sleepData: {
        recentEntries: [],
      },
      sessionData: {
        completedAssessments: [],
        currentStreak: 0,
        lastActiveDate: new Date().toISOString().split("T")[0],
      },
    };
  }

  private saveLocalData(data: LocalUserData): void {
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    } catch (error) {
      console.warn("Error saving to local storage:", error);
    }
  }

  // Sleep Schedule Management
  async saveSleepSchedule(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    schedule: Omit<SleepSchedule, "id" | "userId">,
  ): Promise<string | null> {
    if (userId && this.hasCloudAccess(subscriptionTier)) {
      // Paid users get full cloud storage
      return await saveSleepSchedule({ ...schedule, userId });
    } else {
      // Free users get limited local storage
      const localData = this.getLocalData();
      localData.tempSchedule = schedule;
      this.saveLocalData(localData);
      return "local_schedule";
    }
  }

  async getSleepSchedules(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
  ): Promise<SleepSchedule[]> {
    if (userId && this.hasCloudAccess(subscriptionTier)) {
      return await getUserSleepSchedules(userId);
    } else {
      // Return local schedule if available
      const localData = this.getLocalData();
      if (localData.tempSchedule) {
        return [
          {
            ...localData.tempSchedule,
            id: "local_schedule",
            userId: "local",
            createdAt: null,
            updatedAt: null,
          },
        ];
      }
      return [];
    }
  }

  // Sleep Entry Management
  async saveSleepEntry(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    entry: Omit<SleepEntry, "id" | "userId">,
  ): Promise<string | null> {
    if (userId && this.hasCloudAccess(subscriptionTier)) {
      return await saveSleepEntry({ ...entry, userId });
    } else {
      // Free users get limited local entries
      const localData = this.getLocalData();
      const limit = this.getStorageLimit(subscriptionTier).sleepEntries;

      localData.sleepData.lastEntry = entry;
      localData.sleepData.recentEntries.unshift(entry);

      // Keep only the allowed number of entries
      if (limit > 0) {
        localData.sleepData.recentEntries =
          localData.sleepData.recentEntries.slice(0, limit);
      }

      this.saveLocalData(localData);
      return `local_entry_${Date.now()}`;
    }
  }

  async getSleepEntries(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    limit: number = 30,
  ): Promise<SleepEntry[]> {
    if (userId && this.hasCloudAccess(subscriptionTier)) {
      return await getUserSleepEntries(userId, limit);
    } else {
      // Return local entries
      const localData = this.getLocalData();
      return localData.sleepData.recentEntries.map((entry, index) => ({
        ...entry,
        id: `local_${index}`,
        userId: "local",
        createdAt: null,
      }));
    }
  }

  // Morning Routine Management
  async saveMorningRoutine(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    routine: Omit<MorningRoutine, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<string | null> {
    // Check if user has access to morning routines
    if (
      !["full-transformation", "elite-performance"].includes(subscriptionTier)
    ) {
      throw new Error(
        "Morning routines require Full Transformation or Elite Performance subscription",
      );
    }

    if (userId && this.hasCloudAccess(subscriptionTier)) {
      return await saveMorningRoutine({ ...routine, userId });
    }

    return null; // Free users don't get morning routines
  }

  async getMorningRoutines(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
  ): Promise<MorningRoutine[]> {
    // Check if user has access to morning routines
    if (
      !["full-transformation", "elite-performance"].includes(subscriptionTier)
    ) {
      return [];
    }

    if (userId && this.hasCloudAccess(subscriptionTier)) {
      return await getUserMorningRoutines(userId);
    }

    return [];
  }

  // User Preferences Management
  async saveUserPreferences(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    preferences: { theme?: string; notifications?: boolean; timezone?: string },
  ): Promise<void> {
    if (userId && this.hasCloudAccess(subscriptionTier)) {
      await updateUserProfile(userId, { preferences });
    } else {
      // Save to local storage for free users
      const localData = this.getLocalData();
      localData.preferences = { ...localData.preferences, ...preferences };
      this.saveLocalData(localData);
    }
  }

  getUserPreferences(
    subscriptionTier: SubscriptionTier,
    userPreferences?: {
      theme?: string;
      notifications?: boolean;
      timezone?: string;
    },
  ): { theme?: string; notifications?: boolean; timezone?: string } {
    if (this.hasCloudAccess(subscriptionTier) && userPreferences) {
      return userPreferences;
    } else {
      // Return local preferences for free users
      const localData = this.getLocalData();
      return localData.preferences;
    }
  }

  // Session Data Management
  updateSessionData(
    action: "assessment_completed" | "streak_increment" | "activity_logged",
    data?: any,
  ): void {
    const localData = this.getLocalData();
    const today = new Date().toISOString().split("T")[0];

    switch (action) {
      case "assessment_completed":
        if (
          data &&
          !localData.sessionData.completedAssessments.includes(data)
        ) {
          localData.sessionData.completedAssessments.push(data);
        }
        break;
      case "streak_increment":
        if (localData.sessionData.lastActiveDate !== today) {
          localData.sessionData.currentStreak += 1;
          localData.sessionData.lastActiveDate = today;
        }
        break;
      case "activity_logged":
        localData.sessionData.lastActiveDate = today;
        break;
    }

    this.saveLocalData(localData);
  }

  getSessionData(): {
    completedAssessments: string[];
    currentStreak: number;
    lastActiveDate: string;
  } {
    const localData = this.getLocalData();
    return localData.sessionData;
  }

  // Migration from Free to Paid
  async migrateUserData(
    userId: string,
    oldTier: SubscriptionTier,
    newTier: SubscriptionTier,
  ): Promise<void> {
    // Only migrate if upgrading to a higher tier with cloud access
    if (this.hasCloudAccess(newTier)) {
      const localData = this.getLocalData();

      try {
        // Migrate sleep entries
        for (const entry of localData.sleepData.recentEntries) {
          await saveSleepEntry({ ...entry, userId });
        }

        // Migrate schedule if exists
        if (localData.tempSchedule) {
          await saveSleepSchedule({ ...localData.tempSchedule, userId });
        }

        // Migrate preferences
        if (Object.keys(localData.preferences).length > 0) {
          await updateUserProfile(userId, {
            preferences: localData.preferences,
          });
        }

        // Clear local data after successful migration
        localStorage.removeItem(this.localStorageKey);
      } catch (error) {
        console.error("Error migrating user data:", error);
        throw error;
      }
    }
  }

  // Get storage usage information
  getStorageInfo(subscriptionTier: SubscriptionTier): {
    tier: SubscriptionTier;
    hasCloudAccess: boolean;
    limits: {
      sleepEntries: number;
      schedules: number;
      morningRoutines: number;
    };
    localDataSize: number;
  } {
    const limits = this.getStorageLimit(subscriptionTier);
    const localData = this.getLocalData();
    const localDataSize = JSON.stringify(localData).length;

    return {
      tier: subscriptionTier,
      hasCloudAccess: this.hasCloudAccess(subscriptionTier),
      limits,
      localDataSize,
    };
  }

  // Clear all local data (for debugging or user request)
  clearLocalData(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  // Verify payment memory is linked to Google user
  async verifyPaymentMemoryLink(
    userId: string,
    googleEmail: string,
  ): Promise<{
    isLinked: boolean;
    subscriptionExists: boolean;
    paymentHistoryCount: number;
  }> {
    try {
      const subscription = await paymentService.getUserSubscription(userId);
      const paymentHistory = await paymentService.getUserPaymentHistory(
        userId,
        1,
      );

      return {
        isLinked: subscription?.googleEmail === googleEmail,
        subscriptionExists: subscription !== null,
        paymentHistoryCount: paymentHistory.length,
      };
    } catch (error) {
      console.warn("Error verifying payment memory link:", error);
      return {
        isLinked: false,
        subscriptionExists: false,
        paymentHistoryCount: 0,
      };
    }
  }

  // Get enhanced storage info with payment memory status
  async getEnhancedStorageInfo(
    userId: string | null,
    subscriptionTier: SubscriptionTier,
    googleEmail?: string,
  ): Promise<{
    tier: SubscriptionTier;
    hasCloudAccess: boolean;
    limits: {
      sleepEntries: number;
      schedules: number;
      morningRoutines: number;
    };
    localDataSize: number;
    paymentMemoryLinked: boolean;
    subscriptionVerified: boolean;
  }> {
    const basicInfo = this.getStorageInfo(subscriptionTier);

    if (userId && googleEmail) {
      const paymentStatus = await this.verifyPaymentMemoryLink(
        userId,
        googleEmail,
      );
      return {
        ...basicInfo,
        paymentMemoryLinked: paymentStatus.isLinked,
        subscriptionVerified: paymentStatus.subscriptionExists,
      };
    }

    return {
      ...basicInfo,
      paymentMemoryLinked: false,
      subscriptionVerified: false,
    };
  }
}

export const memoryService = MemoryService.getInstance();
export default memoryService;
