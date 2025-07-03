import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { goalAPI } from "@/services/goal-api";

const STORAGE_KEY = "fitness_goal";

export const useGoal = () => {
  const [goal, setGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load goal from API (fallback to secure store)
  useEffect(() => {
    (async () => {
      try {
        // 1. Try remote API
        const remoteGoal = await goalAPI.getGoal();
        if (remoteGoal !== null) {
          setGoal(remoteGoal);
          await SecureStore.setItemAsync(STORAGE_KEY, String(remoteGoal));
          return;
        }

        // 2. Fallback to local storage
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored) {
          const value = Number(stored);
          if (!isNaN(value)) setGoal(value);
        }
      } catch (err) {
        // Ignore errors and fallback
        const stored = await SecureStore.getItemAsync(STORAGE_KEY);
        if (stored) {
          const value = Number(stored);
          if (!isNaN(value)) setGoal(value);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const saveGoal = async (value: number) => {
    setGoal(value);
    // Persist locally for offline support
    await SecureStore.setItemAsync(STORAGE_KEY, String(value));

    // Persist remotely (ignore errors for offline)
    try {
      await goalAPI.saveGoal(value);
    } catch (err) {
      // Could log error or enqueue retry
      console.warn("Falha ao salvar meta no servidor", err);
    }
  };

  return { goal, isLoading, saveGoal };
};
