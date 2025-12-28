import * as Sentry from "@sentry/react-native";
import { isRunningInExpoGo } from "expo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StrictMode, useEffect } from "react";
import { Appearance } from "react-native";
import { storage } from "@/infra/modules";
import { AppProviders } from "@/ui/providers";
import { DbConnection } from "../../config/db-connection";

const isProduction = process.env.NODE_ENV === "production";

const db = new DbConnection();
db.connect();

Sentry.init({
	dsn: process.env["EXPO_PUBLIC_SENTRY_DSN"],
	sendDefaultPii: true,
	enableLogs: true,
	replaysSessionSampleRate: isProduction ? 1 : 0,
	replaysOnErrorSampleRate: isProduction ? 1 : 0,
	sampleRate: isProduction ? 1 : 0,
	integrations: [
		Sentry.mobileReplayIntegration(),
		Sentry.feedbackIntegration(),
		Sentry.reactNavigationIntegration({
			enableTimeToInitialDisplay: isRunningInExpoGo(),
		}),
	],
	tracesSampleRate: isProduction ? 1 : 0,
	profilesSampleRate: isProduction ? 1 : 0,
	enableUserInteractionTracing: true,
	debug: false,
	enableAutoSessionTracking: true,
	enableCaptureFailedRequests: true,
	// uncomment the line below to enable Spotlight (https://spotlightjs.com)
	// biome-ignore lint/correctness/noUndeclaredVariables: __DEV__ é um valor válido do react native
	spotlight: __DEV__,
	enabled: isProduction,
});

SplashScreen.setOptions({
	duration: 1000,
	fade: true,
});

const Application = () => (
	<AppProviders>
		<Stack>
			<Stack.Screen
				name="(tabs)"
				options={{ headerShown: false }}
			/>
		</Stack>
	</AppProviders>
);

function RootLayout() {
	useEffect(() => {
		const setThemeMode = async () => {
			const themeMode = await storage.get("themeMode");
			if (themeMode) {
				Appearance.setColorScheme(themeMode);
			}
		};
		setThemeMode();
	}, []);

	return !isProduction ? (
		<StrictMode>
			<Application />
		</StrictMode>
	) : (
		<Application />
	);
}
export default Sentry.wrap(RootLayout);
