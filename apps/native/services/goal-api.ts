import { getAuthHeaders } from "@/lib/chat-utils";

const BASE_URL = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;

export const goalAPI = {
  // Fetch the current goal for the logged-in user
  async getGoal(): Promise<number | null> {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error("Erro ao carregar meta");
    }

    const data = await res.json();
    // The backend returns `activityGoal` as part of the user profile
    return typeof data.activityGoal === "number" ? data.activityGoal : null;
  },

  // Save / update the goal for the logged-in user
  async saveGoal(goal: number): Promise<void> {
    await fetch(`${BASE_URL}/user/profile`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ activityGoal: goal }),
    });
  },
};
