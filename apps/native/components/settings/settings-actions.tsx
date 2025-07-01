import { View, Text, TouchableOpacity } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Delete02Icon, LogoutIcon } from "@hugeicons/core-free-icons";

interface SettingsActionsProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function SettingsActions({
  onLogout,
  onDeleteAccount,
}: SettingsActionsProps) {
  return (
    <View>
      <Text className="text-xl font-bold text-gray-900 mb-6">Ações</Text>

      {/* Excluir conta */}
      <TouchableOpacity
        onPress={onDeleteAccount}
        className="flex-row items-center p-4 rounded-xl bg-white shadow-sm mb-4"
      >
        <HugeiconsIcon
          icon={Delete02Icon}
          size={24}
          color="#EF4444"
          strokeWidth={1.5}
        />
        <Text className="text-lg text-red-500 ml-3">Excluir conta</Text>
      </TouchableOpacity>

      {/* Sair */}
      <TouchableOpacity
        onPress={onLogout}
        className="flex-row items-center p-4 rounded-xl bg-white shadow-sm"
      >
        <HugeiconsIcon
          icon={LogoutIcon}
          size={24}
          color="#666"
          strokeWidth={1.5}
        />
        <Text className="text-lg text-gray-900 ml-3">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
