import React from "react";
import { Image, Text, View } from "react-native";

export const PageHeader: React.FC = () => {
  return (
    <View className="flex-row items-center mb-8">
      <View className="w-10 h-10 rounded-xl items-center justify-center mr-4">
        <Image
          source={require("../../assets/logo.png")}
          className="w-full h-full"
        />
      </View>
      <Text className="text-2xl font-bold text-gray-900">Início</Text>
    </View>
  );
};
