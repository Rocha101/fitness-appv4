import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const STORAGE_KEY = "fitness_goal";

export const useGoal = () => {
  const [goal, setGoal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
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
    await SecureStore.setItemAsync(STORAGE_KEY, String(value));
  };

  return { goal, isLoading, saveGoal };
};
