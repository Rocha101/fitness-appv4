import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";
import {
	Cancel01Icon,
	Delete02Icon,
	Edit02Icon,
	EyeIcon,
	LogoutIcon,
	Settings02Icon,
	UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Image,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function Settings() {
	const { data: session } = authClient.useSession();
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleLogout = () => {
		authClient.signOut(
			{},
			{
				onSuccess: () => {
					queryClient.invalidateQueries();
					router.replace("/auth");
				},
			},
		);
	};

	const handleDeleteAccount = () => {
		if (!password) {
			Alert.alert("Erro", "Por favor, confirme sua senha");
			return;
		}

		// TODO: Implementar exclusão da conta
		Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso");
		setShowDeleteModal(false);
		setPassword("");
		// Redirecionar para auth após exclusão
		router.replace("/auth");
	};

	return (
		<Container>
			<ScrollView className="flex-1">
				<View className="px-6 py-4">
					{/* Header */}
					<View className="mb-8">
						<Text className="text-2xl font-bold text-gray-900 mb-6">
							Configuração
						</Text>

						{/* Illustration */}
						<View className="items-center">
							<View className="w-48 h-48 items-center justify-center">
								<Image
									source={require("../../assets/settings-illustration.png")}
									className="w-full h-full"
								/>
							</View>
						</View>
					</View>

					{/* User Info Fields */}
					<View className="mb-8">
						{/* Nome */}
						<View className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between">
							<View className="flex-1">
								<Text className="text-sm text-gray-600 mb-1">Nome:</Text>
								<Text className="text-lg text-gray-900">
									{session?.user?.name || "{{UserName}}"}
								</Text>
							</View>
							<TouchableOpacity>
								<HugeiconsIcon
									icon={Edit02Icon}
									size={20}
									color="#666"
									strokeWidth={1.5}
								/>
							</TouchableOpacity>
						</View>

						{/* Email */}
						<View className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between">
							<View className="flex-1">
								<Text className="text-sm text-gray-600 mb-1">Email:</Text>
								<Text className="text-lg text-gray-900">
									{session?.user?.email || "{{UserEmail}}"}
								</Text>
							</View>
							<TouchableOpacity>
								<HugeiconsIcon
									icon={Edit02Icon}
									size={20}
									color="#666"
									strokeWidth={1.5}
								/>
							</TouchableOpacity>
						</View>
					</View>

					{/* Ações */}
					<View>
						<Text className="text-xl font-bold text-gray-900 mb-6">Ações</Text>

						{/* Excluir conta */}
						<TouchableOpacity
							onPress={() => setShowDeleteModal(true)}
							className="flex-row items-center p-4 shadow-[0px 2px 10px 0px rgba(38, 38, 38, 0.1)];
]"
						>
							<HugeiconsIcon
								icon={Delete02Icon}
								size={24}
								color="#EF4444"
								strokeWidth={1.5}
							/>
							<Text className="text-lg text-red-500 ml-3">Excluir conta</Text>
						</TouchableOpacity>

						{/* Sair */}
						<TouchableOpacity
							onPress={handleLogout}
							className="flex-row items-center p-4 shadow-[0px 2px 10px 0px rgba(38, 38, 38, 0.1)]"
						>
							<HugeiconsIcon
								icon={LogoutIcon}
								size={24}
								color="#666"
								strokeWidth={1.5}
							/>
							<Text className="text-lg text-gray-900 ml-3">Sair</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* Modal de Confirmação de Exclusão */}
			<Modal
				visible={showDeleteModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowDeleteModal(false)}
			>
				<View className="flex-1 bg-black bg-opacity-50 items-center justify-center px-6">
					<View className="bg-white rounded-2xl p-6 w-full max-w-sm">
						{/* Header do Modal */}
						<View className="flex-row items-center justify-between mb-6">
							<Text className="text-xl font-bold text-gray-900">
								Excluir conta
							</Text>
							<TouchableOpacity onPress={() => setShowDeleteModal(false)}>
								<HugeiconsIcon
									icon={Cancel01Icon}
									size={24}
									color="#666"
									strokeWidth={1.5}
								/>
							</TouchableOpacity>
						</View>

						{/* Texto explicativo */}
						<Text className="text-gray-600 mb-6 leading-6">
							Para confirmar a exclusão da sua conta, confirme sua senha no
							campo abaixo
						</Text>

						{/* Campo de senha */}
						<View className="mb-8">
							<View className="bg-gray-50 rounded-xl p-4 flex-row items-center">
								<TextInput
									placeholder="Confirmar senha"
									secureTextEntry={!showPassword}
									value={password}
									onChangeText={setPassword}
									className="flex-1 text-lg text-gray-900"
									placeholderTextColor="#9CA3AF"
								/>
								<TouchableOpacity
									onPress={() => setShowPassword(!showPassword)}
									className="ml-3"
								>
									<HugeiconsIcon
										icon={EyeIcon}
										size={20}
										color="#666"
										strokeWidth={1.5}
									/>
								</TouchableOpacity>
							</View>
						</View>

						{/* Botões */}
						<View className="flex-row gap-4">
							<TouchableOpacity
								onPress={() => {
									setShowDeleteModal(false);
									setPassword("");
								}}
								className="flex-1 bg-gray-100 rounded-xl p-4"
							>
								<Text className="text-gray-900 text-lg font-medium text-center">
									Cancelar
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleDeleteAccount}
								className="flex-1 bg-red-500 rounded-xl p-4 flex-row items-center justify-center"
							>
								<HugeiconsIcon
									icon={Delete02Icon}
									size={20}
									color="white"
									strokeWidth={1.5}
								/>
								<Text className="text-white text-lg font-medium ml-2">
									Excluir conta
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</Container>
	);
}
