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
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Edit02FreeIcons,
} from "@hugeicons/core-free-icons";
import { useCustomAlert } from "../custom-alert";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
  keyboardType?: "default" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  validation?: (value: string) => string | null; // Returns error message or null
}

export function EditableField({
  label,
  value,
  onSave,
  isLoading = false,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  validation,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const { showSuccess, showError, AlertComponent } = useCustomAlert();

  const handleStartEdit = () => {
    setTempValue(value);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmedValue = tempValue.trim();

    if (!trimmedValue) {
      showError("Erro", `${label} não pode estar vazio`);
      return;
    }

    if (validation) {
      const errorMessage = validation(trimmedValue);
      if (errorMessage) {
        showError("Erro", errorMessage);
        return;
      }
    }

    try {
      await onSave(trimmedValue);
      setIsEditing(false);
      showSuccess("Sucesso", `${label} atualizado com sucesso!`);
    } catch (error: any) {
      showError(
        "Erro",
        `Falha ao atualizar ${label.toLowerCase()}: ${error.message}`,
      );
    }
  };

  return (
    <>
      <View className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between min-h-[80px]">
        <View className="flex-1">
          <Text className="text-sm text-gray-600 mb-1">{label}:</Text>
          {isEditing ? (
            <TextInput
              value={tempValue}
              onChangeText={setTempValue}
              autoFocus
              className="text-lg text-gray-900 border-b border-gray-300 py-1"
              placeholder={placeholder}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              editable={!isLoading}
            />
          ) : (
            <Text className="text-lg text-gray-900">
              {value || placeholder || `{{${label}}}`}
            </Text>
          )}
        </View>
        {isEditing ? (
          <View className="flex-row items-center ml-2">
            <TouchableOpacity
              onPress={handleSave}
              className="p-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#22c55e" />
              ) : (
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={24}
                  color="#22c55e"
                  strokeWidth={1.5}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              className="p-2"
              disabled={isLoading}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={24}
                color={isLoading ? "#9CA3AF" : "#ef4444"}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleStartEdit} className="p-2">
            <HugeiconsIcon
              icon={Edit02FreeIcons}
              size={20}
              color="#666"
              strokeWidth={1.5}
            />
          </TouchableOpacity>
        )}
      </View>
      <AlertComponent />
    </>
  );
}
