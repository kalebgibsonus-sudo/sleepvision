// Comprehensive Firebase error handling utilities

/**
 * Check if an error is a Firebase internal assertion failure
 */
export function isFirebaseInternalError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || '';
  const code = error.code || '';
  
  return (
    message.includes("INTERNAL ASSERTION FAILED") ||
    message.includes("Unexpected state") ||
    message.match(/ID: [a-z0-9]+/) !== null ||
    code === "internal" ||
    code === "aborted" ||
    code === "failed-precondition" ||
    message.includes("FIRESTORE") && message.includes("ASSERTION")
  );
}

/**
 * Extract Firebase error ID from error message
 */
export function getFirebaseErrorId(error: any): string {
  if (!error?.message) return 'unknown';
  
  const match = error.message.match(/ID: ([a-z0-9]+)/);
  return match ? match[1] : 'unknown';
}

/**
 * Check if error is a network/connectivity issue
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || '';
  const code = error.code || '';
  
  return (
    message.includes("Failed to fetch") ||
    message.includes("Network unavailable") ||
    message.includes("TypeError: Failed to fetch") ||
    code === "unavailable" ||
    code === "deadline-exceeded" ||
    error.name === "TypeError"
  );
}

/**
 * Check if error is an authentication issue
 */
export function isAuthError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || '';
  const code = error.code || '';
  
  return (
    code === "unauthenticated" ||
    code === "permission-denied" ||
    message.includes("missing stream token") ||
    message.includes("auth/requires-recent-login") ||
    message.includes("auth/user-token-expired")
  );
}

/**
 * Get a user-friendly error message for Firebase errors
 */
export function getFirebaseErrorMessage(error: any): string {
  if (isFirebaseInternalError(error)) {
    const errorId = getFirebaseErrorId(error);
    return `Temporary data loading issue (${errorId}). This usually resolves quickly.`;
  }
  
  if (isNetworkError(error)) {
    return "Network connection issue. Please check your internet connection.";
  }
  
  if (isAuthError(error)) {
    return "Authentication expired. Please sign in again.";
  }
  
  return "An unexpected error occurred. Please try again.";
}

/**
 * Comprehensive Firebase error handler with logging
 */
export function handleFirebaseError(error: any, operation: string): null {
  const errorId = getFirebaseErrorId(error);
  
  if (isFirebaseInternalError(error)) {
    console.warn(`🔥 Firebase internal error in ${operation}:`, {
      errorId,
      message: error.message,
      operation,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  if (isNetworkError(error)) {
    console.warn(`🌐 Network error in ${operation}:`, {
      message: error.message,
      operation,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  if (isAuthError(error)) {
    console.warn(`🔐 Auth error in ${operation}:`, {
      code: error.code,
      message: error.message,
      operation,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  // Log other errors but still return null for graceful degradation
  console.warn(`❓ Unknown error in ${operation}:`, {
    code: error.code,
    message: error.message,
    operation,
    timestamp: new Date().toISOString()
  });
  
  return null;
}

/**
 * Retry function with exponential backoff for Firebase operations
 */
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  operationName: string = 'operation'
): Promise<T | null> {
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      return await operation();
    } catch (error: any) {
      if (isFirebaseInternalError(error)) {
        retryCount++;
        const errorId = getFirebaseErrorId(error);
        
        console.warn(`🔄 Retry ${retryCount}/${maxRetries} for ${operationName} due to Firebase error ${errorId}`);
        
        if (retryCount >= maxRetries) {
          console.error(`❌ Max retries reached for ${operationName} after Firebase error ${errorId}`);
          return null;
        }
        
        // Exponential backoff with jitter
        const backoffTime = Math.pow(2, retryCount) * 1000 + (Math.random() * 1000);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        continue;
      }
      
      // For non-internal errors, don't retry
      return handleFirebaseError(error, operationName);
    }
  }
  
  return null;
}

/**
 * Create a circuit breaker pattern for Firebase operations
 */
class FirebaseCircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private readonly failureThreshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(operation: () => Promise<T>, operationName: string): Promise<T | null> {
    // Check if circuit is open
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        console.warn(`🔒 Circuit breaker OPEN for ${operationName}. Skipping operation.`);
        return null;
      }
    }

    try {
      const result = await operation();
      
      // Success - reset circuit breaker
      if (this.state === 'half-open' || this.failures > 0) {
        this.reset();
        console.log(`✅ Circuit breaker RESET for ${operationName}`);
      }
      
      return result;
    } catch (error: any) {
      if (isFirebaseInternalError(error)) {
        this.recordFailure();
        
        if (this.failures >= this.failureThreshold) {
          this.state = 'open';
          console.warn(`🔓 Circuit breaker OPENED for ${operationName} after ${this.failures} failures`);
        }
      }
      
      return handleFirebaseError(error, operationName);
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
  }

  private reset() {
    this.failures = 0;
    this.state = 'closed';
    this.lastFailureTime = 0;
  }
}

// Global circuit breaker instance
export const firebaseCircuitBreaker = new FirebaseCircuitBreaker();
