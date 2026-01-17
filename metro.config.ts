import { getSentryExpoConfig } from "@sentry/react-native/metro";
import { getDefaultConfig } from "expo/metro-config";

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
const sentryConfig = getSentryExpoConfig(__dirname);

// Adicionar extensão .sql ANTES de fazer merge
if (defaultConfig?.resolver?.sourceExts) {
	defaultConfig.resolver.sourceExts.push("sql");
}

// Merge correto: sentry config como base, depois default config com .sql
const config = {
	...sentryConfig,
	resolver: {
		...sentryConfig?.resolver,
		...defaultConfig?.resolver,
		sourceExts: [
			...(sentryConfig?.resolver?.sourceExts || []),
			...(defaultConfig?.resolver?.sourceExts || []),
		],
	},
};

module.exports = config;
