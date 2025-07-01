import { View, Text, Image } from "react-native";

export function SettingsHeader() {
  return (
    <View className="mb-8">
      <Text className="text-2xl font-bold text-gray-900 mb-6">
        Configuração
      </Text>

      {/* Illustration */}
      <View className="items-center">
        <View className="w-48 h-48 items-center justify-center">
          <Image
            source={require("../../assets/settings-illustration.png")}
            className="w-full h-full"
          />
        </View>
      </View>
    </View>
  );
}
