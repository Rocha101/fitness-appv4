import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

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
    <View className="px-6 py-4 border-t border-gray-100">
      <View className="flex-row items-center space-x-3">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          multiline
          maxLength={maxLength}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={onSubmit}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            canSubmit ? "bg-black" : "bg-gray-300"
          }`}
          disabled={!canSubmit}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              color="white"
              strokeWidth={2}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
