import { createContext, type ReactNode, useState } from "react";
import { useColorScheme } from "react-native";
import { darkTheme } from "../themes/dark";
import { lightTheme } from "../themes/light";
import type { Theme } from "../types/themes";

type ThemeMode = "light" | "dark" | "auto";

interface ThemeContextData {
	theme: Theme;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode) => void;
	isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextData>(
	{} as ThemeContextData,
);

interface ThemeProviderProps {
	children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const systemColorScheme = useColorScheme();
	const [themeMode, setThemeMode] = useState<ThemeMode>("auto");

	const isDark =
		themeMode === "auto" ? systemColorScheme === "dark" : themeMode === "dark";

	const theme = isDark ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ theme, themeMode, setThemeMode, isDark }}>
			{children}
		</ThemeContext.Provider>
	);
}
