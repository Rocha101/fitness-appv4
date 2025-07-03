import React, { useState, useEffect } from "react";
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

interface GoalModalProps {
  visible: boolean;
  initialGoal: number | null;
  onSave: (goal: number) => void;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  visible,
  initialGoal,
  onSave,
  onClose,
}) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(initialGoal ? String(initialGoal) : "");
  }, [initialGoal, visible]);

  const numericValue = Number(value);
  const isValid = !isNaN(numericValue) && numericValue > 0;

  const handleSave = () => {
    if (isValid) {
      onSave(numericValue);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center px-6 py-12"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full max-w-md"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full p-6"
          >
            <Text className="text-xl font-bold text-gray-900 mb-4">
              Definir meta de atividades
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-lg"
              placeholder="Quantidade de atividades (ex: 50)"
              keyboardType="number-pad"
              autoFocus
              value={value}
              onChangeText={(text) => setValue(text.replace(/[^0-9]/g, ""))}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (isValid) handleSave();
              }}
            />

            <View className="flex-row justify-end mt-6 space-x-4">
              <TouchableOpacity onPress={onClose} className="px-4 py-2">
                <Text className="text-gray-600 text-base">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={!isValid}
                className={`px-4 py-2 rounded-lg ${isValid ? "bg-black" : "bg-gray-300"}`}
              >
                <Text className="text-white text-base">Salvar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};
