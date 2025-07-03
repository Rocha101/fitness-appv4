import { Message, ChatResponse } from "@/types/chat";
import { getAuthHeaders } from "@/lib/chat-utils";

export class ChatAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;
  }

  async loadChatMessages(chatId: string) {
    const response = await fetch(`${this.baseUrl}/chat?chatId=${chatId}`, {
      headers: await getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to load chat messages: HTTP ${response.status}`);
    }

    return await response.json();
  }

  async sendMessage(
    chatId: string,
    messages: Message[],
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "X-No-Stream": "true",
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        id: chatId,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }
}

export const chatAPI = new ChatAPI();
