import { type ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

const fixAsyncStorageKsp: ConfigPlugin = (config) => {
	return withProjectBuildGradle(config, (config) => {
		const kspVersion = "2.1.20-2.0.1"; // Match the KSP version from Expo SDK 54

		if (!config.modResults.contents.includes("io.realm.kotlin:gradle-plugin")) {
			config.modResults.contents = config.modResults.contents.replace(
				/buildscript\s*\{/,
				`buildscript {
    dependencies {
        classpath("com.google.devtools.ksp:com.google.devtools.ksp.gradle.plugin:${kspVersion}")
    }`,
			);
		}

		return config;
	});
};

export default fixAsyncStorageKsp;
