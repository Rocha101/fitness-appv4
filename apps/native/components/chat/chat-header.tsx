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
  AiChat02FreeIcons,
  Edit02FreeIcons,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

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
    <View className="px-6 py-4 border-b border-gray-100">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 border-2 border-gray-300 rounded-xl items-center justify-center mr-3">
            <HugeiconsIcon
              icon={AiChat02FreeIcons}
              size={20}
              color="#666"
              strokeWidth={1.5}
            />
          </View>

          {isEditingName ? (
            <View className="flex-1 flex-row items-center">
              <TextInput
                className="flex-1 text-xl font-bold text-gray-900 border-b border-gray-300 pb-1"
                value={tempChatName}
                onChangeText={setTempChatName}
                onSubmitEditing={saveChatName}
                autoFocus
                maxLength={50}
                returnKeyType="done"
              />
              <TouchableOpacity
                onPress={saveChatName}
                className="w-8 h-8 items-center justify-center ml-2"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#22c55e" />
                ) : (
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    color="#22c55e"
                    strokeWidth={1.5}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={cancelEditingName}
                className="w-8 h-8 items-center justify-center ml-1"
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={18}
                  color="#ef4444"
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={startEditingName} className="flex-1">
              <Text className="text-xl font-bold text-gray-900">
                {chatName}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!isEditingName && (
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
        )}
      </View>
    </View>
  );
}
