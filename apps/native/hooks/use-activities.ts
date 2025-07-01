import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { getActivityEmoji } from "@/utils/activity-utils";

export interface Activity {
  id: string;
  name: string;
  intensity: string;
  duration: string;
  emoji?: string | null;
}

export interface ActivityFormData {
  id?: string;
  name: string;
  intensity: "Baixa" | "Média" | "Alta";
  duration: string;
  emoji?: string;
}

export const useActivities = (callbacks?: {
  onSuccess?: (message: string, description: string) => void;
  onError?: (title: string, message: string) => void;
}) => {
  const queryClient = useQueryClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>(
    undefined,
  );

  // API queries
  const activityStats = useQuery(trpc.getActivityStats.queryOptions());
  const activities = useQuery(trpc.getActivities.queryOptions());

  // Invalidate queries helper
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries(trpc.getActivityStats.queryFilter());
    await queryClient.invalidateQueries(trpc.getActivities.queryFilter());
  };

  // Create activity mutation
  const createActivityMutation = useMutation(
    trpc.createActivity.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries();
        callbacks?.onSuccess?.(
          "Atividade registrada com sucesso!",
          "Sua atividade foi adicionada à lista.",
        );
        setIsModalVisible(false);
      },
      onError: (error: any) => {
        callbacks?.onError?.("Erro", error.message);
      },
    }),
  );

  // Update activity mutation
  const updateActivityMutation = useMutation(
    trpc.updateActivity.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries();
        callbacks?.onSuccess?.(
          "Atividade atualizada com sucesso!",
          "Suas alterações foram salvas.",
        );
        setEditingActivity(undefined);
        setIsModalVisible(false);
      },
      onError: (error: any) => {
        callbacks?.onError?.("Erro", error.message);
      },
    }),
  );

  // Delete activity mutation
  const deleteActivityMutation = useMutation(
    trpc.deleteActivity.mutationOptions({
      onSuccess: async () => {
        await invalidateQueries();
        callbacks?.onSuccess?.(
          "Atividade excluída com sucesso!",
          "A atividade foi removida da sua lista.",
        );
        setEditingActivity(undefined);
        setIsModalVisible(false);
      },
      onError: (error: any) => {
        callbacks?.onError?.("Erro", error.message);
      },
    }),
  );

  // Handlers
  const handleSaveActivity = (activity: ActivityFormData) => {
    const emoji = activity.emoji || getActivityEmoji(activity.name);

    if (activity.id) {
      updateActivityMutation.mutate({
        id: activity.id,
        name: activity.name,
        intensity: activity.intensity,
        duration: activity.duration,
        emoji,
      });
    } else {
      createActivityMutation.mutate({
        name: activity.name,
        intensity: activity.intensity,
        duration: activity.duration,
        emoji,
      });
    }
  };

  const handleDeleteActivity = (activityId: string) => {
    deleteActivityMutation.mutate({ id: activityId });
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setIsModalVisible(true);
  };

  const handleCreateNewActivity = () => {
    setEditingActivity(undefined);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    const isAnyMutationPending =
      createActivityMutation.isPending ||
      updateActivityMutation.isPending ||
      deleteActivityMutation.isPending;

    if (!isAnyMutationPending) {
      setIsModalVisible(false);
      setEditingActivity(undefined);
    }
  };

  // Computed values
  const recentActivities = activityStats.data?.recentActivities || [];
  const totalActivities = activityStats.data?.totalActivities || 0;
  const isLoading = activityStats.isLoading || activities.isLoading;
  const isAnyMutationPending =
    createActivityMutation.isPending ||
    updateActivityMutation.isPending ||
    deleteActivityMutation.isPending;

  return {
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
  };
};
