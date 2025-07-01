import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface CreateActivityButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
  isModalVisible?: boolean;
}

export const CreateActivityButton: React.FC<CreateActivityButtonProps> = ({
  onPress,
  disabled = false,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
  isModalVisible = false,
}) => {
  const getButtonText = () => {
    if (isCreating && !isModalVisible) return "Criando...";
    if (isUpdating && !isModalVisible) return "Atualizando...";
    if (isDeleting && !isModalVisible) return "Excluindo...";
    return "Nova atividade";
  };

  const shouldShowLoading = disabled && !isModalVisible;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl p-4 mt-6 mb-8 flex-row items-center justify-center ${
        disabled ? "bg-gray-400" : "bg-black"
      }`}
    >
      {shouldShowLoading && <ActivityIndicator size="small" color="white" />}
      <Text
        className={`text-white text-lg font-medium ${
          shouldShowLoading ? "ml-2" : ""
        }`}
      >
        {getButtonText()}
      </Text>
    </TouchableOpacity>
  );
};
