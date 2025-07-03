import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/query";
import {
  Dumbbell01Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SignInProps {
  onSwitchToSignUp: () => void;
}

export function SignIn({ onSwitchToSignUp }: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          setError(error.error?.message || "Falha ao fazer login");
          setIsLoading(false);
        },
        onSuccess: () => {
          setEmail("");
          setPassword("");
          queryClient.refetchQueries();
          router.replace("/");
        },
        onFinished: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-white px-6 py-8">
      {/* Logo Section */}
      <View className="items-center mt-16 mb-12">
        <View className="w-24 h-24 border-2 border-gray-300 rounded-2xl items-center justify-center mb-4">
          <HugeiconsIcon
            icon={Dumbbell01Icon}
            size={48}
            color="#666"
            strokeWidth={1.5}
          />
        </View>
        <Text className="text-gray-400 text-lg font-light tracking-widest">
          FITNESS APP
        </Text>
      </View>

      {/* Title */}
      <Text className="text-3xl font-bold text-gray-900 text-center mb-12">
        Login
      </Text>

      {/* Error Message */}
      {error && (
        <View className="mb-6 p-3 bg-red-50 rounded-md">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      {/* Form */}
      <View className="space-y-6">
        {/* Email Input */}
        <View>
          <TextInput
            className="w-full p-4 text-lg text-gray-900 border-b border-gray-300 bg-transparent"
            placeholder="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        {/* Password Input */}
        <View className="relative">
          <TextInput
            className="w-full p-4 text-lg text-gray-900 border-b border-gray-300 bg-transparent pr-12"
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showPassword}
            autoComplete="current-password"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-4"
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

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={isLoading || !email || !password}
        className={`w-full mt-12 p-4 rounded-lg ${
          isLoading || !email || !password ? "bg-gray-300" : "bg-black"
        }`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white text-lg font-medium text-center">
            Login
          </Text>
        )}
      </TouchableOpacity>

      {/* Switch to Sign Up */}
      <View className="flex-row justify-center items-center mt-8">
        <Text className="text-gray-600 text-base">Não possui conta? </Text>
        <TouchableOpacity onPress={onSwitchToSignUp}>
          <Text className="text-blue-500 text-base font-medium">
            Criar conta →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
