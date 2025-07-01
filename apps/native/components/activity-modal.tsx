import { ArrowDown01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useState } from "react";
import {
	Modal,
	Pressable,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

interface ActivityModalProps {
	visible: boolean;
	onClose: () => void;
	onSave: (activity: {
		name: string;
		intensity: string;
		duration: string;
	}) => void;
}

export function ActivityModal({
	visible,
	onClose,
	onSave,
}: ActivityModalProps) {
	const [name, setName] = useState("");
	const [intensity, setIntensity] = useState("");
	const [duration, setDuration] = useState("");
	const [showIntensityDropdown, setShowIntensityDropdown] = useState(false);
	const [showDurationDropdown, setShowDurationDropdown] = useState(false);

	const intensityOptions = ["Baixa", "Média", "Alta"];
	const durationOptions = [
		"15 min",
		"30 min",
		"45 min",
		"60 min",
		"90 min",
		"120 min",
	];

	const handleSave = () => {
		if (name && intensity && duration) {
			onSave({ name, intensity, duration });
			// Reset form
			setName("");
			setIntensity("");
			setDuration("");
			setShowIntensityDropdown(false);
			setShowDurationDropdown(false);
		}
	};

	const handleClose = () => {
		setShowIntensityDropdown(false);
		setShowDurationDropdown(false);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<View className="flex-1 bg-black/50 justify-center items-center px-6">
				<View className="bg-white rounded-2xl w-full max-w-md p-6">
					{/* Header */}
					<View className="flex-row justify-between items-center mb-6">
						<Text className="text-xl font-bold text-gray-900">
							Registre sua atividade
						</Text>
						<TouchableOpacity onPress={handleClose}>
							<HugeiconsIcon
								icon={Cancel01Icon}
								size={24}
								color="#666"
								strokeWidth={1.5}
							/>
						</TouchableOpacity>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Nome field */}
						<View className="mb-6">
							<Text className="text-base font-medium text-gray-900 mb-2">
								Nome
							</Text>
							<TextInput
								className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900"
								placeholder="Corrida, natação, musculação..."
								value={name}
								onChangeText={setName}
								placeholderTextColor="#9CA3AF"
							/>
						</View>

						{/* Intensidade field */}
						<View className="mb-6">
							<Text className="text-base font-medium text-gray-900 mb-2">
								Intensidade
							</Text>
							<TouchableOpacity
								onPress={() => {
									setShowIntensityDropdown(!showIntensityDropdown);
									setShowDurationDropdown(false);
								}}
								className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 flex-row justify-between items-center"
							>
								<Text className={intensity ? "text-gray-900" : "text-gray-500"}>
									{intensity || "Escolha uma intensidade"}
								</Text>
								<HugeiconsIcon
									icon={ArrowDown01Icon}
									size={20}
									color="#666"
									strokeWidth={1.5}
								/>
							</TouchableOpacity>

							{showIntensityDropdown && (
								<View className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
									{intensityOptions.map((option) => (
										<TouchableOpacity
											key={option}
											onPress={() => {
												setIntensity(option);
												setShowIntensityDropdown(false);
											}}
											className="p-4 border-b border-gray-100 last:border-b-0"
										>
											<Text className="text-gray-900">{option}</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Duração field */}
						<View className="mb-8">
							<Text className="text-base font-medium text-gray-900 mb-2">
								Duração
							</Text>
							<TouchableOpacity
								onPress={() => {
									setShowDurationDropdown(!showDurationDropdown);
									setShowIntensityDropdown(false);
								}}
								className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200 flex-row justify-between items-center"
							>
								<Text className={duration ? "text-gray-900" : "text-gray-500"}>
									{duration || "Escolha uma duração"}
								</Text>
								<HugeiconsIcon
									icon={ArrowDown01Icon}
									size={20}
									color="#666"
									strokeWidth={1.5}
								/>
							</TouchableOpacity>

							{showDurationDropdown && (
								<View className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
									{durationOptions.map((option) => (
										<TouchableOpacity
											key={option}
											onPress={() => {
												setDuration(option);
												setShowDurationDropdown(false);
											}}
											className="p-4 border-b border-gray-100 last:border-b-0"
										>
											<Text className="text-gray-900">{option}</Text>
										</TouchableOpacity>
									))}
								</View>
							)}
						</View>

						{/* Save button */}
						<TouchableOpacity
							onPress={handleSave}
							disabled={!name || !intensity || !duration}
							className={`w-full p-4 rounded-lg ${
								name && intensity && duration ? "bg-black" : "bg-gray-300"
							}`}
						>
							<Text className="text-white text-lg font-medium text-center">
								Registrar atividade
							</Text>
						</TouchableOpacity>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
