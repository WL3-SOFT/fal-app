export const useRouter = jest.fn(() => ({
	push: jest.fn(),
	replace: jest.fn(),
	back: jest.fn(),
	canGoBack: jest.fn(() => true),
	setParams: jest.fn(),
}));

export const useLocalSearchParams = jest.fn(() => ({}));

export const useSegments = jest.fn(() => []);

export const usePathname = jest.fn(() => "/");

// biome-ignore lint/correctness/noUnusedImports: usado no mock
import { useEffect } from "react";

export const useFocusEffect = jest.fn((callback: () => void | (() => void)) => {
	// Usa useEffect do React para compatibilidade com testes
	// biome-ignore lint/correctness/useExhaustiveDependencies: mock simplificado
	useEffect(() => {
		return callback();
	}, []);
});

export const Stack = {
	Screen: jest.fn(() => null),
};

export const Tabs = {
	Screen: jest.fn(() => null),
};

export const Link = jest.fn(() => null);

export const Redirect = jest.fn(() => null);

export const router = {
	push: jest.fn(),
	replace: jest.fn(),
	back: jest.fn(),
	canGoBack: jest.fn(() => true),
	setParams: jest.fn(),
};
