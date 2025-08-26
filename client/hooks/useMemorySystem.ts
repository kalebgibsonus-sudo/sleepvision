import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { memoryService } from '@/lib/memoryService';
import { SleepSchedule, SleepEntry, MorningRoutine } from '@/lib/firebaseService';

export const useMemorySystem = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sleep Schedule Functions
  const saveSleepSchedule = useCallback(async (
    schedule: Omit<SleepSchedule, 'id' | 'userId'>
  ): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await memoryService.saveSleepSchedule(
        user.id,
        user.subscriptionTier,
        schedule
      );
      
      // Update session data
      memoryService.updateSessionData('activity_logged');
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sleep schedule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getSleepSchedules = useCallback(async (): Promise<SleepSchedule[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      return await memoryService.getSleepSchedules(user.id, user.subscriptionTier);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get sleep schedules');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Sleep Entry Functions
  const saveSleepEntry = useCallback(async (
    entry: Omit<SleepEntry, 'id' | 'userId'>
  ): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await memoryService.saveSleepEntry(
        user.id,
        user.subscriptionTier,
        entry
      );
      
      // Update streak and activity
      memoryService.updateSessionData('activity_logged');
      memoryService.updateSessionData('streak_increment');
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sleep entry');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getSleepEntries = useCallback(async (limit: number = 30): Promise<SleepEntry[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      return await memoryService.getSleepEntries(user.id, user.subscriptionTier, limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get sleep entries');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Morning Routine Functions
  const saveMorningRoutine = useCallback(async (
    routine: Omit<MorningRoutine, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await memoryService.saveMorningRoutine(
        user.id,
        user.subscriptionTier,
        routine
      );
      
      // Update session data
      memoryService.updateSessionData('activity_logged');
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save morning routine');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getMorningRoutines = useCallback(async (): Promise<MorningRoutine[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      return await memoryService.getMorningRoutines(user.id, user.subscriptionTier);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get morning routines');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Preferences Functions
  const saveUserPreferences = useCallback(async (
    preferences: { theme?: string; notifications?: boolean; timezone?: string }
  ): Promise<void> => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await memoryService.saveUserPreferences(
        user.id,
        user.subscriptionTier,
        preferences
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getUserPreferences = useCallback(() => {
    if (!user) return {};
    
    return memoryService.getUserPreferences(
      user.subscriptionTier,
      user.preferences
    );
  }, [user]);

  // Session Data Functions
  const updateSessionData = useCallback((
    action: 'assessment_completed' | 'streak_increment' | 'activity_logged',
    data?: any
  ) => {
    memoryService.updateSessionData(action, data);
  }, []);

  const getSessionData = useCallback(() => {
    return memoryService.getSessionData();
  }, []);

  // Storage Info
  const getStorageInfo = useCallback(() => {
    if (!user) {
      return {
        tier: 'free' as const,
        hasCloudAccess: false,
        limits: { sleepEntries: 3, schedules: 1, morningRoutines: 0 },
        localDataSize: 0
      };
    }
    
    return memoryService.getStorageInfo(user.subscriptionTier);
  }, [user]);

  // Check if user can perform an action
  const canPerformAction = useCallback((
    action: 'save_sleep_entry' | 'save_schedule' | 'save_morning_routine'
  ): { allowed: boolean; reason?: string } => {
    if (!user) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    const storageInfo = getStorageInfo();
    const sessionData = getSessionData();

    switch (action) {
      case 'save_sleep_entry':
        if (storageInfo.limits.sleepEntries === -1) return { allowed: true };
        if (sessionData.completedAssessments.length >= storageInfo.limits.sleepEntries) {
          return { 
            allowed: false, 
            reason: `Free users are limited to ${storageInfo.limits.sleepEntries} sleep entries. Upgrade for unlimited storage.` 
          };
        }
        return { allowed: true };

      case 'save_schedule':
        if (storageInfo.limits.schedules === -1) return { allowed: true };
        // For simplicity, we'll allow one schedule for free users
        return { allowed: true };

      case 'save_morning_routine':
        if (!['full-transformation', 'elite-performance'].includes(user.subscriptionTier)) {
          return { 
            allowed: false, 
            reason: 'Morning routines require Full Transformation or Elite Performance subscription' 
          };
        }
        return { allowed: true };

      default:
        return { allowed: false, reason: 'Unknown action' };
    }
  }, [user, getStorageInfo, getSessionData]);

  return {
    // State
    isLoading,
    error,
    user,
    
    // Sleep Schedule
    saveSleepSchedule,
    getSleepSchedules,
    
    // Sleep Entries
    saveSleepEntry,
    getSleepEntries,
    
    // Morning Routines
    saveMorningRoutine,
    getMorningRoutines,
    
    // Preferences
    saveUserPreferences,
    getUserPreferences,
    
    // Session Data
    updateSessionData,
    getSessionData,
    
    // Storage Info
    getStorageInfo,
    canPerformAction,
    
    // Utils
    clearError: () => setError(null)
  };
};

export default useMemorySystem;
