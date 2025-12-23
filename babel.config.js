module.exports = (api) => {
	api.cache(true);
	return {
		presets: ["babel-preset-expo"],
		plugins: [
			[
				"module-resolver",
				{
					root: ["./"],
					alias: {
						"@": "./src",
						"#assets": "./src/ui/assets",
						"@app": "./src/app",
						"@components": "./src/ui/components",
						"@hooks": "./src/ui/hooks",
						"@screens": "./src/ui/screens",
						"@themes": "./src/ui/themes",
						"#test-utils": "./config/test-utils",
					},
					extensions: [
						".js",
						".jsx",
						".ts",
						".tsx",
						".android.js",
						".android.tsx",
						".ios.js",
						".ios.tsx",
					],
				},
			],
			"react-native-reanimated/plugin",
		],
	};
};
