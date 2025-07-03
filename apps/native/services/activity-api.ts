import { getAuthHeaders } from "@/lib/chat-utils";

export interface ActivityDTO {
  id?: string;
  name: string;
  intensity: "Baixa" | "Média" | "Alta";
  duration: string;
  emoji?: string | null;
}

const BASE_URL = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;

export const activityAPI = {
  async getStats() {
    const res = await fetch(`${BASE_URL}/activities/stats`, {
      headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao carregar estatísticas");
    return res.json();
  },

  async list() {
    const res = await fetch(`${BASE_URL}/activities`, {
      headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao carregar atividades");
    return res.json();
  },

  async create(data: ActivityDTO) {
    const res = await fetch(`${BASE_URL}/activities`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao criar atividade");
    return res.json();
  },

  async update(id: string, data: ActivityDTO) {
    const res = await fetch(`${BASE_URL}/activities/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erro ao atualizar atividade");
    return res.json();
  },

  async remove(id: string) {
    const res = await fetch(`${BASE_URL}/activities/${id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Erro ao excluir atividade");
  },
};
