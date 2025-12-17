import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react-native";
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
	return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from "@testing-library/react-native";
export { customRender as render };
