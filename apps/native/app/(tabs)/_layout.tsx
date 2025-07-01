import { useColorScheme } from "@/lib/use-color-scheme";
import {
	AiChat02FreeIcons,
	HomeIcon,
	Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Tabs } from "expo-router";

export default function TabLayout() {
	const { isDarkColorScheme } = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#000000",
				tabBarInactiveTintColor: "#9CA3AF",
				tabBarStyle: {
					backgroundColor: "#FFFFFF",
					borderTopColor: "#E5E7EB",
					height: 80,
					paddingBottom: 20,
					paddingTop: 10,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
			}}
		>
			<Tabs.Screen
				name="chat"
				options={{
					title: "Chat",
					tabBarIcon: ({ color, size = 24 }) => (
						<HugeiconsIcon
							icon={AiChat02FreeIcons}
							size={size}
							color={color}
							strokeWidth={1.5}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="index"
				options={{
					title: "Início",
					tabBarIcon: ({ color, size = 24 }) => (
						<HugeiconsIcon
							icon={HomeIcon}
							size={size}
							color={color}
							strokeWidth={1.5}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Configuração",
					tabBarIcon: ({ color, size = 24 }) => (
						<HugeiconsIcon
							icon={Settings02Icon}
							size={size}
							color={color}
							strokeWidth={1.5}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
