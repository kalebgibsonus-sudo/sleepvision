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
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { SubscriptionTier } from "@/contexts/AuthContext";

// Helper function to handle Firestore errors gracefully
const handleFirestoreError = (error: any, operation: string) => {
  console.warn(`Firestore ${operation} failed:`, error);

  // Check if it's a network error
  if (
    error.code === "unavailable" ||
    error.code === "failed-precondition" ||
    error.message?.includes("Failed to fetch") ||
    error.message?.includes("TypeError: Failed to fetch") ||
    error.name === "TypeError"
  ) {
    console.warn(
      "Network connectivity issue detected. Payment service will continue with limited functionality.",
    );
    return null;
  }

  // For permission errors, don't throw - just log and return null
  if (error.code === "permission-denied") {
    console.warn(
      `Permission denied for ${operation}. Continuing with offline mode.`,
    );
    return null;
  }

  // For other errors, still return null for graceful degradation
  console.error(`${operation} failed:`, error);
  return null;
};

// Payment History Interface
export interface PaymentRecord {
  id?: string;
  userId: string; // Google user ID
  googleEmail: string; // User's Google email
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePaymentIntentId?: string;
  subscriptionTier: SubscriptionTier;
  amount: number; // Amount in cents
  currency: string; // 'usd'
  status: "pending" | "succeeded" | "failed" | "canceled" | "refunded";
  paymentMethod: "stripe_card" | "stripe_paypal" | "apple_pay" | "google_pay";
  billingPeriod: "monthly" | "yearly" | "lifetime";
  nextBillingDate?: Timestamp;
  trialEndDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  metadata?: {
    promoCode?: string;
    referralSource?: string;
    upgradeFrom?: SubscriptionTier;
  };
}

// Subscription Status Interface
export interface UserSubscriptionStatus {
  userId: string;
  googleEmail: string;
  currentTier: SubscriptionTier;
  isActive: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStartDate: Timestamp;
  nextBillingDate?: Timestamp;
  cancelAtPeriodEnd: boolean;
  trialEndDate?: Timestamp;
  billingPeriod: "monthly" | "yearly" | "lifetime";
  totalPaid: number; // Total amount paid in cents
  paymentCount: number; // Number of successful payments
  lastPaymentDate?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paymentFailures: number; // Track payment failures for retry logic
  features: {
    cloudStorage: boolean;
    sleepTracking: boolean;
    morningRoutines: boolean;
    unlimitedEntries: boolean;
    productDiscounts: boolean;
  };
}

class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  // Create or update user subscription status
  async createOrUpdateSubscription(
    userId: string,
    googleEmail: string,
    subscriptionData: Partial<UserSubscriptionStatus>,
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, "subscriptions", userId);
      const existingSubscription = await getDoc(subscriptionRef);

      const features = this.getFeaturesByTier(
        subscriptionData.currentTier || "sleep-focused",
      );

      if (existingSubscription.exists()) {
        // Update existing subscription
        await updateDoc(subscriptionRef, {
          ...subscriptionData,
          features,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new subscription record
        await setDoc(subscriptionRef, {
          userId,
          googleEmail,
          currentTier: "sleep-focused",
          isActive: true,
          subscriptionStartDate: serverTimestamp(),
          cancelAtPeriodEnd: false,
          totalPaid: 0,
          paymentCount: 0,
          paymentFailures: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          features,
          ...subscriptionData,
        });
      }
    } catch (error) {
      const result = handleFirestoreError(error, "createOrUpdateSubscription");
      if (result === null) {
        // If it's a network/permission error, don't throw - just log and continue
        console.warn(
          "Unable to update subscription in cloud, continuing with local data",
        );
        return;
      }
      throw error;
    }
  }

  // Get user subscription status
  async getUserSubscription(
    userId: string,
  ): Promise<UserSubscriptionStatus | null> {
    try {
      const subscriptionRef = doc(db, "subscriptions", userId);
      const subscriptionSnap = await getDoc(subscriptionRef);

      if (subscriptionSnap.exists()) {
        return {
          id: subscriptionSnap.id,
          ...subscriptionSnap.data(),
        } as UserSubscriptionStatus;
      }
      return null;
    } catch (error) {
      return handleFirestoreError(error, "getUserSubscription");
    }
  }

  // Record a payment transaction
  async recordPayment(
    paymentData: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<string> {
    try {
      const paymentRef = await addDoc(collection(db, "payments"), {
        ...paymentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Update subscription status if payment succeeded
      if (paymentData.status === "succeeded") {
        await this.updateSubscriptionOnPayment(paymentData.userId, paymentData);
      }

      return paymentRef.id;
    } catch (error) {
      const result = handleFirestoreError(error, "recordPayment");
      if (result === null) {
        // Return a temporary ID for offline functionality
        return `temp_payment_${Date.now()}`;
      }
      throw error;
    }
  }

  // Update subscription when payment succeeds
  private async updateSubscriptionOnPayment(
    userId: string,
    paymentData: Omit<PaymentRecord, "id" | "createdAt" | "updatedAt">,
  ): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return;

      const subscriptionRef = doc(db, "subscriptions", userId);
      await updateDoc(subscriptionRef, {
        currentTier: paymentData.subscriptionTier,
        isActive: true,
        totalPaid: subscription.totalPaid + paymentData.amount,
        paymentCount: subscription.paymentCount + 1,
        lastPaymentDate: serverTimestamp(),
        nextBillingDate: paymentData.nextBillingDate,
        paymentFailures: 0, // Reset failures on successful payment
        features: this.getFeaturesByTier(paymentData.subscriptionTier),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating subscription on payment:", error);
    }
  }

  // Get payment history for a user
  async getUserPaymentHistory(
    userId: string,
    limit: number = 50,
  ): Promise<PaymentRecord[]> {
    try {
      // Use simpler query without orderBy to avoid composite index requirement
      const q = query(
        collection(db, "payments"),
        where("userId", "==", userId),
      );

      const querySnapshot = await getDocs(q);
      const payments: PaymentRecord[] = [];

      querySnapshot.forEach((doc) => {
        payments.push({ id: doc.id, ...doc.data() } as PaymentRecord);
      });

      // Sort in memory instead of in Firestore to avoid composite index
      const sortedPayments = payments.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA; // Descending order (newest first)
      });

      return sortedPayments.slice(0, limit);
    } catch (error) {
      const result = handleFirestoreError(error, "getUserPaymentHistory");
      return result || []; // Return empty array if error
    }
  }

  // Handle payment failure
  async handlePaymentFailure(
    userId: string,
    failureReason?: string,
  ): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(userId);
      if (!subscription) return;

      const subscriptionRef = doc(db, "subscriptions", userId);
      const failures = subscription.paymentFailures + 1;

      // Downgrade subscription after 3 failed payments
      const shouldDowngrade = failures >= 3;

      await updateDoc(subscriptionRef, {
        paymentFailures: failures,
        isActive: !shouldDowngrade,
        currentTier: shouldDowngrade ? "sleep-focused" : subscription.currentTier,
        features: shouldDowngrade
          ? this.getFeaturesByTier("sleep-focused")
          : subscription.features,
        updatedAt: serverTimestamp(),
      });

      // Record the failure as a payment record
      await addDoc(collection(db, "payments"), {
        userId,
        googleEmail: subscription.googleEmail,
        subscriptionTier: subscription.currentTier,
        amount: 0,
        currency: "usd",
        status: "failed",
        paymentMethod: "stripe_card",
        billingPeriod: subscription.billingPeriod,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          failureReason,
          automaticDowngrade: shouldDowngrade,
        },
      });
    } catch (error) {
      console.error("Error handling payment failure:", error);
    }
  }

  // Get features by subscription tier
  private getFeaturesByTier(
    tier: SubscriptionTier,
  ): UserSubscriptionStatus["features"] {
    switch (tier) {
      case "sleep-focused":
        return {
          cloudStorage: true,
          sleepTracking: true,
          morningRoutines: false,
          unlimitedEntries: false,
          productDiscounts: false,
        };
      case "full-transformation":
        return {
          cloudStorage: true,
          sleepTracking: true,
          morningRoutines: true,
          unlimitedEntries: true,
          productDiscounts: false,
        };
      case "elite-performance":
        return {
          cloudStorage: true,
          sleepTracking: true,
          morningRoutines: true,
          unlimitedEntries: true,
          productDiscounts: true,
        };
      default: // 'free'
        return {
          cloudStorage: false,
          sleepTracking: false,
          morningRoutines: false,
          unlimitedEntries: false,
          productDiscounts: false,
        };
    }
  }

  // Cancel subscription
  async cancelSubscription(
    userId: string,
    cancelAtPeriodEnd: boolean = true,
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, "subscriptions", userId);
      await updateDoc(subscriptionRef, {
        cancelAtPeriodEnd,
        isActive: false, // Cancelled subscriptions have no access
        currentTier: undefined, // Remove tier access when cancelled
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(
    userId: string,
    newTier: SubscriptionTier,
  ): Promise<void> {
    try {
      const subscriptionRef = doc(db, "subscriptions", userId);
      await updateDoc(subscriptionRef, {
        currentTier: newTier,
        isActive: true,
        cancelAtPeriodEnd: false,
        features: this.getFeaturesByTier(newTier),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      throw error;
    }
  }

  // Get subscription analytics for admin/analytics
  async getSubscriptionAnalytics(): Promise<{
    totalActiveSubscriptions: number;
    totalRevenue: number;
    tierDistribution: Record<SubscriptionTier, number>;
  }> {
    try {
      const subscriptionsQuery = query(collection(db, "subscriptions"));
      const subscriptionSnapshot = await getDocs(subscriptionsQuery);

      let totalActiveSubscriptions = 0;
      let totalRevenue = 0;
      const tierDistribution: Record<SubscriptionTier, number> = {
        free: 0,
        "sleep-focused": 0,
        "full-transformation": 0,
        "elite-performance": 0,
      };

      subscriptionSnapshot.forEach((doc) => {
        const subscription = doc.data() as UserSubscriptionStatus;

        if (subscription.isActive) {
          totalActiveSubscriptions++;
        }

        totalRevenue += subscription.totalPaid || 0;
        tierDistribution[subscription.currentTier] =
          (tierDistribution[subscription.currentTier] || 0) + 1;
      });

      return {
        totalActiveSubscriptions,
        totalRevenue: totalRevenue / 100, // Convert from cents to dollars
        tierDistribution,
      };
    } catch (error) {
      console.error("Error getting subscription analytics:", error);
      return {
        totalActiveSubscriptions: 0,
        totalRevenue: 0,
        tierDistribution: {
          free: 0,
          "sleep-focused": 0,
          "full-transformation": 0,
          "elite-performance": 0,
        },
      };
    }
  }

  // Link Google user payment data across sessions
  async linkGoogleUserPaymentData(
    userId: string,
    googleEmail: string,
  ): Promise<void> {
    try {
      // Check if subscription already exists
      let subscription = await this.getUserSubscription(userId);

      if (!subscription) {
        // Create initial subscription record for Google user
        await this.createOrUpdateSubscription(userId, googleEmail, {
          currentTier: "sleep-focused",
          isActive: true,
          subscriptionStartDate: serverTimestamp() as Timestamp,
          cancelAtPeriodEnd: false,
          billingPeriod: "monthly",
          totalPaid: 0,
          paymentCount: 0,
          paymentFailures: 0,
        });
      } else {
        // Update email if it changed
        if (subscription.googleEmail !== googleEmail) {
          const subscriptionRef = doc(db, "subscriptions", userId);
          await updateDoc(subscriptionRef, {
            googleEmail,
            updatedAt: serverTimestamp(),
          });
        }
      }
    } catch (error) {
      console.error("Error linking Google user payment data:", error);
      throw error;
    }
  }
}

export const paymentService = PaymentService.getInstance();
export default paymentService;
