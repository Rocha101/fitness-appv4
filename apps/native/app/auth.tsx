import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { useState } from "react";

export default function AuthScreen() {
	const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

	return (
		<Container>
			{authMode === "signin" ? (
				<SignIn onSwitchToSignUp={() => setAuthMode("signup")} />
			) : (
				<SignUp onSwitchToSignIn={() => setAuthMode("signin")} />
			)}
		</Container>
	);
}
