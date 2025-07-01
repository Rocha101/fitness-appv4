export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface Chat {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ChatResponse {
  message: Message;
  chatName?: string;
}

export interface AuthHeaders extends Record<string, string> {
  Authorization: string;
}
