import {
	type RenderOptions,
	render,
	userEvent,
// biome-ignore lint/correctness/noUndeclaredDependencies: Depedência de testes unitários
} from "@testing-library/react-native";
import type { ReactElement, ReactNode } from "react";
import { ThemeProvider } from "@/ui/providers/ThemeProvider";

interface AllTheProvidersProps {
	children: ReactNode;
}

function AllTheProviders({ children }: AllTheProvidersProps) {
	return <ThemeProvider>{children}</ThemeProvider>;
}

function customRender(
	ui: ReactElement,
	options?: Omit<RenderOptions, "wrapper">,
) {
	return {
		user: userEvent.setup(),
		...render(ui, { wrapper: AllTheProviders, ...options }),
	};
}

// biome-ignore lint/correctness/noUndeclaredDependencies: Depedência de testes unitários
export * from "@testing-library/react-native";
export { customRender as render };
