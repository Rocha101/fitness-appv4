import { Container } from "@/components/container";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  ChatHeader,
  ChatMessages,
  ChatInput,
  ChatLoading,
} from "@/components/chat";
import { useChat } from "@/hooks/use-chat";

export default function Chat() {
  const {
    chatName,
    messages,
    input,
    isLoading,
    error,
    scrollViewRef,
    createChatMutation,
    updateChatNameMutation,
    setInput,
    submitMessage,
    handleUpdateChatName,
  } = useChat();

  if (createChatMutation.isPending) {
    return <ChatLoading message="Criando chat..." />;
  }

  return (
    <Container>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ChatHeader
          chatName={chatName}
          onUpdateName={handleUpdateChatName}
          isUpdating={updateChatNameMutation.isPending}
        />

        <ChatMessages
          ref={scrollViewRef}
          messages={messages}
          isLoading={isLoading}
          error={error}
        />

        <ChatInput
          value={input}
          onChangeText={setInput}
          onSubmit={submitMessage}
          isLoading={isLoading}
        />
      </KeyboardAvoidingView>
    </Container>
  );
}
