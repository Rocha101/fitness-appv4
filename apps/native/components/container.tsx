import type React from "react";
import { Keyboard, SafeAreaView, TouchableWithoutFeedback } from "react-native";

export const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView className="flex-1 bg-background">{children}</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};
