import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import {
	Cancel01Icon,
	CheckmarkCircleIcon,
	Delete02Icon,
	Edit02Icon,
	LogoutIcon,
	ViewIcon,
	ViewOffIcon,
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
	const [isEditingName, setIsEditingName] = useState(false);
	const [name, setName] = useState(session?.user?.name || "");
	const [isEditingEmail, setIsEditingEmail] = useState(false);
	const [email, setEmail] = useState(session?.user?.email || "");

	// Loading states for async operations
	const [isUpdatingName, setIsUpdatingName] = useState(false);
	const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);

	const handleLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.replace("/auth");
				},
			},
		});
	};

	const handleDeleteAccount = async () => {
		if (!password) {
			Alert.alert("Erro", "Por favor, confirme sua senha");
			return;
		}

		setIsDeletingAccount(true);

		await authClient.deleteUser({
			password,
		}, {
			onSuccess: () => {
				Alert.alert("Conta excluída", "Sua conta foi excluída com sucesso");
				setShowDeleteModal(false);
				setPassword("");
				router.replace("/auth");
			},
			onError: (error: any) => {
				Alert.alert("Erro", "Falha ao excluir conta: " + error.message);
			},
			onResponse: (response: any) => {
				setIsDeletingAccount(false);
			},
		});
	};

	const handleSaveName = async () => {
		if (!name.trim()) {
			Alert.alert("Erro", "Nome não pode estar vazio");
			return;
		}

		setIsUpdatingName(true);

		await authClient.updateUser({
			name: name.trim(),
		}, {
			onSuccess: () => {
				setIsEditingName(false);
				Alert.alert("Sucesso", "Nome atualizado com sucesso!");
			},
			onError: (error: any) => {
				Alert.alert("Erro", "Falha ao atualizar nome: " + error.message);
			},
			onResponse: (response: any) => {
				setIsUpdatingName(false);
			},
		});
	};

	const handleCancelEditName = () => {
		setName(session?.user?.name || "");
		setIsEditingName(false);
	};

	const handleSaveEmail = async () => {
		if (!email.trim()) {
			Alert.alert("Erro", "Email não pode estar vazio");
			return;
		}

		setIsUpdatingEmail(true);

		await authClient.changeEmail({
			newEmail: email.trim(),
			callbackURL: "/dashboard", // You can adjust this URL
		}, {
			onSuccess: () => {
				setIsEditingEmail(false);
				Alert.alert("Sucesso", "Email será atualizado após verificação!");
			},
			onError: (error: any) => {
				Alert.alert("Erro", "Falha ao atualizar email: " + error.message);
			},
			onResponse: (response: any) => {
				setIsUpdatingEmail(false);
			},
		});
	};

	const handleCancelEditEmail = () => {
		setEmail(session?.user?.email || "");
		setIsEditingEmail(false);
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
						<View className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between min-h-[80px]">
							<View className="flex-1">
								<Text className="text-sm text-gray-600 mb-1">Nome:</Text>
								{isEditingName ? (
									<TextInput
										value={name}
										onChangeText={setName}
										autoFocus
										className="text-lg text-gray-900 border-b border-gray-300 py-1"
									/>
								) : (
									<Text className="text-lg text-gray-900">
										{session?.user?.name || "{{UserName}}"}
									</Text>
								)}
							</View>
							{isEditingName ? (
								<View className="flex-row items-center ml-2">
									<TouchableOpacity
										onPress={handleSaveName}
										className="p-2"
										disabled={isUpdatingName}
									>
										<HugeiconsIcon
											icon={CheckmarkCircleIcon}
											size={24}
											color={isUpdatingName ? "#9CA3AF" : "green"}
											strokeWidth={1.5}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={handleCancelEditName}
										className="p-2"
										disabled={isUpdatingName}
									>
										<HugeiconsIcon
											icon={Cancel01Icon}
											size={24}
											color={isUpdatingName ? "#9CA3AF" : "red"}
											strokeWidth={1.5}
										/>
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity
									onPress={() => setIsEditingName(true)}
									className="p-2"
								>
									<HugeiconsIcon
										icon={Edit02Icon}
										size={20}
										color="#666"
										strokeWidth={1.5}
									/>
								</TouchableOpacity>
							)}
						</View>

						{/* Email */}
						<View className="bg-gray-50 rounded-xl p-4 mb-4 flex-row items-center justify-between min-h-[80px]">
							<View className="flex-1">
								<Text className="text-sm text-gray-600 mb-1">Email:</Text>
								{isEditingEmail ? (
									<TextInput
										value={email}
										onChangeText={setEmail}
										autoFocus
										className="text-lg text-gray-900 border-b border-gray-300 py-1"
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								) : (
									<Text className="text-lg text-gray-900">
										{session?.user?.email || "{{UserEmail}}"}
									</Text>
								)}
							</View>
							{isEditingEmail ? (
								<View className="flex-row items-center ml-2">
									<TouchableOpacity
										onPress={handleSaveEmail}
										className="p-2"
										disabled={isUpdatingEmail}
									>
										<HugeiconsIcon
											icon={CheckmarkCircleIcon}
											size={24}
											color={isUpdatingEmail ? "#9CA3AF" : "green"}
											strokeWidth={1.5}
										/>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={handleCancelEditEmail}
										className="p-2"
										disabled={isUpdatingEmail}
									>
										<HugeiconsIcon
											icon={Cancel01Icon}
											size={24}
											color={isUpdatingEmail ? "#9CA3AF" : "red"}
											strokeWidth={1.5}
										/>
									</TouchableOpacity>
								</View>
							) : (
								<TouchableOpacity
									onPress={() => setIsEditingEmail(true)}
									className="p-2"
								>
									<HugeiconsIcon
										icon={Edit02Icon}
										size={20}
										color="#666"
										strokeWidth={1.5}
									/>
								</TouchableOpacity>
							)}
						</View>
					</View>

					{/* Ações */}
					<View>
						<Text className="text-xl font-bold text-gray-900 mb-6">Ações</Text>

						{/* Excluir conta */}
						<TouchableOpacity
							onPress={() => setShowDeleteModal(true)}
							className="flex-row items-center p-4 rounded-xl bg-white shadow-sm mb-4"
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
							className="flex-row items-center p-4 rounded-xl bg-white shadow-sm"
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
										icon={showPassword ? ViewOffIcon : ViewIcon}
										size={24}
										color="#9CA3AF"
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
								className={`flex-1 rounded-xl p-4 flex-row items-center justify-center ${isDeletingAccount ? "bg-red-300" : "bg-red-500"
									}`}
								disabled={isDeletingAccount}
							>
								<HugeiconsIcon
									icon={Delete02Icon}
									size={20}
									color="white"
									strokeWidth={1.5}
								/>
								<Text className="text-white text-lg font-medium ml-2">
									{isDeletingAccount ? "Excluindo..." : "Excluir conta"}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</Container>
	);
}
