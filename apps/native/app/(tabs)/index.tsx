import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";
import { ActivityModal } from "@/components/activity-modal";
import { useCustomAlert } from "@/components/custom-alert";
import { useActivities } from "@/hooks/use-activities";
import {
  PageHeader,
  ActivityStatsChart,
  ActivitiesList,
  CreateActivityButton,
} from "@/components/home";
import { useRouter } from "expo-router";
import { useGoal } from "@/hooks/use-goal";
import { GoalModal } from "@/components/goals/goal-modal";

export default function Home() {
  const { showSuccess, showError, AlertComponent } = useCustomAlert();
  const router = useRouter();

  const {
    // State
    isModalVisible,
    editingActivity,

    // Data
    recentActivities,
    totalActivities,
    isLoading,
    isAnyMutationPending,

    // Mutations
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,

    // Handlers
    handleSaveActivity,
    handleDeleteActivity,
    handleEditActivity,
    handleCreateNewActivity,
    handleCloseModal,
  } = useActivities({
    onSuccess: showSuccess,
    onError: showError,
  });

  // Goal hook
  const { goal, isLoading: isGoalLoading, saveGoal } = useGoal();
  const [isGoalModalVisible, setGoalModalVisible] = React.useState(false);

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <PageHeader />

          {/* Suas atividades section */}
          <Text className="text-xl font-bold text-gray-900 mb-6">
            Suas atividades
          </Text>

          {/* Chart with dynamic goal */}
          <ActivityStatsChart
            totalActivities={totalActivities}
            goal={goal ?? 100}
          />

          {/* Resumo das atividades */}
          <View className="h-10 flex flex-row items-center justify-between my-4 gap-2">
            <Text className="text-lg font-semibold text-gray-900">
              Resumo das atividades
            </Text>

            <Text
              className="text-center text-blue-500 text-sm font-semibold"
              onPress={() => router.push({ pathname: "/history" } as any)}
            >
              Ver histórico completo →
            </Text>
          </View>
          <ActivitiesList
            activities={recentActivities}
            isLoading={isLoading}
            onActivityPress={handleEditActivity}
            disabled={isAnyMutationPending}
          />

          <View>
            <CreateActivityButton
              onPress={handleCreateNewActivity}
              disabled={isAnyMutationPending}
              isCreating={createActivityMutation.isPending}
              isUpdating={updateActivityMutation.isPending}
              isDeleting={deleteActivityMutation.isPending}
              isModalVisible={isModalVisible}
            />
          </View>
        </View>
      </ScrollView>

      <ActivityModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
        editActivity={
          editingActivity
            ? {
                id: editingActivity.id,
                name: editingActivity.name,
                intensity: editingActivity.intensity as
                  | "Baixa"
                  | "Média"
                  | "Alta",
                duration: editingActivity.duration,
                emoji: editingActivity.emoji || undefined,
              }
            : undefined
        }
        isCreating={createActivityMutation.isPending}
        isUpdating={updateActivityMutation.isPending}
        isDeleting={deleteActivityMutation.isPending}
      />

      {/* Goal Modal */}
      <GoalModal
        visible={isGoalModalVisible}
        initialGoal={goal}
        onSave={(g) => {
          saveGoal(g);
          setGoalModalVisible(false);
        }}
        onClose={() => setGoalModalVisible(false)}
      />

      <AlertComponent />
    </Container>
  );
}
