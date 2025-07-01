import { Container } from "@/components/container";
import { AiChat02FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Chat() {
	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="px-6 py-4">
					{/* Header */}
					<View className="flex-row items-center mb-8">
						<View className="w-12 h-12 border-2 border-gray-300 rounded-xl items-center justify-center mr-4">
							<HugeiconsIcon
								icon={AiChat02FreeIcons}
								size={24}
								color="#666"
								strokeWidth={1.5}
							/>
						</View>
						<Text className="text-2xl font-bold text-gray-900">Chat</Text>
					</View>

					{/* Chat content placeholder */}
					<View className="flex-1 items-center justify-center py-20">
						<View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
							<HugeiconsIcon
								icon={AiChat02FreeIcons}
								size={40}
								color="#9CA3AF"
								strokeWidth={1.5}
							/>
						</View>
						<Text className="text-lg font-semibold text-gray-900 mb-2">
							Chat com IA
						</Text>
						<Text className="text-gray-600 text-center px-8">
							Converse com nossa IA para obter dicas personalizadas sobre seus
							treinos e saúde
						</Text>
					</View>

					{/* Start chat button */}
					<TouchableOpacity className="bg-black rounded-xl p-4 mt-6 mb-8">
						<Text className="text-white text-lg font-medium text-center">
							Iniciar conversa
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</Container>
	);
}
