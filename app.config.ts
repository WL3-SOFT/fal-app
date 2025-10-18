/** biome-ignore-all lint/style/useNamingConvention: Não é necessário impor padrão de nomeclatura no arquivo de configuração */
import "tsx/cjs";
import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "Faça a lista",
	slug: "faca-a-lista",
	owner: "welllucky",
	version: "0.1.0",
	orientation: "portrait",
	icon: "./src/presentation/assets/images/icon.png",
	scheme: "fal",
	userInterfaceStyle: "automatic",
	newArchEnabled: true,
	platforms: ["android"],
	android: {
		adaptiveIcon: {
			backgroundColor: "#E6F4FE",
			foregroundImage:
				"./src/presentation/assets/images/android-icon-foreground.png",
			backgroundImage:
				"./src/presentation/assets/images/android-icon-background.png",
			monochromeImage:
				"./src/presentation/assets/images/android-icon-monochrome.png",
		},
		edgeToEdgeEnabled: true,
		predictiveBackGestureEnabled: false,
		package: "com.l3.facaalista",
		googleServicesFile: "./google-services.json",
	},
	experiments: {
		typedRoutes: true,
		reactCompiler: true,
	},
	extra: {
		router: {},
		eas: {
			projectId: "562d6466-93ac-4829-9a2f-3f4b557c357b",
		},
	},
	plugins: [
		"expo-router",
		[
			"expo-font",
			{
				fonts: ["./src/presentation/assets/fonts/Inter/Inter.ttf"],
				android: {
					fonts: [
						{
							fontFamily: "Inter",
							fontDefinitions: [
								{
									path: "./src/presentation/assets/fonts/Inter/Inter-Italic.ttf",
									weight: 700,
									style: "italic",
								},
								{
									path: "./src/presentation/assets/fonts/Inter/Inter.ttf",
									weight: 700,
								},
							],
						},
					],
				},
				ios: {
					fonts: [
						"./src/presentation/assets/fonts/Inter/Inter.ttf",
						"./src/presentation/assets/fonts/Inter/Inter-Italic.ttf",
					],
				},
			},
		],
		"@react-native-firebase/app",
		"@react-native-firebase/auth",
		"@react-native-firebase/crashlytics",
		"@react-native-firebase/messaging",
		"@react-native-firebase/app-check",
		"@react-native-firebase/app-distribution",
		[
			"expo-splash-screen",
			{
				image: "./src/presentation/assets/images/splash-icon-light.png",
				imageWidth: 200,
				resizeMode: "contain",
				backgroundColor: "#E9F0E4",
				dark: {
					backgroundColor: "#1B4F1B",
					image: "./src/presentation/assets/images/splash-icon-dark.png",
				},
			},
		],
		[
			"expo-camera",
			{
				cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
				microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
				recordAudioAndroid: true,
			},
		],
		[
			"expo-contacts",
			{
				contactsPermission: "Allow $(PRODUCT_NAME) to access your contacts.",
			},
		],
		[
			"expo-dev-client",
			{
				launchMode: "most-recent",
			},
		],
		[
			"expo-location",
			{
				locationAlwaysAndWhenInUsePermission:
					"Allow $(PRODUCT_NAME) to use your location.",
				isAndroidBackgroundLocationEnabled: true,
			},
		],
		[
			"expo-media-library",
			{
				photosPermission: "Allow $(PRODUCT_NAME) to access your photos.",
				savePhotosPermission: "Allow $(PRODUCT_NAME) to save photos.",
				isAccessMediaLocationEnabled: true,
				granularPermissions: ["photo"],
			},
		],
		[
			"@sentry/react-native/expo",
			{
				url: "https://sentry.io/",
				project: "faca-a-lista",
				organization: "wl3",
				experimental_android: {
					enableAndroidGradlePlugin: true,
					autoUploadProguardMapping: true,
					includeProguardMapping: true,
					dexguardEnabled: true,
					uploadNativeSymbols: true,
					autoUploadNativeSymbols: true,
					includeNativeSources: true,
					includeSourceContext: true,
				},
			},
		],
		[
			"expo-secure-store",
			{
				configureAndroidBackup: true,
				faceIDPermission:
					"Allow $(PRODUCT_NAME) to access your Face ID biometric data.",
			},
		],
		[
			"expo-sqlite",
			{
				enableFTS: true,
				useSQLCipher: true,
				android: {
					// Override the shared configuration for Android
					enableFTS: false,
					useSQLCipher: false,
				},
				ios: {
					// You can also override the shared configurations for iOS
					customBuildFlags: [
						"-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1",
					],
				},
			},
		],
	],
});
