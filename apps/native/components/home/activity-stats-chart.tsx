import React from "react";
import { Text, View } from "react-native";
import { ActivityProgressSvg } from "./activity-progress-svg";

interface ActivityStatsChartProps {
  totalActivities: number;
  goal?: number;
}

export const ActivityStatsChart: React.FC<ActivityStatsChartProps> = ({
  totalActivities,
  goal = 100,
}) => {
  // Progress between 0 - 1 (goal 100)
  const progress = goal ? Math.min(totalActivities / goal, 1) : 0;

  return (
    <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold text-gray-900 text-center mb-6">
        Atividades
      </Text>

      <View className="items-center relative mb-4">
        {/* Semi-circular progress SVG */}
        <ActivityProgressSvg progress={progress} width={220} strokeWidth={28} />

        {/* Center Text */}
        <View className="absolute -bottom-10 inset-0 items-center justify-center">
          <Text className="text-4xl font-bold text-gray-900">
            {totalActivities}
          </Text>
          <Text className="text-sm text-gray-600">registrados</Text>
        </View>
      </View>
    </View>
  );
};
