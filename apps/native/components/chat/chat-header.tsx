import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft02Icon,
  Edit02FreeIcons,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Menu02Icon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";

interface ChatHeaderProps {
  chatName: string;
  onUpdateName: (name: string) => void;
  isUpdating?: boolean;
}

export function ChatHeader({
  chatName,
  onUpdateName,
  isUpdating = false,
}: ChatHeaderProps) {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempChatName, setTempChatName] = useState("");

  const startEditingName = () => {
    setTempChatName(chatName);
    setIsEditingName(true);
  };

  const saveChatName = () => {
    if (tempChatName.trim() !== "") {
      onUpdateName(tempChatName.trim());
      setIsEditingName(false);
    } else {
      cancelEditingName();
    }
  };

  const cancelEditingName = () => {
    setTempChatName("");
    setIsEditingName(false);
  };

  return (
    <View className="px-4 py-4 border-b border-gray-100">
      <View className="flex-row items-center">
        {isEditingName ? (
          <>
            {/* Cancel button */}
            <TouchableOpacity
              onPress={cancelEditingName}
              className="w-10 h-10 items-center justify-center"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={20}
                color="#ef4444"
                strokeWidth={1.5}
              />
            </TouchableOpacity>

            {/* Chat name input */}
            <TextInput
              className="flex-1 text-xl leading-tight font-bold text-gray-900 text-center mx-2 bg-gray-100 rounded-lg px-3 py-2"
              value={tempChatName}
              onChangeText={setTempChatName}
              onSubmitEditing={saveChatName}
              autoFocus
              maxLength={50}
              returnKeyType="done"
            />

            {/* Save button */}
            <TouchableOpacity
              onPress={saveChatName}
              className="w-10 h-10 items-center justify-center"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#22c55e" />
              ) : (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={20}
                  color="#22c55e"
                  strokeWidth={1.5}
                />
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Menu button */}
            <TouchableOpacity
              onPress={() => router.push("/chat-history")}
              className="w-10 h-10 items-center justify-center"
            >
              <HugeiconsIcon
                icon={Menu02Icon}
                size={20}
                color="#666"
                strokeWidth={1.5}
              />
            </TouchableOpacity>

            {/* Chat name */}
            <TouchableOpacity onPress={startEditingName} className="flex-1">
              <Text className="text-xl font-bold text-gray-900 text-center">
                {chatName}
              </Text>
            </TouchableOpacity>

            {/* Edit button */}
            <TouchableOpacity
              onPress={startEditingName}
              className="w-10 h-10 items-center justify-center"
            >
              <HugeiconsIcon
                icon={Edit02FreeIcons}
                size={20}
                color="#666"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
