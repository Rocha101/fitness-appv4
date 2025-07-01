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

export default function Home() {
  const { showSuccess, showError, AlertComponent } = useCustomAlert();

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

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <PageHeader />

          {/* Suas atividades section */}
          <Text className="text-xl font-bold text-gray-900 mb-6">
            Suas atividades
          </Text>

          <ActivityStatsChart totalActivities={totalActivities} />

          {/* Resumo das atividades */}
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            Resumo das atividades
          </Text>

          <ActivitiesList
            activities={recentActivities}
            isLoading={isLoading}
            onActivityPress={handleEditActivity}
            disabled={isAnyMutationPending}
          />

          <CreateActivityButton
            onPress={handleCreateNewActivity}
            disabled={isAnyMutationPending}
            isCreating={createActivityMutation.isPending}
            isUpdating={updateActivityMutation.isPending}
            isDeleting={deleteActivityMutation.isPending}
            isModalVisible={isModalVisible}
          />
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

      <AlertComponent />
    </Container>
  );
}
