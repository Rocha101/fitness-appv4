import { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/chat";
import { createChat, updateChatName, loadChatMessages } from "@/lib/chat-utils";
import { chatAPI } from "@/services/chat-api";

export function useChat() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatName, setChatName] = useState("Novo Chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();

  // Create new chat mutation
  const createChatMutation = useMutation({
    mutationFn: ({ name }: { name: string }) => createChat(name),
    onSuccess: async (chat) => {
      setCurrentChatId(chat.id);
      setChatName(chat.name);

      // Load existing messages if any
      try {
        const data = await loadChatMessages(chat.id);
        setMessages(
          (data.messages || []).map((msg) => ({
            ...msg,
            createdAt:
              typeof msg.createdAt === "string"
                ? msg.createdAt
                : msg.createdAt.toISOString(),
          })),
        );
        setChatName(data.chatName || chat.name);
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    },
  });

  // Update chat name mutation
  const updateChatNameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateChatName(id, name),
    onSuccess: async (updatedChat: any) => {
      setChatName(updatedChat.name);
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  // Submit message function
  const submitMessage = async () => {
    if (!input.trim() || !currentChatId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatAPI.sendMessage(currentChatId, [
        ...messages,
        userMessage,
      ]);

      if (data?.message) {
        setMessages((prev) => [
          ...prev,
          {
            ...data.message,
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  // Handle chat name update
  const handleUpdateChatName = (name: string) => {
    if (currentChatId) {
      updateChatNameMutation.mutate({
        id: currentChatId,
        name: name,
      });
    }
  };

  // Create initial chat on component mount
  useEffect(() => {
    if (!currentChatId && !createChatMutation.isPending) {
      createChatMutation.mutate({ name: "Novo Chat" });
    }
  }, [currentChatId]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  return {
    // State
    currentChatId,
    chatName,
    messages,
    input,
    isLoading,
    error,
    scrollViewRef,

    // Mutations
    createChatMutation,
    updateChatNameMutation,

    // Actions
    setInput,
    submitMessage,
    handleUpdateChatName,
  };
}
