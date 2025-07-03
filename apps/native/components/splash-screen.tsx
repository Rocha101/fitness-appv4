import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { Container } from "./container";

/**
 * Displays a simple branded splash screen with a loading indicator.
 * Use while waiting for critical async startup tasks (e.g., session load).
 */
export function SplashScreen() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center bg-background">
        {/* App logo */}
        <Image
          source={require("@/assets/logo.png")}
          className="w-36 h-36 mb-6"
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#000" />
      </View>
    </Container>
  );
}
