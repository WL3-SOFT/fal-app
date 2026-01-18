export const openDatabaseSync = jest.fn(() => ({
	getAllSync: jest.fn(() => []),
	getFirstSync: jest.fn(() => null),
	runSync: jest.fn(() => ({ changes: 0, lastInsertRowId: 0 })),
	execSync: jest.fn(() => []),
	prepareSync: jest.fn(() => ({
		executeSync: jest.fn(() => ({ changes: 0, lastInsertRowId: 0 })),
		finalizeSync: jest.fn(),
	})),
	closeSync: jest.fn(),
}));

// Mock para expo-sqlite/kv-store
export default {
	getItem: jest.fn(() => Promise.resolve(null)),
	setItem: jest.fn(() => Promise.resolve()),
	removeItem: jest.fn(() => Promise.resolve()),
	getAllKeys: jest.fn(() => Promise.resolve([])),
};
