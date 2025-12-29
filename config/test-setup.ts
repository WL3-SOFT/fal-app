/** biome-ignore-all lint/style/useNamingConvention: Padrão utilizado pelo expo/icons*/
/** biome-ignore-all lint/suspicious/noExplicitAny: Permitido por ser utilizado para os testes*/

// ============================================================
// Mock: @expo/vector-icons
// ============================================================
jest.mock("@expo/vector-icons", () => {
	const React = require("react");
	const { Text } = require("react-native");

	const createMockIconComponent = (familyName: string) => {
		return ({ name, testID, ...props }: any) =>
			React.createElement(
				Text,
				{ testID: testID || `icon-${familyName}-${name}`, ...props },
				name,
			);
	};

	return {
		MaterialCommunityIcons: createMockIconComponent("MaterialCommunityIcons"),
		MaterialIcons: createMockIconComponent("MaterialIcons"),
	};
});

// ============================================================
// Mock: expo-sqlite (Database connection)
// ============================================================
jest.mock("expo-sqlite", () => {
	const mockDatabase = {
		// Methods that can be called by Drizzle/Expo SQLite
		execAsync: jest.fn().mockResolvedValue({ rows: [] }),
		runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
		getFirstAsync: jest.fn().mockResolvedValue(null),
		getAllAsync: jest.fn().mockResolvedValue([]),
		withTransactionAsync: jest.fn((callback: any) => callback()),
		closeAsync: jest.fn().mockResolvedValue(undefined),
		deleteAsync: jest.fn().mockResolvedValue(undefined),
	};

	return {
		openDatabaseSync: jest.fn(() => mockDatabase),
		openDatabaseAsync: jest.fn().mockResolvedValue(mockDatabase),
	};
});

// ============================================================
// Mock: drizzle-orm/expo-sqlite (ORM)
// ============================================================
jest.mock("drizzle-orm/expo-sqlite", () => {
	const mockDb = {
		select: jest.fn().mockReturnThis(),
		from: jest.fn().mockReturnThis(),
		where: jest.fn().mockReturnThis(),
		insert: jest.fn().mockReturnThis(),
		values: jest.fn().mockReturnThis(),
		update: jest.fn().mockReturnThis(),
		set: jest.fn().mockReturnThis(),
		delete: jest.fn().mockReturnThis(),
		returning: jest.fn().mockResolvedValue([]),
		execute: jest.fn().mockResolvedValue([]),
		query: {},
	};

	return {
		drizzle: jest.fn(() => mockDb),
	};
});

