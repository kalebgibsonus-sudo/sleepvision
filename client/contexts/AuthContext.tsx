import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateSubscription as updateFirebaseSubscription,
  UserProfile,
} from "@/lib/firebaseService";
import { memoryService } from "@/lib/memoryService";
import { paymentService } from "@/lib/paymentService";

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export type SubscriptionTier =
  | "sleep-focused"
  | "full-transformation"
  | "elite-performance";

interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  subscriptionTier: SubscriptionTier;
  createdAt?: any;
  lastLogin?: any;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    timezone?: string;
  };
  onboardingState?: {
    hasSeenDashboardOnboarding?: boolean;
    hasSeenCoachMarks?: boolean;
    completedOnboardingSteps?: string[];
    onboardingCompletedAt?: string;
    preferredOnboardingStyle?: "interactive" | "tooltips" | "minimal";
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
  updateSubscription: (tier: SubscriptionTier) => void;
  refreshUserData: () => Promise<void>;
  hasAccess: (
    feature: "sleep" | "morning" | "discounts" | "dashboard",
  ) => boolean;
  creatorBypass: () => void;
  // Onboarding methods
  shouldShowDashboardOnboarding: () => boolean;
  shouldShowCoachMarks: () => boolean;
  markOnboardingCompleted: (step: string) => void;
  markDashboardOnboardingCompleted: () => void;
  markCoachMarksCompleted: () => void;
  resetOnboarding: () => void;
  getOnboardingProgress: () => {
    completed: string[];
    total: number;
    percentage: number;
  };
}

// Create a more robust context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a backup context with default values for hot reload scenarios
const defaultAuthValue: AuthContextType = {
  user: null,
  isLoading: true,
  signIn: async () => {
    throw new Error("AuthProvider not initialized");
  },
  signOut: () => {
    throw new Error("AuthProvider not initialized");
  },
  updateSubscription: () => {
    throw new Error("AuthProvider not initialized");
  },
  refreshUserData: async () => {
    throw new Error("AuthProvider not initialized");
  },
  hasAccess: () => false,
  creatorBypass: () => {
    throw new Error("AuthProvider not initialized");
  },
  shouldShowDashboardOnboarding: () => false,
  shouldShowCoachMarks: () => false,
  markOnboardingCompleted: () => {
    throw new Error("AuthProvider not initialized");
  },
  markDashboardOnboardingCompleted: () => {
    throw new Error("AuthProvider not initialized");
  },
  markCoachMarksCompleted: () => {
    throw new Error("AuthProvider not initialized");
  },
  resetOnboarding: () => {
    throw new Error("AuthProvider not initialized");
  },
  getOnboardingProgress: () => ({
    completed: [],
    total: 0,
    percentage: 0,
  }),
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.warn(
      "useAuth called outside of AuthProvider - using fallback values",
    );
    console.warn(
      "This might be due to a hot reload issue. If the problem persists, refresh the page.",
    );

    // Return a fallback context during hot reload or initialization issues
    return defaultAuthValue;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Defensive check to ensure we're in a valid React environment
  if (typeof React === "undefined" || typeof useContext === "undefined") {
    console.error(
      "React or useContext is undefined - this indicates a serious setup issue",
    );
    return <div>Error: React environment not properly initialized</div>;
  }

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if auth is available before setting up listener
    if (!auth) {
      console.warn("Firebase Auth not available, skipping auth state listener");
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!isMounted) return;

      setFirebaseUser(firebaseUser);
      setIsLoading(true);

      if (firebaseUser) {
        // Handle user profile creation/update asynchronously without blocking
        (async () => {
          if (!isMounted) return;

          try {
            // Check if user profile exists in Firestore with timeout
            let userProfile: UserProfile | null = null;

            try {
              userProfile = await Promise.race([
                getUserProfile(firebaseUser.uid),
                new Promise<null>((_, reject) =>
                  setTimeout(
                    () => reject(new Error("Firestore timeout")),
                    5000,
                  ),
                ),
              ]);
            } catch (firestoreError) {
              console.warn(
                "Firestore getUserProfile failed, using fallback:",
                firestoreError,
              );
              userProfile = null;
            }

            if (!isMounted) return;

            if (!userProfile) {
              // Create new user profile
              const newProfile: UserProfile = {
                id: firebaseUser.uid,
                email: firebaseUser.email || "",
                name: firebaseUser.displayName || "User",
                picture:
                  firebaseUser.photoURL ||
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                subscriptionTier: "sleep-focused", // Default to lowest paid tier
                createdAt: null, // Will be set by serverTimestamp
                lastLogin: null, // Will be set by serverTimestamp
              };

              // Try to create profile, but don't fail if it doesn't work
              try {
                await createUserProfile(newProfile);
              } catch (createError) {
                console.warn(
                  "Failed to create user profile in Firestore, continuing with local profile:",
                  createError,
                );
              }

              userProfile = newProfile;
            } else {
              // Update last login - don't fail if this doesn't work
              try {
                // Check if token needs refresh before updating profile
                const token = await firebaseUser.getIdToken(false);
                if (!token) {
                  console.warn("No valid token found, attempting refresh...");
                  await firebaseUser.getIdToken(true); // Force refresh
                }

                await updateUserProfile(firebaseUser.uid, {});
              } catch (updateError: any) {
                // Handle token-specific errors
                if (updateError.message?.includes("missing stream token") ||
                    updateError.code === "unauthenticated") {
                  console.warn("Token issue detected, attempting token refresh...");
                  try {
                    await firebaseUser.getIdToken(true); // Force token refresh
                    await updateUserProfile(firebaseUser.uid, {}); // Retry after refresh
                  } catch (retryError) {
                    console.warn("Token refresh failed, continuing without profile update:", retryError);
                  }
                } else {
                  console.warn("Failed to update last login, continuing anyway:", updateError);
                }
              }
            }

            if (isMounted) {
              // Link payment memory to Google user
              try {
                await paymentService.linkGoogleUserPaymentData(
                  firebaseUser.uid,
                  firebaseUser.email || "",
                );
              } catch (paymentLinkError) {
                console.warn(
                  "Failed to link payment data, continuing anyway:",
                  paymentLinkError,
                );
              }

              setUser(userProfile);
              setIsLoading(false);
              setIsSigningIn(false); // Clear signing in state once user is set
            }
          } catch (error) {
            if (!isMounted) return;

            console.warn(
              "Firestore error, creating fallback user profile:",
              error,
            );

            // Create a fallback user profile that works offline
            const fallbackProfile: UserProfile = {
              id: firebaseUser.uid,
              email: firebaseUser.email || "",
              name: firebaseUser.displayName || "User",
              picture:
                firebaseUser.photoURL ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
              subscriptionTier: "sleep-focused", // Default to lowest paid tier
              createdAt: null,
              lastLogin: null,
            };

            // Link payment memory even for fallback profile
            try {
              await paymentService.linkGoogleUserPaymentData(
                firebaseUser.uid,
                firebaseUser.email || "",
              );
            } catch (paymentLinkError) {
              console.warn(
                "Failed to link payment data to fallback profile:",
                paymentLinkError,
              );
            }

            setUser(fallbackProfile);
            setIsLoading(false);
            setIsSigningIn(false); // Clear signing in state
          }
        })();
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const signIn = async () => {
    // Prevent concurrent sign-in operations
    if (isSigningIn || user) {
      console.warn("Sign-in already in progress or user already signed in");
      return;
    }

    // Create a timeout to prevent hanging promises
    let timeoutId: NodeJS.Timeout;

    try {
      setIsSigningIn(true);
      setIsLoading(true);

      // Set a timeout to handle hanging promises
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error("Sign-in timeout"));
        }, 30000); // 30 second timeout
      });

      // Race the sign-in against the timeout
      const result = await Promise.race([
        signInWithPopup(auth, googleProvider),
        timeoutPromise,
      ]);

      // Clear timeout if successful
      clearTimeout(timeoutId);

      // User will be set automatically via onAuthStateChanged
      console.log("User signed in successfully:", (result as any).user.email);

      // Don't set isLoading to false here - let onAuthStateChanged handle it
    } catch (error: any) {
      // Clear timeout on error
      if (timeoutId) clearTimeout(timeoutId);

      setIsLoading(false);
      setIsSigningIn(false);

      // Handle specific popup errors gracefully without logging as errors
      if (error.code === "auth/popup-blocked") {
        console.warn(
          "Sign-in popup was blocked by browser. Please allow popups and try again.",
        );
        return;
      } else if (error.code === "auth/cancelled-popup-request") {
        console.info("Sign-in popup was cancelled.");
        return;
      } else if (error.code === "auth/popup-closed-by-user") {
        console.info("Sign-in popup was closed by user.");
        return;
      } else if (error.code === "auth/popup-window-closed") {
        console.info("Sign-in popup window was closed.");
        return;
      } else if (error.message === "Sign-in timeout") {
        console.warn("Sign-in operation timed out");
        return;
      }

      // Only log and throw error for actual authentication failures
      console.error("Authentication failed:", error);
      throw error;
    }

    // Don't set isSigningIn to false here - let the onAuthStateChanged handle it
  };

  const signOut = async () => {
    try {
      // Prevent multiple sign out attempts
      if (!user) {
        console.warn("User already signed out");
        return;
      }

      setIsLoading(true);
      await firebaseSignOut(auth);
      // User will be set to null automatically via onAuthStateChanged
    } catch (error) {
      console.error("Error signing out:", error);
      // Fallback: clear user manually
      setUser(null);
      setIsLoading(false);
    }
  };

  const updateSubscription = async (tier: SubscriptionTier) => {
    if (user && firebaseUser) {
      try {
        const oldTier = user.subscriptionTier;

        // Update subscription in Firebase
        await updateFirebaseSubscription(user.id, tier);

        // Update payment service subscription tracking
        try {
          await paymentService.createOrUpdateSubscription(user.id, user.email, {
            currentTier: tier,
            isActive: true, // All tiers are now paid
            metadata: {
              upgradeFrom: oldTier,
            },
          });
          console.log("Payment memory linked to Google user:", user.email);
        } catch (paymentError) {
          console.warn(
            "Failed to update payment service subscription:",
            paymentError,
          );
          // Don't fail the main subscription update if payment service fails
        }

        // Data migration logic for tier changes
        if (oldTier !== tier) {
          console.log("Migrating user data for subscription tier change...");

          // Track successful subscription conversion with Meta Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            const tierPrices = {
              'sleep-focused': 5.99,
              'full-transformation': 9.99,
              'elite-performance': 13.99
            };

            (window as any).fbq('track', 'Purchase', {
              content_name: `SleepVision ${tier}`,
              content_category: 'Sleep Subscription',
              value: tierPrices[tier as keyof typeof tierPrices] || 0,
              currency: 'USD'
            });
          }

          try {
            await memoryService.migrateUserData(user.id, oldTier, tier);
            console.log("Data migration completed successfully");
          } catch (migrationError) {
            console.error("Data migration failed:", migrationError);
            // Don't fail the subscription update if migration fails
            // User can manually re-enter data
          }
        }

        const updatedUser = { ...user, subscriptionTier: tier };
        setUser(updatedUser);

        // Update session data to reflect subscription change
        memoryService.updateSessionData("activity_logged");
      } catch (error) {
        console.error("Error updating subscription:", error);
        throw error;
      }
    }
  };

  const creatorBypass = () => {
    // Creator bypass - update current user to elite performance
    if (user) {
      updateSubscription("elite-performance");
    }
  };

  const hasAccess = (
    feature: "sleep" | "morning" | "discounts" | "dashboard",
  ): boolean => {
    if (!user) {
      console.log(`🔒 Access denied for ${feature}: No user`);
      return false;
    }

    // ADMIN BYPASS: Complete access for admin users
    if (user.email === "kalebgibson.us@gmail.com") {
      console.log(`👑 Admin access granted for ${feature}:`, user.email);
      return true;
    }

    // Check if subscription is active (from Stripe webhook)
    // BACKWARD COMPATIBILITY: If webhook fields don't exist, fall back to subscription tier only
    const hasWebhookData = user.isActive !== undefined && user.subscriptionStatus !== undefined;
    const isSubscriptionActive = hasWebhookData
      ? (user.isActive && user.subscriptionStatus === 'active')
      : true; // If no webhook data, assume active for existing paid users

    // Access control - check subscription tier and active status
    // All tiers are now paid - no free access
    let hasFeatureAccess = false;

    switch (feature) {
      case "dashboard":
        // Dashboard access requires any paid subscription
        hasFeatureAccess = isSubscriptionActive && [
          "sleep-focused",
          "full-transformation",
          "elite-performance",
        ].includes(user.subscriptionTier);
        break;
      case "sleep":
        // Sleep features: $5.99 sleep-focused and above
        hasFeatureAccess = isSubscriptionActive && [
          "sleep-focused",
          "full-transformation",
          "elite-performance",
        ].includes(user.subscriptionTier);
        break;
      case "morning":
        // Morning routine: ONLY $9.99 full-transformation and $13.99 elite-performance
        hasFeatureAccess = isSubscriptionActive && ["full-transformation", "elite-performance"].includes(
          user.subscriptionTier,
        );
        break;
      case "discounts":
        // Product discounts: ONLY $13.99 elite-performance tier
        hasFeatureAccess = isSubscriptionActive && user.subscriptionTier === "elite-performance";
        break;
      default:
        hasFeatureAccess = false;
    }

    console.log(`🔑 Access check for ${feature}:`, {
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      isActive: user.isActive,
      hasWebhookData,
      isSubscriptionActive,
      hasAccess: hasFeatureAccess
    });

    return hasFeatureAccess;
  };

  const refreshUserData = async () => {
    if (!user || !firebaseUser) {
      console.log("No user to refresh");
      return;
    }

    try {
      console.log("🔄 Refreshing user data from Firestore...");

      // Fetch fresh user profile from Firestore
      const freshProfile = await getUserProfile(firebaseUser.uid);

      if (freshProfile) {
        console.log("✅ User data refreshed:", {
          email: freshProfile.email,
          subscriptionTier: freshProfile.subscriptionTier
        });

        setUser(freshProfile);
      } else {
        console.warn("No fresh profile data found");
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  // Onboarding Methods
  const shouldShowDashboardOnboarding = (): boolean => {
    if (!user) return false;

    // Check if user has seen dashboard onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenDashboardOnboarding");
    const userOnboardingState = user.onboardingState?.hasSeenDashboardOnboarding;

    // Admin always has option to replay
    if (user.email === "kalebgibson.us@gmail.com") {
      return !hasSeenOnboarding; // Only auto-show if not seen before
    }

    // For paying users who haven't seen onboarding
    return hasAccess("dashboard") && !hasSeenOnboarding && !userOnboardingState;
  };

  const shouldShowCoachMarks = (): boolean => {
    if (!user) return false;

    const hasSeenCoachMarks = localStorage.getItem("hasSeenCoachMarks");
    const userCoachMarksState = user.onboardingState?.hasSeenCoachMarks;

    // Show coach marks if user has completed dashboard onboarding but not seen coach marks
    const hasSeenDashboardOnboarding = localStorage.getItem("hasSeenDashboardOnboarding");

    return hasAccess("dashboard") &&
           hasSeenDashboardOnboarding &&
           !hasSeenCoachMarks &&
           !userCoachMarksState;
  };

  const markOnboardingCompleted = (step: string) => {
    if (!user) return;

    const currentCompleted = user.onboardingState?.completedOnboardingSteps || [];
    const updatedCompleted = [...currentCompleted, step];

    setUser(prev => prev ? {
      ...prev,
      onboardingState: {
        ...prev.onboardingState,
        completedOnboardingSteps: updatedCompleted,
      }
    } : null);

    // Also store in localStorage for persistence
    localStorage.setItem(`onboarding_step_${step}`, "true");
  };

  const markDashboardOnboardingCompleted = () => {
    if (!user) return;

    const completedAt = new Date().toISOString();

    setUser(prev => prev ? {
      ...prev,
      onboardingState: {
        ...prev.onboardingState,
        hasSeenDashboardOnboarding: true,
        onboardingCompletedAt: completedAt,
      }
    } : null);

    localStorage.setItem("hasSeenDashboardOnboarding", "true");
    localStorage.setItem("onboardingCompletedAt", completedAt);

    // Track completion for analytics
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: 'Dashboard Onboarding',
        content_category: 'User Activation'
      });
    }
  };

  const markCoachMarksCompleted = () => {
    if (!user) return;

    setUser(prev => prev ? {
      ...prev,
      onboardingState: {
        ...prev.onboardingState,
        hasSeenCoachMarks: true,
      }
    } : null);

    localStorage.setItem("hasSeenCoachMarks", "true");
  };

  const resetOnboarding = () => {
    if (!user) return;

    // Reset user state
    setUser(prev => prev ? {
      ...prev,
      onboardingState: {
        hasSeenDashboardOnboarding: false,
        hasSeenCoachMarks: false,
        completedOnboardingSteps: [],
        onboardingCompletedAt: undefined,
        preferredOnboardingStyle: "interactive",
      }
    } : null);

    // Clear localStorage
    localStorage.removeItem("hasSeenDashboardOnboarding");
    localStorage.removeItem("hasSeenCoachMarks");
    localStorage.removeItem("onboardingCompletedAt");
    localStorage.removeItem("shownOnceTooltips");

    // Clear individual step completions
    const allSteps = [
      "welcome", "stats-overview", "discipline-center", "ai-checkin",
      "sleep-schedule", "quick-actions", "navigation", "breathing-demo", "completion"
    ];
    allSteps.forEach(step => {
      localStorage.removeItem(`onboarding_step_${step}`);
    });
  };

  const getOnboardingProgress = () => {
    const allSteps = [
      "welcome", "stats-overview", "discipline-center", "ai-checkin",
      "sleep-schedule", "quick-actions", "navigation", "breathing-demo", "completion"
    ];

    const completed = user?.onboardingState?.completedOnboardingSteps || [];
    const percentage = Math.round((completed.length / allSteps.length) * 100);

    return {
      completed,
      total: allSteps.length,
      percentage,
    };
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signOut,
    updateSubscription,
    refreshUserData,
    hasAccess,
    creatorBypass,
    shouldShowDashboardOnboarding,
    shouldShowCoachMarks,
    markOnboardingCompleted,
    markDashboardOnboardingCompleted,
    markCoachMarksCompleted,
    resetOnboarding,
    getOnboardingProgress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
