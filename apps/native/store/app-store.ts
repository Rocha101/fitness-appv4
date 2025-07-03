import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AppState {
  token: string | null;
  user: User | null;
  chatId: string | null;
  setToken: (token: string | null) => Promise<void>;
  setUser: (user: User | null) => void;
  setChatId: (id: string | null) => void;
  reset: () => Promise<void>;
}

const TOKEN_KEY = "jwt";

export const useAppStore = create<AppState>(
  (set: (state: Partial<AppState>) => void) => ({
    token: null,
    user: null,
    chatId: null,
    async setToken(token: string | null) {
      if (token) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
      set({ token });
    },
    setUser(user: User | null) {
      set({ user });
    },
    setChatId(chatId: string | null) {
      set({ chatId });
    },
    async reset() {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set({ token: null, user: null, chatId: null });
    },
  }),
);
