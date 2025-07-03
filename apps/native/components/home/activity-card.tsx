import React from "react";
import { Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { getActivityEmoji } from "@/utils/activity-utils";
import { Activity } from "@/hooks/use-activities";
import { PressableScale } from "@/components/pressable-scale";

interface ActivityCardProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
  disabled?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onPress,
  disabled = false,
}) => {
  return (
    <PressableScale
      onPress={() => onPress(activity)}
      disabled={disabled}
      className={`bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <View className="flex-row items-center flex-1">
        <Text className="text-2xl mr-3">
          {activity.emoji || getActivityEmoji(activity.name)}
        </Text>
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-900 mb-1">
            {activity.name}
          </Text>
          <View className="flex-row">
            <Text className="text-sm text-gray-600 mr-4">
              Tempo: {activity.duration}
            </Text>
            <Text className="text-sm text-gray-600">
              Intensidade: {activity.intensity}
            </Text>
          </View>
        </View>
      </View>
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        size={20}
        color={disabled ? "#ccc" : "#666"}
        strokeWidth={1.5}
      />
    </PressableScale>
  );
};
