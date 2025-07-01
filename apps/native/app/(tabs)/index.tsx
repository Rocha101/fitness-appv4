import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { ActivityModal } from "@/components/activity-modal";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";
import { ArrowRight02Icon, Dumbbell01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

export default function Home() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());
	const privateData = useQuery(trpc.privateData.queryOptions());
	const [isModalVisible, setIsModalVisible] = useState(false);

	// Mock data for activities - replace with real data later
	const activities = [
		{
			id: 1,
			name: "Corrida",
			emoji: "🏃",
			duration: "45Min",
			intensity: "Média",
		},
		{
			id: 2,
			name: "Natação",
			emoji: "🏊",
			duration: "30Min",
			intensity: "Baixa",
		},
		{
			id: 3,
			name: "Musculação",
			emoji: "🏋️",
			duration: "90Min",
			intensity: "Alta",
		},
	];

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="px-6 py-4">
					{/* Header */}
					<View className="flex-row items-center mb-8">
						<View className="w-12 h-12 border-2 border-gray-300 rounded-xl items-center justify-center mr-4">
							<HugeiconsIcon
								icon={Dumbbell01Icon}
								size={24}
								color="#666"
								strokeWidth={1.5}
							/>
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

						{/* Circular Progress - simplified version */}
						<View className="items-center mb-4">
							<View className="w-32 h-32 rounded-full border-8 border-gray-200 items-center justify-center relative">
								<View className="w-28 h-28 rounded-full border-8 border-gray-800 border-r-transparent border-b-transparent rotate-45 absolute" />
								<View className="items-center">
									<Text className="text-4xl font-bold text-gray-900">23</Text>
									<Text className="text-sm text-gray-600">registrados</Text>
								</View>
							</View>
						</View>
					</View>

					{/* Resumo das atividades */}
					<Text className="text-lg font-semibold text-gray-900 mb-4">
						Resumo das atividades
					</Text>

					{/* Activities list */}
					{activities.map((activity) => (
						<TouchableOpacity
							key={activity.id}
							className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between"
						>
							<View className="flex-row items-center flex-1">
								<Text className="text-2xl mr-3">{activity.emoji}</Text>
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
								color="#666"
								strokeWidth={1.5}
							/>
						</TouchableOpacity>
					))}

					{/* Nova atividade button */}
					<TouchableOpacity
						onPress={() => setIsModalVisible(true)}
						className="bg-black rounded-xl p-4 mt-6 mb-8"
					>
						<Text className="text-white text-lg font-medium text-center">
							Nova atividade
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Activity Modal */}
			<ActivityModal
				visible={isModalVisible}
				onClose={() => setIsModalVisible(false)}
				onSave={(activity) => {
					// Handle saving the activity
					console.log("New activity:", activity);
					setIsModalVisible(false);
				}}
			/>
		</Container>
	);
}
