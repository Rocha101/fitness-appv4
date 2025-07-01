import { useState, useRef, useEffect } from "react";
import { ScrollView } from "react-native";
import { trpc } from "@/utils/trpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Message, AuthHeaders } from "@/types/chat";
import { chatAPI } from "@/services/chat-api";

export function useChat() {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatName, setChatName] = useState("Novo Chat");
  const [authToken, setAuthToken] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const queryClient = useQueryClient();

  // Helper function to get auth headers
  const getAuthHeaders = async (): Promise<AuthHeaders> => {
    try {
      const authClient = await import("@/lib/auth-client");
      const session = await authClient.authClient.getSession();

      if (session?.data?.session?.token) {
        return {
          Authorization: `Bearer ${session.data.session.token}`,
        };
      } else {
        console.warn("No valid session token found");
        return {
          Authorization: "",
        };
      }
    } catch (error) {
      console.error("Error getting auth headers:", error);
      return {
        Authorization: "",
      };
    }
  };

  // Create new chat mutation
  const createChatMutation = useMutation(
    trpc.createChat.mutationOptions({
      onSuccess: async (chat) => {
        setCurrentChatId(chat.id);
        setChatName(chat.name);

        // Load existing messages if any
        try {
          const headers = await getAuthHeaders();
          const data = await chatAPI.loadChatMessages(chat.id, headers);
          setMessages(data.messages || []);
          setChatName(data.chatName || chat.name);
        } catch (error) {
          console.error("Error loading chat messages:", error);
        }
      },
    }),
  );

  // Update chat name mutation
  const updateChatNameMutation = useMutation(
    trpc.updateChatName.mutationOptions({
      onSuccess: async (updatedChat) => {
        setChatName(updatedChat.name);
        await queryClient.invalidateQueries(trpc.getChats.queryFilter());
        await queryClient.invalidateQueries(trpc.getChat.queryFilter());
      },
    }),
  );

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
      const data = await chatAPI.sendMessage(
        currentChatId,
        [...messages, userMessage],
        authToken,
      );

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

  // Get auth token on mount
  useEffect(() => {
    const updateAuthToken = async () => {
      const headers = await getAuthHeaders();
      setAuthToken(headers.Authorization);
    };
    updateAuthToken();
  }, []);

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
