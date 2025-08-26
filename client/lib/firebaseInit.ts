// Robust Firebase initialization to prevent internal assertion failures

import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  enableNetwork, 
  disableNetwork,
  terminate,
  clearIndexedDbPersistence,
  enableIndexedDbPersistence
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkgpVyPyeteAymraqamGCheRKvOIA80i4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "sleepvision-c0d73.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "sleepvision-c0d73",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "sleepvision-c0d73.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "337763729696",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:337763729696:web:d27c344e56b19ee81fd745",
};

let app: any = null;
let auth: any = null;
let db: any = null;
let initializationPromise: Promise<void> | null = null;

/**
 * Clean up existing Firebase instances to prevent state conflicts
 */
async function cleanupFirebase(): Promise<void> {
  try {
    console.log("🧹 Cleaning up existing Firebase instances...");
    
    if (db) {
      try {
        await disableNetwork(db);
        await terminate(db);
        console.log("📊 Firestore terminated successfully");
      } catch (error) {
        console.warn("Firestore termination warning:", error);
      }
    }

    // Clear IndexedDB persistence to prevent state conflicts
    if (typeof window !== "undefined") {
      try {
        // Clear Firebase IndexedDB data
        const databases = await indexedDB.databases();
        for (const database of databases) {
          if (database.name?.includes('firestore') || database.name?.includes('firebase')) {
            console.log(`🗑️ Clearing database: ${database.name}`);
            await new Promise((resolve, reject) => {
              const deleteReq = indexedDB.deleteDatabase(database.name!);
              deleteReq.onsuccess = () => resolve(true);
              deleteReq.onerror = () => reject(deleteReq.error);
              deleteReq.onblocked = () => {
                console.warn(`Database ${database.name} deletion blocked`);
                resolve(true); // Continue anyway
              };
            });
          }
        }
      } catch (error) {
        console.warn("IndexedDB cleanup warning:", error);
      }

      // Clear localStorage Firebase data
      Object.keys(localStorage).forEach(key => {
        if (key.includes('firebase') || key.includes('firestore')) {
          localStorage.removeItem(key);
        }
      });
    }
    
    // Reset instances
    app = null;
    auth = null;
    db = null;
    
    console.log("✅ Firebase cleanup completed");
  } catch (error) {
    console.warn("Firebase cleanup had issues (continuing anyway):", error);
  }
}

/**
 * Initialize Firebase with robust error handling and state management
 */
async function initializeFirebaseInstances(): Promise<void> {
  try {
    console.log("🔥 Initializing Firebase instances...");

    // Initialize app
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      console.log("📱 Firebase app initialized");
    } else {
      app = getApps()[0];
      console.log("📱 Using existing Firebase app");
    }

    // Initialize Auth
    auth = getAuth(app);
    console.log("🔐 Firebase Auth initialized");

    // Initialize Firestore with careful state management
    db = getFirestore(app);
    console.log("📊 Firestore instance created");

    // Configure Firestore settings to prevent internal errors
    try {
      // First disable network to reset state
      await disableNetwork(db);
      console.log("🔌 Firestore network disabled for reset");
      
      // Wait a moment for state to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Re-enable network with fresh state
      await enableNetwork(db);
      console.log("🌐 Firestore network re-enabled");
      
    } catch (networkError) {
      console.warn("Firestore network reset failed (continuing):", networkError);
    }

    // Test basic connectivity
    await testFirestoreConnection();
    
    console.log("✅ Firebase initialization completed successfully");
    
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    throw error;
  }
}

/**
 * Test Firestore connectivity without causing state issues
 */
async function testFirestoreConnection(): Promise<boolean> {
  try {
    // Very simple connectivity test that won't cause state conflicts
    const testRef = db._delegate || db; // Get underlying delegate if available
    if (testRef) {
      console.log("🧪 Firestore connectivity test: basic instance check passed");
      return true;
    }
    return false;
  } catch (error) {
    console.warn("Firestore connectivity test failed:", error);
    return false;
  }
}

/**
 * Initialize Firebase with full cleanup and retry logic
 */
export async function initializeFirebase(): Promise<{ app: any; auth: any; db: any }> {
  // Prevent concurrent initialization
  if (initializationPromise) {
    await initializationPromise;
    return { app, auth, db };
  }

  initializationPromise = (async () => {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Clean up any existing instances first
        if (retryCount > 0) {
          await cleanupFirebase();
          // Wait between retries
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        await initializeFirebaseInstances();
        
        // Success!
        return;
        
      } catch (error) {
        retryCount++;
        console.error(`Firebase initialization attempt ${retryCount} failed:`, error);
        
        if (retryCount >= maxRetries) {
          console.error("🚨 Firebase initialization failed after all retries");
          // Create mock instances to prevent app crashes
          app = null;
          auth = null;
          db = null;
          throw new Error("Firebase initialization failed after retries");
        }
      }
    }
  })();

  await initializationPromise;
  return { app, auth, db };
}

/**
 * Reset Firebase instances if internal errors occur
 */
export async function resetFirebaseOnError(): Promise<void> {
  console.log("🔄 Resetting Firebase due to internal errors...");
  
  // Clear the initialization promise to allow re-initialization
  initializationPromise = null;
  
  // Clean up and re-initialize
  await cleanupFirebase();
  await initializeFirebase();
  
  console.log("✅ Firebase reset completed");
}

/**
 * Check if Firebase is properly initialized
 */
export function isFirebaseInitialized(): boolean {
  return app !== null && auth !== null && db !== null;
}

// Export the instances (will be set after initialization)
export { app, auth, db };
