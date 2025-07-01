import { forwardRef } from "react";
import { ScrollView, View, Text, ActivityIndicator } from "react-native";
import { ChatMessage } from "./chat-message";
import { Message } from "@/types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  error?: Error | null;
}

export const ChatMessages = forwardRef<ScrollView, ChatMessagesProps>(
  ({ messages, isLoading = false, error = null }, ref) => {
    return (
      <ScrollView
        ref={ref}
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="py-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              id={msg.id}
              role={msg.role}
              content={
                typeof msg.content === "string"
                  ? msg.content
                  : JSON.stringify(msg.content)
              }
            />
          ))}

          {/* Loading indicator for AI response */}
          {isLoading && (
            <View className="mb-4 items-start">
              <View className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <ActivityIndicator size="small" color="#666" />
              </View>
            </View>
          )}

          {/* Error message */}
          {error && (
            <View className="mb-4 items-center">
              <View className="bg-red-100 rounded-2xl px-4 py-3">
                <Text className="text-red-800 text-sm">
                  Erro: {error.message}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  },
);
