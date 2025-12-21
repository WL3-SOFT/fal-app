/** @type {import('jest').Config} */
const config = {
	preset: "jest-expo",
	roots: ["<rootDir>/src"],
	testEnvironment: "allure-jest/node",
	setupFilesAfterEnv: ["<rootDir>/config/test-setup.ts"],
	collectCoverage: false,
	coverageDirectory: "./coverage",
	coverageReporters: ["text"],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
		"./src/ui/": {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50,
		},
		"./src/app/": {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
		"./src/core/": {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
		"./src/infra/": {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
		"./src/services/": {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
		"./src/types/": {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"\\.config\\.(js|ts)$",
		"\\.spec\\.(ts|tsx)$",
		"\\.e2e\\.(ts|tsx)$",
		"<rootDir>/dist/",
		"<rootDir>/build/",
		"<rootDir>/tests/",
		"<rootDir>/vendor/",
		"<rootDir>/third-party/",
		"<rootDir>/android/",
		"<rootDir>/ios/",
		"<rootDir>/docs/",
		"<rootDir>/plugins/",
		"<rootDir>/config/",
	],
	testMatch: ["**/*.spec.ts?(x)"],
	testPathIgnorePatterns: ["/node_modules/", "\\.e2e\\.(ts|tsx)$"],
	watchPathIgnorePatterns: ["node_modules"],
	transformIgnorePatterns: [
		// biome-ignore lint/nursery/noSecrets: Não se trata de uma secret
		"node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)",
	],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"^@app/(.*)$": "<rootDir>/src/app/$1",
		"^@components/(.*)$": "<rootDir>/src/ui/components/$1",
		"^@hooks/(.*)$": "<rootDir>/src/ui/hooks/$1",
		"^@screens/(.*)$": "<rootDir>/src/ui/screens/$1",
		"^@themes/(.*)$": "<rootDir>/src/ui/themes/$1",
		"#test-utils$": "<rootDir>/config/test-utils.tsx",
	},
	fakeTimers: {
		enableGlobally: true,
	},
};

module.exports = config;
