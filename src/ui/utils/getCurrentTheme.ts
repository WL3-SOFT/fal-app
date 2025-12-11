import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "@/ui/theme";

export const getCurrentTheme = () => {
	const colorScheme = Appearance.getColorScheme();

	const theme = colorScheme === "dark" ? darkTheme : lightTheme;

	return theme;
};
