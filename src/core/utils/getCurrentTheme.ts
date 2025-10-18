import { Appearance } from "react-native";
import { darkTheme, lightTheme } from "@/presentation/themes";

export const getCurrentTheme = () => {
	const colorScheme = Appearance.getColorScheme();

	const theme = colorScheme === "dark" ? darkTheme : lightTheme;

	return theme;
};
