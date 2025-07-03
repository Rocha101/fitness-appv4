import { Chat, Message } from "../types/chat";
import { authClient } from "../lib/auth-client";

const BASE_API = `${process.env.EXPO_PUBLIC_SERVER_URL}/api`;

export const getChats = async (): Promise<Chat[]> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${BASE_API}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch chats");
  }

  return response.json();
};

export const getChat = async (chatId: string): Promise<Chat> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${BASE_API}/chats/${chatId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch chat");
  }

  return response.json();
};

export const createChat = async (initialMessage: {
  content: string;
}): Promise<Chat> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  // 1. Create the chat (no messages yet)
  const createResponse = await fetch(`${BASE_API}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: initialMessage.content.substring(0, 40) }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.message || "Failed to create chat");
  }

  const createdChat: Chat = await createResponse.json();

  // 2. Send the first user message and get assistant reply
  const userMessage: Message = {
    id: `temp-user-${Date.now()}`,
    role: "user",
    content: initialMessage.content,
  };

  const assistantMessage = await sendMessage(createdChat.id, [userMessage]);

  return {
    ...createdChat,
    messages: [userMessage, assistantMessage],
  };
};

export const createEmptyChat = async (): Promise<Chat> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const createResponse = await fetch(`${BASE_API}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name: "Novo Chat" }),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json();
    throw new Error(error.message || "Failed to create chat");
  }

  const chat = await createResponse.json();
  return { ...chat, messages: [] };
};

export async function sendMessage(
  chatId: string,
  allMessages: Message[],
): Promise<Message> {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${BASE_API}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-No-Stream": "true",
    },
    body: JSON.stringify({
      id: chatId,
      messages: allMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send message");
  }

  const result = await response.json();
  return result.message;
}

export const updateChatName = async (
  chatId: string,
  name: string,
): Promise<Chat> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${BASE_API}/chats/${chatId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update chat name");
  }

  return response.json();
};

export const deleteChat = async (chatId: string): Promise<void> => {
  const token = await authClient.getToken();
  if (!token) throw new Error("User not authenticated");

  const response = await fetch(`${BASE_API}/chats/${chatId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete chat");
  }
};
