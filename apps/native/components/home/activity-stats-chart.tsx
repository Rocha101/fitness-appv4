import React from "react";
import { Text, View, Pressable } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface ActivityStatsChartProps {
  totalActivities: number;
  goal?: number;
  onPress?: () => void;
}

export const ActivityStatsChart: React.FC<ActivityStatsChartProps> = ({
  totalActivities,
  goal = 100,
  onPress,
}) => {
  // When progress is very small (e.g. 1%), the rounded stroke caps may hide it.
  // We enforce a tiny minimum so the user always sees some feedback.
  let progress = goal ? Math.min(totalActivities / goal, 1) : 0;
  if (progress > 0 && progress < 0.02) progress = 0.02;

  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100 active:opacity-80"
    >
      <Text className="text-lg font-semibold text-gray-900 text-center mb-6">
        Atividades da semana
      </Text>

      <View className="items-center -mb-20">
        <AnimatedCircularProgress
          size={200}
          width={20}
          fill={progress * 100}
          tintColor="#000000"
          backgroundColor="#EDEDED"
          rotation={-90}
          lineCap="round"
          arcSweepAngle={180}
        >
          {() => (
            <View className="items-center mb-16">
              <Text className="text-4xl font-bold text-gray-900">
                {totalActivities}
              </Text>
              <Text className="text-sm text-gray-600">registrados</Text>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
    </Pressable>
  );
};
