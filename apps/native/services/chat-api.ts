import { Message, ChatResponse, AuthHeaders } from "@/types/chat";

export class ChatAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_SERVER_URL || "";
  }

  async loadChatMessages(chatId: string, headers: AuthHeaders) {
    const response = await fetch(`${this.baseUrl}/api/chat?chatId=${chatId}`, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to load chat messages: HTTP ${response.status}`);
    }

    return await response.json();
  }

  async sendMessage(
    chatId: string,
    messages: Message[],
    authToken: string,
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-No-Stream": "true",
      },
      body: JSON.stringify({
        id: chatId,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        authToken: authToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  }
}

export const chatAPI = new ChatAPI();
