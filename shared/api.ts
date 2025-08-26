/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Sleep assistant request and response types
 */
export interface SleepAssistantRequest {
  message: string;
  currentSchedule?: {
    bedtime: string;
    wakeup: string;
    sleepGoal: number;
  };
  userInfo?: {
    age?: number;
    lifestyle?: string;
    sleepIssues?: string[];
    workSchedule?: string;
  };
}

export interface SleepAssistantResponse {
  response: string;
  recommendations?: {
    bedtime?: string;
    wakeup?: string;
    sleepDuration?: number;
    tips?: string[];
  };
  success: boolean;
  error?: string;
}
