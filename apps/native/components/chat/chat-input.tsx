import { View, TextInput, ActivityIndicator } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { SentIcon } from "@hugeicons/core-free-icons";
import { PressableScale } from "@/components/pressable-scale";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export function ChatInput({
  value,
  onChangeText,
  onSubmit,
  isLoading = false,
  placeholder = "O que tem na sua mente?",
  maxLength = 1000,
}: ChatInputProps) {
  const canSubmit = value.trim() !== "" && !isLoading;

  return (
    <View className="px-4 py-3 border-t border-gray-100 bg-white">
      <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-1">
        <TextInput
          className="flex-1 h-10 text-base text-gray-900 rounded-xs"
          placeholder={placeholder}
          placeholderTextColor="#6b7280"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={maxLength}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          editable={!isLoading}
          style={{ backgroundColor: "transparent" }}
        />
        <PressableScale
          onPress={onSubmit}
          className="w-10 h-10 items-center justify-center"
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <HugeiconsIcon
              icon={SentIcon}
              size={24}
              color={canSubmit ? "#000" : "#9CA3AF"}
              strokeWidth={2}
            />
          )}
        </PressableScale>
      </View>
    </View>
  );
}
