import * as SecureStore from "expo-secure-store";
import { queryClient } from "@/utils/query";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/app-store";

const TOKEN_KEY = "jwt";

let inMemoryToken: string | null = null;

// Append global API prefix once here to avoid hard-coding in every call
const BASE_API = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;

async function setToken(token: string | null) {
  const { setToken: updateStore } = useAppStore.getState();
  inMemoryToken = token;
  if (token) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    updateStore(token);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    updateStore(null);
  }
}

async function getToken(): Promise<string | null> {
  if (inMemoryToken !== null) return inMemoryToken;
  const stored = await SecureStore.getItemAsync(TOKEN_KEY);
  inMemoryToken = stored;
  return stored;
}

type CallbackHandlers = {
  onError?: (err: any) => void;
  onSuccess?: (data: any) => void;
  onFinished?: () => void;
  /** Optional handler called after the request completes (alias for onFinished for backward-compat). */
  onResponse?: () => void;
};

// Sign in with e-mail & password
async function signInEmail(
  creds: { email: string; password: string },
  handlers: CallbackHandlers = {},
) {
  try {
    const res = await fetch(`${BASE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw errData;
    }
    const data = await res.json();
    await setToken(data.token);
    handlers.onSuccess?.(data);
    queryClient.invalidateQueries();
  } catch (err) {
    handlers.onError?.(err);
  } finally {
    handlers.onFinished?.();
  }
}

// Sign up
async function signUpEmail(
  creds: { name: string; email: string; password: string },
  handlers: CallbackHandlers = {},
) {
  try {
    const res = await fetch(`${BASE_API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(creds),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw errData;
    }
    const data = await res.json();
    await setToken(data.token);
    handlers.onSuccess?.(data);
    queryClient.invalidateQueries();
  } catch (err) {
    handlers.onError?.(err);
  } finally {
    handlers.onFinished?.();
  }
}

function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) return null as any;

      // Fetch user profile to populate settings screen
      try {
        const res = await fetch(`${BASE_API}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Sessão inválida");
        }

        const user = await res.json();
        useAppStore.getState().setUser(user);

        return {
          user,
          session: { token },
        } as any;
      } catch {
        // Token may be invalid/expired – treat as signed out
        await signOut();
        return null as any;
      }
    },
  });
}

async function getSession() {
  const token = await getToken();
  if (!token) return null as any;
  try {
    const res = await fetch(`${BASE_API}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    const user = await res.json();
    useAppStore.getState().setUser(user);
    return { user, session: { token } } as any;
  } catch {
    await signOut();
    return null as any;
  }
}

async function signOut() {
  await setToken(null);
  queryClient.clear();
  await useAppStore.getState().reset();
}

// Placeholder stubs for unimplemented features
const notImplemented = () => Promise.reject(new Error("Not implemented"));

export const authClient = {
  getToken,
  signIn: { email: signInEmail },
  signUp: { email: signUpEmail },
  signOut,
  useSession,
  getSession,
  /**
   * Update the current authenticated user (name and/or e-mail).
   */
  async updateUser(
    data: { name?: string; email?: string },
    handlers: CallbackHandlers = {},
  ) {
    try {
      const BASE_URL = BASE_API;
      const token = await getToken();
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw errData;
      }

      const responseData = await res.json();

      handlers.onSuccess?.(responseData);
      queryClient.invalidateQueries();
    } catch (err) {
      handlers.onError?.(err);
    } finally {
      handlers.onFinished?.();
      handlers.onResponse?.();
    }
  },

  /**
   * Change user's e-mail. The server currently uses the same profile endpoint,
   * so we simply forward the new email. callbackURL is accepted for API
   * compatibility but currently ignored by the backend.
   */
  async changeEmail(
    data: { newEmail: string; callbackURL?: string },
    handlers: CallbackHandlers = {},
  ) {
    try {
      const BASE_URL = BASE_API;
      const token = await getToken();
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: data.newEmail }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw errData;
      }

      const responseData = await res.json();
      handlers.onSuccess?.(responseData);
      queryClient.invalidateQueries();
    } catch (err) {
      handlers.onError?.(err);
    } finally {
      handlers.onFinished?.();
      handlers.onResponse?.();
    }
  },

  /**
   * Delete the current user's account.
   */
  async deleteUser(
    data: { password?: string },
    handlers: CallbackHandlers = {},
  ) {
    try {
      const BASE_URL = BASE_API;
      const token = await getToken();
      if (!token) {
        throw new Error("Usuário não autenticado");
      }

      const res = await fetch(`${BASE_URL}/user/account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw errData;
      }

      handlers.onSuccess?.(await res.json().catch(() => ({})));

      // Clear local session immediately
      await signOut();
    } catch (err) {
      handlers.onError?.(err);
    } finally {
      handlers.onFinished?.();
      handlers.onResponse?.();
    }
  },

  /** Return the raw JWT token stored in memory/secure storage. */
  async getCookie() {
    const token = await getToken();
    return token ?? "";
  },
};
