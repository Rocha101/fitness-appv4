import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ActivityCard } from "./activity-card";
import { Activity } from "@/hooks/use-activities";

interface ActivitiesListProps {
  activities: Activity[];
  isLoading: boolean;
  onActivityPress: (activity: Activity) => void;
  disabled?: boolean;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  activities,
  isLoading,
  onActivityPress,
  disabled = false,
}) => {
  if (isLoading) {
    return (
      <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="text-gray-500 text-base text-center mt-4">
          Carregando atividades...
        </Text>
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 items-center">
        <Text className="text-gray-500 text-base text-center">
          Nenhuma atividade registrada ainda.{"\n"}
          Comece criando sua primeira atividade!
        </Text>
      </View>
    );
  }

  return (
    <View>
      {activities.map((activity) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          onPress={onActivityPress}
          disabled={disabled}
        />
      ))}
    </View>
  );
};
