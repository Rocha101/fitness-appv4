import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Cancel01Icon,
  Delete02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: (password: string) => Promise<void>;
  isDeleting?: boolean;
}

export function DeleteAccountModal({
  visible,
  onClose,
  onDelete,
  isDeleting = false,
}: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setPassword("");
    setShowPassword(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!password) {
      return;
    }
    await onDelete(password);
    setPassword("");
    setShowPassword(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black bg-opacity-50 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Header do Modal */}
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-gray-900">
              Excluir conta
            </Text>
            <TouchableOpacity onPress={handleClose} disabled={isDeleting}>
              <HugeiconsIcon
                icon={Cancel01Icon}
                size={24}
                color="#666"
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          </View>

          {/* Texto explicativo */}
          <Text className="text-gray-600 mb-6 leading-6">
            Para confirmar a exclusão da sua conta, confirme sua senha no campo
            abaixo
          </Text>

          {/* Campo de senha */}
          <View className="mb-8">
            <View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
              <TextInput
                placeholder="Confirmar senha"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-lg text-gray-900"
                placeholderTextColor="#9CA3AF"
                editable={!isDeleting}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-3"
                disabled={isDeleting}
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewOffIcon : ViewIcon}
                  size={24}
                  color="#9CA3AF"
                  strokeWidth={1.5}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botões */}
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-gray-100 rounded-xl p-4"
              disabled={isDeleting}
            >
              <Text className="text-gray-900 text-lg font-medium text-center">
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleDelete}
              className={`flex-1 rounded-xl p-4 flex-row items-center justify-center ${
                isDeleting ? "bg-red-300" : "bg-red-500"
              }`}
              disabled={isDeleting || !password}
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
                {isDeleting ? "Excluindo..." : "Excluir conta"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
