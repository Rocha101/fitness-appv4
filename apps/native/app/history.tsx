import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Container } from "@/components/container";
import { useCustomAlert } from "@/components/custom-alert";
import { useActivities } from "@/hooks/use-activities";
import { ActivitiesList } from "@/components/home";
import { ActivityModal } from "@/components/activity-modal";
import { Redirect } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { SplashScreen } from "@/components/splash-screen";

export default function History() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  if (isSessionLoading) {
    return <SplashScreen />;
  }

  if (!session?.user) {
    return <Redirect href="/auth" />;
  }

  const { showError, showSuccess, AlertComponent } = useCustomAlert();

  const {
    // State
    isModalVisible,
    editingActivity,

    // Data
    allActivities,
    isLoading,
    isAnyMutationPending,

    // Mutations
    createActivityMutation,
    updateActivityMutation,
    deleteActivityMutation,

    // Handlers
    handleEditActivity,
    handleDeleteActivity,
    handleSaveActivity,
    handleCloseModal,
  } = useActivities({
    onSuccess: showSuccess,
    onError: showError,
  });

  return (
    <Container>
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-24">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Histórico de atividades
          </Text>

          <ActivitiesList
            activities={allActivities}
            isLoading={isLoading}
            onActivityPress={handleEditActivity}
            disabled={isAnyMutationPending}
          />
        </View>
      </ScrollView>

      {/* Reuse modal for editing */}
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
