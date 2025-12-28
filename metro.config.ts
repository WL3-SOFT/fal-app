import { getSentryExpoConfig } from "@sentry/react-native/metro";
import { getDefaultConfig } from "expo/metro-config";

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
const config = getSentryExpoConfig(__dirname);

(defaultConfig?.resolver?.sourceExts as string[]).push("sql");

module.exports = { ...defaultConfig, ...config };
