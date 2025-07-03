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
    initialLoading,
    isSending,
    error,
    scrollViewRef,
    createChatMutation,
    createEmptyChatMutation,
    updateChatNameMutation,
    setInput,
    submitMessage,
    handleUpdateChatName,
  } = useChat();

  if (initialLoading) {
    let message = "Carregando chat...";
    if (createChatMutation.isPending || createEmptyChatMutation.isPending) {
      message = "Criando novo chat...";
    }
    return <ChatLoading message={message} />;
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
          isLoading={isSending}
          error={error}
        />

        <ChatInput
          value={input}
          onChangeText={setInput}
          onSubmit={submitMessage}
          isLoading={isSending}
        />
      </KeyboardAvoidingView>
    </Container>
  );
}
