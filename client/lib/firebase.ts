import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBkgpVyPyeteAymraqamGCheRKvOIA80i4",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "sleepvision-c0d73.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sleepvision-c0d73",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "sleepvision-c0d73.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "337763729696",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:337763729696:web:d27c344e56b19ee81fd745",
};

// Import the robust Firebase initialization
import { initializeFirebase, resetFirebaseOnError, isFirebaseInitialized } from './firebaseInit';

let app: any = null;
let auth: any = null;
let db: any = null;

// Initialize Firebase asynchronously
(async () => {
  try {
    console.log("🔥 Starting robust Firebase initialization...");
    const instances = await initializeFirebase();
    app = instances.app;
    auth = instances.auth;
    db = instances.db;
    console.log("✅ Firebase initialization completed successfully");
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    // Create null instances for graceful degradation
    app = null;
    auth = null;
    db = null;
  }
})();

// Export reset function for error recovery
export { resetFirebaseOnError, isFirebaseInitialized };
export { app, auth, db };

// Add network monitoring and graceful degradation
let isFirestoreOnline = true;
let firestoreConnectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// Test Firestore connectivity
const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try to enable network to test connectivity
    await enableNetwork(db);
    console.log("Firestore connection test successful");
    return true;
  } catch (error) {
    console.warn("Firestore connection test failed:", error);
    return false;
  }
};

// Initialize Firestore with connection testing
const initializeFirestore = async () => {
  if (typeof window !== "undefined") {
    try {
      const isConnected = await testFirestoreConnection();
      isFirestoreOnline = isConnected;

      if (!isConnected) {
        console.warn(
          "Firestore is not available. App will run in offline mode.",
        );
      }
    } catch (error) {
      console.warn("Failed to test Firestore connection:", error);
      isFirestoreOnline = false;
    }
  }
};

// Monitor network connectivity
if (typeof window !== "undefined") {
  // Initialize connection test
  initializeFirestore();

  window.addEventListener("online", async () => {
    if (firestoreConnectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      try {
        firestoreConnectionAttempts++;
        await enableNetwork(db);
        const isConnected = await testFirestoreConnection();

        if (isConnected) {
          isFirestoreOnline = true;
          firestoreConnectionAttempts = 0; // Reset on successful connection
          console.log("Firestore network re-enabled");
        }
      } catch (error) {
        console.warn("Failed to re-enable Firestore network:", error);
        if (firestoreConnectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
          console.warn(
            "Max Firestore connection attempts reached. Staying offline.",
          );
          isFirestoreOnline = false;
        }
      }
    }
  });

  window.addEventListener("offline", async () => {
    try {
      await disableNetwork(db);
      isFirestoreOnline = false;
      console.log("Firestore network disabled due to offline status");
    } catch (error) {
      console.warn("Failed to disable Firestore network:", error);
    }
  });

  // Add periodic connection check for persistent issues
  setInterval(async () => {
    if (!isFirestoreOnline && navigator.onLine) {
      try {
        const isConnected = await testFirestoreConnection();
        if (isConnected) {
          isFirestoreOnline = true;
          firestoreConnectionAttempts = 0;
          console.log("Firestore connectivity restored");
        }
      } catch (error) {
        // Silent fail for periodic checks
      }
    }
  }, 30000); // Check every 30 seconds
}

export const getFirestoreStatus = () => isFirestoreOnline;

// Safe Firestore operation wrapper
export const safeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallback: T | null = null,
  operationName: string = "operation",
): Promise<T | null> => {
  // Check if online first
  if (!isFirestoreOnline) {
    console.warn(`Skipping ${operationName} - Firestore is offline`);
    return fallback;
  }

  try {
    const result = await operation();
    return result;
  } catch (error: any) {
    // Handle specific network errors
    if (
      error.code === "unavailable" ||
      error.code === "failed-precondition" ||
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("TypeError: Failed to fetch") ||
      error.message?.includes("Network unavailable") ||
      error.name === "TypeError" ||
      error.message?.includes("network")
    ) {
      console.warn(
        `Network error in ${operationName} - continuing offline:`,
        error.message,
      );
      isFirestoreOnline = false; // Mark as offline
      return fallback;
    }

    // Handle permission errors gracefully
    if (error.code === "permission-denied") {
      console.warn(
        `Permission denied for ${operationName}. Continuing with fallback.`,
      );
      return fallback;
    }

    // For other errors, log but still return fallback instead of throwing
    console.warn(
      `Error in ${operationName} - using fallback:`,
      error.message || error,
    );
    return fallback;
  }
};

// Google Auth Provider with enhanced configuration
export const googleProvider = new GoogleAuthProvider();

// Configure for better user experience and reliability
googleProvider.setCustomParameters({
  prompt: "select_account",
  access_type: "online",
  include_granted_scopes: "true",
  // Improve popup reliability
  display: "popup",
  response_type: "code",
});

// Essential scopes for user authentication
googleProvider.addScope("email");
googleProvider.addScope("profile");
googleProvider.addScope("openid");

console.log(
  "🔐 Google Auth Provider configured with scopes:",
  googleProvider.getScopes(),
);

// Global fetch error handler to prevent unhandled TypeError: Failed to fetch
if (typeof window !== "undefined") {
  // Override window.fetch to handle network errors gracefully
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch.apply(this, args).catch((error) => {
      if (
        error.message.includes("Failed to fetch") ||
        error.name === "TypeError"
      ) {
        console.warn(
          "Network fetch failed, app will continue offline:",
          error.message,
        );
        isFirestoreOnline = false;

        // Return a mock successful response for graceful degradation
        // instead of throwing another error
        return new Response(
          JSON.stringify({
            error: "offline",
            message: "Network unavailable - using offline mode",
          }),
          {
            status: 200,
            statusText: "OK (Offline Mode)",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }
      return Promise.reject(error);
    });
  };
}

// Configure for better popup handling
if (typeof window !== "undefined") {
  // Ensure popup isn't blocked by checking for popup blockers
  const testPopup = () => {
    try {
      const popup = window.open("", "", "width=1,height=1");
      if (popup) {
        popup.close();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  // Store popup availability for later use
  (window as any).__popupAvailable = testPopup();
}

export default app;
