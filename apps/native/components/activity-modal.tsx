import {
  ArrowDown01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

interface ActivityData {
  id?: string;
  name: string;
  intensity: "Baixa" | "Média" | "Alta";
  duration: string;
  emoji?: string;
}

interface ActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (activity: ActivityData) => void;
  onDelete?: (activityId: string) => void;
  editActivity?: ActivityData; // If provided, modal is in edit mode
  isCreating?: boolean;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export function ActivityModal({
  visible,
  onClose,
  onSave,
  onDelete,
  editActivity,
  isCreating = false,
  isUpdating = false,
  isDeleting = false,
}: ActivityModalProps) {
  const [name, setName] = useState("");
  const [intensity, setIntensity] = useState<"Baixa" | "Média" | "Alta" | "">(
    "",
  );
  const [duration, setDuration] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const isEditMode = !!editActivity;
  const isLoading = isCreating || isUpdating || isDeleting;
  const isFormDisabled = isLoading;

  // Populate fields when editing
  useEffect(() => {
    if (editActivity) {
      setName(editActivity.name);
      setIntensity(editActivity.intensity);
      setDuration(editActivity.duration);
      setSelectedEmoji(editActivity.emoji || "");
    } else {
      // Reset fields when creating new activity
      setName("");
      setIntensity("");
      setDuration("");
      setSelectedEmoji("");
    }
  }, [editActivity, visible]);

  const intensityOptions: ("Baixa" | "Média" | "Alta")[] = [
    "Baixa",
    "Média",
    "Alta",
  ];
  const durationOptions = [
    "15 min",
    "30 min",
    "45 min",
    "60 min",
    "90 min",
    "120 min",
  ];

  const emojiOptions = [
    "🏃", // Corrida
    "🏊", // Natação
    "🏋️", // Musculação
    "🚴", // Ciclismo
    "🧘", // Yoga
    "⚽", // Futebol
    "🏀", // Basquete
    "🎾", // Tênis
    "🥊", // Boxe
    "🤸", // Ginástica
    "🏐", // Vôlei
    "💪", // Força
  ];

  const handleSave = () => {
    if (name && intensity && duration && !isLoading) {
      onSave({
        ...(editActivity && { id: editActivity.id }),
        name,
        intensity,
        duration,
        emoji: selectedEmoji || undefined,
      });
      // Reset form only if not editing
      if (!isEditMode) {
        setName("");
        setIntensity("");
        setDuration("");
        setSelectedEmoji("");
      }
      setShowIntensityDropdown(false);
      setShowDurationDropdown(false);
    }
  };

  const handleDelete = () => {
    if (editActivity?.id && onDelete && !isLoading) {
      onDelete(editActivity.id);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setShowIntensityDropdown(false);
      setShowDurationDropdown(false);
      onClose();
    }
  };

  const getLoadingText = () => {
    if (isDeleting) return "Excluindo...";
    if (isUpdating) return "Salvando alterações...";
    if (isCreating) return "Criando atividade...";
    return "";
  };

  const getSaveButtonText = () => {
    if (isUpdating) return "Salvando...";
    if (isCreating) return "Criando...";
    return isEditMode ? "Editar atividade" : "Registrar atividade";
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6 py-12"
        onPress={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full max-w-md"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-h-full flex-shrink"
          >
            {/* Loading Overlay */}
            {isLoading && (
              <View className="absolute inset-0 bg-white/80 rounded-2xl z-50 flex items-center justify-center">
                <View className="bg-white rounded-xl p-6 shadow-lg flex items-center">
                  <ActivityIndicator size="large" color="#000" />
                  <Text className="text-lg font-medium text-gray-900 ml-4">
                    {getLoadingText()}
                  </Text>
                </View>
              </View>
            )}

            {/* Header */}
            <View className="flex-row justify-between items-center p-6 pb-4 border-b border-gray-100">
              <Text className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edite sua atividade" : "Registre sua atividade"}
              </Text>
              <TouchableOpacity onPress={handleClose} disabled={isLoading}>
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={24}
                  color={isLoading ? "#ccc" : "#666"}
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-6 py-4"
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{ flexGrow: 1 }}
              scrollEnabled={!isLoading}
            >
              {/* Nome field */}
              <View className="mb-6">
                <Text className="text-base font-medium text-gray-900 mb-2">
                  Nome
                </Text>
                <TextInput
                  className={`w-full p-4 rounded-lg border border-gray-200 text-gray-900 ${
                    isFormDisabled ? "bg-gray-100" : "bg-gray-50"
                  }`}
                  placeholder="Corrida, natação, musculação..."
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#9CA3AF"
                  editable={!isFormDisabled}
                />
              </View>

              {/* Icon Selector */}
              <View className="mb-6">
                <Text className="text-base font-medium text-gray-900 mb-2">
                  Ícone da atividade
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {emojiOptions.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      onPress={() => !isFormDisabled && setSelectedEmoji(emoji)}
                      disabled={isFormDisabled}
                      className={`w-12 h-12 rounded-lg border-2 items-center justify-center ${
                        selectedEmoji === emoji
                          ? "border-black bg-gray-100"
                          : `border-gray-200 ${isFormDisabled ? "bg-gray-100" : "bg-gray-50"}`
                      } ${isFormDisabled ? "opacity-50" : ""}`}
                    >
                      <Text className="text-xl">{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedEmoji && !isFormDisabled && (
                  <TouchableOpacity
                    onPress={() => setSelectedEmoji("")}
                    className="mt-2"
                  >
                    <Text className="text-sm text-gray-500 text-center">
                      Toque para remover seleção
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Intensidade field */}
              <View className="mb-6">
                <Text className="text-base font-medium text-gray-900 mb-2">
                  Intensidade
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!isFormDisabled) {
                      setShowIntensityDropdown(!showIntensityDropdown);
                      setShowDurationDropdown(false);
                    }
                  }}
                  disabled={isFormDisabled}
                  className={`w-full p-4 rounded-lg border border-gray-200 flex-row justify-between items-center ${
                    isFormDisabled ? "bg-gray-100 opacity-50" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={intensity ? "text-gray-900" : "text-gray-500"}
                  >
                    {intensity || "Escolha uma intensidade"}
                  </Text>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={20}
                    color={isFormDisabled ? "#ccc" : "#666"}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>

                {showIntensityDropdown && !isFormDisabled && (
                  <View className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {intensityOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setIntensity(option);
                          setShowIntensityDropdown(false);
                        }}
                        className="p-4 border-b border-gray-100 last:border-b-0"
                      >
                        <Text className="text-gray-900">{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Duração field */}
              <View className="mb-8">
                <Text className="text-base font-medium text-gray-900 mb-2">
                  Duração
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (!isFormDisabled) {
                      setShowDurationDropdown(!showDurationDropdown);
                      setShowIntensityDropdown(false);
                    }
                  }}
                  disabled={isFormDisabled}
                  className={`w-full p-4 rounded-lg border border-gray-200 flex-row justify-between items-center ${
                    isFormDisabled ? "bg-gray-100 opacity-50" : "bg-gray-50"
                  }`}
                >
                  <Text
                    className={duration ? "text-gray-900" : "text-gray-500"}
                  >
                    {duration || "Escolha uma duração"}
                  </Text>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={20}
                    color={isFormDisabled ? "#ccc" : "#666"}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>

                {showDurationDropdown && !isFormDisabled && (
                  <View className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {durationOptions.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setDuration(option);
                          setShowDurationDropdown(false);
                        }}
                        className="p-4 border-b border-gray-100 last:border-b-0"
                      >
                        <Text className="text-gray-900">{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Delete button - only in edit mode */}
              {isEditMode && onDelete && (
                <View className="mb-4">
                  <TouchableOpacity
                    onPress={handleDelete}
                    disabled={isLoading}
                    className={`w-full p-4 rounded-lg flex-row items-center justify-center ${
                      isDeleting
                        ? "bg-red-400"
                        : isLoading
                          ? "bg-gray-400"
                          : "bg-red-600"
                    }`}
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        size={20}
                        color="white"
                        strokeWidth={1.5}
                      />
                    )}
                    <Text className="text-white text-lg font-medium ml-2">
                      {isDeleting ? "Excluindo..." : "Excluir atividade"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Save button */}
              <View className="pb-4">
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!name || !intensity || !duration || isLoading}
                  className={`w-full p-4 rounded-lg flex-row items-center justify-center ${
                    name && intensity && duration && !isLoading
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                >
                  {(isCreating || isUpdating) && (
                    <ActivityIndicator size="small" color="white" />
                  )}
                  <Text
                    className={`text-white text-lg font-medium ${isCreating || isUpdating ? "ml-2" : ""}`}
                  >
                    {getSaveButtonText()}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}
