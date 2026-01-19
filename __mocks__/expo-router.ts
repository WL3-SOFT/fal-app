import { useEffect } from "react";

const routerFunctions = {
	push: jest.fn(),
	replace: jest.fn(),
	back: jest.fn(),
	canGoBack: jest.fn(() => true),
	setParams: jest.fn(),
	navigate: jest.fn(),
};

export const useRouter = jest.fn(() => routerFunctions);

export const useLocalSearchParams = jest.fn(() => ({}));

export const useSegments = jest.fn(() => []);

export const usePathname = jest.fn(() => "/");

export const useFocusEffect = jest.fn(
	(callback: () => undefined | (() => void)) => {
		// biome-ignore lint/correctness/useExhaustiveDependencies: mock simplificado
		useEffect(() => {
			return callback();
		}, []);
	},
);

export const Stack = {
	// biome-ignore lint/style/useNamingConvention: Nome da implementação mockada
	Screen: jest.fn(() => null),
};

export const Tabs = {
	// biome-ignore lint/style/useNamingConvention: Nome da implementação mockada
	Screen: jest.fn(() => null),
};

export const Link = jest.fn(() => null);

export const Redirect = jest.fn(() => null);

export const router = routerFunctions;
