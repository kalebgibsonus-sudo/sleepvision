import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserSleepSchedules,
  getUserSleepEntries,
  saveSleepEntry,
  setActiveSchedule,
  SleepSchedule,
  SleepEntry
} from '@/lib/firebaseService';
import { isFirebaseInternalError } from '@/lib/firebaseUtils';

export const useSleepData = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<SleepSchedule[]>([]);
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced loading to prevent concurrent queries
  const loadData = useCallback(async (userId: string) => {
    // Prevent concurrent loads
    if (loadingRef.current) {
      console.log("Load already in progress, skipping...");
      return;
    }

    // Cancel any previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    loadingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      // Load schedules and entries sequentially to avoid concurrent query issues
      console.log("Loading sleep schedules...");
      const userSchedules = await getUserSleepSchedules(userId);

      // Check if operation was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setSchedules(userSchedules);

      // Small delay between queries to prevent state conflicts
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log("Loading sleep entries...");
      const userEntries = await getUserSleepEntries(userId, 30);

      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setEntries(userEntries);

    } catch (err: any) {
      if (err.name === 'AbortError' || abortControllerRef.current?.signal.aborted) {
        console.log("Load operation was aborted");
        return;
      }

      console.error('Error loading sleep data:', err);

      // Handle Firebase internal errors gracefully
      if (isFirebaseInternalError(err)) {
        setError('Temporary data loading issue. Please try again.');
      } else {
        setError('Failed to load sleep data');
      }
    } finally {
      if (!abortControllerRef.current?.signal.aborted) {
        setIsLoading(false);
      }
      loadingRef.current = false;
    }
  }, []);

  // Load user's sleep schedules
  const loadSchedules = async () => {
    if (!user) return;

    try {
      setError(null);
      const userSchedules = await getUserSleepSchedules(user.id);
      setSchedules(userSchedules);
    } catch (err: any) {
      console.error('Error loading schedules:', err);
      if (err.message?.includes("INTERNAL ASSERTION FAILED")) {
        setError('Temporary issue loading schedules. Please try again.');
      } else {
        setError('Failed to load sleep schedules');
      }
    }
  };

  // Load user's sleep entries
  const loadEntries = async (limit: number = 30) => {
    if (!user) return;

    try {
      setError(null);
      const userEntries = await getUserSleepEntries(user.id, limit);
      setEntries(userEntries);
    } catch (err: any) {
      console.error('Error loading entries:', err);
      if (err.message?.includes("INTERNAL ASSERTION FAILED")) {
        setError('Temporary issue loading entries. Please try again.');
      } else {
        setError('Failed to load sleep entries');
      }
    }
  };

  // Add new sleep entry
  const addSleepEntry = async (entry: Omit<SleepEntry, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    try {
      setError(null);
      const entryId = await saveSleepEntry({
        ...entry,
        userId: user.id
      });
      
      // Reload entries to get the latest data
      await loadEntries();
      return entryId;
    } catch (err) {
      console.error('Error adding sleep entry:', err);
      setError('Failed to save sleep entry');
      throw err;
    }
  };

  // Set active schedule
  const activateSchedule = async (scheduleId: string) => {
    if (!user) return;

    try {
      setError(null);
      await setActiveSchedule(user.id, scheduleId);
      // Reload schedules to reflect the change
      await loadSchedules();
    } catch (err) {
      console.error('Error activating schedule:', err);
      setError('Failed to activate schedule');
      throw err;
    }
  };

  // Get active schedule
  const getActiveSchedule = (): SleepSchedule | null => {
    return schedules.find(schedule => schedule.isActive) || null;
  };

  // Calculate sleep stats
  const getSleepStats = () => {
    if (entries.length === 0) {
      return {
        averageSleepQuality: 0,
        averageSleepDuration: 0,
        totalEntries: 0,
        streakDays: 0
      };
    }

    const totalQuality = entries.reduce((sum, entry) => sum + entry.sleepQuality, 0);
    const averageSleepQuality = totalQuality / entries.length;

    // Calculate average sleep duration (this is simplified)
    const durationsInHours = entries.map(entry => {
      // Simple calculation - you might want to make this more sophisticated
      const bedtime = new Date(`2000-01-01 ${entry.bedtime}`);
      const wakeTime = new Date(`2000-01-01 ${entry.wakeTime}`);
      
      let duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
      if (duration < 0) duration += 24; // Handle overnight sleep
      
      return duration;
    });

    const averageSleepDuration = durationsInHours.reduce((sum, duration) => sum + duration, 0) / durationsInHours.length;

    // Calculate streak (simplified - consecutive days with entries)
    let streakDays = 0;
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date();
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      averageSleepQuality: Math.round(averageSleepQuality * 10) / 10,
      averageSleepDuration: Math.round(averageSleepDuration * 10) / 10,
      totalEntries: entries.length,
      streakDays
    };
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      // Use debounced loading to prevent concurrent queries
      loadData(user.id);
    } else {
      // Cancel any ongoing operations
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setSchedules([]);
      setEntries([]);
      setError(null);
    }

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      loadingRef.current = false;
    };
  }, [user, loadData]);

  const clearError = () => {
    setError(null);
  };

  const retryLoading = async () => {
    if (user) {
      await loadData(user.id);
    }
  };

  return {
    schedules,
    entries,
    isLoading,
    error,
    loadSchedules,
    loadEntries,
    addSleepEntry,
    activateSchedule,
    getActiveSchedule,
    getSleepStats,
    clearError,
    retryLoading
  };
};
