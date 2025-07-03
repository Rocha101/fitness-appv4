import { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatService from "@/services/chat-api";
import { Chat, Message } from "@/types/chat";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const CHAT_ID_STORAGE_KEY = "activeChatId";

export function useChat() {
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { chatId: chatIdFromParams } = useLocalSearchParams<{
    chatId?: string;
  }>();

  const [chatId, setChatId] = useState<string | undefined>(undefined);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadInitialChat = async () => {
      let activeChatId: string | null | undefined = chatIdFromParams;
      if (!activeChatId) {
        activeChatId = await SecureStore.getItemAsync(CHAT_ID_STORAGE_KEY);
      }
      if (activeChatId) {
        setChatId(activeChatId);
      } else {
        createEmptyChatMutation.mutate();
      }
    };
    loadInitialChat();
  }, [chatIdFromParams]);

  const {
    data: chat,
    isLoading: isChatLoading,
    error: chatError,
  } = useQuery<Chat, Error>({
    queryKey: ["chat", chatId],
    queryFn: () => chatService.getChat(chatId!),
    enabled: !!chatId,
  });

  const messages: Message[] = (chat?.messages ?? []).map((m: any) => {
    if ("role" in m) return m as Message;
    return {
      ...m,
      role: m.isUser ? "user" : "assistant",
    };
  });
  const chatName = chat?.name ?? "Novo Chat";

  const updateChatNameMutation = useMutation({
    mutationFn: (newName: string) =>
      chatService.updateChatName(chatId!, newName),
    onSuccess: (updatedChat) => {
      queryClient.setQueryData(["chat", chatId], updatedChat);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const createEmptyChatMutation = useMutation({
    mutationFn: chatService.createEmptyChat,
    onSuccess: (newChat) => {
      queryClient.setQueryData(["chat", newChat.id], newChat);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.replace({
        pathname: "/(tabs)/chat",
        params: { chatId: newChat.id },
      });
      setChatId(newChat.id);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: (messages: Message[]) => {
      return chatService.sendMessage(chatId!, messages);
    },
    onSuccess: (assistantMessage) => {
      queryClient.setQueryData<Chat | undefined>(
        ["chat", chatId],
        (oldData) => {
          if (!oldData) return;

          const currentMessages = oldData.messages ?? [];

          return {
            ...oldData,
            messages: [...currentMessages, assistantMessage],
          };
        },
      );
    },
  });

  const createChatMutation = useMutation({
    mutationFn: (content: string) => chatService.createChat({ content }),
    onSuccess: (newChat) => {
      queryClient.setQueryData(["chat", newChat.id], newChat);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.replace({
        pathname: "/(tabs)/chat",
        params: { chatId: newChat.id },
      });
      setChatId(newChat.id);
    },
  });

  const submitMessage = async () => {
    if (input.trim() === "") return;
    const content = input;
    setInput("");

    const userMessage: Message = {
      id: `temp-user-message-${Date.now()}`,
      role: "user",
      content,
    };

    if (chatId) {
      // Optimistically update the UI
      queryClient.setQueryData<Chat | undefined>(
        ["chat", chatId],
        (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            messages: [...(oldData.messages ?? []), userMessage],
          };
        },
      );
      sendMessageMutation.mutate([...messages, userMessage]);
    } else {
      createChatMutation.mutate(content);
    }
  };

  const handleUpdateChatName = (newName: string) => {
    if (chatId) {
      updateChatNameMutation.mutate(newName);
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  }, [messages.length]);

  return {
    chatName,
    messages,
    input,
    isLoading:
      isChatLoading ||
      sendMessageMutation.isPending ||
      createChatMutation.isPending ||
      createEmptyChatMutation.isPending,
    error:
      chatError ||
      sendMessageMutation.error ||
      createChatMutation.error ||
      createEmptyChatMutation.error,
    scrollViewRef,
    createChatMutation,
    createEmptyChatMutation,
    updateChatNameMutation,
    setInput,
    submitMessage,
    handleUpdateChatName,
  };
}
