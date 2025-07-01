import React from "react";
import { Text, View } from "react-native";

interface ActivityStatsChartProps {
  totalActivities: number;
}

export const ActivityStatsChart: React.FC<ActivityStatsChartProps> = ({
  totalActivities,
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-900 text-center mb-6">
        Atividades
      </Text>

      {/* Circular Progress */}
      <View className="items-center mb-4">
        <View className="w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center relative">
          <View className="w-28 h-28 rounded-full border-8 border-gray-800 border-r-transparent border-b-transparent rotate-45 absolute" />
          <View className="items-center">
            <Text className="text-4xl font-bold text-gray-900">
              {totalActivities}
            </Text>
            <Text className="text-sm text-gray-600">registrados</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
