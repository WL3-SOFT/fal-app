import * as Sentry from "@sentry/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { isRunningInExpoGo } from "expo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUi from "expo-system-ui";
import { StrictMode, useEffect, useState } from "react";
import { Appearance, Text, View } from "react-native";
import { db } from "@/db/client";
import { storage } from "@/infra/modules";
import { AppProviders } from "@/ui/providers";
import migrations from "../../drizzle/migrations";

const setThemeMode = async () => {
	const themeMode = await storage.get("themeMode");
	if (themeMode) {
		Appearance.setColorScheme(themeMode);
		SystemUi.setBackgroundColorAsync(
			themeMode === "dark" ? "#383838" : "#F5F5F5",
		);
	}
};

const isProduction = process.env.NODE_ENV === "production";

SplashScreen.preventAutoHideAsync();

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
	spotlight: process.env.NODE_ENV === "development",
	enabled: isProduction,
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
	const [isReady, setIsReady] = useState(false);
	const { success, error } = useMigrations(db, migrations);

	useEffect(() => {
		setThemeMode();

		if (error) {
			console.error("❌ Erro na migração:", error);
			Sentry.captureException(error, {
				tags: { context: "database-migration" },
			});
		}

		if (success) {
			console.log("✅ Migrations concluídas com sucesso");
		}

		setIsReady(success);
	}, [success, error]);

	useEffect(() => {
		if (isReady) {
			SplashScreen.hide();
		}
	}, [isReady]);

	if (error) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
					backgroundColor: "#fff",
				}}>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						color: "#ef4444",
						marginBottom: 12,
					}}>
					Erro ao inicializar banco de dados
				</Text>
				<Text
					style={{
						fontSize: 14,
						color: "#666",
						textAlign: "center",
					}}>
					{error.message}
				</Text>
			</View>
		);
	}

	return !isProduction ? (
		<StrictMode>
			<Application />
		</StrictMode>
	) : (
		<Application />
	);
}
export default Sentry.wrap(RootLayout);
