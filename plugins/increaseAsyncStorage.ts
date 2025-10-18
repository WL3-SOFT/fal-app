/** biome-ignore-all lint/nursery/noSecrets: Não existe secret no arquivo abaixo */
import { type ConfigPlugin, withGradleProperties } from "expo/config-plugins";

const increaseAsyncStorage: ConfigPlugin = (config) => {
	return withGradleProperties(config, (config) => {
		const asyncStorageProperty = config.modResults.find(
			(item) =>
				item.type === "property" && item.key === "AsyncStorage_useNextStorage",
		);

		if (!asyncStorageProperty) {
			config.modResults.push({
				type: "property",
				key: "AsyncStorage_useNextStorage",
				value: "true",
			});
		}

		// Fix KSP version compatibility with Kotlin 2.1.20
		const kspProperty = config.modResults.find(
			(item) =>
				item.type === "property" && item.key === "AsyncStorage_kspVersion",
		);

		if (!kspProperty) {
			config.modResults.push({
				type: "property",
				key: "AsyncStorage_kspVersion",
				value: "2.1.20-2.0.1",
			});
		}

		return config;
	});
};

export default increaseAsyncStorage;
