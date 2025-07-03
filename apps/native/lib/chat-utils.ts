import { authClient } from "./auth-client";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date | string;
}

export interface ChatData {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

const API_BASE_URL = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;

// Get auth headers for API calls
export const getAuthHeaders = async () => {
  const session = await authClient.getSession();
  return {
    "Content-Type": "application/json",
    Authorization: session?.session?.token
      ? `Bearer ${session.session.token}`
      : "",
  };
};

// Create a new chat
export const createChat = async (
  name: string = "Novo Chat",
): Promise<ChatData> => {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: "POST",
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create chat");
  }

  return response.json();
};

// Load chat messages for AI SDK
export const loadChatMessages = async (
  chatId: string,
): Promise<{
  messages: ChatMessage[];
  chatName: string;
}> => {
  const response = await fetch(`${API_BASE_URL}/chat?chatId=${chatId}`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load chat messages");
  }

  const data = await response.json();
  return {
    messages: data.messages || [],
    chatName: data.chatName || "Chat",
  };
};

// Update chat name
export const updateChatName = async (
  chatId: string,
  name: string,
): Promise<ChatData> => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: "PATCH",
    headers: await getAuthHeaders(),
    body: JSON.stringify({
      name,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update chat name");
  }

  return response.json();
};

// List all chats
export const listChats = async (): Promise<ChatData[]> => {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load chats");
  }

  return response.json();
};

// Delete a chat
export const deleteChat = async (chatId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }
};
