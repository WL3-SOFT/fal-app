import * as Sentry from "@sentry/react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { isRunningInExpoGo } from "expo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StrictMode, useEffect } from "react";
import { ActivityIndicator, Appearance, Text, View } from "react-native";
import { db } from "@/db/client";
import { storage } from "@/infra/modules";
import { AppProviders } from "@/ui/providers";
import migrations from "../../drizzle/migrations";

const isProduction = process.env.NODE_ENV === "production";

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
	const { success, error } = useMigrations(db, migrations);

	useEffect(() => {
		if (error) {
			console.error("❌ Erro na migração:", error);
			Sentry.captureException(error, {
				tags: { context: "database-migration" },
			});
		}

		if (success) {
			console.log("✅ Migrations concluídas com sucesso");
		}
	}, [success, error]);

	useEffect(() => {
		const setThemeMode = async () => {
			const themeMode = await storage.get("themeMode");
			if (themeMode) {
				Appearance.setColorScheme(themeMode);
			}
		};
		setThemeMode();
	}, []);

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

	if (!success) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: "#fff",
				}}>
				<ActivityIndicator
					size="large"
					color="#3b82f6"
				/>
				<Text style={{ marginTop: 16, fontSize: 14, color: "#666" }}>
					Inicializando banco de dados...
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
