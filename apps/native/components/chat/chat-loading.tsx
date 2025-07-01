import { View, Text, ActivityIndicator } from "react-native";
import { Container } from "../container";

interface ChatLoadingProps {
  message?: string;
}

export function ChatLoading({ message = "Criando chat..." }: ChatLoadingProps) {
  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-600 mt-2">{message}</Text>
      </View>
    </Container>
  );
}
