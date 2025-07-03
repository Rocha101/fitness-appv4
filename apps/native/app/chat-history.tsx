import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, Stack } from "expo-router";
import { Container } from "@/components/container";
import { deleteChat, getChats } from "@/services/chat-api";
import { Chat } from "@/types/chat";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AiChat02FreeIcons,
  SquareArrowLeft02FreeIcons,
  PlusSignIcon,
  Delete01FreeIcons,
} from "@hugeicons/core-free-icons";

function ChatHistoryItem({
  item,
  onPress,
  onDelete,
}: {
  item: Chat;
  onPress: () => void;
  onDelete: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 mb-2 bg-white rounded-lg border border-gray-200 shadow-sm"
    >
      <HugeiconsIcon icon={AiChat02FreeIcons} size={24} color="#333" />
      <View className="ml-4 flex-1">
        <Text className="text-lg font-semibold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          Última mensagem: {new Date(item.updatedAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} className="p-2 ml-2">
        <HugeiconsIcon icon={Delete01FreeIcons} size={22} color="#ef4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function ChatHistoryScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: chats,
    isLoading,
    isError,
    error,
  } = useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (err: Error) => {
      Alert.alert("Erro", `Não foi possível excluir o chat: ${err.message}`);
    },
  });

  const handleSelectChat = (chatId: string) => {
    router.push({
      pathname: "/(tabs)/chat",
      params: { chatId },
    });
  };

  const handlePressBack = () => {
    if (chats && chats.length === 0) {
      router.replace({
        pathname: "/(tabs)/chat",
      });
    } else {
      router.back();
    }
  };

  const handleDeleteChat = (chatId: string) => {
    Alert.alert(
      "Excluir Chat",
      "Você tem certeza que deseja excluir este chat? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => deleteChatMutation.mutate(chatId),
          style: "destructive",
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 text-center">
            Erro ao carregar chats: {error?.message}
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container>
      <Stack.Screen
        options={{
          title: "Histórico de Chats",
          headerShown: true,
          headerTitle: "Histórico de Chats",
          headerLeft: () => (
            <TouchableOpacity onPress={handlePressBack}>
              <HugeiconsIcon
                icon={SquareArrowLeft02FreeIcons}
                size={24}
                color="#333"
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/chat")}>
              <HugeiconsIcon icon={PlusSignIcon} size={24} color="#333" />
            </TouchableOpacity>
          ),
          animation: "fade",
        }}
      />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatHistoryItem
            item={item}
            onPress={() => handleSelectChat(item.id)}
            onDelete={() => handleDeleteChat(item.id)}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-500 text-lg">
              Nenhum chat encontrado.
            </Text>
          </View>
        }
      />
    </Container>
  );
}
