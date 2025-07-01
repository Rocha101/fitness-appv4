import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ActivityModal } from "@/components/activity-modal";
import { Container } from "@/components/container";
import { useCustomAlert } from "@/components/custom-alert";
import { trpc } from "@/utils/trpc";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

// Helper function to get emoji for activity type
const getActivityEmoji = (name: string): string => {
	const lowercaseName = name.toLowerCase();
	if (lowercaseName.includes('corrida') || lowercaseName.includes('correr')) return '🏃';
	if (lowercaseName.includes('natação') || lowercaseName.includes('nadar')) return '🏊';
	if (lowercaseName.includes('musculação') || lowercaseName.includes('academia')) return '🏋️';
	if (lowercaseName.includes('ciclismo') || lowercaseName.includes('bike')) return '🚴';
	if (lowercaseName.includes('yoga')) return '🧘';
	if (lowercaseName.includes('futebol')) return '⚽';
	return '💪'; // default emoji
};

export default function Home() {
	const queryClient = useQueryClient();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [editingActivity, setEditingActivity] = useState<{
		id: string;
		name: string;
		intensity: "Baixa" | "Média" | "Alta";
		duration: string;
		emoji?: string;
	} | undefined>(undefined);
	const { showSuccess, showError, AlertComponent } = useCustomAlert();

	// API queries
	const activityStats = useQuery(trpc.getActivityStats.queryOptions());
	const activities = useQuery(trpc.getActivities.queryOptions());

	// Create activity mutation
	const createActivityMutation = useMutation(trpc.createActivity.mutationOptions({
		onSuccess: () => {
			queryClient.invalidateQueries();
			showSuccess("Atividade registrada com sucesso!", "Sua atividade foi adicionada à lista.");
			setIsModalVisible(false);
		},
		onError: (error: any) => {
			showError("Erro", error.message);
		},
	}));

	// Update activity mutation
	const updateActivityMutation = useMutation(trpc.updateActivity.mutationOptions({
		onSuccess: () => {
			queryClient.invalidateQueries();
			showSuccess("Atividade atualizada com sucesso!", "Suas alterações foram salvas.");
			setEditingActivity(undefined);
			setIsModalVisible(false);
		},
		onError: (error: any) => {
			showError("Erro", error.message);
		},
	}));

	// Delete activity mutation
	const deleteActivityMutation = useMutation(trpc.deleteActivity.mutationOptions({
		onSuccess: () => {
			queryClient.invalidateQueries();
			showSuccess("Atividade excluída com sucesso!", "A atividade foi removida da sua lista.");
			setEditingActivity(undefined);
			setIsModalVisible(false);
		},
		onError: (error: any) => {
			showError("Erro", error.message);
		},
	}));

	const handleSaveActivity = (activity: { id?: string; name: string; intensity: "Baixa" | "Média" | "Alta"; duration: string; emoji?: string }) => {
		const emoji = activity.emoji || getActivityEmoji(activity.name);

		if (activity.id) {
			// Update existing activity
			updateActivityMutation.mutate({
				id: activity.id,
				name: activity.name,
				intensity: activity.intensity,
				duration: activity.duration,
				emoji,
			});
		} else {
			// Create new activity
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

	const handleEditActivity = (activity: any) => {
		setEditingActivity({
			id: activity.id,
			name: activity.name,
			intensity: activity.intensity,
			duration: activity.duration,
			emoji: activity.emoji,
		});
		setIsModalVisible(true);
	};

	const handleCreateNewActivity = () => {
		setEditingActivity(undefined);
		setIsModalVisible(true);
	};

	const handleCloseModal = () => {
		// Only allow closing if no operation is in progress
		if (!createActivityMutation.isPending && !updateActivityMutation.isPending && !deleteActivityMutation.isPending) {
			setIsModalVisible(false);
			setEditingActivity(undefined);
		}
	};

	const recentActivities = activityStats.data?.recentActivities || [];
	const totalActivities = activityStats.data?.totalActivities || 0;

	const isAnyMutationPending = createActivityMutation.isPending || updateActivityMutation.isPending || deleteActivityMutation.isPending;

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="px-6 py-4">
					{/* Header */}
					<View className="flex-row items-center mb-8">
						<View className="w-10 h-10 rounded-xl items-center justify-center mr-4">
							<Image source={require("../../assets/logo.png")} className="w-full h-full" />
						</View>
						<Text className="text-2xl font-bold text-gray-900">Início</Text>
					</View>

					{/* Suas atividades section */}
					<Text className="text-xl font-bold text-gray-900 mb-6">
						Suas atividades
					</Text>

					{/* Activities chart */}
					<View className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
						<Text className="text-lg font-semibold text-gray-900 text-center mb-6">
							Atividades
						</Text>

						{/* Circular Progress */}
						<View className="items-center mb-4">
							<View className="w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center relative">
								<View className="w-28 h-28 rounded-full border-8 border-gray-800 border-r-transparent border-b-transparent rotate-45 absolute" />
								<View className="items-center">
									<Text className="text-4xl font-bold text-gray-900">{totalActivities}</Text>
									<Text className="text-sm text-gray-600">registrados</Text>
								</View>
							</View>
						</View>
					</View>

					{/* Resumo das atividades */}
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Resumo das atividades
					</Text>

					{/* Loading indicator for data fetching */}
					{(activityStats.isLoading || activities.isLoading) && (
						<View className="bg-white rounded-xl p-8 mb-3 shadow-sm border border-gray-100 items-center">
							<ActivityIndicator size="large" color="#000" />
							<Text className="text-gray-500 text-base text-center mt-4">
								Carregando atividades...
							</Text>
						</View>
					)}

					{/* Activities list */}
					{!activityStats.isLoading && !activities.isLoading && (
						recentActivities.length > 0 ? (
							recentActivities.map((activity) => (
								<TouchableOpacity
									key={activity.id}
									onPress={() => handleEditActivity(activity)}
									disabled={isAnyMutationPending}
									className={`bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between ${isAnyMutationPending ? 'opacity-50' : ''
										}`}
								>
									<View className="flex-row items-center flex-1">
										<Text className="text-2xl mr-3">{activity.emoji || getActivityEmoji(activity.name)}</Text>
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
										color={isAnyMutationPending ? "#ccc" : "#666"}
										strokeWidth={1.5}
									/>
								</TouchableOpacity>
							))
						) : (
							<View className="bg-white rounded-xl p-8 mb-3 shadow-sm border border-gray-100 items-center">
								<Text className="text-gray-500 text-base text-center">
									Nenhuma atividade registrada ainda.{'\n'}
									Comece criando sua primeira atividade!
								</Text>
							</View>
						)
					)}

					{/* Nova atividade button */}
					<TouchableOpacity
						onPress={handleCreateNewActivity}
						disabled={isAnyMutationPending}
						className={`rounded-xl p-4 mt-6 mb-8 flex-row items-center justify-center ${isAnyMutationPending ? 'bg-gray-400' : 'bg-black'
							}`}
					>
						{isAnyMutationPending && !isModalVisible && (
							<ActivityIndicator size="small" color="white" />
						)}
						<Text className={`text-white text-lg font-medium ${isAnyMutationPending && !isModalVisible ? 'ml-2' : ''
							}`}>
							{createActivityMutation.isPending && !isModalVisible ? 'Criando...' :
								updateActivityMutation.isPending && !isModalVisible ? 'Atualizando...' :
									deleteActivityMutation.isPending && !isModalVisible ? 'Excluindo...' : 'Nova atividade'}
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Activity Modal */}
			<ActivityModal
				visible={isModalVisible}
				onClose={handleCloseModal}
				onSave={handleSaveActivity}
				onDelete={handleDeleteActivity}
				editActivity={editingActivity}
				isCreating={createActivityMutation.isPending}
				isUpdating={updateActivityMutation.isPending}
				isDeleting={deleteActivityMutation.isPending}
			/>

			{/* Custom Alert */}
			<AlertComponent />
		</Container>
	);
}
