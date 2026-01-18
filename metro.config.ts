import { getSentryExpoConfig } from "@sentry/react-native/metro";
import { getDefaultConfig } from "expo/metro-config";

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
const sentryConfig = getSentryExpoConfig(__dirname);

// Merge correto: sentry config como base, depois default config com .sql
const config = {
	...sentryConfig,
	resolver: {
		...sentryConfig?.resolver,
		...defaultConfig?.resolver,
		sourceExts: [
			...(sentryConfig?.resolver?.sourceExts || []),
			...(defaultConfig?.resolver?.sourceExts || []),
			"sql",
		],
	},
};

module.exports = config;
