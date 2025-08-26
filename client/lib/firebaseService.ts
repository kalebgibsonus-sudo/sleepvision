import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db, safeFirestoreOperation } from "./firebase";
import { SubscriptionTier } from "@/contexts/AuthContext";
import {
  handleFirebaseError,
  retryFirebaseOperation,
  firebaseCircuitBreaker,
  isFirebaseInternalError,
  getFirebaseErrorId
} from "./firebaseUtils";

// Helper function to handle Firestore errors gracefully
const handleFirestoreError = (error: any, operation: string) => {
  console.warn(`Firestore ${operation} failed:`, error);

  // Check for Firebase internal assertion failures
  if (
    error.message?.includes("INTERNAL ASSERTION FAILED") ||
    error.message?.includes("Unexpected state") ||
    error.code === "internal" ||
    error.code === "aborted" ||
    error.message?.includes("ID: b815") ||
    error.message?.includes("ID: ca9") ||
    error.message?.includes("ID: c050") ||
    error.message?.match(/ID: [a-z0-9]+/) // Catch any Firebase internal error ID
  ) {
    console.warn(
      `Firebase internal error detected in ${operation}. Error ID: ${error.message?.match(/ID: ([a-z0-9]+)/)?.[1] || 'unknown'}. App will continue with fallback.`,
    );
    return null;
  }

  // Check for authentication/token errors
  if (
    error.code === "unauthenticated" ||
    error.message?.includes("missing stream token") ||
    error.message?.includes("auth/requires-recent-login") ||
    error.message?.includes("auth/user-token-expired") ||
    error.code === "failed-precondition"
  ) {
    console.warn(
      `Authentication issue detected in ${operation}. User may need to re-authenticate.`,
    );
    return null;
  }

  // Check if it's a network error
  if (
    error.code === "unavailable" ||
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("TypeError: Failed to fetch") ||
    error.message?.includes("Network unavailable") ||
    error.name === "TypeError"
  ) {
    console.warn(
      "Network connectivity issue detected. App will continue with local functionality.",
    );
    return null; // Return null for graceful degradation
  }

  // For permission errors, don't throw - just log and return null
  if (error.code === "permission-denied") {
    console.warn(
      `Permission denied for ${operation}. Continuing with offline mode.`,
    );
    return null;
  }

  // For other errors, still return null for graceful degradation
  console.warn(`${operation} failed with error:`, error.code || error.message);
  return null; // Don't throw errors - gracefully degrade
};

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'payment_failed';
  stripeCustomerId?: string;
  isActive?: boolean;
  createdAt: any;
  lastLogin: any;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    timezone?: string;
  };
}

export interface SleepSchedule {
  id?: string;
  userId: string;
  title: string;
  schedule: Array<{
    time: string;
    activity: string;
    description: string;
    category: "evening" | "night" | "morning";
  }>;
  questionnaireData: any;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
}

export interface MorningRoutine {
  id?: string;
  userId: string;
  title: string;
  routine: Array<{
    time: string;
    activity: string;
    description: string;
    category: "preparation" | "wellness" | "productivity" | "energy";
  }>;
  questionnaireData: any;
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
}

export interface SleepEntry {
  id?: string;
  userId: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  sleepQuality: number; // 1-10 scale
  mood: string;
  notes?: string;
  createdAt: any;
}

// User Profile Management
export const createUserProfile = async (user: UserProfile): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, {
      ...user,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, "createUserProfile");
    // Don't throw error - allow graceful degradation
  }
};

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  return safeFirestoreOperation(
    async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() } as UserProfile;
      }
      return null;
    },
    null,
    "getUserProfile",
  );
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<UserProfile>,
): Promise<void> => {
  return safeFirestoreOperation(
    async () => {
      // Verify we have a valid auth state and database connection
      if (!auth || !db) {
        console.warn("Firebase auth or database not available for updateUserProfile");
        return;
      }

      // Check if user is authenticated
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.warn("No authenticated user found for updateUserProfile");
        return;
      }

      // Verify the userId matches the current user
      if (currentUser.uid !== userId) {
        console.warn("UserId mismatch in updateUserProfile - security check failed");
        return;
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        ...data,
        lastLogin: serverTimestamp(),
      });

      console.log("✅ User profile updated successfully");
    },
    undefined,
    "updateUserProfile",
  );
};

// Sleep Schedule Management
export const saveSleepSchedule = async (
  schedule: Omit<SleepSchedule, "id">,
): Promise<string> => {
  try {
    const scheduleRef = await addDoc(collection(db, "sleepSchedules"), {
      ...schedule,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return scheduleRef.id;
  } catch (error) {
    const result = handleFirestoreError(error, "saveSleepSchedule");
    if (result === null) {
      // Return a temporary ID for offline functionality
      return `temp_${Date.now()}`;
    }
    throw error;
  }
};

export const getUserSleepSchedules = async (
  userId: string,
): Promise<SleepSchedule[]> => {
  return firebaseCircuitBreaker.execute(async () => {
    return await retryFirebaseOperation(async () => {
      // Use simpler query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, "sleepSchedules"),
        where("userId", "==", userId),
      );

      const querySnapshot = await getDocs(q);
      const schedules: SleepSchedule[] = [];

      querySnapshot.forEach((doc) => {
        schedules.push({ id: doc.id, ...doc.data() } as SleepSchedule);
      });

      // Sort in memory instead of in Firestore
      return schedules.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA; // Descending order (newest first)
      });
    }, 3, 'getUserSleepSchedules');
  }, 'getUserSleepSchedules') || [];
};

export const updateSleepSchedule = async (
  scheduleId: string,
  data: Partial<SleepSchedule>,
): Promise<void> => {
  try {
    const scheduleRef = doc(db, "sleepSchedules", scheduleId);
    await updateDoc(scheduleRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, "updateSleepSchedule");
    throw error;
  }
};

export const setActiveSchedule = async (
  userId: string,
  scheduleId: string,
): Promise<void> => {
  try {
    // First, deactivate all existing schedules for this user
    const userSchedules = await getUserSleepSchedules(userId);
    const updatePromises = userSchedules
      .map((schedule) => {
        if (schedule.id) {
          return updateSleepSchedule(schedule.id, { isActive: false });
        }
        return Promise.resolve();
      })
      .filter(Boolean);

    await Promise.all(updatePromises);

    // Then activate the selected schedule
    await updateSleepSchedule(scheduleId, { isActive: true });
  } catch (error) {
    console.error("Error setting active schedule:", error);
    throw error;
  }
};

// Sleep Entry Management (for tracking)
export const saveSleepEntry = async (
  entry: Omit<SleepEntry, "id">,
): Promise<string> => {
  try {
    const entryRef = await addDoc(collection(db, "sleepEntries"), {
      ...entry,
      createdAt: serverTimestamp(),
    });
    return entryRef.id;
  } catch (error) {
    console.error("Error saving sleep entry:", error);
    throw error;
  }
};

export const getUserSleepEntries = async (
  userId: string,
  limit: number = 30,
): Promise<SleepEntry[]> => {
  return firebaseCircuitBreaker.execute(async () => {
    return await retryFirebaseOperation(async () => {
      // Use simpler query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, "sleepEntries"),
        where("userId", "==", userId),
      );

      const querySnapshot = await getDocs(q);
      const entries: SleepEntry[] = [];

      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as SleepEntry);
      });

      // Sort in memory instead of in Firestore
      const sortedEntries = entries.sort((a, b) => {
        // Sort by date string in descending order (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      return sortedEntries.slice(0, limit);
    }, 3, 'getUserSleepEntries');
  }, 'getUserSleepEntries') || [];
};

export const deleteSleepEntry = async (entryId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "sleepEntries", entryId));
  } catch (error) {
    console.error("Error deleting sleep entry:", error);
    throw error;
  }
};

// Subscription Management
export const updateSubscription = async (
  userId: string,
  tier: SubscriptionTier,
): Promise<void> => {
  try {
    await updateUserProfile(userId, { subscriptionTier: tier });
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
};

// Morning Routine Functions
export const saveMorningRoutine = async (
  routine: Omit<MorningRoutine, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    const routineData = {
      ...routine,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "morningRoutines"), routineData);
    console.log("Morning routine saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    const result = handleFirestoreError(error, "saveMorningRoutine");
    if (result === null) {
      // Return a temporary ID for offline functionality
      return `temp_morning_${Date.now()}`;
    }
    throw error;
  }
};

export const getUserMorningRoutines = async (
  userId: string,
): Promise<MorningRoutine[]> => {
  try {
    const q = query(
      collection(db, "morningRoutines"),
      where("userId", "==", userId),
    );
    const querySnapshot = await getDocs(q);

    const routines: MorningRoutine[] = [];
    querySnapshot.forEach((doc) => {
      routines.push({ id: doc.id, ...doc.data() } as MorningRoutine);
    });

    // Sort by creation date (newest first) in memory to avoid composite index issues
    routines.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });

    return routines;
  } catch (error) {
    console.error("Error fetching morning routines:", error);
    throw error;
  }
};

export const setActiveMorningRoutine = async (
  userId: string,
  routineId: string,
): Promise<void> => {
  try {
    // First, deactivate all existing routines for this user
    const userRoutines = await getUserMorningRoutines(userId);
    const updatePromises = userRoutines
      .map((routine) => {
        if (routine.id) {
          const routineRef = doc(db, "morningRoutines", routine.id);
          return updateDoc(routineRef, {
            isActive: false,
            updatedAt: serverTimestamp(),
          });
        }
        return Promise.resolve();
      })
      .filter(Boolean);

    await Promise.all(updatePromises);

    // Then activate the selected routine
    const routineRef = doc(db, "morningRoutines", routineId);
    await updateDoc(routineRef, {
      isActive: true,
      updatedAt: serverTimestamp(),
    });

    console.log("Active morning routine updated successfully");
  } catch (error) {
    console.error("Error setting active morning routine:", error);
    throw error;
  }
};
